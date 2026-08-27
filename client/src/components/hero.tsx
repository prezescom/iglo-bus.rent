import { Thermometer, Zap, CheckCircle2, Truck, Phone, ArrowRight, Mail } from "lucide-react";
import { useLanguage } from "@/lib/i18n/use-language";

type HeroProps = {
  onPrimaryCtaClick?: () => void;
};

export default function Hero({ onPrimaryCtaClick }: HeroProps) {
  const { t } = useLanguage();
  return (
    <section className="mx-auto max-w-6xl px-4 pt-6 pb-8 md:pt-12 md:pb-10">
      <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-start lg:items-center">

        {/* LEWA KOLUMNA */}
        <div className="space-y-5">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-brand-dark">
            {t.hero.h1Prefix}<span className="text-brand-blue">{t.hero.h1Highlight}</span>
            <span className="block mt-2 text-base sm:text-lg font-semibold text-slate-600">
              {t.hero.h1Sub}
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            {t.hero.paragraphPre}
            <span className="font-semibold text-brand-blue">{t.hero.paragraphHighlight}</span>
            {t.hero.paragraphPost}
          </p>

          {/* Szybkie fakty – na mobile 2 kolumny, mniejsze boxy */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3" data-testid="features">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-brand-light border border-brand-blue/20">
              <Thermometer className="h-4 w-4 text-brand-blue" />
              <span className="font-medium text-xs sm:text-sm">{t.hero.featureTemp}</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-brand-light border border-brand-blue/20">
              <CheckCircle2 className="h-4 w-4 text-brand-blue" />
              <span className="font-medium text-xs sm:text-sm">{t.hero.featureCert}</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-brand-light border border-brand-blue/20 sm:col-span-1 col-span-2">
              <Truck className="h-4 w-4 text-brand-blue" />
              <span className="font-medium text-xs sm:text-sm">{t.hero.featureDelivery}</span>
            </div>
          </div>

          {/* CTA – mobile full width, jeden pod drugim */}
          <div className="grid gap-3 pt-1 sm:flex sm:flex-wrap sm:gap-3">
            <a
              href="tel:+48530410504"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-blue text-white font-semibold hover:bg-brand-blue/90 transition-colors"
              data-testid="hero-phone-cta"
              aria-label={t.hero.ctaCallAria}
            >
              <Phone className="h-5 w-5" />
              {t.hero.ctaCallLabel}
            </a>

            <button
              type="button"
              onClick={onPrimaryCtaClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-2 border-brand-blue text-brand-blue font-semibold hover:bg-brand-blue hover:text-white transition-colors"
              data-testid="hero-pricing-cta"
            >
              {t.hero.ctaPricing}
              <ArrowRight className="h-5 w-5" />
            </button>

            <a
              href="mailto:kontakt@iglo-bus.rent"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:border-brand-blue/40 hover:text-brand-blue transition-colors"
              aria-label={t.hero.ctaEmailAria}
            >
              <Mail className="h-5 w-5" />
              {t.hero.ctaEmailLabel}
            </a>
          </div>

          <div className="text-sm text-slate-500 flex items-center gap-2">
            <Zap className="h-4 w-4 text-brand-blue" />
            {t.hero.footerLine}
          </div>
        </div>

        {/* PRAWA KOLUMNA – mobile: logo mniejsze + karta kontaktu pod spodem */}
        <div className="flex flex-col gap-4 items-center lg:items-end">

          {/* Logo: mobile mniejsze, żeby nie wypychało treści */}
          <div className="w-full flex justify-center lg:justify-end">
            <img
              src="/images/logo-hero.png"
              alt={t.meta.ogImageAlt}
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
            <h2 className="text-lg sm:text-xl font-bold text-brand-dark mb-3 sm:mb-4">{t.hero.contactTitle}</h2>

            <div className="grid gap-3 text-sm text-slate-600">
              <div>
                <div className="text-xs uppercase tracking-wide text-slate-500">{t.hero.phoneLabel}</div>
                <a href="tel:+48530410504" className="text-brand-blue font-semibold hover:underline">
                  +48 530 410 504
                </a>
              </div>

              <div>
                <div className="text-xs uppercase tracking-wide text-slate-500">{t.hero.emailLabel}</div>
                <a href="mailto:kontakt@iglo-bus.rent" className="text-brand-blue font-semibold hover:underline">
                  kontakt@iglo-bus.rent
                </a>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed pt-2 border-t border-slate-100">
                {t.hero.contactHint}
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
