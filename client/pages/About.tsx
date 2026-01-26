import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen container mx-auto px-4 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <div className="text-6xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent mb-4">
            About CryptoLive
          </div>
          <p className="text-xl text-muted-foreground">
            Learn about our mission, technology, and roadmap.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {[
            {
              title: "Our Mission",
              content:
                "Empower users with real-time cryptocurrency insights and secure portfolio management tools.",
            },
            {
              title: "Tech Stack",
              content:
                "Built with React, TypeScript, Tailwind CSS, GSAP, and Express server for real-time updates.",
            },
            {
              title: "Security First",
              content:
                "Bank-level encryption, secure wallet integration, and compliant with international standards.",
            },
            {
              title: "Roadmap",
              content:
                "AI-powered predictions, mobile apps, advanced trading tools, and multi-chain support.",
            },
          ].map((item) => (
            <div key={item.title} className="glass p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
              <p className="text-muted-foreground">{item.content}</p>
            </div>
          ))}
        </div>

        <div className="glass p-12 rounded-2xl mb-8">
          <h3 className="text-2xl font-bold mb-6">Why Choose CryptoLive?</h3>
          <ul className="space-y-4">
            {[
              "Real-time data from multiple exchanges",
              "Secure, fast, and reliable infrastructure",
              "Beautiful, intuitive user interface",
              "Advanced analytics and insights",
              "Responsive on all devices",
              "Community-driven development",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span>{item}</span>
              </li>
            ))}
          </ul>
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

export default About;
