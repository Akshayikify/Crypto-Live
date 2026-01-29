import { useWallet } from "@/hooks/useWallet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, TrendingUp, Wallet as WalletIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Wallet() {
  const { wallet, loading, error, refetch } = useWallet();
  const navigate = useNavigate();

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(val);

  if (loading && !wallet) return <div className="min-h-screen pt-20 flex justify-center items-center"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
  if (error) return <div className="min-h-screen pt-20 flex justify-center items-center text-red-500">Error: {error}</div>;
  if (!wallet) return <div className="min-h-screen pt-20 flex justify-center items-center">Please log in to view wallet.</div>;

  return (
    <div className="min-h-screen pt-20 pb-12 animate-fade-in">
      <div className="container mx-auto px-4 space-y-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
          My Portfolio
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Balance Card */}
          <Card className="glass border-green-500/20">
            <CardHeader>
              <CardTitle className="text-muted-foreground flex items-center gap-2">
                <WalletIcon size={18} /> Available Balance (USD)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold font-mono">{formatCurrency(wallet.balance)}</div>
              <Button variant="outline" className="mt-4" onClick={refetch}>Refresh Balance</Button>
            </CardContent>
          </Card>

          {/* Net Worth Card */}
          <Card className="glass border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-muted-foreground flex items-center gap-2">
                <TrendingUp size={18} /> Total Net Worth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold font-mono text-blue-400">
                {formatCurrency(wallet.balance + (wallet.assets_value || 0))}
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                Includes cash + current value of crypto assets
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assets List */}
        <Card className="glass border-white/10">
          <CardHeader>
            <CardTitle>Your Assets</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(wallet.assets).length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>You don't own any assets yet.</p>
                <Button className="mt-4" onClick={() => navigate("/market")}>Go to Market</Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-white/10">
                    <tr className="text-left text-muted-foreground text-sm">
                      <th className="pb-4">Asset</th>
                      <th className="pb-4 text-right">Quantity</th>
                      <th className="pb-4 text-right">Total Value</th>
                      <th className="pb-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {Object.entries(wallet.assets).map(([coinId, quantity]) => (
                      <tr key={coinId} className="group hover:bg-white/5 transition-colors">
                        <td className="py-4 font-bold capitalize">{coinId}</td>
                        <td className="py-4 text-right font-mono">{quantity}</td>
                        <td className="py-4 text-right text-muted-foreground">
                          {/* Note: In a real app we'd map this to current price to show USD value per row. 
                                                For MVP we rely on total assets_value from backend or would need to fetch prices here.
                                            */}
                          <span className="text-xs">View detail for price</span>
                        </td>
                        <td className="py-4 text-right">
                          <Button size="sm" variant="ghost" onClick={() => navigate(`/market/${coinId}`)}>
                            Trade <ArrowUpRight size={14} className="ml-1" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
