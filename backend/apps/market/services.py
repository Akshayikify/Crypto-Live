import requests
from datetime import datetime
from .models import Coin

class CryptoService:
    COINGECKO_API_URL = "https://api.coingecko.com/api/v3/coins/markets"
    
    @staticmethod
    def fetch_market_data(currency="usd", per_page=100, page=1):
        """
        Fetches market data from CoinGecko and updates the database.
        """
        params = {
            "vs_currency": currency,
            "order": "market_cap_desc",
            "per_page": per_page,
            "page": page,
            "sparkline": "false"
        }

        try:
            print(f"Fetching data from CoinGecko page {page}...")
            response = requests.get(CryptoService.COINGECKO_API_URL, params=params, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                coins_to_save = []
                
                for item in data:
                    # Update or Create logic
                    # Using upsert-like logic manually since bulk operations in MongoEngine can be tricky
                    # For MVP, iterating and saving is fine. For scale, use bulk_write with PyMongo.
                    
                    coin = Coin.objects(coin_id=item['id']).first()
                    if not coin:
                        coin = Coin(coin_id=item['id'])
                    
                    coin.symbol = item['symbol']
                    coin.name = item['name']
                    coin.image = item['image']
                    coin.current_price = item['current_price']
                    coin.market_cap = item.get('market_cap', 0)
                    coin.market_cap_rank = item.get('market_cap_rank', 0)
                    coin.total_volume = item.get('total_volume', 0)
                    coin.high_24h = item.get('high_24h', 0)
                    coin.low_24h = item.get('low_24h', 0)
                    coin.price_change_24h = item.get('price_change_24h', 0)
                    coin.price_change_percentage_24h = item.get('price_change_percentage_24h', 0)
                    coin.circulating_supply = item.get('circulating_supply', 0)
                    coin.total_supply = item.get('total_supply', 0)
                    coin.max_supply = item.get('max_supply', 0)
                    coin.ath = item.get('ath', 0)
                    coin.ath_change_percentage = item.get('ath_change_percentage', 0)
                    coin.last_updated = datetime.utcnow()
                    
                    coin.save()
                    coins_to_save.append(coin)
                
                print(f"Successfully updated/created {len(coins_to_save)} coins.")
                return coins_to_save
            else:
                print(f"Error fetching data: {response.status_code} - {response.text}")
                return []
                
        except Exception as e:
            print(f"Exception in fetch_market_data: {str(e)}")
            return []

    @staticmethod
    def fetch_coin_history(coin_id, days=7):
        """
        Fetches historical market data for a coin.
        Returns a list of [timestamp, price] points.
        """
        try:
            url = f"https://api.coingecko.com/api/v3/coins/{coin_id}/market_chart"
            params = {
                "vs_currency": "usd",
                "days": days
            }
            
            # Note: In production, cache this response in Redis!
            print(f"Fetching history for {coin_id}...")
            response = requests.get(url, params=params, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                # data['prices'] is already [[timestamp, price], ...]
                return data.get('prices', [])
            else:
                print(f"Error fetching history: {response.status_code} - {response.text}")
                return []
        except Exception as e:
             print(f"Exception in fetch_coin_history: {str(e)}")
             return []
