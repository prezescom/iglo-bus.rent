import { Helmet } from "react-helmet-async";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Thermometer, Shield, CheckCircle2, Truck, Clock, Phone, Mail, ArrowRight, Zap } from "lucide-react";
import { Link } from "wouter";

export default function WynajemMrozni() {
  const url = "https://www.iglo-bus.rent/wynajem-mrozni";
  const ogImage = "https://www.iglo-bus.rent/images/og-home-1200.jpg";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Helmet>
        {/* SEO core */}
        <title>Wynajem mroźni i chłodni – Śląsk (Katowice, Gliwice) | Iglo-Bus Rent</title>
        <meta
          name="description"
          content="Wynajem mroźni Toyota ProAce na Śląsku (Katowice, Gliwice). −20°C do +20°C, atest Sanepid, rejestrator temperatur, dostawa pod adres. Krótko i długoterminowo."
        />
        <link rel="canonical" href={url} />
        {/* hreflang to self (SEOCheck: alternate missing) */}
        <link rel="alternate" hrefLang="pl" href={url} />
        <link rel="alternate" hrefLang="x-default" href={url} />
        <meta name="robots" content="index,follow,max-image-preview:large" />

        {/* Open Graph / Twitter */}
        <meta property="og:site_name" content="Iglo-Bus Rent" />
        <meta property="og:title" content="Wynajem mroźni i chłodni – Śląsk (Katowice, Gliwice) | Iglo-Bus Rent" />
        <meta
          property="og:description"
          content="Profesjonalny wynajem mroźni, chłodni i izoterm. Toyota ProAce −20°C do +20°C. Obsługujemy Śląsk: Katowice, Gliwice i okolice."
        />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="pl_PL" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Wynajem mroźni i chłodni – Śląsk | Iglo-Bus Rent" />
        <meta
          name="twitter:description"
          content="Toyota ProAce −20°C do +20°C, atest Sanepid, rejestrator temperatur. Katowice, Gliwice i cały Śląsk."
        />
        <meta name="twitter:image" content={ogImage} />

        {/* LocalBusiness (Organization) */}
        <script type="application/ld+json">{JSON.stringify({
          "@context":"https://schema.org",
          "@type":"LocalBusiness",
          "name":"Iglo-Bus Rent – Wynajem mroźni i chłodni",
          "url": url,
          "telephone":"+48530410504",
          "email":"kontakt@iglo-bus.rent",
          "areaServed":["Woj. śląskie","Katowice","Gliwice","Zabrze","Bytom","Chorzów"],
          "address":{ "@type":"PostalAddress", "addressRegion":"Śląskie", "addressCountry":"PL" },
          "priceRange":"$$",
          "description":"Wynajem mroźni, chłodni i izoterm Toyota ProAce na Śląsku. Zakres temperatur −20°C do +20°C, atest Sanepid, rejestrator temperatur."
        })}</script>

        {/* FAQPage (zostaje) */}
        <script type="application/ld+json">{JSON.stringify({
          "@context":"https://schema.org",
          "@type":"FAQPage",
          "mainEntity":[
            { "@type":"Question", "name":"Ile kosztuje wynajem mroźni na Śląsku?", "acceptedAnswer":{ "@type":"Answer", "text":"Ceny zależą od modelu (Toyota ProAce City/ProAce/Maxi) oraz czasu najmu. Przygotowujemy wyceny dla Katowic, Gliwic i całego Śląska." }},
            { "@type":"Question", "name":"Czy obsługujecie Katowice i Gliwice?", "acceptedAnswer":{ "@type":"Answer", "text":"Tak. Obsługujemy Katowice, Gliwice i całe woj. śląskie. Zapewniamy dostawę auta pod adres." }},
            { "@type":"Question", "name":"Jaki jest zakres temperatur?", "acceptedAnswer":{ "@type":"Answer", "text":"Zakres roboczy od −20°C do +20°C. Pojazdy mają rejestrator temperatur (wydruki dla odbiorcy)." }},
            { "@type":"Question", "name":"Czy możliwy jest długoterminowy wynajem?", "acceptedAnswer":{ "@type":"Answer", "text":"Tak. Oferujemy najem długoterminowy z preferencyjnymi stawkami i serwisem." }}
          ]
        })}</script>

        {/* Breadcrumbs */}
        <script type="application/ld+json">{JSON.stringify({
          "@context":"https://schema.org",
          "@type":"BreadcrumbList",
          "itemListElement":[
            {"@type":"ListItem","position":1,"name":"Strona główna","item":"https://www.iglo-bus.rent/"},
            {"@type":"ListItem","position":2,"name":"Wynajem mroźni","item":url}
          ]
        })}</script>
      </Helmet>

      <Header />

      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-4 pt-8 pb-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6">
            {/* H1 – (SEOCheck: brak H1) */}
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight text-brand-dark">
              Wynajem mroźni <span className="text-brand-blue">Śląsk</span>
              <span className="block text-2xl lg:text-3xl mt-2 font-semibold">
                Auto chłodnia • Katowice • Gliwice
              </span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              <strong>Wynajem mroźni, chłodni i izoterm</strong> na Śląsku.
              Toyota ProAce w trzech rozmiarach: <span className="text-brand-blue font-semibold">S / M / L</span>.
              Atest Sanepid, rejestrator temperatur, dostawa pod adres.
            </p>

{/* szybkie fakty */}
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
                <span className="font-medium text-sm">Rejestrator</span>
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
                >
                  <Phone className="h-5 w-5" />
                  Zadzwoń: +48 530 410 504
                </a>
                <Link href="/kontakt">
                  <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-brand-blue text-brand-blue font-semibold hover:bg-brand-blue hover:text-white transition-colors">
                    <Mail className="h-5 w-5" />
                    Wyślij zapytanie
                  </button>
                </Link>
              </div>

              {/* linki wewnętrzne – SEOCheck: dead end */}
              <div className="flex flex-wrap gap-2 text-sm text-brand-blue">
                <Link href="/wynajem-chlodni">Wynajem chłodni</Link>
                <span>·</span>
                <Link href="/wyposazenie-samochodow-mrozni">Wyposażenie mroźni</Link>
                <span>·</span>
                <Link href="/wymagania-auto-chlodnia-mroznia-izoterma">Wymagania prawne</Link>
              </div>

              <div>
                <a href="/#flota">
                  <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-brand-blue/30 text-brand-blue font-medium hover:bg-brand-light transition-colors">
                    Zobacz pełną flotę i cennik
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </a>
              </div>
            </div>
          </div>

          {/* Logo / grafika – nie lazy dla LCP */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <Link href="/">
                <img
                  src="/images/ChatGPT Image 29 sie 2025, 09_14_10.png"
                  alt="Iglo-Bus Rent – wynajem mroźni i chłodni na Śląsku"
                  width={384}
                  height={384}
                  className="w-80 h-80 lg:w-96 lg:h-96 object-contain cursor-pointer hover:opacity-90 transition-opacity"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Dlaczego my */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-dark mb-4">
            Dlaczego <span className="text-brand-blue">wynajem mroźni</span> od Iglo-Bus Rent?
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Shield, title: "Pełna zgodność prawna", desc: "Zabudowy z atestem Sanepid, komplet dokumentów do odbiorów." },
            { icon: Thermometer, title: "Precyzyjna temperatura", desc: "Rejestrator Esco DR201 z szybkim wydrukiem i pamięcią wewnętrzną." },
            { icon: Clock, title: "Elastyczny wynajem", desc: "Od 1 dnia do najmu długoterminowego." },
            { icon: Truck, title: "Dostawa na Śląsku", desc: "Katowice, Gliwice i całe województwo śląskie." },
            { icon: Zap, title: "Nowoczesna flota", desc: "Toyota ProAce, zewnętrzne zasilanie 230V." },
            { icon: CheckCircle2, title: "Niezawodność", desc: "Regularny serwis – minimalizujemy ryzyko przestojów." }
          ].map(({icon: Icon, title, desc}, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl bg-brand-light grid place-items-center">
                  <Icon className="h-6 w-6 text-brand-blue" />
                </div>
                <h3 className="font-semibold text-brand-dark">{title}</h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Parametry techniczne i warunki */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-xl bg-brand-light grid place-items-center">
                  <Thermometer className="h-6 w-6 text-brand-blue" />
                </div>
                <h3 className="text-2xl font-bold text-brand-dark">Parametry techniczne</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50">
                  <span className="font-medium">Zakres temperatury</span>
                  <span className="font-bold text-brand-blue">−20°C do +20°C</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50">
                  <span className="font-medium">Typy zabudowy</span>
                  <span className="font-semibold">Izoterma / Chłodnia / Mroźnia</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50">
                  <span className="font-medium">Rejestrator</span>
                  <span className="font-semibold">Esco DR201 (wydruki)</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50">
                  <span className="font-medium">Zasilanie</span>
                  <span className="font-semibold">Agregat + 230V (opcjonalnie)</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50">
                  <span className="font-medium">Wyposażenie</span>
                  <span className="font-semibold">Półki, punkty mocowania</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-xl bg-brand-light grid place-items-center">
                  <CheckCircle2 className="h-6 w-6 text-brand-blue" />
                </div>
                <h3 className="text-2xl font-bold text-brand-dark">Warunki wynajmu</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                  <CheckCircle2 className="h-5 w-5 text-brand-blue mt-0.5" />
                  <div>
                    <span className="font-medium block">Atest Sanepid</span>
                    <span className="text-sm text-slate-600">Pełna dokumentacja do odbiorów</span>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                  <CheckCircle2 className="h-5 w-5 text-brand-blue mt-0.5" />
                  <div>
                    <span className="font-medium block">Obsługa Śląska</span>
                    <span className="text-sm text-slate-600">Katowice, Gliwice + dostawa/odbiór</span>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                  <CheckCircle2 className="h-5 w-5 text-brand-blue mt-0.5" />
                  <div>
                    <span className="font-medium block">Faktury VAT</span>
                    <span className="text-sm text-slate-600">Umowa online, rozliczenia B2B</span>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                  <CheckCircle2 className="h-5 w-5 text-brand-blue mt-0.5" />
                  <div>
                    <span className="font-medium block">Elastyczny okres</span>
                    <span className="text-sm text-slate-600">Krótko- i długoterminowo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flota */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-dark mb-4">
            Nasza <span className="text-brand-blue">flota mroźni</span> na Śląsku
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Toyota ProAce w trzech rozmiarach – od dostaw miejskich po większe trasy. Każdy pojazd ma pełny zakres temperatur i atest Sanepid.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src="/images/ProAce City 1_1757356289373.JPG"
                alt="Toyota ProAce City – mała chłodnia do wynajęcia, Katowice i Gliwice"
                className="w-full h-48 object-cover"
                loading="lazy"
                width={800}
                height={400}
              />
              <div className="absolute top-4 right-4 bg-brand-blue text-white px-3 py-1 rounded-full text-sm font-semibold">
                Rozmiar S
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-brand-dark mb-2">Toyota ProAce City</h3>
              <p className="text-slate-600 mb-4">Kompaktowy, ekonomiczny – pełna kontrola temperatury do dystrybucji miejskiej.</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Pojemność</span><span className="font-semibold">~3,3 m³</span></div>
                <div className="flex justify-between"><span>Temperatura</span><span className="font-semibold text-brand-blue">−20°C / +20°C</span></div>
                <div className="flex justify-between"><span>Zastosowanie</span><span className="font-semibold">Dostawy miejskie</span></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src="/images/ProAce 1_1757356289351.JPG"
                alt="Toyota ProAce – izoterma/chłodnia do wynajęcia na Śląsku"
                className="w-full h-48 object-cover"
                loading="lazy"
                width={800}
                height={400}
              />
              <div className="absolute top-4 right-4 bg-brand-blue text-white px-3 py-1 rounded-full text-sm font-semibold">
                Rozmiar M
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-brand-dark mb-2">Toyota ProAce</h3>
              <p className="text-slate-600 mb-4">Najbardziej uniwersalny – optymalny stosunek pojemności do kosztu.</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Pojemność</span><span className="font-semibold">~5,5 m³</span></div>
                <div className="flex justify-between"><span>Temperatura</span><span className="font-semibold text-brand-blue">−20°C / +20°C</span></div>
                <div className="flex justify-between"><span>Zastosowanie</span><span className="font-semibold">Transport regionalny</span></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src="/images/ProAce Maxi 1_1757356289375.JPG"
                alt="Toyota ProAce Maxi – duża mroźnia do wynajęcia na Śląsku"
                className="w-full h-48 object-cover"
                loading="lazy"
                width={800}
                height={400}
              />
              <div className="absolute top-4 right-4 bg-brand-blue text-white px-3 py-1 rounded-full text-sm font-semibold">
                Rozmiar L
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-brand-dark mb-2">Toyota ProAce Maxi</h3>
              <p className="text-slate-600 mb-4">Największa pojemność – na duże, dłuższe transporty.</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Pojemność</span><span className="font-semibold">~8,6 m³</span></div>
                <div className="flex justify-between"><span>Temperatura</span><span className="font-semibold text-brand-blue">−20°C / +20°C</span></div>
                <div className="flex justify-between"><span>Zastosowanie</span><span className="font-semibold">Duże ładunki</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-dark mb-4">
              Najczęściej <span className="text-brand-blue">zadawane pytania</span>
            </h2>
            <p className="text-lg text-slate-600">Najważniejsze informacje o wynajmie mroźni na Śląsku</p>
          </div>

          <div className="grid gap-4 max-w-4xl mx-auto">
            {[
              { q: "Ile kosztuje wynajem mroźni na Śląsku?", a: "Ceny zależą od modelu (City/ProAce/Maxi), czasu najmu i trasy. Oferujemy konkurencyjne stawki dla firm z Katowic, Gliwic i całego Śląska. Skontaktuj się, a przygotujemy wycenę." },
              { q: "Czy obsługujecie Katowice i Gliwice?", a: "Tak, działamy w całym woj. śląskim: Katowice, Gliwice, Zabrze, Bytom, Chorzów. Dostarczamy auto pod adres i odbieramy po zakończeniu najmu." },
              { q: "Jaki zakres temperatur?", a: "Wszystkie auta utrzymują −20°C do +20°C, wyposażone w rejestrator Esco DR201 (wydruk dla odbiorcy). Dostępne izotermy, chłodnie i mroźnie." },
              { q: "Czy można wynająć długoterminowo?", a: "Oczywiście. Najem długoterminowy ze stałą stawką, pełnym serwisem i elastycznymi rozliczeniami B2B." },
              { q: "Czy jest zasilanie 230V?", a: "Tak, opcjonalne zasilanie 230V pozwala utrzymać temperaturę na postoju lub przy rozładunku." }
            ].map(({q, a}, idx) => (
              <details key={idx} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <summary className="p-6 font-semibold text-brand-dark cursor-pointer hover:text-brand-blue transition-colors">
                  {q}
                </summary>
                <div className="px-6 pb-6 text-slate-600 leading-relaxed">
                  {a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="bg-gradient-to-r from-brand-blue to-blue-600 rounded-3xl p-8 lg:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Sprawdź dostępność mroźni na Śląsku
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Odpowiadamy szybko — zwykle w kilkanaście minut. Wynajem mroźni w Katowicach, Gliwicach i na całym Śląsku.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
              <a
                href="tel:+48530410504"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-white text-brand-blue font-bold hover:bg-slate-50 transition-colors w-full sm:w-auto justify-center"
              >
                <Phone className="h-6 w-6" />
                <div className="text-left">
                  <div className="text-sm opacity-75">Zadzwoń teraz</div>
                  <div className="text-lg">+48 530 410 504</div>
                </div>
              </a>

              <Link href="/kontakt">
                <button className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-transparent border-2 border-white text-white font-bold hover:bg-white hover:text-brand-blue transition-colors w-full sm:w-auto justify-center">
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
                <span className="text-sm">Faktury VAT, B2B</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}