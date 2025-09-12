import { Helmet } from "react-helmet-async";
import { CheckCircle2, Snowflake, Wrench, Truck, FileText, Shield, Thermometer } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import drazekImage from "@assets/drążek do blokowania ładunku_1757659759249.jpg";
import listwaImage from "@assets/Listwa-otworowa-9_1757659759249.jpg";
import polkaImage from "@assets/Półka doubledeck_1757659759250.jpg";
import rejestratorImage from "@assets/rejestrator_1757659759250.webp";
import agregatImage from "@assets/agregat_1757659950785.jpg";

export default function WyposazenieSamochodowMrozni() {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Wyposażenie Samochodów Mroźni - Iglo-Bus.rent | Profesjonalne Samochody Chłodnicze</title>
        <meta name="description" content="Sprawdź profesjonalne wyposażenie naszych samochodów mroźni: listwy aluminiowe, drążek blokujący, rejestrator ESCO DR201, półka double deck, agregat z funkcją grzania i zasilaniem 230V." />
        <meta name="keywords" content="wyposażenie auto mroźnia, samochód chłodnia wyposażenie, listwy aluminiowe, drążek blokowania ładunku, rejestrator temperatury ESCO, półka double deck, agregat chłodniczy, wynajem mroźni Śląsk" />
        <link rel="canonical" href="https://iglo-bus.rent/wyposazenie-samochodow-mrozni" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Wyposażenie Samochodów Mroźni - Iglo-Bus.rent" />
        <meta property="og:description" content="Sprawdź profesjonalne wyposażenie naszych samochodów mroźni: listwy aluminiowe, drążek blokujący, rejestrator ESCO DR201, półka double deck, agregat z funkcją grzania." />
        <meta property="og:url" content="https://iglo-bus.rent/wyposażenie-samochodow-mrozni" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="pl_PL" />
        
        {/* Schema.org structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Wyposażenie Samochodów Mroźni - Iglo-Bus.rent",
            "description": "Profesjonalne wyposażenie samochodów mroźni: listwy aluminiowe, drążek blokujący, rejestrator ESCO DR201, półka double deck, agregat z funkcją grzania i zasilaniem 230V.",
            "url": "https://iglo-bus.rent/wyposażenie-samochodow-mrozni",
            "mainEntity": {
              "@type": "Service",
              "name": "Wynajem Samochodów Mroźni z Profesjonalnym Wyposażeniem",
              "provider": {
                "@type": "Organization",
                "name": "Iglo-Bus.rent",
                "telephone": "+48530410504",
                "address": {
                  "@type": "PostalAddress",
                  "addressRegion": "Śląsk",
                  "addressCountry": "PL"
                }
              },
              "areaServed": ["Katowice", "Gliwice", "Śląsk"],
              "serviceType": "Wynajem samochodów chłodniczych"
            }
          })}
        </script>
      </Helmet>

      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-brand-light to-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <div className="flex justify-center items-center gap-3 mb-6">
              <div className="h-16 w-16 rounded-2xl bg-brand-blue grid place-items-center">
                <Wrench className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-brand-dark mb-6">
              <span className="text-brand-blue">Wyposażenie</span> Samochodów Mroźni
            </h1>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto mb-8">
              Nasze samochody są dostosowane do bezpiecznego i wygodnego przewozu towarów wymagających kontrolowanej temperatury. 
              Każdy pojazd posiada praktyczne rozwiązania ułatwiające transport i spełniające wymagania sanitarne.
            </p>
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-blue/10 border border-brand-blue/20">
              <Snowflake className="h-5 w-5 text-brand-blue" />
              <span className="text-brand-blue font-medium">Profesjonalne wyposażenie dla bezpiecznego transportu</span>
            </div>
          </div>
        </div>
      </section>

      {/* Standardowe wyposażenie */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-dark mb-4">
            <span className="text-brand-blue">Standardowe</span> Wyposażenie
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Każdy z naszych pojazdów wyposażony jest w profesjonalne akcesoria zapewniające bezpieczeństwo i komfort transportu
          </p>
        </div>

        <div className="space-y-12">
          {/* Listwy aluminiowe */}
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-brand-light grid place-items-center">
                  <CheckCircle2 className="h-5 w-5 text-brand-blue" />
                </div>
                <h3 className="text-2xl font-bold text-brand-dark">Listwy Aluminiowe do Kotwiczenia Ładunku</h3>
              </div>
              <p className="text-slate-600 text-lg leading-relaxed mb-4">
                Zapewniają możliwość mocowania towaru pasami, co chroni go przed przesuwaniem w trakcie jazdy. 
                Wykonane z wytrzymałego aluminium, umożliwiają bezpieczne zabezpieczenie różnych rodzajów ładunków.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">Mocowanie pasami</span>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">Wytrzymałe aluminium</span>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">Ochrona przed przesuwaniem</span>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200">
              <img 
                src={listwaImage} 
                alt="Listwy aluminiowe do kotwiczenia ładunku w samochodzie mroźni" 
                className="w-full h-80 object-cover"
                data-testid="img-listwy-aluminiowe"
              />
            </div>
          </div>

          {/* Drążek blokujący */}
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="order-2 lg:order-1 rounded-2xl overflow-hidden shadow-lg border border-slate-200">
              <img 
                src={drazekImage} 
                alt="Drążek do blokowania ładunku w przestrzeni ładunkowej" 
                className="w-full h-80 object-cover"
                data-testid="img-drazek-blokujacy"
              />
            </div>
            <div className="order-1 lg:order-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-brand-light grid place-items-center">
                  <CheckCircle2 className="h-5 w-5 text-brand-blue" />
                </div>
                <h3 className="text-2xl font-bold text-brand-dark">Drążek do Blokowania Ładunku</h3>
              </div>
              <p className="text-slate-600 text-lg leading-relaxed mb-4">
                Pozwala szybko zabezpieczyć palety i mniejsze przesyłki bez konieczności stosowania pasów. 
                Regulowany system umożliwia dostosowanie do różnych rozmiarów ładunków.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">Szybkie zabezpieczenie</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">Regulowany</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">Bez pasów</span>
              </div>
            </div>
          </div>

          {/* Rejestrator temperatury */}
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-brand-light grid place-items-center">
                  <Thermometer className="h-5 w-5 text-brand-blue" />
                </div>
                <h3 className="text-2xl font-bold text-brand-dark">Drukarka ESCO DR201 USB</h3>
              </div>
              <p className="text-slate-600 text-lg leading-relaxed mb-4">
                Rejestrator temperatury zapisuje przebieg temperatury podczas transportu, a w razie potrzeby umożliwia 
                wydruk raportu dla klienta lub kontroli. Gwarancja pełnej dokumentacji przewozu.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">Zapis temperatury</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">Wydruk raportów</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">USB</span>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-white p-8 flex justify-center">
              <img 
                src={rejestratorImage} 
                alt="Rejestrator temperatury ESCO DR201 USB z drukarką" 
                className="h-80 object-contain"
                data-testid="img-rejestrator-esco"
              />
            </div>
          </div>

          {/* Półka double deck */}
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="order-2 lg:order-1 rounded-2xl overflow-hidden shadow-lg border border-slate-200">
              <img 
                src={polkaImage} 
                alt="Półka double deck aluminiowa do dwupoziomowego załadunku" 
                className="w-full h-80 object-cover"
                data-testid="img-polka-doubledeck"
              />
            </div>
            <div className="order-1 lg:order-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-brand-light grid place-items-center">
                  <CheckCircle2 className="h-5 w-5 text-brand-blue" />
                </div>
                <h3 className="text-2xl font-bold text-brand-dark">Półka Double Deck Aluminiowa</h3>
              </div>
              <p className="text-slate-600 text-lg leading-relaxed mb-4">
                Dodatkowa półka, która pozwala na dwupoziomowy załadunek i lepsze wykorzystanie przestrzeni w pojeździe. 
                Idealna do transportu mniejszych przesyłek wymagających segregacji.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full">Dwupoziomowy załadunek</span>
                <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full">Optymalizacja przestrzeni</span>
                <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full">Aluminium</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Zaawansowane funkcje agregatu */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-dark mb-4">
              <span className="text-brand-blue">Zaawansowane Funkcje</span> Agregatu Chłodniczego
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Nowoczesny agregat chłodniczy z dodatkowymi funkcjami zwiększającymi komfort i efektywność transportu
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-center mb-12">
            <div className="order-2 lg:order-1">
              <img 
                src={agregatImage} 
                alt="Agregat chłodniczy z funkcją grzania i zasilaniem 230V" 
                className="w-full h-80 object-cover rounded-2xl shadow-lg border border-slate-200"
                data-testid="img-agregat-chlodniczy"
              />
            </div>
            <div className="order-1 lg:order-2">
              <div className="space-y-8">
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-blue-50 grid place-items-center">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-brand-dark">Zasilanie Postojowe 230V</h3>
                  </div>
                  <p className="text-slate-600">
                    Możliwość podłączenia pojazdu do sieci elektrycznej w trakcie postoju, co utrzymuje temperaturę 
                    bez pracy silnika. Oszczędność paliwa i redukcja emisji podczas dłuższych postojów.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">Oszczędność paliwa</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">Ekologiczne</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-red-50 grid place-items-center">
                      <Thermometer className="h-5 w-5 text-red-600" />
                    </div>
                    <h3 className="text-xl font-bold text-brand-dark">Funkcja Grzania Agregatu</h3>
                  </div>
                  <p className="text-slate-600">
                    Oprócz chłodzenia możliwe jest także podgrzewanie przestrzeni ładunkowej, co sprawdza się zimą 
                    przy transporcie towarów wymagających dodatnich temperatur.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full">Ogrzewanie</span>
                    <span className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full">Transport zimowy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Korzyści */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-dark mb-4">
            Dlaczego Nasze <span className="text-brand-blue">Wyposażenie</span> Ma Znaczenie?
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Profesjonalne wyposażenie to gwarancja bezpiecznego transportu i zadowolenia klientów
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <Shield className="h-6 w-6" />,
              title: "Bezpieczeństwo Ładunku",
              description: "Listwy i drążki zapewniają stabilne mocowanie, eliminując ryzyko uszkodzenia towaru podczas transportu"
            },
            {
              icon: <FileText className="h-6 w-6" />,
              title: "Pełna Dokumentacja",
              description: "Rejestrator ESCO DR201 zapewnia szczegółową dokumentację temperatury wymaganą przez kontrole"
            },
            {
              icon: <Truck className="h-6 w-6" />,
              title: "Optymalizacja Przestrzeni",
              description: "Półka double deck pozwala na maksymalne wykorzystanie kubatury pojazdu"
            },
            {
              icon: <Thermometer className="h-6 w-6" />,
              title: "Kontrola Temperatury",
              description: "Funkcje grzania i chłodzenia umożliwiają transport w każdych warunkach pogodowych"
            },
            {
              icon: <CheckCircle2 className="h-6 w-6" />,
              title: "Higiena i Czystość",
              description: "Odkręcane odpływy umożliwiają łatwe mycie i dezynfekcję przestrzeni ładunkowej"
            },
            {
              icon: <Snowflake className="h-6 w-6" />,
              title: "Niezawodność",
              description: "Wysokiej jakości komponenty zapewniają długotrwałą i niezawodną pracę"
            }
          ].map(({icon, title, description}, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-brand-light grid place-items-center text-brand-blue">
                  {icon}
                </div>
                <h3 className="text-lg font-bold text-brand-dark">{title}</h3>
              </div>
              <p className="text-slate-600 text-sm">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="bg-gradient-to-r from-brand-blue to-blue-600 rounded-3xl p-8 lg:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Profesjonalne Wyposażenie dla Twojego Biznesu
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Wynajmij samochód mroźnię z pełnym wyposażeniem profesjonalnym. <br />
              Gwarantujemy bezpieczny transport w kontrolowanej temperaturze.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
              <a 
                href="tel:+48530410504"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-white text-brand-blue font-bold hover:bg-slate-50 transition-colors w-full sm:w-auto justify-center"
                data-testid="equipment-phone"
              >
                <span>📞 +48 530 410 504</span>
              </a>
              <a 
                href="/kontakt"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-transparent border-2 border-white text-white font-bold hover:bg-white hover:text-brand-blue transition-colors w-full sm:w-auto justify-center"
                data-testid="equipment-contact"
              >
                <span>✉️ Sprawdź Dostępność</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}