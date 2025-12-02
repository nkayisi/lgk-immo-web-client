import { HeroSection } from "@/components/home/hero-section";
import { SearchModule } from "@/components/home/search-module";
import { FeaturedProperties } from "@/components/home/featured-properties";
import { MarketProblems } from "@/components/home/market-problems";
import { ToolsSection } from "@/components/home/tools-section";
import { MarketInsights } from "@/components/home/market-insights";
import { InteractiveMap } from "@/components/home/interactive-map";
import { CTASection } from "@/components/home/cta-section";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <main>
        {/* Hero Section - Introduction immobilière RDC */}
        <HeroSection />

        {/* Module de recherche premium */}
        <SearchModule />

        {/* Problèmes du marché RDC + Solutions LGK */}
        <MarketProblems />

        {/* Offres du moment - Propriétés certifiées */}
        <FeaturedProperties />

        {/* Outils innovants LGK-IMMO */}
        <ToolsSection />

        {/* Cartographie interactive des risques */}
        <InteractiveMap />

        {/* Baromètres & Insights immobiliers */}
        <MarketInsights />

        {/* Call to Action final */}
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
