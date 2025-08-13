import BookingForm from "./booking-form";

interface VehicleCardProps {
  vehicle: {
    id: string;
    title: string;
    group: string;
    image: string;
    alt: string;
    capacity: string;
    pricing: Array<{
      period: string;
      price: string;
      highlighted?: boolean;
    }>;
  };
  delay?: number;
}

export default function VehicleCard({ vehicle, delay = 0 }: VehicleCardProps) {
  return (
    <div 
      className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow animate-fade-in"
      style={{ animationDelay: `${delay}s` }}
      data-testid={`vehicle-card-${vehicle.id}`}
    >
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-brand-dark">{vehicle.title}</h3>
          <span className="text-xs font-semibold text-brand-blue bg-brand-light px-2 py-1 rounded-full">
            {vehicle.group}
          </span>
        </div>
        
        <div className="mb-4 rounded-xl overflow-hidden bg-slate-50">
          <img 
            src={vehicle.image} 
            alt={vehicle.alt}
            className="w-full h-48 object-cover"
            data-testid={`vehicle-image-${vehicle.id}`}
          />
        </div>
        <p className="text-sm text-slate-600 font-medium">{vehicle.capacity}</p>
      </div>
      
      <div className="p-6 space-y-5">
        <div className="rounded-xl border border-slate-200 overflow-hidden" data-testid={`pricing-table-${vehicle.id}`}>
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-3 font-semibold text-brand-dark">Okres</th>
                <th className="text-right p-3 font-semibold text-brand-dark">Cena / doba</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vehicle.pricing.map((pricing, index) => (
                <tr key={index} className={pricing.highlighted ? "bg-brand-light" : ""}>
                  <td className={`p-3 ${pricing.highlighted ? "font-medium" : ""}`}>
                    {pricing.period}
                  </td>
                  <td className="p-3 text-right font-bold text-brand-blue">
                    {pricing.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-lg">
          W cenie: pełen zakres temperatur (-20°C…+20°C), agregat z podtrzymaniem na 230V, 
          assistance na terenie PL. Kaucja zwrotna wg umowy.
        </p>

        <BookingForm vehicleTitle={vehicle.title} />
      </div>
    </div>
  );
}
