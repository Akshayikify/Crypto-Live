from rest_framework import serializers
from .models import Wallet, Transaction

class WalletSerializer(serializers.Serializer):
    balance = serializers.FloatField()
    assets = serializers.DictField()
    total_net_worth = serializers.SerializerMethodField()

    def get_total_net_worth(self, obj):
        # This will be populated in the View or via a helper service
        return obj.balance + getattr(obj, 'assets_value', 0)

class TransactionSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    coin_id = serializers.CharField()
    type = serializers.CharField()
    amount = serializers.FloatField()
    price_at_transaction = serializers.FloatField()
    total_value = serializers.FloatField()
    timestamp = serializers.DateTimeField()
