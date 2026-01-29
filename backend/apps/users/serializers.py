from rest_framework import serializers
from .models import User

class UserSerializer(serializers.Serializer):
    clerk_id = serializers.CharField()
    email = serializers.EmailField()
    created_at = serializers.DateTimeField()
    preferences = serializers.DictField()
