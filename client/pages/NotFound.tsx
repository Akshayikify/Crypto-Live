import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center container mx-auto px-4">
      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent mb-4">
            404
          </h1>
          <p className="text-2xl font-semibold mb-4">Oops! Page not found</p>
          <p className="text-muted-foreground text-lg">
            The page you're looking for doesn't exist or has been moved. Let's
            get you back on track.
          </p>
        </div>

        <div className="glass p-12 rounded-2xl mb-8">
          <p className="text-muted-foreground mb-6">
            Requested path:{" "}
            <code className="text-blue-400">{location.pathname}</code>
          </p>
          <p className="text-sm text-muted-foreground">
            Need help? Check out our available pages or go back to the home
            page.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all hover:scale-105 active:scale-95"
        >
          <ArrowLeft size={20} />
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
