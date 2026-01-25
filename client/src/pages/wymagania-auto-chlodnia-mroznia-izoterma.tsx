import PageShell from "@/components/page-shell";
import PageHero from "@/components/page-hero";
import Section from "@/components/section";
import { Thermometer, Shield, CheckCircle2, Truck, Zap, Clock, Phone, Mail } from "lucide-react";
import { Link } from "wouter";

export default function WynajemChlodni() {
  const canonical = "https://www.iglo-bus.rent/wynajem-chlodni";
  const title = "Wynajem chłodni – Polska | Iglo-Bus Rent";
  const description =
    "Wynajem samochodów chłodni Toyota ProAce. 0°C do +20°C (i niżej w zależności od auta), atest Sanepid, rejestrator temperatury, dostawa w całej Polsce.";

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "Iglo-Bus Rent – Wynajem chłodni",
      url: canonical,
      telephone: "+48530410504",
      email: "kontakt@iglo-bus.rent",
      areaServed: "PL",
      priceRange: "$$",
      description:
        "Wynajem chłodni Toyota ProAce S/M/L. Atest Sanepid, rejestrator temperatur, dostawa w całej Polsce.",
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Strona główna", item: "https://www.iglo-bus.rent/" },
        { "@type": "ListItem", position: 2, name: "Wynajem chłodni", item: canonical },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Czy chłodnia nadaje się do cateringu i dystrybucji?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Tak. To typowe zastosowanie: catering, dystrybucja spożywcza, farmacja (w zależności od wymagań).",
          },
        },
        {
          "@type": "Question",
          name: "Czy auta mają rejestrację temperatury?",
          acceptedAnswer: { "@type": "Answer", text: "Tak, oferujemy rejestrację temperatury i możliwość przygotowania wydruku." },
        },
      ],
    },
  ];

  return (
    <PageShell title={title} description={description} canonical={canonical} jsonLd={jsonLd}>
      <PageHero
        h1={
          <>
            Wynajem <span className="text-brand-blue">chłodni</span>
            <span className="block mt-2 text-base sm:text-lg font-semibold text-slate-600">
              Dostawa w całej Polsce • Toyota ProAce S/M/L
            </span>
          </>
        }
        lead={
          <>
            Chłodnie do dystrybucji i cateringu: stabilna temperatura, atest Sanepid, rejestracja temperatury i opcja
            podtrzymania <span className="font-semibold text-brand-blue">230V</span> (w zależności od auta).
          </>
        }
        facts={[
          { icon: <Thermometer className="h-5 w-5" />, label: "Chłodnia / izoterma" },
          { icon: <Shield className="h-5 w-5" />, label: "Atest Sanepid" },
          { icon: <CheckCircle2 className="h-5 w-5" />, label: "Rejestrator" },
          { icon: <Truck className="h-5 w-5" />, label: "Dostawa PL" },
        ]}
        secondaryCtaHref="/kontakt"
        secondaryCtaLabel="Wyślij zapytanie"
      />

      <Section tone="soft" title="Zastosowania" subtitle="Najczęstsze scenariusze wynajmu chłodni.">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Truck, title: "Catering i eventy", desc: "Tymczasowe zwiększenie floty na sezon i imprezy." },
            { icon: Thermometer, title: "Dystrybucja spożywcza", desc: "Dostawy do sklepów, gastronomii i punktów odbioru." },
            { icon: Clock, title: "Zastępstwo serwisowe", desc: "Auto na czas awarii własnej chłodni." },
            { icon: Zap, title: "Postoje i rozładunki", desc: "Opcja 230V pomaga utrzymać temperaturę na postoju." },
            { icon: Shield, title: "Formalności", desc: "Dokumenty i atesty do odbiorów sanitarnych." },
            { icon: CheckCircle2, title: "Prosty proces", desc: "Szybka rezerwacja i potwierdzenie dostępności." },
          ].map(({ icon: Icon, title, desc }, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-brand-light grid place-items-center mb-4">
                <Icon className="h-6 w-6 text-brand-blue" />
              </div>
              <h3 className="font-semibold text-brand-dark mb-2">{title}</h3>
              <p className="text-slate-600 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Flota i cennik" subtitle="Aktualne ceny i rozmiary znajdziesz w sekcji floty.">
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/#flota"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-brand-blue text-brand-blue font-semibold hover:bg-brand-light transition-colors"
          >
            Przejdź do floty i cennika
          </a>
          <Link href="/wynajem-mrozni">
            <button className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:border-brand-blue/40 hover:text-brand-blue transition-colors">
              Zobacz wynajem mroźni
            </button>
          </Link>
        </div>
      </Section>

      <Section tone="soft" title="FAQ" subtitle="Najczęściej zadawane pytania o chłodnie.">
        <div className="grid gap-4 max-w-4xl mx-auto">
          {[
            { q: "Czy można jechać w trasę międzymiastową?", a: "Tak. Wynajem jest możliwy zarówno na miasto, jak i dłuższe trasy." },
            { q: "Czy auto ma rejestrator temperatury?", a: "Tak, oferujemy rejestrację temperatury i możliwość przygotowania wydruku." },
            { q: "Czy dostarczacie auto pod adres?", a: "Tak, dowozimy na terenie całej Polski (warunki zależne od terminu i logistyki)." },
          ].map((x, i) => (
            <details key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm">
              <summary className="p-5 font-semibold text-brand-dark cursor-pointer hover:text-brand-blue transition-colors">
                {x.q}
              </summary>
              <div className="px-5 pb-5 text-slate-600">{x.a}</div>
            </details>
          ))}
        </div>
      </Section>

      <Section title="Sprawdź dostępność" subtitle="Zadzwoń lub napisz — wrócimy z wyceną.">
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="tel:+48530410504" className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-brand-blue text-white font-bold">
            <Phone className="h-5 w-5" /> +48 530 410 504
          </a>
          <a href="mailto:kontakt@iglo-bus.rent" className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl border-2 border-brand-blue text-brand-blue font-bold">
            <Mail className="h-5 w-5" /> kontakt@iglo-bus.rent
          </a>
        </div>
      </Section>
    </PageShell>
  );
}
