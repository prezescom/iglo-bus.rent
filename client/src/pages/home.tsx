import { useEffect } from "react";
import Header from "@/components/header";
import Hero from "@/components/hero";
import FleetSection from "@/components/fleet-section";
import HowItWorks from "@/components/how-it-works";
import FaqSection from "@/components/faq-section";
import Footer from "@/components/footer";

export default function Home() {
  useEffect(() => {
    // Handle scrolling to anchor on page load
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100); // Small delay to ensure page is fully rendered
    }
  }, []);

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
