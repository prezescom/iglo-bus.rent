import VehicleCard from "./vehicle-card";

const trailers = [
  {
    id: "trailer-s",
    title: "Przyczepa chłodnicza (S)",
    group: "Przyczepa S",
    image: "/images/ProAce City 1_1755593677474.JPG",
    alt: "Przyczepa chłodnicza mała – wynajem",
    capacity:
      "Wymiary wewnętrzne (d/s/w): 250 × 135 × 150 cm · DMC: 750 kg · kaucja - 1500 zł",
    pricing: [
      { period: "1–3 doby", price: "200 zł" },
      { period: "4–7 dób", price: "170 zł" },
      { period: "8–14 dób", price: "150 zł" },
      { period: "15–29 dób", price: "130 zł" },
      { period: "30+ dni (miesięcznie)", price: "3 500 zł", highlighted: true },
    ],
  },
  {
    id: "trailer-l",
    title: "Przyczepa chłodnicza (L)",
    group: "Przyczepa L",
    image: "/images/ProAce Maxi 1_1755593677475.JPG",
    alt: "Przyczepa chłodnicza duża – wynajem",
    capacity:
      "Wymiary wewnętrzne (d/s/w): 380 × 160 × 170 cm · DMC: 1300 kg · kaucja - 2000 zł",
    pricing: [
      { period: "1–3 doby", price: "280 zł" },
      { period: "4–7 dób", price: "240 zł" },
      { period: "8–14 dób", price: "210 zł" },
      { period: "15–29 dób", price: "180 zł" },
      { period: "30+ dni (miesięcznie)", price: "4 800 zł", highlighted: true },
    ],
  },
];

export default function TrailerSection() {
  return (
    <section id="przyczepy" className="mx-auto max-w-6xl px-4 pb-14 md:pb-16">
      <div className="text-center mb-6 md:mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-brand-dark mb-2">Przyczepy chłodnicze</h2>
        <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-3xl mx-auto">
          Przyczepy chłodnicze do wynajęcia – idealne jako rozszerzenie pojemności lub samodzielne rozwiązanie transportowe.
          Zakres temperatur −20°C do +20°C. Ceny netto.
          <span className="hidden md:inline"> Płatność wyłącznie kartą.</span>
        </p>
        <p className="md:hidden text-xs text-slate-500 mt-2">Płatność wyłącznie kartą.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-7 lg:gap-8 max-w-3xl mx-auto">
        {trailers.map((trailer, index) => (
          <VehicleCard key={trailer.id} vehicle={trailer} delay={index * 0.06} />
        ))}
      </div>
    </section>
  );
}
