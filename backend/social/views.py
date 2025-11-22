from rest_framework import generics, status, permissions, views
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.db.models import Q
from .models import FriendRequest, Message, SocialProfile
from .serializers import UserSerializer, FriendRequestSerializer, MessageSerializer

User = get_user_model()

class UserSearchView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        query = self.request.query_params.get('q', '')
        if len(query) < 3:
            return User.objects.none()
        return User.objects.filter(username__icontains=query).exclude(id=self.request.user.id)

class FriendRequestListView(generics.ListCreateAPIView):
    serializer_class = FriendRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return FriendRequest.objects.filter(
            Q(from_user=self.request.user) | Q(to_user=self.request.user)
        ).order_by('-created_at')

    def create(self, request, *args, **kwargs):
        to_user_id = request.data.get('to_user_id')
        if to_user_id:
            try:
                to_user = User.objects.get(id=to_user_id)
                profile, _ = SocialProfile.objects.get_or_create(user=to_user)
                if not profile.allow_friend_requests:
                    return Response(
                        {"error": "Этот пользователь запретил отправку заявок в друзья"}, 
                        status=status.HTTP_403_FORBIDDEN
                    )
            except User.DoesNotExist:
                pass 
        return super().create(request, *args, **kwargs)

class FriendRequestDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = FriendRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = FriendRequest.objects.all()

    def update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            if instance.to_user != request.user:
                return Response({"error": "You can only respond to requests sent to you."}, status=status.HTTP_403_FORBIDDEN)
            
            status_update = request.data.get('status')

            if status_update not in ['accepted', 'rejected']:
                return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)
            
            instance.status = status_update
            instance.save()
            return Response(self.get_serializer(instance).data)
        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class FriendListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Get all accepted friend requests involving the user
        friend_requests = FriendRequest.objects.filter(
            (Q(from_user=user) | Q(to_user=user)) & Q(status='accepted')
        )
        
        friend_ids = set()
        for req in friend_requests:
            if req.from_user == user:
                friend_ids.add(req.to_user.id)
            else:
                friend_ids.add(req.from_user.id)
                
        return User.objects.filter(id__in=friend_ids)

class MessageListView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        other_user_id = self.request.query_params.get('user_id')
        
        if other_user_id:
            # Mark messages as read when fetching conversation
            Message.objects.filter(sender_id=other_user_id, receiver=user, is_read=False).update(is_read=True)

            return Message.objects.filter(
                (Q(sender=user) & Q(receiver_id=other_user_id)) |
                (Q(sender_id=other_user_id) & Q(receiver=user))
            ).order_by('timestamp')
        
        # For recent chats list (simplified)
        return Message.objects.filter(
            Q(sender=user) | Q(receiver=user)
        ).order_by('-timestamp')

class MessageDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Message.objects.all()

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.sender != request.user:
             return Response({"error": "You can only delete your own messages"}, status=status.HTTP_403_FORBIDDEN)
        return super().delete(request, *args, **kwargs)

class BlockUserView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, user_id):
        try:
            user_to_block = User.objects.get(id=user_id)
            if user_to_block == request.user:
                 return Response({"error": "Cannot block yourself"}, status=status.HTTP_400_BAD_REQUEST)
            
            from .models import BlockedUser
            BlockedUser.objects.get_or_create(blocker=request.user, blocked=user_to_block)

            return Response({"status": "blocked"})
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, user_id):
        try:
            from .models import BlockedUser
            BlockedUser.objects.filter(blocker=request.user, blocked_id=user_id).delete()
            return Response({"status": "unblocked"})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class BlockedUsersListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        from .models import BlockedUser
        blocked = BlockedUser.objects.filter(blocker=request.user).select_related('blocked')
        data = [{"id": b.id, "blocked": UserSerializer(b.blocked).data} for b in blocked]
        return Response(data)

class ClearChatView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, user_id):
        # Delete messages where (sender=me AND receiver=them) OR (sender=them AND receiver=me)
        Message.objects.filter(
            (Q(sender=request.user) & Q(receiver_id=user_id)) |
            (Q(sender_id=user_id) & Q(receiver=request.user))
        ).delete()
        return Response({"status": "cleared"})

class UpdateProfileSettingsView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        from .models import SocialProfile
        profile, _ = SocialProfile.objects.get_or_create(user=request.user)
        return Response({
            "is_online_hidden": profile.is_online_hidden,
            "allow_friend_requests": profile.allow_friend_requests
        })

    def post(self, request):
        from .models import SocialProfile
        profile, created = SocialProfile.objects.get_or_create(user=request.user)
        
        if 'is_online_hidden' in request.data:
            profile.is_online_hidden = request.data['is_online_hidden']
        
        if 'allow_friend_requests' in request.data:
            profile.allow_friend_requests = request.data['allow_friend_requests']
            
        profile.save()
        
        return Response({
            "is_online_hidden": profile.is_online_hidden,
            "allow_friend_requests": profile.allow_friend_requests,
            "status": "updated"
        })

class RemoveFriendView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def delete(self, request, user_id):
        try:
            # Delete friend requests between users
            deleted_count = FriendRequest.objects.filter(
                Q(from_user=request.user, to_user_id=user_id, status='accepted') | 
                Q(from_user_id=user_id, to_user=request.user, status='accepted')
            ).delete()[0]
            
            if deleted_count > 0:
                return Response({"status": "removed"})
            else:
                return Response({"error": "Not friends"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
