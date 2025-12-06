import { HeroSection } from "@/components/home/hero-section";
import { FeaturedProperties } from "@/components/home/featured-properties";
import { MapSection } from "@/components/home/map-section";
import { TrustSection } from "@/components/home/trust-section";
import { CTASection } from "@/components/home/cta-section";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main>
        {/* Hero + Recherche IA */}
        <HeroSection />

        {/* Biens à découvrir */}
        <FeaturedProperties />

        {/* Carte interactive */}
        <MapSection />

        {/* Confiance & Certification */}
        <TrustSection />

        {/* Call to Action */}
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
