from rest_framework import serializers

class NewsItemSerializer(serializers.Serializer):
    title = serializers.CharField()
    url = serializers.URLField()
    published_at = serializers.CharField(required=False, allow_blank=True, default="")
    source = serializers.CharField(required=False, default="Unknown")
    sentiment = serializers.CharField()
    score = serializers.FloatField()

class RecommendationSerializer(serializers.Serializer):
    action = serializers.CharField()
    reasoning = serializers.CharField()
    color = serializers.CharField()

class SentimentResponseSerializer(serializers.Serializer):
    coin = serializers.CharField()
    overall = serializers.CharField()
    confidence = serializers.FloatField()
    net_score = serializers.FloatField()
    recommendation = RecommendationSerializer()
    news = NewsItemSerializer(many=True)