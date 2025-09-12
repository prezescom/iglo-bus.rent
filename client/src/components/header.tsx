import { Snowflake, Mail, ChevronDown } from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [location] = useLocation();
  const isHomePage = location === "/";

  const scrollToSection = (sectionId: string) => {
    if (isHomePage) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // For cross-page navigation, use regular link navigation
      window.location.href = `/#${sectionId}`;
    }
  };

  return (
    <header 
      className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur-md shadow-sm glass-effect"
      data-testid="header"
    >
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity" data-testid="logo">
          <div className="h-10 w-10 rounded-2xl bg-brand-light border border-brand-blue/20 grid place-items-center">
            <Snowflake className="h-5 w-5 text-brand-blue" />
          </div>
          <div>
            <div className="font-bold text-lg text-brand-dark">Iglo-bus.rent</div>
            <div className="text-xs text-slate-500">Wypożyczalnia samochodów mroźni</div>
          </div>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium" data-testid="navigation">
          {isHomePage ? (
            <>
              <button
                onClick={() => scrollToSection("flota")}
                className="hover:text-brand-blue transition-colors"
                data-testid="nav-fleet"
              >
                Flota i cennik
              </button>
              <button
                onClick={() => scrollToSection("jak-dziala")}
                className="hover:text-brand-blue transition-colors"
                data-testid="nav-how-it-works"
              >
                Jak to działa
              </button>
              <button
                onClick={() => scrollToSection("faq")}
                className="hover:text-brand-blue transition-colors"
                data-testid="nav-faq"
              >
                FAQ
              </button>
            </>
          ) : (
            <>
              <a
                href="/#flota"
                className="hover:text-brand-blue transition-colors"
                data-testid="nav-fleet"
              >
                Flota i cennik
              </a>
              <a
                href="/#jak-dziala"
                className="hover:text-brand-blue transition-colors"
                data-testid="nav-how-it-works"
              >
                Jak to działa
              </a>
              <a
                href="/#faq"
                className="hover:text-brand-blue transition-colors"
                data-testid="nav-faq"
              >
                FAQ
              </a>
            </>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 hover:text-brand-blue transition-colors outline-none" data-testid="nav-knowledge-dropdown">
              Baza wiedzy
              <ChevronDown className="h-3 w-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuItem asChild>
                <Link href="/wynajem-mrozni" className="w-full">
                  🧊 Wynajem mroźni
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/wynajem-chlodni" className="w-full">
                  ❄️ Wynajem chłodni
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/wymagania-auto-chlodnia-mroznia-izoterma" className="w-full">
                  📋 Wymagania auto chłodnia
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
        
        <div className="text-sm" data-testid="contact-email">
          <a 
            href="/kontakt" 
            className="hover:text-brand-blue transition-colors font-medium flex items-center gap-1"
          >
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">kontakt@iglo-bus.rent</span>
          </a>
        </div>
      </div>
    </header>
  );
}
