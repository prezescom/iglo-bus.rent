import PageShell from "@/components/page-shell";
import PageHero from "@/components/page-hero";
import Section from "@/components/section";
import { Phone, Mail, MapPin, Clock, CheckCircle2, Thermometer, Shield, Truck } from "lucide-react";

export default function Contact() {
  const canonical = "https://www.iglo-bus.rent/kontakt";
  const title = "Kontakt – wynajem chłodni i mroźni | Iglo-Bus Rent";
  const description =
    "Kontakt do Iglo-Bus Rent: wynajem aut chłodni i mroźni. Zadzwoń lub napisz — podaj termin, trasę i temperaturę, a wrócimy z dostępnością i wyceną.";

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      url: canonical,
      name: "Kontakt – Iglo-Bus Rent",
      description,
    },
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "Iglo-Bus Rent",
      url: "https://www.iglo-bus.rent/",
      telephone: "+48530410504",
      email: "kontakt@iglo-bus.rent",
      areaServed: "PL",
      priceRange: "$$",
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Strona główna", item: "https://www.iglo-bus.rent/" },
        { "@type": "ListItem", position: 2, name: "Kontakt", item: canonical },
      ],
    },
  ];

  return (
    <PageShell title={title} description={description} canonical={canonical} jsonLd={jsonLd}>
      <PageHero
        h1={
          <>
            Kontakt <span className="text-brand-blue">Iglo-Bus Rent</span>
            <span className="block mt-2 text-base sm:text-lg font-semibold text-slate-600">
              Wynajem chłodni i mroźni • S/M/L • Dostawa PL
            </span>
          </>
        }
        lead={
          <>
            Najszybciej: telefon. Jeśli wolisz e-mail — podaj termin, trasę (miasto/miasta) i wymaganą temperaturę,
            a odeślemy dostępność i wycenę.
          </>
        }
        facts={[
          { icon: <Thermometer className="h-5 w-5" />, label: "−20°C do +20°C" },
          { icon: <Shield className="h-5 w-5" />, label: "Atest Sanepid" },
          { icon: <Truck className="h-5 w-5" />, label: "Dostawa PL" },
          { icon: <CheckCircle2 className="h-5 w-5" />, label: "S / M / L" },
        ]}
        primaryCtaHref="tel:+48530410504"
        primaryCtaLabel="Zadzwoń: +48 530 410 504"
        secondaryCtaHref="mailto:kontakt@iglo-bus.rent"
        secondaryCtaLabel="Napisz: kontakt@iglo-bus.rent"
      />

      <Section tone="soft" title="Dane kontaktowe" subtitle="Wybierz najszybszy kanał — telefon albo e-mail.">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="h-12 w-12 rounded-xl bg-brand-light grid place-items-center mb-4">
              <Phone className="h-6 w-6 text-brand-blue" />
            </div>
            <h3 className="font-semibold text-brand-dark mb-2">Telefon</h3>
            <a href="tel:+48530410504" className="text-brand-blue font-bold text-lg hover:underline">
              +48 530 410 504
            </a>
            <p className="text-sm text-slate-600 mt-2">
              Najszybsza odpowiedź: dostępność, cena i dobór rozmiaru.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="h-12 w-12 rounded-xl bg-brand-light grid place-items-center mb-4">
              <Mail className="h-6 w-6 text-brand-blue" />
            </div>
            <h3 className="font-semibold text-brand-dark mb-2">E-mail</h3>
            <a href="mailto:kontakt@iglo-bus.rent" className="text-brand-blue font-bold text-lg hover:underline">
              kontakt@iglo-bus.rent
            </a>
            <p className="text-sm text-slate-600 mt-2">
              Wyślij krótki opis — odeślemy wycenę i warunki.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="h-12 w-12 rounded-xl bg-brand-light grid place-items-center mb-4">
              <Clock className="h-6 w-6 text-brand-blue" />
            </div>
            <h3 className="font-semibold text-brand-dark mb-2">Godziny</h3>
            <p className="text-slate-700 font-semibold">Pn–Pt: 8:00–18:00</p>
            <p className="text-sm text-slate-600 mt-2">
              Po godzinach — zostaw SMS/e-mail, wrócimy do Ciebie.
            </p>
          </div>
        </div>
      </Section>

      <Section title="Jak napisać zapytanie, żeby dostać szybką wycenę" subtitle="Wystarczą 3 informacje — resztę doprecyzujemy.">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <ul className="space-y-3 text-slate-700">
            {[
              "Termin: od–do (data + godzina).",
              "Trasa/miasto: skąd–dokąd (lub województwo) + czy potrzebujesz dostawy pod adres.",
              "Temperatura: wymagana (np. +2°C, +6°C, −18°C) i rodzaj ładunku (spożywka/catering/inne).",
              "Szacowany przebieg i czy wyjazd za granicę (jeśli dotyczy).",
            ].map((t, i) => (
              <li key={i} className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-brand-blue mt-0.5" />
                <span>{t}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <a
              href="mailto:kontakt@iglo-bus.rent?subject=Zapytanie%20o%20wynajem%20ch%C5%82odni%2Fmro%C5%BAni&body=Termin%3A%0ATrasa%2Fmiasto%3A%0ATemperatura%3A%0A%C5%81adunek%3A%0ASzac.%20przebieg%3A%0ADostawa%20pod%20adres%3A%20tak%2Fnie%0A"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-blue text-white font-semibold hover:bg-brand-blue/90 transition-colors"
            >
              <Mail className="h-5 w-5" />
              Napisz z szablonu
            </a>

            <a
              href="/#flota"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-brand-blue text-brand-blue font-semibold hover:bg-brand-light transition-colors"
            >
              <Truck className="h-5 w-5" />
              Zobacz flotę i cennik
            </a>
          </div>
        </div>
      </Section>

      <Section tone="soft" title="Lokalizacja" subtitle="Działamy w całej Polsce — podstawienie ustalamy indywidualnie.">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-brand-light grid place-items-center">
              <MapPin className="h-5 w-5 text-brand-blue" />
            </div>
            <div>
              <p className="font-semibold text-brand-dark">Obsługa: Polska (w tym Śląsk: Katowice, Gliwice)</p>
              <p className="text-sm text-slate-600 mt-1">
                Jeśli zależy Ci na podstawieniu „na jutro” — zadzwoń, sprawdzimy logistykę.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Sprawdź dostępność teraz" subtitle="Najczęściej wystarczy krótka rozmowa, żeby dobrać auto i potwierdzić cenę.">
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
