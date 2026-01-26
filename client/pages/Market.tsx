import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Market = () => {
  return (
    <div className="min-h-screen container mx-auto px-4 py-20 flex items-center justify-center">
      <div className="text-center max-w-2xl">
        <div className="mb-6">
          <div className="text-6xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent mb-4">
            Market
          </div>
          <p className="text-xl text-muted-foreground">
            Advanced market analysis, filtering, and detailed cryptocurrency
            information.
          </p>
        </div>

        <div className="glass p-8 rounded-2xl mb-8">
          <p className="text-muted-foreground mb-6">This page will include:</p>
          <ul className="text-left space-y-3 text-muted-foreground mb-6">
            <li>• Advanced filtering (top gainers, losers, volume spikes)</li>
            <li>• Detailed coin information and charts</li>
            <li>• Pagination and infinite scroll</li>
            <li>• Technical analysis tools</li>
            <li>• Custom watchlists</li>
          </ul>
          <p className="text-sm text-muted-foreground">
            Continue prompting to implement these features!
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass hover:bg-white/20 dark:hover:bg-black/30 transition-smooth"
        >
          Back to Home
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
};

export default Market;
