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
  Zap
} from "lucide-react";
import { Link } from "wouter";

export default function WynajemMrozni() {
  const url = "https://www.iglo-bus.rent/wynajem-mrozni";
  const ogImage = "https://www.iglo-bus.rent/images/og-home-1200.jpg";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">

      <Helmet>
        <title>Wynajem mroźni i chłodni – Śląsk | Iglo-Bus Rent</title>
        <meta
          name="description"
          content="Wynajem mroźni Toyota ProAce na Śląsku – Katowice, Gliwice. −20°C do +20°C, atest Sanepid, rejestrator temperatur, dostawa pod adres."
        />
        <link rel="canonical" href={url} />
        <meta name="robots" content="index,follow,max-image-preview:large" />

        <meta property="og:type" content="website" />
        <meta property="og:locale" content="pl_PL" />
        <meta property="og:site_name" content="Iglo-Bus Rent" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content="Wynajem mroźni i chłodni – Śląsk | Iglo-Bus Rent" />
        <meta
          property="og:description"
          content="Wynajem mroźni i chłodni na Śląsku – Toyota ProAce, −20°C do +20°C, Sanepid, dostawa pod adres."
        />
        <meta property="og:image" content={ogImage} />

        <script type="application/ld+json">{JSON.stringify({
          "@context":"https://schema.org",
          "@type":"LocalBusiness",
          "name":"Iglo-Bus Rent",
          "url":url,
          "telephone":"+48530410504",
          "email":"kontakt@iglo-bus.rent",
          "areaServed":"Śląskie",
          "priceRange":"$$"
        })}</script>
      </Helmet>

      <Header />

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-4 pt-10 pb-14">
        <div className="grid lg:grid-cols-2 gap-10 items-center">

          {/* LEWA */}
          <div className="space-y-6">

            <h1 className="text-4xl lg:text-5xl font-bold text-brand-dark leading-tight">
              Wynajem mroźni <span className="text-brand-blue">Śląsk</span>
              <span className="block mt-2 text-2xl font-semibold">
                Katowice • Gliwice • okolice
              </span>
            </h1>

            <p className="text-lg text-slate-600">
              Toyota ProAce S / M / L. Zakres temperatur{" "}
              <strong className="text-brand-blue">−20°C do +20°C</strong>, atest Sanepid,
              rejestrator, dostawa pod adres.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex items-center gap-2 p-3 bg-brand-light rounded-xl border">
                <Thermometer className="h-5 w-5 text-brand-blue" /> −20°C/+20°C
              </div>
              <div className="flex items-center gap-2 p-3 bg-brand-light rounded-xl border">
                <Shield className="h-5 w-5 text-brand-blue" /> Sanepid
              </div>
              <div className="flex items-center gap-2 p-3 bg-brand-light rounded-xl border">
                <CheckCircle2 className="h-5 w-5 text-brand-blue" /> Rejestrator
              </div>
              <div className="flex items-center gap-2 p-3 bg-brand-light rounded-xl border">
                <Zap className="h-5 w-5 text-brand-blue" /> 230V
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="tel:+48530410504"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-blue text-white font-semibold"
              >
                <Phone className="h-5 w-5" />
                +48 530 410 504
              </a>

              <Link href="/kontakt">
                <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-brand-blue text-brand-blue font-semibold hover:bg-brand-blue hover:text-white transition">
                  <Mail className="h-5 w-5" />
                  Wyślij zapytanie
                </button>
              </Link>
            </div>

            <a href="/#flota" className="inline-flex items-center gap-2 text-brand-blue font-medium">
              Zobacz flotę i ceny <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          {/* PRAWA – LOGO UJEDNOLICONE */}
          <div className="flex justify-center lg:justify-end">
            <Link href="/">
              <img
                src="/images/logo-hero.png"
                alt="Iglo-Bus Rent – wynajem mroźni i chłodni"
                width={384}
                height={384}
                className="w-80 h-80 lg:w-96 lg:h-96 object-contain hover:opacity-90 transition-opacity cursor-pointer"
                loading="eager"
                decoding="async"
              />
            </Link>
          </div>

        </div>
      </section>

      {/* DLACZEGO MY */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {[
            {icon: Shield, title:"Legalność", desc:"Atesty Sanepid, dokumenty"},
            {icon: Thermometer, title:"Temperatura", desc:"Stała kontrola"},
            {icon: Clock, title:"Elastyczność", desc:"Krótko i długo"},
            {icon: Truck, title:"Dostawa", desc:"Cały Śląsk"},
            {icon: Zap, title:"Nowoczesność", desc:"230V, agregaty"},
            {icon: CheckCircle2, title:"Niezawodność", desc:"Serwis floty"}
          ].map((i,idx)=>(
            <div key={idx} className="bg-white p-6 rounded-2xl border shadow-sm">
              <i.icon className="h-6 w-6 text-brand-blue mb-3"/>
              <h3 className="font-semibold mb-1">{i.title}</h3>
              <p className="text-sm text-slate-600">{i.desc}</p>
            </div>
          ))}

        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="bg-brand-blue rounded-3xl p-10 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            Sprawdź dostępność mroźni na Śląsku
          </h2>
          <p className="mb-6 opacity-90">
            Odpowiadamy szybko – zwykle w kilkanaście minut
          </p>

          <a
            href="tel:+48530410504"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-brand-blue font-bold rounded-xl"
          >
            <Phone className="h-6 w-6" />
            +48 530 410 504
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
