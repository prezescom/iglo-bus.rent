import { useState } from "react";
import { Camera } from "lucide-react";
import BookingForm from "./booking-form";
import PhotoGallery from "./photo-gallery";

interface VehicleCardProps {
  vehicle: {
    id: string;
    title: string;
    group: string;
    image: string;
    alt: string;
    capacity: string;
    gallery?: Array<{
      src: string;
      alt: string;
      title?: string;
    }>;
    pricing: Array<{
      period: string;
      price: string;
      highlighted?: boolean;
    }>;
  };
  delay?: number;
}

export default function VehicleCard({ vehicle, delay = 0 }: VehicleCardProps) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  
  console.log(`VehicleCard ${vehicle.id} render:`, { isGalleryOpen, galleryLength: vehicle.gallery?.length });

  const handleImageClick = () => {
    console.log("Image clicked - gallery data:", vehicle.gallery?.length);
    if (vehicle.gallery && vehicle.gallery.length > 0) {
      console.log("Setting gallery open");
      setIsGalleryOpen(true);
    }
  };

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
        
        <div 
          className={`mb-4 rounded-xl overflow-hidden bg-slate-50 relative group ${
            vehicle.gallery && vehicle.gallery.length > 0 ? "cursor-pointer" : ""
          }`}
          onClick={(e) => {
            console.log("Container clicked!", e);
            handleImageClick();
          }}
          data-testid={`vehicle-image-${vehicle.id}`}
        >
          <img 
            src={vehicle.image} 
            alt={vehicle.alt}
            className="w-full h-48 object-cover transition-all hover:scale-105"
          />
          {vehicle.gallery && vehicle.gallery.length > 0 && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center pointer-events-none">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-2">
                <Camera className="h-5 w-5 text-brand-blue" />
              </div>
            </div>
          )}
          {vehicle.gallery && vehicle.gallery.length > 0 && (
            <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full pointer-events-none">
              +{vehicle.gallery.length} zdjęć
            </div>
          )}
        </div>
        <p className="text-sm text-slate-600 font-medium">{vehicle.capacity}</p>
      </div>

      {/* Photo Gallery */}
      {vehicle.gallery && (
        <PhotoGallery
          isOpen={isGalleryOpen}
          onClose={() => setIsGalleryOpen(false)}
          photos={vehicle.gallery}
        />
      )}
      
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
