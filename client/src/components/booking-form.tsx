import { useState } from "react";
import { Calendar, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface BookingFormProps {
  vehicleTitle: string;
}

export default function BookingForm({ vehicleTitle }: BookingFormProps) {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dateFrom || !dateTo || !email) {
      toast({
        title: "Błąd",
        description: "Proszę wypełnić wszystkie wymagane pola.",
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

    // Construct mailto link
    const subject = encodeURIComponent(`Iglo-bus.rent — Rezerwacja ${vehicleTitle} (${dateFrom} → ${dateTo})`);
    const body = encodeURIComponent([
      `Grupa: ${vehicleTitle}`,
      `Termin: ${dateFrom} → ${dateTo}`,
      `E-mail klienta: ${email}`,
      notes ? `Uwagi: ${notes}` : null,
    ].filter(Boolean).join('\n'));
    
    const mailtoLink = `mailto:contact@iglo-bus.rent?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;

    toast({
      title: "Przekierowanie",
      description: "Otwieranie klienta e-mail...",
    });

    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
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
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                data-testid="input-date-to"
                required
              />
              <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
        
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
            placeholder="np. prośba o wózek paletowy, załadunek rampą..."
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
            {isLoading ? "Otwieranie klienta e-mail..." : "Wyślij zapytanie"}
          </Button>
          <p className="text-xs text-slate-500 text-center">
            Zapytanie trafi na <span className="font-medium">contact@iglo-bus.rent</span>
          </p>
        </div>
      </form>
    </div>
  );
}
