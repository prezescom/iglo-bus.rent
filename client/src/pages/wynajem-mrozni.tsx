import { Link } from "wouter";
import { ArrowLeft, Snowflake, Clock, CheckCircle, Phone, Mail } from "lucide-react";

export default function WynajemMrozni() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            data-testid="back-home"
          >
            <ArrowLeft className="h-5 w-5 text-slate-600" />
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-brand-light border border-brand-blue/20 grid place-items-center">
                <Snowflake className="h-4 w-4 text-brand-blue" />
              </div>
              <span className="font-semibold text-brand-dark">Iglo-bus.rent</span>
            </div>
          </Link>
          
          <div className="text-sm" data-testid="contact-email">
            <a 
              href="mailto:kontakt@iglo-bus.rent" 
              className="hover:text-brand-blue transition-colors font-medium flex items-center gap-1"
            >
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">kontakt@iglo-bus.rent</span>
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-brand-dark mb-4">
            Wynajem Samochodów Mroźni
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Profesjonalne pojazdy chłodnicze Toyota ProAce do wynajęcia. 
            Idealne do transportu produktów spożywczych, farmaceutyków i innych towarów wymagających kontrolowanej temperatury.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-brand-dark mb-6">
              Dlaczego wybrać nasze usługi?
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-brand-dark">Nowoczesna flota</h3>
                  <p className="text-slate-600">Toyota ProAce w trzech rozmiarach: City, ProAce i Maxi</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-brand-dark">Kontrola temperatury</h3>
                  <p className="text-slate-600">Precyzyjne utrzymanie temperatury od -18°C do +2°C</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-brand-dark">Elastyczne warunki</h3>
                  <p className="text-slate-600">Wynajem krótko- i długoterminowy, konkurencyjne ceny</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-brand-dark">Profesjonalne doradztwo</h3>
                  <p className="text-slate-600">Pomożemy wybrać odpowiedni pojazd do Twoich potrzeb</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <div className="text-center mb-6">
              <Clock className="h-12 w-12 text-brand-blue mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-brand-dark mb-2">Szybki kontakt</h3>
              <p className="text-slate-600">Skontaktuj się z nami już dziś</p>
            </div>
            
            <div className="space-y-4">
              <a 
                href="tel:+48123456789" 
                className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-brand-blue transition-colors group"
                data-testid="phone-contact"
              >
                <Phone className="h-5 w-5 text-brand-blue" />
                <div>
                  <div className="font-medium text-brand-dark group-hover:text-brand-blue transition-colors">
                    +48 123 456 789
                  </div>
                  <div className="text-sm text-slate-500">Zadzwoń teraz</div>
                </div>
              </a>
              
              <a 
                href="mailto:kontakt@iglo-bus.rent" 
                className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-brand-blue transition-colors group"
                data-testid="email-contact"
              >
                <Mail className="h-5 w-5 text-brand-blue" />
                <div>
                  <div className="font-medium text-brand-dark group-hover:text-brand-blue transition-colors">
                    kontakt@iglo-bus.rent
                  </div>
                  <div className="text-sm text-slate-500">Napisz e-mail</div>
                </div>
              </a>
            </div>
            
            <div className="mt-6 p-4 bg-brand-light/30 rounded-xl">
              <p className="text-sm text-slate-600 text-center">
                <strong>Godziny pracy:</strong><br />
                Poniedziałek - Piątek: 8:00 - 18:00<br />
                Sobota: 9:00 - 15:00
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-brand-blue to-blue-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Gotowy na współpracę?</h2>
          <p className="text-xl mb-6 opacity-90">
            Skontaktuj się z nami i otrzymaj spersonalizowaną ofertę wynajmu
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:+48123456789"
              className="bg-white text-brand-blue font-semibold px-8 py-3 rounded-xl hover:bg-slate-50 transition-colors"
              data-testid="cta-phone"
            >
              Zadzwoń teraz
            </a>
            <a 
              href="mailto:kontakt@iglo-bus.rent"
              className="border-2 border-white text-white font-semibold px-8 py-3 rounded-xl hover:bg-white hover:text-brand-blue transition-colors"
              data-testid="cta-email"
            >
              Wyślij e-mail
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}