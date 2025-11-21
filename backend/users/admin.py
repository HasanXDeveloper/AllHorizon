from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from allauth.socialaccount.models import SocialAccount

@admin.action(description='Забанить выбранных пользователей')
def ban_users(modeladmin, request, queryset):
    queryset.update(is_active=False)

@admin.action(description='Разбанить выбранных пользователей')
def unban_users(modeladmin, request, queryset):
    queryset.update(is_active=True)

class SocialAccountInline(admin.TabularInline):
    model = SocialAccount
    extra = 0
    readonly_fields = ('provider', 'uid', 'extra_data')
    can_delete = False
    
    def has_add_permission(self, request, obj=None):
        return False

class CustomUserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_active', 'is_staff', 'get_social_accounts')
    list_filter = ('is_active', 'is_staff', 'is_superuser', 'date_joined')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering = ('-date_joined',)
    actions = [ban_users, unban_users]
    inlines = [SocialAccountInline]
    
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Личная информация', {'fields': ('first_name', 'last_name', 'email')}),
        ('Права доступа', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        ('Важные даты', {'fields': ('last_login', 'date_joined')}),
    )
    
    def get_social_accounts(self, obj):
        accounts = SocialAccount.objects.filter(user=obj)
        if accounts:
            return ', '.join([acc.provider.upper() for acc in accounts])
        return 'Нет'
    get_social_accounts.short_description = 'Социальные аккаунты'

admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)
