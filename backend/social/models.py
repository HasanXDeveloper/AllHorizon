from django.db import models
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
import mimetypes
import os

User = get_user_model()

class SocialProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='social_profile')
    is_online_hidden = models.BooleanField(default=False)
    allow_friend_requests = models.BooleanField(default=True)
    last_activity = models.DateTimeField(auto_now=True)
    bio = models.TextField(max_length=500, blank=True, default='')
    banner_color = models.CharField(max_length=20, default='purple')
    favorite_game = models.CharField(max_length=100, blank=True, default='')

    def __str__(self):
        return f"{self.user.username}'s Profile"

class BlockedUser(models.Model):
    blocker = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blocking')
    blocked = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blocked_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('blocker', 'blocked')

    def __str__(self):
        return f"{self.blocker.username} blocked {self.blocked.username}"

class MutedUser(models.Model):
    muter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='muting')
    muted = models.ForeignKey(User, on_delete=models.CASCADE, related_name='muted_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('muter', 'muted')

    def __str__(self):
        return f"{self.muter.username} muted {self.muted.username}"

class FriendRequest(models.Model):
    from_user = models.ForeignKey(User, related_name='friend_requests_sent', on_delete=models.CASCADE)
    to_user = models.ForeignKey(User, related_name='friend_requests_received', on_delete=models.CASCADE)
    status = models.CharField(
        max_length=20,
        choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('rejected', 'Rejected')],
        default='pending'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('from_user', 'to_user')

    def __str__(self):
        return f"{self.from_user} -> {self.to_user} ({self.status})"

class Message(models.Model):
    sender = models.ForeignKey(User, related_name='sent_messages', on_delete=models.CASCADE)
    receiver = models.ForeignKey(User, related_name='received_messages', on_delete=models.CASCADE)
    content = models.CharField(max_length=1000, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    reply_to = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL, related_name='replies')
    forwarded_from = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='forwarded_messages')

    def __str__(self):
        return f"From {self.sender} to {self.receiver} at {self.timestamp}"

def validate_file_size(value):
    limit = 15 * 1024 * 1024  # 15 MB
    if value.size > limit:
        raise ValidationError('File too large. Size should not exceed 15 MiB.')

def validate_file_type(value):
    """Validate file type and extension for security"""
    # Allowed MIME types
    allowed_mime_types = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'video/mp4', 'video/webm', 'video/quicktime',
        'application/pdf',
        'text/plain',
    ]
    
    # Allowed extensions
    allowed_extensions = [
        '.jpg', '.jpeg', '.png', '.gif', '.webp',
        '.mp4', '.webm', '.mov',
        '.pdf', '.txt'
    ]
    
    # Dangerous extensions to explicitly block
    dangerous_extensions = [
        '.exe', '.bat', '.cmd', '.sh', '.ps1', '.vbs', '.js', '.jar',
        '.app', '.deb', '.rpm', '.dmg', '.pkg', '.msi', '.scr', '.com',
        '.pif', '.application', '.gadget', '.cpl', '.dll', '.so'
    ]
    
    # Get file extension
    ext = os.path.splitext(value.name)[1].lower()
    
    # Block dangerous extensions
    if ext in dangerous_extensions:
        raise ValidationError(f'File type {ext} is not allowed for security reasons.')
    
    # Check if extension is in whitelist
    if ext not in allowed_extensions:
        raise ValidationError(f'File type {ext} is not allowed. Allowed types: {", ".join(allowed_extensions)}')
    
    # Validate MIME type
    mime_type, _ = mimetypes.guess_type(value.name)
    if mime_type not in allowed_mime_types:
        raise ValidationError(f'Invalid file type. Allowed types: images, videos, PDF, and text files.')

class Attachment(models.Model):
    message = models.ForeignKey(Message, related_name='attachments', on_delete=models.CASCADE)
    file = models.FileField(upload_to='chat_attachments/', validators=[validate_file_size, validate_file_type])
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Attachment for message {self.message.id}"
