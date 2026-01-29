from mongoengine import Document, StringField, EmailField, DateTimeField, DictField
from datetime import datetime

class User(Document):
    # _id is automatically created by MongoEngine (ObjectId)
    clerk_id = StringField(required=True, unique=True)
    email = EmailField(required=True, unique=True)
    created_at = DateTimeField(default=datetime.utcnow)
    
    # Preferences stored as a Dict
    preferences = DictField(default=dict)

    meta = {
        'collection': 'users',
        'indexes': ['clerk_id', 'email']
    }

    def __str__(self):
        return self.email

    @property
    def is_authenticated(self):
        return True

    @property
    def is_active(self):
        return True

    @property
    def is_anonymous(self):
        return False
