from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from allauth.account.adapter import DefaultAccountAdapter
from allauth.socialaccount.models import SocialAccount
from .validators import UsernameValidator
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model

class CustomAccountAdapter(DefaultAccountAdapter):
    def clean_username(self, username, shallow=False):
        # Default validation from allauth
        username = super().clean_username(username, shallow)
        # Custom validation (min length, allowed chars)
        validator = UsernameValidator()
        validator(username)
        return username

    def clean_email(self, email, **kwargs):
        # Default validation (format etc.)
        email = super().clean_email(email, **kwargs)
        User = get_user_model()
        if User.objects.filter(email__iexact=email).exists():
            raise ValidationError('Пользователь с таким email уже зарегистрирован')
        return email

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
