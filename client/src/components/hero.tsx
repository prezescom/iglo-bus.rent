import { Thermometer, Zap, CheckCircle2, Truck, Phone, ArrowRight } from "lucide-react";

type HeroProps = {
  onPrimaryCtaClick?: () => void;
};

export default function Hero({ onPrimaryCtaClick }: HeroProps) {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-8 pb-8 md:pt-12 md:pb-10">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start lg:items-center">

        {/* LEWA KOLUMNA */}
        <div className="space-y-6 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-brand-dark">
            Wynajem samochodów <span className="text-brand-blue">chłodni i mroźni</span>
            <span className="block mt-2 text-base sm:text-lg font-semibold text-slate-600">
              −20°C do +20°C • Atest Sanepid • Dostawa w całej Polsce
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Toyota ProAce w rozmiarach S / M / L. Rejestracja temperatury, praca 24/7,
            opcjonalne podtrzymanie <span className="font-semibold text-brand-blue">230V</span>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-brand-light border">
              <Thermometer className="h-5 w-5 text-brand-blue" /> −20°C do +20°C
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-brand-light border">
              <CheckCircle2 className="h-5 w-5 text-brand-blue" /> Atest Sanepid
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-brand-light border">
              <Truck className="h-5 w-5 text-brand-blue" /> Dostawa PL
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="tel:+48530410504"
              className="px-5 py-3 rounded-xl bg-brand-blue text-white font-semibold"
            >
              <Phone className="inline h-5 w-5 mr-2" />
              Zadzwoń: +48 530 410 504
            </a>

            <button
              onClick={onPrimaryCtaClick}
              className="px-5 py-3 rounded-xl border-2 border-brand-blue text-brand-blue font-semibold hover:bg-brand-blue hover:text-white transition"
            >
              Sprawdź ceny i dostępność <ArrowRight className="inline h-5 w-5 ml-1" />
            </button>
          </div>

          <div className="text-sm text-slate-500 flex items-center gap-2">
            <Zap className="h-4 w-4 text-brand-blue" />
            230V (opcja) • FV VAT • B2B/B2C
          </div>
        </div>

        {/* PRAWA KOLUMNA */}
        <div className="flex flex-col gap-6 items-center lg:items-end">

          {/* LOGO HERO */}
          <div className="w-full flex justify-center lg:justify-end">
            <img
              src="/images/logo-hero.png"   // lub logo-hero.png
              alt="Iglo-Bus Rent – wynajem chłodni i mroźni"
              className="max-w-[320px] w-full h-auto drop-shadow-sm"
              loading="eager"
            />
          </div>

          {/* KARTA KONTAKTU */}
          <div className="bg-white rounded-2xl shadow-lg border p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Kontakt</h2>

            <div className="space-y-3 text-sm text-slate-600">
              <div>
                Telefon:
                <div>
                  <a href="tel:+48530410504" className="text-brand-blue font-semibold">
                    +48 530 410 504
                  </a>
                </div>
              </div>

              <div>
                E-mail:
                <div>
                  <a href="mailto:kontakt@iglo-bus.rent" className="text-brand-blue font-semibold">
                    kontakt@iglo-bus.rent
                  </a>
                </div>
              </div>

              <p className="pt-2 border-t text-xs">
                Podaj termin, trasę i temperaturę — odeślemy wycenę.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
