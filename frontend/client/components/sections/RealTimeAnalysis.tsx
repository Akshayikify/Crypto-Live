import { useEffect, useRef } from "react";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface AnalysisMetric {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
  description: string;
}

const RealTimeAnalysis = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<(HTMLDivElement | null)[]>([]);

  const metrics: AnalysisMetric[] = [
    {
      title: "Market Dominance",
      value: "42.3%",
      change: 1.2,
      icon: <TrendingUp size={24} />,
      color: "from-blue-500 to-cyan-500",
      description: "Bitcoin dominance in total market cap",
    },
    {
      title: "Volatility Index",
      value: "68.4",
      change: -2.5,
      icon: <Activity size={24} />,
      color: "from-purple-500 to-pink-500",
      description: "Overall market volatility level",
    },
    {
      title: "Fear & Greed Index",
      value: "45",
      change: 3.1,
      icon: <TrendingUp size={24} />,
      color: "from-orange-500 to-yellow-500",
      description: "Market sentiment indicator",
    },
    {
      title: "24h Trading Volume",
      value: "$1.2T",
      change: 5.8,
      icon: <TrendingDown size={24} />,
      color: "from-green-500 to-emerald-500",
      description: "Total market trading volume",
    },
  ];

  useEffect(() => {
    const cards = metricsRef.current;
    if (!cards.length) return;

    cards.forEach((card, index) => {
      if (!card) return;

      gsap.fromTo(
        card,
        {
          opacity: 0,
          y: 40,
          rotateX: 20,
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.8,
          delay: index * 0.15,
          ease: "back.out",
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            markers: false,
          },
          perspective: 1200,
        },
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section ref={containerRef} className="container mx-auto px-4 py-20">
      {/* Section Header */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <Activity className="text-blue-500" size={24} />
        <h2 className="text-3xl md:text-4xl font-bold">Real-Time Analysis</h2>
      </div>
      <p className="text-muted-foreground mb-12 max-w-2xl mx-auto text-center">
        Stay informed with real-time market metrics and advanced analysis tools
        updated 24/7.
      </p>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div
            key={metric.title}
            ref={(el) => {
              metricsRef.current[index] = el;
            }}
            className="glass p-6 rounded-2xl relative overflow-hidden group"
            style={{ perspective: "1200px" }}
          >
            {/* Background Gradient */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
            ></div>

            {/* Icon */}
            <div
              className={`w-12 h-12 rounded-lg bg-gradient-to-br ${metric.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}
            >
              {metric.icon}
            </div>

            {/* Content */}
            <div className="relative z-10">
              <p className="text-sm text-muted-foreground mb-2">
                {metric.title}
              </p>
              <p className="text-3xl font-bold mb-2">{metric.value}</p>

              {/* Change Indicator */}
              <div className="flex items-center gap-1 mb-4">
                <span
                  className={`text-sm font-semibold ${metric.change >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                >
                  {metric.change >= 0 ? "+" : ""}
                  {metric.change}%
                </span>
                <span className="text-xs text-muted-foreground">
                  24h change
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-muted-foreground">
                {metric.description}
              </p>
            </div>


          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="mt-12 glass p-8 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold">Market Overview</h3>
            <p className="text-sm text-muted-foreground mt-1">Last 24 hours</p>
          </div>
          <div className="flex gap-2">
            {["1H", "24H", "7D", "30D"].map((period) => (
              <button
                key={period}
                className="px-4 py-2 rounded-lg hover:bg-white/10 dark:hover:bg-black/20 transition-colors text-sm font-medium"
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Placeholder Chart */}
        <div className="h-64 flex items-center justify-center rounded-lg bg-white/5 dark:bg-black/10 border border-white/10 dark:border-white/5">
          <div className="text-center">
            <div className="text-muted-foreground mb-2">
              Chart Data Visualization
            </div>
            <div className="text-sm text-muted-foreground">
              Interactive chart will display market trends here
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RealTimeAnalysis;
