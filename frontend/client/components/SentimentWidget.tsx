import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

type NewsItem = {
  title: string;
  url: string;
  sentiment: "positive" | "negative" | "neutral";
  score: number;
  published: string;
};

type SentimentData = {
  coin: string;
  overall: string;
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
    positive: "text-green-500",
    negative: "text-red-500",
    neutral: "text-yellow-500",
  };

  const SentimentIcon = data?.overall === "positive"
    ? TrendingUp : data?.overall === "negative"
    ? TrendingDown : Minus;

  return (
    <Card className="glass border-primary/20">
      <CardHeader className="border-b border-white/10 pb-4">
        <CardTitle className="flex items-center gap-2">
          Market Sentiment
          {!loading && data && (
            <span className={`flex items-center gap-1 text-sm font-normal ${sentimentColor[data.overall as keyof typeof sentimentColor]}`}>
              <SentimentIcon size={16} />
              {data.overall.toUpperCase()}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : !data || data.news.length === 0 ? (
          <p className="text-muted-foreground text-sm">No sentiment data available.</p>
        ) : (
          <ul className="space-y-3">
            {data.news.map((item, i) => (
              <li key={i} className="border-b border-white/5 pb-2 last:border-0">
                <a href={item.url} target="_blank" rel="noreferrer"
                  className="text-sm text-blue-400 hover:underline line-clamp-2">
                  {item.title}
                </a>
                <span className={`text-xs mt-1 block ${sentimentColor[item.sentiment]}`}>
                  {item.sentiment.toUpperCase()} — {(item.score * 100).toFixed(0)}% confidence
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}