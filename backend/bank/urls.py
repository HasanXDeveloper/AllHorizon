from django.urls import path
from . import views

urlpatterns = [
    # Web API
    path('balance/', views.WalletView.as_view(), name='bank-balance'),
    path('transactions/', views.TransactionListView.as_view(), name='bank-transactions'),
    path('transfer/', views.TransferView.as_view(), name='bank-transfer'),

    # Minecraft API
    path('mc/user/<str:uuid>/', views.MCUserCheckView.as_view(), name='mc-user-check'),
    path('mc/balance/<str:discord_id>/', views.MCBalanceView.as_view(), name='mc-balance'),
    path('mc/deposit/', views.MCDepositView.as_view(), name='mc-deposit'),
    path('mc/withdraw/', views.MCWithdrawView.as_view(), name='mc-withdraw'),
    path('mc/transfer/', views.MCTransferView.as_view(), name='mc-transfer'),
]
