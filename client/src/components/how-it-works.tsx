export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: "Zapytanie",
      description: "Wybierz grupę, daty i wyślij zapytanie. Potwierdzimy dostępność e‑mailem.",
    },
    {
      number: 2,
      title: "Formalności",
      description: "Umowa, kaucja i odbiór auta. Wystawiamy FV VAT, obsługujemy B2B.",
    },
    {
      number: 3,
      title: "Odbiór",
      description: "Przegląd wyposażenia, ustawienie temperatury, instruktaż zasilania 230V.",
    },
  ];

  return (
    <section id="jak-dziala" className="mx-auto max-w-6xl px-4 pb-16" data-testid="how-it-works-section">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-brand-dark mb-2">Jak to działa</h2>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <div 
            key={step.number}
            className="text-center p-6 rounded-2xl border border-slate-200 bg-white hover:shadow-lg transition-shadow animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
            data-testid={`step-${step.number}`}
          >
            <div className="w-12 h-12 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-brand-blue font-bold text-lg">{step.number}</span>
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
