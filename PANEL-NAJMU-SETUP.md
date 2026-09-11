# Panel najmu — `iglo-bus.rent/panel-najmu`

Co zostało dodane do repo:

- `client/public/panel-najmu/` — statyczna aplikacja PWA (wydanie/zwrot pojazdu, zdjęcia, podpis, PDF, e-mail). Wchodzi w skład zwykłego `npm run build` (Vite kopiuje `client/public/*` 1:1 do `dist/public/*`), więc trafia na Vercel razem z resztą strony.
- `middleware.ts` (root repo) — Vercel Routing Middleware, wymaga HTTP Basic Auth dla każdej ścieżki pod `/panel-najmu/*`.
- `vercel.json` — dodana reguła, żeby `/panel-najmu` (bez dalszej ścieżki) serwował `panel-najmu/index.html`.
- `firebase-panel-najmu/` — backend (Firestore, Storage, Cloud Functions: wysyłka maila + auto-kasowanie zdjęć po 10 dniach). To wdraża się niezależnie od Vercela, przez Firebase CLI.

Zostały 3 rzeczy do zrobienia po Twojej stronie, zanim to zadziała na produkcji.

## 1. Firebase (backend danych, zdjęć, maili)

1. https://console.firebase.google.com → nowy projekt.
2. Dodaj aplikację **Web** (`</>`), skopiuj obiekt `firebaseConfig` do [`client/public/panel-najmu/shared/firebase-config.js`](client/public/panel-najmu/shared/firebase-config.js) (zastąp placeholdery `TWÓJ_...`).
3. W tym samym pliku ustaw `LESSOR_EMAIL` na docelowy adres.
4. Włącz w konsoli: **Firestore Database**, **Storage**, **Authentication → Anonymous**.
5. Wdróż reguły i funkcje z folderu `firebase-panel-najmu/`:
   ```
   cd firebase-panel-najmu
   npm install -g firebase-tools   # jeśli jeszcze nie masz
   firebase login
   firebase use --add              # wybierz swój projekt
   firebase functions:secrets:set ZOHO_PASS
   cd functions && npm install && cd ..
   firebase deploy --only functions,firestore:rules,storage
   ```
   `firebase functions:secrets:set ZOHO_PASS` zapyta o wartość — wpisz hasło do skrzynki `kontakt@iglo-bus.rent` (nie będzie widoczne na ekranie podczas wpisywania, to normalne). Trafia bezpośrednio do Google Secret Manager, nie do pliku w repo.

   Sam adres nadawcy (`kontakt@iglo-bus.rent`) jest wpisany wprost w [`firebase-panel-najmu/functions/index.js`](firebase-panel-najmu/functions/index.js) — zmień go tam, jeśli kiedyś będzie inny.

   Wysyłka maili idzie przez SMTP Twojej istniejącej skrzynki Zoho (`smtp.zoho.eu`, port 465) — nie zakładamy osobnego konta u zewnętrznego dostawcy. W ustawieniach Zoho Mail upewnij się, że dostęp **IMAP/POP/SMTP** jest włączony dla tego konta (Zoho Mail → Settings → Mail Accounts → [Twój adres] → IMAP Access, tam też zwykle jest przełącznik dla SMTP).

   Uwaga: stare `functions.config()` (z którego korzystał wcześniejszy szkic tego pliku) Google wyłączył pod koniec 2025 roku — obecny kod używa aktualnego mechanizmu (`firebase-functions/params` + Secret Manager), więc `firebase functions:config:set` **nie jest już używane**.

   (Hosting Firebase **nie jest używany** — stronę serwuje Vercel.)

## 2. Hasło do panelu (Vercel)

W ustawieniach projektu na Vercel → **Settings → Environment Variables** dodaj (dla środowisk Production i Preview):

- `PANEL_NAJMU_USER` — login
- `PANEL_NAJMU_PASSWORD` — hasło

Bez tych zmiennych `middleware.ts` celowo blokuje dostęp (fail-closed), więc panel nie zostanie przypadkiem odsłonięty publicznie.

## 3. Deploy

Zwykły `git push` na branch, z którego wdraża Vercel — build (`npm run build`) automatycznie dołączy pliki panelu. Po wdrożeniu:

- `https://iglo-bus.rent/panel-najmu` → przeglądarka poprosi o login/hasło (Basic Auth), potem wczyta aplikację.
- Na telefonie: Chrome → menu (⋮) → „Dodaj do ekranu głównego" — działa jak zwykła aplikacja.

## 4. Samoobsługowy protokół przez link + hasło (dla najemcy)

Poza panelem operatora (Basic Auth) jest osobna, publiczna mini-aplikacja pod `iglo-bus.rent/panel-najmu/protokol` (`client/public/panel-najmu/protokol/`) — **celowo poza Basic Authem** (patrz wyjątek w `middleware.ts`), bo to najemca ją otwiera, nie mając loginu/hasła do panelu.

Jak to działa:

1. Pracownik w panelu klika **„+ Nowy protokół (link dla najemcy)”**, wpisuje pojazd (+ opcjonalnie dane najemcy) i **ręcznie ustala hasło do tego jednego protokołu**. Powstaje wynajem w statusie `szkic` + link `iglo-bus.rent/panel-najmu/protokol/#<ID_wynajmu>`.
2. Pracownik przekazuje ten link i hasło najemcy (SMS/telefon) — poza aplikacją, nie ma automatycznej wysyłki.
3. Najemca otwiera link, podaje hasło → Cloud Function `verifyProtocolPassword` (patrz `firebase-panel-najmu/functions/index.js`) weryfikuje je i wydaje Firebase custom token zawężony do TEGO JEDNEGO wynajmu (claim `protocolAccess`, patrz `firestore.rules`/`storage.rules`) — bez logowania do panelu i bez dostępu do reszty bazy (pojazdów/najemców/innych wynajmów).
4. Najemca wypełnia i finalizuje protokół wydania (zdjęcia, podpis, PDF, e-mail) samodzielnie. To samo hasło, pod tym samym linkiem, obsługuje też zwrot pojazdu — nie trzeba go ustawiać drugi raz.
5. Pracownik może w każdej chwili dokończyć/edytować ten sam protokół z panelu, przez zwykłe logowanie — zakładka **„Szkice protokołów”** na liście pokazuje protokoły oczekujące na najemcę.

Nowa kolekcja Firestore `protocolAccess/{rentalId}` trzyma tylko hash hasła (bcrypt) — reguły blokują jej odczyt/zapis całkowicie, dotyka jej wyłącznie Admin SDK w Cloud Functions. Hasła są automatycznie kasowane razem ze zdjęciami po 10 dniach od zamknięcia wynajmu (patrz `cleanupOldRentals`).

Ten sam deploy z kroku 1 (`firebase deploy --only functions,firestore:rules,storage`) wdraża też te zmiany — nic dodatkowego nie trzeba konfigurować poza tym, co już jest w kroku 1 (`cd functions && npm install` doinstaluje `bcryptjs`).

## Uwaga o bezpieczeństwie

Basic Auth chroni tylko przed przypadkowym/niezalogowanym dostępem do adresu URL — to nie jest silne zabezpieczenie (hasło leci w każdym żądaniu, tylko szyfrowane przez HTTPS). Właściwą warstwą ochrony danych najemców są reguły Firestore/Storage (`firebase-panel-najmu/firestore.rules`, `storage.rules`), które i tak wymagają zalogowania (anonimowego) do Firebase. Jeśli w przyszłości panel będzie obsługiwać więcej niż jedną osobę, warto przejść na właściwy ekran logowania zamiast Basic Auth.
