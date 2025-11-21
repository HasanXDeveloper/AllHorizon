from rest_framework import generics, status, views, permissions
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from django.db import transaction
from .models import Wallet, Transaction
from .serializers import WalletSerializer, TransactionSerializer, TransferSerializer
from .authentication import MCKeyAuthentication
from allauth.socialaccount.models import SocialAccount

User = get_user_model()

class IsDiscordLinked(permissions.BasePermission):
    message = 'Discord account not linked.'

    def has_permission(self, request, view):
        return SocialAccount.objects.filter(user=request.user, provider='discord').exists()

class WalletView(generics.RetrieveAPIView):
    serializer_class = WalletSerializer
    permission_classes = [permissions.IsAuthenticated, IsDiscordLinked]

    def get_object(self):
        wallet, _ = Wallet.objects.get_or_create(user=self.request.user)
        return wallet

class TransactionListView(generics.ListAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated, IsDiscordLinked]

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user).order_by('-created_at')

class TransferView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, IsDiscordLinked]

    def post(self, request):
        serializer = TransferSerializer(data=request.data)
        if serializer.is_valid():
            amount = serializer.validated_data['amount']
            to_discord_id = serializer.validated_data.get('to_discord_id')
            to_username = serializer.validated_data.get('to_username')

            sender_wallet, _ = Wallet.objects.get_or_create(user=request.user)
            if sender_wallet.balance < amount:
                return Response({"error": "Insufficient funds"}, status=status.HTTP_400_BAD_REQUEST)

            target_user = None
            if to_discord_id:
                try:
                    social_account = SocialAccount.objects.get(provider='discord', uid=to_discord_id)
                    target_user = social_account.user
                except SocialAccount.DoesNotExist:
                    return Response({"error": "User with this Discord ID not found"}, status=status.HTTP_404_NOT_FOUND)
            elif to_username:
                try:
                    target_user = User.objects.get(username=to_username)
                except User.DoesNotExist:
                    return Response({"error": "User with this username not found"}, status=status.HTTP_404_NOT_FOUND)

            if target_user == request.user:
                return Response({"error": "Cannot transfer to yourself"}, status=status.HTTP_400_BAD_REQUEST)

            receiver_wallet, _ = Wallet.objects.get_or_create(user=target_user)

            with transaction.atomic():
                sender_wallet.balance -= amount
                sender_wallet.save()
                
                receiver_wallet.balance += amount
                receiver_wallet.save()

                Transaction.objects.create(
                    user=request.user,
                    amount=-amount,
                    transaction_type=Transaction.TransactionType.TRANSFER,
                    description=f"Transfer to {target_user.username}"
                )
                Transaction.objects.create(
                    user=target_user,
                    amount=amount,
                    transaction_type=Transaction.TransactionType.TRANSFER,
                    description=f"Transfer from {request.user.username}"
                )

            return Response({"status": "success", "new_balance": sender_wallet.balance})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MCUserCheckView(views.APIView):
    authentication_classes = [MCKeyAuthentication]
    permission_classes = []

    def get(self, request, uuid):
        discord_id = request.query_params.get('discord_id')
        if discord_id:
            exists = SocialAccount.objects.filter(provider='discord', uid=discord_id).exists()
            return Response({"discord_id": discord_id, "exists": exists})
        
        return Response({"error": "discord_id param required"}, status=status.HTTP_400_BAD_REQUEST)

class MCBalanceView(views.APIView):
    authentication_classes = [MCKeyAuthentication]
    permission_classes = []

    def get(self, request, discord_id):
        try:
            social_account = SocialAccount.objects.get(provider='discord', uid=discord_id)
            wallet, _ = Wallet.objects.get_or_create(user=social_account.user)
            return Response({"discord_id": discord_id, "balance": wallet.balance})
        except SocialAccount.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

class MCDepositView(views.APIView):
    authentication_classes = [MCKeyAuthentication]
    permission_classes = []

    def post(self, request):
        discord_id = request.data.get('discord_id')
        amount = request.data.get('amount')

        if not discord_id or amount is None:
            return Response({"error": "discord_id and amount required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            social_account = SocialAccount.objects.get(provider='discord', uid=discord_id)
            wallet, _ = Wallet.objects.get_or_create(user=social_account.user)
            
            with transaction.atomic():
                wallet.balance += int(amount)
                wallet.save()
                Transaction.objects.create(
                    user=social_account.user,
                    amount=int(amount),
                    transaction_type=Transaction.TransactionType.DEPOSIT,
                    description="Deposit from Minecraft"
                )
            
            return Response({"status": "ok", "new_balance": wallet.balance})
        except SocialAccount.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

class MCWithdrawView(views.APIView):
    authentication_classes = [MCKeyAuthentication]
    permission_classes = []

    def post(self, request):
        discord_id = request.data.get('discord_id')
        amount = request.data.get('amount')

        if not discord_id or amount is None:
            return Response({"error": "discord_id and amount required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            social_account = SocialAccount.objects.get(provider='discord', uid=discord_id)
            wallet, _ = Wallet.objects.get_or_create(user=social_account.user)
            
            amount = int(amount)
            if wallet.balance < amount:
                return Response({"error": "Insufficient funds"}, status=status.HTTP_400_BAD_REQUEST)

            with transaction.atomic():
                wallet.balance -= amount
                wallet.save()
                Transaction.objects.create(
                    user=social_account.user,
                    amount=-amount,
                    transaction_type=Transaction.TransactionType.WITHDRAW,
                    description="Withdraw to Minecraft"
                )
            
            return Response({"status": "ok", "new_balance": wallet.balance})
        except SocialAccount.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

class MCTransferView(views.APIView):
    authentication_classes = [MCKeyAuthentication]
    permission_classes = []

    def post(self, request):
        from_discord_id = request.data.get('from_discord_id')
        to_discord_id = request.data.get('to_discord_id')
        amount = request.data.get('amount')

        if not from_discord_id or not to_discord_id or amount is None:
            return Response({"error": "from_discord_id, to_discord_id and amount required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            sender_sa = SocialAccount.objects.get(provider='discord', uid=from_discord_id)
            receiver_sa = SocialAccount.objects.get(provider='discord', uid=to_discord_id)
            
            sender_wallet, _ = Wallet.objects.get_or_create(user=sender_sa.user)
            receiver_wallet, _ = Wallet.objects.get_or_create(user=receiver_sa.user)
            
            amount = int(amount)
            if sender_wallet.balance < amount:
                return Response({"error": "Insufficient funds"}, status=status.HTTP_400_BAD_REQUEST)

            with transaction.atomic():
                sender_wallet.balance -= amount
                sender_wallet.save()
                
                receiver_wallet.balance += amount
                receiver_wallet.save()

                Transaction.objects.create(
                    user=sender_sa.user,
                    amount=-amount,
                    transaction_type=Transaction.TransactionType.TRANSFER,
                    description=f"Transfer to {receiver_sa.user.username} (MC)"
                )
                Transaction.objects.create(
                    user=receiver_sa.user,
                    amount=amount,
                    transaction_type=Transaction.TransactionType.TRANSFER,
                    description=f"Transfer from {sender_sa.user.username} (MC)"
                )

            return Response({"status": "ok", "new_balance": sender_wallet.balance})
        except SocialAccount.DoesNotExist:
            return Response({"error": "One of the users not found"}, status=status.HTTP_404_NOT_FOUND)
