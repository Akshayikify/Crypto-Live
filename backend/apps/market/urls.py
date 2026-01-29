from django.urls import path
from .views import CoinListView, MarketStatusView, CoinDetailView, CoinHistoryView

urlpatterns = [
    path('coins/', CoinListView.as_view(), name='coin-list'),
    path('coins/<str:coin_id>/', CoinDetailView.as_view(), name='coin-detail'),
    path('coins/<str:coin_id>/history/', CoinHistoryView.as_view(), name='coin-history'),
    path('status/', MarketStatusView.as_view(), name='market-status'),
]
