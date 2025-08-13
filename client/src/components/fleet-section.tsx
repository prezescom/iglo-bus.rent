import VehicleCard from "./vehicle-card";
import proAceCityImg from "@assets/ProAce city_1755066478398.jpg";
import proAceImg from "@assets/ProAce_1755066478398.jpg";
import proAceMaxiImg from "@assets/Proace max_1755066478398.jpg";

// Import additional photos for gallery
import proAceCityNew from "@assets/ProAce city_1755067680374.jpg";
import proAceCityInside from "@assets/ProAce City inside_1755067680373.jpg";
import proAceCityTech from "@assets/ProAce City tech_1755067680373.jpg";

import proAceNew from "@assets/ProAce_1755067680373.jpg";
import proAceInside from "@assets/ProAce inside_1755067680372.jpg";
import proAceTech from "@assets/ProAce tech_1755067680372.jpg";

import proAceMaxiNew from "@assets/Proace max_1755067680373.jpg";
import proAceMaxiInside from "@assets/Proace max inside_1755067680371.jpg";

const vehicles = [
  {
    id: "city",
    title: "Toyota ProAce City (S)",
    group: "Grupa S",
    image: proAceCityImg,
    alt: "Toyota ProAce City - kompaktowy samochód chłodniczy",
    capacity: "2 europalety • ~3.5–4 m³",
    gallery: [
      { src: proAceCityNew, alt: "Toyota ProAce City - nowy model", title: "ProAce City - model 2024" },
      { src: proAceCityInside, alt: "Toyota ProAce City - wnętrze chłodni", title: "ProAce City - wnętrze chłodni" },
      { src: proAceCityTech, alt: "Toyota ProAce City - wymiary techniczne", title: "ProAce City - wymiary i specyfikacja" },
    ],
    pricing: [
      { period: "1–3 doby", price: "320 zł" },
      { period: "4–7 dób", price: "299 zł" },
      { period: "8–14 dób", price: "269 zł" },
      { period: "15–29 dób", price: "239 zł" },
      { period: "30+ dni (miesięcznie)", price: "4 600 zł", highlighted: true },
    ],
  },
  {
    id: "proace",
    title: "Toyota ProAce (M)",
    group: "Grupa M",
    image: proAceImg,
    alt: "Toyota ProAce - średni samochód chłodniczy",
    capacity: "3–4 europalety • ~5–6 m³",
    gallery: [
      { src: proAceNew, alt: "Toyota ProAce - nowy model", title: "ProAce - model 2024" },
      { src: proAceInside, alt: "Toyota ProAce - wnętrze chłodni", title: "ProAce - wnętrze chłodni" },
      { src: proAceTech, alt: "Toyota ProAce - wymiary techniczne", title: "ProAce - wymiary i specyfikacja" },
    ],
    pricing: [
      { period: "1–3 doby", price: "360 zł" },
      { period: "4–7 dób", price: "330 zł" },
      { period: "8–14 dób", price: "299 zł" },
      { period: "15–29 dób", price: "269 zł" },
      { period: "30+ dni (miesięcznie)", price: "5 200 zł", highlighted: true },
    ],
  },
  {
    id: "maxi",
    title: "Toyota ProAce Maxi (L)",
    group: "Grupa L",
    image: proAceMaxiImg,
    alt: "Toyota ProAce Maxi - duży samochód chłodniczy",
    capacity: "4–5 europalet • ~7–8 m³",
    gallery: [
      { src: proAceMaxiNew, alt: "Toyota ProAce Maxi - nowy model", title: "ProAce Maxi - model 2024" },
      { src: proAceMaxiInside, alt: "Toyota ProAce Maxi - wnętrze chłodni", title: "ProAce Maxi - wnętrze chłodni" },
    ],
    pricing: [
      { period: "1–3 doby", price: "420 zł" },
      { period: "4–7 dób", price: "399 zł" },
      { period: "8–14 dób", price: "359 zł" },
      { period: "15–29 dób", price: "329 zł" },
      { period: "30+ dni (miesięcznie)", price: "5 800 zł", highlighted: true },
    ],
  },
];

export default function FleetSection() {
  return (
    <section id="flota" className="mx-auto max-w-6xl px-4 pb-16" data-testid="fleet-section">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-brand-dark mb-2">Flota i cennik</h2>
        <p className="text-slate-600">Ceny brutto. Rezerwacja niewiążąca — potwierdzimy dostępność i stawkę e‑mailem.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {vehicles.map((vehicle, index) => (
          <VehicleCard 
            key={vehicle.id} 
            vehicle={vehicle} 
            delay={index * 0.1}
          />
        ))}
      </div>
    </section>
  );
}
