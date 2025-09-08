import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Snowflake, Phone, Mail, CheckCircle, Camera } from "lucide-react";

export default function WynajemMrozni() {
  const canonical = "https://www.iglo-bus.rent/wynajem-mrozni";
  const heroJpg = "/images/mroznie-hero-1920.jpg";
  const heroJpg1280 = "/images/mroznie-hero-1280.jpg";
  const heroJpg768 = "/images/mroznie-hero-768.jpg";
  const ogImage = heroJpg;

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Wynajem samochodów mroźni – Gliwice, Katowice, Śląsk | Iglo-Bus Rent</title>
        <meta
          name="description"
          content="Wynajem samochodów mroźni Toyota ProAce z atestem Sanepid, rejestratorem Esco DR201 i zakresem −20°C do +20°C. Krótko- i długoterminowo, Śląsk."
        />
        <link rel="canonical" href={canonical} />
        {/* Preload hero dla lepszego LCP */}
        <link
          rel="preload"
          as="image"
          href={heroJpg}
          imagesrcset={`${heroJpg768} 768w, ${heroJpg1280} 1280w, ${heroJpg} 1920w`}
          imagesizes="(max-width: 768px) 100vw, (max-width: 1280px) 100vw, 1200px"
        />
        {/* Open Graph dla sharów */}
        <meta property="og:title" content="Wynajem samochodów mroźni – Iglo-Bus Rent" />
        <meta property="og:description" content="Nowoczesne mroźnie z atestem Sanepid i rejestratorem temperatur." />
        <meta property="og:image" content={ogImage} />
        <meta property="og:type" content="website" />
        {/* JSON-LD z obrazem oferty */}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Wynajem samochodów mroźni",
          "areaServed": "śląskie",
          "provider": { "@type": "Organization", "name": "Iglo-Bus Rent" },
          "image": ogImage,
          "url": canonical
        })}</script>
      </Helmet>

      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80" data-testid="back-home">
            <ArrowLeft className="h-5 w-5 text-slate-600" />
            <div className="h-8 w-8 rounded-xl bg-sky-50 border border-sky-200 grid place-items-center">
              <Snowflake className="h-4 w-4 text-sky-600" />
            </div>
            <span className="font-semibold text-slate-800">Iglo-bus.rent</span>
          </Link>

          <a href="mailto:kontakt@iglo-bus.rent" className="text-sm font-medium flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">kontakt@iglo-bus.rent</span>
          </a>
        </div>
      </header>

      {/* HERO z fotografią */}
      <section aria-label="Samochód mroźnia – zdjęcie poglądowe" className="relative">
        <div className="mx-auto max-w-6xl px-4 pt-6 pb-10">
          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
            <picture>
              {/* jeśli masz webp, dodaj <source type="image/webp" srcSet="..."> */}
              <source media="(max-width: 768px)" srcSet={heroJpg768} />
              <source media="(max-width: 1280px)" srcSet={heroJpg1280} />
              <img
                src={heroJpg}
                alt="Samochód mroźnia Toyota ProAce – zabudowa z atestem Sanepid, rejestrator Esco DR201"
                width={1920}
                height={1080}
                fetchpriority="high"
                className="w-full h-[38vh] sm:h-[48vh] object-cover"
              />
            </picture>
          </div>

          {/* Overlay z tytułem i CTA */}
          <div className="-mt-10 sm:-mt-14 relative">
            <div className="mx-auto max-w-4xl bg-white/90 backdrop-blur rounded-2xl border border-slate-200 shadow p-6">
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
                Wynajem samochodów mroźni – Gliwice, Katowice, Śląsk
              </h1>
              <p className="text-slate-700">
                Zakres temperatur <strong>−20°C do +20°C</strong>, zabudowy z <strong>atestem Sanepid</strong>,
                rejestrator temperatur <strong>Esco DR201</strong>. Krótko- i długoterminowo, szybka dostępność i podstawienie.
              </p>

              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <a href="tel:+48123456789" className="inline-flex items-center justify-center rounded-xl bg-sky-600 text-white px-5 py-3 font-semibold hover:bg-sky-700">
                  Zadzwoń: +48 123 456 789
                </a>
                <a href="mailto:kontakt@iglo-bus.rent" className="inline-flex items-center justify-center rounded-xl border-2 border-sky-600 text-sky-700 px-5 py-3 font-semibold hover:bg-sky-50">
                  Wyślij zapytanie
                </a>
              </div>

              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
                <span className="px-2 py-1 rounded-full bg-slate-100 border">Atest Sanepid</span>
                <span className="px-2 py-1 rounded-full bg-slate-100 border">Esco DR201 – wydruk z trasy</span>
                <span className="px-2 py-1 rounded-full bg-slate-100 border">Zakres −20°C…+20°C</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 pb-16">
        {/* USP – zostawiłem Twoje punkty, lekko skrócone */}
        <section className="grid lg:grid-cols-2 gap-10 mt-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Dlaczego wynajem mroźni w Iglo-Bus Rent</h2>
            <ul className="space-y-4">
              {[
                ["Pełna zgodność", "Zabudowy z atestem Sanepid, komplet dokumentów do kontroli."],
                ["Kontrola temperatury", "Rejestrator Esco DR201 — szybkie wydruki potwierdzające łańcuch chłodniczy."],
                ["Elastyczny najem", "Dzień, tydzień, miesiąc — dopasujemy stawki do Twojej trasy."],
                ["Szybki start", "Dostępność od ręki, opcja podstawienia i szybkiej podmiany auta."]
              ].map(([t, d]) => (
                <li key={t} className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900">{t}</p>
                    <p className="text-slate-600">{d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Szybki kontakt (zostawiam) */}
          <aside className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2 text-slate-900 font-semibold mb-2">
              <Camera className="h-5 w-5 text-sky-600" />
              Szybki kontakt
            </div>
            <div className="space-y-3">
              <a href="tel:+48123456789" className="block rounded-xl border p-4 hover:border-sky-600">
                <div className="font-semibold text-slate-900">+48 123 456 789</div>
                <div className="text-sm text-slate-600">Zadzwoń teraz</div>
              </a>
              <a href="mailto:kontakt@iglo-bus.rent" className="block rounded-xl border p-4 hover:border-sky-600">
                <div className="font-semibold text-slate-900">kontakt@iglo-bus.rent</div>
                <div className="text-sm text-slate-600">Napisz e-mail</div>
              </a>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              Godziny pracy: Pon–Pt 8:00–18:00, Sob 9:00–15:00
            </p>
          </aside>
        </section>

        {/* Mini-galeria 3 zdjęć */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Jak wyglądają nasze mroźnie</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <figure className="rounded-xl overflow-hidden border">
              <img
                src="/images/mroznie-wnetrze.jpg"
                alt="Wnętrze samochodu mroźni Toyota ProAce — izoterma z półkami"
                width={1200}
                height={800}
                loading="lazy"
                className="w-full h-48 object-cover"
              />
              <figcaption className="px-3 py-2 text-xs text-slate-600">Wnętrze / półki / punkty mocowania</figcaption>
            </figure>

            <figure className="rounded-xl overflow-hidden border">
              <img
                src="/images/mroznie-flota.jpg"
                alt="Flota samochodów mroźni – różne rozmiary Toyota ProAce"
                width={1200}
                height={800}
                loading="lazy"
                className="w-full h-48 object-cover"
              />
              <figcaption className="px-3 py-2 text-xs text-slate-600">Flota: City / ProAce / Maxi</figcaption>
            </figure>

            <figure className="rounded-xl overflow-hidden border">
              <img
                src="/images/mroznie-termometr.jpg"
                alt="Rejestrator temperatur Esco DR201 – wydruk z trasy"
                width={1200}
                height={800}
                loading="lazy"
                className="w-full h-48 object-cover"
              />
              <figcaption className="px-3 py-2 text-xs text-slate-600">Rejestrator Esco DR201</figcaption>
            </figure>
          </div>
        </section>
      </main>
    </div>
  );
}