import { Thermometer, Zap, CheckCircle2, Mail, Phone } from "lucide-react";

export default function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-8 pb-8 md:pt-12 md:pb-10" data-testid="hero-section">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start lg:items-center">
        <div className="space-y-6 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-brand-dark">
            Mroźnie na wynajem  
            <span className="text-brand-blue block sm:inline sm:whitespace-nowrap"> -20°C do +20°C</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Trzy rozmiary Toyota ProAce: City (S), ProAce (M) i Maxi (L). Zewnętrzne zasilanie  
            <span className="font-semibold text-brand-blue"> 230V</span>, stabilizacja temperatury w pełnym zakresie, gotowe do pracy 24/7.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4" data-testid="features">
            <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl bg-brand-light border border-brand-blue/20 animate-slide-in">
              <Thermometer className="h-4 w-4 sm:h-5 sm:w-5 text-brand-blue flex-shrink-0" />
              <span className="font-medium text-xs sm:text-sm">Zakres -20°C do +20°C</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl bg-brand-light border border-brand-blue/20 animate-slide-in">
              <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-brand-blue flex-shrink-0" />
              <span className="font-medium text-xs sm:text-sm">Zasilanie 230V</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl bg-brand-light border border-brand-blue/20 animate-slide-in">
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-brand-blue flex-shrink-0" />
              <span className="font-medium text-xs sm:text-sm">FV VAT / B2B</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-6 lg:ml-auto w-full max-w-md mx-auto lg:mx-0 animate-fade-in" data-testid="contact-card">
          <h3 className="text-lg sm:text-xl font-bold text-brand-dark mb-3 sm:mb-4">Kontakt</h3>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-start gap-2 sm:gap-3 flex-wrap">
              <Mail className="h-4 w-4 text-brand-blue mt-0.5 flex-shrink-0" />
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 min-w-0">
                <span className="text-xs sm:text-sm">E-mail:</span>
                <a 
                  href="/kontakt" 
                  className="text-brand-blue hover:underline font-medium text-xs sm:text-sm break-all"
                  data-testid="contact-email-link"
                >
                  kontakt@iglo-bus.rent
                </a>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Phone className="h-4 w-4 text-brand-blue flex-shrink-0" />
              <span className="text-xs sm:text-sm">Telefon:</span>
              <a 
                href="tel:+48530410504" 
                className="text-brand-blue hover:underline font-medium text-xs sm:text-sm"
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
