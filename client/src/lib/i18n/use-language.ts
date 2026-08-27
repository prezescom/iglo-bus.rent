import { useLocation } from "wouter";
import { dictionaries, LANGUAGES, type Lang } from "./translations";

export function langFromPath(path: string): Lang {
  if (path === "/en" || path.startsWith("/en/")) return "en";
  if (path === "/cs" || path.startsWith("/cs/")) return "cs";
  return "pl";
}

/**
 * Język strony wynika wyłącznie z prefiksu ścieżki ("/", "/en", "/cs") —
 * dotyczy to tylko strony głównej, reszta serwisu zostaje po polsku.
 */
export function useLanguage() {
  const [location] = useLocation();
  const lang = langFromPath(location);
  return { lang, t: dictionaries[lang] };
}

export function isHomeRoute(path: string): boolean {
  return path === "/" || path === "/en" || path === "/cs";
}

export { LANGUAGES };
export type { Lang };
