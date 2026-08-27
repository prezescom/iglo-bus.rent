import { Link, useLocation } from "wouter";
import { LANGUAGES, langFromPath, type Lang } from "@/lib/i18n/use-language";

// Proste, samodzielne flagi SVG (bez zależności od emoji, które na części
// systemów/przeglądarek renderują się jako kod kraju zamiast ikony).
function FlagPL({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 16" className={className} role="img" aria-hidden="true">
      <rect width="24" height="16" fill="#fff" />
      <rect width="24" height="8" y="8" fill="#dc143c" />
    </svg>
  );
}

function FlagGB({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 16" className={className} role="img" aria-hidden="true">
      <rect width="24" height="16" fill="#00247d" />
      <path d="M0,0 L24,16 M24,0 L0,16" stroke="#fff" strokeWidth="3" />
      <path d="M0,0 L24,16 M24,0 L0,16" stroke="#cf142b" strokeWidth="1" />
      <path d="M12,0 V16 M0,8 H24" stroke="#fff" strokeWidth="5" />
      <path d="M12,0 V16 M0,8 H24" stroke="#cf142b" strokeWidth="3" />
    </svg>
  );
}

function FlagCZ({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 16" className={className} role="img" aria-hidden="true">
      <rect width="24" height="16" fill="#fff" />
      <rect width="24" height="8" y="8" fill="#d7141a" />
      <path d="M0,0 L12,8 L0,16 Z" fill="#11457e" />
    </svg>
  );
}

const FLAG_BY_LANG: Record<Lang, (props: { className?: string }) => JSX.Element> = {
  pl: FlagPL,
  en: FlagGB,
  cs: FlagCZ,
};

export default function LanguageSwitcher() {
  const [location] = useLocation();
  const activeLang = langFromPath(location);

  return (
    <div className="flex items-center gap-1.5" data-testid="language-switcher" aria-label="Wybór wersji językowej">
      {LANGUAGES.map(({ code, label, path }) => {
        const Flag = FLAG_BY_LANG[code];
        const isActive = activeLang === code;
        return (
          <Link
            key={code}
            href={path}
            aria-label={label}
            aria-current={isActive ? "page" : undefined}
            title={label}
            className={[
              "block rounded-[3px] overflow-hidden border transition-all",
              isActive
                ? "border-brand-blue ring-2 ring-brand-blue/40 scale-105"
                : "border-slate-200 opacity-70 hover:opacity-100 hover:border-brand-blue/40",
            ].join(" ")}
            data-testid={`language-switch-${code}`}
          >
            <Flag className="h-4 w-6 block" />
          </Link>
        );
      })}
    </div>
  );
}
