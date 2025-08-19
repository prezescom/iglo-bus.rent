import VehicleCard from "./vehicle-card";

// Vehicle images served via API endpoint
const proAceCityImg = "/api/images/ProAce city_1755066478398.jpg";
const proAceImg = "/api/images/ProAce_1755066478398.jpg";
const proAceMaxiImg = "/api/images/Proace max_1755066478398.jpg";

// Gallery images
const proAceCityNew = "/api/images/ProAce city_1755067680374.jpg";
const proAceCityInside = "/api/images/ProAce City inside_1755067680373.jpg";
const proAceCityTech = "/api/images/ProAce City tech_1755067680373.jpg";

const proAceNew = "/api/images/ProAce_1755067680373.jpg";
const proAceInside = "/api/images/ProAce inside_1755067680372.jpg";
const proAceTech = "/api/images/ProAce tech_1755067680372.jpg";

const proAceMaxiNew = "/api/images/Proace max_1755067680373.jpg";
const proAceMaxiInside = "/api/images/Proace max inside_1755067680371.jpg";

const vehicles = [
  {
    id: "city",
    title: "Toyota ProAce City (S)",
    group: "Grupa S",
    image: proAceCityImg,
    alt: "Toyota ProAce City - kompaktowy samochód chłodniczy",
    capacity: "kaucja - 1000zł · ~3.5–4 m³",
    gallery: [
      { src: proAceCityNew, alt: "Toyota ProAce City - nowy model", title: "ProAce City - model 2024" },
      { src: proAceCityInside, alt: "Toyota ProAce City - wnętrze chłodni", title: "ProAce City - wnętrze chłodni" },
      { src: proAceCityTech, alt: "Toyota ProAce City - wymiary techniczne", title: "ProAce City - wymiary i specyfikacja" },
    ],
    pricing: [
      { period: "1–3 doby", price: "260 zł" },
      { period: "4–7 dób", price: "240 zł" },
      { period: "8–14 dób", price: "220 zł" },
      { period: "15–29 dób", price: "200 zł" },
      { period: "30+ dni (miesięcznie)", price: "4 600 zł", highlighted: true },
    ],
  },
  {
    id: "proace",
    title: "Toyota ProAce (M)",
    group: "Grupa M",
    image: proAceImg,
    alt: "Toyota ProAce - średni samochód chłodniczy",
    capacity: "kaucja - 1500zł · ~5–6 m³",
    gallery: [
      { src: proAceNew, alt: "Toyota ProAce - nowy model", title: "ProAce - model 2024" },
      { src: proAceInside, alt: "Toyota ProAce - wnętrze chłodni", title: "ProAce - wnętrze chłodni" },
      { src: proAceTech, alt: "Toyota ProAce - wymiary techniczne", title: "ProAce - wymiary i specyfikacja" },
    ],
    pricing: [
      { period: "1–3 doby", price: "280 zł" },
      { period: "4–7 dób", price: "260 zł" },
      { period: "8–14 dób", price: "240 zł" },
      { period: "15–29 dób", price: "220 zł" },
      { period: "30+ dni (miesięcznie)", price: "5 200 zł", highlighted: true },
    ],
  },
  {
    id: "maxi",
    title: "Toyota ProAce Maxi (L)",
    group: "Grupa L",
    image: proAceMaxiImg,
    alt: "Toyota ProAce Maxi - duży samochód chłodniczy",
    capacity: "kaucja - 2000zł · ~7–8 m³",
    gallery: [
      { src: proAceMaxiNew, alt: "Toyota ProAce Maxi - nowy model", title: "ProAce Maxi - model 2024" },
      { src: proAceMaxiInside, alt: "Toyota ProAce Maxi - wnętrze chłodni", title: "ProAce Maxi - wnętrze chłodni" },
    ],
    pricing: [
      { period: "1–3 doby", price: "350 zł" },
      { period: "4–7 dób", price: "320 zł" },
      { period: "8–14 dób", price: "300 zł" },
      { period: "15–29 dób", price: "280 zł" },
      { period: "30+ dni (miesięcznie)", price: "5 800 zł", highlighted: true },
    ],
  },
];

export default function FleetSection() {
  return (
    <section id="flota" className="mx-auto max-w-6xl px-4 pb-16" data-testid="fleet-section">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-brand-dark mb-2">Flota i cennik</h2>
        <p className="text-slate-600">Ceny netto. Rezerwacja niewiążąca — potwierdzimy dostępność i stawkę e‑mailem. Płatność wyłącznie kartą.</p>
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
