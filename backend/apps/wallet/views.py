from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Wallet, Transaction
from .serializers import WalletSerializer, TransactionSerializer
from apps.market.models import Coin
from apps.market.services import CryptoService
import mongoengine

class WalletView(APIView):
    permission_classes = [IsAuthenticated]

    def get_wallet(self, user):
        wallet = Wallet.objects(user=user).first()
        if not wallet:
            # Create default wallet
            wallet = Wallet(user=user)
            wallet.save()
        return wallet

    def get(self, request):
        print(f"DEBUG WALLET: Fetching wallet for user {request.user.clerk_id}")
        wallet = self.get_wallet(request.user)
        
        # Calculate Net Worth
        assets_value = 0
        for coin_id, amount in wallet.assets.items():
            if amount > 0:
                # Try to get latest price from DB
                coin = Coin.objects(coin_id=coin_id).first()
                if coin:
                    assets_value += amount * coin.current_price
        
        # Inject dynamic attribute for serializer
        wallet.assets_value = assets_value
        
        serializer = WalletSerializer(wallet)
        return Response(serializer.data)

class TradeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Body: { 
            "coin_id": "bitcoin", 
            "type": "BUY" | "SELL", 
            "quantity": 0.5 
            // OR "amount_usd": 1000 (Calculated automatically)
        }
        """
        user = request.user
        data = request.data
        coin_id = data.get('coin_id')
        trade_type = data.get('type')
        quantity = float(data.get('quantity', 0))
        
        if not coin_id or trade_type not in ['BUY', 'SELL']:
            return Response({"error": "Invalid parameters"}, status=400)
            
        # Get Coin Price
        coin = Coin.objects(coin_id=coin_id).first()
        if not coin:
             return Response({"error": "Coin not found"}, status=404)
        
        current_price = coin.current_price
        total_cost = quantity * current_price
        
        wallet = Wallet.objects(user=user).first()
        if not wallet:
            wallet = Wallet(user=user).save()
            
        if trade_type == 'BUY':
            if wallet.balance < total_cost:
                return Response({"error": "Insufficient funds"}, status=400)
            
            # Execute Buy
            wallet.balance -= total_cost
            current_asset = wallet.assets.get(coin_id, 0)
            wallet.assets[coin_id] = current_asset + quantity
            wallet.save()
            
        elif trade_type == 'SELL':
            current_asset = wallet.assets.get(coin_id, 0)
            if current_asset < quantity:
                 return Response({"error": "Insufficient assets"}, status=400)
            
            # Execute Sell
            wallet.balance += total_cost
            wallet.assets[coin_id] = current_asset - quantity
            # Remove from dict if 0 to keep clean? Optional.
            if wallet.assets[coin_id] <= 0.000001: # Avoid floating point dust
                del wallet.assets[coin_id]
            wallet.save()

        # Record Transaction
        tx = Transaction(
            user=user,
            coin_id=coin_id,
            type=trade_type,
            amount=quantity,
            price_at_transaction=current_price,
            total_value=total_cost
        )
        tx.save()

        return Response({
            "status": "success",
            "message": f"Successfully {trade_type} {quantity} {coin.symbol}",
            "new_balance": wallet.balance,
            "new_asset_balance": wallet.assets.get(coin_id, 0)
        })

class TransactionHistoryView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        txs = Transaction.objects(user=request.user).order_by('-timestamp')
        serializer = TransactionSerializer(txs, many=True)
        return Response(serializer.data)
