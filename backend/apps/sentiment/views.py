from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .services import get_coin_sentiment
from .serializers import SentimentResponseSerializer

@api_view(["GET"])
@permission_classes([AllowAny])
def coin_sentiment(request):
    coin = request.query_params.get("coin", "BTC").upper()
    data = get_coin_sentiment(coin)
    serializer = SentimentResponseSerializer(data)
    return Response(serializer.data, status=status.HTTP_200_OK)