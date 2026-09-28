# Szablony umów — wymagane tagi

Generowanie umów (`client/public/panel-najmu/js/contracts.js`) używa silnika **docxtemplater**
z ogranicznikami `[` `]` (NIE `{{ }}` jak w domyślnej konfiguracji docxtemplater). Tag w pliku
Word wygląda tak: `[nazwa_tagu]`, z polskimi znakami. Przy dopasowaniu nie mają znaczenia
wielkość liter, cudzysłowy (także drukarskie „…” wstawiane przez Worda) ani to, czy między
słowami jest spacja, twarda spacja czy podkreślenie — `[nazwa firmy]`, `["Nazwa firmy"]`
i `[nazwa_firmy]` to ten sam tag (patrz `tolerantParser` w `contracts.js`). Brakujący tag
zostaje po prostu pusty (nic się nie wywali), ale literówka w nazwie tagu sprawi, że pole nigdy
się nie podstawi.

## Podmiana szablonu z panelu

W panelu → **Wygeneruj umowę** → **Zarządzaj szablonami umów** można wgrać własny plik `.docx` dla
każdego z 6 typów umowy — trafia do Firebase Storage i jest używany zamiast wbudowanego, dopóki
ktoś nie kliknie „Przywróć domyślny". Wgrywany plik musi zawierać **dokładnie te same tagi**
(z listy poniżej, dla danego typu) — inaczej dane się nie podstawią albo generowanie zwróci błąd.

## Tagi wspólne — dostępne w KAŻDYM szablonie

Niezależnie od typu umowy, do każdego wzoru trafiają też poniższe tagi (patrz
`commonTemplateData` w `contracts.js`) — można ich użyć w dowolnym miejscu wgrywanego pliku:

| Tag | Wartość | Skąd |
|---|---|---|
| `[kaucja]` | np. `1500` | pole „Kaucja (PLN)" |
| `[stawka dobowa]` | np. `183,33` | liczone automatycznie: czynsz / liczba dób (data do − data od), do grosza; puste, gdy brak czynszu lub dat |
| `[limit km]` | np. `300` | pole „Limit km (km/doba)" (domyślnie 300) — sama liczba, jednostkę „km/doba" wpisz we wzorze |
| `[wyjazd_zagraniczny]` | `TAK` / `NIE` | pole „Wyjazd zagraniczny (Strefa Schengen)" |

Uwaga: `[stawka dobowa]` i `[limit km]` mają spację w nazwie — skopiuj je dokładnie tak.

## Wymagane tagi per typ umowy

### `konsument_umowa` — Konsument, Umowa
```
[data_zawarcia] [imię_nazwisko] [pesel] [seria_numer] [ulica] [kod_pocztowy]
[miejscowość] [e-mail] [telefon] [model] [nr_rejestracyjny] [VIN]
[data_od] [data_do] [kaucja]
```

### `konsument_ramowa` — Konsument, Umowa ramowa
```
[data_zawarcia] [imię_nazwisko] [PESEL] [Seria_Numer] [ulica] [kod_pocztowy]
[miejscowość] [e-mail] [telefon] [model] [nr_rejestracyjny] [VIN] [kaucja]
```
Uwaga: tu PESEL/Seria_Numer są pisane wielką literą — inaczej niż w `konsument_umowa`.

### `konsument_jednostkowa` — Konsument, Umowa najmu jednostkowego
```
[data_zawarcia] [imię_nazwisko] [PESEL] [pesel] [seria_numer] [ulica] [kod_pocztowy]
[miejscowość] [e-mail] [telefon] [data_zawarcia_ramowej] [data_zgłoszenia]
[data_potwierdzenia] [model] [nr_rejestracyjny] [VIN] [data_od] [data_do]
[czynsz] [VAT] [czynsz_brutto] [kaucja] [miejsce_wydania] [miejsce_zwrotu]
```
Uwaga: szablon używa **obu** `[imię_nazwisko]`/`[PESEL]`/`[pesel]` zarówno dla Najemcy, jak i dla
„Kierującego Pojazdem (jeśli inna osoba niż Najemca)" — oba miejsca dostają tę samą wartość z
danych najemcy. Jeśli kierowcą jest ktoś inny, tę sekcję trzeba poprawić ręcznie w wygenerowanym
dokumencie.

### `firma_ramowa` — Firma, Umowa ramowa
```
[data_zawarcia] [reprezentant] [firma] [NIP] [KRS] [ulica] [kod_pocztowy]
[Miasto] [model] [nr_rejestracyjny] [VIN] [kaucja] [umowa_od] [umowa_do]
```

### `firma_scalona_elektroniczna` — Firma, Umowa scalona (e-podpis)
```
[data_zawarcia] [nazwa firmy] [NIP] [KRS] [ulica] [kod_pocztowy] [Miejscowość]
[reprezentant] [model samochodu] [nr_rejestracyjny] [VIN] [czynsz]
[umowa_od] [umowa_do]
```
Nazwa firmy działa też jako `[firma]`, a model jako `[model]` — w każdym typie umowy.

### `firma_scalona_papierowa` — Firma, Umowa scalona (papierowa)
```
[data_zawarcia] [nazwa firmy] [NIP] [KRS] [ulica] [kod_pocztowy] [Miejscowość]
[reprezentant] [model samochodu] [nr_rejestracyjny] [VIN] [czynsz]
[kaucja] [umowa_od] [umowa_do]
```

## Wybór typu umowy dla Firmy

Dla Firmy nie ma osobnego wariantu „umowa najmu jednostkowego" — jeden dokument łączy umowę
ramową i najem konkretnego pojazdu. Zarówno „Umowa", jak i „Umowa najmu jednostkowego" prowadzą
więc do tego samego szablonu (`firma_scalona_elektroniczna` lub `firma_scalona_papierowa`, zależnie
od wybranej formy podpisu) — patrz `resolveTemplateKey` w `contracts.js`.
