from rest_framework import serializers
from .models import Wallet, Transaction

class WalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wallet
        fields = ['balance', 'updated_at']

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'amount', 'transaction_type', 'description', 'created_at']

class TransferSerializer(serializers.Serializer):
    to_discord_id = serializers.CharField(max_length=100, required=False)
    to_username = serializers.CharField(max_length=150, required=False)
    amount = serializers.IntegerField(min_value=1)

    def validate(self, data):
        if not data.get('to_discord_id') and not data.get('to_username'):
            raise serializers.ValidationError("Either to_discord_id or to_username must be provided.")
        return data
