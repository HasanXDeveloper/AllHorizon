from django.db import models
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _

User = get_user_model()

class Wallet(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='wallet')
    balance = models.IntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s Wallet ({self.balance})"

class Transaction(models.Model):
    class TransactionType(models.TextChoices):
        DEPOSIT = 'DEPOSIT', _('Deposit')
        WITHDRAW = 'WITHDRAW', _('Withdraw')
        TRANSFER = 'TRANSFER', _('Transfer')

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    amount = models.IntegerField()
    transaction_type = models.CharField(max_length=10, choices=TransactionType.choices)
    description = models.TextField(blank=True, null=True) # JSON or text
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.transaction_type} - {self.amount} - {self.user.username}"
