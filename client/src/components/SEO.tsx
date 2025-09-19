import { Helmet } from "react-helmet-async";

type SeoProps = {
  title: string;
  description?: string;
  canonical: string;            // pełny URL https://…
  noindex?: boolean;            // np. 404
  ogType?: "website" | "article";
  ogImage?: string;
  ogImageAlt?: string;
  locale?: string;              // np. "pl_PL"
  siteName?: string;            // np. "Iglo-Bus Rent"
  hreflang?: Array<{ lang: string; href: string }>; // np. [{lang:"pl", href:"…"}, {lang:"x-default", href:"…"}]
};

export default function Seo({
  title,
  description,
  canonical,
  noindex,
  ogType = "website",
  ogImage,
  ogImageAlt,
  locale = "pl_PL",
  siteName = "Iglo-Bus Rent",
  hreflang,
}: SeoProps) {
  return (
    <Helmet>
      {/* Core */}
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={canonical} />
      <meta name="robots" content={noindex ? "noindex,nofollow" : "index,follow,max-image-preview:large"} />
      {hreflang?.map(({ lang, href }) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={href} />
      ))}

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:locale" content={locale} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
      {ogImage && <meta property="og:image:width" content="1200" />}
      {ogImage && <meta property="og:image:height" content="630" />}
      {ogImageAlt && <meta property="og:image:alt" content={ogImageAlt} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      {ogImage && <meta name="twitter:image" content={ogImage} />}
    </Helmet>
  );
}
