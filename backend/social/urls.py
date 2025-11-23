from django.urls import path
from .views import (
    UserSearchView, FriendRequestListView, FriendRequestDetailView,
    FriendListView, MessageListView, MessageDetailView, BlockUserView, ClearChatView, 
    BlockedUsersListView, UpdateProfileSettingsView, RemoveFriendView, CurrentUserView,
    MuteUserView, UnmuteUserView
)

urlpatterns = [
    path('users/search/', UserSearchView.as_view(), name='user-search'),
    path('friends/requests/', FriendRequestListView.as_view(), name='friend-request-list'),
    path('friends/requests/<int:pk>/', FriendRequestDetailView.as_view(), name='friend-request-detail'),
    path('friends/', FriendListView.as_view(), name='friend-list'),
    path('messages/', MessageListView.as_view(), name='message-list'),
    path('messages/<int:pk>/', MessageDetailView.as_view(), name='message-detail'),
    path('users/<int:user_id>/block/', BlockUserView.as_view(), name='block-user'),
    path('users/<int:user_id>/clear-chat/', ClearChatView.as_view(), name='clear-chat'),
    path('users/<int:user_id>/remove-friend/', RemoveFriendView.as_view(), name='remove-friend'),
    path('blocked/', BlockedUsersListView.as_view(), name='blocked-users'),
    path('me/', CurrentUserView.as_view(), name='current-user'),
    path('profile/settings/', UpdateProfileSettingsView.as_view(), name='profile-settings'),
    path('users/<int:user_id>/mute/', MuteUserView.as_view(), name='mute-user'),
    path('users/<int:user_id>/unmute/', UnmuteUserView.as_view(), name='unmute-user'),
]
