import { ReactNode } from "react";

type SectionProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  tone?: "white" | "soft";
};

export default function Section({ title, subtitle, children, tone = "white" }: SectionProps) {
  const bg = tone === "soft" ? "bg-slate-50" : "bg-transparent";
  return (
    <section className={`${bg} py-12 md:py-16`}>
      <div className="mx-auto max-w-6xl px-4">
        {(title || subtitle) && (
          <div className="text-center mb-8 md:mb-12">
            {title && <h2 className="text-2xl md:text-3xl font-bold text-brand-dark mb-2">{title}</h2>}
            {subtitle && <p className="text-slate-600 max-w-3xl mx-auto">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
