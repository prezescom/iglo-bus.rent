import { Helmet } from "react-helmet-async";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Thermometer, Shield, CheckCircle2, Truck, Clock, Phone, Mail, ArrowRight, Snowflake, Zap } from "lucide-react";
import { Link } from "wouter";
import fridgeExpressImage from "@assets/IMG_622-large_1757356251568.jpg";

export default function WynajemMrozni() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Helmet>
        <title>Wynajem Mroźni Śląsk | Auto Chłodnia Katowice Gliwice | Wynajem Chłodni</title>
        <meta name="description" content="Wynajem mroźni, chłodni i izoterm Śląsk ✓ Auto chłodnia Katowice, Gliwice ✓ Toyota ProAce -20°C/+20°C ✓ Sanepid, rejestrator temperatur ✓ Krótko i długoterminowo" />
        <meta name="keywords" content="wynajem mroźni, wynajem chłodni, wynajem auto chłodnia, wynajem izoterma, śląsk, katowice, gliwice, mroźnia na wynajem, chłodnia wynajem, auto z chłodnią" />
        <link rel="canonical" href="https://www.iglo-bus.rent/wynajem-mrozni" />
        <meta name="robots" content="index,follow" />
        <meta property="og:title" content="Wynajem Mroźni Śląsk | Auto Chłodnia Katowice Gliwice" />
        <meta property="og:description" content="Profesjonalny wynajem mroźni, chłodni i izoterm. Toyota ProAce -20°C do +20°C. Obsługujemy Śląsk: Katowice, Gliwice i okolice." />
        <meta property="og:url" content="https://www.iglo-bus.rent/wynajem-mrozni" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.iglo-bus.rent/images/og-home-1200.jpg" />
        <script type="application/ld+json">{JSON.stringify({
          "@context":"https://schema.org",
          "@type":"LocalBusiness",
          name:"Iglo-Bus Rent - Wynajem Mroźni",
          url:"https://www.iglo-bus.rent/wynajem-mrozni",
          telephone:"+48530410504",
          email:"kontakt@iglo-bus.rent",
          areaServed:["Śląskie", "Katowice", "Gliwice", "Zabrze", "Bytom", "Chorzów"],
          address:{ "@type":"PostalAddress", addressRegion:"Śląskie", addressCountry:"PL" },
          priceRange:"$$",
          description:"Profesjonalny wynajem mroźni, chłodni i samochodów z chłodnią na Śląsku. Toyota ProAce od -20°C do +20°C.",
          hasOfferingCatalog:{
            "@type":"OfferingCatalog",
            name:"Wynajem Mroźni i Chłodni",
            itemListElement:[
              { "@type":"Offer", itemOffered:{ "@type":"Product", name:"Wynajem mroźni Toyota ProAce City", description:"Mała mroźnia -20°C do +20°C" }},
              { "@type":"Offer", itemOffered:{ "@type":"Product", name:"Wynajem chłodni Toyota ProAce", description:"Średnia chłodnia z kontrolą temperatury" }},
              { "@type":"Offer", itemOffered:{ "@type":"Product", name:"Wynajem izotermy Toyota ProAce Maxi", description:"Duża izoterma do transportu chłodniczego" }}
            ]
          }
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context":"https://schema.org",
          "@type":"FAQPage",
          mainEntity:[
            { "@type":"Question", name:"Ile kosztuje wynajem mroźni na Śląsku?", acceptedAnswer:{ "@type":"Answer", text:"Ceny wynajmu mroźni zależą od modelu Toyota ProAce i czasu najmu. Oferujemy konkurencyjne stawki dla Katowic, Gliwic i całego Śląska." }},
            { "@type":"Question", name:"Czy obsługujecie wynajem chłodni w Katowicach?", acceptedAnswer:{ "@type":"Answer", text:"Tak, obsługujemy wynajem chłodni i mroźni w Katowicach, Gliwicach i całym województwie śląskim z dostawą do klienta." }},
            { "@type":"Question", name:"Jaki zakres temperatur w wynajmowanych auto chłodniach?", acceptedAnswer:{ "@type":"Answer", text:"Nasze samochody z chłodnią utrzymują zakres od -20°C do +20°C z precyzyjnym rejestratorem temperatur Esco DR201." }},
            { "@type":"Question", name:"Czy można wynająć izotermę długoterminowo?", acceptedAnswer:{ "@type":"Answer", text:"Tak, oferujemy długoterminowy wynajem izoterm z preferencyjnymi stawkami i pełnym serwisem technicznym." }}
          ]
        })}</script>
      </Helmet>
      <Header />

      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-4 pt-8 pb-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight text-brand-dark">
              Wynajem Mroźni <span className="text-brand-blue">Śląsk</span>
              <span className="block text-2xl lg:text-3xl mt-2 font-semibold">Auto Chłodnia • Katowice • Gliwice</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Profesjonalny <strong>wynajem mroźni, chłodni i izoterm</strong> na Śląsku. 
              Toyota ProAce w trzech rozmiarach: <span className="text-brand-blue font-semibold">-20°C do +20°C</span>. 
              Atest Sanepid, rejestrator temperatur, dostawa na miejscu.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-brand-light border border-brand-blue/20">
                <Thermometer className="h-5 w-5 text-brand-blue" />
                <span className="font-medium text-sm">-20°C/+20°C</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-brand-light border border-brand-blue/20">
                <Shield className="h-5 w-5 text-brand-blue" />
                <span className="font-medium text-sm">Sanepid</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-brand-light border border-brand-blue/20">
                <CheckCircle2 className="h-5 w-5 text-brand-blue" />
                <span className="font-medium text-sm">Śląsk</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-brand-light border border-brand-blue/20">
                <Zap className="h-5 w-5 text-brand-blue" />
                <span className="font-medium text-sm">230V</span>
              </div>
            </div>

            <div className="flex gap-4 flex-wrap">
              <a 
                href="tel:+48530410504"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-blue text-white font-semibold hover:bg-brand-blue/90 transition-colors"
              >
                <Phone className="h-5 w-5" />
                Zadzwoń: +48 530 410 504
              </a>
              <a 
                href="mailto:kontakt@iglo-bus.rent"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-brand-blue text-brand-blue font-semibold hover:bg-brand-blue hover:text-white transition-colors"
              >
                <Mail className="h-5 w-5" />
                Wyślij zapytanie
              </a>
            </div>
          </div>
          
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <img 
                src="/images/ChatGPT Image 29 sie 2025, 09_14_10.png" 
                alt="Iglo-Bus.rent - Logo firmy wynajmu mroźni" 
                className="w-80 h-80 lg:w-96 lg:h-96 object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Dlaczego wybieramy nas */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-dark mb-4">
            Dlaczego <span className="text-brand-blue">Wynajem Mroźni</span> od Iglo-Bus Rent?
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Jesteśmy specjalistami w wynajmie chłodni, mroźni i izoterm na Śląsku. 
            Obsługujemy firmy z Katowic, Gliwic i całego województwa śląskiego.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Shield,
              title: "Pełna zgodność prawna",
              desc: "Zabudowy z atestem Sanepid, wszystkie dokumenty do kontroli i odbiorów towarów."
            },
            {
              icon: Thermometer,
              title: "Precyzyjna kontrola temperatury",
              desc: "Rejestrator Esco DR201 z możliwością szybkiego wydruku dla odbiorcy towaru."
            },
            {
              icon: Clock,
              title: "Elastyczny wynajem",
              desc: "Od jednego dnia do długoterminowych umów. Dostosowujemy ofertę do Twoich potrzeb."
            },
            {
              icon: Truck,
              title: "Dostępność na Śląsku",
              desc: "Obsługujemy Katowice, Gliwice i całe województwo śląskie z dostawą pod wskazany adres."
            },
            {
              icon: Zap,
              title: "Nowoczesna flota",
              desc: "Toyota ProAce z zasilaniem 230V, ekonomiczne silniki i niezawodność japońskiej marki."
            },
            {
              icon: CheckCircle2,
              title: "Niezawodność floty",
              desc: "Nowoczesne pojazdy Toyota ProAce o wysokiej jakości i sprawności, co minimalizuje ryzyko awarii podczas najmu."
            }
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
                <h3 className="text-2xl font-bold text-brand-dark">Parametry Techniczne</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50">
                  <span className="font-medium">Zakres temperatury:</span>
                  <span className="font-bold text-brand-blue">-20°C do +20°C</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50">
                  <span className="font-medium">Typy zabudowy:</span>
                  <span className="font-semibold">Izotermy / Chłodnie / Mroźnie</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50">
                  <span className="font-medium">Rejestrator:</span>
                  <span className="font-semibold">Esco DR201 (wydruki)</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50">
                  <span className="font-medium">Zasilanie:</span>
                  <span className="font-semibold">Agregat + opcjonalnie 230V</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50">
                  <span className="font-medium">Wyposażenie:</span>
                  <span className="font-semibold">Półki, punkty mocowania</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-xl bg-brand-light grid place-items-center">
                  <CheckCircle2 className="h-6 w-6 text-brand-blue" />
                </div>
                <h3 className="text-2xl font-bold text-brand-dark">Warunki Wynajmu</h3>
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
                    <span className="text-sm text-slate-600">Krótko- i długoterminowy wynajem</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nasza flota */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-dark mb-4">
            Nasza <span className="text-brand-blue">Flota Mroźni</span> na Śląsku
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Toyota ProAce w trzech rozmiarach - od małych dostaw miejskich po duże transporty międzywojewódzkie.
            Wszystkie z pełnym zakresem temperatur i atestem Sanepid.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-shadow">
            <div className="relative">
              <img 
                src="/images/ProAce City 1_1757356289373.JPG" 
                alt="Wynajem chłodnia Toyota ProAce City - mała chłodnia do wynajęcia Katowice Gliwice"
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 right-4 bg-brand-blue text-white px-3 py-1 rounded-full text-sm font-semibold">
                Rozmiar S
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-brand-dark mb-2">Toyota ProAce City</h3>
              <p className="text-slate-600 mb-4">Idealny do dostaw w centrum miasta. Kompaktowy, ekonomiczny, z pełną kontrolą temperatury.</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Pojemność:</span>
                  <span className="font-semibold">~3,3m³</span>
                </div>
                <div className="flex justify-between">
                  <span>Temperatura:</span>
                  <span className="font-semibold text-brand-blue">-20°C / +20°C</span>
                </div>
                <div className="flex justify-between">
                  <span>Zastosowanie:</span>
                  <span className="font-semibold">Dystrybucja miejska</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-shadow">
            <div className="relative">
              <img 
                src="/images/ProAce 1_1757356289351.JPG" 
                alt="Wynajem izoterma Toyota ProAce - izoterma do wynajęcia Śląsk Katowice"
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 right-4 bg-brand-blue text-white px-3 py-1 rounded-full text-sm font-semibold">
                Rozmiar M
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-brand-dark mb-2">Toyota ProAce</h3>
              <p className="text-slate-600 mb-4">Uniwersalny rozmiar do większości zadań transportowych. Optymalny stosunek pojemności do ekonomii.</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Pojemność:</span>
                  <span className="font-semibold">~5,5m³</span>
                </div>
                <div className="flex justify-between">
                  <span>Temperatura:</span>
                  <span className="font-semibold text-brand-blue">-20°C / +20°C</span>
                </div>
                <div className="flex justify-between">
                  <span>Zastosowanie:</span>
                  <span className="font-semibold">Transport regionalny</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-shadow">
            <div className="relative">
              <img 
                src="/images/ProAce Maxi 1_1757356289375.JPG" 
                alt="Wynajem mroźnia Toyota ProAce Maxi - duża mroźnia do wynajęcia Śląsk Gliwice"
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 right-4 bg-brand-blue text-white px-3 py-1 rounded-full text-sm font-semibold">
                Rozmiar L
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-brand-dark mb-2">Toyota ProAce Maxi</h3>
              <p className="text-slate-600 mb-4">Największa pojemność w ofercie. Idealny do transportów długodystansowych i dużych ilości towaru.</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Pojemność:</span>
                  <span className="font-semibold">~8,6m³</span>
                </div>
                <div className="flex justify-between">
                  <span>Temperatura:</span>
                  <span className="font-semibold text-brand-blue">-20°C / +20°C</span>
                </div>
                <div className="flex justify-between">
                  <span>Zastosowanie:</span>
                  <span className="font-semibold">Duże transporty</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <a href="/#flota">
            <button className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-brand-blue text-brand-blue font-semibold hover:bg-brand-blue hover:text-white transition-colors">
              Zobacz pełną flotę i cennik
              <ArrowRight className="h-5 w-5" />
            </button>
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-dark mb-4">
              Najczęściej <span className="text-brand-blue">Zadawane Pytania</span>
            </h2>
            <p className="text-lg text-slate-600">Wszystko co musisz wiedzieć o wynajmie mroźni na Śląsku</p>
          </div>
          
          <div className="grid gap-4 max-w-4xl mx-auto">
            {[
              {
                q: "Ile kosztuje wynajem mroźni na Śląsku?",
                a: "Ceny wynajmu mroźni zależą od modelu Toyota ProAce (City/ProAce/Maxi), czasu najmu i trasy. Oferujemy konkurencyjne stawki dla firm z Katowic, Gliwic i całego Śląska. Skontaktuj się z nami po wycenę dostosowaną do Twoich potrzeb."
              },
              {
                q: "Czy obsługujecie wynajem chłodni w Katowicach i Gliwicach?",
                a: "Tak, obsługujemy cały Śląsk włącznie z Katowicami, Gliwicami, Zabrzem, Bytomiem i Chorzowem. Oferujemy dostawę auta pod wskazany adres oraz odbiór po zakończeniu najmu. Nasze centrum logistyczne znajduje się w strategicznym punkcie dla obsługi całego regionu."
              },
              {
                q: "Jaki zakres temperatur w wynajmowanych auto chłodniach?",
                a: "Wszystkie nasze samochody z chłodnią utrzymują precyzyjny zakres od -20°C do +20°C. Wyposażone są w rejestrator temperatur Esco DR201, który pozwala na szybki wydruk dla odbiorcy towaru. Mamy izotermy, chłodnie i mroźnie z atestem Sanepid."
              },
              {
                q: "Czy można wynająć izotermę długoterminowo?",
                a: "Oczywiście! Oferujemy długoterminowy wynajem izoterm, chłodni i mroźni z preferencyjnymi stawkami. Przy najmie powyżej miesiąca zapewniamy pełny serwis techniczny, priorytetową obsługę i elastyczne warunki płatności dostosowane do potrzeb biznesowych."
              },
              {
                q: "Czy auta mają zasilanie zewnętrzne 230V?",
                a: "Tak, nasze Toyota ProAce mogą być wyposażone w opcjonalne zasilanie 230V, co pozwala na utrzymanie temperatury podczas postoju lub rozładunku bez uruchamiania silnika. Szczególnie przydatne przy dłuższych postojach w punktach dystrybucji."
              }
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

      {/* Formularz kontaktowy / CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="bg-gradient-to-r from-brand-blue to-blue-600 rounded-3xl p-8 lg:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Sprawdź Dostępność Mroźni na Śląsku
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Odpowiadamy szybko — zwykle w kilkanaście minut. <br />
              Profesjonalny wynajem chłodni w Katowicach, Gliwicach i na całym Śląsku.
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
              
              <a 
                href="mailto:kontakt@iglo-bus.rent"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-transparent border-2 border-white text-white font-bold hover:bg-white hover:text-brand-blue transition-colors w-full sm:w-auto justify-center"
              >
                <Mail className="h-6 w-6" />
                <div className="text-left">
                  <div className="text-sm opacity-75">Wyślij e-mail</div>
                  <div className="text-lg">kontakt@iglo-bus.rent</div>
                </div>
              </a>
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
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}