import { useState, useEffect, useRef } from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  ChevronDown,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface TableCoin {
  id: string;
  name: string;
  symbol: string;
  logo?: string;
  price: number;
  change1h: number;
  change24h: number;
  change7d: number;
  marketCap: number;
  volume24h: number;
  circulatingSupply: number;
  lastPrice: number;
}

const tableData: TableCoin[] = [
  {
    id: "1",
    name: "CoinMarketCap",
    symbol: "CMC",
    price: 112.16,
    change1h: -0.12,
    change24h: -2.03,
    change7d: -0.57,
    marketCap: 56477317,
    volume24h: 51991899,
    circulatingSupply: 35556,
    lastPrice: 112.16,
  },
  {
    id: "2",
    name: "Bitcoin",
    symbol: "BTC",
    price: 57641.63,
    change1h: -0.23,
    change24h: -1.4,
    change7d: -3.34,
    marketCap: 1750315637780,
    volume24h: 43461706530,
    circulatingSupply: 19084,
    lastPrice: 57641.63,
  },
  {
    id: "3",
    name: "Ethereum",
    symbol: "ETH",
    price: 2361.01,
    change1h: -0.25,
    change24h: -2.8,
    change7d: -10.59,
    marketCap: 345058772278,
    volume24h: 527629873440,
    circulatingSupply: 120694,
    lastPrice: 2361.01,
  },
  {
    id: "4",
    name: "Tether",
    symbol: "USDT",
    price: 0.9987,
    change1h: 0.0,
    change24h: -0.0,
    change7d: -0.09,
    marketCap: 188648084380,
    volume24h: 98714788387,
    circulatingSupply: 186878,
    lastPrice: 0.9987,
  },
  {
    id: "5",
    name: "BNB",
    symbol: "BNB",
    price: 87.65,
    change1h: -0.24,
    change24h: -1.17,
    change7d: -5.91,
    marketCap: 118722972813,
    volume24h: 2.51,
    circulatingSupply: 136.36,
    lastPrice: 87.65,
  },
  {
    id: "6",
    name: "XRP",
    symbol: "XRP",
    price: 1.87,
    change1h: -0.18,
    change24h: -1.27,
    change7d: -4.51,
    marketCap: 114074225500,
    volume24h: 60858,
    circulatingSupply: 60.858,
    lastPrice: 1.87,
  },
];

const MarketDataTable = () => {
  const [sortKey, setSortKey] = useState<string>("marketCap");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!tableRef.current) return;

    gsap.fromTo(
      tableRef.current.querySelectorAll("tbody tr"),
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.05,
        scrollTrigger: {
          trigger: tableRef.current,
          start: "top 80%",
          markers: false,
        },
      },
    );
  }, []);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("desc");
    }
  };

  const sortedData = [...tableData].sort((a, b) => {
    const aVal = a[sortKey as keyof TableCoin];
    const bVal = b[sortKey as keyof TableCoin];
    const compare = typeof aVal === "number" ? aVal - (bVal as number) : 0;
    return sortOrder === "asc" ? compare : -compare;
  });

  const formatNumber = (value: number, decimals = 2) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  };

  const formatMarketCap = (value: number) => {
    if (value >= 1000000000000)
      return `$${(value / 1000000000000).toFixed(2)}T`;
    if (value >= 1000000000) return `$${(value / 1000000000).toFixed(2)}B`;
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    return `$${value}`;
  };

  const formatPrice = (value: number) => {
    if (value < 1) return `$${value.toFixed(4)}`;
    return `$${formatNumber(value, 2)}`;
  };

  const SortHeader = ({ label, sortBy }: { label: string; sortBy: string }) => (
    <button
      onClick={() => handleSort(sortBy)}
      className="flex items-center gap-1 hover:text-blue-500 transition-colors"
    >
      {label}
      {sortKey === sortBy && (
        <ChevronDown
          size={16}
          className={`transition-transform ${sortOrder === "asc" ? "rotate-180" : ""}`}
        />
      )}
    </button>
  );

  return (
    <section className="container mx-auto px-4 py-20">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-4">
        <TrendingUp className="text-blue-500" size={24} />
        <h2 className="text-3xl md:text-4xl font-bold">Market Data</h2>
      </div>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        Browse detailed cryptocurrency market data. Click column headers to
        sort.
      </p>

      {/* Table Container */}
      <div ref={tableRef} className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            {/* Table Header */}
            <thead className="border-b border-white/10 dark:border-white/5 bg-white/5 dark:bg-black/10">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-muted-foreground">
                  #
                </th>
                <th className="px-6 py-4 text-left font-semibold text-muted-foreground">
                  <SortHeader label="Name" sortBy="name" />
                </th>
                <th className="px-6 py-4 text-right font-semibold text-muted-foreground">
                  <SortHeader label="Price" sortBy="price" />
                </th>
                <th className="px-6 py-4 text-right font-semibold text-muted-foreground">
                  <SortHeader label="1h %" sortBy="change1h" />
                </th>
                <th className="px-6 py-4 text-right font-semibold text-muted-foreground">
                  <SortHeader label="24h %" sortBy="change24h" />
                </th>
                <th className="px-6 py-4 text-right font-semibold text-muted-foreground">
                  <SortHeader label="7d %" sortBy="change7d" />
                </th>
                <th className="px-6 py-4 text-right font-semibold text-muted-foreground">
                  <SortHeader label="Market Cap" sortBy="marketCap" />
                </th>
                <th className="px-6 py-4 text-right font-semibold text-muted-foreground">
                  <SortHeader label="Volume[24h]" sortBy="volume24h" />
                </th>
                <th className="px-6 py-4 text-right font-semibold text-muted-foreground">
                  Circulating Supply
                </th>
                <th className="px-6 py-4 text-right font-semibold text-muted-foreground">
                  Last 7 Days
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-white/10 dark:divide-white/5">
              {sortedData.map((coin, index) => (
                <tr
                  key={coin.id}
                  className="hover:bg-white/5 dark:hover:bg-black/10 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4 text-muted-foreground text-right">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                        {coin.symbol.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold">{coin.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {coin.symbol}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-semibold">
                    {formatPrice(coin.price)}
                  </td>
                  <td
                    className={`px-6 py-4 text-right font-semibold ${
                      coin.change1h >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {coin.change1h >= 0 ? "+" : ""}
                    {formatNumber(coin.change1h, 2)}%
                  </td>
                  <td
                    className={`px-6 py-4 text-right font-semibold ${
                      coin.change24h >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {coin.change24h >= 0 ? "+" : ""}
                    {formatNumber(coin.change24h, 2)}%
                  </td>
                  <td
                    className={`px-6 py-4 text-right font-semibold ${
                      coin.change7d >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {coin.change7d >= 0 ? "+" : ""}
                    {formatNumber(coin.change7d, 2)}%
                  </td>
                  <td className="px-6 py-4 text-right">
                    {formatMarketCap(coin.marketCap)}
                  </td>
                  <td className="px-6 py-4 text-right text-muted-foreground text-xs">
                    ${formatNumber(coin.volume24h / 1000000, 0)}M
                  </td>
                  <td className="px-6 py-4 text-right text-muted-foreground text-xs">
                    {formatNumber(coin.circulatingSupply, 3)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="w-12 h-6 inline-block bg-red-500/20 rounded"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default MarketDataTable;
