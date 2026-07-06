import { useState, KeyboardEvent } from "react";
import { Camera } from "lucide-react";
import PhotoGallery from "./photo-gallery";
import VehicleSpecDetails, {
  defaultVehicleCardAccent,
  type VehicleCardAccent,
  type VehicleCardDimensions,
} from "./vehicle-spec-details";

export type { VehicleCardDimensions, VehicleCardAccent };

export interface VehicleCardImage {
  src: string;
  alt: string;
}

export interface VehicleCardVariant {
  id: string;
  name: string;
  /** full badge label, e.g. "Grupa S" or "Przyczepa L" */
  groupLabel: string;
  image: VehicleCardImage;
  gallery?: Array<VehicleCardImage & { title?: string }>;
  /** ładowność w kg — pomiń, gdy nie dotyczy danego typu pojazdu */
  loadCapacityKg?: number;
  /** DMC w kg — pomiń, gdy nie dotyczy danego typu pojazdu */
  grossWeightKg?: number;
  dimensionsInternal: VehicleCardDimensions;
  /** pomiń, gdy wymiary zewnętrzne nie są jeszcze znane/dotyczą pojazdu */
  dimensionsExternal?: VehicleCardDimensions;
  /** kaucja w PLN — pomiń, aby ukryć pasek kaucji */
  depositPln?: number;
  accent?: VehicleCardAccent;
}

interface VehicleCardProps {
  vehicle: VehicleCardVariant;
}

export default function VehicleSpecCard({ vehicle }: VehicleCardProps) {
  const {
    name,
    groupLabel,
    image,
    gallery,
    loadCapacityKg,
    grossWeightKg,
    dimensionsInternal,
    dimensionsExternal,
    depositPln,
    accent = defaultVehicleCardAccent,
  } = vehicle;

  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const hasGallery = Boolean(gallery && gallery.length > 0);

  const openGallery = () => {
    if (hasGallery) setIsGalleryOpen(true);
  };

  const onKeyOpen = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (!hasGallery) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openGallery();
    }
  };

  return (
    <div
      className="bg-white rounded-xl border-[0.5px] border-slate-300 overflow-hidden"
      data-testid={`vehicle-spec-card-${vehicle.id}`}
    >
      <div className="flex items-center justify-between gap-3 px-5 pt-5 pb-3">
        <h3 className="text-base font-semibold text-slate-900">{name}</h3>
        <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${accent.bg} ${accent.text}`}>
          {groupLabel}
        </span>
      </div>

      <div className="px-5">
        <button
          type="button"
          className={`rounded-lg overflow-hidden bg-slate-100 relative group w-full aspect-[16/10] ${
            hasGallery ? "cursor-pointer" : "cursor-default"
          }`}
          onClick={openGallery}
          onKeyDown={onKeyOpen}
          disabled={!hasGallery}
          aria-label={hasGallery ? `Otwórz galerię zdjęć: ${name}` : `Zdjęcie: ${name}`}
          data-testid={`vehicle-spec-image-${vehicle.id}`}
        >
          <img
            src={image.src}
            alt={image.alt}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />

          {hasGallery && (
            <>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center pointer-events-none">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-2">
                  <Camera className={`h-5 w-5 ${accent.text}`} />
                </div>
              </div>
              <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full pointer-events-none">
                +{gallery!.length} zdjęć
              </div>
            </>
          )}
        </button>
      </div>

      {hasGallery && (
        <PhotoGallery isOpen={isGalleryOpen} onClose={() => setIsGalleryOpen(false)} photos={gallery!} />
      )}

      <div className="px-5 py-4">
        <VehicleSpecDetails
          loadCapacityKg={loadCapacityKg}
          grossWeightKg={grossWeightKg}
          dimensionsInternal={dimensionsInternal}
          dimensionsExternal={dimensionsExternal}
          depositPln={depositPln}
          accent={accent}
          testId={`vehicle-spec-details-${vehicle.id}`}
        />
      </div>
    </div>
  );
}

/** Przykładowe dane wariantu S — reszta wariantów (M/L) powinna trafiać tu jako props z zewnątrz. */
export const exampleVariantS: VehicleCardVariant = {
  id: "city-s",
  name: "Toyota ProAce City (S)",
  groupLabel: "Grupa S",
  image: {
    src: "/images/ProAce City 1_1755593677474.JPG",
    alt: "Toyota ProAce City - kompaktowy samochód chłodniczy",
  },
  loadCapacityKg: 685,
  grossWeightKg: 2400,
  dimensionsInternal: { length: 175, width: 109, height: 104 },
  dimensionsExternal: { length: 475, width: 210, height: 211 },
  depositPln: 1000,
};
