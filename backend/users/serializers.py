from dj_rest_auth.serializers import UserDetailsSerializer
from allauth.socialaccount.models import SocialAccount
from rest_framework import serializers

class CustomUserDetailsSerializer(UserDetailsSerializer):
    avatar = serializers.SerializerMethodField()
    social_accounts = serializers.SerializerMethodField()
    is_online_hidden = serializers.BooleanField(source='social_profile.is_online_hidden', read_only=False)

    class Meta(UserDetailsSerializer.Meta):
        fields = UserDetailsSerializer.Meta.fields + ('id', 'avatar', 'social_accounts', 'is_online_hidden')

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('social_profile', {})
        is_online_hidden = profile_data.get('is_online_hidden')

        if is_online_hidden is not None:
            instance.social_profile.is_online_hidden = is_online_hidden
            instance.social_profile.save()
            
        return super().update(instance, validated_data)

    def get_avatar(self, obj):
        discord_account = SocialAccount.objects.filter(user=obj, provider='discord').first()
        if discord_account:
            # print(f"DEBUG: Discord extra_data for {obj.username}: {discord_account.extra_data}")
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
