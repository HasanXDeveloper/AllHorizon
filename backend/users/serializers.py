from dj_rest_auth.serializers import UserDetailsSerializer
from allauth.socialaccount.models import SocialAccount
from rest_framework import serializers

class CustomUserDetailsSerializer(UserDetailsSerializer):
    avatar = serializers.SerializerMethodField()
    social_accounts = serializers.SerializerMethodField()

    class Meta(UserDetailsSerializer.Meta):
        fields = UserDetailsSerializer.Meta.fields + ('avatar', 'social_accounts')

    def get_avatar(self, obj):
        discord_account = SocialAccount.objects.filter(user=obj, provider='discord').first()
        if discord_account:
            return discord_account.get_avatar_url()
        
        google_account = SocialAccount.objects.filter(user=obj, provider='google').first()
        if google_account:
            return google_account.get_avatar_url()
        
        social_account = SocialAccount.objects.filter(user=obj).first()
        if social_account:
            return social_account.get_avatar_url()
        
        return None

    def get_social_accounts(self, obj):
        return list(SocialAccount.objects.filter(user=obj).values_list('provider', flat=True))
