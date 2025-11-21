import { useState, useMemo } from "react";
import { Calendar, Mail, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import emailjs from '@emailjs/browser';

interface BookingFormProps {
  vehicleTitle: string;
  pricing: Array<{
    period: string;
    price: string;
    highlighted?: boolean;
  }>;
}

export default function BookingForm({ vehicleTitle, pricing }: BookingFormProps) {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Get today's date in YYYY-MM-DD format for min date validation
  const today = new Date().toISOString().split('T')[0];

  // Calculate rental cost based on dates and pricing structure
  const rentalCalculation = useMemo(() => {
    if (!dateFrom || !dateTo) return null;

    const startDate = new Date(dateFrom);
    const endDate = new Date(dateTo);
    
    if (endDate <= startDate) return null;

    const days = Math.ceil((endDate.getTime() - startDate.getTime()+1) / (1000 * 60 * 60 * 24));
    
    if (days <= 0) return null;

    // Extract numeric prices and determine which tier applies
    let dailyRate = 0;
    let tierUsed = "";

    if (days >= 30) {
      // Monthly pricing - find the monthly rate
      const monthlyPricing = pricing.find(p => p.period.includes("30+") || p.period.includes("miesięcznie"));
      if (monthlyPricing) {
        const monthlyPrice = parseInt(monthlyPricing.price.replace(/[^\d]/g, ''));
        dailyRate = Math.round(monthlyPrice / 30); // Convert monthly to daily
        tierUsed = monthlyPricing.period;
      }
    } else if (days >= 15) {
      const tier = pricing.find(p => p.period.includes("15–29"));
      if (tier) {
        dailyRate = parseInt(tier.price.replace(/[^\d]/g, ''));
        tierUsed = tier.period;
      }
    } else if (days >= 8) {
      const tier = pricing.find(p => p.period.includes("8–14"));
      if (tier) {
        dailyRate = parseInt(tier.price.replace(/[^\d]/g, ''));
        tierUsed = tier.period;
      }
    } else if (days >= 4) {
      const tier = pricing.find(p => p.period.includes("4–7"));
      if (tier) {
        dailyRate = parseInt(tier.price.replace(/[^\d]/g, ''));
        tierUsed = tier.period;
      }
    } else {
      const tier = pricing.find(p => p.period.includes("1–3"));
      if (tier) {
        dailyRate = parseInt(tier.price.replace(/[^\d]/g, ''));
        tierUsed = tier.period;
      }
    }

    if (dailyRate === 0) return null;

    const totalCost = dailyRate * days;

    return {
      days,
      dailyRate,
      totalCost,
      tierUsed
    };
  }, [dateFrom, dateTo, pricing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dateFrom || !dateTo || !email) {
      toast({
        title: "Błąd",
        description: "Proszę wypełnić wszystkie wymagane pola.",
        variant: "destructive",
      });
      return;
    }

    // Validate dates are not in the past
    const selectedFromDate = new Date(dateFrom);
    const selectedToDate = new Date(dateTo);
    const todayDate = new Date(today);

    if (selectedFromDate < todayDate) {
      toast({
        title: "Błąd",
        description: "Data rozpoczęcia nie może być w przeszłości.",
        variant: "destructive",
      });
      return;
    }

    if (selectedToDate <= selectedFromDate) {
      toast({
        title: "Błąd",
        description: "Data zakończenia musi być późniejsza niż data rozpoczęcia.",
        variant: "destructive",
      });
      return;
    }

    if (!email.includes("@")) {
      toast({
        title: "Błąd",
        description: "Proszę podać prawidłowy adres e-mail.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // EmailJS service configuration
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        throw new Error('Konfiguracja EmailJS nie jest kompletna. Skontaktuj się z administratorem.');
      }

      // Initialize EmailJS with public key
      emailjs.init(publicKey);

      // Prepare booking details message
      const bookingDetails = [
        `Pojazd: ${vehicleTitle}`,
        `Termin wynajmu: ${dateFrom} → ${dateTo}`,
        `E-mail klienta: ${email}`,
        rentalCalculation ? `Liczba dni: ${rentalCalculation.days}` : null,
        rentalCalculation ? `Szacowany koszt: ${rentalCalculation.totalCost.toLocaleString()} zł netto (${rentalCalculation.dailyRate} zł/doba)` : null,
        notes ? `Uwagi: ${notes}` : null,
      ].filter(Boolean).join('\n');

      // Prepare template parameters
      const templateParams = {
        name: `Klient - Rezerwacja ${vehicleTitle}`,
        from_name: `Klient - Rezerwacja ${vehicleTitle}`,
        from_email: email,
        phone: 'Podano w e-mailu',
        subject: `Iglo-bus.rent — Rezerwacja ${vehicleTitle} (${dateFrom} → ${dateTo})`,
        message: bookingDetails
      };

      console.log('Sending booking email with params:', templateParams);

      // Send email via EmailJS
      const result = await emailjs.send(serviceId, templateId, templateParams);
      console.log('Booking email sent successfully:', result.status, result.text);

      toast({
        title: "Zapytanie wysłane!",
        description: "Dziękujemy za zapytanie o rezerwację. Odpowiemy w ciągu kilku godzin.",
      });

      // Reset form
      setDateFrom('');
      setDateTo('');
      setEmail('');
      setNotes('');

    } catch (error: any) {
      console.error('Error sending booking email:', error);
      
      let errorMessage = "Nie udało się wysłać zapytania. Spróbuj ponownie lub zadzwoń: +48 530 410 504";
      
      if (error?.status === 412 && error?.text?.includes('Relaying disallowed')) {
        errorMessage = "Problem z konfiguracją email. Prosimy dzwonić: +48 530 410 504";
      } else if (error?.status === 400) {
        errorMessage = "Błąd w formularzu. Sprawdź wszystkie pola i spróbuj ponownie.";
      } else if (error?.status === 401) {
        errorMessage = "Problem z autoryzacją email. Prosimy dzwonić: +48 530 410 504";
      }
      
      toast({
        title: "Błąd wysyłania",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-4 border-t border-slate-100" data-testid={`booking-form-${vehicleTitle.replace(/\s+/g, '-').toLowerCase()}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor={`date-from-${vehicleTitle}`} className="text-sm font-medium text-brand-dark">
              Data od
            </Label>
            <div className="relative">
              <Input
                id={`date-from-${vehicleTitle}`}
                type="date"
                value={dateFrom}
                min={today}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                data-testid="input-date-from"
                required
              />
              <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <Label htmlFor={`date-to-${vehicleTitle}`} className="text-sm font-medium text-brand-dark">
              Data do
            </Label>
            <div className="relative">
              <Input
                id={`date-to-${vehicleTitle}`}
                type="date"
                value={dateTo}
                min={dateFrom || today}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                data-testid="input-date-to"
                required
              />
              <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Rental Calculator */}
        {rentalCalculation && (
          <div className="bg-brand-light border border-brand-blue/20 rounded-xl p-4 space-y-3" data-testid="rental-calculator">
            <div className="flex items-center gap-2 text-brand-blue">
              <Calculator className="h-4 w-4" />
              <span className="font-semibold text-sm">Kalkulator wynajmu</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-600">Liczba dni:</span>
                <div className="font-bold text-brand-dark">{rentalCalculation.days} dni</div>
              </div>
              <div>
                <span className="text-slate-600">Stawka (tier: {rentalCalculation.tierUsed}):</span>
                <div className="font-bold text-brand-blue">{rentalCalculation.dailyRate} zł/doba</div>
              </div>
            </div>
            <div className="border-t border-brand-blue/20 pt-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-brand-dark">Szacowany koszt:</span>
                <div className="text-right">
                  <div className="text-xl font-bold text-brand-blue">{rentalCalculation.totalCost.toLocaleString()} zł</div>
                  <div className="text-xs text-slate-500">netto</div>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              * Kalkulacja orientacyjna. Ostateczną stawkę potwierdzimy e-mailem po sprawdzeniu dostępności.
            </p>
          </div>
        )}
        
        <div>
          <Label htmlFor={`email-${vehicleTitle}`} className="text-sm font-medium text-brand-dark">
            Twój e‑mail
          </Label>
          <div className="relative">
            <Input
              id={`email-${vehicleTitle}`}
              type="email"
              placeholder="jan.kowalski@firma.pl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
              data-testid="input-email"
              required
            />
            <Mail className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
        
        <div>
          <Label htmlFor={`notes-${vehicleTitle}`} className="text-sm font-medium text-brand-dark">
            Uwagi (opcjonalnie)
          </Label>
          <Textarea
            id={`notes-${vehicleTitle}`}
            rows={3}
            placeholder="np. Wskaż adres dostawy (sprawdź FAQ)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue resize-none"
            data-testid="textarea-notes"
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors"
            data-testid="button-submit-inquiry"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Wysyłanie...
              </>
            ) : (
              "Wyślij zapytanie"
            )}
          </Button>
          <p className="text-xs text-slate-500 text-center">
            Zapytanie trafi na <span className="font-medium">kontakt@iglo-bus.rent</span>
          </p>
        </div>
      </form>
    </div>
  );
}
