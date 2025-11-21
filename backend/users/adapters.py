from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from allauth.socialaccount.models import SocialAccount

class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):
    def pre_social_login(self, request, sociallogin):
        if sociallogin.is_existing:
            user = sociallogin.user
            
            if sociallogin.account.provider == 'discord':
                discord_data = sociallogin.account.extra_data
                if 'username' in discord_data:
                    user.username = discord_data['username']
                
                if 'email' in discord_data and discord_data['email']:
                    user.email = discord_data['email']
                
                user.save()
    
    def populate_user(self, request, sociallogin, data):
        user = super().populate_user(request, sociallogin, data)
        
        if sociallogin.account.provider == 'discord':
            discord_data = sociallogin.account.extra_data
            
            if 'username' in discord_data:
                user.username = discord_data['username']
            
            if 'email' in discord_data and discord_data['email']:
                user.email = discord_data['email']
        
        return user
