from django.utils import timezone
from social.models import SocialProfile

class UpdateLastActivityMiddleware:
    """
    Middleware to automatically update user's last_activity on each request
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Update last activity before processing the request
        if request.user.is_authenticated:
            try:
                profile, created = SocialProfile.objects.get_or_create(user=request.user)
                # auto_now=True will automatically update the timestamp
                profile.save(update_fields=['last_activity'])
            except Exception:
                # Silently fail to avoid breaking requests
                pass

        response = self.get_response(request)
        return response
