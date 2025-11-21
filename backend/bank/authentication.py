from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.conf import settings

class MCKeyAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return None

        try:
            prefix, key = auth_header.split()
            if prefix != 'Bearer':
                return None
        except ValueError:
            return None

        if key != settings.MC_API_KEY:
            raise AuthenticationFailed('Invalid API Key')

        return (None, None) # No user, just authenticated
