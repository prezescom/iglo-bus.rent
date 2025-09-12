import { Helmet } from "react-helmet-async";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { CheckCircle2, AlertTriangle, FileText, Shield, Thermometer, Truck, Clock, Car } from "lucide-react";

export default function WymaganiaAutoChłodnia() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Helmet>
        <title>Wymagania Auto Chłodnia, Mroźnia, Izoterma | Przepisy i Normy | Iglo-Bus Rent</title>
        <meta name="description" content="Wymagania prawne dla auto chłodni, mroźni i izoterm ✓ Atest Sanepid ✓ Rejestrator temperatur ✓ Przepisy transportowe ✓ Normy HACCP ✓ Śląsk, Katowice, Gliwice" />
        <meta name="keywords" content="wymagania auto chłodnia, przepisy mroźnia, normy izoterma, atest sanepid, rejestrator temperatur, HACCP transport, śląsk" />
        <link rel="canonical" href="https://www.iglo-bus.rent/wymagania-auto-chlodnia-mroznia-izoterma" />
        <meta name="robots" content="index,follow" />
        <meta property="og:title" content="Wymagania Auto Chłodnia, Mroźnia, Izoterma | Przepisy i Normy" />
        <meta property="og:description" content="Poznaj wymagania prawne dla transportu chłodniczego. Atest Sanepid, rejestrator temperatur, normy HACCP dla auto chłodni i mroźni." />
        <meta property="og:url" content="https://www.iglo-bus.rent/wymagania-auto-chlodnia-mroznia-izoterma" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.iglo-bus.rent/images/og-home-1200.jpg" />

        {/* Article Schema */}
        <script type="application/ld+json">{JSON.stringify({
          "@context":"https://schema.org",
          "@type":"Article",
          "headline":"Wymagania Auto Chłodnia, Mroźnia, Izoterma - Przepisy i Normy",
          "description":"Kompleksowy przewodnik po wymaganiach prawnych dla transportu chłodniczego, atescie Sanepid i normach HACCP",
          "author":{ "@type":"Organization", "name":"Iglo-Bus Rent" },
          "publisher":{ "@type":"Organization", "name":"Iglo-Bus Rent" },
          "datePublished":"2024-12-12",
          "dateModified":"2024-12-12"
        })}</script>
      </Helmet>

      <Header />

      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-4 pt-8 pb-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight text-brand-dark mb-6">
            Wymagania <span className="text-brand-blue">Auto Chłodnia</span>
            <span className="block text-2xl lg:text-3xl mt-2 font-semibold">Mroźnia • Izoterma • Przepisy</span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-4xl mx-auto">
            Poznaj wszystkie <strong>wymagania prawne i techniczne</strong> dotyczące transportu chłodniczego. 
            Dowiedz się, jakie <span className="text-brand-blue font-semibold">przepisy, atesty i normy</span> muszą spełniać auto chłodnie, mroźnie i izotermy.
          </p>
        </div>
      </section>

      {/* Podstawowe wymagania prawne */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-dark mb-4">
            <span className="text-brand-blue">Podstawowe Wymagania</span> Prawne
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Każde auto chłodnia, mroźnia czy izoterma używana do transportu komercyjnego musi spełniać określone wymogi
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Shield,
              title: "Atest Sanepid",
              requirements: [
                "Zaświadczenie o zgodności pojazdu z wymogami sanitarnymi",
                "Regularne kontrole sanitarne",
                "Dokumentacja do przewozu żywności",
                "Certyfikat bezpieczeństwa żywności"
              ],
              color: "text-green-600",
              bgColor: "bg-green-50"
            },
            {
              icon: Thermometer,
              title: "Rejestrator Temperatur",
              requirements: [
                "Ciągły monitoring temperatury podczas transportu",
                "Możliwość wydruku danych",
                "Kalibracja urządzeń pomiarowych",
                "Archiwizacja zapisów temperatur"
              ],
              color: "text-blue-600",
              bgColor: "bg-blue-50"
            },
            {
              icon: FileText,
              title: "Dokumentacja HACCP",
              requirements: [
                "System zapewnienia bezpieczeństwa żywności",
                "Procedury kontroli punktów krytycznych",
                "Rejestry czyszczenia i dezynfekcji",
                "Szkolenia obsługi"
              ],
              color: "text-purple-600",
              bgColor: "bg-purple-50"
            }
          ].map(({icon: Icon, title, requirements, color, bgColor}, idx) => (
            <div key={idx} className={`${bgColor} rounded-2xl p-6 border border-slate-200`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`h-12 w-12 rounded-xl ${bgColor} border grid place-items-center`}>
                  <Icon className={`h-6 w-6 ${color}`} />
                </div>
                <h3 className="font-bold text-brand-dark">{title}</h3>
              </div>
              <ul className="space-y-2">
                {requirements.map((req, reqIdx) => (
                  <li key={reqIdx} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-600">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Wymogi techniczne */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-dark mb-4">
              Wymogi <span className="text-brand-blue">Techniczne</span> Pojazdów
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Specyfikacje techniczne, które muszą spełniać samochody do transportu chłodniczego
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-xl bg-brand-light grid place-items-center">
                  <Car className="h-6 w-6 text-brand-blue" />
                </div>
                <h3 className="text-2xl font-bold text-brand-dark">Zabudowa Chłodnicza</h3>
              </div>
              <div className="space-y-4">
                {[
                  "Izolacja termiczna o odpowiedniej grubości",
                  "Hermetyczne zamknięcie przestrzeni ładunkowej",
                  "Agregat chłodniczy z możliwością regulacji",
                  "Wentylacja zapewniająca równomierny rozkład temperatury",
                  "Materiały dopuszczone do kontaktu z żywnością"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                    <CheckCircle2 className="h-5 w-5 text-brand-blue mt-0.5" />
                    <span className="text-sm text-slate-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-xl bg-brand-light grid place-items-center">
                  <Thermometer className="h-6 w-6 text-brand-blue" />
                </div>
                <h3 className="text-2xl font-bold text-brand-dark">Systemy Kontroli</h3>
              </div>
              <div className="space-y-4">
                {[
                  "Precyzyjny termometr z sondą zewnętrzną",
                  "System alarmowy przy przekroczeniu temperatury",
                  "Rejestrator z pamięcią min. 30 dni",
                  "Możliwość wydruku raportów",
                  "Kalibracja zgodna z normami metrologicznymi"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                    <CheckCircle2 className="h-5 w-5 text-brand-blue mt-0.5" />
                    <span className="text-sm text-slate-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Klasyfikacja pojazdów */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-dark mb-4">
            <span className="text-brand-blue">Klasyfikacja</span> Pojazdów Chłodniczych
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Różne typy pojazdów do różnych zastosowań transportowych
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {[
            {
              type: "Izoterma",
              description: "Pojazd z izolowaną zabudową bez agregatu chłodniczego",
              tempRange: "Utrzymuje temperaturę",
              usage: "Krótkie transporty, produkty niewymagające głębokiego chłodzenia",
              icon: "❄️"
            },
            {
              type: "Chłodnia",
              description: "Pojazd z agregatem chłodniczym do temperatur dodatnich",
              tempRange: "0°C do +15°C",
              usage: "Świeże produkty spożywcze, nabiał, warzywa, owoce",
              icon: "🧊"
            },
            {
              type: "Mroźnia",
              description: "Pojazd z agregatem do temperatur ujemnych",
              tempRange: "-25°C do 0°C",
              usage: "Produkty mrożone, lody, mięso mrożone",
              icon: "🧊"
            }
          ].map(({type, description, tempRange, usage, icon}, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">{icon}</div>
                <h3 className="text-xl font-bold text-brand-dark">{type}</h3>
              </div>
              <div className="space-y-3 text-sm">
                <p className="text-slate-600">{description}</p>
                <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50">
                  <span className="font-medium">Temperatura:</span>
                  <span className="font-bold text-brand-blue">{tempRange}</span>
                </div>
                <div>
                  <span className="font-medium text-slate-700">Zastosowanie:</span>
                  <p className="text-slate-600 mt-1">{usage}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Kontrole i kary */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-dark mb-4">
              <span className="text-brand-blue">Kontrole</span> i Konsekwencje
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Czego spodziewać się podczas kontroli i jakie grożą kary za nieprzestrzeganie przepisów
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-xl bg-blue-50 grid place-items-center">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-brand-dark">Kontrole Sanitarne</h3>
              </div>
              <ul className="space-y-3">
                {[
                  "Sprawdzenie ważności atestu Sanepid",
                  "Kontrola stanu technicznego zabudowy",
                  "Weryfikacja zapisów rejestratora temperatur",
                  "Sprawdzenie czystości przestrzeni ładunkowej",
                  "Kontrola dokumentacji HACCP"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                    <span className="text-slate-600 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-xl bg-red-50 grid place-items-center">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-brand-dark">Kary i Sankcje</h3>
              </div>
              <ul className="space-y-3">
                {[
                  "Mandaty od 500 zł do 5000 zł",
                  "Zakaz przewozu produktów spożywczych",
                  "Konfiskata nieprawidłowo przewożonej żywności",
                  "Wstrzymanie działalności transportowej",
                  "Odpowiedzialność karna za zagrożenie zdrowia"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                    <span className="text-slate-600 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Iglo-Bus Rent compliance */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="bg-gradient-to-r from-brand-blue to-blue-600 rounded-3xl p-8 lg:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Iglo-Bus Rent - Pełna Zgodność z Przepisami
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Wszystkie nasze pojazdy spełniają wymagania prawne i techniczne. <br />
              Otrzymujesz komplet dokumentacji potrzebnej do legalnego transportu.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center justify-center gap-2 opacity-90">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-sm">Atest Sanepid</span>
              </div>
              <div className="flex items-center justify-center gap-2 opacity-90">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-sm">Rejestrator temperatur</span>
              </div>
              <div className="flex items-center justify-center gap-2 opacity-90">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-sm">Dokumentacja HACCP</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
              <a 
                href="tel:+48530410504"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-white text-brand-blue font-bold hover:bg-slate-50 transition-colors w-full sm:w-auto justify-center"
                data-testid="requirements-phone"
              >
                <span>📞 +48 530 410 504</span>
              </a>
              <a 
                href="/kontakt"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-transparent border-2 border-white text-white font-bold hover:bg-white hover:text-brand-blue transition-colors w-full sm:w-auto justify-center"
                data-testid="requirements-contact"
              >
                <span>✉️ Skontaktuj się</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}