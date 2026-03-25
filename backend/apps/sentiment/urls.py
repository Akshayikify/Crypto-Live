from django.urls import path
from . import views

urlpatterns = [
    path("sentiment/", views.coin_sentiment, name="coin-sentiment"),
]