import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from "@/lib/i18n/use-language";

export default function FaqSection() {
  const { t } = useLanguage();
  const faqs = t.faq.items;

  return (
    <section id="faq" className="mx-auto max-w-6xl px-4 pb-20" data-testid="faq-section">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-brand-dark mb-2">{t.faq.title}</h2>
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
              <AccordionContent className="text-slate-600 text-sm leading-relaxed pb-6 whitespace-pre-line">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
