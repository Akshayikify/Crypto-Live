import { ArrowRight, Lock } from "lucide-react";
import { Link } from "react-router-dom";

const Wallet = () => {
  return (
    <div className="min-h-screen container mx-auto px-4 py-20 flex items-center justify-center">
      <div className="text-center max-w-2xl">
        <div className="mb-6">
          <Lock className="text-blue-500 mx-auto mb-4" size={48} />
          <div className="text-6xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent mb-4">
            Wallet
          </div>
          <p className="text-xl text-muted-foreground">
            Protected route for managing your cryptocurrency portfolio.
          </p>
        </div>

        <div className="glass p-8 rounded-2xl mb-8">
          <p className="text-muted-foreground mb-6">
            This protected page will include:
          </p>
          <ul className="text-left space-y-3 text-muted-foreground mb-6">
            <li>• Total portfolio value and P/L</li>
            <li>• Individual cryptocurrency holdings</li>
            <li>• Real-time WebSocket updates</li>
            <li>• Portfolio growth charts</li>
            <li>• Transaction history</li>
            <li>• Wallet connection integration</li>
          </ul>
          <p className="text-sm text-muted-foreground">
            Note: This page requires authentication. Continue prompting to
            implement!
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

export default Wallet;
