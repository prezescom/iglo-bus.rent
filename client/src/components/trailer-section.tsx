import VehicleCard from "./vehicle-card";

const trailers = [
  {
    id: "trailer-s",
    title: "Przyczepa chłodnicza (S)",
    group: "Przyczepa S",
    image: "/images/przyczepa-S-wnetrze.jpg",
    alt: "Przyczepa chłodnicza jednoosiowa – wynajem Iglo-Bus Rent",
    capacity:
      "Wymiary wewnętrzne (d/s/w): 250 × 135 × 150 cm · DMC: 750 kg · kaucja - 1500 zł",
    description: "Zakres temperatur (−20°C do +10°C), agregat z podtrzymaniem 230V, możliwy dowóz. Kaucja zwrotna wg umowy.",
    gallery: [
      { src: "/images/przyczepa-S-wnetrze.jpg", alt: "Przyczepa chłodnicza S – z zewnątrz", title: "Przyczepa S" },
      { src: "/images/przyczepa-S-zewnatrz.jpg", alt: "Przyczepa chłodnicza S – wnętrze skrzyni ładunkowej", title: "Przyczepa S – skrzynia ładunkowa" },
    ],
    pricing: [
      { period: "doba", price: "200 zł" },
      { period: "miesiąc", price: "3 000 zł", highlighted: true },
    ],
  },
  {
    id: "trailer-l",
    title: "Przyczepa chłodnicza (L)",
    group: "Przyczepa L",
    image: "/images/przyczepa-L-wnetrze.jpg",
    alt: "Przyczepa chłodnicza dwuosiowa – wynajem Iglo-Bus Rent",
    capacity:
      "Wymiary wewnętrzne (d/s/w): 380 × 160 × 170 cm · DMC: 2000 kg · kaucja - 2000 zł",
    description: "Zakres temperatur (−20°C do +10°C), agregat z podtrzymaniem 230V, możliwy dowóz. Kaucja zwrotna wg umowy.",
    gallery: [
      { src: "/images/przyczepa-L-wnetrze.jpg", alt: "Przyczepa chłodnicza L – widok z zewnątrz", title: "Przyczepa L" },
      { src: "/images/przyczepa-L-zewnatrz.jpg", alt: "Przyczepa chłodnicza L – wnętrze", title: "Przyczepa L – wnętrze" },
    ],
    pricing: [
      { period: "doba", price: "250 zł" },
      { period: "miesiąc", price: "3 500 zł", highlighted: true },
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
          Zakres temperatur −20°C do +10°C. Ceny netto.
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
