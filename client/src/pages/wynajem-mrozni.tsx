import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Snowflake, Clock, CheckCircle, Phone, Mail } from "lucide-react";

export default function WynajemMrozni() {
  const phone = "+48 123 456 789"; // podmień na właściwy numer
  const phoneHref = "tel:+48123456789"; // podmień jeśli zmienisz numer

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Ile kosztuje wynajem samochodu mroźni na 1 dzień?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Cena zależy od modelu, przebiegu i terminu. Zadzwoń lub napisz — przygotujemy szybką wycenę."
        }
      },
      {
        "@type": "Question",
        name: "Czy otrzymam wydruk temperatur dla odbiorcy?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Tak. Rejestrator Esco DR201 umożliwia szybki wydruk historii temperatur z całej trasy."
        }
      },
      {
        "@type": "Question",
        name: "Czy mogę wynająć mroźnię długoterminowo (1–3 miesiące i dłużej)?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Tak. Przy najmie długoterminowym oferujemy preferencyjne stawki i serwis w cenie."
        }
      }
    ]
  };

  const businessLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Iglo-Bus Rent",
    url: "https://www.iglo-bus.rent/wynajem-mrozni",
    telephone: phone,
    areaServed: "Śląskie",
    address: { "@type": "PostalAddress", addressRegion: "Śląskie", addressCountry: "PL" },
    priceRange: "$$"
  };

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Strona główna", item: "https://www.iglo-bus.rent/" },
      { "@type": "ListItem", position: 2, name: "Wynajem mroźni", item: "https://www.iglo-bus.rent/wynajem-mrozni" }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* SEO */}
      <Helmet>
        <title>Wynajem samochodów mroźni – Gliwice, Katowice, Śląsk | Iglo-Bus Rent</title>
        <meta
          name="description"
          content="Wynajem samochodów mroźni (-20°C do +20°C) na Śląsku. Zabudowy z atestem Sanepid, rejestrator temperatur Esco DR201, wynajem krótko- i długoterminowy. Gliwice, Katowice i okolice."
        />
        <link rel="canonical" href="https://www.iglo-bus.rent/wynajem-mrozni" />
        <meta name="robots" content="index,follow" />
        <script type="application/ld+json">{JSON.stringify(businessLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbsLd)}</script>
      </Helmet>

      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between" role="navigation" aria-label="Główna nawigacja">
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            data-testid="back-home"
            aria-label="Wróć na stronę główną"
          >
            <ArrowLeft className="h-5 w-5 text-slate-600" />
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-brand-light border border-brand-blue/20 grid place-items-center" aria-hidden="true">
                <Snowflake className="h-4 w-4 text-brand-blue" />
              </div>
              <span className="font-semibold text-brand-dark">Iglo-bus.rent</span>
            </div>
          </Link>

          <nav className="hidden sm:flex items-center gap-6 text-sm">
            <Link href="/flota" className="hover:text-brand-blue transition-colors">Flota</Link>
            <Link href="/kontakt" className="hover:text-brand-blue transition-colors">Kontakt</Link>
            <Link href="/wynajem-mrozni" className="text-brand-blue font-medium" aria-current="page">Wynajem mroźni</Link>
          </nav>

          <div className="text-sm" data-testid="contact-email">
            <a href="mailto:kontakt@iglo-bus.rent" className="hover:text-brand-blue transition-colors font-medium flex items-center gap-1">
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">kontakt@iglo-bus.rent</span>
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        {/* HERO */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-brand-dark mb-4">
            Wynajem samochodów <span className="whitespace-nowrap">mroźni – Gliwice, Katowice, Śląsk</span>
          </h1>
          <p className="text-lg text-slate-700 max-w-3xl mx-auto">
            Zakres temperatur <strong>-20°C do +20°C</strong>, zabudowy z <strong>atestem Sanepid</strong>,
            <strong> rejestrator temperatur Esco DR201</strong> (wydruki). Wynajem krótko- i długoterminowy,
            szybka dostępność i podstawienie pod adres.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <a href={phoneHref} className="bg-brand-blue text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-colors" data-testid="cta-hero-phone">
              Zadzwoń: {phone}
            </a>
            <a href="mailto:kontakt@iglo-bus.rent" className="border-2 border-brand-blue text-brand-blue font-semibold px-6 py-3 rounded-xl hover:bg-brand-blue hover:text-white transition-colors" data-testid="cta-hero-email">
              Wyślij zapytanie
            </a>
          </div>

          <p className="text-sm text-slate-500 mt-2">
            → Zobacz też naszą <Link href="/flota" className="underline hover:text-brand-blue">pełną flotę</Link>
          </p>
        </div>

        {/* KORZYŚCI */}
        <section aria-labelledby="benefits" className="grid lg:grid-cols-2 gap-12 items-start mb-16">
          <div>
            <h2 id="benefits" className="text-2xl font-bold text-brand-dark mb-6">
              Dlaczego wynajem mroźni w Iglo-Bus Rent
            </h2>
            <div className="space-y-4">
              {[
                ["Pełna zgodność", "Zabudowy z atestem Sanepid, komplet dokumentów dla kontroli."],
                ["Kontrola temperatury", "Rejestrator Esco DR201 — szybkie wydruki potwierdzające łańcuch chłodniczy."],
                ["Elastyczny najem", "Dzień, tydzień, miesiąc — dopasujemy stawki do Twojej trasy."],
                ["Szybki start", "Dostępność od ręki, opcja podstawienia i szybkiej podmiany auta."],
              ].map(([title, desc]) => (
                <div key={title} className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-brand-dark">{title}</h3>
                    <p className="text-slate-600">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* KARTA KONTAKTU */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <div className="text-center mb-6">
              <Clock className="h-12 w-12 text-brand-blue mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-brand-dark mb-2">Szybki kontakt</h3>
              <p className="text-slate-600">Zadzwoń lub napisz — odpowiadamy zwykle w kilkanaście minut.</p>
            </div>

            <div className="space-y-4">
              <a href={phoneHref} className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-brand-blue transition-colors group" data-testid="phone-contact">
                <Phone className="h-5 w-5 text-brand-blue" />
                <div>
                  <div className="font-medium text-brand-dark group-hover:text-brand-blue transition-colors">{phone}</div>
                  <div className="text-sm text-slate-500">Zadzwoń teraz</div>
                </div>
              </a>

              <a href="mailto:kontakt@iglo-bus.rent" className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-brand-blue transition-colors group" data-testid="email-contact">
                <Mail className="h-5 w-5 text-brand-blue" />
                <div>
                  <div className="font-medium text-brand-dark group-hover:text-brand-blue transition-colors">kontakt@iglo-bus.rent</div>
                  <div className="text-sm text-slate-500">Napisz e-mail</div>
                </div>
              </a>
            </div>

            <div className="mt-6 p-4 bg-brand-light/30 rounded-xl">
              <p className="text-sm text-slate-600 text-center">
                <strong>Godziny pracy</strong><br />
                Pon–Pt: 8:00–18:00 • Sob: 9:00–15:00
              </p>
            </div>
          </div>
        </section>

        {/* PARAMETRY + ZASTOSOWANIA */}
        <section aria-labelledby="params" className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 id="params" className="text-xl font-bold text-brand-dark mb-3">Parametry techniczne mroźni</h2>
            <ul className="list-disc pl-5 text-slate-700">
              <li>Zakres temperatur: <strong>-20°C do +20°C</strong></li>
              <li>Typy zabudów: izotermy / chłodnie / mroźnie</li>
              <li>Rejestrator temperatur: <strong>Esco DR201</strong> (wydruk z trasy)</li>
              <li>Zasilanie postojowe: opcjonalnie <strong>230V</strong></li>
              <li>Wyposażenie: półki, punkty mocowania ładunku</li>
            </ul>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-brand-dark mb-3">Do czego najlepiej sprawdza się mroźnia</h2>
            <p className="text-slate-700">
              Piekarnie, cukiernie, firmy cateringowe, hurtownie spożywcze oraz dystrybutorzy mięsa, ryb i lodów — wszędzie tam,
              gdzie wymagana jest ciągłość łańcucha chłodniczego i wiarygodna rejestracja temperatur.
            </p>
          </div>
        </section>

        {/* FAQ (widoczne + LD) */}
        <section aria-labelledby="faq" className="mb-16">
          <h2 id="faq" className="text-2xl font-bold text-brand-dark mb-4">FAQ — wynajem mroźni</h2>
          <div className="grid gap-3">
            <details className="rounded-xl border border-slate-200 bg-white p-4">
              <summary className="font-semibold cursor-pointer">Ile kosztuje wynajem samochodu mroźni na 1 dzień?</summary>
              <p className="mt-2 text-slate-700">
                Stawka zależy od modelu i przebiegu. Podaj termin i trasę — przygotujemy wycenę.
              </p>
            </details>
            <details className="rounded-xl border border-slate-200 bg-white p-4">
              <summary className="font-semibold cursor-pointer">Czy dostanę wydruk temperatur dla odbiorcy?</summary>
              <p className="mt-2 text-slate-700">
                Tak. Rejestrator Esco DR201 umożliwia szybki wydruk historii temperatur z całej trasy.
              </p>
            </details>
            <details className="rounded-xl border border-slate-200 bg-white p-4">
              <summary className="font-semibold cursor-pointer">Czy mogę wynająć mroźnię długoterminowo?</summary>
              <p className="mt-2 text-slate-700">
                Tak. Przy najmie długoterminowym oferujemy korzystne stawki oraz serwis w cenie.
              </p>
            </details>
          </div>
        </section>

        {/* CTA KOŃCOWE + LINKOWANIE WEWNĘTRZNE */}
        <div className="bg-gradient-to-r from-brand-blue to-blue-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Sprawdź dostępność mroźni na Twój termin</h2>
          <p className="text-lg mb-6 opacity-90">Zadzwoń lub napisz — odpowiadamy szybko.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={phoneHref} className="bg-white text-brand-blue font-semibold px-8 py-3 rounded-xl hover:bg-slate-50 transition-colors" data-testid="cta-phone">
              Zadzwoń teraz
            </a>
            <a href="mailto:kontakt@iglo-bus.rent" className="border-2 border-white text-white font-semibold px-8 py-3 rounded-xl hover:bg-white hover:text-brand-blue transition-colors" data-testid="cta-email">
              Wyślij e-mail
            </a>
          </div>
          <p className="mt-4 text-white/90 text-sm">
            Auta dostępne od ręki. Zobacz też <Link href="/flota" className="underline">pełną flotę</Link> lub przejdź do <Link href="/kontakt" className="underline">kontaktu</Link>.
          </p>
        </div>
      </main>
    </div>
  );
}