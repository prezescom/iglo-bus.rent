import { Weight, Gauge, Box, Truck, ShieldCheck } from "lucide-react";

export interface VehicleCardDimensions {
  length: number;
  width: number;
  height: number;
}

export interface VehicleCardAccent {
  /** tailwind text-color class applied to icons, badge label and big values */
  text: string;
  /** tailwind bg-color class applied to badge and the ładowność/DMC bar */
  bg: string;
}

export const defaultVehicleCardAccent: VehicleCardAccent = { text: "text-brand-blue", bg: "bg-brand-light" };

export const formatKg = (value: number) => `${value.toLocaleString("pl-PL")} kg`;
export const formatPln = (value: number) => `${value.toLocaleString("pl-PL")} zł`;

export interface VehicleSpecDetailsProps {
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
  testId?: string;
}

export default function VehicleSpecDetails({
  loadCapacityKg,
  grossWeightKg,
  dimensionsInternal,
  dimensionsExternal,
  depositPln,
  accent = defaultVehicleCardAccent,
  testId,
}: VehicleSpecDetailsProps) {
  const hasLoadCapacity = typeof loadCapacityKg === "number";
  const hasGrossWeight = typeof grossWeightKg === "number";
  const hasDeposit = typeof depositPln === "number";

  return (
    <div className="space-y-4" data-testid={testId}>
      {(hasLoadCapacity || hasGrossWeight) && (
        <div className={`rounded-lg px-4 py-3 flex items-stretch justify-center gap-4 ${accent.bg}`}>
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

      <div>
        <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
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
            {dimensionsExternal && (
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
            )}
          </tbody>
        </table>
        <p className="text-[11px] text-slate-400 mt-1.5">wymiary w cm</p>
      </div>

      {hasDeposit && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
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
