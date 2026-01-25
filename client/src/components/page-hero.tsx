import { ReactNode } from "react";
import { Phone, Mail, ArrowRight } from "lucide-react";
import { Link } from "wouter";

type Fact = { icon: ReactNode; label: string };

type PageHeroProps = {
  h1: ReactNode;
  lead: ReactNode;
  facts: Fact[];
  primaryCtaLabel?: string;
  primaryCtaHref?: string; // np. "tel:+48530410504"
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string; // np. "/#flota" lub "/kontakt"
  showLogo?: boolean;
  logoSrc?: string;
};

export default function PageHero({
  h1,
  lead,
  facts,
  primaryCtaLabel = "Zadzwoń: +48 530 410 504",
  primaryCtaHref = "tel:+48530410504",
  secondaryCtaLabel = "Wyślij zapytanie",
  secondaryCtaHref = "/kontakt",
  showLogo = true,
  logoSrc = "/images/logo-hero.png",
}: PageHeroProps) {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-6 pb-10 md:pt-10 md:pb-14">
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-5">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-brand-dark">
            {h1}
          </h1>

          <div className="text-base sm:text-lg text-slate-600 leading-relaxed">
            {lead}
          </div>

          {/* fakty */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {facts.slice(0, 4).map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-2 p-3 rounded-xl bg-brand-light border border-brand-blue/20"
              >
                <span className="text-brand-blue">{f.icon}</span>
                <span className="font-medium text-xs sm:text-sm">{f.label}</span>
              </div>
            ))}
          </div>

          {/* CTA – mobile full width */}
          <div className="grid gap-3 sm:flex sm:flex-wrap sm:gap-3 pt-1">
            <a
              href={primaryCtaHref}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-blue text-white font-semibold hover:bg-brand-blue/90 transition-colors"
            >
              <Phone className="h-5 w-5" />
              {primaryCtaLabel}
            </a>

            {secondaryCtaHref.startsWith("/") ? (
              <Link href={secondaryCtaHref}>
                <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-brand-blue text-brand-blue font-semibold hover:bg-brand-blue hover:text-white transition-colors">
                  <Mail className="h-5 w-5" />
                  {secondaryCtaLabel}
                </button>
              </Link>
            ) : (
              <a
                href={secondaryCtaHref}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-brand-blue text-brand-blue font-semibold hover:bg-brand-blue hover:text-white transition-colors"
              >
                <ArrowRight className="h-5 w-5" />
                {secondaryCtaLabel}
              </a>
            )}
          </div>
        </div>

        {/* logo zawsze to samo */}
        {showLogo && (
          <div className="flex justify-center lg:justify-end">
            <img
              src={logoSrc}
              alt="Iglo-Bus Rent"
              width={384}
              height={384}
              className="w-[220px] sm:w-[260px] lg:w-[320px] h-auto object-contain"
              loading="eager"
              decoding="async"
            />
          </div>
        )}
      </div>

      {/* miejsce pod mobile sticky CTA z headera */}
      <div className="h-16 md:hidden" />
    </section>
  );
}
