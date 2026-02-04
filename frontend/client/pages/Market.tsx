import { useMarketData, Coin } from "@/hooks/useMarketData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, Search, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { useState } from "react";

import { useNavigate } from "react-router-dom";

export default function Market() {
  const { coins, loading, error, refetch } = useMarketData();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filteredCoins = coins.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(val);
  };

  const formatCompact = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 2
    }).format(val);
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Crypto Market
          </h1>
          <p className="text-muted-foreground">
            Live prices and market data sourced from CoinGecko
          </p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search coins..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 glass"
            />
          </div>
          <Button
            onClick={refetch}
            disabled={loading}
            variant="outline"
            className="glass"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded text-red-500">
          {error}
        </div>
      )}

      {/* Market Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Top Gainer (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            {coins.length > 0 ? (
              <div className="flex items-center gap-2">
                <img src={coins[0].image} className="w-8 h-8 rounded-full" alt={coins[0].name} />
                <div>
                  <p className="font-bold">{coins[0].name}</p>
                  <span className="text-green-500 text-sm">+{coins[0].price_change_percentage_24h.toFixed(2)}%</span>
                </div>
              </div>
            ) : <div className="h-8 w-24 bg-muted/50 rounded animate-pulse" />}
          </CardContent>
        </Card>
        <Card className="glass border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Highest Volume</CardTitle>
          </CardHeader>
          <CardContent>
            {coins.length > 0 ? (
              <div>
                <p className="font-bold text-xl">{formatCompact(coins[0].total_volume)}</p>
                <span className="text-xs text-muted-foreground">{coins[0].name}</span>
              </div>
            ) : <div className="h-8 w-24 bg-muted/50 rounded animate-pulse" />}
          </CardContent>
        </Card>
        <Card className="glass border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Coins</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-bold text-2xl">{coins.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Coins Table */}
      <div className="glass rounded-xl overflow-hidden border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black/20 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-6 py-4 text-left">#</th>
                <th className="px-6 py-4 text-left">Coin</th>
                <th className="px-6 py-4 text-right">Price</th>
                <th className="px-6 py-4 text-right">24h Change</th>
                <th className="px-6 py-4 text-right hidden md:table-cell">Market Cap</th>
                <th className="px-6 py-4 text-right hidden lg:table-cell">Volume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading && coins.length === 0 ? (
                // Loading Skeletons
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 w-4 bg-muted/30 rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-8 w-32 bg-muted/30 rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-20 bg-muted/30 rounded ml-auto"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-12 bg-muted/30 rounded ml-auto"></div></td>
                    <td className="px-6 py-4 hidden md:table-cell"><div className="h-4 w-24 bg-muted/30 rounded ml-auto"></div></td>
                    <td className="px-6 py-4 hidden lg:table-cell"><div className="h-4 w-24 bg-muted/30 rounded ml-auto"></div></td>
                  </tr>
                ))
              ) : filteredCoins.length > 0 ? (
                filteredCoins.map((coin) => (
                  <tr
                    key={coin.coin_id}
                    onClick={() => navigate(`/market/${coin.coin_id}`)}
                    className="hover:bg-white/5 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4 text-sm text-muted-foreground whitespace-nowrap">
                      {coin.market_cap_rank}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={coin.image}
                          alt={coin.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="flex flex-col">
                          <span className="font-bold group-hover:text-cyan-400 transition-colors">
                            {coin.name}
                          </span>
                          <span className="text-xs text-muted-foreground uppercase">
                            {coin.symbol}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-medium">
                      {formatCurrency(coin.current_price)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div
                        className={`flex items-center justify-end gap-1 ${coin.price_change_percentage_24h >= 0
                          ? "text-green-500"
                          : "text-red-500"
                          }`}
                      >
                        {coin.price_change_percentage_24h >= 0 ? (
                          <TrendingUp size={14} />
                        ) : (
                          <TrendingDown size={14} />
                        )}
                        <span className="font-medium">
                          {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-muted-foreground hidden md:table-cell font-mono text-sm">
                      {formatCurrency(coin.market_cap)}
                    </td>
                    <td className="px-6 py-4 text-right text-muted-foreground hidden lg:table-cell font-mono text-sm">
                      {formatCurrency(coin.total_volume)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-muted-foreground">
                    No coins found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
