import { useState, useEffect } from "react";
import { X, Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CookiesBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setIsVisible(false);
  };

  const handleClose = () => {
    // Treat close as declined
    handleDecline();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-lg animate-slide-up" data-testid="cookies-banner">
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Cookie className="h-5 w-5 text-brand-blue mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-brand-dark">
                Używamy plików cookie
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Ta strona używa plików cookie niezbędnych do jej funkcjonowania oraz analitycznych 
                do poprawy jakości usług. Kontynuując korzystanie ze strony, wyrażasz zgodę na 
                wykorzystanie plików cookie zgodnie z naszą{" "}
                <button 
                  className="text-brand-blue hover:underline font-medium"
                  onClick={() => {
                    // Scroll to footer or open privacy policy
                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                  }}
                  data-testid="privacy-policy-link"
                >
                  polityką prywatności
                </button>.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDecline}
              className="flex-1 sm:flex-none text-xs sm:text-sm border-slate-300 hover:bg-slate-50"
              data-testid="decline-cookies"
            >
              Odrzuć
            </Button>
            <Button
              size="sm"
              onClick={handleAccept}
              className="flex-1 sm:flex-none text-xs sm:text-sm bg-brand-blue hover:bg-brand-blue/90"
              data-testid="accept-cookies"
            >
              Akceptuj
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="p-1 h-8 w-8 hover:bg-slate-100"
              data-testid="close-cookies"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}