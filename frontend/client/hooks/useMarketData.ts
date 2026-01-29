import { useState, useEffect, useCallback } from "react";

export interface Coin {
    coin_id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    market_cap: number;
    market_cap_rank: number;
    total_volume: number;
    price_change_percentage_24h: number;
    last_updated: string;
}

export function useMarketData() {
    const [coins, setCoins] = useState<Coin[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCoins = useCallback(async (refresh = false) => {
        try {
            setLoading(true);
            setError(null);

            const url = refresh
                ? "http://localhost:8000/api/market/coins/?refresh=true"
                : "http://localhost:8000/api/market/coins/";

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Failed to fetch market data: ${response.statusText}`);
            }

            const data = await response.json();
            setCoins(data);
        } catch (err: any) {
            console.error("Error fetching market data:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCoins();
    }, [fetchCoins]);

    return {
        coins,
        loading,
        error,
        refetch: () => fetchCoins(true)
    };
}
