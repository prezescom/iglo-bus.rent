// Logika kalkulatora najmu na podstawie zakresów cenowych z panelu
// (fleetVehicles.pricingTiers). Osobny moduł bez importu Firebase — używa
// go booking-form, który jest w głównym bundle'u strony (patrz komentarz w
// fleet-section.tsx o dynamicznym imporcie fleet.ts).
//
// Stawka dobierana jest po liczbach minDays/maxDays, NIE po tekście
// etykiety — etykiety są w pełni edytowalne w panelu ("1 doba", "4-7 dób",
// "2–3 doby"...), więc dopasowanie po tekście przestało działać po
// przejściu cennika do CMS.

// Standardowy limit przebiegu (FAQ "Czy są limity kilometrów?"), gdy
// w panelu nie wpisano limitu dla danego zakresu.
export const DEFAULT_MILEAGE_LIMIT_KM_PER_DAY = 300;

export type PricingTierNumbers = {
  minDays: number;
  maxDays: number | null; // null = otwarty zakres (np. "30+ dni")
  pricePln: number;
  mileageLimitKmPerDay?: number | null;
};

export function tierMileagePerDay(tier: PricingTierNumbers): number {
  return tier.mileageLimitKmPerDay || DEFAULT_MILEAGE_LIMIT_KM_PER_DAY;
}

// Otwarty zakres (bez górnej granicy, "30+ dni") ma w cenniku cenę
// miesięczną (np. 5500 zł), pozostałe — cenę za dobę.
function dailyRateOf(tier: PricingTierNumbers): number {
  return tier.maxDays == null ? Math.round(tier.pricePln / 30) : tier.pricePln;
}

// Przy nakładających się zakresach (np. 15–30 i 30+) wygrywa ten
// z najwyższym "od" — dla 30 dni stawka miesięczna, jak wcześniej.
export function findTier<T extends PricingTierNumbers>(tiers: T[], days: number): T | null {
  const valid = tiers.filter((t) => t.pricePln > 0);
  if (!valid.length) return null;
  const matching = valid.filter((t) => days >= t.minDays && (t.maxDays == null || days <= t.maxDays));
  const pool = matching.length ? matching : valid.filter((t) => t.minDays <= days);
  if (pool.length) return pool.reduce((a, b) => (b.minDays > a.minDays ? b : a));
  // krócej niż najniższy zakres — bierzemy najniższy
  return valid.reduce((a, b) => (b.minDays < a.minDays ? b : a));
}

export function calculateRental<T extends PricingTierNumbers>(tiers: T[], days: number) {
  if (days <= 0) return null;
  const tier = findTier(tiers, days);
  if (!tier) return null;
  const dailyRate = dailyRateOf(tier);
  const mileagePerDay = tierMileagePerDay(tier);
  return {
    tier,
    days,
    dailyRate,
    totalCost: dailyRate * days,
    mileagePerDay,
    mileageLimitKm: mileagePerDay * days
  };
}
