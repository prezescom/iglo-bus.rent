import { Helmet } from "react-helmet-async";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { CheckCircle2, AlertTriangle, FileText, Shield, Thermometer, Car } from "lucide-react";
import { Link } from "wouter";

export default function WymaganiaAutoChlodnia() {
  const url = "https://www.iglo-bus.rent/wymagania-auto-chlodnia-mroznia-izoterma";
  const ogImage = "https://www.iglo-bus.rent/images/og-home-1200.jpg";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Helmet>
        {/* Core SEO */}
        <title>Wymagania auto chłodni, mroźni i izoterm – przepisy | Iglo-Bus Rent</title>
        <meta
          name="description"
          content="Przepisy i normy dla auto chłodni, mroźni i izoterm: atest Sanepid, rejestrator temperatur, HACCP. Praktyczny poradnik dla firm z woj. śląskiego."
        />
        <link rel="canonical" href={url} />
        <meta name="robots" content="index,follow,max-image-preview:large" />

        {/* Open Graph / Twitter */}
        <meta property="og:type" content="article" />
        <meta property="og:locale" content="pl_PL" />
        <meta property="og:site_name" content="Iglo-Bus Rent" />
        <meta property="og:title" content="Wymagania auto chłodni, mroźni i izoterm – przepisy" />
        <meta
          property="og:description"
          content="Atest Sanepid, rejestrator temperatur i HACCP – wszystko, co musi spełniać pojazd do transportu chłodniczego."
        />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Wymagania auto chłodni, mroźni i izoterm – przepisy" />
        <meta
          name="twitter:description"
          content="Praktyczny przewodnik: Sanepid, HACCP, rejestrator temperatur – warunki dla transportu chłodniczego."
        />
        <meta name="twitter:image" content={ogImage} />

        {/* Article schema */}
        <script type="application/ld+json">{JSON.stringify({
          "@context":"https://schema.org",
          "@type":"Article",
          "headline":"Wymagania auto chłodni, mroźni i izoterm – przepisy i normy",
          "description":"Przewodnik po wymaganiach prawnych i technicznych: atest Sanepid, rejestrator temperatur, HACCP.",
          "author":{"@type":"Organization","name":"Iglo-Bus Rent"},
          "publisher":{"@type":"Organization","name":"Iglo-Bus Rent"},
          "image": ogImage,
          "mainEntityOfPage": url,
          "datePublished":"2024-12-12",
          "dateModified":"2024-12-12"
        })}</script>

        {/* Breadcrumbs */}
        <script type="application/ld+json">{JSON.stringify({
          "@context":"https://schema.org",
          "@type":"BreadcrumbList",
          "itemListElement":[
            {"@type":"ListItem","position":1,"name":"Strona główna","item":"https://www.iglo-bus.rent/"},
            {"@type":"ListItem","position":2,"name":"Wymagania auto chłodni / mroźni / izoterm","item":url}
          ]
        })}</script>

        {/* HowTo – droga do zatwierdzenia Sanepidu */}
        <script type="application/ld+json">{JSON.stringify({
          "@context":"https://schema.org",
          "@type":"HowTo",
          "name":"Jak uzyskać zatwierdzenie Sanepidu dla pojazdu chłodniczego",
          "description":"Kroki do uzyskania atestu Sanepid dla auta chłodni/mroźni.",
          "step":[
            {"@type":"HowToStep","name":"Przygotowanie pojazdu","text":"Zabudowa izolacyjna, agregat chłodniczy, rejestrator temperatur, wykończenie higieniczne."},
            {"@type":"HowToStep","name":"Złożenie wniosku","text":"Wniosek w PSSE + dokumentacja techniczna i certyfikaty."},
            {"@type":"HowToStep","name":"Kontrola inspektora","text":"Sprawdzenie zabudowy, agregatu i rejestratora."},
            {"@type":"HowToStep","name":"Wydanie decyzji","text":"Decyzja administracyjna z zakresem zastosowania."},
            {"@type":"HowToStep","name":"Regularne przeglądy","text":"Przeglądy, dezynfekcja, kalibracja urządzeń, dokumentacja."}
          ]
        })}</script>
      </Helmet>

      <Header />

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-8 pb-6">
        <div className="text-center mb-6">
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight text-brand-dark mb-4">
            Wymagania <span className="text-brand-blue">auto chłodni</span>
            <span className="block text-2xl lg:text-3xl mt-2 font-semibold">mroźnia • izoterma • przepisy</span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-4xl mx-auto">
            Zebraliśmy najważniejsze <strong>wymogi prawne i techniczne</strong> dla pojazdów do transportu w kontrolowanej temperaturze.
          </p>

          {/* Navigacja */}
          <div className="mt-6 space-y-4">
            {/* Spis treści */}
            <nav className="text-sm text-brand-blue flex flex-wrap gap-3 justify-center">
              <a href="#wymagania-prawne" className="hover:underline font-medium">Podstawowe wymagania</a>
              <span className="text-slate-300">•</span>
              <a href="#wymogi-techniczne" className="hover:underline font-medium">Wymogi techniczne</a>
              <span className="text-slate-300">•</span>
              <a href="#klasyfikacja" className="hover:underline font-medium">Klasyfikacja pojazdów</a>
              <span className="text-slate-300">•</span>
              <a href="#kontrole-kary" className="hover:underline font-medium">Kontrole i kary</a>
              <span className="text-slate-300">•</span>
              <a href="#podstawy-prawne" className="hover:underline font-medium">Podstawy prawne</a>
              <span className="text-slate-300">•</span>
              <a href="#howto-sanepid" className="hover:underline font-medium">Jak uzyskać atest</a>
            </nav>
            
            {/* Powiązane strony */}
            <div className="text-sm text-slate-500 flex gap-2 justify-center flex-wrap border-t border-slate-200 pt-3">
              <span className="text-xs">Zobacz także:</span>
              <Link href="/wynajem-chlodni" className="text-brand-blue hover:underline">Wynajem chłodni</Link>
              <span>•</span>
              <Link href="/wynajem-mrozni" className="text-brand-blue hover:underline">Wynajem mroźni</Link>
              <span>•</span>
              <Link href="/wyposazenie-samochodow-mrozni" className="text-brand-blue hover:underline">Wyposażenie mroźni</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Podstawowe wymagania prawne */}
      <section id="wymagania-prawne" className="mx-auto max-w-6xl px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-dark mb-3">
            <span className="text-brand-blue">Podstawowe wymagania</span> prawne
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Każdy pojazd (izoterma/chłodnia/mroźnia) używany komercyjnie musi spełniać poniższe standardy.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Shield,
              title: "Atest Sanepid",
              points: [
                "Zaświadczenie o zgodności z wymogami sanitarnymi",
                "Regularne kontrole i aktualna dokumentacja",
                "Dokumenty do przewozu żywności (HACCP)",
              ],
              color: "text-green-600",
              bg: "bg-green-50",
            },
            {
              icon: Thermometer,
              title: "Rejestrator temperatur",
              points: [
                "Ciągły monitoring i archiwizacja odczytów",
                "Możliwość wydruku raportów",
                "Okresowa kalibracja urządzeń",
              ],
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              icon: FileText,
              title: "Dokumentacja HACCP",
              points: [
                "Procedury i punkty krytyczne",
                "Rejestry czyszczenia i dezynfekcji",
                "Szkolenia personelu",
              ],
              color: "text-purple-600",
              bg: "bg-purple-50",
            },
          ].map(({ icon: Icon, title, points, color, bg }, i) => (
            <div key={i} className={`${bg} rounded-2xl p-6 border border-slate-200`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`h-12 w-12 rounded-xl ${bg} border grid place-items-center`}>
                  <Icon className={`h-6 w-6 ${color}`} />
                </div>
                <h3 className="font-bold text-brand-dark">{title}</h3>
              </div>
              <ul className="space-y-2">
                {points.map((p, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-600">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Wymogi techniczne */}
      <section id="wymogi-techniczne" className="bg-slate-50 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-dark mb-3">
              Wymogi <span className="text-brand-blue">techniczne</span> pojazdów
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Co powinna mieć prawidłowo przygotowana zabudowa chłodnicza.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-xl bg-brand-light grid place-items-center">
                  <Car className="h-6 w-6 text-brand-blue" />
                </div>
                <h3 className="text-2xl font-bold text-brand-dark">Zabudowa chłodnicza</h3>
              </div>
              <div className="space-y-4">
                {[
                  "Izolacja o odpowiedniej grubości",
                  "Hermetyczne zamknięcie przestrzeni ładunkowej",
                  "Agregat z regulacją temperatury",
                  "Wentylacja dla równomiernego rozkładu chłodu",
                  "Materiały dopuszczone do kontaktu z żywnością",
                ].map((t, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                    <CheckCircle2 className="h-5 w-5 text-brand-blue mt-0.5" />
                    <span className="text-sm text-slate-600">{t}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-xl bg-brand-light grid place-items-center">
                  <Thermometer className="h-6 w-6 text-brand-blue" />
                </div>
                <h3 className="text-2xl font-bold text-brand-dark">Systemy kontroli</h3>
              </div>
              <div className="space-y-4">
                {[
                  "Termometr z sondą zewnętrzną",
                  "Alarm przekroczenia temperatury",
                  "Rejestrator z pamięcią min. 30 dni",
                  "Wydruk raportów dla odbiorcy",
                  "Kalibracja zgodnie z normami",
                ].map((t, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                    <CheckCircle2 className="h-5 w-5 text-brand-blue mt-0.5" />
                    <span className="text-sm text-slate-600">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Klasyfikacja pojazdów */}
      <section id="klasyfikacja" className="mx-auto max-w-6xl px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-dark mb-3">
            <span className="text-brand-blue">Klasyfikacja</span> pojazdów chłodniczych
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">Różne typy do różnych zastosowań.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {[
            {
              type: "Auto-izoterma",
              desc: "Utrzymuje temperaturę bez aktywnego chłodzenia.",
              temp: "Utrzymanie temperatury",
              usage: "Pieczywo, nabiał w krótkim transporcie, owoce, warzywa",
              emoji: "📦",
              features: [
                "Izolacyjne płyty warstwowe",
                "Brak źródła chłodu – sama izolacja",
                "Gładkie, zmywalne powierzchnie",
                "Krótki przewóz schłodzonych produktów",
              ],
            },
            {
              type: "Auto-chłodnia",
              desc: "Dodatnie temperatury kontrolowane w czasie przewozu.",
              temp: "+2°C do +8°C",
              usage: "Nabiał, mięso, ryby, warzywa, gotowe posiłki",
              emoji: "🧊",
              features: [
                "Izolowana, łatwa do dezynfekcji zabudowa",
                "Agregat zapewniający stabilną temperaturę",
                "Rejestrator temperatury z wydrukiem",
                "Higieniczne powierzchnie bez szczelin",
              ],
            },
            {
              type: "Auto-mroźnia",
              desc: "Produkt głęboko mrożony poniżej −18°C.",
              temp: "Poniżej −18°C",
              usage: "Lody, mrożone mięso i ryby, warzywa, pieczywo",
              emoji: "🧊",
              features: [
                "Wydajny agregat chłodniczy",
                "Dodatkowa izolacja ścian/podłogi/sufitu",
                "Termograf monitorujący warunki",
                "Częste kontrole Sanepidu",
              ],
            },
          ].map(({ type, desc, temp, usage, emoji, features }, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">{emoji}</div>
                <h3 className="text-xl font-bold text-brand-dark">{type}</h3>
              </div>
              <div className="space-y-3 text-sm">
                <p className="text-slate-600">{desc}</p>
                <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50">
                  <span className="font-medium">Temperatura:</span>
                  <span className="font-bold text-brand-blue">{temp}</span>
                </div>
                <div>
                  <span className="font-medium text-slate-700">Zastosowanie:</span>
                  <p className="text-slate-600 mt-1">{usage}</p>
                </div>
                <div className="mt-4">
                  <span className="font-medium text-slate-700 block mb-2">Wymagania:</span>
                  <ul className="space-y-1">
                    {features.map((f, idx) => (
                      <li key={idx} className="flex items-start gap-1 text-xs text-slate-600">
                        <CheckCircle2 className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Kontrole i kary */}
      <section id="kontrole-kary" className="bg-slate-50 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-dark mb-3">
              <span className="text-brand-blue">Kontrole</span> i konsekwencje
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Czego spodziewać się podczas kontroli i jakie są sankcje.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-xl bg-blue-50 grid place-items-center">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-brand-dark">Kontrole sanitarne</h3>
              </div>
              <ul className="space-y-3">
                {[
                  "Ważność atestu Sanepid",
                  "Stan techniczny zabudowy",
                  "Zapisy rejestratora temperatur",
                  "Czystość przestrzeni ładunkowej",
                  "Dokumentacja HACCP",
                ].map((t, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                    <span className="text-slate-600 text-sm">{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-xl bg-red-50 grid place-items-center">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-brand-dark">Kary i sankcje</h3>
              </div>
              <ul className="space-y-3">
                {[
                  "Mandaty i decyzje administracyjne",
                  "Zakaz przewozu żywności/leków",
                  "Wstrzymanie działalności",
                  "Odpowiedzialność za zagrożenie zdrowia",
                ].map((t, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                    <span className="text-slate-600 text-sm">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Podstawy prawne */}
      <section id="podstawy-prawne" className="mx-auto max-w-6xl px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-dark mb-3">
            <span className="text-brand-blue">Podstawy prawne</span> transportu chłodniczego
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Najważniejsze akty prawne regulujące przewóz żywności.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-xl bg-blue-50 grid place-items-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-brand-dark">Przepisy europejskie</h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <h4 className="font-bold text-brand-dark mb-2">Rozporządzenie (WE) 852/2004</h4>
                <p className="text-sm text-slate-600">Higiena środków spożywczych – wymogi ogólne.</p>
              </div>
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <h4 className="font-bold text-brand-dark mb-2">Rozporządzenie (WE) 853/2004</h4>
                <p className="text-sm text-slate-600">Żywność pochodzenia zwierzęcego – wymagania szczególne.</p>
              </div>
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <h4 className="font-bold text-brand-dark mb-2">Umowa ATP</h4>
                <p className="text-sm text-slate-600">Normy dla przewozu artykułów szybko psujących się.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-xl bg-green-50 grid place-items-center">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-brand-dark">Przepisy krajowe</h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                <h4 className="font-bold text-brand-dark mb-2">Ustawa o bezpieczeństwie żywności</h4>
                <p className="text-sm text-slate-600">Krajowe przepisy bezpieczeństwa żywności i żywienia.</p>
              </div>
              <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                <h4 className="font-bold text-brand-dark mb-2">Wytyczne Sanepidu</h4>
                <p className="text-sm text-slate-600">Zatwierdzanie pojazdów, kontrole, dokumentacja.</p>
              </div>
              <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                <h4 className="font-bold text-brand-dark mb-2">HACCP</h4>
                <p className="text-sm text-slate-600">System zarządzania bezpieczeństwem żywności.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HowTo – atest Sanepidu */}
      <section id="howto-sanepid" className="bg-slate-50 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-dark mb-3">
              Droga do <span className="text-brand-blue">zatwierdzenia Sanepidu</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Krótki przewodnik krok po kroku.
            </p>
          </div>

          <ol className="max-w-4xl mx-auto space-y-6">
            {[
              ["Przygotowanie pojazdu","Zabudowa izolacyjna, agregat chłodniczy, rejestrator temperatur, higieniczne wykończenie."],
              ["Złożenie wniosku","Wniosek w PSSE + dokumentacja techniczna i certyfikaty."],
              ["Kontrola inspektora","Sprawdzenie zabudowy, agregatu, rejestratora i czystości."],
              ["Wydanie decyzji","Decyzja administracyjna z zakresem zastosowania."],
              ["Regularne przeglądy","Dezynfekcja, kalibracja urządzeń, przeglądy i dokumentacja."],
            ].map(([title, text], i) => (
              <li key={i} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-brand-blue text-white grid place-items-center font-bold">{i+1}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-brand-dark mb-1">{title}</h3>
                    <p className="text-slate-600">{text}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA – powiązane usługi */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="bg-gradient-to-r from-brand-blue to-blue-600 rounded-3xl p-8 lg:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Potrzebujesz pojazdu spełniającego te wymagania?</h2>
            <p className="text-lg mb-6 opacity-90">Sprawdź dostępność i warunki wynajmu na Śląsku.</p>
            <div className="flex gap-3 flex-wrap justify-center">
              <Link href="/wynajem-chlodni"><a className="px-6 py-3 rounded-xl bg-white text-brand-blue font-bold hover:bg-slate-50">Wynajem chłodni</a></Link>
              <Link href="/wynajem-mrozni"><a className="px-6 py-3 rounded-xl bg-transparent border-2 border-white text-white font-bold hover:bg-white hover:text-brand-blue">Wynajem mroźni</a></Link>
              <a href="tel:+48530410504" className="px-6 py-3 rounded-xl bg-white/10 border-2 border-white text-white font-bold hover:bg-white hover:text-brand-blue">Zadzwoń: +48 530 410 504</a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
