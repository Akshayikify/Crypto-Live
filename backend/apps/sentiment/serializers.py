from rest_framework import serializers

class NewsItemSerializer(serializers.Serializer):
    title = serializers.CharField()
    url = serializers.URLField()
    published = serializers.CharField()
    sentiment = serializers.CharField()
    score = serializers.FloatField()

class SentimentResponseSerializer(serializers.Serializer):
    coin = serializers.CharField()
    overall = serializers.CharField()
    news = NewsItemSerializer(many=True)