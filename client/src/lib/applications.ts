import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type EmploymentStatus = "student" | "etat" | "przedsiebiorca" | "bezrobotny" | "emeryt";
export type EmploymentForm = "umowa_o_prace" | "zlecenie" | "b2b";
export type StartAvailability = "jutro" | "nowy_miesiac" | "pozniej";
export type SalaryExpectation = "5000" | "5500" | "6000" | "6500" | "7000";

export const VOIVODESHIPS = [
  "Dolnośląskie",
  "Kujawsko-Pomorskie",
  "Lubelskie",
  "Lubuskie",
  "Łódzkie",
  "Małopolskie",
  "Mazowieckie",
  "Opolskie",
  "Podkarpackie",
  "Podlaskie",
  "Pomorskie",
  "Śląskie",
  "Świętokrzyskie",
  "Warmińsko-Mazurskie",
  "Wielkopolskie",
  "Zachodniopomorskie",
] as const;
export type Voivodeship = (typeof VOIVODESHIPS)[number];

export type JobApplicationInput = {
  firstName: string;
  lastName: string;
  birthYear: number;
  city: string;
  voivodeship: Voivodeship;
  phone: string;
  email: string;
  employmentStatus: EmploymentStatus;
  employmentForm: EmploymentForm;
  licenseYear: number;
  experienceDelivery: boolean;
  experienceMeds: boolean;
  partTimeOk: boolean;
  startAvailability: StartAvailability;
  salaryExpectation: SalaryExpectation;
};

// Stanowisko obsługiwane przez ten formularz — trzymane razem z każdą
// aplikacją, żeby dało się w przyszłości dodać kolejne formularze/stanowiska
// bez zmiany struktury kolekcji "applications" w Firestore.
export const JOB_POSITION = "Kierowca kat. B - transport leków";

// Zapis trafia bezpośrednio do Firestore z przeglądarki (ten sam projekt
// Firebase co blog/panel najmu — patrz client/src/lib/firebase.ts). Reguły
// Firestore (firebase-panel-najmu/firestore.rules) pozwalają publicznie
// tylko na "create" w kolekcji "applications", bez odczytu/edycji/usuwania —
// dalszą obsługę (mail do kandydata, powiadomienie, wpis do Excela,
// czyszczenie po 90 dniach) robi Cloud Function po stronie serwera.
export async function submitJobApplication(input: JobApplicationInput): Promise<void> {
  await addDoc(collection(db, "applications"), {
    ...input,
    position: JOB_POSITION,
    createdAt: Date.now(),
  });
}
