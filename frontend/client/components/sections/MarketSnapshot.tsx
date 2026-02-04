import { useEffect, useRef } from "react";
import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Coin {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  change7d: number;
  marketCap: number;
  icon: string;
}

const sampleCoins: Coin[] = [
  {
    id: "1",
    name: "Bitcoin",
    symbol: "BTC",
    price: 42856,
    change24h: 2.34,
    change7d: 5.12,
    marketCap: 840000000000,
    icon: "₿",
  },
  {
    id: "2",
    name: "Ethereum",
    symbol: "ETH",
    price: 2341,
    change24h: -1.23,
    change7d: -2.45,
    marketCap: 281000000000,
    icon: "Ξ",
  },
  {
    id: "3",
    name: "Solana",
    symbol: "SOL",
    price: 139.45,
    change24h: 3.67,
    change7d: 8.9,
    marketCap: 61000000000,
    icon: "◎",
  },
  {
    id: "4",
    name: "Cardano",
    symbol: "ADA",
    price: 0.98,
    change24h: -0.56,
    change7d: 1.23,
    marketCap: 36000000000,
    icon: "₳",
  },
];

const MarketSnapshot = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const cards = cardsRef.current;
    if (!cards.length) return;

    cards.forEach((card, index) => {
      if (!card) return;

      gsap.fromTo(
        card,
        {
          opacity: 0,
          y: 40,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: index * 0.1,
          ease: "cubic.out",
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            end: "top 50%",
            scrub: 1,
            markers: false,
          },
        },
      );

      // Hover animation
      card.addEventListener("mouseenter", () => {
        gsap.to(card, {
          scale: 1.05,
          boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)",
          duration: 0.3,
          overwrite: "auto",
        });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          scale: 1,
          boxShadow: "none",
          duration: 0.3,
          overwrite: "auto",
        });
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(1)}B`;
    }
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    return `$${value.toLocaleString()}`;
  };

  return (
    <section id="market-snapshot" ref={containerRef} className="container mx-auto px-4 py-20">
      {/* Section Header */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <TrendingUp className="text-blue-500" size={24} />
        <h2 className="text-3xl md:text-4xl font-bold">Market Snapshot</h2>
      </div>
      <p className="text-muted-foreground mb-12 max-w-2xl mx-auto text-center">
        Top cryptocurrencies at a glance. Track real-time prices and 24-hour
        changes.
      </p>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sampleCoins.map((coin, index) => (
          <div
            key={coin.id}
            ref={(el) => {
              cardsRef.current[index] = el;
            }}
            className="glass-sm p-6 rounded-2xl cursor-pointer group"
          >
            {/* Coin Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xl font-bold">
                  {coin.icon}
                </div>
                <div>
                  <p className="font-semibold">{coin.name}</p>
                  <p className="text-sm text-muted-foreground">{coin.symbol}</p>
                </div>
              </div>
              <div
                className={cn(
                  "text-sm font-semibold px-2 py-1 rounded-lg",
                  coin.change24h >= 0
                    ? "bg-green-500/20 text-green-600 dark:text-green-400"
                    : "bg-red-500/20 text-red-600 dark:text-red-400",
                )}
              >
                {coin.change24h >= 0 ? "+" : ""}
                {coin.change24h}%
              </div>
            </div>

            {/* Price */}
            <div className="mb-4">
              <p className="text-2xl font-bold mb-2">
                ${coin.price.toLocaleString()}
              </p>
              <div className="flex items-center gap-4 text-sm">
                <span
                  className={
                    coin.change7d >= 0 ? "text-green-500" : "text-red-500"
                  }
                >
                  {coin.change7d >= 0 ? (
                    <ArrowUpRight size={16} />
                  ) : (
                    <ArrowDownRight size={16} />
                  )}
                  7d: {coin.change7d >= 0 ? "+" : ""}
                  {coin.change7d}%
                </span>
              </div>
            </div>

            {/* Market Cap */}
            <div className="pt-4 border-t border-white/10 dark:border-white/5">
              <p className="text-xs text-muted-foreground mb-1">Market Cap</p>
              <p className="font-semibold text-sm">
                {formatCurrency(coin.marketCap)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// Helper function for className merging
function cn(...classes: (string | undefined | boolean)[]) {
  return classes.filter(Boolean).join(" ");
}

export default MarketSnapshot;
