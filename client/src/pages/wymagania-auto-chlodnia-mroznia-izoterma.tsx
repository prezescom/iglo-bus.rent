import PageShell from "@/components/page-shell";
import PageHero from "@/components/page-hero";
import Section from "@/components/section";
import { Shield, CheckCircle2, Thermometer, FileText, Truck, Phone, Mail } from "lucide-react";

export default function WymaganiaAutoChlodniaMrozniaIzoterma() {
  const canonical = "https://www.iglo-bus.rent/wymagania-auto-chlodnia-mroznia-izoterma";
  const title = "Wymagania: auto chłodnia / mroźnia / izoterma | Iglo-Bus Rent";
  const description =
    "Wymagania i praktyczne wskazówki dla transportu w kontrolowanej temperaturze: dokumenty, atesty, rejestracja temperatury i higiena.";

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Strona główna", item: "https://www.iglo-bus.rent/" },
        { "@type": "ListItem", position: 2, name: "Wymagania prawne", item: canonical },
      ],
    },
  ];

  return (
    <PageShell title={title} description={description} canonical={canonical} jsonLd={jsonLd}>
      <PageHero
        h1={
          <>
            Wymagania dla <span className="text-brand-blue">chłodni, mroźni i izoterm</span>
            <span className="block mt-2 text-base sm:text-lg font-semibold text-slate-600">
              Dokumenty • rejestracja temperatury • higiena
            </span>
          </>
        }
        lead={
          <>
            Zebrane w jednym miejscu: co zwykle jest wymagane przy odbiorach i transporcie w kontrolowanej temperaturze.
            Jeśli masz specyficzne wymagania (np. odbiorca, audyt), wyślij zapytanie — dopasujemy auto i dokumenty.
          </>
        }
        facts={[
          { icon: <Shield className="h-5 w-5" />, label: "Zgodność i dokumenty" },
          { icon: <Thermometer className="h-5 w-5" />, label: "Kontrola temperatury" },
          { icon: <FileText className="h-5 w-5" />, label: "Procedury" },
          { icon: <Truck className="h-5 w-5" />, label: "Transport" },
        ]}
        secondaryCtaHref="/kontakt"
        secondaryCtaLabel="Zapytaj o dokumenty"
      />

      <Section tone="soft" title="Najczęstsze wymagania (praktycznie)" subtitle="To nie porada prawna — lista tego, o co najczęściej pytają odbiorcy i inspekcje.">
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { t: "Atest / dopuszczenie zabudowy", d: "Najczęściej: dokumenty potwierdzające zgodność zabudowy i przeznaczenie do przewozu żywności." },
            { t: "Rejestracja temperatury", d: "W wielu przypadkach odbiorca wymaga potwierdzenia temperatury (wydruk/raport z rejestratora)." },
            { t: "Czystość i higiena", d: "Komora ładunkowa czysta, bez zapachów i zabrudzeń; często kontrolowane przy odbiorze." },
            { t: "Prawidłowy załadunek", d: "Nie blokuj obiegu powietrza, stabilizuj towar, zachowaj odstępy i punkty mocowania." },
            { t: "Ustawienia i próba przed trasą", d: "Uruchom agregat wcześniej i ustabilizuj temperaturę przed załadunkiem." },
            { t: "Postoje i rozładunki", d: "Na dłuższych postojach pomocne bywa podtrzymanie 230V (jeśli dostępne)." },
          ].map((x, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h3 className="font-semibold text-brand-dark mb-2">{x.t}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{x.d}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Checklista przed wyjazdem" subtitle="Skrót do skopiowania w firmie / magazynie.">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <ul className="space-y-3 text-slate-700">
            {[
              "Ustaw docelową temperaturę i sprawdź stabilizację przed załadunkiem.",
              "Sprawdź, czy komora jest czysta i sucha.",
              "Zabezpiecz ładunek (pasy/rozstaw) i nie blokuj nawiewów.",
              "Jeśli potrzebujesz potwierdzenia — przygotuj wydruk/raport z rejestratora.",
              "Ustal procedurę na postoje/rozładunki (czas otwarcia drzwi, ewentualne 230V).",
            ].map((t, i) => (
              <li key={i} className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-brand-blue mt-0.5" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section tone="soft" title="Dobór auta do zadania" subtitle="Powiedz: towar, trasa, czas i wymagana temperatura — dobierzemy rozmiar i konfigurację.">
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="/#flota" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-brand-blue text-brand-blue font-semibold hover:bg-brand-light transition-colors">
            Zobacz flotę i cennik
          </a>
          <a href="/wynajem-chlodni" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:border-brand-blue/40 hover:text-brand-blue transition-colors">
            Wynajem chłodni
          </a>
          <a href="/wynajem-mrozni" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:border-brand-blue/40 hover:text-brand-blue transition-colors">
            Wynajem mroźni
          </a>
        </div>
      </Section>

      <Section title="Masz wymagania od odbiorcy?" subtitle="Podeślij je — dobierzemy auto i powiemy, co dostarczymy w dokumentach.">
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
