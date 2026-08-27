import { Snowflake } from "lucide-react";
import { useLanguage } from "@/lib/i18n/use-language";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-brand-dark text-white" data-testid="footer">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-8 rounded-xl bg-brand-blue/20 grid place-items-center">
                <Snowflake className="h-4 w-4 text-brand-blue" />
              </div>
              <span className="font-bold text-lg">Iglo-bus.rent</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              {t.footer.tagline}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t.footer.contactTitle}</h4>
            <div className="space-y-2 text-sm text-slate-300">
              <p>
                {t.footer.emailLabel}:{" "}
                <a
                  href="/kontakt"
                  className="text-brand-blue hover:underline"
                  data-testid="footer-email"
                >
                  kontakt@iglo-bus.rent
                </a>
              </p>
              <p>
                {t.footer.phoneLabel}:{" "}
                <a
                  href="tel:+48530410504"
                  className="text-brand-blue hover:underline"
                  data-testid="footer-phone"
                >
                  +48 530 410 504
                </a>
              </p>
              <p>
                {t.footer.addressLabel}:{" "}
                <a
                  href="https://maps.app.goo.gl/HHsdXgeZWMpkHRqy9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-blue hover:underline cursor-pointer"
                  data-testid="footer-address"
                  title={t.footer.mapTooltip}
                >
                  {t.footer.address}
                </a>
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t.footer.servicesTitle}</h4>
            <div className="space-y-2 text-sm text-slate-300">
              <p>{t.footer.service1}</p>
              <p>{t.footer.service2}</p>
              <p>{t.footer.service3}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-8 text-center text-sm text-slate-400">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-4">
            <a
              href="/blog"
              className="text-brand-blue hover:underline"
              data-testid="footer-blog"
            >
              {t.footer.blog}
            </a>
            <span className="hidden sm:inline">•</span>
            <a
              href="/praca"
              className="text-brand-blue hover:underline"
              data-testid="footer-praca"
            >
              {t.footer.praca}
            </a>
            <span className="hidden sm:inline">•</span>
            <a
              href="/polityka-prywatnosci"
              className="text-brand-blue hover:underline"
              data-testid="footer-privacy-policy"
            >
              {t.footer.privacy}
            </a>
            <span className="hidden sm:inline">•</span>
            <a
              href="/kontakt"
              className="text-brand-blue hover:underline"
            >
              {t.footer.contactRodo}
            </a>
          </div>
          <p>{t.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
