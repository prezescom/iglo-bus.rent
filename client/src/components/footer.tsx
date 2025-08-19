import { Snowflake } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white" data-testid="footer">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-8 rounded-xl bg-brand-blue/20 grid place-items-center">
                <Snowflake className="h-4 w-4 text-brand-blue" />
              </div>
              <span className="font-bold text-lg">Iglo-bus.rent</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Profesjonalna wypożyczalnia samochodów chłodniczych i mroźni na terenie Polski.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Kontakt</h4>
            <div className="space-y-2 text-sm text-slate-300">
              <p>
                E-mail:{" "}
                <a 
                  href="mailto:kontakt@iglo-bus.rent" 
                  className="text-brand-blue hover:underline"
                  data-testid="footer-email"
                >
                  kontakt@iglo-bus.rent
                </a>
              </p>
              <p>
                Telefon:{" "}
                <a 
                  href="tel:+48530410504" 
                  className="text-brand-blue hover:underline"
                  data-testid="footer-phone"
                >
                  +48 530 410 504
                </a>
              </p>
              <p>
                Adres:{" "}
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=Gliwicka+15b,+44-178+Przyszowice"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-blue hover:underline cursor-pointer"
                  data-testid="footer-address"
                  title="Otwórz w Google Maps"
                >
                  Gliwicka 15b, 44-178 Przyszowice
                </a>
              </p>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Usługi</h4>
            <div className="space-y-2 text-sm text-slate-300">
              <p>Wynajem aut chłodniczych</p>
              <p>Transport produktów mrożonych</p>
              <p>Obsługa B2B z fakturą VAT</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-700 mt-8 pt-8 text-center text-sm text-slate-400">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-4">
            <a 
              href="/polityka-prywatnosci" 
              className="text-brand-blue hover:underline"
              data-testid="footer-privacy-policy"
            >
              Polityka Prywatności
            </a>
            <span className="hidden sm:inline">•</span>
            <a 
              href="mailto:kontakt@iglo-bus.rent" 
              className="text-brand-blue hover:underline"
            >
              Kontakt RODO
            </a>
          </div>
          <p>&copy; 2024 Iglo-bus.rent. Wszystkie prawa zastrzeżone.</p>
        </div>
      </div>
    </footer>
  );
}
