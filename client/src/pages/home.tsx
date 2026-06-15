import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/header";
import Hero from "@/components/hero";
import FleetSection from "@/components/fleet-section";
import TrailerSection from "@/components/trailer-section";
import HowItWorks from "@/components/how-it-works";
import FaqSection from "@/components/faq-section";
import Footer from "@/components/footer";

export default function Home() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, []);

  const siteUrl = "https://www.iglo-bus.rent/";
  const phone = "+48 530 410 504";
  const email = "kontakt@iglo-bus.rent";

  const pageTitle = "Wynajem chłodni, mroźni i przyczep chłodniczych – Polska | Iglo-Bus Rent";
  const pageDesc =
    "Wynajem samochodów chłodniczych i przyczep chłodniczych z atestem Sanepid. Zakres −20°C do +10°C, rejestrator temperatur, możliwy dowóz. Cała Polska.";
  const ogImage = `${siteUrl}images/og-home-1200.jpg`;

  const jsonLdLocalBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Iglo-Bus Rent",
    url: siteUrl,
    email,
    telephone: phone.replace(/\s/g, ""),
    areaServed: "PL",
    priceRange: "PLN",
    image: ogImage,
    description:
      "Wynajem samochodów chłodniczych i przyczep chłodniczych z atestem Sanepid. Krótko i długoterminowo, możliwy dowóz w całej Polsce."
  };

  const jsonLdWebSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: siteUrl,
    name: "Iglo-Bus Rent"
  };

  const jsonLdBreadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Strona główna", item: siteUrl }
    ]
  };

  const jsonLdItemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Flota Iglo-Bus Rent",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        item: {
          "@type": "Product",
          name: "Toyota ProAce City – samochód chłodniczy (S)",
          description: "Wynajem samochodu chłodniczego ProAce City. Wymiary 175×109×104 cm, zakres −20°C do +20°C.",
          offers: { "@type": "Offer", price: "350", priceCurrency: "PLN", priceSpecification: { unitText: "za dobę" } }
        }
      },
      {
        "@type": "ListItem",
        position: 2,
        item: {
          "@type": "Product",
          name: "Toyota ProAce – samochód chłodniczy (M)",
          description: "Wynajem samochodu chłodniczego ProAce. Wymiary 238×125×113 cm, zakres −20°C do +20°C.",
          offers: { "@type": "Offer", price: "400", priceCurrency: "PLN", priceSpecification: { unitText: "za dobę" } }
        }
      },
      {
        "@type": "ListItem",
        position: 3,
        item: {
          "@type": "Product",
          name: "Toyota ProAce Maxi – samochód chłodniczy (L)",
          description: "Wynajem samochodu chłodniczego ProAce Maxi. Wymiary 302×135×180 cm, zakres −20°C do +20°C.",
          offers: { "@type": "Offer", price: "450", priceCurrency: "PLN", priceSpecification: { unitText: "za dobę" } }
        }
      },
      {
        "@type": "ListItem",
        position: 4,
        item: {
          "@type": "Product",
          name: "Przyczepa chłodnicza (S)",
          description: "Wynajem przyczepy chłodniczej jednoosiowej. Wymiary 250×135×150 cm, DMC 750 kg, zakres −20°C do +10°C.",
          offers: { "@type": "Offer", price: "200", priceCurrency: "PLN", priceSpecification: { unitText: "za dobę" } }
        }
      },
      {
        "@type": "ListItem",
        position: 5,
        item: {
          "@type": "Product",
          name: "Przyczepa chłodnicza (L)",
          description: "Wynajem przyczepy chłodniczej dwuosiowej. Wymiary 380×160×170 cm, DMC 2000 kg, zakres −20°C do +10°C.",
          offers: { "@type": "Offer", price: "250", priceCurrency: "PLN", priceSpecification: { unitText: "za dobę" } }
        }
      }
    ]
  };

  const scrollToFleet = () => {
    const el = document.getElementById("flota");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={siteUrl} />
        <meta name="robots" content="index,follow,max-image-preview:large" />

        <link rel="alternate" hrefLang="pl" href={siteUrl} />
        <link rel="alternate" hrefLang="x-default" href={siteUrl} />

        <meta property="og:type" content="website" />
        <meta property="og:locale" content="pl_PL" />
        <meta property="og:site_name" content="Iglo-Bus Rent" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Wynajem chłodni, mroźni i przyczep chłodniczych – Iglo-Bus Rent" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image" content={ogImage} />

        <script type="application/ld+json">{JSON.stringify(jsonLdLocalBusiness)}</script>
        <script type="application/ld+json">{JSON.stringify(jsonLdWebSite)}</script>
        <script type="application/ld+json">{JSON.stringify(jsonLdBreadcrumbs)}</script>
        <script type="application/ld+json">{JSON.stringify(jsonLdItemList)}</script>
      </Helmet>

      <Header />

      <main>
        <Hero onPrimaryCtaClick={scrollToFleet} />
        <FleetSection />
        <TrailerSection />
        <HowItWorks />
        <FaqSection />
      </main>

      <Footer />
    </div>
  );
}
