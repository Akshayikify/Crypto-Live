import { ArrowRight, TrendingUp } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";

import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const HeroSection = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();

  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Mouse movement effect
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      container.style.setProperty("--mouse-x", `${x * 100}%`);
      container.style.setProperty("--mouse-y", `${y * 100}%`);
    };

    window.addEventListener("mousemove", handleMouseMove);

    // GSAP Intro Animations
    const tl = gsap.timeline();

    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    )
      .fromTo(
        textRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        "-=0.6"
      )
      .fromTo(
        buttonsRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        "-=0.6"
      );

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);


  const handleExplore = () => {
    if (isSignedIn) {
      navigate("/market");
    } else {
      const marketSection = document.getElementById("market-snapshot");
      if (marketSection) {
        marketSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleConnectWallet = () => {
    navigate("/wallet");
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-background pt-20 pb-20"
    >
      {/* Animated gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Glass container */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass-sm px-4 py-2 mb-8 animate-in fade-in">
            <TrendingUp size={16} className="text-green-500" />
            <span className="text-sm font-medium">
              Real-time Crypto Insights
            </span>
          </div>

          {/* Main Headline */}
          <h1
            ref={titleRef}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 bg-clip-text text-transparent">
              Track. Analyze.
            </span>
            <br />
            <span className="text-foreground">Invest Smarter.</span>
          </h1>

          {/* Subheading */}
          <p
            ref={textRef}
            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            Monitor real-time cryptocurrency prices, advanced analytics, and
            market insights all in one beautifully designed platform.
          </p>

          {/* CTA Buttons */}
          <div
            ref={buttonsRef}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={handleExplore}
              className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all hover:scale-105 active:scale-95"
            >
              <span className="flex items-center gap-2">
                Explore Market
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </span>
            </button>
            <button
              onClick={handleConnectWallet}
              className="px-8 py-4 rounded-xl glass hover:bg-white/20 dark:hover:bg-black/30 font-semibold transition-smooth"
            >
              Connect Wallet
            </button>
          </div>

          {/* Stat Pills */}
          <div
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in"
            style={{ animationDelay: "300ms" }}
          >
            {[
              { label: "2000+", desc: "Cryptocurrencies" },
              { label: "24/7", desc: "Real-time Updates" },
              { label: "100%", desc: "Secure & Fast" },
            ].map((stat, i) => (
              <div key={i} className="glass-sm p-4">
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  {stat.label}
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  {stat.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30"></div>
    </section>
  );
};

export default HeroSection;
