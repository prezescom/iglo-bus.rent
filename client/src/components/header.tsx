import { Snowflake, ChevronDown, Menu, X, Phone, List } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage, isHomeRoute } from "@/lib/i18n/use-language";
import LanguageSwitcher from "@/components/language-switcher";

export default function Header() {
  const [location] = useLocation();
  const { t, lang } = useLanguage();
  const isHomePage = isHomeRoute(location);
  const homeHref = lang === "pl" ? "/" : `/${lang}`;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    if (isHomePage) {
      const element = document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = `/#${sectionId}`;
    }
  };

  // Zamykaj mobile menu po zmianie routingu
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur-md shadow-sm">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
          <Link href={homeHref} className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="h-10 w-10 rounded-2xl bg-brand-light border border-brand-blue/20 grid place-items-center">
              <Snowflake className="h-5 w-5 text-brand-blue" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-lg text-brand-dark leading-tight">iglo-bus.rent</div>
              <div className="text-xs text-slate-500 leading-tight">{t.header.tagline}</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {isHomePage ? (
              <>
                <button onClick={() => scrollToSection("flota")} className="hover:text-brand-blue transition-colors">
                  {t.header.navFleet}
                </button>
                <button onClick={() => scrollToSection("jak-dziala")} className="hover:text-brand-blue transition-colors">
                  {t.header.navHow}
                </button>
                <button onClick={() => scrollToSection("faq")} className="hover:text-brand-blue transition-colors">
                  {t.header.navFaq}
                </button>
              </>
            ) : (
              <>
                <a href="/#flota" className="hover:text-brand-blue transition-colors">{t.header.navFleet}</a>
                <a href="/#jak-dziala" className="hover:text-brand-blue transition-colors">{t.header.navHow}</a>
                <a href="/#faq" className="hover:text-brand-blue transition-colors">{t.header.navFaq}</a>
              </>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 hover:text-brand-blue transition-colors outline-none">
                {t.header.knowledgeBase}
                <ChevronDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuItem asChild>
                  <Link href="/wynajem-mrozni" className="w-full">{t.header.kbFreezer}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/wynajem-chlodni" className="w-full">{t.header.kbFridge}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/wymagania-auto-chlodnia-mroznia-izoterma" className="w-full">{t.header.kbRequirements}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/wyposazenie-samochodow-mrozni" className="w-full">{t.header.kbEquipment}</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/blog" className="hover:text-brand-blue transition-colors">
              {t.header.blog}
            </Link>

            <a
              href="tel:+48530410504"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-brand-blue text-white text-sm font-semibold hover:bg-brand-blue/90 transition-colors"
              aria-label={t.header.callAria}
            >
              <Phone className="h-4 w-4" />
              +48 530 410 504
            </a>

            <LanguageSwitcher />
          </nav>

          {/* Mobile: flagi + hamburger */}
          <div className="md:hidden flex items-center gap-3">
            <LanguageSwitcher />
            <button
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? t.header.menuCloseAria : t.header.menuOpenAria}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <nav className="px-4 py-3 space-y-2 text-sm">
              <button
                onClick={() => scrollToSection("flota")}
                className="block w-full text-left py-2 px-3 hover:bg-brand-light rounded-md transition-colors"
              >
                {t.header.navFleet}
              </button>
              <button
                onClick={() => scrollToSection("jak-dziala")}
                className="block w-full text-left py-2 px-3 hover:bg-brand-light rounded-md transition-colors"
              >
                {t.header.navHow}
              </button>
              <button
                onClick={() => scrollToSection("faq")}
                className="block w-full text-left py-2 px-3 hover:bg-brand-light rounded-md transition-colors"
              >
                {t.header.navFaq}
              </button>

              <div className="border-t pt-2 mt-2">
                <div className="py-2 px-3 text-xs uppercase tracking-wide text-gray-500">{t.header.knowledgeBase}</div>
                <Link href="/wynajem-mrozni" className="block py-2 px-3 hover:bg-brand-light rounded-md transition-colors">
                  {t.header.kbFreezer}
                </Link>
                <Link href="/wynajem-chlodni" className="block py-2 px-3 hover:bg-brand-light rounded-md transition-colors">
                  {t.header.kbFridge}
                </Link>
                <Link href="/wyposazenie-samochodow-mrozni" className="block py-2 px-3 hover:bg-brand-light rounded-md transition-colors">
                  {t.header.kbEquipment}
                </Link>
              </div>

              <div className="border-t pt-2 mt-2">
                <Link href="/blog" className="block py-2 px-3 hover:bg-brand-light rounded-md transition-colors">
                  📰 {t.header.blog}
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* MOBILE STICKY CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="mx-auto max-w-6xl px-4 py-3 flex gap-3" style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)" }}>
          <a
            href="tel:+48530410504"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-brand-blue text-white font-semibold"
            aria-label={t.header.mobileCall}
          >
            <Phone className="h-5 w-5" />
            {t.header.mobileCall}
          </a>

          <button
            type="button"
            onClick={() => scrollToSection("flota")}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-brand-blue text-brand-blue font-semibold"
            aria-label={t.header.mobilePricingAria}
          >
            <List className="h-5 w-5" />
            {t.header.mobilePricing}
          </button>
        </div>
      </div>
    </>
  );
}
