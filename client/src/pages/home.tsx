import Header from "@/components/header";
import Hero from "@/components/hero";
import FleetSection from "@/components/fleet-section";
import HowItWorks from "@/components/how-it-works";
import FaqSection from "@/components/faq-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />
      <Hero />
      <FleetSection />
      <HowItWorks />
      <FaqSection />
      <Footer />
    </div>
  );
}
