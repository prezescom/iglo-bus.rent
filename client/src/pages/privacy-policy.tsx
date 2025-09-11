import { ArrowLeft, Shield, FileText, Users, Clock, Database, Share2, Cookie } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-brand-blue hover:text-brand-blue/80 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Powrót do strony głównej</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 md:p-8">
          {/* Hero Section */}
          <div className="text-center mb-8 pb-8 border-b border-slate-200">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-2xl bg-brand-light grid place-items-center">
                <Shield className="h-8 w-8 text-brand-blue" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-brand-dark mb-3">
              Polityka Prywatności
            </h1>
            <p className="text-lg text-slate-600">
              Strony internetowej IGLO-BUS.RENT
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Zgodnie z RODO i przepisami o cookies
            </p>
          </div>

          {/* Introduction */}
          <section className="mb-8">
            <div className="prose prose-slate max-w-none">
              <div className="bg-brand-light border border-brand-blue/20 rounded-xl p-6 mb-6">
                <h2 className="text-xl font-bold text-brand-dark mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-brand-blue" />
                  Wprowadzenie
                </h2>
                <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
                  <p>
                    <strong>I/</strong> Dla Właściciela niniejszej strony internetowej, ochrona danych osobowych 
                    Użytkowników jest sprawą najwyższej wagi. Dokłada on ogrom starań, aby 
                    Użytkownicy czuli się bezpiecznie, powierzając swoje dane osobowe w trakcie 
                    korzystania ze strony internetowej.
                  </p>
                  <p>
                    <strong>II/</strong> Przetwarzane są dane osobowe Użytkowników tylko w zakresie niezbędnym 
                    do zapewnienia funkcjonalnej strony internetowej i usług. Dane osobowe 
                    Użytkowników są przetwarzane wyłącznie za ich zgodą.
                  </p>
                  <p>
                    <strong>III/</strong> Użytkownik to osoba fizyczna, osoba prawna albo jednostka organizacyjna, 
                    nieposiadająca osobowości prawnej, której ustawa przyznaje zdolność prawną, 
                    korzystająca z usług elektronicznych, dostępnych w ramach strony internetowej.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Administrator */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-brand-dark mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-brand-blue" />
              I. Administrator Danych Osobowych
            </h2>
            <div className="bg-slate-50 rounded-xl p-6">
              <p className="text-sm text-slate-700 leading-relaxed">
                Administratorem danych osobowych jest Przedsiębiorca <strong>Pan Jacek Małachowski</strong>, 
                prowadzący działalność gospodarczą pod firmą: <strong>FBS Jacek Małachowski</strong>, z siedzibą 
                przy: <strong>Gliwicka 15b, 44-178 Przyszowice</strong>, NIP: <strong>9691533725</strong>.
              </p>
            </div>
          </section>

          {/* Cele przetwarzania */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-brand-dark mb-4 flex items-center gap-2">
              <Database className="h-5 w-5 text-brand-blue" />
              II. Cel Przetwarzania Danych Osobowych
            </h2>
            <div className="space-y-4">
              <p className="text-sm text-slate-600 mb-4">
                Administrator przetwarza dane osobowe Użytkownika w celu:
              </p>
              <div className="grid gap-3">
                <div className="flex gap-3 p-4 bg-slate-50 rounded-lg">
                  <div className="w-2 h-2 bg-brand-blue rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong className="text-sm text-brand-dark">Zawarcia i wykonania umowy wynajmu samochodu</strong>
                    <p className="text-xs text-slate-600 mt-1">(podstawa z art. 6 ust 1 lit. b RODO)</p>
                  </div>
                </div>
                <div className="flex gap-3 p-4 bg-slate-50 rounded-lg">
                  <div className="w-2 h-2 bg-brand-blue rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong className="text-sm text-brand-dark">Obsługi bieżących czynności</strong>
                    <p className="text-xs text-slate-600 mt-1">(podstawa z art. 6 ust. 1 lit. f RODO)</p>
                  </div>
                </div>
                <div className="flex gap-3 p-4 bg-slate-50 rounded-lg">
                  <div className="w-2 h-2 bg-brand-blue rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong className="text-sm text-brand-dark">Celów archiwalnych lub dowodowych</strong>
                    <p className="text-xs text-slate-600 mt-1">(podstawa z art. 6 ust. 1 lit. f RODO)</p>
                  </div>
                </div>
                <div className="flex gap-3 p-4 bg-slate-50 rounded-lg">
                  <div className="w-2 h-2 bg-brand-blue rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong className="text-sm text-brand-dark">Dochodzenia należnych zobowiązań</strong>
                    <p className="text-xs text-slate-600 mt-1">(podstawa z art. 6 ust. 1 lit. f RODO)</p>
                  </div>
                </div>
                <div className="flex gap-3 p-4 bg-slate-50 rounded-lg">
                  <div className="w-2 h-2 bg-brand-blue rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong className="text-sm text-brand-dark">Marketingu bezpośredniego</strong>
                    <p className="text-xs text-slate-600 mt-1">(na podstawie zgody użytkownika)</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Prawa użytkownika */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-brand-dark mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-brand-blue" />
              V. Prawa Przysługujące Użytkownikowi
            </h2>
            <div className="space-y-3">
              <div className="p-4 border border-slate-200 rounded-lg">
                <h3 className="font-semibold text-sm text-brand-dark mb-2">Prawo dostępu do danych</h3>
                <p className="text-xs text-slate-600">Możesz zażądać informacji o zakresie przetwarzania swoich danych osobowych.</p>
              </div>
              <div className="p-4 border border-slate-200 rounded-lg">
                <h3 className="font-semibold text-sm text-brand-dark mb-2">Prawo do sprostowania</h3>
                <p className="text-xs text-slate-600">Możesz zażądać poprawienia lub sprostowania swoich danych osobowych.</p>
              </div>
              <div className="p-4 border border-slate-200 rounded-lg">
                <h3 className="font-semibold text-sm text-brand-dark mb-2">Prawo do wycofania zgody</h3>
                <p className="text-xs text-slate-600">Możesz w każdej chwili wycofać zgodę na przetwarzanie danych bez podania przyczyny.</p>
              </div>
              <div className="p-4 border border-slate-200 rounded-lg">
                <h3 className="font-semibold text-sm text-brand-dark mb-2">Prawo do usunięcia danych</h3>
                <p className="text-xs text-slate-600">Możesz zażądać usunięcia swoich danych osobowych.</p>
              </div>
              <div className="p-4 border border-slate-200 rounded-lg">
                <h3 className="font-semibold text-sm text-brand-dark mb-2">Prawo do przenoszenia danych</h3>
                <p className="text-xs text-slate-600">Możesz zażądać przekazania swoich danych innemu podmiotowi.</p>
              </div>
            </div>
          </section>

          {/* Okres przechowywania */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-brand-dark mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-brand-blue" />
              VI. Okres Przechowywania Danych Osobowych
            </h2>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <div className="space-y-3 text-sm text-slate-700">
                <p>
                  <strong>Dane umowne:</strong> Przechowywane przez 3 lata od zakończenia relacji handlowych w celach dowodowych.
                </p>
                <p>
                  <strong>Dane archiwalne:</strong> Mogą być zachowane dłużej w związku z roszczeniami z tytułu rękojmi.
                </p>
                <p>
                  <strong>Dane bez umowy:</strong> Przechowywane do momentu usunięcia konta lub wycofania zgody.
                </p>
              </div>
            </div>
          </section>

          {/* Cookies */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-brand-dark mb-4 flex items-center gap-2">
              <Cookie className="h-5 w-5 text-brand-blue" />
              VIII. Pliki Cookies
            </h2>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="font-semibold text-sm text-brand-dark mb-3">Czym są pliki cookies?</h3>
                <p className="text-sm text-slate-700 leading-relaxed mb-4">
                  Pliki cookies to fragmenty informacji, które zawierają unikalny kod referencyjny, 
                  który strona internetowa przesyła na urządzenie Użytkownika w celu przechowywania 
                  informacji dotyczących używanego urządzenia.
                </p>
                <h3 className="font-semibold text-sm text-brand-dark mb-3">Do czego używamy cookies?</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                  <li>Zbierania informacji o dostępie do strony internetowej</li>
                  <li>Analizy preferencji użytkowników</li>
                  <li>Celów reklamowych i statystycznych</li>
                  <li>Dostosowania strony do indywidualnych potrzeb</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Kontakt */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-brand-dark mb-4 flex items-center gap-2">
              <Share2 className="h-5 w-5 text-brand-blue" />
              Kontakt w sprawach danych osobowych
            </h2>
            <div className="bg-slate-50 rounded-xl p-6">
              <div className="space-y-3 text-sm text-slate-700">
                <p><strong>Administrator:</strong> FBS Jacek Małachowski</p>
                <p><strong>Adres:</strong> Gliwicka 15b, 44-178 Przyszowice</p>
                <p><strong>Email:</strong> <a href="/kontakt" className="text-brand-blue hover:underline">kontakt@iglo-bus.rent</a></p>
                <p><strong>Telefon:</strong> <a href="tel:+48530410504" className="text-brand-blue hover:underline">+48 530 410 504</a></p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="border-t border-slate-200 pt-6 text-center">
            <p className="text-xs text-slate-500 mb-4">
              Niniejsza polityka prywatności jest zgodna z przepisami RODO 
              i obowiązuje od dnia publikacji na stronie internetowej.
            </p>
            <Link href="/">
              <Button className="bg-brand-blue hover:bg-brand-blue/90">
                Powrót do strony głównej
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}