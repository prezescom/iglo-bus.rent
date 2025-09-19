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
  const siteUrl = "https://www.iglo-bus.rent/"; // canonical na stronę główną (z /)
  const phone = "+48 530 410 504";
  const email = "kontakt@iglo-bus.rent";

  const pageTitle = "Wynajem samochodów chłodni i mroźni – Polska | Iglo-Bus Rent";
  const pageDesc =
    "Wypożyczalnia samochodów chłodni i mroźni z atestem Sanepid. Krótko i długoterminowo – szybkie podstawienie na terenie całej Polski.";
  const ogImage = `${siteUrl}images/og-home-1200.jpg`;

  const jsonLdLocalBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Iglo-Bus Rent",
    url: siteUrl,
    email,
    telephone: phone,
    areaServed: "PL",
    priceRange: "PLN",
    image: ogImage,
    description:
      "Wynajem samochodów chłodni i mroźni z atestem Sanepid. Krótko i długoterminowo, szybka dostawa w całej Polsce."
  };

  const jsonLdWebSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: siteUrl,
    name: "Iglo-Bus Rent",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Helmet>
        {/* === Core SEO === */}
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={siteUrl} />
        <meta name="robots" content="index,follow,max-image-preview:large" />
        {/* hreflang – wersja PL i domyślna */}
        <link rel="alternate" hrefLang="pl" href={siteUrl} />
        <link rel="alternate" hrefLang="x-default" href={siteUrl} />

        {/* === Open Graph === */}
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="pl_PL" />
        <meta property="og:site_name" content="Iglo-Bus Rent" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Samochód chłodnia/mroźnia – Iglo-Bus Rent" />

        {/* === Twitter === */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image" content={ogImage} />

        {/* Dane strukturalne */}
        <script type="application/ld+json">{JSON.stringify(jsonLdLocalBusiness)}</script>
        <script type="application/ld+json">{JSON.stringify(jsonLdWebSite)}</script>
      </Helmet>

      {/* Jeden H1 (ukryty wizualnie – OK dla SEO i dostępności) */}
      <h1 className="sr-only">Wynajem samochodów chłodni i mroźni – Iglo-Bus Rent</h1>

      <Header />
      <Hero />
      <FleetSection />
      <HowItWorks />
      <FaqSection />
      <Footer />
    </div>
  );
}
