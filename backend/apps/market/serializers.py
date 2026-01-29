from rest_framework import serializers
from .models import Coin

class CoinSerializer(serializers.Serializer):
    coin_id = serializers.CharField()
    symbol = serializers.CharField()
    name = serializers.CharField()
    image = serializers.URLField()
    current_price = serializers.FloatField()
    market_cap = serializers.IntegerField()
    market_cap_rank = serializers.IntegerField()
    total_volume = serializers.IntegerField()
    price_change_percentage_24h = serializers.FloatField()
    last_updated = serializers.DateTimeField()
