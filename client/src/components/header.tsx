import { Snowflake, ChevronDown, Menu, X, Phone, List } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";
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

  // Zamykaj mobile menu po zmianie routingu
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur-md shadow-sm">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="h-10 w-10 rounded-2xl bg-brand-light border border-brand-blue/20 grid place-items-center">
              <Snowflake className="h-5 w-5 text-brand-blue" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-lg text-brand-dark leading-tight">iglo-bus.rent</div>
              <div className="text-xs text-slate-500 leading-tight">Wynajem chłodni i mroźni • PL</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {isHomePage ? (
              <>
                <button onClick={() => scrollToSection("flota")} className="hover:text-brand-blue transition-colors">
                  Flota i cennik
                </button>
                <button onClick={() => scrollToSection("jak-dziala")} className="hover:text-brand-blue transition-colors">
                  Jak to działa
                </button>
                <button onClick={() => scrollToSection("faq")} className="hover:text-brand-blue transition-colors">
                  FAQ
                </button>
              </>
            ) : (
              <>
                <a href="/#flota" className="hover:text-brand-blue transition-colors">Flota i cennik</a>
                <a href="/#jak-dziala" className="hover:text-brand-blue transition-colors">Jak to działa</a>
                <a href="/#faq" className="hover:text-brand-blue transition-colors">FAQ</a>
              </>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 hover:text-brand-blue transition-colors outline-none">
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
                  <Link href="/wyposazenie-samochodow-mrozni" className="w-full">🔧 Wyposażenie</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <a
              href="tel:+48530410504"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-brand-blue text-white text-sm font-semibold hover:bg-brand-blue/90 transition-colors"
              aria-label="Zadzwoń do Iglo-Bus Rent"
            >
              <Phone className="h-4 w-4" />
              +48 530 410 504
            </a>
          </nav>

          {/* Mobile: tylko hamburger */}
          <button
            className="md:hidden p-2 hover:bg-gray-100 rounded-md transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Zamknij menu" : "Otwórz menu"}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <nav className="px-4 py-3 space-y-2 text-sm">
              <button
                onClick={() => scrollToSection("flota")}
                className="block w-full text-left py-2 px-3 hover:bg-brand-light rounded-md transition-colors"
              >
                Flota i cennik
              </button>
              <button
                onClick={() => scrollToSection("jak-dziala")}
                className="block w-full text-left py-2 px-3 hover:bg-brand-light rounded-md transition-colors"
              >
                Jak to działa
              </button>
              <button
                onClick={() => scrollToSection("faq")}
                className="block w-full text-left py-2 px-3 hover:bg-brand-light rounded-md transition-colors"
              >
                FAQ
              </button>

              <div className="border-t pt-2 mt-2">
                <div className="py-2 px-3 text-xs uppercase tracking-wide text-gray-500">Baza wiedzy</div>
                <Link href="/wynajem-mrozni" className="block py-2 px-3 hover:bg-brand-light rounded-md transition-colors">
                  🧊 Wynajem mroźni
                </Link>
                <Link href="/wynajem-chlodni" className="block py-2 px-3 hover:bg-brand-light rounded-md transition-colors">
                  ❄️ Wynajem chłodni
                </Link>
                <Link href="/wyposazenie-samochodow-mrozni" className="block py-2 px-3 hover:bg-brand-light rounded-md transition-colors">
                  🔧 Wyposażenie
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
            aria-label="Zadzwoń"
          >
            <Phone className="h-5 w-5" />
            Zadzwoń
          </a>

          <button
            type="button"
            onClick={() => scrollToSection("flota")}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-brand-blue text-brand-blue font-semibold"
            aria-label="Sprawdź ceny i dostępność"
          >
            <List className="h-5 w-5" />
            Cennik
          </button>
        </div>
      </div>
    </>
  );
}
