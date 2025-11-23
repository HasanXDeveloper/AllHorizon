from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import FriendRequest, Message, Attachment
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

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'avatar', 'is_online', 'is_online_hidden', 'unread_count', 'bio', 'banner_color', 'favorite_game', 'date_joined']

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
