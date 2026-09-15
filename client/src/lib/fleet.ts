import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type FleetPricingTier = {
  id: string;
  minDays: number;
  maxDays: number | null; // null = otwarty zakres (np. "30+ dni")
  pricePln: number;
  labelPl: string;
  labelEn: string;
  labelCs: string;
};

export type FleetVehicle = {
  id: string;
  order: number;
  status: "draft" | "published";
  titlePl: string;
  titleEn: string;
  titleCs: string;
  groupPl: string;
  groupEn: string;
  groupCs: string;
  descriptionPl: string;
  descriptionEn: string;
  descriptionCs: string;
  heroImageUrl: string;
  galleryImageUrls: string[];
  dimensionsInternal: { length: number; width: number; height: number };
  dimensionsExternal: { length: number; width: number; height: number };
  loadCapacityKg: number;
  grossWeightKg: number;
  depositPln: number;
  pricingTiers: FleetPricingTier[];
};

// Tylko opublikowane pojazdy — zgodnie z regułami Firestore (firestore.rules),
// ten sam wzorzec co fetchPublishedPosts w blog.ts. Sortowanie po polu
// "order" po stronie klienta (jedno pole w where() nie wymaga dodatkowego
// indeksu złożonego przy sortowaniu w Firestore).
export async function fetchPublishedFleetVehicles(): Promise<FleetVehicle[]> {
  const q = query(collection(db, "fleetVehicles"), where("status", "==", "published"));
  const snap = await getDocs(q);
  const vehicles = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as FleetVehicle);
  vehicles.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  return vehicles;
}
