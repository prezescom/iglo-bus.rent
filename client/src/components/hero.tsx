import { Thermometer, Zap, CheckCircle2, Truck, Phone, ArrowRight } from "lucide-react";

type HeroProps = {
  onPrimaryCtaClick?: () => void;
};

export default function Hero({ onPrimaryCtaClick }: HeroProps) {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-8 pb-8 md:pt-12 md:pb-10" data-testid="hero-section">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start lg:items-center">
        <div className="space-y-6 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-brand-dark">
            Wynajem samochodów <span className="text-brand-blue">chłodni i mroźni</span>
            <span className="block mt-2 text-base sm:text-lg font-semibold text-slate-600">
              Zakres <span className="text-brand-blue">−20°C do +20°C</span> • Atest Sanepid • Szybkie podstawienie w całej Polsce
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Flota Toyota ProAce w 3 rozmiarach (S / M / L). Rejestracja temperatury, stabilna praca 24/7,
            opcjonalne podtrzymanie <span className="font-semibold text-brand-blue">230V</span>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4" data-testid="features">
            <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl bg-brand-light border border-brand-blue/20 animate-slide-in">
              <Thermometer className="h-4 w-4 sm:h-5 sm:w-5 text-brand-blue flex-shrink-0" />
              <span className="font-medium text-xs sm:text-sm">−20°C do +20°C</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl bg-brand-light border border-brand-blue/20 animate-slide-in">
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-brand-blue flex-shrink-0" />
              <span className="font-medium text-xs sm:text-sm">Atest Sanepid</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl bg-brand-light border border-brand-blue/20 animate-slide-in">
              <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-brand-blue flex-shrink-0" />
              <span className="font-medium text-xs sm:text-sm">Dostawa PL</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="tel:+48530410504"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-blue text-white font-semibold hover:bg-brand-blue/90 transition-colors"
              data-testid="hero-phone-cta"
              aria-label="Zadzwoń do Iglo-Bus Rent"
            >
              <Phone className="h-5 w-5" />
              Zadzwoń: +48 530 410 504
            </a>

            <button
              type="button"
              onClick={onPrimaryCtaClick}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-brand-blue text-brand-blue font-semibold hover:bg-brand-blue hover:text-white transition-colors"
              data-testid="hero-pricing-cta"
            >
              Sprawdź ceny i dostępność
              <ArrowRight className="h-5 w-5" />
            </button>

            <div className="hidden sm:flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-600">
              <Zap className="h-4 w-4 text-brand-blue" />
              230V (opcja) • FV VAT • B2B/B2C
            </div>
          </div>
        </div>

        {/* Karta kontaktu (prościej, bez “kliknij /kontakt” jako e-mail) */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-6 lg:ml-auto w-full max-w-md mx-auto lg:mx-0 animate-fade-in" data-testid="contact-card">
          <h2 className="text-lg sm:text-xl font-bold text-brand-dark mb-3 sm:mb-4">Kontakt</h2>

          <div className="space-y-3">
            <div className="text-sm text-slate-600">
              Telefon (najszybciej):
              <div>
                <a href="tel:+48530410504" className="text-brand-blue font-semibold hover:underline">
                  +48 530 410 504
                </a>
              </div>
            </div>

            <div className="text-sm text-slate-600">
              E-mail:
              <div>
                <a href="mailto:kontakt@iglo-bus.rent" className="text-brand-blue font-semibold hover:underline">
                  kontakt@iglo-bus.rent
                </a>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed pt-2 border-t border-slate-100">
              Napisz w 2 zdaniach: termin, miasto/trasę i preferowaną temperaturę. Odpowiemy z dostępnością i wyceną.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
