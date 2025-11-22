from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from .models import BlockedUser

User = get_user_model()

class BlockUserTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(username='user1', password='password123', email='user1@example.com')
        self.user2 = User.objects.create_user(username='user2', password='password123', email='user2@example.com')
        self.client.force_authenticate(user=self.user1)

    def test_block_user(self):
        url = f'/api/social/users/{self.user2.id}/block/'
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(BlockedUser.objects.filter(blocker=self.user1, blocked=self.user2).exists())

    def test_unblock_user(self):
        # First block
        BlockedUser.objects.create(blocker=self.user1, blocked=self.user2)
        
        # Then unblock
        url = f'/api/social/users/{self.user2.id}/block/'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(BlockedUser.objects.filter(blocker=self.user1, blocked=self.user2).exists())

    def test_unblock_non_existent_block(self):
        url = f'/api/social/users/{self.user2.id}/block/'
        response = self.client.delete(url)
        # Should probably return 200 or 404 depending on implementation, 
        # currently implementation returns 200 "unblocked" even if not blocked (filter().delete() is no-op)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
