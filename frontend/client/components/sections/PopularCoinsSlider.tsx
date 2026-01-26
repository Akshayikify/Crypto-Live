import { useRef, useEffect } from "react";
import { TrendingUp } from "lucide-react";
import gsap from "gsap";

interface CoinSlide {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  icon: string;
  color: string;
}

const coins: CoinSlide[] = [
  {
    id: "1",
    name: "Bitcoin",
    symbol: "BTC",
    price: 42856,
    change24h: 2.34,
    icon: "₿",
    color: "from-orange-500 to-yellow-500",
  },
  {
    id: "2",
    name: "Ethereum",
    symbol: "ETH",
    price: 2341,
    change24h: -1.23,
    icon: "Ξ",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "3",
    name: "Solana",
    symbol: "SOL",
    price: 139.45,
    change24h: 3.67,
    icon: "◎",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "4",
    name: "Cardano",
    symbol: "ADA",
    price: 0.98,
    change24h: -0.56,
    icon: "₳",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "5",
    name: "Ripple",
    symbol: "XRP",
    price: 2.45,
    change24h: 1.89,
    icon: "⚡",
    color: "from-indigo-500 to-purple-500",
  },
  {
    id: "6",
    name: "Polkadot",
    symbol: "DOT",
    price: 8.67,
    change24h: -2.34,
    icon: "◉",
    color: "from-red-500 to-pink-500",
  },
];

const PopularCoinsSlider = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    // Clone coins for infinite scroll
    const allCoins = [...coins, ...coins, ...coins];

    // Animate the slider
    const tl = gsap.timeline({ repeat: -1 });
    tl.to(slider, {
      x: -slider.offsetWidth / 3,
      duration: 30,
      ease: "none",
    });

    return () => {
      tl.kill();
    };
  }, []);

  const handleMouseEnter = () => {
    if (sliderRef.current) {
      gsap.to(sliderRef.current, { duration: 0.5, timeScale: 0.5 });
    }
  };

  const handleMouseLeave = () => {
    if (sliderRef.current) {
      gsap.to(sliderRef.current, { duration: 0.5, timeScale: 1 });
    }
  };

  return (
    <section className="py-20 overflow-hidden bg-gradient-to-b from-transparent to-blue-500/5 dark:to-blue-500/10">
      <div className="container mx-auto px-4 mb-12">
        {/* Section Header */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <TrendingUp className="text-blue-500" size={24} />
          <h2 className="text-3xl md:text-4xl font-bold">Popular Coins</h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto text-center">
          Scroll through the most popular cryptocurrencies in real-time.
        </p>
      </div>

      {/* Slider Container */}
      <div
        ref={containerRef}
        className="relative overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>

        {/* Slider Content */}
        <div
          ref={sliderRef}
          className="flex gap-6 pb-4"
          style={{ width: "fit-content" }}
        >
          {[...coins, ...coins, ...coins].map((coin, index) => (
            <div
              key={`${coin.id}-${index}`}
              className="flex-shrink-0 w-72 glass-sm p-6 rounded-2xl group cursor-pointer hover:scale-105 transition-transform duration-300"
            >
              {/* Gradient Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${coin.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}
              ></div>

              {/* Content */}
              <div className="relative z-10">
                {/* Icon and Name */}
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className={`w-16 h-16 rounded-xl bg-gradient-to-br ${coin.color} flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-500/20`}
                  >
                    {coin.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{coin.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {coin.symbol}
                    </p>
                  </div>
                </div>

                {/* Price and Change */}
                <div className="space-y-2">
                  <p className="text-2xl font-bold">
                    ${coin.price.toLocaleString()}
                  </p>
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold ${coin.change24h >= 0
                      ? "bg-green-500/20 text-green-600 dark:text-green-400"
                      : "bg-red-500/20 text-red-600 dark:text-red-400"
                      }`}
                  >
                    {coin.change24h >= 0 ? "+" : ""}
                    {coin.change24h}%
                  </div>
                </div>
              </div>


            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCoinsSlider;
