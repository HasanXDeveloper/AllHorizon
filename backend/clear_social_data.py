import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from social.models import Message, FriendRequest

print("Clearing messages...")
Message.objects.all().delete()
print("Messages cleared.")

print("Clearing friend requests...")
FriendRequest.objects.all().delete()
print("Friend requests cleared.")
