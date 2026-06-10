import { useMemo, useRef, useState } from "react";
import VehicleCard from "./vehicle-card";

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

const vehicles = [
  {
    id: "city",
    title: "Toyota ProAce City (S)",
    group: "Grupa S",
    image: proAceCityImg,
    alt: "Toyota ProAce City - kompaktowy samochód chłodniczy",
    capacity:
      "Wymiary wewnętrzne (d/s/w): 175 × 109 × 104 cm · Wymiary zewnętrzne (d/s/w): 475 × 210 × 211 cm · kaucja - 1000zł",
    gallery: [
      { src: proAceCityNew, alt: "Toyota ProAce City z agregatem chłodniczym", title: "ProAce City - pojazd z systemem chłodniczym" },
      { src: proAceCityInside, alt: "Toyota ProAce City - wnętrze chłodni z agregatem", title: "ProAce City - wnętrze z systemem Zanotti" },
      { src: proAceCityTech, alt: "Toyota ProAce City - wymiary wewnętrzne", title: "ProAce City - wymiary zabudowy" },
    ],
    pricing: [
      { period: "1–3 doby", price: "350 zł" },
      { period: "4–7 dób", price: "300 zł" },
      { period: "8–14 dób", price: "270 zł" },
      { period: "15–29 dób", price: "230 zł" },
      { period: "30+ dni (miesięcznie)", price: "5 500 zł", highlighted: true },
    ],
  },
  {
    id: "proace",
    title: "Toyota ProAce (M)",
    group: "Grupa M",
    image: proAceImg,
    alt: "Toyota ProAce - średni samochód chłodniczy",
    capacity:
      "Wymiary wewnętrzne (d/s/w): 238 × 125 × 113 cm · Wymiary zewnętrzne (d/s/w): 530 × 220 × 218 cm · kaucja - 1500zł",
    gallery: [
      { src: proAceNew, alt: "Toyota ProAce z otwartymi drzwiami bocznymi", title: "ProAce - dostęp do ładowni" },
      { src: proAceInside, alt: "Toyota ProAce - wnętrze chłodni z podłogą aluminiową", title: "ProAce - wnętrze z systemem chłodniczym" },
      { src: proAceTech, alt: "Toyota ProAce - wymiary wewnętrzne", title: "ProAce - specyfikacja wymiarów" },
    ],
    pricing: [
      { period: "1–3 doby", price: "400 zł" },
      { period: "4–7 dób", price: "350 zł" },
      { period: "8–14 dób", price: "320 zł" },
      { period: "15–29 dób", price: "280 zł" },
      { period: "30+ dni (miesięcznie)", price: "6 000 zł", highlighted: true },
    ],
  },
  {
    id: "maxi",
    title: "Toyota ProAce Maxi (L)",
    group: "Grupa L",
    image: proAceMaxiImg,
    alt: "Toyota ProAce Maxi - duży samochód chłodniczy",
    capacity:
      "Wymiary wewnętrzne (d/s/w): 302 × 135 × 180 cm · Wymiary zewnętrzne (d/s/w): 600 × 230 × 260 cm · kaucja - 2000zł",
    gallery: [
      { src: proAceMaxiNew, alt: "Toyota ProAce Maxi - nowy model", title: "ProAce Maxi - model 2024" },
      { src: proAceMaxiInside, alt: "Toyota ProAce Maxi - wnętrze chłodni", title: "ProAce Maxi - wnętrze chłodni" },
      { src: proAceMaxiTech, alt: "Toyota ProAce Maxi - wymiary techniczne", title: "ProAce Maxi - wymiary i specyfikacja" },
    ],
    pricing: [
      { period: "1–3 doby", price: "450 zł" },
      { period: "4–7 dób", price: "400 zł" },
      { period: "8–14 dób", price: "370 zł" },
      { period: "15–29 dób", price: "330 zł" },
      { period: "30+ dni (miesięcznie)", price: "6 500 zł", highlighted: true },
    ],
  },
];

type Vehicle = (typeof vehicles)[number];

export default function FleetSection() {
  const [active, setActive] = useState<Vehicle["id"]>("proace");

  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [flashId, setFlashId] = useState<string | null>(null);

  const chips = useMemo(
    () => [
      { id: "city" as const, label: "S", title: "ProAce City" },
      { id: "proace" as const, label: "M", title: "ProAce" },
      { id: "maxi" as const, label: "L", title: "ProAce Maxi" },
    ],
    []
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
        <h2 className="text-2xl md:text-3xl font-bold text-brand-dark mb-2">Flota i cennik</h2>

        <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-3xl mx-auto">
          Ceny netto. Rezerwacja niewiążąca — potwierdzimy dostępność i stawkę e-mailem.
          <span className="hidden md:inline"> Płatność wyłącznie kartą.</span>
        </p>

        <p className="md:hidden text-xs text-slate-500 mt-2">
          Płatność wyłącznie kartą.
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
                aria-label={`Pokaż rozmiar ${c.label}: ${c.title}`}
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
        Tip: dotknij zdjęcia, żeby otworzyć galerię.
      </div>
    </section>
  );
}
