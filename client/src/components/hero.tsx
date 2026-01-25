import { Thermometer, Zap, CheckCircle2, Truck, Phone, ArrowRight, Mail } from "lucide-react";

type HeroProps = {
  onPrimaryCtaClick?: () => void;
};

export default function Hero({ onPrimaryCtaClick }: HeroProps) {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-6 pb-8 md:pt-12 md:pb-10">
      <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-start lg:items-center">

        {/* LEWA KOLUMNA */}
        <div className="space-y-5">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-brand-dark">
            Wynajem samochodów <span className="text-brand-blue">chłodni i mroźni</span>
            <span className="block mt-2 text-base sm:text-lg font-semibold text-slate-600">
              −20°C do +20°C • Atest Sanepid • Dostawa w całej Polsce
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Flota Toyota ProAce w 3 rozmiarach (S / M / L). Rejestracja temperatury, stabilna praca 24/7,
            opcjonalne podtrzymanie <span className="font-semibold text-brand-blue">230V</span>.
          </p>

          {/* Szybkie fakty – na mobile 2 kolumny, mniejsze boxy */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3" data-testid="features">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-brand-light border border-brand-blue/20">
              <Thermometer className="h-4 w-4 text-brand-blue" />
              <span className="font-medium text-xs sm:text-sm">−20°C do +20°C</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-brand-light border border-brand-blue/20">
              <CheckCircle2 className="h-4 w-4 text-brand-blue" />
              <span className="font-medium text-xs sm:text-sm">Atest Sanepid</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-brand-light border border-brand-blue/20 sm:col-span-1 col-span-2">
              <Truck className="h-4 w-4 text-brand-blue" />
              <span className="font-medium text-xs sm:text-sm">Dostawa PL</span>
            </div>
          </div>

          {/* CTA – mobile full width, jeden pod drugim */}
          <div className="grid gap-3 pt-1 sm:flex sm:flex-wrap sm:gap-3">
            <a
              href="tel:+48530410504"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-blue text-white font-semibold hover:bg-brand-blue/90 transition-colors"
              data-testid="hero-phone-cta"
              aria-label="Zadzwoń do Iglo-Bus Rent"
            >
              <Phone className="h-5 w-5" />
              Zadzwoń: +48 530 410 504
            </a>

            <button
              type="button"
              onClick={onPrimaryCtaClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-2 border-brand-blue text-brand-blue font-semibold hover:bg-brand-blue hover:text-white transition-colors"
              data-testid="hero-pricing-cta"
            >
              Sprawdź ceny i dostępność
              <ArrowRight className="h-5 w-5" />
            </button>

            <a
              href="mailto:kontakt@iglo-bus.rent"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:border-brand-blue/40 hover:text-brand-blue transition-colors"
              aria-label="Napisz e-mail do Iglo-Bus Rent"
            >
              <Mail className="h-5 w-5" />
              Napisz e-mail
            </a>
          </div>

          <div className="text-sm text-slate-500 flex items-center gap-2">
            <Zap className="h-4 w-4 text-brand-blue" />
            230V (opcja) • FV VAT • B2B/B2C
          </div>
        </div>

        {/* PRAWA KOLUMNA – mobile: logo mniejsze + karta kontaktu pod spodem */}
        <div className="flex flex-col gap-4 items-center lg:items-end">

          {/* Logo: mobile mniejsze, żeby nie wypychało treści */}
          <div className="w-full flex justify-center lg:justify-end">
            <img
              src="/images/logo-hero.png"
              alt="Iglo-Bus Rent – wynajem chłodni i mroźni"
              className="w-[220px] sm:w-[260px] lg:w-[320px] h-auto drop-shadow-sm"
              loading="eager"
              decoding="async"
            />
          </div>

          {/* Kontakt – mobile bardziej kompaktowy */}
          <div
            className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-6 w-full max-w-md"
            data-testid="contact-card"
          >
            <h2 className="text-lg sm:text-xl font-bold text-brand-dark mb-3 sm:mb-4">Kontakt</h2>

            <div className="grid gap-3 text-sm text-slate-600">
              <div>
                <div className="text-xs uppercase tracking-wide text-slate-500">Telefon</div>
                <a href="tel:+48530410504" className="text-brand-blue font-semibold hover:underline">
                  +48 530 410 504
                </a>
              </div>

              <div>
                <div className="text-xs uppercase tracking-wide text-slate-500">E-mail</div>
                <a href="mailto:kontakt@iglo-bus.rent" className="text-brand-blue font-semibold hover:underline">
                  kontakt@iglo-bus.rent
                </a>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed pt-2 border-t border-slate-100">
                Podaj: termin, miasto/trasę i temperaturę — odeślemy wycenę.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Sticky CTA space (żeby treść nie była zasłonięta na mobile) */}
      <div className="h-20 md:hidden" />
    </section>
  );
}
