import re
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

class UsernameValidator:
    """
    Валидатор для username:
    - Минимум 3 символа
    - Только английские буквы, цифры, дефис и подчеркивание
    """
    
    def __call__(self, value):
        if len(value) < 3:
            raise ValidationError(
                'Имя пользователя должно содержать минимум 3 символа',
                code='username_too_short'
            )
        
        if not re.match(r'^[a-zA-Z0-9_-]+$', value):
            raise ValidationError(
                'Имя пользователя может содержать только английские буквы, цифры, дефис и подчеркивание',
                code='username_invalid_chars'
            )
