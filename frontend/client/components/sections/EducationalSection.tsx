import { Zap, Shield, Gauge, MessageSquare } from "lucide-react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const EducationalSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Animate Header
    gsap.fromTo(
      container.querySelector(".section-header"),
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: container,
          start: "top 80%",
        },
      }
    );

    // Animate Features
    featuresRef.current.forEach((feature, index) => {
      if (!feature) return;
      gsap.fromTo(
        feature,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: index * 0.1,
          scrollTrigger: {
            trigger: feature,
            start: "top 85%",
          },
        }
      );
    });
  }, []);

  const features: Feature[] = [
    {
      title: "Real-time Accuracy",
      description:
        "Get live crypto prices updated every second with precision data from top exchanges.",
      icon: <Zap size={24} />,
      color: "from-yellow-500 to-orange-500",
    },
    {
      title: "Secure & Fast",
      description:
        "Bank-level security with blazing-fast load times and 99.9% uptime guarantee.",
      icon: <Shield size={24} />,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Advanced Analytics",
      description:
        "Technical analysis tools, charts, and indicators to make informed investment decisions.",
      icon: <Gauge size={24} />,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Smart Alerts",
      description:
        "Customizable notifications for price movements, portfolio changes, and market events.",
      icon: <MessageSquare size={24} />,
      color: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <section ref={containerRef} className="container mx-auto px-4 py-20">
      {/* Section Header */}
      <div className="section-header text-center mb-16 max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Why CryptoLive?</h2>
        <p className="text-lg text-muted-foreground">
          Everything you need to track, analyze, and invest smarter in the world
          of cryptocurrency.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {features.map((feature, index) => (
          <div
            key={feature.title}
            ref={(el) => {
              featuresRef.current[index] = el;
            }}
            className="glass p-8 rounded-2xl group hover:border-blue-500/50 transition-colors"
          >
            {/* Icon */}
            <div
              className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}
            >
              {feature.icon}
            </div>

            {/* Content */}
            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Insights Section */}
      <div className="glass p-12 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 border-blue-500/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              number: "2000+",
              label: "Cryptocurrencies Tracked",
              details: "From Bitcoin to the latest altcoins",
            },
            {
              number: "100M+",
              label: "Active Users",
              details: "Traders, investors, and enthusiasts",
            },
            {
              number: "24/7",
              label: "Live Updates",
              details: "Real-time data, zero delays",
            },
          ].map((stat) => (
            <div key={stat.number} className="text-center">
              <p className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent mb-2">
                {stat.number}
              </p>
              <p className="font-semibold mb-1">{stat.label}</p>
              <p className="text-sm text-muted-foreground">{stat.details}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-16 text-center">
        <h3 className="text-2xl font-bold mb-4">
          Ready to start tracking crypto?
        </h3>
        <p className="text-muted-foreground mb-8">
          Join millions of users and take control of your crypto portfolio.
        </p>
        <SignedOut>
          <SignInButton mode="modal">
            <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all hover:scale-105 active:scale-95">
              Get Started Now
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <Link to="/market">
            <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all hover:scale-105 active:scale-95">
              Go to Market
            </button>
          </Link>
        </SignedIn>
      </div>
    </section>
  );
};

export default EducationalSection;
