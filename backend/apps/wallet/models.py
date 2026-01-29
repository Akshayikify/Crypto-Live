from mongoengine import Document, ReferenceField, FloatField, DictField, StringField, DateTimeField
from datetime import datetime
from apps.users.models import User

class Wallet(Document):
    user = ReferenceField(User, required=True, unique=True, reverse_delete_rule=2) # 2 = DENY delete if wallet exists? No, usually CASCADE (3) or NULLIFY (1). Let's use CASCADE logic manually or just 2 for safety. Actually MongoEngine uses: 0: DO_NOTHING, 1: NULLIFY, 2: CASCADE, 3: DENY, 4: PULL. So 2 is CASCADE.
    balance = FloatField(default=100000.0) # Virtual USD
    assets = DictField(default=dict) # {"bitcoin": 0.5, "ethereum": 10.0}
    
    meta = {
        'collection': 'wallets',
        'indexes': ['user']
    }

    def __str__(self):
        return f"Wallet ({self.user.email})"

class Transaction(Document):
    user = ReferenceField(User, required=True)
    coin_id = StringField(required=True) # e.g. "bitcoin"
    type = StringField(required=True, choices=('BUY', 'SELL'))
    amount = FloatField(required=True) # Quantity of coin
    price_at_transaction = FloatField(required=True) # USD price per coin
    total_value = FloatField(required=True) # USD total value
    timestamp = DateTimeField(default=datetime.utcnow)

    meta = {
        'collection': 'transactions',
        'ordering': ['-timestamp'],
        'indexes': ['user', 'coin_id', '-timestamp']
    }

    def __str__(self):
        return f"{self.type} {self.amount} {self.coin_id} - {self.timestamp}"
