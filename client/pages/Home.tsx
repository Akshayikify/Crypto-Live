import { useEffect } from "react";
import HeroSection from "@/components/sections/HeroSection";
import MarketSnapshot from "@/components/sections/MarketSnapshot";
import PopularCoinsSlider from "@/components/sections/PopularCoinsSlider";
import MarketDataTable from "@/components/sections/MarketDataTable";
import RealTimeAnalysis from "@/components/sections/RealTimeAnalysis";
import EducationalSection from "@/components/sections/EducationalSection";

const Home = () => {
  useEffect(() => {
    // Smooth scroll behavior
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Market Snapshot */}
      <MarketSnapshot />

      {/* Popular Coins Slider */}
      <PopularCoinsSlider />

      {/* Market Data Table */}
      <MarketDataTable />

      {/* Real-Time Analysis */}
      <RealTimeAnalysis />

      {/* Educational Section */}
      <EducationalSection />
    </div>
  );
};

export default Home;
