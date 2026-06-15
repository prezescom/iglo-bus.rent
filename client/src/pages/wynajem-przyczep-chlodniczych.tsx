import { useEffect } from "react";
import PageShell from "@/components/page-shell";
import PageHero from "@/components/page-hero";
import Section from "@/components/section";
import { Thermometer, Shield, CheckCircle2, Truck, Zap, Clock, Phone, Mail } from "lucide-react";
import { Link } from "wouter";

export default function WynajemPrzyczepChlodniczych() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const canonical = "https://www.iglo-bus.rent/wynajem-przyczep-chlodniczych";
  const title = "Wynajem przyczepy chłodniczej – Polska | Iglo-Bus Rent";
  const description =
    "Wynajem przyczep chłodniczych jednoosiowych i dwuosiowych. Zakres −20°C do +10°C, agregat z podtrzymaniem 230V, możliwy dowóz. Od 200 zł/doba. Cała Polska.";

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "Iglo-Bus Rent – Wynajem przyczep chłodniczych",
      url: canonical,
      telephone: "+48530410504",
      email: "kontakt@iglo-bus.rent",
      areaServed: "PL",
      priceRange: "$$",
      description:
        "Wynajem przyczep chłodniczych S i L. Zakres −20°C do +10°C, agregat z podtrzymaniem 230V, możliwy dowóz w całej Polsce.",
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Strona główna", item: "https://www.iglo-bus.rent/" },
        { "@type": "ListItem", position: 2, name: "Wynajem przyczep chłodniczych", item: canonical },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Przyczepy chłodnicze – cennik",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: {
            "@type": "Product",
            name: "Przyczepa chłodnicza (S) – jednoosiowa",
            description: "Wymiary 250×135×150 cm, DMC 750 kg, zakres −20°C do +10°C, agregat z podtrzymaniem 230V.",
            offers: { "@type": "Offer", price: "200", priceCurrency: "PLN", priceSpecification: { unitText: "za dobę" } },
          },
        },
        {
          "@type": "ListItem",
          position: 2,
          item: {
            "@type": "Product",
            name: "Przyczepa chłodnicza (L) – dwuosiowa",
            description: "Wymiary 380×160×170 cm, DMC 2000 kg, zakres −20°C do +10°C, agregat z podtrzymaniem 230V.",
            offers: { "@type": "Offer", price: "250", priceCurrency: "PLN", priceSpecification: { unitText: "za dobę" } },
          },
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Jakie prawo jazdy jest potrzebne do holowania przyczepy chłodniczej?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Przyczepa S (DMC 750 kg) nie wymaga dodatkowych uprawnień – wystarczy kat. B. Przyczepa L (DMC 2000 kg) wymaga kat. B z rozszerzeniem o holowanie (B+E) lub kat. B uzyskaną przed 2013 rokiem.",
          },
        },
        {
          "@type": "Question",
          name: "Czy agregat chłodniczy działa podczas jazdy?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Nie. Agregat chłodniczy wymaga stałego zasilania 230V i nie działa podczas jazdy. Przed załadunkiem należy wstępnie schłodzić skrzynię ładunkową w miejscu z dostępem do prądu.",
          },
        },
        {
          "@type": "Question",
          name: "Czy dostarczacie przyczepę pod adres?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Tak, możliwy dowóz na terenie całej Polski. Warunki i koszt ustalamy indywidualnie.",
          },
        },
        {
          "@type": "Question",
          name: "Jaki jest zakres temperatur przyczep chłodniczych?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Przyczepy utrzymują temperaturę w zakresie od −20°C do +10°C, co obejmuje zarówno transport chłodzony, jak i mroźniczy.",
          },
        },
      ],
    },
  ];

  return (
    <PageShell title={title} description={description} canonical={canonical} jsonLd={jsonLd}>
      <PageHero
        h1={
          <>
            Wynajem <span className="text-brand-blue">przyczepy chłodniczej</span>
            <span className="block mt-2 text-base sm:text-lg font-semibold text-slate-600">
              Dostawa w całej Polsce • Rozmiar S i L
            </span>
          </>
        }
        lead={
          <>
            Przyczepy chłodnicze jednoosiowe i dwuosiowe z agregatem chłodniczym. Zakres temperatur{" "}
            <span className="font-semibold text-brand-blue">−20°C do +10°C</span>, podtrzymanie 230V,
            możliwy dowóz pod wskazany adres.
          </>
        }
        facts={[
          { icon: <Thermometer className="h-5 w-5" />, label: "−20°C do +10°C" },
          { icon: <Zap className="h-5 w-5" />, label: "Agregat 230V" },
          { icon: <Truck className="h-5 w-5" />, label: "Możliwy dowóz" },
          { icon: <Shield className="h-5 w-5" />, label: "Kaucja zwrotna" },
        ]}
        secondaryCtaHref="/kontakt"
        secondaryCtaLabel="Wyślij zapytanie"
      />

      <Section tone="soft" title="Dostępne przyczepy" subtitle="Dwa rozmiary – dobierz odpowiedni do potrzeb.">
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {[
            {
              name: "Przyczepa S – jednoosiowa",
              dims: "250 × 135 × 150 cm",
              dmc: "750 kg",
              price: "200 zł / doba",
              monthly: "3 000 zł / miesiąc",
              note: "Prawo jazdy kat. B – bez dodatkowych uprawnień.",
            },
            {
              name: "Przyczepa L – dwuosiowa",
              dims: "380 × 160 × 170 cm",
              dmc: "2 000 kg",
              price: "250 zł / doba",
              monthly: "3 500 zł / miesiąc",
              note: "Wymagana kat. B+E lub kat. B sprzed 2013 r.",
            },
          ].map(({ name, dims, dmc, price, monthly, note }, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h3 className="font-bold text-lg text-brand-dark mb-4">{name}</h3>
              <dl className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Wymiary wewnętrzne (d/s/w)</dt>
                  <dd className="font-semibold text-brand-dark">{dims}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">DMC</dt>
                  <dd className="font-semibold text-brand-dark">{dmc}</dd>
                </div>
                <div className="flex justify-between border-t pt-2 mt-2">
                  <dt className="text-slate-500">Cena za dobę</dt>
                  <dd className="font-bold text-brand-blue">{price}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Wynajem miesięczny</dt>
                  <dd className="font-bold text-brand-blue">{monthly}</dd>
                </div>
              </dl>
              <p className="text-xs text-slate-500 bg-slate-50 rounded-lg p-3">{note}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-slate-500 mt-4">Ceny netto. Kaucja zwrotna wg umowy. Płatność kartą.</p>
      </Section>

      <Section title="Zastosowania" subtitle="Kiedy przyczepa chłodnicza sprawdza się najlepiej?">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Truck, title: "Catering i eventy", desc: "Dodatkowa pojemność chłodnicza na imprezy plenerowe, festiwale i bankiety." },
            { icon: Thermometer, title: "Dystrybucja spożywcza", desc: "Pośredni transport chłodzony – przyczepa jedzie za ciągnikiem własnym klienta." },
            { icon: Clock, title: "Zastępstwo serwisowe", desc: "Tymczasowa chłodnia na czas awarii lub remontu własnej zabudowy." },
            { icon: Zap, title: "Punkt sprzedaży", desc: "Podłączenie 230V umożliwia pracę bez silnika – idealne na targach i stoiskach." },
            { icon: Shield, title: "Mróz i chłód w jednym", desc: "Zakres −20°C do +10°C pokrywa zarówno transport mrożonek, jak i produktów chłodzonych." },
            { icon: CheckCircle2, title: "Krótki lub długi termin", desc: "Wynajem od jednej doby do miesięcy – cennik bez progów wejścia." },
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

      <Section tone="soft" title="FAQ" subtitle="Najczęściej zadawane pytania o wynajem przyczep chłodniczych.">
        <div className="grid gap-4 max-w-4xl mx-auto">
          {[
            {
              q: "Jakie prawo jazdy jest potrzebne do holowania przyczepy chłodniczej?",
              a: "Przyczepa S (DMC 750 kg) nie wymaga dodatkowych uprawnień – wystarczy kat. B. Przyczepa L (DMC 2000 kg) wymaga kat. B+E lub kat. B uzyskanej przed 2013 rokiem.",
            },
            {
              q: "Czy agregat działa podczas jazdy?",
              a: "Nie. Agregat chłodniczy wymaga stałego zasilania 230V – nie działa podczas jazdy. Przed załadunkiem należy wstępnie schłodzić skrzynię ładunkową w miejscu z dostępem do prądu.",
            },
            {
              q: "Czy dostarczacie przyczepę pod adres?",
              a: "Tak, możliwy dowóz na terenie całej Polski. Warunki i koszt dowozu ustalamy indywidualnie przed rezerwacją.",
            },
            {
              q: "Czy można wynająć przyczepę bez ciągnika?",
              a: "Przyczepa wymaga pojazdu holującego po stronie klienta. Jeśli potrzebujesz kompleksowego rozwiązania transportowego, sprawdź naszą flotę samochodów chłodniczych.",
            },
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

      <Section title="Sprawdź dostępność" subtitle="Zadzwoń lub napisz – potwierdzimy termin i stawkę e-mailem.">
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <a href="tel:+48530410504" className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-brand-blue text-white font-bold">
            <Phone className="h-5 w-5" /> +48 530 410 504
          </a>
          <a href="mailto:kontakt@iglo-bus.rent" className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl border-2 border-brand-blue text-brand-blue font-bold">
            <Mail className="h-5 w-5" /> kontakt@iglo-bus.rent
          </a>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/#przyczepy"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-brand-blue text-brand-blue font-semibold hover:bg-brand-light transition-colors"
          >
            Przejdź do cennika przyczep
          </a>
          <Link href="/wynajem-chlodni">
            <button className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:border-brand-blue/40 hover:text-brand-blue transition-colors">
              Zobacz wynajem samochodów chłodniczych
            </button>
          </Link>
        </div>
      </Section>
    </PageShell>
  );
}
