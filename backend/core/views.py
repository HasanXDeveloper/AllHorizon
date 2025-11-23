from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.http import require_http_methods

@require_http_methods(["GET"])
def get_csrf_token(request):
    """
    View to get CSRF token for the frontend
    """
    csrf_token = get_token(request)
    return JsonResponse({'csrfToken': csrf_token})
