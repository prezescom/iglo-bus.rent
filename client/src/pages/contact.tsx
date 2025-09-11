import { Helmet } from "react-helmet-async";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ContactForm from "@/components/contact-form";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Helmet>
        <title>Kontakt - Wynajem Mroźni | Iglo-Bus Rent</title>
        <meta name="description" content="Skontaktuj się z Iglo-Bus Rent. Wynajem mroźni, chłodni i izoterm Toyota ProAce. Telefon: +48 530 410 504, Email: kontakt@iglo-bus.rent" />
        <link rel="canonical" href="https://www.iglo-bus.rent/kontakt" />
        <meta name="robots" content="index,follow" />
        <meta property="og:title" content="Kontakt - Wynajem Mroźni | Iglo-Bus Rent" />
        <meta property="og:description" content="Skontaktuj się z nami w sprawie wynajmu mroźni, chłodni i izoterm. Szybka odpowiedź, profesjonalna obsługa." />
        <meta property="og:url" content="https://www.iglo-bus.rent/kontakt" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.iglo-bus.rent/images/og-home-1200.jpg" />
      </Helmet>

      <Header />

      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-4 pt-8 pb-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight text-brand-dark mb-4">
            Skontaktuj się <span className="text-brand-blue">z nami</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Masz pytania o wynajem mroźni, chłodni lub izoterm? 
            Skontaktuj się telefonicznie lub wypełnij formularz - odpowiadamy szybko!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-brand-dark mb-6">Dane kontaktowe</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <div className="h-12 w-12 rounded-xl bg-brand-light grid place-items-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-brand-blue" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-dark mb-1">Telefon</h3>
                    <p className="text-slate-600 mb-2">Najszybszy kontakt</p>
                    <a 
                      href="tel:+48530410504" 
                      className="text-brand-blue hover:underline font-semibold text-lg"
                    >
                      +48 530 410 504
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <div className="h-12 w-12 rounded-xl bg-brand-light grid place-items-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-brand-blue" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-dark mb-1">Email</h3>
                    <p className="text-slate-600 mb-2">Lub wypełnij formularz obok</p>
                    <p className="text-brand-blue font-semibold">kontakt@iglo-bus.rent</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <div className="h-12 w-12 rounded-xl bg-brand-light grid place-items-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-brand-blue" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-dark mb-1">Obszar działania</h3>
                    <p className="text-slate-600">
                      Województwo śląskie<br />
                      Katowice, Gliwice, Zabrze<br />
                      Dostawa na miejscu
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <div className="h-12 w-12 rounded-xl bg-brand-light grid place-items-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-brand-blue" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-dark mb-1">Czas odpowiedzi</h3>
                    <p className="text-slate-600">
                      <strong>Telefon:</strong> od razu<br />
                      <strong>Email:</strong> do kilku godzin<br />
                      <strong>Formularz:</strong> do kilku godzin
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-brand-dark mb-4">Najczęstsze pytania</h3>
              <div className="space-y-2">
                <p className="text-sm text-slate-600">• Ile kosztuje wynajem mroźni?</p>
                <p className="text-sm text-slate-600">• Jaki zakres temperatur w autach?</p>
                <p className="text-sm text-slate-600">• Czy obsługujecie długoterminowy wynajem?</p>
                <a href="/#faq" className="text-brand-blue hover:underline text-sm font-medium">
                  Zobacz wszystkie odpowiedzi →
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <ContactForm 
              title="Formularz kontaktowy"
              showPhoneButton={false}
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}