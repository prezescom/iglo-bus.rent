import { useState, useMemo } from "react";
import { Calendar as CalendarIcon, Mail, Calculator } from "lucide-react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import emailjs from '@emailjs/browser';

// "YYYY-MM-DD" <-> Date, licząc po lokalnych składowych daty (nie
// toISOString/new Date(string), które przechodzą przez UTC i przy pewnych
// strefach czasowych/godzinach potrafią przesunąć dzień o jeden).
function toYMD(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function fromYMD(value: string): Date | undefined {
  if (!value) return undefined;
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
}

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

// Niedziela (dzień odbioru/zwrotu pojazdów niedostępny) jest wyłączona z
// wyboru w obu kalendarzach — patrz matcher { dayOfWeek: [0] } poniżej.
const SUNDAY = { dayOfWeek: [0] };

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

    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (days <= 0) return null;

    // Extract numeric prices and determine which tier applies
    let dailyRate = 0;
    let tierUsed = "";

    const findRate = (p: { period: string; price: string }) =>
      parseInt(p.price.replace(/[^\d]/g, ''));

    if (days >= 30) {
      const tier = pricing.find(p =>
        p.period.includes("30+") || p.period.includes("miesięcznie") || p.period === "miesiąc"
      );
      if (tier) {
        const monthlyPrice = findRate(tier);
        dailyRate = Math.round(monthlyPrice / 30);
        tierUsed = tier.period;
      }
    } else if (days >= 15) {
      const tier = pricing.find(p => p.period.includes("15–29"));
      if (tier) { dailyRate = findRate(tier); tierUsed = tier.period; }
    } else if (days >= 8) {
      const tier = pricing.find(p => p.period.includes("8–14"));
      if (tier) { dailyRate = findRate(tier); tierUsed = tier.period; }
    } else if (days >= 4) {
      const tier = pricing.find(p => p.period.includes("4–7"));
      if (tier) { dailyRate = findRate(tier); tierUsed = tier.period; }
    } else {
      const tier = pricing.find(p => p.period.includes("1–3") || p.period === "doba");
      if (tier) { dailyRate = findRate(tier); tierUsed = tier.period; }
    }

    // fallback: jeśli żaden tier nie pasuje (np. cennik tylko z "doba"), użyj stawki dobowej
    if (dailyRate === 0) {
      const dobaTier = pricing.find(p => p.period === "doba");
      if (dobaTier) { dailyRate = findRate(dobaTier); tierUsed = dobaTier.period; }
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
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  id={`date-from-${vehicleTitle}`}
                  className={cn(
                    "relative w-full px-3 py-2 border border-slate-300 rounded-lg text-left text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue",
                    !dateFrom && "text-slate-400"
                  )}
                  data-testid="input-date-from"
                >
                  {dateFrom ? format(fromYMD(dateFrom)!, "dd.MM.yyyy") : "Wybierz datę"}
                  <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  locale={pl}
                  selected={fromYMD(dateFrom)}
                  onSelect={(d) => setDateFrom(d ? toYMD(d) : "")}
                  disabled={[{ before: startOfToday() }, SUNDAY]}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label htmlFor={`date-to-${vehicleTitle}`} className="text-sm font-medium text-brand-dark">
              Data do
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  id={`date-to-${vehicleTitle}`}
                  className={cn(
                    "relative w-full px-3 py-2 border border-slate-300 rounded-lg text-left text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue",
                    !dateTo && "text-slate-400"
                  )}
                  data-testid="input-date-to"
                >
                  {dateTo ? format(fromYMD(dateTo)!, "dd.MM.yyyy") : "Wybierz datę"}
                  <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  locale={pl}
                  selected={fromYMD(dateTo)}
                  onSelect={(d) => setDateTo(d ? toYMD(d) : "")}
                  disabled={[{ before: fromYMD(dateFrom) || startOfToday() }, SUNDAY]}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
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
