import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Calendar, ArrowLeft, Phone, Mail } from "lucide-react";
import PageShell from "@/components/page-shell";
import Section from "@/components/section";
import MarkdownContent from "@/components/markdown-content";
import NotFound from "@/pages/not-found";
import { fetchPublishedPostBySlug } from "@/lib/blog";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const canonical = `https://www.iglo-bus.rent/blog/${slug}`;

  const { data: post, isLoading, isError } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: () => fetchPublishedPostBySlug(slug),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <PageShell
        title="Wczytywanie… | Iglo-Bus Rent"
        description="Wczytywanie wpisu bloga."
        canonical={canonical}
      >
        <div className="mx-auto max-w-3xl px-4 py-16 text-center text-slate-500">Wczytywanie…</div>
      </PageShell>
    );
  }

  if (isError || !post) {
    return <NotFound />;
  }

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.description,
      url: canonical,
      datePublished: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
      dateModified: new Date(post.updatedAt).toISOString(),
      publisher: {
        "@type": "Organization",
        name: "Iglo-Bus Rent",
        url: "https://www.iglo-bus.rent/",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Strona główna", item: "https://www.iglo-bus.rent/" },
        { "@type": "ListItem", position: 2, name: "Blog", item: "https://www.iglo-bus.rent/blog" },
        { "@type": "ListItem", position: 3, name: post.title, item: canonical },
      ],
    },
  ];

  return (
    <PageShell
      title={`${post.title} | Iglo-Bus Rent`}
      description={post.description}
      canonical={canonical}
      ogType="article"
      ogImage={post.imageUrl}
      jsonLd={jsonLd}
    >
      <article className="mx-auto max-w-3xl px-4 pt-10 pb-16 md:pt-14">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-brand-blue hover:underline mb-6">
          <ArrowLeft className="h-4 w-4" /> Wróć do bloga
        </Link>

        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full max-h-96 object-cover rounded-2xl mb-6"
          />
        )}

        {post.publishedAt && (
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
            <Calendar className="h-4 w-4" />
            {new Date(post.publishedAt).toLocaleDateString("pl-PL")}
          </div>
        )}

        <h1 className="text-3xl sm:text-4xl font-bold leading-tight text-brand-dark mb-4">{post.title}</h1>

        <p className="text-lg text-slate-600 leading-relaxed border-l-4 border-brand-blue/30 pl-4 mb-8">
          {post.description}
        </p>

        <MarkdownContent markdown={post.contentMarkdown} />
      </article>

      <Section tone="soft" title="Sprawdź dostępność" subtitle="Zadzwoń lub napisz — wrócimy z wyceną.">
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="tel:+48530410504"
            className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-brand-blue text-white font-bold"
          >
            <Phone className="h-5 w-5" /> +48 530 410 504
          </a>
          <a
            href="mailto:kontakt@iglo-bus.rent"
            className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl border-2 border-brand-blue text-brand-blue font-bold"
          >
            <Mail className="h-5 w-5" /> kontakt@iglo-bus.rent
          </a>
        </div>
      </Section>
    </PageShell>
  );
}
