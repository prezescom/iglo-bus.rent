import { useMemo, useRef, useState } from "react";
import VehicleCard from "./vehicle-card";
import { useLanguage } from "@/lib/i18n/use-language";
import type { VehicleId } from "@/lib/i18n/translations";

// Vehicle images served statically for Vercel deployment
const proAceCityImg = "/images/ProAce City 1_1755593677474.JPG";
const proAceImg = "/images/ProAce 1_1755593677473.JPG";
const proAceMaxiImg = "/images/ProAce Maxi 1_1755593677475.JPG";

// ProAce City gallery images
const proAceCityNew = "/images/ProAce City 1_1755593677474.JPG";
const proAceCityInside = "/images/ProAce City 2_1755593677474.JPG";
const proAceCityTech = "/images/ProAce City 4_1755593677472.jpg";

// ProAce gallery images
const proAceNew = "/images/ProAce 1_1755593677473.JPG";
const proAceInside = "/images/ProAce 2_1755593677473.JPG";
const proAceTech = "/images/ProAce 4_1755593677471.jpg";

// ProAce Maxi gallery images
const proAceMaxiNew = "/images/ProAce Maxi 1_1755593677475.JPG";
const proAceMaxiInside = "/images/ProAce Maxi 2_1755593677475.JPG";
const proAceMaxiTech = "/images/ProAce Maxi 3_1755593677476.JPG";

// Dane niezależne od języka: obrazy, wymiary, wagi, kaucje i same kwoty
// cennika. Teksty (tytuły, opisy zdjęć, etykiety okresów) pochodzą ze
// słownika i18n — patrz vehiclesBase[].id -> dictionaries[lang].vehicles.
const vehiclesBase = [
  {
    id: "city" as VehicleId,
    image: proAceCityImg,
    loadCapacityKg: 685,
    grossWeightKg: 2400,
    dimensionsInternal: { length: 175, width: 109, height: 104 },
    dimensionsExternal: { length: 475, width: 185, height: 211 },
    depositPln: 1000,
    gallerySrc: [proAceCityNew, proAceCityInside, proAceCityTech],
    // Ostatnia stawka (30+ dni) jest wyróżniona w tabeli cennika
    prices: [350, 300, 270, 230, 5500],
  },
  {
    id: "proace" as VehicleId,
    image: proAceImg,
    loadCapacityKg: 950,
    grossWeightKg: 3100,
    dimensionsInternal: { length: 238, width: 125, height: 113 },
    dimensionsExternal: { length: 530, width: 193, height: 218 },
    depositPln: 1500,
    gallerySrc: [proAceNew, proAceInside, proAceTech],
    prices: [400, 350, 320, 280, 6000],
  },
  {
    id: "maxi" as VehicleId,
    image: proAceMaxiImg,
    loadCapacityKg: 1105,
    grossWeightKg: 3500,
    dimensionsInternal: { length: 333, width: 157, height: 173 },
    dimensionsExternal: { length: 600, width: 205, height: 260 },
    depositPln: 2000,
    gallerySrc: [proAceMaxiNew, proAceMaxiInside, proAceMaxiTech],
    prices: [450, 400, 370, 330, 6500],
  },
];

const NUMBER_LOCALE: Record<string, string> = { pl: "pl-PL", en: "en-GB", cs: "cs-CZ" };

export default function FleetSection() {
  const { t, lang } = useLanguage();
  const [active, setActive] = useState<VehicleId>("proace");

  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [flashId, setFlashId] = useState<string | null>(null);

  const vehicles = useMemo(
    () =>
      vehiclesBase.map((base) => {
        const text = t.vehicles[base.id];
        const numberLocale = NUMBER_LOCALE[lang] ?? "pl-PL";
        return {
          id: base.id,
          title: text.title,
          group: text.group,
          image: base.image,
          alt: text.alt,
          loadCapacityKg: base.loadCapacityKg,
          grossWeightKg: base.grossWeightKg,
          dimensionsInternal: base.dimensionsInternal,
          dimensionsExternal: base.dimensionsExternal,
          depositPln: base.depositPln,
          gallery: base.gallerySrc.map((src, i) => ({
            src,
            alt: text.gallery[i].alt,
            title: text.gallery[i].title,
          })),
          pricing: base.prices.map((amount, i) => ({
            period: text.periods[i],
            price: `${amount.toLocaleString(numberLocale)} ${t.currency}`,
            highlighted: i === base.prices.length - 1,
          })),
        };
      }),
    [t, lang]
  );

  type Vehicle = (typeof vehicles)[number];

  // Nazwy modeli (marka) są identyczne w każdym języku — bez tłumaczenia.
  const CHIP_TITLES: Record<VehicleId, string> = {
    city: "ProAce City",
    proace: "ProAce",
    maxi: "ProAce Maxi",
  };

  const chips = useMemo(
    () =>
      vehicles.map((v, i) => ({
        id: v.id,
        label: ["S", "M", "L"][i],
        title: CHIP_TITLES[v.id],
      })),
    [vehicles]
  );

  const scrollToVehicle = (id: Vehicle["id"]) => {
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
        {vehicles.map((vehicle, index) => (
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
    </section>
  );
}
