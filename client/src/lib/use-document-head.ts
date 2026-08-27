import { useEffect } from "react";

// react-helmet-async w tym projekcie nie aktualizuje <head> przy zmianie
// trasy (potwierdzone: tytuł karty i canonical zostają przy statycznych
// wartościach z client/index.html na każdej stronie, nie tylko na /en i
// /cs) — błąd sprzed tej zmiany, prawdopodobnie związany z tym, że wouter
// nie odmontowuje komponentu strony przy przełączaniu między pasującymi
// trasami. Dla strony głównej (jedynej, którą tłumaczymy) ustawiamy więc
// najważniejsze tagi ręcznie, bezpośrednio w DOM — niezależnie od Helmeta.

type LinkTag = { rel: string; href: string; hrefLang?: string };
type MetaTag = { attr: "name" | "property"; key: string; content: string };

export interface DocumentHeadConfig {
  title: string;
  description: string;
  canonical: string;
  links: LinkTag[];
  metas: MetaTag[];
  jsonLd: Record<string, unknown>[];
}

function upsertLink(tag: LinkTag, index: number) {
  const selector = tag.hrefLang
    ? `link[data-managed-head][rel="${tag.rel}"][hreflang="${tag.hrefLang}"]`
    : `link[data-managed-head][rel="${tag.rel}"][data-index="${index}"]`;
  let el = document.head.querySelector<HTMLLinkElement>(selector);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("data-managed-head", "true");
    el.rel = tag.rel;
    if (tag.hrefLang) el.hreflang = tag.hrefLang;
    else el.setAttribute("data-index", String(index));
    document.head.appendChild(el);
  }
  el.href = tag.href;
}

function upsertMeta(tag: MetaTag) {
  // Najpierw szukamy istniejącego taga (np. statycznego z client/index.html)
  // i podmieniamy jego treść — dopiero gdy go nie ma, dokładamy nowy.
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${tag.attr}="${tag.key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(tag.attr, tag.key);
    el.setAttribute("data-managed-head", "true");
    document.head.appendChild(el);
  }
  el.setAttribute("content", tag.content);
}

function upsertJsonLd(items: Record<string, unknown>[]) {
  document.head.querySelectorAll('script[data-managed-jsonld]').forEach((el) => el.remove());
  items.forEach((item) => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-managed-jsonld", "true");
    script.textContent = JSON.stringify(item);
    document.head.appendChild(script);
  });
}

/** Ustawia title/description/canonical/hreflang/OG/Twitter/JSON-LD ręcznie w DOM. */
export function useDocumentHead(config: DocumentHeadConfig) {
  useEffect(() => {
    document.title = config.title;

    let canonicalEl = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement("link");
      canonicalEl.rel = "canonical";
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.href = config.canonical;

    config.links.forEach(upsertLink);
    config.metas.forEach(upsertMeta);
    upsertJsonLd(config.jsonLd);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.title, config.description, config.canonical]);
}
