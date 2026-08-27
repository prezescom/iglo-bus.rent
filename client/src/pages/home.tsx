import { useEffect } from "react";
import Header from "@/components/header";
import Hero from "@/components/hero";
import FleetSection from "@/components/fleet-section";
import HowItWorks from "@/components/how-it-works";
import FaqSection from "@/components/faq-section";
import Footer from "@/components/footer";
import { useLanguage } from "@/lib/i18n/use-language";
import { useDocumentHead } from "@/lib/use-document-head";

export default function Home() {
  const { t, lang } = useLanguage();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, []);

  const siteRoot = "https://www.iglo-bus.rent";
  const siteUrl = lang === "pl" ? `${siteRoot}/` : `${siteRoot}/${lang}`;
  const phone = "+48 530 410 504";
  const email = "kontakt@iglo-bus.rent";

  const pageTitle = t.meta.title;
  const pageDesc = t.meta.description;
  const ogImage = `${siteRoot}/images/og-home-1200.jpg`;

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
    description: t.meta.localBusinessDescription,
  };

  const jsonLdWebSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: siteUrl,
    name: "Iglo-Bus Rent",
  };

  const jsonLdBreadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t.meta.breadcrumbHome, item: siteUrl },
    ],
  };

  const jsonLdItemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Flota Iglo-Bus Rent",
    itemListElement: t.meta.products.map((product, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: product.name,
        description: product.description,
        offers: {
          "@type": "Offer",
          price: [350, 400, 450][i],
          priceCurrency: "PLN",
          priceSpecification: { unitText: lang === "pl" ? "za dobę" : lang === "cs" ? "za den" : "per day" },
        },
      },
    })),
  };

  useDocumentHead({
    title: pageTitle,
    description: pageDesc,
    canonical: siteUrl,
    links: [
      { rel: "alternate", hrefLang: "pl", href: `${siteRoot}/` },
      { rel: "alternate", hrefLang: "en", href: `${siteRoot}/en` },
      { rel: "alternate", hrefLang: "cs", href: `${siteRoot}/cs` },
      { rel: "alternate", hrefLang: "x-default", href: `${siteRoot}/` },
    ],
    metas: [
      { attr: "name", key: "description", content: pageDesc },
      { attr: "property", key: "og:locale", content: t.meta.ogLocale },
      { attr: "property", key: "og:url", content: siteUrl },
      { attr: "property", key: "og:title", content: pageTitle },
      { attr: "property", key: "og:description", content: pageDesc },
      { attr: "property", key: "og:image:alt", content: t.meta.ogImageAlt },
      { attr: "name", key: "twitter:title", content: pageTitle },
      { attr: "name", key: "twitter:description", content: pageDesc },
    ],
    jsonLd: [jsonLdLocalBusiness, jsonLdWebSite, jsonLdBreadcrumbs, jsonLdItemList],
  });

  const scrollToFleet = () => {
    const el = document.getElementById("flota");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />

      <main>
        <Hero onPrimaryCtaClick={scrollToFleet} />
        <FleetSection />
        <HowItWorks />
        <FaqSection />
      </main>

      <Footer />
    </div>
  );
}
