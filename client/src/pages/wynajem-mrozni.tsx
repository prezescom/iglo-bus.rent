import PageShell from "@/components/page-shell";
import PageHero from "@/components/page-hero";
import Section from "@/components/section";
import { Thermometer, Shield, CheckCircle2, Truck, Clock, Zap, Phone, Mail } from "lucide-react";
import { Link } from "wouter";

export default function WynajemMrozni() {
  const canonical = "https://www.iglo-bus.rent/wynajem-mrozni";
  const title = "Wynajem mroźni – Śląsk (Katowice, Gliwice) | Iglo-Bus Rent";
  const description =
    "Wynajem mroźni Toyota ProAce na Śląsku (Katowice, Gliwice). −20°C do +20°C, atest Sanepid, rejestrator temperatur, dostawa pod adres.";

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "Iglo-Bus Rent – Wynajem mroźni",
      url: canonical,
      telephone: "+48530410504",
      email: "kontakt@iglo-bus.rent",
      areaServed: ["Woj. śląskie", "Katowice", "Gliwice", "Zabrze", "Bytom", "Chorzów"],
      address: { "@type": "PostalAddress", addressRegion: "Śląskie", addressCountry: "PL" },
      priceRange: "$$",
      description:
        "Wynajem mroźni, chłodni i izoterm Toyota ProAce. −20°C do +20°C, atest Sanepid, rejestrator temperatur.",
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Strona główna", item: "https://www.iglo-bus.rent/" },
        { "@type": "ListItem", position: 2, name: "Wynajem mroźni", item: canonical },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Jaki jest zakres temperatur?",
          acceptedAnswer: { "@type": "Answer", text: "Zakres roboczy wynosi od −20°C do +20°C (zależnie od ustawień i warunków)." },
        },
        {
          "@type": "Question",
          name: "Czy auta mają rejestrator temperatury?",
          acceptedAnswer: { "@type": "Answer", text: "Tak, pojazdy mają rejestrację temperatury i możliwość przygotowania wydruku." },
        },
        {
          "@type": "Question",
          name: "Czy dostarczacie auto pod adres na Śląsku?",
          acceptedAnswer: { "@type": "Answer", text: "Tak, realizujemy podstawienia m.in. w Katowicach, Gliwicach i całym woj. śląskim." },
        },
      ],
    },
  ];

  return (
    <PageShell title={title} description={description} canonical={canonical} jsonLd={jsonLd}>
      <PageHero
        h1={
          <>
            Wynajem mroźni <span className="text-brand-blue">Śląsk</span>
            <span className="block mt-2 text-base sm:text-lg font-semibold text-slate-600">
              Katowice • Gliwice • dostawa pod adres
            </span>
          </>
        }
        lead={
          <>
            Toyota ProAce w rozmiarach <span className="font-semibold text-brand-blue">S / M / L</span>. Atest Sanepid,
            rejestrator temperatur, opcja podtrzymania <span className="font-semibold text-brand-blue">230V</span>.
          </>
        }
        facts={[
          { icon: <Thermometer className="h-5 w-5" />, label: "−20°C do +20°C" },
          { icon: <Shield className="h-5 w-5" />, label: "Atest Sanepid" },
          { icon: <CheckCircle2 className="h-5 w-5" />, label: "Rejestrator" },
          { icon: <Truck className="h-5 w-5" />, label: "Dostawa Śląsk" },
        ]}
        secondaryCtaHref="/kontakt"
        secondaryCtaLabel="Wyślij zapytanie"
      />

      <Section tone="soft" title="Dlaczego Iglo-Bus Rent?" subtitle="Stała jakość, szybka dostępność i jasne zasady.">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Shield, title: "Dokumenty i zgodność", desc: "Atest Sanepid i komplet dokumentów do odbiorów." },
            { icon: Thermometer, title: "Stabilna temperatura", desc: "Zakres od −20°C do +20°C, rejestracja temperatury." },
            { icon: Clock, title: "Elastyczny czas najmu", desc: "Od 1 dnia do najmu długoterminowego." },
            { icon: Truck, title: "Podstawienie pod adres", desc: "Katowice, Gliwice i całe woj. śląskie." },
            { icon: Zap, title: "230V (opcja)", desc: "Możliwość podtrzymania na postoju (zależnie od auta/konfiguracji)." },
            { icon: CheckCircle2, title: "Serwis floty", desc: "Regularne przeglądy i przygotowanie auta do wyjazdu." },
          ].map(({ icon: Icon, title, desc }, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-brand-light grid place-items-center mb-4">
                <Icon className="h-6 w-6 text-brand-blue" />
              </div>
              <h3 className="font-semibold text-brand-dark mb-2">{title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Flota i cennik" subtitle="Sprawdź rozmiary S/M/L i aktualne stawki na stronie głównej.">
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/#flota"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-brand-blue text-brand-blue font-semibold hover:bg-brand-light transition-colors"
          >
            Przejdź do floty i cennika
          </a>
          <Link href="/wynajem-chlodni">
            <button className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:border-brand-blue/40 hover:text-brand-blue transition-colors">
              Zobacz wynajem chłodni
            </button>
          </Link>
        </div>
      </Section>

      <Section tone="soft" title="FAQ" subtitle="Najczęściej zadawane pytania o wynajem mroźni.">
        <div className="grid gap-4 max-w-4xl mx-auto">
          {[
            { q: "Czy obsługujecie Katowice i Gliwice?", a: "Tak. Działamy na Śląsku i możemy dostarczyć auto pod adres." },
            { q: "Czy mogę wynająć długoterminowo?", a: "Tak. Oferujemy wynajem długoterminowy z preferencyjną stawką." },
            { q: "Czy dostanę potwierdzenie temperatury?", a: "Pojazdy mają rejestrację temperatury; w zależności od potrzeby przygotujemy wydruk/raport." },
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

      <Section title="Sprawdź dostępność" subtitle="Zadzwoń lub wyślij zapytanie — wrócimy z wyceną i dostępnością.">
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
