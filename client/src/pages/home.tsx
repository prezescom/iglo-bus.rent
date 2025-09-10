import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/header";
import Hero from "@/components/hero";
import FleetSection from "@/components/fleet-section";
import HowItWorks from "@/components/how-it-works";
import FaqSection from "@/components/faq-section";
import Footer from "@/components/footer";

export default function Home() {
  useEffect(() => {
    // Scroll do kotwicy po załadowaniu
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, []);

  // UZUPEŁNIJ jeśli masz inne dane kontaktowe
  const siteUrl = "https://www.iglo-bus.rent/";
  const phone = "+48 123 456 789";
  const email = "kontakt@iglo-bus.rent";

  const jsonLdLocalBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Iglo-Bus Rent",
    "url": siteUrl,
    "email": email,
    "telephone": phone,
    "areaServed": "PL",
    "priceRange": "PLN",
    "image": `${siteUrl}images/og-home-1200.jpg`,
    "description": "Wynajem samochodów chłodniczych i mroźni z atestem Sanepid. Krótkoterminowo i długoterminowo, szybka dostawa w całej Polsce."
  };

  const jsonLdWebSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": siteUrl,
    "name": "Iglo-Bus Rent",
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${siteUrl}?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Helmet>
        <title>Wynajem samochodów chłodniczych i mroźni – Polska | Iglo-Bus Rent</title>
        <meta
          name="description"
          content="Wypożyczalnia samochodów chłodniczych i mroźni z atestem Sanepid. Krótkoterminowo i długoterminowo – szybkie podstawienie na terenie całej Polski."
        />
        <link rel="canonical" href={siteUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:title" content="Wynajem samochodów chłodniczych i mroźni – Iglo-Bus Rent" />
        <meta
          property="og:description"
          content="Wynajem chłodni i mroźni z atestem Sanepid. Krótko- i długoterminowo, szybkie podstawienie – cała Polska."
        />
        <meta property="og:image" content={`${siteUrl}images/og-home-1200.jpg`} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Wynajem samochodów chłodniczych i mroźni – Iglo-Bus Rent" />
        <meta
          name="twitter:description"
          content="Wynajem chłodni i mroźni z atestem Sanepid. Krótko- i długoterminowo – cała Polska."
        />
        <meta name="twitter:image" content={`${siteUrl}images/og-home-1200.jpg`} />

        {/* Dane strukturalne */}
        <script type="application/ld+json">{JSON.stringify(jsonLdLocalBusiness)}</script>
        <script type="application/ld+json">{JSON.stringify(jsonLdWebSite)}</script>
      </Helmet>

      {/* Niewidoczny H1 dla SEO (nie psuje layoutu) */}
      <h1 className="sr-only">
        Wynajem samochodów chłodniczych i mroźni – Iglo-Bus Rent
      </h1>

      <Header />
      <Hero />
      <FleetSection />
      <HowItWorks />
      <FaqSection />
      <Footer />
    </div>
  );
}
