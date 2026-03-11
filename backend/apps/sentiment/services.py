import os
import requests

HF_API_KEY = os.environ.get("HF_API_KEY", "")

SYMBOL_TO_ID = {
    "BTC": "bitcoin",
    "ETH": "ethereum",
    "SOL": "solana",
    "BNB": "binancecoin",
    "XRP": "ripple",
    "ADA": "cardano",
    "DOGE": "dogecoin",
    "AVAX": "avalanche-2",
    "MATIC": "matic-network",
    "DOT": "polkadot",
    "LTC": "litecoin",
    "SHIB": "shiba-inu",
    "UNI": "uniswap",
    "LINK": "chainlink",
}

def fetch_news(coin: str) -> list:
    """Fetch coin description from CoinGecko - free, no API key needed"""
    try:
        resp = requests.get(
            f"https://api.coingecko.com/api/v3/coins/{coin.lower()}/",
            params={
                "localization": "false",
                "tickers": "false",
                "market_data": "false",
                "community_data": "false",
                "developer_data": "false",
                "sparkline": "false"
            },
            timeout=10
        )
        resp.raise_for_status()
        data = resp.json()

        description = data.get("description", {}).get("en", "")

        if description:
            sentences = [s.strip() for s in description.split(".") if len(s.strip()) > 30]
            return [
                {
                    "title": s[:200],
                    "url": f"https://coingecko.com/en/coins/{coin.lower()}",
                    "published_at": ""
                }
                for s in sentences[:5]
            ]
        return []
    except Exception as e:
        print(f"DEBUG ERROR: {e}")
        return []


def analyze_sentiment(text: str) -> dict:
    """Call HuggingFace Inference API with FinBERT"""
    print(f"HF KEY EXISTS: {bool(HF_API_KEY)}")
    print(f"HF KEY START: {HF_API_KEY[:10] if HF_API_KEY else 'EMPTY'}")

    if not HF_API_KEY:
        return {"label": "neutral", "score": 0.5}

    headers = {"Authorization": f"Bearer {HF_API_KEY}"}
    try:
        resp = requests.post(
            "https://router.huggingface.co/hf-inference/models/ProsusAI/finbert",
            headers=headers,
            json={"inputs": text},
            timeout=15,
        )
        print(f"HF STATUS: {resp.status_code}")
        print(f"HF RESPONSE: {resp.text[:200]}")
        result = resp.json()
        if isinstance(result, list) and result:
            top = max(result[0], key=lambda x: x["score"])
            return {"label": top["label"].lower(), "score": round(top["score"], 3)}
    except Exception as e:
        print(f"HF ERROR: {e}")

    return {"label": "neutral", "score": 0.5}


def get_coin_sentiment(coin: str) -> dict:
    """Main function: convert symbol to CoinGecko id, fetch description, score sentiment"""
    coin_id = SYMBOL_TO_ID.get(coin.upper(), coin.lower())
    articles = fetch_news(coin_id)

    scored = []
    for article in articles:
        title = article.get("title", "")
        sentiment = analyze_sentiment(title)
        scored.append({
            "title": title,
            "url": article.get("url", ""),
            "published": article.get("published_at", ""),
            "sentiment": sentiment["label"],
            "score": sentiment["score"],
        })

    labels = [s["sentiment"] for s in scored]
    overall = max(set(labels), key=labels.count) if labels else "neutral"
    return {"coin": coin, "overall": overall, "news": scored}

