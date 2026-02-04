import { ArrowRight, CheckCircle2, Shield, Zap, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen container mx-auto px-4 py-20">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Header Section */}
        <div className="text-center md:text-left">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent mb-6">
            About CryptoLive
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            CryptoLive is a modern cryptocurrency market intelligence platform
            designed to help users track, analyze, and understand the crypto
            market in real time. Our goal is to make crypto data transparent,
            accessible, and actionable—whether you are a beginner exploring
            digital assets or an enthusiast monitoring market movements.
          </p>
          <div className="mt-6 p-6 glass rounded-xl border-l-4 border-blue-500">
            <p className="italic text-muted-foreground">
              "CryptoLive combines real-time market data, powerful analytics,
              and a clean, responsive interface to deliver a seamless
              crypto-tracking experience across devices."
            </p>
          </div>
        </div>

        {/* What We Offer */}
        <div>
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <Globe className="text-blue-500" />
            What We Offer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Real-Time Market Insights",
                desc: "Stay updated with live cryptocurrency prices, market capitalization, trading volume, and 24-hour price movements. CryptoLive ensures you never miss important market changes.",
              },
              {
                title: "Advanced Market Exploration",
                desc: "Discover top gainers, top losers, and high-volume cryptocurrencies with smart filtering and sorting tools designed for quick decision-making.",
              },
              {
                title: "Detailed Coin Analysis",
                desc: "Dive deep into individual cryptocurrencies with interactive charts, historical price data, and key metrics that help you understand market trends better.",
              },
              {
                title: "Personalized Watchlists",
                desc: "Create and manage your own watchlist to track favorite cryptocurrencies and monitor their performance in one place.",
              },
            ].map((item, i) => (
              <div key={i} className="glass p-6 rounded-2xl hover:bg-white/5 transition-colors">
                <h3 className="text-xl font-bold mb-3 text-cyan-500">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Performance & Security Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Built for Performance */}
          <div className="glass p-8 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Zap size={100} />
            </div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Zap className="text-yellow-500" />
              Built for Performance
            </h2>
            <p className="text-muted-foreground mb-6">
              CryptoLive is built using modern web technologies and follows
              industry-grade architecture principles. We prioritize performance,
              reliability, and user experience at every layer.
            </p>
            <ul className="space-y-3">
              {[
                "Optimized APIs for fast data delivery",
                "Efficient caching for reduced latency",
                "Secure authentication for personalized features",
                "Scalable backend design for future growth",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 size={18} className="text-green-500 mt-1 shrink-0" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Security & Transparency */}
          <div className="glass p-8 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Shield size={100} />
            </div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Shield className="text-green-500" />
              Security & Transparency
            </h2>
            <p className="text-muted-foreground mb-6">
              User security is a top priority at CryptoLive. Our system is
              designed to be secure, non-custodial, and transparent.
            </p>
            <ul className="space-y-3">
              {[
                "Authentication via secure identity solutions",
                "Backend validation for sensitive operations",
                "No private keys or confidential wallet data stored",
                "Transparent data sourcing",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 size={18} className="text-blue-500 mt-1 shrink-0" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Why CryptoLive */}
        <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-8 rounded-3xl border border-blue-500/20">
          <h2 className="text-3xl font-bold mb-8 text-center">Why CryptoLive?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              "Clean and intuitive user interface",
              "Real-time market updates",
              "Feature-rich market exploration",
              "Secure and scalable architecture",
              "Designed for learning & real-world usage",
              "Community-focused development",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 glass-sm p-4 rounded-xl">
                <div className="w-2 h-2 rounded-full bg-cyan-500 box-shadow-glow"></div>
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center pt-8">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold transition-all hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25"
          >
            Back to Home
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
