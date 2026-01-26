import MarketDataTable from "@/components/sections/MarketDataTable";

const Market = () => {
  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent mb-4">
            Market Overview
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Detailed cryptocurrency market data and analysis.
          </p>

          <div className="glass p-6 rounded-2xl max-w-3xl mx-auto mb-12 text-left">
            <h3 className="font-semibold mb-4 text-center">
              Features Coming Soon:
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                Advanced filtering (top gainers, losers, volume spikes)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                Detailed coin information and charts
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                Pagination and infinite scroll
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                Technical analysis tools
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                Custom watchlists
              </li>
            </ul>
          </div>
        </div>

        {/* Market Data Table */}
        <MarketDataTable />
      </div>
    </div>
  );
};

export default Market;
