import os
import django
import sys


sys.path.append(os.getcwd())

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
from allauth.socialaccount.models import SocialAccount

User = get_user_model()

print("Starting user cleanup...")


users_to_delete = []
all_users = User.objects.all()

print(f"Total users in database: {all_users.count()}")

for user in all_users:
    
    if user.is_superuser or user.is_staff:
        continue
        
    
    if not SocialAccount.objects.filter(user=user).exists():
        users_to_delete.append(user)

print(f"Found {len(users_to_delete)} users registered via email (no social account).")

if len(users_to_delete) > 0:
    for user in users_to_delete:
        print(f"Deleting user: {user.username} ({user.email})")
        user.delete()
    print("Deletion complete.")
else:
    print("No users to delete.")
