import PageShell from "@/components/page-shell";
import PageHero from "@/components/page-hero";
import Section from "@/components/section";
import { Thermometer, Shield, CheckCircle2, Zap, Wrench, Camera, Phone, Mail, Truck } from "lucide-react";

export default function WyposazenieSamochodowMrozni() {
  const canonical = "https://www.iglo-bus.rent/wyposazenie-samochodow-mrozni";
  const title = "Wyposażenie aut mroźni i chłodni | Iglo-Bus Rent";
  const description =
    "Wyposażenie samochodów mroźni/chłodni: rejestrator temperatury, agregat, mocowania, elementy komory i praktyczne dodatki pod dystrybucję.";

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Strona główna", item: "https://www.iglo-bus.rent/" },
        { "@type": "ListItem", position: 2, name: "Wyposażenie samochodów", item: canonical },
      ],
    },
  ];

  return (
    <PageShell title={title} description={description} canonical={canonical} jsonLd={jsonLd}>
      <PageHero
        h1={
          <>
            Wyposażenie <span className="text-brand-blue">aut mroźni i chłodni</span>
            <span className="block mt-2 text-base sm:text-lg font-semibold text-slate-600">
              Rejestracja temperatury • agregat • elementy ładowni
            </span>
          </>
        }
        lead={
          <>
            Poniżej lista najważniejszych elementów, które realnie robią różnicę w transporcie i odbiorach. Jeśli potrzebujesz
            konkretu (np. wydruków temperatury, punktów mocowania, półek) — dopasujemy auto.
          </>
        }
        facts={[
          { icon: <Thermometer className="h-5 w-5" />, label: "Kontrola temp." },
          { icon: <Shield className="h-5 w-5" />, label: "Sanepid" },
          { icon: <CheckCircle2 className="h-5 w-5" />, label: "Rejestrator" },
          { icon: <Zap className="h-5 w-5" />, label: "230V (opcja)" },
        ]}
        secondaryCtaHref="/kontakt"
        secondaryCtaLabel="Zapytaj o konfigurację"
      />

      <Section tone="soft" title="Najważniejsze elementy" subtitle="To, co najczęściej jest wymagane w praktyce.">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Thermometer, title: "Agregat chłodniczy", desc: "Utrzymanie zadanej temperatury w trakcie jazdy i postoju." },
            { icon: CheckCircle2, title: "Rejestrator temperatury", desc: "Zapisy + możliwość przygotowania potwierdzenia dla odbiorcy." },
            { icon: Shield, title: "Dokumentacja / atesty", desc: "Zestaw dokumentów potrzebnych przy odbiorach i audytach." },
            { icon: Wrench, title: "Punkty mocowania", desc: "Bezpieczne zabezpieczenie ładunku na trasie." },
            { icon: Truck, title: "Łatwy dostęp do ładowni", desc: "Rozwiązania ułatwiające dystrybucję i szybkie rozładunki." },
            { icon: Camera, title: "Wsparcie kierowcy", desc: "Ułatwienia manewrowania i pracy (zależnie od auta/wersji)." },
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

      <Section title="Wskazówki użytkowe" subtitle="Drobiazgi, które poprawiają stabilność temperatury i tempo rozładunku.">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <ul className="space-y-3 text-slate-700">
            {[
              "Stabilizuj temperaturę przed załadunkiem (kilka–kilkanaście minut).",
              "Nie blokuj nawiewów i zostaw przestrzeń na obieg powietrza.",
              "Ogranicz czas otwarcia drzwi podczas rozładunku.",
              "Zabezpiecz ładunek – przesuwanie towaru zwiększa ryzyko uszkodzeń i utraty szczelności ułożeń.",
              "Jeśli odbiorca wymaga potwierdzeń – ustal format (wydruk/raport) przed trasą.",
            ].map((t, i) => (
              <li key={i} className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-brand-blue mt-0.5" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section tone="soft" title="Dobierz auto do zadania" subtitle="Rozmiar S/M/L + wymagania od odbiorcy = szybka, trafna rekomendacja.">
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="/#flota" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-brand-blue text-brand-blue font-semibold hover:bg-brand-light transition-colors">
            Zobacz flotę i cennik
          </a>
          <a href="/wymagania-auto-chlodnia-mroznia-izoterma" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:border-brand-blue/40 hover:text-brand-blue transition-colors">
            Wymagania / dokumenty
          </a>
        </div>
      </Section>

      <Section title="Sprawdź dostępność" subtitle="Zadzwoń lub napisz — podeślemy konkretną propozycję auta.">
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
