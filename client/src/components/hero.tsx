import { Thermometer, Zap, CheckCircle2, Mail, Phone } from "lucide-react";

export default function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-12 pb-10" data-testid="hero-section">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 animate-fade-in">
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight text-brand-dark">
            Chłodnie i mroźnie na wynajem — 
            <span className="text-brand-blue whitespace-nowrap">-20°C do +20°C</span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Trzy rozmiary Toyota ProAce: City (S), ProAce (M) i Maxi (L). Zewnętrzne zasilanie 
            <span className="font-semibold text-brand-blue">230V</span>, stabilizacja temperatury w pełnym zakresie, gotowe do pracy 24/7.
          </p>
          
          <div className="grid sm:grid-cols-3 gap-4" data-testid="features">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-brand-light border border-brand-blue/20 animate-slide-in">
              <Thermometer className="h-5 w-5 text-brand-blue" />
              <span className="font-medium text-sm">Zakres -20°C…+20°C</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-brand-light border border-brand-blue/20 animate-slide-in">
              <Zap className="h-5 w-5 text-brand-blue" />
              <span className="font-medium text-sm">Zasilanie 230V</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-brand-light border border-brand-blue/20 animate-slide-in">
              <CheckCircle2 className="h-5 w-5 text-brand-blue" />
              <span className="font-medium text-sm">FV VAT / B2B</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 lg:ml-auto max-w-md animate-fade-in" data-testid="contact-card">
          <h3 className="text-xl font-bold text-brand-dark mb-4">Kontakt</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-brand-blue" />
              <span className="text-sm">E-mail: </span>
              <a 
                href="mailto:kontakt@iglo-bus.rent" 
                className="text-brand-blue hover:underline font-medium"
                data-testid="contact-email-link"
              >
                kontakt@iglo-bus.rent
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-brand-blue" />
              <span className="text-sm">Telefon: </span>
              <a 
                href="tel:+48530410504" 
                className="text-brand-blue hover:underline font-medium"
                data-testid="contact-phone-link"
              >
                +48 530 410 504
              </a>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed pt-2 border-t border-slate-100">
              Zadzwoń lub wyślij zapytanie z panelu rezerwacyjnego poniżej.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
