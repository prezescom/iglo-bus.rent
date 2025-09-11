import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, Send, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import emailjs from '@emailjs/browser';

interface ContactFormProps {
  title?: string;
  showPhoneButton?: boolean;
}

export default function ContactForm({ 
  title = "Wyślij zapytanie", 
  showPhoneButton = true 
}: ContactFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Zapytanie o wynajem mroźni',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // EmailJS service configuration
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        throw new Error('Konfiguracja EmailJS nie jest kompletna. Skontaktuj się z administratorem.');
      }

      // Initialize EmailJS with public key
      emailjs.init({
        publicKey: publicKey,
        blockHeadless: true,
        limitRate: {
          id: 'app',
          throttle: 10000,
        },
      });

      // Prepare template parameters
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
        to_email: 'kontakt@iglo-bus.rent',
        reply_to: formData.email
      };

      // Send email via EmailJS
      const result = await emailjs.send(serviceId, templateId, templateParams);
      console.log('Email sent successfully:', result.status, result.text);

      toast({
        title: "Wiadomość wysłana!",
        description: "Dziękujemy za zapytanie. Odpowiemy w ciągu kilku godzin.",
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'Zapytanie o wynajem mroźni',
        message: ''
      });

    } catch (error: any) {
      console.error('Error sending email:', error);
      toast({
        title: "Błąd wysyłania",
        description: error.message || "Nie udało się wysłać wiadomości. Spróbuj ponownie lub zadzwoń.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick actions */}
      {showPhoneButton && (
        <div className="flex flex-col sm:flex-row gap-4">
          <a 
            href="tel:+48530410504"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-blue text-white font-semibold hover:bg-brand-blue/90 transition-colors"
          >
            <Phone className="h-5 w-5" />
            Zadzwoń: +48 530 410 504
          </a>
          <div className="text-center sm:text-left text-sm text-slate-600 flex items-center">
            <span className="hidden sm:block">lub wypełnij formularz poniżej</span>
            <span className="sm:hidden">Lub wypełnij formularz:</span>
          </div>
        </div>
      )}

      {/* Contact form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-brand-blue" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" data-testid="contact-form">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Imię i nazwisko *
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Jan Kowalski"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  data-testid="input-name"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Adres email *
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="jan@firma.pl"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  data-testid="input-email"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Telefon (opcjonalnie)
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+48 123 456 789"
                  value={formData.phone}
                  onChange={handleChange}
                  data-testid="input-phone"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">
                  Temat
                </label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="Zapytanie o wynajem mroźni"
                  value={formData.subject}
                  onChange={handleChange}
                  data-testid="input-subject"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                Wiadomość *
              </label>
              <Textarea
                id="message"
                name="message"
                placeholder="Proszę o informacje na temat wynajmu mroźni Toyota ProAce na okres... Potrzebne pojemność... Preferowany termin..."
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                data-testid="input-message"
              />
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-brand-blue hover:bg-brand-blue/90"
              data-testid="button-submit"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Wysyłanie...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Wyślij zapytanie
                </>
              )}
            </Button>

            <div className="text-xs text-slate-500 text-center">
              Odpowiadamy zwykle w ciągu kilku godzin. 
              W pilnych sprawach dzwoń: <strong>+48 530 410 504</strong>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}