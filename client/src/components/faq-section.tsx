import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
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
    question: "Co można wozić, a czego nie",
    answer: "Możesz wozić wszystkie towary wymagające kontrolowanej temperatury OPRÓCZ świeżych lub wędzonych ryb, kiszonek, innych ładunków pozostawiających itensywny zapach lub mogących uszkodzić zabudowę (np. słona woda).",
  },
  {
    question: "Kaucja",
    answer: "Kaucję wpłacasz kartą. Proponujemy preautoryzację karty kredytowej, dzięki czemu nie blokujesz swoich środków potrzebnych do prowadzenia działalności. Kaucja zwracana jest po bezproblemowym zakończeniu wynajmu, zwykle w przeciągu 1-3 dni.",
  },
  
];

export default function FaqSection() {
  return (
    <section id="faq" className="mx-auto max-w-6xl px-4 pb-20" data-testid="faq-section">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-brand-dark mb-2">FAQ</h2>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <Accordion type="single" collapsible className="space-y-4" data-testid="faq-accordion">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-white rounded-2xl border border-slate-200 px-6 hover:shadow-lg transition-shadow"
              data-testid={`faq-item-${index}`}
            >
              <AccordionTrigger className="font-bold text-lg text-brand-dark py-6 hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 text-sm leading-relaxed pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
