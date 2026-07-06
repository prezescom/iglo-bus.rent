import { useState, KeyboardEvent } from "react";
import { Weight, Gauge, Box, Truck, ShieldCheck, Camera } from "lucide-react";
import PhotoGallery from "./photo-gallery";

export interface VehicleCardDimensions {
  length: number;
  width: number;
  height: number;
}

export interface VehicleCardImage {
  src: string;
  alt: string;
}

export interface VehicleCardAccent {
  /** tailwind text-color class applied to icons, badge label and big values */
  text: string;
  /** tailwind bg-color class applied to badge and the ładowność/DMC bar */
  bg: string;
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
  dimensionsExternal: VehicleCardDimensions;
  /** kaucja w PLN — pomiń, aby ukryć pasek kaucji */
  depositPln?: number;
  accent?: VehicleCardAccent;
}

interface VehicleCardProps {
  vehicle: VehicleCardVariant;
}

const defaultAccent: VehicleCardAccent = { text: "text-brand-blue", bg: "bg-brand-light" };

const formatKg = (value: number) => `${value.toLocaleString("pl-PL")} kg`;
const formatPln = (value: number) => `${value.toLocaleString("pl-PL")} zł`;

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
    accent = defaultAccent,
  } = vehicle;

  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const hasGallery = Boolean(gallery && gallery.length > 0);
  const hasLoadCapacity = typeof loadCapacityKg === "number";
  const hasGrossWeight = typeof grossWeightKg === "number";
  const hasDeposit = typeof depositPln === "number";

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

      {(hasLoadCapacity || hasGrossWeight) && (
        <div className={`mx-5 mt-4 rounded-lg px-4 py-3 flex items-stretch justify-center gap-4 ${accent.bg}`}>
          {hasLoadCapacity && (
            <div className="flex items-center gap-2">
              <Weight className={`h-5 w-5 shrink-0 ${accent.text}`} />
              <div className="leading-tight">
                <div className="text-[11px] text-slate-500">ładowność</div>
                <div className={`text-lg font-semibold ${accent.text}`}>{formatKg(loadCapacityKg!)}</div>
              </div>
            </div>
          )}

          {hasLoadCapacity && hasGrossWeight && <div className="w-px bg-slate-300/70 self-stretch" />}

          {hasGrossWeight && (
            <div className="flex items-center gap-2">
              <Gauge className={`h-5 w-5 shrink-0 ${accent.text}`} />
              <div className="leading-tight">
                <div className="text-[11px] text-slate-500">DMC</div>
                <div className={`text-lg font-semibold ${accent.text}`}>{formatKg(grossWeightKg!)}</div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className={`px-5 mt-4 ${hasDeposit ? "" : "pb-5"}`}>
        <table
          className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden"
          data-testid={`vehicle-spec-dimensions-${vehicle.id}`}
        >
          <thead>
            <tr className="bg-slate-50 text-slate-500">
              <th className="text-left font-medium px-3 py-2" />
              <th className="text-right font-medium px-3 py-2">dł.</th>
              <th className="text-right font-medium px-3 py-2">szer.</th>
              <th className="text-right font-medium px-3 py-2">wys.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="px-3 py-2 text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Box className="h-4 w-4 shrink-0" />
                  wewn.
                </div>
              </td>
              <td className="text-right px-3 py-2 font-medium text-slate-900">{dimensionsInternal.length}</td>
              <td className="text-right px-3 py-2 font-medium text-slate-900">{dimensionsInternal.width}</td>
              <td className="text-right px-3 py-2 font-medium text-slate-900">{dimensionsInternal.height}</td>
            </tr>
            <tr>
              <td className="px-3 py-2 text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Truck className="h-4 w-4 shrink-0" />
                  zewn.
                </div>
              </td>
              <td className="text-right px-3 py-2 font-medium text-slate-900">{dimensionsExternal.length}</td>
              <td className="text-right px-3 py-2 font-medium text-slate-900">{dimensionsExternal.width}</td>
              <td className="text-right px-3 py-2 font-medium text-slate-900">{dimensionsExternal.height}</td>
            </tr>
          </tbody>
        </table>
        <p className="text-[11px] text-slate-400 mt-1.5">wymiary w cm</p>
      </div>

      {hasDeposit && (
        <div className="mt-4 px-5 py-4 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-600 text-sm">
            <ShieldCheck className="h-4 w-4" />
            <span>Kaucja</span>
          </div>
          <span className="text-xs font-semibold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
            {formatPln(depositPln!)}
          </span>
        </div>
      )}
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
