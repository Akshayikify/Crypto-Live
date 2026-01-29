from django.urls import path
from .views import WalletView, TradeView, TransactionHistoryView

urlpatterns = [
    path('', WalletView.as_view(), name='wallet-detail'),
    path('trade/', TradeView.as_view(), name='wallet-trade'),
    path('transactions/', TransactionHistoryView.as_view(), name='wallet-transactions'),
]
