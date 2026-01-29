from mongoengine import Document, StringField, FloatField, LongField, DateTimeField, URLField
from datetime import datetime

class Coin(Document):
    # Core Data
    coin_id = StringField(required=True, unique=True) # e.g. bitcoin, ethereum
    symbol = StringField(required=True) # e.g. btc
    name = StringField(required=True) # e.g. Bitcoin
    image = URLField()
    
    # Market Data
    current_price = FloatField(required=True)
    market_cap = LongField()
    market_cap_rank = LongField()
    total_volume = LongField()
    high_24h = FloatField()
    low_24h = FloatField()
    price_change_24h = FloatField()
    price_change_percentage_24h = FloatField()
    circulating_supply = FloatField()
    total_supply = FloatField()
    max_supply = FloatField()
    ath = FloatField()
    ath_change_percentage = FloatField()
    
    # Metadata
    last_updated = DateTimeField(default=datetime.utcnow)

    meta = {
        'collection': 'coins',
        'ordering': ['market_cap_rank'],
        'indexes': [
            'coin_id',
            'symbol',
            'market_cap_rank'
        ]
    }

    def __str__(self):
        return self.name
