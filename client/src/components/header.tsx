import { Snowflake, Mail, Phone, ChevronDown, Menu, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [location] = useLocation();
  const isHomePage = location === "/";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    if (isHomePage) {
      const element = document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = `/#${sectionId}`;
    }
  };

  return (
    <header
      className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur-md shadow-sm glass-effect"
      data-testid="header"
    >
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity" data-testid="logo">
          <div className="h-10 w-10 rounded-2xl bg-brand-light border border-brand-blue/20 grid place-items-center">
            <Snowflake className="h-5 w-5 text-brand-blue" />
          </div>
          <div className="min-w-0">
            <div className="font-bold text-lg text-brand-dark leading-tight">iglo-bus.rent</div>
            <div className="text-xs text-slate-500 leading-tight">Wynajem chłodni i mroźni • PL</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium" data-testid="navigation">
          {isHomePage ? (
            <>
              <button onClick={() => scrollToSection("flota")} className="hover:text-brand-blue transition-colors" data-testid="nav-fleet">
                Flota i cennik
              </button>
              <button onClick={() => scrollToSection("jak-dziala")} className="hover:text-brand-blue transition-colors" data-testid="nav-how-it-works">
                Jak to działa
              </button>
              <button onClick={() => scrollToSection("faq")} className="hover:text-brand-blue transition-colors" data-testid="nav-faq">
                FAQ
              </button>
            </>
          ) : (
            <>
              <a href="/#flota" className="hover:text-brand-blue transition-colors" data-testid="nav-fleet">Flota i cennik</a>
              <a href="/#jak-dziala" className="hover:text-brand-blue transition-colors" data-testid="nav-how-it-works">Jak to działa</a>
              <a href="/#faq" className="hover:text-brand-blue transition-colors" data-testid="nav-faq">FAQ</a>
            </>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 hover:text-brand-blue transition-colors outline-none" data-testid="nav-knowledge-dropdown">
              Baza wiedzy
              <ChevronDown className="h-3 w-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuItem asChild>
                <Link href="/wynajem-mrozni" className="w-full">🧊 Wynajem mroźni</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/wynajem-chlodni" className="w-full">❄️ Wynajem chłodni</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/wymagania-auto-chlodnia-mroznia-izoterma" className="w-full">📋 Wymagania auto chłodnia</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/wyposazenie-samochodow-mrozni" className="w-full">🔧 Wyposażenie samochodów</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="flex items-center gap-2">
          {/* Telefon jako szybkie CTA */}
          <a
            href="tel:+48530410504"
            className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-brand-blue text-white text-sm font-semibold hover:bg-brand-blue/90 transition-colors"
            aria-label="Zadzwoń do Iglo-Bus Rent"
            data-testid="header-phone"
          >
            <Phone className="h-4 w-4" />
            +48 530 410 504
          </a>

          {/* E-mail jako mailto */}
          <a
            href="mailto:kontakt@iglo-bus.rent"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 hover:border-brand-blue/40 hover:text-brand-blue transition-colors text-sm font-medium"
            aria-label="Napisz e-mail do Iglo-Bus Rent"
            data-testid="header-email"
          >
            <Mail className="h-4 w-4" />
            <span className="hidden md:inline">kontakt@iglo-bus.rent</span>
            <span className="md:hidden">E-mail</span>
          </a>

          <button
            className="md:hidden p-2 hover:bg-gray-100 rounded-md transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="mobile-menu-button"
            aria-label={mobileMenuOpen ? "Zamknij menu" : "Otwórz menu"}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white/95 backdrop-blur-sm" data-testid="mobile-menu">
          <nav className="px-4 py-3 space-y-2">
            {isHomePage ? (
              <>
                <button
                  onClick={() => { scrollToSection("flota"); setMobileMenuOpen(false); }}
                  className="block w-full text-left py-2 px-3 hover:bg-brand-light rounded-md transition-colors"
                >
                  Flota i cennik
                </button>
                <button
                  onClick={() => { scrollToSection("jak-dziala"); setMobileMenuOpen(false); }}
                  className="block w-full text-left py-2 px-3 hover:bg-brand-light rounded-md transition-colors"
                >
                  Jak to działa
                </button>
                <button
                  onClick={() => { scrollToSection("faq"); setMobileMenuOpen(false); }}
                  className="block w-full text-left py-2 px-3 hover:bg-brand-light rounded-md transition-colors"
                >
                  FAQ
                </button>
              </>
            ) : (
              <>
                <a href="/#flota" className="block py-2 px-3 hover:bg-brand-light rounded-md transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  Flota i cennik
                </a>
                <a href="/#jak-dziala" className="block py-2 px-3 hover:bg-brand-light rounded-md transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  Jak to działa
                </a>
                <a href="/#faq" className="block py-2 px-3 hover:bg-brand-light rounded-md transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  FAQ
                </a>
              </>
            )}

            <div className="border-t pt-2 mt-2">
              <div className="py-2 px-3 text-sm font-medium text-gray-600">Baza wiedzy</div>
              <Link href="/wynajem-mrozni" className="block py-2 px-6 hover:bg-brand-light rounded-md transition-colors text-sm" onClick={() => setMobileMenuOpen(false)}>
                🧊 Wynajem mroźni
              </Link>
              <Link href="/wynajem-chlodni" className="block py-2 px-6 hover:bg-brand-light rounded-md transition-colors text-sm" onClick={() => setMobileMenuOpen(false)}>
                ❄️ Wynajem chłodni
              </Link>
              <Link href="/wymagania-auto-chlodnia-mroznia-izoterma" className="block py-2 px-6 hover:bg-brand-light rounded-md transition-colors text-sm" onClick={() => setMobileMenuOpen(false)}>
                📋 Wymagania auto chłodnia
              </Link>
              <Link href="/wyposazenie-samochodow-mrozni" className="block py-2 px-6 hover:bg-brand-light rounded-md transition-colors text-sm" onClick={() => setMobileMenuOpen(false)}>
                🔧 Wyposażenie samochodów
              </Link>
            </div>

            <div className="border-t pt-3 mt-2 flex flex-col gap-2">
              <a href="tel:+48530410504" className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-brand-blue text-white text-sm font-semibold">
                <Phone className="h-4 w-4" /> Zadzwoń
              </a>
              <a href="mailto:kontakt@iglo-bus.rent" className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-sm font-semibold">
                <Mail className="h-4 w-4" /> Napisz e-mail
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
