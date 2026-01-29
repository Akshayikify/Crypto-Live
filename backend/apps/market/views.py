from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Coin
from .serializers import CoinSerializer
from .services import CryptoService
import json

class CoinListView(APIView):
    permission_classes = [AllowAny] # public endpoints

    def get(self, request):
        # Optional: Trigger refresh via query param for testing ?refresh=true
        if request.query_params.get('refresh') == 'true':
            CryptoService.fetch_market_data()

        # Simple Pagination or Limit
        limit = int(request.query_params.get('limit', 100))
        
        # Check if DB is empty, if so, fetch initial data
        if Coin.objects.count() == 0:
            CryptoService.fetch_market_data()

        coins = Coin.objects.all().order_by('market_cap_rank')[:limit]
        serializer = CoinSerializer(coins, many=True)
        return Response(serializer.data)

class MarketStatusView(APIView):
    def get(self, request):
        count = Coin.objects.count()
        last_updated = Coin.objects.first().last_updated if count > 0 else None
        return Response({
            "total_coins": count,
            "last_updated": last_updated
        })

class CoinDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, coin_id):
        try:
            # Try to find by coin_id (e.g. bitcoin) first, then symbol (e.g. btc)
            coin = Coin.objects(coin_id=coin_id).first()
            if not coin:
                coin = Coin.objects(symbol=coin_id.lower()).first()
            
            if not coin:
                return Response({"error": "Coin not found"}, status=404)
            
            serializer = CoinSerializer(coin)
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

class CoinHistoryView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, coin_id):
        days = request.query_params.get('days', 7)
        data = CryptoService.fetch_coin_history(coin_id, days)
        return Response(data)
