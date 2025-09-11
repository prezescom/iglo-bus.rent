import { Snowflake, Mail } from "lucide-react";
import { Link, useLocation } from "wouter";

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
          <Link
            href="/wynajem-mrozni"
            className="hover:text-brand-blue transition-colors"
            data-testid="nav-rental"
          >
            Wynajem mroźni
          </Link>
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
        </nav>
        
        <div className="text-sm" data-testid="contact-email">
          <a 
            href="mailto:kontakt@iglo-bus.rent" 
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
