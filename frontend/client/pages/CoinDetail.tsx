import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Activity, BarChart3, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import TradeModal from "@/components/TradeModal";
import { useUser } from "@clerk/clerk-react";
import { toast } from "sonner";

interface CoinDetailData {
    coin_id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    market_cap: number;
    market_cap_rank: number;
    total_volume: number;
    high_24h: number;
    low_24h: number;
    price_change_24h: number;
    price_change_percentage_24h: number;
    circulating_supply: number;
    total_supply: number;
    max_supply: number;
    ath?: number;
    ath_change_percentage?: number;
}

export default function CoinDetail() {
    const { coinId } = useParams();
    const navigate = useNavigate();
    const { user, isSignedIn } = useUser();
    const [coin, setCoin] = useState<CoinDetailData | null>(null);
    const [history, setHistory] = useState<[number, number][]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [timeRange, setTimeRange] = useState(7); // Default 7 days
    const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!coinId) return;
            setLoading(true);
            try {
                // Fetch Coin Details
                const coinResponse = await fetch(`http://localhost:8000/api/market/coins/${coinId}/`);
                if (!coinResponse.ok) throw new Error("Coin not found");
                const coinData = await coinResponse.json();
                setCoin(coinData);

                // Fetch History
                const historyResponse = await fetch(`http://localhost:8000/api/market/coins/${coinId}/history/?days=${timeRange}`);
                if (!historyResponse.ok) throw new Error("Failed to fetch history");
                const historyData = await historyResponse.json();
                setHistory(historyData);

            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [coinId, timeRange]);

    const chartData = useMemo(() => {
        return history.map(([timestamp, price]) => ({
            date: timestamp,
            price: price,
            formattedDate: format(new Date(timestamp), timeRange === 1 ? "HH:mm" : "MMM d")
        }));
    }, [history, timeRange]);

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(val);

    const formatCompact = (val: number) =>
        new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 }).format(val);

    if (loading && !coin) return <div className="min-h-screen pt-20 flex justify-center items-center"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div></div>;
    if (error || !coin) return <div className="min-h-screen pt-20 flex justify-center items-center text-red-500">Error: {error || "Coin not found"}</div>;

    const isPositive = coin.price_change_percentage_24h >= 0;

    return (
        <div className="min-h-screen pt-20 pb-12 animate-fade-in">
            <div className="container mx-auto px-4 space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => navigate("/market")} className="glass rounded-full">
                            <ArrowLeft size={20} />
                        </Button>
                        <div className="flex items-center gap-3">
                            <img src={coin.image} alt={coin.name} className="w-12 h-12 rounded-full" />
                            <div>
                                <h1 className="text-3xl font-bold">{coin.name}</h1>
                                <span className="text-muted-foreground uppercase">{coin.symbol}</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                        <Button
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={() => {
                                if (!isSignedIn) {
                                    toast.error("Please login to trade!");
                                    return;
                                }
                                setIsTradeModalOpen(true);
                            }}
                        >
                            Trade {coin.symbol.toUpperCase()}
                        </Button>
                        <div className="text-3xl font-mono font-bold">{formatCurrency(coin.current_price)}</div>
                        <div className="text-right">
                            <div className="text-3xl font-mono font-bold">{formatCurrency(coin.current_price)}</div>
                            {coin.price_change_percentage_24h !== undefined && (
                                <div className={`flex items-center justify-end gap-1 ${isPositive ? "text-green-500" : "text-red-500"}`}>
                                    {isPositive ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                                    <span className="font-bold text-lg">{Math.abs(coin.price_change_percentage_24h).toFixed(2)}% (24h)</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Chart Section */}
                <Card className="glass border-primary/20 overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-white/10 pb-4">
                        <CardTitle>Price History</CardTitle>
                        <div className="flex gap-2">
                            {[1, 7, 30].map(days => (
                                <Button
                                    key={days}
                                    variant={timeRange === days ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setTimeRange(days)}
                                    className="text-xs"
                                >
                                    {days === 1 ? "24H" : days === 7 ? "7D" : "30D"}
                                </Button>
                            ))}
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={isPositive ? "#22c55e" : "#ef4444"} stopOpacity={0.3} />
                                        <stop offset="95%" stopColor={isPositive ? "#22c55e" : "#ef4444"} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                                <XAxis
                                    dataKey="formattedDate"
                                    stroke="#666"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    minTickGap={30}
                                />
                                <YAxis
                                    stroke="#666"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    domain={['auto', 'auto']}
                                    tickFormatter={(val) => `$${val.toLocaleString()}`}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                    labelStyle={{ color: '#aaa', marginBottom: '0.5rem' }}
                                    formatter={(value: number) => [formatCurrency(value), "Price"]}
                                    labelFormatter={(label) => new Date(label).toLocaleString()}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="price"
                                    stroke={isPositive ? "#22c55e" : "#ef4444"}
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorPrice)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="glass border-white/5">
                        <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground flex items-center gap-2"><DollarSign size={14} /> Market Cap</CardTitle></CardHeader>
                        <CardContent><div className="text-2xl font-bold">{formatCompact(coin.market_cap)}</div><div className="text-xs text-muted-foreground">Rank #{coin.market_cap_rank}</div></CardContent>
                    </Card>
                    <Card className="glass border-white/5">
                        <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground flex items-center gap-2"><Activity size={14} /> Volume (24h)</CardTitle></CardHeader>
                        <CardContent><div className="text-2xl font-bold">{formatCompact(coin.total_volume)}</div></CardContent>
                    </Card>
                    <Card className="glass border-white/5">
                        <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground flex items-center gap-2"><BarChart3 size={14} /> Supply</CardTitle></CardHeader>
                        <CardContent>
                            <div className="text-lg font-bold">{formatCompact(coin.circulating_supply)} <span className="text-sm font-normal text-muted-foreground">{coin.symbol.toUpperCase()}</span></div>
                            {coin.max_supply && <div className="text-xs text-muted-foreground">Max: {formatCompact(coin.max_supply)}</div>}
                        </CardContent>
                    </Card>
                    <Card className="glass border-white/5">
                        <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground flex items-center gap-2"><Globe size={14} /> All Time High</CardTitle></CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{coin.ath ? formatCurrency(coin.ath) : "N/A"}</div>
                            {coin.ath_change_percentage !== undefined && (
                                <div className="text-xs text-red-500">{coin.ath_change_percentage.toFixed(2)}% from ATH</div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {coin && (
                <TradeModal
                    isOpen={isTradeModalOpen}
                    onClose={() => setIsTradeModalOpen(false)}
                    coinId={coin.coin_id}
                    coinName={coin.name}
                    currentPrice={coin.current_price}
                />
            )}
        </div>
    );
}
