import { useLanguage } from "@/lib/i18n/use-language";

export default function HowItWorks() {
  const { t } = useLanguage();
  const steps = t.howItWorks.steps;

  return (
    <section id="jak-dziala" className="mx-auto max-w-6xl px-4 pb-16" data-testid="how-it-works-section">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-brand-dark mb-2">{t.howItWorks.title}</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <div
            key={index}
            className="text-center p-6 rounded-2xl border border-slate-200 bg-white hover:shadow-lg transition-shadow animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
            data-testid={`step-${index + 1}`}
          >
            <div className="w-12 h-12 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-brand-blue font-bold text-lg">{index + 1}</span>
            </div>
            <h3 className="font-bold text-lg text-brand-dark mb-3">{step.title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
