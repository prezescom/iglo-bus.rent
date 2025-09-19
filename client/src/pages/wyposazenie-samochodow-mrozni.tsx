import { Helmet } from "react-helmet-async";
import { CheckCircle2, Snowflake, Wrench, Truck, FileText, Shield, Thermometer } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Link } from "wouter";

import drazekImage from "@assets/drążek do blokowania ładunku_1757659759249.jpg";
import listwaImage from "@assets/Listwa-otworowa-9_1757659759249.jpg";
import polkaImage from "@assets/Półka doubledeck_1757659759250.jpg";
import rejestratorImage from "@assets/rejestrator_1757659759250.webp";
import agregatImage from "@assets/agregat_1757659950785.jpg";

export default function WyposazenieSamochodowMrozni() {
  const url = "https://www.iglo-bus.rent/wyposazenie-samochodow-mrozni";
  const ogImage = "https://www.iglo-bus.rent/images/og-home-1200.jpg";

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        {(() => {
          const url = "https://www.iglo-bus.rent/wyposazenie-samochodow-mrozni";
          const pageTitle = "Wyposażenie samochodów mroźni – lista i funkcje | Iglo-Bus Rent";
          const pageDesc =
            "Wyposażenie aut mroźni: listwy aluminiowe, drążki blokujące, półki double deck, rejestrator ESCO DR201, agregat z grzaniem i zasilaniem 230V. Śląsk: Katowice, Gliwice.";
          const ogImage = "https://www.iglo-bus.rent/images/og-home-1200.jpg";
          return (
            <>
              {/* Core */}
              <title>{pageTitle}</title>
              <meta name="description" content={pageDesc} />
              <link rel="canonical" href={url} />
              {/* hreflang – dodajemy (tak jak na mroźniach) */}
              <link rel="alternate" hrefLang="pl" href={url} />
              <link rel="alternate" hrefLang="x-default" href={url} />
              <meta name="robots" content="index,follow,max-image-preview:large" />

              {/* OG/Twitter */}
              <meta property="og:type" content="website" />
              <meta property="og:locale" content="pl_PL" />
              <meta property="og:site_name" content="Iglo-Bus Rent" />
              <meta property="og:url" content={url} />
              <meta property="og:title" content={pageTitle} />
              <meta property="og:description" content={pageDesc} />
              <meta property="og:image" content={ogImage} />
              <meta property="og:image:width" content="1200" />
              <meta property="og:image:height" content="630" />
              <meta property="og:image:alt" content="Wyposażenie samochodów mroźni i chłodni – przykładowe elementy" />

              <meta name="twitter:card" content="summary_large_image" />
              <meta name="twitter:title" content={pageTitle} />
              <meta name="twitter:description" content={pageDesc} />
              <meta name="twitter:image" content={ogImage} />

              {/* WebPage schema (zostaje, tylko pilnujemy spójnych wartości) */}
              <script type="application/ld+json">{JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebPage",
                "name": "Wyposażenie samochodów mroźni",
                "url": url,
                "description": "Przegląd wyposażenia aut mroźni i chłodni używanych przez Iglo-Bus Rent."
              })}</script>

              {/* Breadcrumbs */}
              <script type="application/ld+json">{JSON.stringify({
                "@context":"https://schema.org",
                "@type":"BreadcrumbList",
                "itemListElement":[
                  {"@type":"ListItem","position":1,"name":"Strona główna","item":"https://www.iglo-bus.rent/"},
                  {"@type":"ListItem","position":2,"name":"Wyposażenie samochodów mroźni","item":url}
                ]
              })}</script>

              {/* ItemList – elementy wyposażenia (bez zmian) */}
              <script type="application/ld+json">{JSON.stringify({
                "@context":"https://schema.org",
                "@type":"ItemList",
                "name":"Wyposażenie aut mroźni",
                "itemListElement":[
                  {"@type":"ListItem","position":1,"name":"Listwy aluminiowe do kotwiczenia ładunku"},
                  {"@type":"ListItem","position":2,"name":"Drążek do blokowania ładunku"},
                  {"@type":"ListItem","position":3,"name":"Rejestrator temperatur ESCO DR201"},
                  {"@type":"ListItem","position":4,"name":"Półka double deck aluminiowa"},
                  {"@type":"ListItem","position":5,"name":"Agregat z funkcją grzania i zasilaniem 230V"}
                ]
              })}</script>
            </>
          );
        })()}
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
              <span className="text-brand-blue">Wyposażenie</span> samochodów mroźni
            </h1>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto mb-8">
              Nasze auta są przygotowane do bezpiecznego przewozu w kontrolowanej temperaturze.
              Poniżej znajdziesz standardowe i dodatkowe elementy wyposażenia.
            </p>

            {/* Linki wewnętrzne pod SEO */}
            <div className="text-sm text-slate-500 flex gap-2 justify-center flex-wrap border-t border-slate-200 pt-3">
              <span className="text-xs">Zobacz także:</span>
              <a href="/#flota" className="text-brand-blue hover:underline">Flota i cennik</a>
              <span>•</span>
              <Link href="/wynajem-mrozni" className="text-brand-blue hover:underline">Wynajem mroźni</Link>
              <span>•</span>
              <Link href="/wynajem-chlodni" className="text-brand-blue hover:underline">Wynajem chłodni</Link>
              <span>•</span>
              <Link href="/wymagania-auto-chlodnia-mroznia-izoterma" className="text-brand-blue hover:underline">Wymagania prawne</Link>
            </div>

            <div className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-blue/10 border border-brand-blue/20">
              <Snowflake className="h-5 w-5 text-brand-blue" />
              <span className="text-brand-blue font-medium">Profesjonalne wyposażenie do bezpiecznego transportu</span>
            </div>
          </div>
        </div>
      </section>

      {/* Standardowe wyposażenie */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-dark mb-4">
            <span className="text-brand-blue">Standardowe</span> wyposażenie
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Każdy pojazd ma akcesoria zapewniające bezpieczeństwo i komfort transportu.
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
                <h3 className="text-2xl font-bold text-brand-dark">Listwy aluminiowe do kotwiczenia ładunku</h3>
              </div>
              <p className="text-slate-600 text-lg leading-relaxed mb-4">
                Umożliwiają mocowanie pasami i chronią towar przed przesuwaniem się w trakcie jazdy.
                Wykonane z wytrzymałego aluminium.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">Mocowanie pasami</span>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">Wytrzymałe aluminium</span>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">Ochrona ładunku</span>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200">
              <img
                src={listwaImage}
                alt="Listwy aluminiowe do kotwiczenia ładunku w samochodzie mroźni"
                className="w-full h-80 object-cover"
                loading="lazy"
                width={1200}
                height={800}
                data-testid="img-listwy-aluminiowe"
              />
            </div>
          </div>

          {/* Drążek blokujący */}
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="order-2 lg:order-1 rounded-2xl overflow-hidden shadow-lg border border-slate-200">
              <img
                src={drazekImage}
                alt="Drążek do blokowania ładunku w przestrzeni ładunkowej samochodu mroźni"
                className="w-full h-80 object-cover"
                loading="lazy"
                width={1200}
                height={800}
                data-testid="img-drazek-blokujacy"
              />
            </div>
            <div className="order-1 lg:order-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-brand-light grid place-items-center">
                  <CheckCircle2 className="h-5 w-5 text-brand-blue" />
                </div>
                <h3 className="text-2xl font-bold text-brand-dark">Drążek do blokowania ładunku</h3>
              </div>
              <p className="text-slate-600 text-lg leading-relaxed mb-4">
                Szybkie zabezpieczenie palet i mniejszych przesyłek. Regulacja pozwala dopasować drążek do różnych szerokości.
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
                <h3 className="text-2xl font-bold text-brand-dark">Rejestrator temperatur ESCO DR201 (drukarka USB)</h3>
              </div>
              <p className="text-slate-600 text-lg leading-relaxed mb-4">
                Zapis przebiegu temperatury podczas transportu i szybki wydruk raportu dla klienta lub kontroli.
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
                alt="Rejestrator temperatur ESCO DR201 z drukarką USB – przykład urządzenia"
                className="h-80 object-contain"
                loading="lazy"
                width={800}
                height={800}
                data-testid="img-rejestrator-esco"
              />
            </div>
          </div>

          {/* Półka double deck */}
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="order-2 lg:order-1 rounded-2xl overflow-hidden shadow-lg border border-slate-200">
              <img
                src={polkaImage}
                alt="Półka double deck aluminiowa do dwupoziomowego załadunku w mroźni"
                className="w-full h-80 object-cover"
                loading="lazy"
                width={1200}
                height={800}
                data-testid="img-polka-doubledeck"
              />
            </div>
            <div className="order-1 lg:order-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-brand-light grid place-items-center">
                  <CheckCircle2 className="h-5 w-5 text-brand-blue" />
                </div>
                <h3 className="text-2xl font-bold text-brand-dark">Półka double deck aluminiowa</h3>
              </div>
              <p className="text-slate-600 text-lg leading-relaxed mb-4">
                Dwupoziomowy załadunek i lepsze wykorzystanie kubatury pojazdu. Idealna do mniejszych paczek i segregacji.
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
              <span className="text-brand-blue">Zaawansowane funkcje</span> agregatu chłodniczego
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Nowoczesne rozwiązania, które zwiększają komfort i efektywność transportu.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-center mb-12">
            <div className="order-2 lg:order-1">
              <img
                src={agregatImage}
                alt="Agregat chłodniczy z zasilaniem 230V i funkcją grzania – zdjęcie"
                className="w-full h-80 object-cover rounded-2xl shadow-lg border border-slate-200"
                loading="lazy"
                width={1200}
                height={800}
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
                    <h3 className="text-xl font-bold text-brand-dark">Zasilanie postojowe 230V</h3>
                  </div>
                  <p className="text-slate-600">
                    Podłączenie do sieci utrzymuje temperaturę bez pracy silnika – oszczędność paliwa i mniejsze emisje.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-red-50 grid place-items-center">
                      <Thermometer className="h-5 w-5 text-red-600" />
                    </div>
                    <h3 className="text-xl font-bold text-brand-dark">Funkcja grzania agregatu</h3>
                  </div>
                  <p className="text-slate-600">
                    Oprócz chłodzenia możliwe jest podgrzewanie przestrzeni ładunkowej – przydatne zimą dla towarów wymagających dodatnich temperatur.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mały box z korzyściami – skanowalne hasła */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white border rounded-xl p-4 text-sm"><Shield className="inline h-4 w-4 mr-2 text-brand-blue" /> Bezpieczeństwo ładunku</div>
            <div className="bg-white border rounded-xl p-4 text-sm"><FileText className="inline h-4 w-4 mr-2 text-brand-blue" /> Pełna dokumentacja (ESCO DR201)</div>
            <div className="bg-white border rounded-xl p-4 text-sm"><Truck className="inline h-4 w-4 mr-2 text-brand-blue" /> Lepsze wykorzystanie przestrzeni</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="bg-gradient-to-r from-brand-blue to-blue-600 rounded-3xl p-8 lg:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Profesjonalne wyposażenie dla Twojego biznesu</h2>
            <p className="text-xl mb-8 opacity-90">
              Wynajmij mroźnię/chłodnię z pełnym wyposażeniem. Gwarantujemy bezpieczny transport w kontrolowanej temperaturze.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
              <a
                href="tel:+48530410504"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-white text-brand-blue font-bold hover:bg-slate-50 transition-colors w-full sm:w-auto justify-center"
                data-testid="equipment-phone"
              >
                <span>📞 +48 530 410 504</span>
              </a>
              <Link href="/kontakt">
                <a
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-transparent border-2 border-white text-white font-bold hover:bg-white hover:text-brand-blue transition-colors w-full sm:w-auto justify-center"
                  data-testid="equipment-contact"
                >
                  ✉️ Sprawdź dostępność
                </a>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}