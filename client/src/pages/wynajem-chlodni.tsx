import { Helmet } from "react-helmet-async";
import Header from "@/components/header";
import Footer from "@/components/footer";
import {
  Thermometer,
  Shield,
  CheckCircle2,
  Truck,
  Clock,
  Phone,
  Mail,
  ArrowRight,
  Package,
  Zap,
  Heart,
  ShoppingCart,
  Car,
  Settings,
} from "lucide-react";
import { Link } from "wouter";

export default function WynajemChlodni() {
  const url = "https://www.iglo-bus.rent/wynajem-chlodni";
  const ogImage = "https://www.iglo-bus.rent/images/og-home-1200.jpg";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Helmet>
        {/* SEO core */}
        <title>Wynajem samochodów chłodni – Śląsk (Katowice, Gliwice) | Iglo-Bus Rent</title>
        <meta
          name="description"
          content="Wynajem aut chłodni na Śląsku: Katowice, Gliwice i okolice. Toyota ProAce −20°C do +20°C, atest Sanepid, rejestrator temperatur. Krótko i długoterminowo."
        />
        <link rel="canonical" href={url} />
        <meta name="robots" content="index,follow,max-image-preview:large" />

        {/* Open Graph / Twitter */}
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="pl_PL" />
        <meta property="og:site_name" content="Iglo-Bus Rent" />
        <meta property="og:title" content="Wynajem samochodów chłodni – Śląsk (Katowice, Gliwice) | Iglo-Bus Rent" />
        <meta
          property="og:description"
          content="Profesjonalny transport chłodniczy. Samochody chłodnie Toyota ProAce z zakresem −20°C do +20°C, atest Sanepid, rejestrator temperatur."
        />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Wynajem samochodów chłodni – Śląsk | Iglo-Bus Rent" />
        <meta
          name="twitter:description"
          content="Auta chłodnie Toyota ProAce: −20°C do +20°C, Sanepid, rejestrator. Katowice, Gliwice, cały Śląsk."
        />
        <meta name="twitter:image" content={ogImage} />

        {/* LocalBusiness */}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Iglo-Bus Rent - Wynajem Samochodów Chłodni",
          url,
          telephone: "+48530410504",
          email: "kontakt@iglo-bus.rent",
          areaServed: ["Śląskie", "Katowice", "Gliwice", "Zabrze", "Bytom", "Chorzów"],
          address: { "@type": "PostalAddress", addressRegion: "Śląskie", addressCountry: "PL" },
          priceRange: "$$",
          description:
            "Wynajem samochodów chłodni do transportu produktów spożywczych, leków i cateringów. Toyota ProAce −20°C do +20°C, atest Sanepid, rejestrator temperatur.",
          serviceType: ["Transport chłodniczy", "Wynajem aut chłodni", "Transport produktów spożywczych", "Transport farmaceutyczny"],
        })}</script>

        {/* Service */}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Wynajem samochodów chłodni",
          description:
            "Profesjonalny wynajem samochodów chłodni do przewozu towarów wymagających kontroli temperatury na Śląsku.",
          provider: { "@type": "Organization", name: "Iglo-Bus Rent" },
          areaServed: ["Śląskie", "Katowice", "Gliwice"],
          serviceType: "Transport chłodniczy",
          url
        })}</script>

        {/* FAQPage */}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "Co można przewozić auto-chłodnią?",
              acceptedAnswer: {
                "@type": "Answer",
                text:
                  "Świeże produkty spożywcze, wyroby mrożone, catering, leki i inne towary wrażliwe na temperaturę zgodnie z HACCP."
              }
            },
            {
              "@type": "Question",
              name: "Jaki zakres temperatur oferują samochody chłodnie?",
              acceptedAnswer: {
                "@type": "Answer",
                text:
                  "Kontrola temperatury od −20°C do +20°C z precyzyjnym monitoringiem i rejestratorem temperatur."
              }
            },
            {
              "@type": "Question",
              name: "Czy pojazdy mają atest Sanepid?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Tak, wszystkie auta mają atest Sanepid i aktualną dokumentację."
              }
            },
            {
              "@type": "Question",
              name: "Czy możliwy jest elastyczny wynajem?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Tak, krótkoterminowo i długoterminowo – zależnie od potrzeb."
              }
            }
          ]
        })}</script>

        {/* Breadcrumbs */}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Strona główna", item: "https://www.iglo-bus.rent/" },
            { "@type": "ListItem", position: 2, name: "Wynajem chłodni", item: url }
          ]
        })}</script>
      </Helmet>

      <Header />

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-8 pb-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight text-brand-dark">
              Wynajem samochodów <span className="text-brand-blue">chłodni</span>
              <span className="block text-2xl lg:text-3xl mt-2 font-semibold">
                Szybki i bezpieczny transport
              </span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              <strong>Samochody chłodnie</strong> zapewniają stabilną temperaturę w zakresie{" "}
              <span className="text-brand-blue font-semibold">−20°C do +20°C</span>. Idealne do przewozu
              żywności, leków i cateringu – zgodnie z wymogami sanitarnymi.
            </p>

            {/* Info box */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-lg border-2 border-orange-400">
              <div className="flex items-center gap-3 justify-center">
                <div className="h-8 w-8 rounded-full bg-white/20 grid place-items-center">
                  <Thermometer className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-center">
                  Mroźnia to „mocniejsza” chłodnia
                </h3>
                <div className="h-8 w-8 rounded-full bg-white/20 grid place-items-center">
                  <CheckCircle2 className="h-5 w-5 text-white" />
                </div>
              </div>
              <p className="text-center text-orange-100 text-sm mt-2">
                Niższa temperatura = dłuższa świeżość = oszczędności
              </p>
            </div>

            {/* fakty */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-brand-light border border-brand-blue/20">
                <Thermometer className="h-5 w-5 text-brand-blue" />
                <span className="font-medium text-sm">−20°C/+20°C</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-brand-light border border-brand-blue/20">
                <Shield className="h-5 w-5 text-brand-blue" />
                <span className="font-medium text-sm">Atest Sanepid</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-brand-light border border-brand-blue/20">
                <CheckCircle2 className="h-5 w-5 text-brand-blue" />
                <span className="font-medium text-sm">Śląsk</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-brand-light border border-brand-blue/20">
                <Zap className="h-5 w-5 text-brand-blue" />
                <span className="font-medium text-sm">230V (opcja)</span>
              </div>
            </div>

            {/* CTA */}
            <div className="space-y-4">
              <div className="flex gap-4 flex-wrap">
                <a
                  href="tel:+48530410504"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-blue text-white font-semibold hover:bg-brand-blue/90 transition-colors"
                  data-testid="phone-cta"
                >
                  <Phone className="h-5 w-5" />
                  Zadzwoń: +48 530 410 504
                </a>
                <Link href="/kontakt">
                  <button
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-brand-blue text-brand-blue font-semibold hover:bg-brand-blue hover:text-white transition-colors"
                    data-testid="contact-cta"
                  >
                    <Mail className="h-5 w-5" />
                    Wyślij zapytanie
                  </button>
                </Link>
              </div>

              {/* linki wewnętrzne pod SEO */}
              <div className="flex flex-wrap gap-2 text-sm text-brand-blue">
                <Link href="/wynajem-mrozni">Wynajem mroźni</Link>
                <span>·</span>
                <Link href="/kontakt">Kontakt</Link>
              </div>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <img
                src="/images/ProAce 1_1757356289351.JPG"
                alt="Wynajem samochodu chłodni Toyota ProAce – auto chłodnia Śląsk"
                className="w-full max-w-lg rounded-2xl shadow-lg"
                width={896}
                height={512}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Co można przewozić */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-dark mb-4">
            Co można przewozić <span className="text-brand-blue">auto-chłodnią?</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Samochody chłodnie bezpiecznie transportują towary wymagające kontrolowanej temperatury.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Package, title: "Świeże produkty spożywcze", desc: "nabiał, mięso, ryby, warzywa, owoce", color: "text-green-600", bgColor: "bg-green-50" },
            { icon: Package, title: "Wyroby mrożone", desc: "produkty głęboko mrożone", color: "text-blue-600", bgColor: "bg-blue-50" },
            { icon: ShoppingCart, title: "Catering i cukiernia", desc: "torty, ciasta, gotowe posiłki", color: "text-orange-600", bgColor: "bg-orange-50" },
            { icon: Heart, title: "Leki i produkty medyczne", desc: "farmaceutyki i materiały medyczne", color: "text-red-600", bgColor: "bg-red-50" },
            { icon: Thermometer, title: "Inne towary wrażliwe", desc: "produkty wymagające specjalnych warunków", color: "text-purple-600", bgColor: "bg-purple-50" },
            { icon: CheckCircle2, title: "Transport zgodnie z HACCP", desc: "procedury bezpieczeństwa żywności", color: "text-brand-blue", bgColor: "bg-brand-light" }
          ].map(({ icon: Icon, title, desc, color, bgColor }, idx) => (
            <div key={idx} className={`${bgColor} rounded-2xl p-6 border border-slate-200 hover:shadow-md transition-shadow`}>
              <div className="flex items-start gap-3 mb-3">
                <div className={`h-12 w-12 rounded-xl ${bgColor} grid place-items-center border`}>
                  <Icon className={`h-6 w-6 ${color}`} />
                </div>
                <div>
                  <h3 className="font-bold text-brand-dark mb-1">{title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Zalety */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-dark mb-4">
              Zalety wynajmu auta chłodni w <span className="text-brand-blue">Iglo-Bus Rent</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Wynajem z pełnym wsparciem technicznym i dokumentacyjnym.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Thermometer, title: "Kontrola temperatury", desc: "ustawienie i monitoring −20°C do +20°C" },
              { icon: Shield, title: "Atest Sanepid", desc: "spełniamy wymogi sanitarne, aktualne przeglądy" },
              { icon: Clock, title: "Elastyczny wynajem", desc: "krótko i długoterminowo – zależnie od potrzeb" },
              { icon: Truck, title: "Szybka dostępność", desc: "podstawiamy auto na Śląsku i w okolicy" },
              { icon: CheckCircle2, title: "Oszczędność", desc: "płacisz tylko, kiedy potrzebujesz pojazdu" },
              { icon: Car, title: "Nowoczesna flota", desc: "Toyota ProAce – niezawodna, ekonomiczna" }
            ].map(({ icon: Icon, title, desc }, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-brand-light grid place-items-center">
                    <Icon className="h-6 w-6 text-brand-blue" />
                  </div>
                  <h3 className="font-bold text-brand-dark">{title}</h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wyposażenie profesjonalnej autochłodni */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-dark mb-4">
            Wyposażenie profesjonalnej <span className="text-brand-blue">autochłodni</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Każde auto ma nowoczesne systemy zapewniające bezpieczny transport.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-xl bg-brand-light grid place-items-center">
                <Settings className="h-6 w-6 text-brand-blue" />
              </div>
              <h3 className="text-2xl font-bold text-brand-dark">Systemy chłodnicze</h3>
            </div>
            <div className="space-y-4">
              {[
                ["Agregat chłodniczy", "z regulacją temperatury"],
                ["Izolowana zabudowa", "utrzymuje chłód przez długi czas"],
                ["Rejestrator temperatury", "wydruk na życzenie odbiorcy"],
              ].map(([title, sub], i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                  <CheckCircle2 className="h-5 w-5 text-brand-blue mt-0.5" />
                  <div>
                    <span className="font-medium block">{title}</span>
                    <span className="text-sm text-slate-600">{sub}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-xl bg-brand-light grid place-items-center">
                <Package className="h-6 w-6 text-brand-blue" />
              </div>
              <h3 className="text-2xl font-bold text-brand-dark">Wyposażenie ładunkowe</h3>
            </div>
            <div className="space-y-4">
              {[
                ["Przegrody i półki", "łatwa organizacja przestrzeni"],
                ["System mocowania ładunku", "bezpieczeństwo podczas jazdy"],
                ["Łatwy dostęp", "drzwi boczne i tylne"],
              ].map(([title, sub], i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                  <CheckCircle2 className="h-5 w-5 text-brand-blue mt-0.5" />
                  <div>
                    <span className="font-medium block">{title}</span>
                    <span className="text-sm text-slate-600">{sub}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Flota */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-dark mb-4">
              Nasza <span className="text-brand-blue">flota samochodów mroźni</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Toyota ProAce w trzech rozmiarach – od małych dostaw po duże transporty. Wszystkie z pełną kontrolą temperatury i atestem Sanepid.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            {/* S */}
            <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src="/images/ProAce City 1_1757356289373.JPG"
                  alt="Wynajem auta chłodni Toyota ProAce City – mała chłodnia Katowice"
                  className="w-full h-48 object-cover"
                  loading="lazy"
                  width={800}
                  height={400}
                />
                <div className="absolute top-4 right-4 bg-brand-blue text-white px-3 py-1 rounded-full text-sm font-semibold">Rozmiar S</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-brand-dark mb-2">Toyota ProAce City</h3>
                <p className="text-slate-600 mb-4">Kompaktowy i ekonomiczny. Pełna kontrola temperatury.</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Pojemność:</span><span className="font-semibold">~3,3 m³</span></div>
                  <div className="flex justify-between"><span>Temperatura:</span><span className="font-semibold text-brand-blue">−20°C / +20°C</span></div>
                  <div className="flex justify-between"><span>Zastosowanie:</span><span className="font-semibold">Dostawy miejskie</span></div>
                </div>
              </div>
            </div>

            {/* M */}
            <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src="/images/ProAce 1_1757356289351.JPG"
                  alt="Wynajem auta chłodni Toyota ProAce – średnia chłodnia Śląsk"
                  className="w-full h-48 object-cover"
                  loading="lazy"
                  width={800}
                  height={400}
                />
                <div className="absolute top-4 right-4 bg-brand-blue text-white px-3 py-1 rounded-full text-sm font-semibold">Rozmiar M</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-brand-dark mb-2">Toyota ProAce</h3>
                <p className="text-slate-600 mb-4">Uniwersalny rozmiar – dobry stosunek pojemności do kosztu.</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Pojemność:</span><span className="font-semibold">~5,5 m³</span></div>
                  <div className="flex justify-between"><span>Temperatura:</span><span className="font-semibold text-brand-blue">−20°C / +20°C</span></div>
                  <div className="flex justify-between"><span>Zastosowanie:</span><span className="font-semibold">Transport regionalny</span></div>
                </div>
              </div>
            </div>

            {/* L */}
            <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src="/images/ProAce Maxi 1_1757356289375.JPG"
                  alt="Wynajem auta chłodni Toyota ProAce Maxi – duża chłodnia Gliwice"
                  className="w-full h-48 object-cover"
                  loading="lazy"
                  width={800}
                  height={400}
                />
                <div className="absolute top-4 right-4 bg-brand-blue text-white px-3 py-1 rounded-full text-sm font-semibold">Rozmiar L</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-brand-dark mb-2">Toyota ProAce Maxi</h3>
                <p className="text-slate-600 mb-4">Największa pojemność – na dłuższe trasy i większe ładunki.</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Pojemność:</span><span className="font-semibold">~8,6 m³</span></div>
                  <div className="flex justify-between"><span>Temperatura:</span><span className="font-semibold text-brand-blue">−20°C / +20°C</span></div>
                  <div className="flex justify-between"><span>Zastosowanie:</span><span className="font-semibold">Duże transporty</span></div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <a href="/#flota">
              <button
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-brand-blue text-brand-blue font-semibold hover:bg-brand-blue hover:text-white transition-colors"
                data-testid="fleet-cta"
              >
                Zobacz pełną flotę i cennik
                <ArrowRight className="h-5 w-5" />
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="bg-gradient-to-r from-brand-blue to-blue-600 rounded-3xl p-8 lg:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Sprawdź dostępność samochodów chłodni</h2>
            <p className="text-xl mb-8 opacity-90">
              Odpowiadamy szybko — zwykle w kilkanaście minut. Transport chłodniczy: Katowice, Gliwice i cały Śląsk.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
              <a
                href="tel:+48530410504"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-white text-brand-blue font-bold hover:bg-slate-50 transition-colors w-full sm:w-auto justify-center"
                data-testid="cta-phone"
              >
                <Phone className="h-6 w-6" />
                <div className="text-left">
                  <div className="text-sm opacity-75">Zadzwoń teraz</div>
                  <div className="text-lg">+48 530 410 504</div>
                </div>
              </a>

              <Link href="/kontakt">
                <button
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-transparent border-2 border-white text-white font-bold hover:bg-white hover:text-brand-blue transition-colors w-full sm:w-auto justify-center"
                  data-testid="cta-email"
                >
                  <Mail className="h-6 w-6" />
                  <div className="text-left">
                    <div className="text-sm opacity-75">Wyślij e-mail</div>
                    <div className="text-lg">kontakt@iglo-bus.rent</div>
                  </div>
                </button>
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="flex items-center justify-center gap-2 opacity-90">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-sm">Obsługa całego Śląska</span>
              </div>
              <div className="flex items-center justify-center gap-2 opacity-90">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-sm">Dostawa pod adres</span>
              </div>
              <div className="flex items-center justify-center gap-2 opacity-90">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-sm">Atest Sanepid</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
