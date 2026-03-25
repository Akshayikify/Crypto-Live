import os
import requests
from typing import List, Dict

HF_API_KEY = os.environ.get("HF_API_KEY", "")
CRYPTOPANIC_API_KEY = os.environ.get("CRYPTOPANIC_API_KEY", "")
NEWS_API_KEY = os.environ.get("NEWS_API_KEY", "")

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

def fetch_cryptopanic_news(coin: str) -> List[Dict]:
    """Fetch real-time crypto news from CryptoPanic API"""
    if not CRYPTOPANIC_API_KEY:
        return []
        
    url = f"https://cryptopanic.com/api/developer/v2/posts/?auth_token={CRYPTOPANIC_API_KEY}&currencies={coin.upper()}&filter=important"
    try:
        resp = requests.get(url, timeout=10)
        data = resp.json()
        results = []
        for item in data.get("results", [])[:10]:
            results.append({
                "title": item.get("title", ""),
                "url": item.get("url", ""),
                "published_at": item.get("published_at", ""),
                "source": "CryptoPanic"
            })
        return results
    except Exception as e:
        print(f"CryptoPanic Error: {e}")
        return []

def fetch_newsapi_news(coin: str) -> List[Dict]:
    """Fetch broader financial news from NewsAPI"""
    if not NEWS_API_KEY:
        return []
        
    url = f"https://newsapi.org/v2/everything?q={coin}+crypto&sortBy=relevancy&pageSize=10&apiKey={NEWS_API_KEY}"
    try:
        resp = requests.get(url, timeout=10)
        data = resp.json()
        results = []
        for item in data.get("articles", []):
            results.append({
                "title": item.get("title", ""),
                "url": item.get("url", ""),
                "published_at": item.get("publishedAt", ""),
                "source": "NewsAPI"
            })
        return results
    except Exception as e:
        print(f"NewsAPI Error: {e}")
        return []

def fetch_coingecko_fallback(coin: str) -> List[Dict]:
    """Fallback: Fetch coin description from CoinGecko if no news found"""
    coin_id = SYMBOL_TO_ID.get(coin.upper(), coin.lower())
    try:
        resp = requests.get(
            f"https://api.coingecko.com/api/v3/coins/{coin_id}/",
            params={"localization": "false", "tickers": "false", "market_data": "false", "community_data": "false", "developer_data": "false", "sparkline": "false"},
            timeout=10
        )
        data = resp.json()
        description = data.get("description", {}).get("en", "")
        if description:
            sentences = [s.strip() for s in description.split(".") if len(s.strip()) > 40]
            return [{"title": s[:300], "url": f"https://coingecko.com/en/coins/{coin_id}", "published_at": "", "source": "CoinGecko"} for s in sentences[:5]]
    except Exception:
        pass
    return []

def analyze_sentiment(text: str) -> Dict:
    """Enhanced sentiment analysis using FinBERT"""
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
        result = resp.json()
        
        # Check for model loading
        if isinstance(result, dict) and "estimated_time" in result:
             # Model is loading, return neutral for now or retry
             return {"label": "neutral", "score": 0.5, "loading": True}

        if isinstance(result, list) and len(result) > 0 and isinstance(result[0], list):
            scores = {item['label'].lower(): item['score'] for item in result[0]}
            top_label = max(scores, key=scores.get)
            return {"label": top_label, "score": round(scores[top_label], 3), "all_scores": scores}
    except Exception as e:
        print(f"HF Inference Error: {e}")

    return {"label": "neutral", "score": 0.5, "all_scores": {"neutral": 0.5, "positive": 0.25, "negative": 0.25}}

def calculate_consensus(scored_articles: List[Dict]) -> Dict:
    """Calculate the overall market consensus and confidence level"""
    if not scored_articles:
        return {"overall": "neutral", "confidence": 0, "sentiment_score": 0}
        
    total_pos = sum(a.get("all_scores", {}).get("positive", 0) for a in scored_articles)
    total_neg = sum(a.get("all_scores", {}).get("negative", 0) for a in scored_articles)
    total_neu = sum(a.get("all_scores", {}).get("neutral", 0) for a in scored_articles)
    count = len(scored_articles)
    
    avg_pos = total_pos / count
    avg_neg = total_neg / count
    
    # Net Score: -1 (Strong Bearish) to +1 (Strong Bullish)
    net_score = avg_pos - avg_neg
    
    if net_score > 0.3: overall = "strong bullish"
    elif net_score > 0.05: overall = "bullish"
    elif net_score > -0.05: overall = "neutral"
    elif net_score > -0.3: overall = "bearish"
    else: overall = "strong bearish"
    
    # Confidence: How skewed are we away from neutral?
    confidence = (1 - (total_neu / count)) * 100
    
    return {
        "overall": overall,
        "confidence": round(confidence, 1),
        "sentiment_score": round(net_score, 3)
    }

def generate_recommendation(net_score: float, confidence: float, price_change: float) -> Dict:
    """Algorithm to generate a final Buy/Sell/Hold recommendation"""
    action = "WAIT"
    reasoning = ""
    color = "yellow"
    
    # 1. Strong Bullish Case
    if net_score > 0.4 and confidence > 60:
        action = "STRONG BUY"
        reasoning = "Market consensus is overwhelmingly positive with high news volume. Ideal entry point if long-term outlook is bullish."
        color = "green"
    # 2. Bullish Case
    elif net_score > 0.1:
        action = "BUY / ACCUMULATE"
        reasoning = "Sentiment is tilting positive. Market optimism suggests potential for upward momentum."
        color = "emerald"
    # 3. Strong Bearish Case
    elif net_score < -0.4 and confidence > 60:
        action = "STRONG SELL / SHORT"
        reasoning = "Heavy negative news volume and low impact scores. High risk of further drawdown."
        color = "red"
    # 4. Bearish Case
    elif net_score < -0.1:
        action = "SELL / CAUTION"
        reasoning = "Sentiment is weakening. Defensive posture recommended as market pressure increases."
        color = "orange"
    # 5. Neutral / Uncertain
    else:
        if confidence < 30:
            action = "WAIT / LOW DATA"
            reasoning = "Not enough news volume to make a definitive call. Monitor for new developments."
            color = "gray"
        else:
            action = "HOLD / NEUTRAL"
            reasoning = "Market is currently balanced. No strong directional bias detected in recent news."
            color = "yellow"

    # Add price context if significant
    if price_change > 10:
        reasoning += " Note: Rapid price surge detected (+10% 24h), watch for potential overextension."
    elif price_change < -10:
        reasoning += " Note: Significant price drop (-10% 24h), potential 'buy the dip' or further capitulation."

    return {
        "action": action,
        "reasoning": reasoning,
        "color": color
    }

def get_coin_sentiment(coin: str) -> dict:
    """Main Orchestrator for Sentiment Gathering & Recommendation"""
    # 1. Gather news from ALL sources
    news = []
    news.extend(fetch_cryptopanic_news(coin))
    news.extend(fetch_newsapi_news(coin))
    
    if not news:
        news = fetch_coingecko_fallback(coin)
        
    # 2. Fetch basic market data for context
    price_change = 0
    try:
        coin_id = SYMBOL_TO_ID.get(coin.upper(), coin.lower())
        resp = requests.get(f"https://api.coingecko.com/api/v3/simple/price?ids={coin_id}&vs_currencies=usd&include_24hr_change=true")
        data = resp.json()
        price_change = data.get(coin_id, {}).get("usd_24h_change", 0)
    except: pass

    # 3. Score each article
    scored = []
    for item in news:
        sentiment = analyze_sentiment(item["title"])
        scored.append({
            **item,
            "sentiment": sentiment["label"],
            "score": sentiment["score"],
            "all_scores": sentiment.get("all_scores", {})
        })
        
    # 4. Calculate Consensus & Recommendation
    consensus = calculate_consensus(scored)
    recommendation = generate_recommendation(consensus["sentiment_score"], consensus["confidence"], price_change)
    
    return {
        "coin": coin.upper(),
        "overall": consensus["overall"],
        "confidence": consensus["confidence"],
        "net_score": consensus["sentiment_score"],
        "recommendation": recommendation,
        "news": scored
    }

