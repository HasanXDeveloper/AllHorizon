from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .models import SocialProfile

User = get_user_model()

@receiver(post_save, sender=User)
def create_social_profile(sender, instance, created, **kwargs):
    if created:
        SocialProfile.objects.get_or_create(user=instance)
    else:
        # Ensure profile exists for existing users
        if not hasattr(instance, 'social_profile'):
            SocialProfile.objects.get_or_create(user=instance)
