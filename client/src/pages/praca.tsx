import { useState } from "react";
import {
  CheckCircle2,
  Truck,
  Pill,
  MapPin,
  Loader2,
} from "lucide-react";
import PageShell from "@/components/page-shell";
import Section from "@/components/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  submitJobApplication,
  JOB_POSITION,
  VOIVODESHIPS,
  type EmploymentStatus,
  type EmploymentForm,
  type StartAvailability,
  type SalaryExpectation,
  type Voivodeship,
} from "@/lib/applications";

const CURRENT_YEAR = new Date().getFullYear();

type YesNo = "" | "tak" | "nie";

type FormState = {
  firstName: string;
  lastName: string;
  birthYear: string;
  city: string;
  voivodeship: Voivodeship | "";
  phone: string;
  email: string;
  employmentStatus: EmploymentStatus;
  employmentForm: EmploymentForm;
  licenseYear: string;
  experienceDelivery: YesNo;
  experienceMeds: YesNo;
  partTimeOk: YesNo;
  startAvailability: StartAvailability | "";
  salaryExpectation: SalaryExpectation | "";
};

const initialState: FormState = {
  firstName: "",
  lastName: "",
  birthYear: "",
  city: "",
  voivodeship: "",
  phone: "",
  email: "",
  employmentStatus: "etat",
  employmentForm: "umowa_o_prace",
  licenseYear: "",
  experienceDelivery: "",
  experienceMeds: "",
  partTimeOk: "",
  startAvailability: "",
  salaryExpectation: "",
};

export default function Praca() {
  const [form, setForm] = useState<FormState>(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const canonical = "https://www.iglo-bus.rent/praca";
  const title = "Praca: Kierowca kat. B – transport leków | Iglo-Bus Rent";
  const description =
    "Rekrutacja: kierowca kat. B do transportu leków. Umowa o pracę, zlecenie lub B2B, cała Polska. Wypełnij krótki formularz aplikacyjny.";

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "JobPosting",
      title: JOB_POSITION,
      description:
        "Poszukujemy kierowcy kat. B do transportu leków na terenie Polski. Oferujemy elastyczną formę współpracy (umowa o pracę, zlecenie lub B2B) oraz możliwość pracy w niepełnym wymiarze godzin.",
      identifier: {
        "@type": "PropertyValue",
        name: "Iglo-Bus Rent",
        value: "kierowca-kat-b-transport-lekow",
      },
      datePosted: "2026-08-20",
      employmentType: ["FULL_TIME", "PART_TIME", "CONTRACTOR"],
      hiringOrganization: {
        "@type": "Organization",
        name: "FBS Jacek Małachowski",
        sameAs: "https://www.iglo-bus.rent/",
      },
      jobLocation: {
        "@type": "Place",
        address: {
          "@type": "PostalAddress",
          addressCountry: "PL",
        },
      },
      directApply: true,
      url: canonical,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Strona główna", item: "https://www.iglo-bus.rent/" },
        { "@type": "ListItem", position: 2, name: "Praca", item: canonical },
      ],
    },
  ];

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function isValidYear(value: string, minAge = 0) {
    if (!/^\d{4}$/.test(value)) return false;
    const year = Number(value);
    return year >= 1940 && year <= CURRENT_YEAR - minAge;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.firstName.trim() || !form.lastName.trim() || !form.city.trim() || !form.phone.trim()) {
      toast({ title: "Błąd", description: "Uzupełnij wszystkie pola w sekcji „Dane osobowe”.", variant: "destructive" });
      return;
    }
    if (!isValidYear(form.birthYear, 16)) {
      toast({ title: "Błąd", description: "Podaj prawidłowy rok urodzenia.", variant: "destructive" });
      return;
    }
    if (!form.voivodeship) {
      toast({ title: "Błąd", description: "Wybierz województwo.", variant: "destructive" });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      toast({ title: "Błąd", description: "Podaj prawidłowy adres e-mail.", variant: "destructive" });
      return;
    }
    if (!isValidYear(form.licenseYear)) {
      toast({ title: "Błąd", description: "Podaj prawidłowy rok uzyskania prawa jazdy kat. B.", variant: "destructive" });
      return;
    }
    if (!form.experienceDelivery || !form.experienceMeds || !form.partTimeOk) {
      toast({ title: "Błąd", description: "Odpowiedz tak/nie na wszystkie pytania w sekcji „Doświadczenie”.", variant: "destructive" });
      return;
    }
    if (!form.startAvailability) {
      toast({ title: "Błąd", description: "Wybierz, kiedy możesz zacząć pracę.", variant: "destructive" });
      return;
    }
    if (!form.salaryExpectation) {
      toast({ title: "Błąd", description: "Wybierz oczekiwania finansowe.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      await submitJobApplication({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        birthYear: Number(form.birthYear),
        city: form.city.trim(),
        voivodeship: form.voivodeship,
        phone: form.phone.trim(),
        email: form.email.trim(),
        employmentStatus: form.employmentStatus,
        employmentForm: form.employmentForm,
        licenseYear: Number(form.licenseYear),
        experienceDelivery: form.experienceDelivery === "tak",
        experienceMeds: form.experienceMeds === "tak",
        partTimeOk: form.partTimeOk === "tak",
        startAvailability: form.startAvailability,
        salaryExpectation: form.salaryExpectation,
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Błąd wysyłki aplikacji:", error);
      toast({
        title: "Błąd wysyłania",
        description: "Nie udało się wysłać aplikacji. Spróbuj ponownie lub zadzwoń: +48 530 410 504",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <PageShell title={title} description={description} canonical={canonical} jsonLd={jsonLd}>
      <section className="mx-auto max-w-4xl px-4 pt-10 pb-6 md:pt-14">
        <div className="text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-brand-dark">
            Praca: Kierowca kat. B <span className="text-brand-blue">— transport leków</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Dołącz do zespołu Iglo-Bus Rent. Wypełnij krótki formularz — odezwiemy się do wybranych kandydatów.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-1">
            {[
              { icon: <Pill className="h-5 w-5" />, label: "Transport leków" },
              { icon: <Truck className="h-5 w-5" />, label: "Kat. B" },
              { icon: <MapPin className="h-5 w-5" />, label: "Cała Polska" },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-light border border-brand-blue/20">
                <span className="text-brand-blue">{f.icon}</span>
                <span className="font-medium text-sm">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Section tone="soft">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
          {submitted ? (
            <div className="text-center py-8 space-y-4" data-testid="application-success">
              <div className="flex justify-center">
                <div className="h-14 w-14 rounded-2xl bg-brand-light grid place-items-center">
                  <CheckCircle2 className="h-7 w-7 text-brand-blue" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-brand-dark">Dziękujemy za aplikację!</h2>
              <p className="text-slate-600 max-w-md mx-auto">
                Potwierdzenie przyjęcia aplikacji na stanowisko Kierowcy kat. B — transport leków wysłaliśmy na
                podany adres e-mail. Zastrzegamy sobie prawo do skontaktowania się jedynie z wybranymi kandydatami.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8" data-testid="form-job-application">
              <fieldset className="space-y-4">
                <legend className="font-semibold text-brand-dark mb-2">Dane osobowe</legend>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Imię</Label>
                    <Input
                      id="firstName"
                      value={form.firstName}
                      onChange={(e) => update("firstName", e.target.value)}
                      required
                      data-testid="input-first-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nazwisko</Label>
                    <Input
                      id="lastName"
                      value={form.lastName}
                      onChange={(e) => update("lastName", e.target.value)}
                      required
                      data-testid="input-last-name"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="birthYear">Rok urodzenia</Label>
                    <Input
                      id="birthYear"
                      inputMode="numeric"
                      placeholder="np. 1990"
                      value={form.birthYear}
                      onChange={(e) => update("birthYear", e.target.value.replace(/\D/g, "").slice(0, 4))}
                      required
                      data-testid="input-birth-year"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">Miejsce zamieszkania</Label>
                    <Input
                      id="city"
                      value={form.city}
                      onChange={(e) => update("city", e.target.value)}
                      required
                      data-testid="input-city"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="voivodeship">Województwo</Label>
                  <Select
                    value={form.voivodeship}
                    onValueChange={(v) => update("voivodeship", v as Voivodeship)}
                  >
                    <SelectTrigger id="voivodeship" data-testid="select-voivodeship">
                      <SelectValue placeholder="Wybierz województwo" />
                    </SelectTrigger>
                    <SelectContent>
                      {VOIVODESHIPS.map((v) => (
                        <SelectItem key={v} value={v}>
                          {v}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Telefon kontaktowy</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      required
                      data-testid="input-phone"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Adres e-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      required
                      data-testid="input-email"
                    />
                  </div>
                </div>
              </fieldset>

              <fieldset className="space-y-4">
                <legend className="font-semibold text-brand-dark mb-2">Status i forma zatrudnienia</legend>

                <div>
                  <Label htmlFor="employmentStatus">Status zawodowy</Label>
                  <Select
                    value={form.employmentStatus}
                    onValueChange={(v) => update("employmentStatus", v as EmploymentStatus)}
                  >
                    <SelectTrigger id="employmentStatus" data-testid="select-employment-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="etat">Pracownik etatowy</SelectItem>
                      <SelectItem value="przedsiebiorca">Przedsiębiorca</SelectItem>
                      <SelectItem value="bezrobotny">Bezrobotny</SelectItem>
                      <SelectItem value="emeryt">Emeryt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="employmentForm">Preferowana forma zatrudnienia</Label>
                  <Select
                    value={form.employmentForm}
                    onValueChange={(v) => update("employmentForm", v as EmploymentForm)}
                  >
                    <SelectTrigger id="employmentForm" data-testid="select-employment-form">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="umowa_o_prace">Umowa o pracę</SelectItem>
                      <SelectItem value="zlecenie">Umowa zlecenie</SelectItem>
                      <SelectItem value="b2b">Kontrakt B2B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="licenseYear">Rok uzyskania prawa jazdy kat. B</Label>
                  <Input
                    id="licenseYear"
                    inputMode="numeric"
                    placeholder="np. 2012"
                    value={form.licenseYear}
                    onChange={(e) => update("licenseYear", e.target.value.replace(/\D/g, "").slice(0, 4))}
                    required
                    data-testid="input-license-year"
                  />
                </div>
              </fieldset>

              <fieldset className="space-y-5">
                <legend className="font-semibold text-brand-dark mb-2">Doświadczenie i preferencje</legend>

                <YesNoQuestion
                  name="experienceDelivery"
                  label="Posiadam doświadczenie w prowadzeniu samochodów dostawczych"
                  value={form.experienceDelivery}
                  onChange={(v) => update("experienceDelivery", v)}
                />
                <YesNoQuestion
                  name="experienceMeds"
                  label="Posiadam doświadczenie w transporcie leków"
                  value={form.experienceMeds}
                  onChange={(v) => update("experienceMeds", v)}
                />
                <YesNoQuestion
                  name="partTimeOk"
                  label="Chętnie podejmę pracę w niepełnym wymiarze godzin (min. 1/2 etatu)"
                  value={form.partTimeOk}
                  onChange={(v) => update("partTimeOk", v)}
                />
              </fieldset>

              <fieldset className="space-y-3">
                <legend className="font-semibold text-brand-dark mb-2">Mogę zacząć pracę</legend>
                <RadioGroup
                  value={form.startAvailability}
                  onValueChange={(v) => update("startAvailability", v as StartAvailability)}
                  className="grid sm:grid-cols-3 gap-2"
                  data-testid="radio-start-availability"
                >
                  {[
                    { value: "jutro", label: "Od jutra" },
                    { value: "nowy_miesiac", label: "Od nowego miesiąca" },
                    { value: "pozniej", label: "Później" },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      htmlFor={`startAvailability-${opt.value}`}
                      className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 cursor-pointer has-[:checked]:border-brand-blue has-[:checked]:bg-brand-light"
                    >
                      <RadioGroupItem value={opt.value} id={`startAvailability-${opt.value}`} />
                      <span className="text-sm">{opt.label}</span>
                    </label>
                  ))}
                </RadioGroup>
              </fieldset>

              <fieldset className="space-y-3">
                <legend className="font-semibold text-brand-dark mb-2">Oczekiwania finansowe (netto/cały etat)</legend>
                <RadioGroup
                  value={form.salaryExpectation}
                  onValueChange={(v) => update("salaryExpectation", v as SalaryExpectation)}
                  className="grid grid-cols-2 sm:grid-cols-5 gap-2"
                  data-testid="radio-salary-expectation"
                >
                  {(["5000", "5500", "6000", "6500", "7000"] as const).map((amount) => (
                    <label
                      key={amount}
                      htmlFor={`salary-${amount}`}
                      className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 cursor-pointer has-[:checked]:border-brand-blue has-[:checked]:bg-brand-light"
                    >
                      <RadioGroupItem value={amount} id={`salary-${amount}`} />
                      <span className="text-sm">{amount} zł</span>
                    </label>
                  ))}
                </RadioGroup>
              </fieldset>

              <p className="text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-4">
                Wysyłając aplikację wyrażam zgodę na przetwarzanie moich danych osobowych przez FBS Jacek Małachowski
                również na potrzeby przyszłych rekrutacji. Zastrzegamy sobie prawo do skontaktowania się jedynie z
                wybranymi kandydatami.
              </p>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors"
                data-testid="button-submit-application"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Wysyłanie...
                  </>
                ) : (
                  "Wyślij aplikację"
                )}
              </Button>
            </form>
          )}
        </div>
      </Section>
    </PageShell>
  );
}

function YesNoQuestion({
  name,
  label,
  value,
  onChange,
}: {
  name: string;
  label: string;
  value: YesNo;
  onChange: (value: YesNo) => void;
}) {
  return (
    <div>
      <Label className="block mb-2">{label}</Label>
      <RadioGroup
        value={value}
        onValueChange={(v) => onChange(v as YesNo)}
        className="grid grid-cols-2 gap-2"
        data-testid={`radio-${name}`}
      >
        {[
          { value: "tak", label: "Tak" },
          { value: "nie", label: "Nie" },
        ].map((opt) => (
          <label
            key={opt.value}
            htmlFor={`${name}-${opt.value}`}
            className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 cursor-pointer has-[:checked]:border-brand-blue has-[:checked]:bg-brand-light"
          >
            <RadioGroupItem value={opt.value} id={`${name}-${opt.value}`} />
            <span className="text-sm">{opt.label}</span>
          </label>
        ))}
      </RadioGroup>
    </div>
  );
}
