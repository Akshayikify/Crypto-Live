import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWallet } from "@/hooks/useWallet";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface TradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    coinId: string;
    coinName: string;
    currentPrice: number;
}

export default function TradeModal({ isOpen, onClose, coinId, coinName, currentPrice }: TradeModalProps) {
    const { wallet, executeTrade } = useWallet();
    const [activeTab, setActiveTab] = useState<"BUY" | "SELL">("BUY");
    const [quantity, setQuantity] = useState<string>("");
    const [processing, setProcessing] = useState(false);

    const quantityNum = parseFloat(quantity) || 0;
    const totalCost = quantityNum * currentPrice;

    const currentAssetBalance = wallet?.assets[coinId] || 0;
    const currentUsdBalance = wallet?.balance || 0;

    const handleTrade = async () => {
        if (quantityNum <= 0) return;

        setProcessing(true);
        try {
            await executeTrade(coinId, activeTab, quantityNum);
            toast.success(`Successfully ${activeTab === 'BUY' ? 'bought' : 'sold'} ${quantityNum} ${coinName}`);
            onClose();
            setQuantity("");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setProcessing(false);
        }
    };

    const setMax = () => {
        if (activeTab === "BUY") {
            // Max quantity I can buy with my balance
            setQuantity((currentUsdBalance / currentPrice).toFixed(6));
        } else {
            // Max quantity I can sell is what I own
            setQuantity(currentAssetBalance.toString());
        }
    };

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(val);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="glass border-primary/20 sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Trade {coinName}</DialogTitle>
                    <DialogDescription>
                        Current Price: <span className="text-foreground font-mono font-bold">{formatCurrency(currentPrice)}</span>
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="BUY" onValueChange={(v) => setActiveTab(v as "BUY" | "SELL")} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="BUY" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-500">Buy</TabsTrigger>
                        <TabsTrigger value="SELL" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-500">Sell</TabsTrigger>
                    </TabsList>

                    <div className="py-4 space-y-4">
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Available Balance:</span>
                            <span className="font-mono">
                                {wallet ? (activeTab === "BUY" ? formatCurrency(currentUsdBalance) : `${currentAssetBalance} ${coinName}`) : "Loading..."}
                            </span>
                        </div>

                        <div className="space-y-2">
                            <Label>Quantity ({coinName})</Label>
                            <div className="flex gap-2">
                                <Input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    placeholder="0.00"
                                    placeholder="0.00"
                                    className="font-mono text-black dark:text-white bg-white/50 dark:bg-black/50 border-white/20"
                                />
                                <Button variant="outline" onClick={setMax}>Max</Button>
                            </div>
                        </div>

                        <div className="p-4 rounded-lg bg-secondary/50 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Estimate Cost</span>
                                <span className="font-bold font-mono">{formatCurrency(totalCost)}</span>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            onClick={handleTrade}
                            disabled={processing || quantityNum <= 0 || (activeTab === "BUY" && totalCost > currentUsdBalance) || (activeTab === "SELL" && quantityNum > currentAssetBalance)}
                            className={`w-full ${activeTab === 'BUY' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                        >
                            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {activeTab} {coinName}
                        </Button>
                    </DialogFooter>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
