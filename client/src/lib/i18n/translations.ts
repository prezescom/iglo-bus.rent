// Tłumaczenia strony głównej (PL / EN / CS).
//
// Zakres celowo ograniczony do strony głównej ("/", "/en", "/cs") — reszta
// serwisu (blog, /praca, podstrony bazy wiedzy) pozostaje wyłącznie po
// polsku. Interfejs `Dictionary` wymusza w TypeScripcie, żeby wersje en/cs
// miały dokładnie taki sam kształt jak pl (żadne pole nie zostanie
// przypadkiem pominięte).

export type Lang = "pl" | "en" | "cs";

export const LANGUAGES: { code: Lang; label: string; path: string }[] = [
  { code: "pl", label: "Polski", path: "/" },
  { code: "en", label: "English", path: "/en" },
  { code: "cs", label: "Čeština", path: "/cs" },
];

export type VehicleId = "city" | "proace" | "maxi";

interface VehicleText {
  title: string;
  group: string;
  alt: string;
  gallery: { alt: string; title: string }[];
  /** Etykiety okresów najmu, w tej samej kolejności co ceny w fleet-section.tsx */
  periods: string[];
}

interface Dictionary {
  currency: string;
  meta: {
    title: string;
    description: string;
    ogImageAlt: string;
    ogLocale: string;
    breadcrumbHome: string;
    localBusinessDescription: string;
    products: { name: string; description: string }[];
  };
  header: {
    tagline: string;
    navFleet: string;
    navHow: string;
    navFaq: string;
    knowledgeBase: string;
    kbFreezer: string;
    kbFridge: string;
    kbRequirements: string;
    kbEquipment: string;
    blog: string;
    callAria: string;
    menuOpenAria: string;
    menuCloseAria: string;
    mobileCall: string;
    mobilePricing: string;
    mobilePricingAria: string;
  };
  hero: {
    h1Prefix: string;
    h1Highlight: string;
    h1Sub: string;
    paragraphPre: string;
    paragraphHighlight: string;
    paragraphPost: string;
    featureTemp: string;
    featureCert: string;
    featureDelivery: string;
    ctaCallAria: string;
    ctaCallLabel: string;
    ctaPricing: string;
    ctaEmailAria: string;
    ctaEmailLabel: string;
    footerLine: string;
    contactTitle: string;
    phoneLabel: string;
    emailLabel: string;
    contactHint: string;
  };
  fleet: {
    title: string;
    intro: string;
    introDesktopExtra: string;
    introMobile: string;
    sizeAriaPrefix: string;
    mobileHint: string;
  };
  vehicleCard: {
    openGalleryAriaPrefix: string;
    photoAriaPrefix: string;
    photosSuffix: string;
    tablePeriod: string;
    tablePrice: string;
    defaultDescription: string;
  };
  vehicleSpec: {
    loadCapacity: string;
    grossWeight: string;
    internal: string;
    external: string;
    length: string;
    width: string;
    height: string;
    dimensionsNote: string;
    deposit: string;
  };
  booking: {
    dateFromLabel: string;
    dateToLabel: string;
    chooseDate: string;
    calcTitle: string;
    calcDaysLabel: string;
    calcRateLabel: string;
    calcTotalLabel: string;
    calcNet: string;
    calcNote: string;
    emailLabel: string;
    emailPlaceholder: string;
    notesLabel: string;
    notesPlaceholder: string;
    submitIdle: string;
    submitLoading: string;
    submitNotePrefix: string;
    dayOne: string;
    dayFew: string;
    dayMany: string;
    perDaySuffix: string;
    toastErrorTitle: string;
    toastSendErrorTitle: string;
    toastMissingFields: string;
    toastPastDate: string;
    toastEndBeforeStart: string;
    toastInvalidEmail: string;
    toastGenericError: string;
    toastRelayError: string;
    toastFormError: string;
    toastAuthError: string;
    toastSuccessTitle: string;
    toastSuccessDesc: string;
  };
  howItWorks: {
    title: string;
    steps: { title: string; description: string }[];
  };
  faq: {
    title: string;
    items: { question: string; answer: string }[];
  };
  footer: {
    tagline: string;
    contactTitle: string;
    emailLabel: string;
    phoneLabel: string;
    addressLabel: string;
    address: string;
    mapTooltip: string;
    servicesTitle: string;
    service1: string;
    service2: string;
    service3: string;
    blog: string;
    praca: string;
    privacy: string;
    contactRodo: string;
    copyright: string;
  };
  cookies: {
    title: string;
    text: string;
    linkText: string;
    decline: string;
    accept: string;
  };
  vehicles: Record<VehicleId, VehicleText>;
}

const pl: Dictionary = {
  currency: "zł",
  meta: {
    title: "Wynajem samochodów chłodni i mroźni – Polska | Iglo-Bus Rent",
    description:
      "Wynajem aut chłodni i mroźni z atestem Sanepid. Zakres −20°C do +20°C, rejestrator temperatur, szybkie podstawienie w całej Polsce.",
    ogImageAlt: "Wynajem samochodów chłodni i mroźni – Iglo-Bus Rent",
    ogLocale: "pl_PL",
    breadcrumbHome: "Strona główna",
    localBusinessDescription:
      "Wynajem samochodów chłodni i mroźni z atestem Sanepid. Krótko i długoterminowo, szybka dostawa w całej Polsce.",
    products: [
      {
        name: "Toyota ProAce City – samochód chłodniczy (S)",
        description: "Wynajem samochodu chłodniczego ProAce City. Wymiary 175×109×104 cm, zakres −20°C do +20°C.",
      },
      {
        name: "Toyota ProAce – samochód chłodniczy (M)",
        description: "Wynajem samochodu chłodniczego ProAce. Wymiary 238×125×113 cm, zakres −20°C do +20°C.",
      },
      {
        name: "Toyota ProAce Maxi – samochód chłodniczy (L)",
        description: "Wynajem samochodu chłodniczego ProAce Maxi. Wymiary 333×157×173 cm, zakres −20°C do +20°C.",
      },
    ],
  },
  header: {
    tagline: "Wynajem chłodni i mroźni • PL",
    navFleet: "Flota i cennik",
    navHow: "Jak to działa",
    navFaq: "FAQ",
    knowledgeBase: "Baza wiedzy",
    kbFreezer: "🧊 Wynajem mroźni",
    kbFridge: "❄️ Wynajem chłodni",
    kbRequirements: "📋 Wymagania auto chłodnia",
    kbEquipment: "🔧 Wyposażenie",
    blog: "Blog",
    callAria: "Zadzwoń do Iglo-Bus Rent",
    menuOpenAria: "Otwórz menu",
    menuCloseAria: "Zamknij menu",
    mobileCall: "Zadzwoń",
    mobilePricing: "Cennik",
    mobilePricingAria: "Sprawdź ceny i dostępność",
  },
  hero: {
    h1Prefix: "Wynajem samochodów ",
    h1Highlight: "chłodni i mroźni",
    h1Sub: "−20°C do +20°C • Atest Sanepid • Dostawa w całej Polsce",
    paragraphPre: "Flota Toyota ProAce w 3 rozmiarach (S / M / L). Rejestracja temperatury, stabilna praca 24/7, opcjonalne podtrzymanie ",
    paragraphHighlight: "230V",
    paragraphPost: ".",
    featureTemp: "−20°C do +20°C",
    featureCert: "Atest Sanepid",
    featureDelivery: "Dostawa PL",
    ctaCallAria: "Zadzwoń do Iglo-Bus Rent",
    ctaCallLabel: "Zadzwoń: +48 530 410 504",
    ctaPricing: "Sprawdź ceny i dostępność",
    ctaEmailAria: "Napisz e-mail do Iglo-Bus Rent",
    ctaEmailLabel: "Napisz e-mail",
    footerLine: "230V (opcja) • FV VAT • B2B/B2C",
    contactTitle: "Kontakt",
    phoneLabel: "Telefon",
    emailLabel: "E-mail",
    contactHint: "Podaj: termin, miasto/trasę i temperaturę — odeślemy wycenę.",
  },
  fleet: {
    title: "Flota i cennik",
    intro: "Ceny netto. Rezerwacja niewiążąca — potwierdzimy dostępność i stawkę e-mailem.",
    introDesktopExtra: " Płatność wyłącznie kartą.",
    introMobile: "Płatność wyłącznie kartą.",
    sizeAriaPrefix: "Pokaż rozmiar",
    mobileHint: "Tip: dotknij zdjęcia, żeby otworzyć galerię.",
  },
  vehicleCard: {
    openGalleryAriaPrefix: "Otwórz galerię zdjęć",
    photoAriaPrefix: "Zdjęcie",
    photosSuffix: "zdjęć",
    tablePeriod: "Okres",
    tablePrice: "Cena / doba",
    defaultDescription:
      "Zakres temperatur (−20°C do +20°C), rejestrator temperatur, agregat z podtrzymaniem 230V (opcja), kamera cofania, Android Auto, assistance na terenie EU. Kaucja zwrotna wg umowy.",
  },
  vehicleSpec: {
    loadCapacity: "ładowność",
    grossWeight: "DMC",
    internal: "wewn.",
    external: "zewn.",
    length: "dł.",
    width: "szer.",
    height: "wys.",
    dimensionsNote: "wymiary w cm",
    deposit: "Kaucja",
  },
  booking: {
    dateFromLabel: "Data od",
    dateToLabel: "Data do",
    chooseDate: "Wybierz datę",
    calcTitle: "Kalkulator wynajmu",
    calcDaysLabel: "Liczba dni:",
    calcRateLabel: "Stawka (tier: {tier}):",
    calcTotalLabel: "Szacowany koszt:",
    calcNet: "netto",
    calcNote: "* Kalkulacja orientacyjna. Ostateczną stawkę potwierdzimy e-mailem po sprawdzeniu dostępności.",
    emailLabel: "Twój e‑mail",
    emailPlaceholder: "jan.kowalski@firma.pl",
    notesLabel: "Uwagi (opcjonalnie)",
    notesPlaceholder: "np. Wskaż adres dostawy (sprawdź FAQ)",
    submitIdle: "Wyślij zapytanie",
    submitLoading: "Wysyłanie...",
    submitNotePrefix: "Zapytanie trafi na",
    dayOne: "dzień",
    dayFew: "dni",
    dayMany: "dni",
    perDaySuffix: "zł/doba",
    toastErrorTitle: "Błąd",
    toastSendErrorTitle: "Błąd wysyłania",
    toastMissingFields: "Proszę wypełnić wszystkie wymagane pola.",
    toastPastDate: "Data rozpoczęcia nie może być w przeszłości.",
    toastEndBeforeStart: "Data zakończenia musi być późniejsza niż data rozpoczęcia.",
    toastInvalidEmail: "Proszę podać prawidłowy adres e-mail.",
    toastGenericError: "Nie udało się wysłać zapytania. Spróbuj ponownie lub zadzwoń: +48 530 410 504",
    toastRelayError: "Problem z konfiguracją email. Prosimy dzwonić: +48 530 410 504",
    toastFormError: "Błąd w formularzu. Sprawdź wszystkie pola i spróbuj ponownie.",
    toastAuthError: "Problem z autoryzacją email. Prosimy dzwonić: +48 530 410 504",
    toastSuccessTitle: "Zapytanie wysłane!",
    toastSuccessDesc: "Dziękujemy za zapytanie o rezerwację. Odpowiemy w ciągu kilku godzin.",
  },
  howItWorks: {
    title: "Jak to działa",
    steps: [
      { title: "Zapytanie", description: "Wybierz grupę, daty i wyślij zapytanie. Potwierdzimy dostępność e‑mailem." },
      { title: "Formalności", description: "Umowa, kaucja i odbiór auta. Wystawiamy FV VAT, obsługujemy B2B." },
      { title: "Odbiór", description: "Przegląd wyposażenia, ustawienie temperatury, instruktaż zasilania 230V." },
    ],
  },
  faq: {
    title: "FAQ",
    items: [
      {
        question: "Czy są limity kilometrów?",
        answer: "Standardowo limit wynosi 300km na dobę. Ważne, że przy dłuższym najmie, limity dzienne podlegają sumowaniu tj. w 10 dni możesz przejechać nawet 3000km w ramach umowy.",
      },
      {
        question: "Czy auto utrzyma -20°C na postoju?",
        answer: "Tak, pojazdy mają agregat z podtrzymaniem z gniazda 230V. Zakres pracy: -20°C do +20°C w zależności od ładunku i warunków.",
      },
      {
        question: "Co z serwisem w trakcie najmu?",
        answer: "Zapewniamy assistance i samochód zastępczy zgodnie z umową i dostępnością.",
      },
      {
        question: "Jakie dokumenty są potrzebne?",
        answer: "Prawo jazdy kat. B, dowód osobisty i aplikacja mobywatel dla potwierdzenia tożsamości. Szczegóły przy rezerwacji.",
      },
      {
        question: "Co można wozić, a czego nie?",
        answer: "Możesz wozić wszystkie towary wymagające kontrolowanej temperatury OPRÓCZ świeżych lub wędzonych ryb, kiszonek, innych ładunków pozostawiających itensywny zapach lub mogących uszkodzić zabudowę (np. słona woda).",
      },
      {
        question: "Jak wnieść kaucję?",
        answer: "Kaucję wpłacasz kartą. Proponujemy preautoryzację karty kredytowej, dzięki czemu nie blokujesz swoich środków potrzebnych do prowadzenia działalności. Kaucja zwracana jest po bezproblemowym zakończeniu wynajmu, zwykle w przeciągu 1-3 dni.",
      },
      {
        question: "Gdzie mogę odebrać i zwrócić samochód?",
        answer:
          "Standardowo odbiór oraz zwrot samochodu odbywa się w siedzibie wypożyczalni – Gliwicka 15b, Przyszowice.\n\nWynajmujesz na miesiąc? Dostarczymy go blisko Ciebie bez dodatkowych kosztów.\n\nPotrzebujesz samochodu pilnie (<48h)? Nasi kierowcy przywiozą go, doliczając 5 zł/km do kwoty wynajmu.",
      },
    ],
  },
  footer: {
    tagline: "Profesjonalna wypożyczalnia samochodów chłodniczych i mroźni na terenie Polski.",
    contactTitle: "Kontakt",
    emailLabel: "E-mail",
    phoneLabel: "Telefon",
    addressLabel: "Adres",
    address: "Gliwicka 15b, 44-178 Przyszowice",
    mapTooltip: "Otwórz w Google Maps",
    servicesTitle: "Usługi",
    service1: "Wynajem aut chłodniczych",
    service2: "Transport produktów mrożonych",
    service3: "Obsługa B2B z fakturą VAT",
    blog: "Blog",
    praca: "Praca",
    privacy: "Polityka Prywatności",
    contactRodo: "Kontakt RODO",
    copyright: "© 2024 Iglo-bus.rent. Wszystkie prawa zastrzeżone.",
  },
  cookies: {
    title: "Używamy plików cookie",
    text: "Ta strona używa plików cookie niezbędnych do jej funkcjonowania oraz analitycznych do poprawy jakości usług. Kontynuując korzystanie ze strony, wyrażasz zgodę na wykorzystanie plików cookie zgodnie z naszą",
    linkText: "polityką prywatności",
    decline: "Odrzuć",
    accept: "Akceptuj",
  },
  vehicles: {
    city: {
      title: "Toyota ProAce City (S)",
      group: "Grupa S",
      alt: "Toyota ProAce City - kompaktowy samochód chłodniczy",
      gallery: [
        { alt: "Toyota ProAce City z agregatem chłodniczym", title: "ProAce City - pojazd z systemem chłodniczym" },
        { alt: "Toyota ProAce City - wnętrze chłodni z agregatem", title: "ProAce City - wnętrze z systemem Zanotti" },
        { alt: "Toyota ProAce City - wymiary wewnętrzne", title: "ProAce City - wymiary zabudowy" },
      ],
      periods: ["1–3 doby", "4–7 dób", "8–14 dób", "15–29 dób", "30+ dni (miesięcznie)"],
    },
    proace: {
      title: "Toyota ProAce (M)",
      group: "Grupa M",
      alt: "Toyota ProAce - średni samochód chłodniczy",
      gallery: [
        { alt: "Toyota ProAce z otwartymi drzwiami bocznymi", title: "ProAce - dostęp do ładowni" },
        { alt: "Toyota ProAce - wnętrze chłodni z podłogą aluminiową", title: "ProAce - wnętrze z systemem chłodniczym" },
        { alt: "Toyota ProAce - wymiary wewnętrzne", title: "ProAce - specyfikacja wymiarów" },
      ],
      periods: ["1–3 doby", "4–7 dób", "8–14 dób", "15–29 dób", "30+ dni (miesięcznie)"],
    },
    maxi: {
      title: "Toyota ProAce Maxi (L)",
      group: "Grupa L",
      alt: "Toyota ProAce Maxi - duży samochód chłodniczy",
      gallery: [
        { alt: "Toyota ProAce Maxi - nowy model", title: "ProAce Maxi - model 2024" },
        { alt: "Toyota ProAce Maxi - wnętrze chłodni", title: "ProAce Maxi - wnętrze chłodni" },
        { alt: "Toyota ProAce Maxi - wymiary techniczne", title: "ProAce Maxi - wymiary i specyfikacja" },
      ],
      periods: ["1–3 doby", "4–7 dób", "8–14 dób", "15–29 dób", "30+ dni (miesięcznie)"],
    },
  },
};

const en: Dictionary = {
  currency: "PLN",
  meta: {
    title: "Refrigerated & Freezer Van Rental – Poland | Iglo-Bus Rent",
    description:
      "Rent refrigerated and freezer vans certified by Sanepid. Range −20°C to +20°C, temperature logger, fast delivery across Poland.",
    ogImageAlt: "Refrigerated & freezer van rental – Iglo-Bus Rent",
    ogLocale: "en_US",
    breadcrumbHome: "Home",
    localBusinessDescription:
      "Rental of refrigerated and freezer vehicles certified by Sanepid. Short and long term, fast delivery across Poland.",
    products: [
      {
        name: "Toyota ProAce City – refrigerated van (S)",
        description: "Rental of the ProAce City refrigerated van. Dimensions 175×109×104 cm, range −20°C to +20°C.",
      },
      {
        name: "Toyota ProAce – refrigerated van (M)",
        description: "Rental of the ProAce refrigerated van. Dimensions 238×125×113 cm, range −20°C to +20°C.",
      },
      {
        name: "Toyota ProAce Maxi – refrigerated van (L)",
        description: "Rental of the ProAce Maxi refrigerated van. Dimensions 333×157×173 cm, range −20°C to +20°C.",
      },
    ],
  },
  header: {
    tagline: "Refrigerated & freezer van rental • PL",
    navFleet: "Fleet & pricing",
    navHow: "How it works",
    navFaq: "FAQ",
    knowledgeBase: "Knowledge base",
    kbFreezer: "🧊 Freezer van rental",
    kbFridge: "❄️ Refrigerated van rental",
    kbRequirements: "📋 Refrigerated van requirements",
    kbEquipment: "🔧 Equipment",
    blog: "Blog",
    callAria: "Call Iglo-Bus Rent",
    menuOpenAria: "Open menu",
    menuCloseAria: "Close menu",
    mobileCall: "Call",
    mobilePricing: "Pricing",
    mobilePricingAria: "Check prices and availability",
  },
  hero: {
    h1Prefix: "Rental of ",
    h1Highlight: "refrigerated & freezer vans",
    h1Sub: "−20°C to +20°C • Sanepid certified • Delivery across Poland",
    paragraphPre: "A fleet of Toyota ProAce vans in 3 sizes (S / M / L). Temperature logging, stable 24/7 operation, optional ",
    paragraphHighlight: "230V",
    paragraphPost: " mains backup.",
    featureTemp: "−20°C to +20°C",
    featureCert: "Sanepid certified",
    featureDelivery: "Delivery in Poland",
    ctaCallAria: "Call Iglo-Bus Rent",
    ctaCallLabel: "Call: +48 530 410 504",
    ctaPricing: "Check prices and availability",
    ctaEmailAria: "E-mail Iglo-Bus Rent",
    ctaEmailLabel: "Send an e-mail",
    footerLine: "230V (optional) • VAT invoice • B2B/B2C",
    contactTitle: "Contact",
    phoneLabel: "Phone",
    emailLabel: "E-mail",
    contactHint: "Tell us the dates, city/route and temperature — we'll send you a quote.",
  },
  fleet: {
    title: "Fleet & pricing",
    intro: "Net prices. Non-binding reservation — we'll confirm availability and the rate by e-mail.",
    introDesktopExtra: " Card payment only.",
    introMobile: "Card payment only.",
    sizeAriaPrefix: "Show size",
    mobileHint: "Tip: tap a photo to open the gallery.",
  },
  vehicleCard: {
    openGalleryAriaPrefix: "Open photo gallery",
    photoAriaPrefix: "Photo",
    photosSuffix: "photos",
    tablePeriod: "Period",
    tablePrice: "Price / day",
    defaultDescription:
      "Temperature range (−20°C to +20°C), temperature logger, cooling unit with 230V mains backup (optional), reversing camera, Android Auto, EU-wide assistance. Deposit refundable per contract.",
  },
  vehicleSpec: {
    loadCapacity: "payload",
    grossWeight: "GVW",
    internal: "int.",
    external: "ext.",
    length: "L",
    width: "W",
    height: "H",
    dimensionsNote: "dimensions in cm",
    deposit: "Deposit",
  },
  booking: {
    dateFromLabel: "Date from",
    dateToLabel: "Date to",
    chooseDate: "Select a date",
    calcTitle: "Rental calculator",
    calcDaysLabel: "Number of days:",
    calcRateLabel: "Rate (tier: {tier}):",
    calcTotalLabel: "Estimated cost:",
    calcNet: "net",
    calcNote: "* Estimate only. We'll confirm the final rate by e-mail after checking availability.",
    emailLabel: "Your e-mail",
    emailPlaceholder: "john.smith@company.com",
    notesLabel: "Notes (optional)",
    notesPlaceholder: "e.g. delivery address (see FAQ)",
    submitIdle: "Send inquiry",
    submitLoading: "Sending...",
    submitNotePrefix: "Your inquiry will be sent to",
    dayOne: "day",
    dayFew: "days",
    dayMany: "days",
    perDaySuffix: "PLN/day",
    toastErrorTitle: "Error",
    toastSendErrorTitle: "Sending error",
    toastMissingFields: "Please fill in all required fields.",
    toastPastDate: "The start date cannot be in the past.",
    toastEndBeforeStart: "The end date must be later than the start date.",
    toastInvalidEmail: "Please provide a valid e-mail address.",
    toastGenericError: "Failed to send the inquiry. Please try again or call: +48 530 410 504",
    toastRelayError: "There is a problem with the e-mail configuration. Please call: +48 530 410 504",
    toastFormError: "There is an error in the form. Check all fields and try again.",
    toastAuthError: "There is a problem with e-mail authorization. Please call: +48 530 410 504",
    toastSuccessTitle: "Inquiry sent!",
    toastSuccessDesc: "Thank you for your booking inquiry. We'll reply within a few hours.",
  },
  howItWorks: {
    title: "How it works",
    steps: [
      { title: "Inquiry", description: "Choose a group and dates, then send an inquiry. We'll confirm availability by e-mail." },
      { title: "Paperwork", description: "Contract, deposit and vehicle pickup. We issue VAT invoices and work with businesses (B2B)." },
      { title: "Pickup", description: "Equipment check, temperature setup, and a briefing on the 230V mains backup." },
    ],
  },
  faq: {
    title: "FAQ",
    items: [
      {
        question: "Is there a mileage limit?",
        answer: "The standard limit is 300 km per day. Importantly, for longer rentals the daily limits add up — e.g. over 10 days you can drive up to 3,000 km under the contract.",
      },
      {
        question: "Will the vehicle hold -20°C while parked?",
        answer: "Yes, the vehicles have a cooling unit that can run on 230V mains power. Operating range: -20°C to +20°C depending on load and conditions.",
      },
      {
        question: "What about servicing during the rental?",
        answer: "We provide assistance and a replacement vehicle in line with the contract and availability.",
      },
      {
        question: "What documents are required?",
        answer: "A category B driving licence, an ID card, and the mObywatel app for identity verification. Details are confirmed at booking.",
      },
      {
        question: "What can and can't be transported?",
        answer: "You can transport any goods requiring controlled temperature EXCEPT fresh or smoked fish, pickled/fermented foods, and other loads that leave a strong odour or could damage the body (e.g. salt water).",
      },
      {
        question: "How do I pay the deposit?",
        answer: "The deposit is paid by card. We recommend a credit card pre-authorization, so your own funds needed for running your business aren't tied up. The deposit is refunded once the rental ends without issues, usually within 1–3 days.",
      },
      {
        question: "Where can I pick up and return the vehicle?",
        answer:
          "Pickup and return normally take place at our office – Gliwicka 15b, Przyszowice, Poland.\n\nRenting for a month? We'll deliver it close to you at no extra cost.\n\nNeed the vehicle urgently (<48h)? Our drivers can bring it to you for an extra 5 PLN/km added to the rental cost.",
      },
    ],
  },
  footer: {
    tagline: "Professional rental of refrigerated and freezer vehicles across Poland.",
    contactTitle: "Contact",
    emailLabel: "E-mail",
    phoneLabel: "Phone",
    addressLabel: "Address",
    address: "Gliwicka 15b, 44-178 Przyszowice, Poland",
    mapTooltip: "Open in Google Maps",
    servicesTitle: "Services",
    service1: "Refrigerated vehicle rental",
    service2: "Frozen goods transport",
    service3: "B2B service with VAT invoice",
    blog: "Blog",
    praca: "Careers",
    privacy: "Privacy Policy",
    contactRodo: "GDPR Contact",
    copyright: "© 2024 Iglo-bus.rent. All rights reserved.",
  },
  cookies: {
    title: "We use cookies",
    text: "This site uses cookies necessary for it to function, as well as analytics cookies to improve service quality. By continuing to use the site, you agree to the use of cookies in accordance with our",
    linkText: "privacy policy",
    decline: "Decline",
    accept: "Accept",
  },
  vehicles: {
    city: {
      title: "Toyota ProAce City (S)",
      group: "Group S",
      alt: "Toyota ProAce City - compact refrigerated van",
      gallery: [
        { alt: "Toyota ProAce City with cooling unit", title: "ProAce City - vehicle with cooling system" },
        { alt: "Toyota ProAce City - inside the cargo box with cooling unit", title: "ProAce City - interior with Zanotti system" },
        { alt: "Toyota ProAce City - internal dimensions", title: "ProAce City - cargo box dimensions" },
      ],
      periods: ["1–3 days", "4–7 days", "8–14 days", "15–29 days", "30+ days (monthly)"],
    },
    proace: {
      title: "Toyota ProAce (M)",
      group: "Group M",
      alt: "Toyota ProAce - mid-size refrigerated van",
      gallery: [
        { alt: "Toyota ProAce with side doors open", title: "ProAce - access to the cargo box" },
        { alt: "Toyota ProAce - inside the cargo box with aluminium floor", title: "ProAce - interior with cooling system" },
        { alt: "Toyota ProAce - internal dimensions", title: "ProAce - dimension specification" },
      ],
      periods: ["1–3 days", "4–7 days", "8–14 days", "15–29 days", "30+ days (monthly)"],
    },
    maxi: {
      title: "Toyota ProAce Maxi (L)",
      group: "Group L",
      alt: "Toyota ProAce Maxi - large refrigerated van",
      gallery: [
        { alt: "Toyota ProAce Maxi - new model", title: "ProAce Maxi - 2024 model" },
        { alt: "Toyota ProAce Maxi - inside the cargo box", title: "ProAce Maxi - cargo box interior" },
        { alt: "Toyota ProAce Maxi - technical dimensions", title: "ProAce Maxi - dimensions and specification" },
      ],
      periods: ["1–3 days", "4–7 days", "8–14 days", "15–29 days", "30+ days (monthly)"],
    },
  },
};

const cs: Dictionary = {
  currency: "PLN",
  meta: {
    title: "Pronájem chladicích a mrazicích vozidel – Polsko | Iglo-Bus Rent",
    description:
      "Pronájem chladicích a mrazicích vozidel s atestem Sanepid. Rozsah −20 °C až +20 °C, záznamník teploty, rychlé přistavení po celém Polsku.",
    ogImageAlt: "Pronájem chladicích a mrazicích vozidel – Iglo-Bus Rent",
    ogLocale: "cs_CZ",
    breadcrumbHome: "Domů",
    localBusinessDescription:
      "Pronájem chladicích a mrazicích vozidel s atestem Sanepid. Krátkodobě i dlouhodobě, rychlé dodání po celém Polsku.",
    products: [
      {
        name: "Toyota ProAce City – chladicí vozidlo (S)",
        description: "Pronájem chladicího vozidla ProAce City. Rozměry 175×109×104 cm, rozsah −20 °C až +20 °C.",
      },
      {
        name: "Toyota ProAce – chladicí vozidlo (M)",
        description: "Pronájem chladicího vozidla ProAce. Rozměry 238×125×113 cm, rozsah −20 °C až +20 °C.",
      },
      {
        name: "Toyota ProAce Maxi – chladicí vozidlo (L)",
        description: "Pronájem chladicího vozidla ProAce Maxi. Rozměry 333×157×173 cm, rozsah −20 °C až +20 °C.",
      },
    ],
  },
  header: {
    tagline: "Pronájem chladicích a mrazicích vozidel • PL",
    navFleet: "Vozový park a ceník",
    navHow: "Jak to funguje",
    navFaq: "FAQ",
    knowledgeBase: "Databáze znalostí",
    kbFreezer: "🧊 Pronájem mrazicích vozidel",
    kbFridge: "❄️ Pronájem chladicích vozidel",
    kbRequirements: "📋 Požadavky na chladicí vozidlo",
    kbEquipment: "🔧 Vybavení",
    blog: "Blog",
    callAria: "Zavolejte Iglo-Bus Rent",
    menuOpenAria: "Otevřít menu",
    menuCloseAria: "Zavřít menu",
    mobileCall: "Zavolat",
    mobilePricing: "Ceník",
    mobilePricingAria: "Zkontrolovat ceny a dostupnost",
  },
  hero: {
    h1Prefix: "Pronájem ",
    h1Highlight: "chladicích a mrazicích vozidel",
    h1Sub: "−20 °C až +20 °C • Atest Sanepid • Doprava po celém Polsku",
    paragraphPre: "Vozový park Toyota ProAce ve 3 velikostech (S / M / L). Záznam teploty, stabilní provoz 24/7, volitelné napájení ",
    paragraphHighlight: "230V",
    paragraphPost: ".",
    featureTemp: "−20 °C až +20 °C",
    featureCert: "Atest Sanepid",
    featureDelivery: "Doprava po PL",
    ctaCallAria: "Zavolejte Iglo-Bus Rent",
    ctaCallLabel: "Zavolat: +48 530 410 504",
    ctaPricing: "Zkontrolovat ceny a dostupnost",
    ctaEmailAria: "Napište e-mail Iglo-Bus Rent",
    ctaEmailLabel: "Napsat e-mail",
    footerLine: "230V (volitelně) • Faktura s DPH • B2B/B2C",
    contactTitle: "Kontakt",
    phoneLabel: "Telefon",
    emailLabel: "E-mail",
    contactHint: "Napište nám termín, město/trasu a teplotu — pošleme vám nabídku.",
  },
  fleet: {
    title: "Vozový park a ceník",
    intro: "Ceny bez DPH. Nezávazná rezervace — dostupnost a cenu potvrdíme e-mailem.",
    introDesktopExtra: " Platba pouze kartou.",
    introMobile: "Platba pouze kartou.",
    sizeAriaPrefix: "Zobrazit velikost",
    mobileHint: "Tip: klepnutím na fotku otevřete galerii.",
  },
  vehicleCard: {
    openGalleryAriaPrefix: "Otevřít fotogalerii",
    photoAriaPrefix: "Fotka",
    photosSuffix: "fotek",
    tablePeriod: "Období",
    tablePrice: "Cena / den",
    defaultDescription:
      "Teplotní rozsah (−20 °C až +20 °C), záznamník teploty, agregát s napájením 230V (volitelně), couvací kamera, Android Auto, asistenční služba v rámci EU. Kauce se vrací dle smlouvy.",
  },
  vehicleSpec: {
    loadCapacity: "nosnost",
    grossWeight: "Hmotnost",
    internal: "vnitř.",
    external: "vnější",
    length: "dl.",
    width: "šíř.",
    height: "výš.",
    dimensionsNote: "rozměry v cm",
    deposit: "Kauce",
  },
  booking: {
    dateFromLabel: "Datum od",
    dateToLabel: "Datum do",
    chooseDate: "Vyberte datum",
    calcTitle: "Kalkulačka pronájmu",
    calcDaysLabel: "Počet dní:",
    calcRateLabel: "Sazba (tarif: {tier}):",
    calcTotalLabel: "Odhadovaná cena:",
    calcNet: "bez DPH",
    calcNote: "* Orientační výpočet. Konečnou sazbu potvrdíme e-mailem po ověření dostupnosti.",
    emailLabel: "Váš e-mail",
    emailPlaceholder: "jan.novak@firma.cz",
    notesLabel: "Poznámky (volitelné)",
    notesPlaceholder: "např. adresa dodání (viz FAQ)",
    submitIdle: "Odeslat poptávku",
    submitLoading: "Odesílání...",
    submitNotePrefix: "Poptávka bude odeslána na",
    dayOne: "den",
    dayFew: "dny",
    dayMany: "dní",
    perDaySuffix: "PLN/den",
    toastErrorTitle: "Chyba",
    toastSendErrorTitle: "Chyba při odesílání",
    toastMissingFields: "Vyplňte prosím všechna povinná pole.",
    toastPastDate: "Datum zahájení nemůže být v minulosti.",
    toastEndBeforeStart: "Datum ukončení musí být pozdější než datum zahájení.",
    toastInvalidEmail: "Zadejte prosím platnou e-mailovou adresu.",
    toastGenericError: "Nepodařilo se odeslat poptávku. Zkuste to prosím znovu nebo zavolejte: +48 530 410 504",
    toastRelayError: "Problém s konfigurací e-mailu. Zavolejte prosím: +48 530 410 504",
    toastFormError: "Chyba ve formuláři. Zkontrolujte všechna pole a zkuste to znovu.",
    toastAuthError: "Problém s autorizací e-mailu. Zavolejte prosím: +48 530 410 504",
    toastSuccessTitle: "Poptávka odeslána!",
    toastSuccessDesc: "Děkujeme za poptávku rezervace. Odpovíme do několika hodin.",
  },
  howItWorks: {
    title: "Jak to funguje",
    steps: [
      { title: "Poptávka", description: "Vyberte skupinu a termín a odešlete poptávku. Dostupnost potvrdíme e-mailem." },
      { title: "Formality", description: "Smlouva, kauce a převzetí vozidla. Vystavujeme faktury s DPH, spolupracujeme s firmami (B2B)." },
      { title: "Převzetí", description: "Kontrola vybavení, nastavení teploty a zaškolení v napájení 230V." },
    ],
  },
  faq: {
    title: "FAQ",
    items: [
      {
        question: "Existuje limit najetých kilometrů?",
        answer: "Standardní limit je 300 km na den. Důležité je, že u delšího pronájmu se denní limity sčítají — např. za 10 dní můžete v rámci smlouvy najet až 3 000 km.",
      },
      {
        question: "Udrží vozidlo -20 °C i při stání?",
        answer: "Ano, vozidla mají agregát s možností napájení ze zásuvky 230V. Provozní rozsah: -20 °C až +20 °C v závislosti na nákladu a podmínkách.",
      },
      {
        question: "Co servis během pronájmu?",
        answer: "Zajišťujeme asistenční službu a náhradní vozidlo dle smlouvy a dostupnosti.",
      },
      {
        question: "Jaké doklady jsou potřeba?",
        answer: "Řidičský průkaz sk. B, občanský průkaz a aplikace mObywatel k ověření totožnosti. Podrobnosti upřesníme při rezervaci.",
      },
      {
        question: "Co lze a co nelze převážet?",
        answer: "Můžete převážet veškeré zboží vyžadující řízenou teplotu KROMĚ čerstvých nebo uzených ryb, kvašených/nakládaných potravin a jiných nákladů zanechávajících intenzivní zápach nebo mohoucích poškodit nástavbu (např. slaná voda).",
      },
      {
        question: "Jak uhradit kauci?",
        answer: "Kauce se hradí kartou. Doporučujeme preautorizaci kreditní karty, díky čemuž nezablokujete vlastní prostředky potřebné k podnikání. Kauce se vrací po bezproblémovém ukončení pronájmu, obvykle do 1–3 dnů.",
      },
      {
        question: "Kde si mohu vozidlo vyzvednout a vrátit?",
        answer:
          "Standardně probíhá převzetí i vrácení vozidla v sídle půjčovny – Gliwicka 15b, Przyszowice, Polsko.\n\nPronajímáte na měsíc? Dovezeme vozidlo k vám bez dalších nákladů.\n\nPotřebujete vozidlo urgentně (<48h)? Naši řidiči jej přivezou za příplatek 5 PLN/km k ceně pronájmu.",
      },
    ],
  },
  footer: {
    tagline: "Profesionální půjčovna chladicích a mrazicích vozidel na území Polska.",
    contactTitle: "Kontakt",
    emailLabel: "E-mail",
    phoneLabel: "Telefon",
    addressLabel: "Adresa",
    address: "Gliwicka 15b, 44-178 Przyszowice, Polsko",
    mapTooltip: "Otevřít v Google Maps",
    servicesTitle: "Služby",
    service1: "Pronájem chladicích vozidel",
    service2: "Přeprava mražených výrobků",
    service3: "B2B služby s fakturou DPH",
    blog: "Blog",
    praca: "Kariéra",
    privacy: "Zásady ochrany osobních údajů",
    contactRodo: "Kontakt GDPR",
    copyright: "© 2024 Iglo-bus.rent. Všechna práva vyhrazena.",
  },
  cookies: {
    title: "Používáme soubory cookie",
    text: "Tyto stránky používají soubory cookie nezbytné pro jejich fungování a analytické soubory cookie ke zlepšení kvality služeb. Pokračováním v používání stránek souhlasíte s používáním souborů cookie v souladu s našimi",
    linkText: "zásadami ochrany osobních údajů",
    decline: "Odmítnout",
    accept: "Přijmout",
  },
  vehicles: {
    city: {
      title: "Toyota ProAce City (S)",
      group: "Skupina S",
      alt: "Toyota ProAce City - kompaktní chladicí vozidlo",
      gallery: [
        { alt: "Toyota ProAce City s chladicím agregátem", title: "ProAce City - vozidlo s chladicím systémem" },
        { alt: "Toyota ProAce City - interiér s agregátem", title: "ProAce City - interiér se systémem Zanotti" },
        { alt: "Toyota ProAce City - vnitřní rozměry", title: "ProAce City - rozměry nástavby" },
      ],
      periods: ["1–3 dny", "4–7 dní", "8–14 dní", "15–29 dní", "30+ dní (měsíčně)"],
    },
    proace: {
      title: "Toyota ProAce (M)",
      group: "Skupina M",
      alt: "Toyota ProAce - střední chladicí vozidlo",
      gallery: [
        { alt: "Toyota ProAce s otevřenými bočními dveřmi", title: "ProAce - přístup do nákladového prostoru" },
        { alt: "Toyota ProAce - interiér s hliníkovou podlahou", title: "ProAce - interiér s chladicím systémem" },
        { alt: "Toyota ProAce - vnitřní rozměry", title: "ProAce - specifikace rozměrů" },
      ],
      periods: ["1–3 dny", "4–7 dní", "8–14 dní", "15–29 dní", "30+ dní (měsíčně)"],
    },
    maxi: {
      title: "Toyota ProAce Maxi (L)",
      group: "Skupina L",
      alt: "Toyota ProAce Maxi - velké chladicí vozidlo",
      gallery: [
        { alt: "Toyota ProAce Maxi - nový model", title: "ProAce Maxi - model 2024" },
        { alt: "Toyota ProAce Maxi - interiér", title: "ProAce Maxi - interiér nástavby" },
        { alt: "Toyota ProAce Maxi - technické rozměry", title: "ProAce Maxi - rozměry a specifikace" },
      ],
      periods: ["1–3 dny", "4–7 dní", "8–14 dní", "15–29 dní", "30+ dní (měsíčně)"],
    },
  },
};

export const dictionaries: Record<Lang, Dictionary> = { pl, en, cs };

export function formatDayCount(days: number, lang: Lang): string {
  const t = dictionaries[lang];
  if (lang === "cs") {
    if (days === 1) return `${days} ${t.booking.dayOne}`;
    if (days >= 2 && days <= 4) return `${days} ${t.booking.dayFew}`;
    return `${days} ${t.booking.dayMany}`;
  }
  if (days === 1) return `${days} ${t.booking.dayOne}`;
  return `${days} ${t.booking.dayFew}`;
}
