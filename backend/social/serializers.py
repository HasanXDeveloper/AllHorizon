from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import FriendRequest, Message, Attachment, MutedUser, BlockedUser
import bleach

from allauth.socialaccount.models import SocialAccount

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()
    is_online = serializers.SerializerMethodField()
    is_online_hidden = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()
    bio = serializers.SerializerMethodField()
    banner_color = serializers.SerializerMethodField()
    favorite_game = serializers.SerializerMethodField()
    last_activity = serializers.SerializerMethodField()
    is_muted = serializers.SerializerMethodField()
    is_blocked = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'avatar', 'is_online', 'is_online_hidden', 'unread_count', 'bio', 'banner_color', 'favorite_game', 'date_joined', 'last_activity', 'is_muted', 'is_blocked']

    def get_avatar(self, obj):
        # Try Discord first
        discord_account = SocialAccount.objects.filter(user=obj, provider='discord').first()
        if discord_account:
            return discord_account.get_avatar_url()
        
        # Try Google
        google_account = SocialAccount.objects.filter(user=obj, provider='google').first()
        if google_account:
            return google_account.get_avatar_url()
            
        return None

    def get_is_online(self, obj):
        if hasattr(obj, 'social_profile'):
            if obj.social_profile.is_online_hidden:
                return False
            # Check if last activity was within 5 minutes
            from django.utils import timezone
            import datetime
            if obj.social_profile.last_activity:
                return (timezone.now() - obj.social_profile.last_activity) < datetime.timedelta(minutes=5)
        return False

    def get_is_online_hidden(self, obj):
        if hasattr(obj, 'social_profile'):
            return obj.social_profile.is_online_hidden
        return False

    def get_unread_count(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Message.objects.filter(
                sender=obj,
                receiver=request.user,
                is_read=False
            ).count()
        return 0

    def get_bio(self, obj):
        if hasattr(obj, 'social_profile'):
            # Sanitize bio to prevent XSS
            return bleach.clean(obj.social_profile.bio, tags=[], strip=True)
        return ''

    def get_banner_color(self, obj):
        if hasattr(obj, 'social_profile'):
            return obj.social_profile.banner_color
        return 'purple'

    def get_favorite_game(self, obj):
        if hasattr(obj, 'social_profile'):
            # Sanitize favorite_game to prevent XSS
            return bleach.clean(obj.social_profile.favorite_game, tags=[], strip=True)
        return ''

    def get_last_activity(self, obj):
        if hasattr(obj, 'social_profile') and obj.social_profile.last_activity:
            return obj.social_profile.last_activity
        return None

    def get_is_muted(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return MutedUser.objects.filter(muter=request.user, muted=obj).exists()
        return False

    def get_is_blocked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return BlockedUser.objects.filter(blocker=request.user, blocked=obj).exists()
        return False

class FriendRequestSerializer(serializers.ModelSerializer):
    from_user = UserSerializer(read_only=True)
    to_user = UserSerializer(read_only=True)
    to_user_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = FriendRequest
        fields = ['id', 'from_user', 'to_user', 'to_user_id', 'status', 'created_at']
        read_only_fields = ['from_user', 'status', 'created_at']

    def create(self, validated_data):
        to_user_id = validated_data.pop('to_user_id')
        to_user = User.objects.get(id=to_user_id)
        from_user = self.context['request'].user
        
        if FriendRequest.objects.filter(from_user=from_user, to_user=to_user).exists():
            raise serializers.ValidationError("Friend request already sent.")
        
        if FriendRequest.objects.filter(from_user=to_user, to_user=from_user).exists():
             raise serializers.ValidationError("Friend request already received from this user.")

        return FriendRequest.objects.create(from_user=from_user, to_user=to_user, **validated_data)

class AttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attachment
        fields = ['id', 'file', 'uploaded_at']

class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    receiver = UserSerializer(read_only=True)
    receiver_id = serializers.IntegerField(write_only=True)
    reply_to_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    forwarded_from_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    reply_to = serializers.SerializerMethodField()
    attachments = AttachmentSerializer(many=True, read_only=True)
    uploaded_files = serializers.ListField(
        child=serializers.FileField(max_length=100000, allow_empty_file=False, use_url=False),
        write_only=True,
        required=False
    )

    class Meta:
        model = Message
        fields = ['id', 'sender', 'receiver', 'receiver_id', 'content', 'timestamp', 'is_read', 'attachments', 'uploaded_files', 'reply_to', 'reply_to_id', 'forwarded_from', 'forwarded_from_id']
        read_only_fields = ['sender', 'timestamp', 'is_read', 'forwarded_from']

    def get_reply_to(self, obj):
        if obj.reply_to:
            return {
                'id': obj.reply_to.id,
                'sender': UserSerializer(obj.reply_to.sender).data,
                'content': obj.reply_to.content,
                'timestamp': obj.reply_to.timestamp
            }
        return None

    def validate_uploaded_files(self, value):
        limit = 15 * 1024 * 1024  # 15 MB
        for file in value:
            if file.size > limit:
                raise serializers.ValidationError(f"File {file.name} is too large. Size should not exceed 15 MiB.")
        return value

    def validate_receiver_id(self, value):
        if not User.objects.filter(id=value).exists():
            raise serializers.ValidationError("User not found.")
        return value

    def create(self, validated_data):
        uploaded_files = validated_data.pop('uploaded_files', [])
        receiver_id = validated_data.pop('receiver_id')
        reply_to_id = validated_data.pop('reply_to_id', None)
        forwarded_from_id = validated_data.pop('forwarded_from_id', None)
        receiver = User.objects.get(id=receiver_id)
        
        # sender is passed by perform_create via save(sender=...), so it's in validated_data
        sender = validated_data.pop('sender', self.context['request'].user)

        reply_to = None
        if reply_to_id:
            try:
                reply_to = Message.objects.get(id=reply_to_id)
            except Message.DoesNotExist:
                pass

        forwarded_from = None
        if forwarded_from_id:
            try:
                forwarded_from = User.objects.get(id=forwarded_from_id)
            except User.DoesNotExist:
                pass

        message = Message.objects.create(
            sender=sender, 
            receiver=receiver, 
            reply_to=reply_to, 
            forwarded_from=forwarded_from,
            **validated_data
        )

        for file in uploaded_files:
            Attachment.objects.create(message=message, file=file)

        return message
