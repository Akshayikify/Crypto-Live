from django.urls import path
from .views import CoinListView, MarketStatusView, CoinDetailView, CoinHistoryView

urlpatterns = [
    path('coins/', CoinListView.as_view(), name='coin-list'),
    # IMPORTANT: history/ must come BEFORE the generic <coin_id>/ pattern.
    # Django matches URLs top-to-bottom; the catch-all <str:coin_id>/ would
    # otherwise absorb "bitcoin/history/" as coin_id="bitcoin/history".
    path('coins/<str:coin_id>/history/', CoinHistoryView.as_view(), name='coin-history'),
    path('coins/<str:coin_id>/', CoinDetailView.as_view(), name='coin-detail'),
    path('status/', MarketStatusView.as_view(), name='market-status'),
]
