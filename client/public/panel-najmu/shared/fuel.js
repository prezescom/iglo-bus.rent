// Poziom paliwa w protokołach jako ułamek "xx/yy" zamiast procentów:
//  - yy (mianownik) — liczba wszystkich podziałek wskaźnika paliwa, stała
//    dla pojazdu, z karty pojazdu (vehicles.fuelGaugeDivisions, panel:
//    renderVehicleForm); w formularzu protokołu tylko do odczytu,
//  - xx (licznik) — liczba widocznych kresek przy wydaniu/zwrocie, wpisywana
//    w protokole: liczba całkowita 0 < xx <= yy.
// Zapis w rekordzie wynajmu: vehicleFuelAtHandover / vehicleFuelAtReturn
// jako tekst "xx/yy" (np. "6/8"). Starsze protokoły mają tam same procenty
// (np. "75") — formatFuel rozpoznaje to i dopisuje "%".
// Używane przez panel (js/app.js) i stronę najemcy (protokol/protokol.js).

export function parseFuel(value) {
  const m = String(value ?? "").match(/^\s*(\d+)\s*\/\s*(\d+)\s*$/);
  return m ? { count: Number(m[1]), divisions: Number(m[2]) } : null;
}

// Do PDF-u / list: "6/8", stare wartości procentowe "75 %", brak — "-".
export function formatFuel(value) {
  if (value === undefined || value === null || value === "") return "-";
  if (parseFuel(value)) return String(value).replace(/\s+/g, "");
  return /^\s*\d+([.,]\d+)?\s*$/.test(String(value)) ? `${String(value).trim()} %` : String(value);
}

// Mianownik dla zwrotu: ta sama skala co przy wydaniu tego wynajmu (z
// zapisanego "xx/yy" albo pola vehicleFuelDivisions), a dopiero gdy jej
// brak (stare wynajmy z procentami) — aktualna karta pojazdu.
export function fuelDivisionsForReturn(record, vehicleData) {
  return (
    parseFuel(record?.vehicleFuelAtHandover)?.divisions ||
    Number(record?.vehicleFuelDivisions) ||
    Number(vehicleData?.fuelGaugeDivisions) ||
    null
  );
}

// Podpina pola "fuel" (licznik) i "fuelDivisions" (mianownik) formularza.
// divisions — z karty pojazdu; gdy nieznane (pojazd bez uzupełnionej karty),
// mianownik staje się edytowalny i wymagany, żeby nie blokować protokołu.
// Zwraca { setDivisions(n), setValue("xx/yy"), read() -> "xx/yy" }.
export function wireFuelFields(form, divisions) {
  const countInput = form.elements["fuel"];
  const divInput = form.elements["fuelDivisions"];
  const hint = form.querySelector("[data-fuel-hint]");

  function setDivisions(n) {
    const d = Number(n) || 0;
    if (d > 0) {
      divInput.value = String(d);
      divInput.readOnly = true;
      divInput.tabIndex = -1;
      if (hint) hint.hidden = true;
    } else {
      divInput.readOnly = false;
      divInput.tabIndex = 0;
      if (hint) hint.hidden = false;
    }
    validate();
  }

  function validate() {
    const d = Number(divInput.value);
    const raw = countInput.value.trim();
    const c = Number(raw);
    countInput.max = d > 0 ? String(d) : "";
    let msg = "";
    if (raw !== "" && (!Number.isInteger(c) || c < 1)) {
      msg = "Wpisz liczbę całkowitą widocznych kresek (co najmniej 1).";
    } else if (raw !== "" && d > 0 && c > d) {
      msg = `Liczba kresek nie może być większa niż ${d}.`;
    }
    countInput.setCustomValidity(msg);
    divInput.setCustomValidity(divInput.value !== "" && !(Number.isInteger(d) && d >= 1) ? "Podaj liczbę podziałek (co najmniej 1)." : "");
  }

  countInput.addEventListener("input", validate);
  divInput.addEventListener("input", validate);
  setDivisions(divisions);

  return {
    setDivisions,
    setValue(value) {
      const p = parseFuel(value);
      if (p) {
        countInput.value = String(p.count);
        if (!(Number(divInput.value) > 0)) setDivisions(p.divisions);
      } else {
        countInput.value = "";
      }
      validate();
    },
    read() {
      return `${countInput.value.trim()}/${divInput.value.trim()}`;
    }
  };
}
