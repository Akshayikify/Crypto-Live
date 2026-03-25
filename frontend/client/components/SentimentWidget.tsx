import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

type NewsItem = {
  title: string;
  url: string;
  sentiment: "positive" | "negative" | "neutral";
  score: number;
  published_at: string;
  source: string;
};

type Recommendation = {
  action: string;
  reasoning: string;
  color: string;
};

type SentimentData = {
  coin: string;
  overall: string;
  confidence: number;
  net_score: number;
  recommendation: Recommendation;
  news: NewsItem[];
};

export default function SentimentWidget({ coin }: { coin: string }) {
  const [data, setData] = useState<SentimentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8000/api/sentiment/?coin=${coin.toUpperCase()}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [coin]);

  const sentimentColor = {
    "strong bullish": "text-green-400",
    "bullish": "text-green-500",
    "neutral": "text-yellow-500",
    "bearish": "text-red-500",
    "strong bearish": "text-red-400",
    "positive": "text-green-500",
    "negative": "text-red-500",
  };

  const recColors = {
    green: "from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-400",
    emerald: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400",
    red: "from-red-500/20 to-rose-500/20 border-red-500/30 text-red-400",
    orange: "from-orange-500/20 to-amber-500/20 border-orange-500/30 text-orange-400",
    yellow: "from-yellow-500/20 to-orange-500/20 border-yellow-500/30 text-yellow-400",
    gray: "from-gray-500/20 to-slate-500/20 border-gray-500/30 text-gray-400",
  };

  const SentimentIcon = (overall: string) => {
    if (overall.includes("bullish")) return <TrendingUp size={18} className="text-green-400" />;
    if (overall.includes("bearish")) return <TrendingDown size={18} className="text-red-400" />;
    return <Minus size={18} className="text-yellow-500" />;
  };

  return (
    <Card className="glass border-primary/20 overflow-hidden">
      <CardHeader className="border-b border-white/10 pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-bold">Market Sentiment</CardTitle>
          {!loading && data && (
            <div className={`px-3 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-2 text-sm font-semibold ${sentimentColor[data.overall as keyof typeof sentimentColor]}`}>
              {SentimentIcon(data.overall)}
              {data.overall.toUpperCase()}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <div className="relative w-12 h-12">
               <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
               <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-xs text-muted-foreground animate-pulse">Consulting AI Advisor...</p>
          </div>
        ) : !data || data.news.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-8">No live sentiment data found for {coin}.</p>
        ) : (
          <div className="space-y-6">
            {/* Recommendation Decision */}
            <div className={`p-4 rounded-2xl border bg-gradient-to-br ${recColors[data.recommendation.color as keyof typeof recColors]}`}>
               <p className="text-[10px] uppercase tracking-widest font-bold opacity-70 mb-1">AI Recommendation</p>
               <h3 className="text-2xl font-black mb-2 tracking-tight">{data.recommendation.action}</h3>
               <p className="text-sm leading-relaxed opacity-90 font-medium">
                  {data.recommendation.reasoning}
               </p>
            </div>

            {/* Consensus & Confidence */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Confidence</p>
                <p className="text-xl font-bold text-white">{data.confidence.toFixed(1)}%</p>
                <div className="w-full bg-white/10 h-1 mt-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-1000" 
                    style={{ width: `${data.confidence}%` }} 
                  />
                </div>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Impact Score</p>
                <p className={`text-xl font-bold ${data.net_score > 0 ? 'text-green-400' : data.net_score < 0 ? 'text-red-400' : 'text-yellow-400'}`}>
                  {data.net_score > 0 ? '+' : ''}{data.net_score.toFixed(2)}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">Net market momentum</p>
              </div>
            </div>

            {/* News List */}
            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest border-b border-white/5 pb-2">Latest Intel</h4>
              <ul className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {data.news.map((item, i) => (
                  <li key={i} className="group relative">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] font-mono text-primary bg-primary/10 px-1.5 rounded">
                        {item.source}
                      </span>
                      <span className={`text-[10px] font-bold ${sentimentColor[item.sentiment as keyof typeof sentimentColor]}`}>
                        {item.sentiment.toUpperCase()}
                      </span>
                    </div>
                    <a href={item.url} target="_blank" rel="noreferrer"
                      className="text-sm font-medium text-white/90 hover:text-primary transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}