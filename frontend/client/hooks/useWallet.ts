import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";

export interface WalletData {
    balance: number;
    assets: Record<string, number>; // coin_id -> quantity
    assets_value: number; // Total value of assets in USD
    total_net_worth: number; // balance + assets_value
}

export interface TradeResult {
    status: string;
    message: string;
    new_balance: number;
    new_asset_balance: number;
}

export function useWallet() {
    const { getToken, isLoaded: authLoaded } = useAuth();
    const [wallet, setWallet] = useState<WalletData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchWallet = useCallback(async () => {
        if (!authLoaded) return;
        try {
            setLoading(true);
            const token = await getToken();
            if (!token) return;

            const response = await fetch("http://localhost:8000/api/wallet/", {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!response.ok) throw new Error("Failed to fetch wallet");
            const data = await response.json();
            setWallet(data);
        } catch (err: any) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [authLoaded, getToken]);

    const executeTrade = async (coinId: string, type: "BUY" | "SELL", quantity: number): Promise<TradeResult> => {
        const token = await getToken();
        if (!token) throw new Error("Not authenticated");

        const response = await fetch("http://localhost:8000/api/wallet/trade/", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                coin_id: coinId,
                type: type,
                quantity: quantity
            })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || "Trade failed");
        }

        // Refresh wallet after successful trade
        fetchWallet();
        return data;
    };

    useEffect(() => {
        fetchWallet();
    }, [fetchWallet]);

    return { wallet, loading, error, refetch: fetchWallet, executeTrade };
}
