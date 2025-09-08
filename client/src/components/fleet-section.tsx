import VehicleCard from "./vehicle-card";

// Vehicle images served via API endpoint - Updated with new gallery photos
const proAceCityImg = "/api/images/ProAce City 1_1755593677474.JPG";
const proAceImg = "/api/images/ProAce 1_1755593677473.JPG";
const proAceMaxiImg = "/api/images/ProAce Maxi 1_1755593677475.JPG";

// ProAce City gallery images
const proAceCityNew = "/api/images/ProAce City 1_1755593677474.JPG";
const proAceCityInside = "/api/images/ProAce City 2_1755593677474.JPG";
const proAceCityTech = "/api/images/ProAce City 4_1755593677472.jpg";

// ProAce gallery images
const proAceNew = "/api/images/ProAce 1_1755593677473.JPG";
const proAceInside = "/api/images/ProAce 2_1755593677473.JPG";
const proAceTech = "/api/images/ProAce 4_1755593677471.jpg";

// ProAce Maxi gallery images
const proAceMaxiNew = "/api/images/ProAce Maxi 1_1755593677475.JPG";
const proAceMaxiInside = "/api/images/ProAce Maxi 2_1755593677475.JPG";
const proAceMaxiTech = "/api/images/ProAce Maxi 3_1755593677476.JPG";

const vehicles = [
  {
    id: "city",
    title: "Toyota ProAce City (S)",
    group: "Grupa S",
    image: proAceCityImg,
    alt: "Toyota ProAce City - kompaktowy samochód chłodniczy",
    capacity: "kaucja - 1000zł · pojemność ~ 4 m³",
    gallery: [
      { src: proAceCityNew, alt: "Toyota ProAce City z agregatem chłodniczym", title: "ProAce City - pojazd z systemem chłodniczym" },
      { src: proAceCityInside, alt: "Toyota ProAce City - wnętrze chłodni z agregatem", title: "ProAce City - wnętrze z systemem Zanotti" },
      { src: proAceCityTech, alt: "Toyota ProAce City - wymiary wewnętrzne", title: "ProAce City - wymiary zabudowy" },
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
    capacity: "kaucja - 1500zł · pojemność ~ 6 m³",
    gallery: [
      { src: proAceNew, alt: "Toyota ProAce z otwartymi drzwiami bocznymi", title: "ProAce - dostęp do ładowni" },
      { src: proAceInside, alt: "Toyota ProAce - wnętrze chłodni z podłogą aluminiową", title: "ProAce - wnętrze z systemem chłodniczym" },
      { src: proAceTech, alt: "Toyota ProAce - wymiary wewnętrzne", title: "ProAce - specyfikacja wymiarów" },
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
    capacity: "kaucja - 2000zł · pojemność ~ 8 m³",
    gallery: [
      { src: proAceMaxiNew, alt: "Toyota ProAce Maxi - nowy model", title: "ProAce Maxi - model 2024" },
      { src: proAceMaxiInside, alt: "Toyota ProAce Maxi - wnętrze chłodni", title: "ProAce Maxi - wnętrze chłodni" },
      { src: proAceMaxiTech, alt: "Toyota ProAce Maxi - wymiary techniczne", title: "ProAce Maxi - wymiary i specyfikacja" },
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
