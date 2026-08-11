import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Calendar, ArrowRight } from "lucide-react";
import PageShell from "@/components/page-shell";
import Section from "@/components/section";
import { fetchPublishedPosts } from "@/lib/blog";

export default function Blog() {
  const canonical = "https://www.iglo-bus.rent/blog";
  const title = "Blog – Wynajem chłodni i mroźni | Iglo-Bus Rent";
  const description =
    "Poradniki i informacje o wynajmie samochodów chłodniczych i mroźni: dobór pojazdu, temperatura, atesty, organizacja transportu.";

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Strona główna", item: "https://www.iglo-bus.rent/" },
        { "@type": "ListItem", position: 2, name: "Blog", item: canonical },
      ],
    },
  ];

  const { data: posts, isLoading, isError } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: fetchPublishedPosts,
  });

  return (
    <PageShell title={title} description={description} canonical={canonical} jsonLd={jsonLd}>
      <div className="mx-auto max-w-6xl px-4 pt-10 pb-6 md:pt-14">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-brand-dark">
          Blog <span className="text-brand-blue">Iglo-Bus Rent</span>
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Praktyczna wiedza o wynajmie samochodów chłodniczych i mroźni: dobór pojazdu, temperatura, atesty i
          organizacja transportu.
        </p>
      </div>

      <Section>
        {isLoading && <p className="text-center text-slate-500">Wczytywanie wpisów…</p>}
        {isError && (
          <p className="text-center text-slate-500">Nie udało się wczytać wpisów. Spróbuj ponownie później.</p>
        )}
        {!isLoading && !isError && (!posts || posts.length === 0) && (
          <p className="text-center text-slate-500">Wkrótce pojawią się tu pierwsze wpisy.</p>
        )}

        {posts && posts.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                <article className="h-full bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-brand-blue/40 hover:shadow-md transition-all flex flex-col overflow-hidden">
                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-40 object-cover"
                      loading="lazy"
                    />
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    {post.publishedAt && (
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(post.publishedAt).toLocaleDateString("pl-PL")}
                      </div>
                    )}
                    <h2 className="font-semibold text-lg text-brand-dark mb-2 group-hover:text-brand-blue transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-slate-600 text-sm leading-relaxed flex-1">{post.description}</p>
                    <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-blue">
                      Czytaj dalej <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </Section>
    </PageShell>
  );
}
