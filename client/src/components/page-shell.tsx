import { ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/header";
import Footer from "@/components/footer";

type PageShellProps = {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  children: ReactNode;
};

export default function PageShell({
  title,
  description,
  canonical,
  ogImage = "https://www.iglo-bus.rent/images/og-home-1200.jpg",
  children,
}: PageShellProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta name="robots" content="index,follow,max-image-preview:large" />

        <meta property="og:type" content="website" />
        <meta property="og:locale" content="pl_PL" />
        <meta property="og:site_name" content="Iglo-Bus Rent" />
        <meta property="og:url" content={canonical} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>

      <Header />

      <main>{children}</main>

      <Footer />
    </div>
  );
}
