import { useEffect, useMemo, useRef, useState } from "react";
import VehicleCard from "./vehicle-card";
import { useLanguage } from "@/lib/i18n/use-language";
import type { FleetVehicle } from "@/lib/fleet";

// Import dynamiczny (nie statyczny) celowo — home.tsx (a więc i ten
// komponent) jest częścią głównego, niedzielonego na kawałki bundle'a
// strony, więc statyczny import Firebase/Firestore z fleet.ts wciągnąłby
// cały SDK (~320 kB) do KAŻDEGO wejścia na stronę główną. Dynamiczny
// import trzyma go w osobnym, doładowywanym leniwie fragmencie — tak jak
// już działa dla /blog (zobacz osobny chunk blog-*.js w buildzie).

const NUMBER_LOCALE: Record<string, string> = { pl: "pl-PL", en: "en-GB", cs: "cs-CZ" };

// Wybiera pole per-język z dokumentu floty (titlePl/titleEn/titleCs itd.) —
// dane floty/cennika/opisów są teraz edytowane z panelu (kolekcja Firestore
// fleetVehicles, patrz client/src/lib/fleet.ts), a nie zaszyte w kodzie.
function pickLang(v: FleetVehicle, field: "title" | "group" | "description", lang: string): string {
  const key = `${field}${lang === "en" ? "En" : lang === "cs" ? "Cs" : "Pl"}` as keyof FleetVehicle;
  return (v[key] as string) || (v[`${field}Pl` as keyof FleetVehicle] as string) || "";
}

function pickTierLabel(tier: FleetVehicle["pricingTiers"][number], lang: string): string {
  const key = lang === "en" ? tier.labelEn : lang === "cs" ? tier.labelCs : tier.labelPl;
  return key || tier.labelPl || `${tier.minDays}${tier.maxDays ? `–${tier.maxDays}` : "+"}`;
}

export default function FleetSection() {
  const { t, lang } = useLanguage();
  const [rawVehicles, setRawVehicles] = useState<FleetVehicle[] | null>(null);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    import("@/lib/fleet")
      .then(({ fetchPublishedFleetVehicles }) => fetchPublishedFleetVehicles())
      .then((v) => {
        if (cancelled) return;
        setRawVehicles(v);
        if (v.length) setActive((cur) => cur ?? v[Math.min(1, v.length - 1)].id);
      })
      .catch(() => {
        if (!cancelled) setRawVehicles([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [flashId, setFlashId] = useState<string | null>(null);

  const vehicles = useMemo(() => {
    if (!rawVehicles) return [];
    const numberLocale = NUMBER_LOCALE[lang] ?? "pl-PL";
    return rawVehicles.map((v) => {
      const title = pickLang(v, "title", lang);
      return {
        id: v.id,
        title,
        group: pickLang(v, "group", lang),
        image: v.heroImageUrl,
        alt: title,
        loadCapacityKg: v.loadCapacityKg,
        grossWeightKg: v.grossWeightKg,
        dimensionsInternal: v.dimensionsInternal,
        dimensionsExternal: v.dimensionsExternal,
        depositPln: v.depositPln,
        description: pickLang(v, "description", lang) || undefined,
        gallery: (v.galleryImageUrls || []).map((src, i) => ({
          src,
          alt: `${title} — ${t.vehicleCard.photosSuffix} ${i + 1}`,
          title
        })),
        pricing: (v.pricingTiers || []).map((tier, i, arr) => ({
          period: pickTierLabel(tier, lang),
          price: `${tier.pricePln.toLocaleString(numberLocale)} ${t.currency}`,
          highlighted: i === arr.length - 1
        }))
      };
    });
  }, [rawVehicles, t, lang]);

  type Vehicle = (typeof vehicles)[number];

  const chips = useMemo(
    () => vehicles.map((v, i) => ({ id: v.id, label: ["S", "M", "L"][i] || String(i + 1), title: v.title })),
    [vehicles]
  );

  const scrollToVehicle = (id: string) => {
    setActive(id);

    const el = cardRefs.current[id];
    if (!el) return;

    // delikatne przewinięcie z offsetem (sticky header)
    const top = el.getBoundingClientRect().top + window.scrollY - 90;
    window.scrollTo({ top, behavior: "smooth" });

    // krótkie podświetlenie po scrollu
    setFlashId(id);
    window.setTimeout(() => setFlashId(null), 900);
  };

  return (
    <section id="flota" className="mx-auto max-w-6xl px-4 pb-14 md:pb-16" data-testid="fleet-section">
      {/* nagłówek – krótszy na mobile */}
      <div className="text-center mb-6 md:mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-brand-dark mb-2">{t.fleet.title}</h2>

        <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-3xl mx-auto">
          {t.fleet.intro}
          <span className="hidden md:inline">{t.fleet.introDesktopExtra}</span>
        </p>

        <p className="md:hidden text-xs text-slate-500 mt-2">
          {t.fleet.introMobile}
        </p>
      </div>

      {rawVehicles === null && (
        <p className="text-center text-sm text-slate-500 py-8">{t.fleet.title}…</p>
      )}

      {rawVehicles !== null && vehicles.length > 0 && (
        <>
          {/* MOBILE: sticky wybór rozmiaru (łatwe skakanie po kartach) */}
          <div className="md:hidden sticky top-[64px] z-30 bg-gradient-to-b from-slate-50 to-slate-50/80 backdrop-blur border-y border-slate-200/60 py-3 mb-5">
            <div className="flex items-center justify-center gap-2">
              {chips.map((c) => {
                const isActive = active === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => scrollToVehicle(c.id)}
                    className={[
                      "px-4 py-2 rounded-full text-sm font-semibold border transition-colors",
                      isActive
                        ? "bg-brand-blue text-white border-brand-blue"
                        : "bg-white text-slate-700 border-slate-200 hover:border-brand-blue/40 hover:text-brand-blue",
                    ].join(" ")}
                    aria-label={`${t.fleet.sizeAriaPrefix} ${c.label}: ${c.title}`}
                  >
                    {c.label}
                    <span className="ml-2 font-medium opacity-80">{c.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* karty – mobile 1 kolumna, mniejsze przerwy */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7 lg:gap-8">
            {vehicles.map((vehicle: Vehicle, index: number) => (
              <div
                key={vehicle.id}
                ref={(el) => {
                  cardRefs.current[vehicle.id] = el;
                }}
                className={[
                  "scroll-mt-28", // żeby po kliknięciu chipu nie wjechało pod header
                  flashId === vehicle.id ? "ring-2 ring-brand-blue/60 rounded-2xl" : "",
                ].join(" ")}
              >
                <VehicleCard vehicle={vehicle} delay={index * 0.06} />
              </div>
            ))}
          </div>

          {/* mobile hint (mikrocopy) */}
          <div className="md:hidden mt-6 text-center text-xs text-slate-500">
            {t.fleet.mobileHint}
          </div>
        </>
      )}
    </section>
  );
}
