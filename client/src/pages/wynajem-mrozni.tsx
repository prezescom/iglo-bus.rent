import { Helmet } from "react-helmet-async";

export default function WynajemMrozni() {
  return (
    <main className="px-4 max-w-5xl mx-auto">
      <Helmet>
        <title>Wynajem samochodów mroźni – Śląsk | Iglo-Bus Rent</title>
        <meta name="description" content="Wynajem mroźni (-20°C do +20°C), Sanepid, drukarka temperatur Esco DR201. Gliwice, Katowice i okolice. Krótkoterminowo i długoterminowo." />
        <link rel="canonical" href="https://www.iglo-bus.rent/wynajem-mrozni" />
        <meta name="robots" content="index,follow" />
        <meta property="og:title" content="Wynajem samochodów mroźni – Iglo-Bus Rent" />
        <meta property="og:description" content="Mroźnie -20°C do +20°C, Sanepid, wydruk temperatur. Śląsk: Gliwice, Katowice, okolice." />
        <meta property="og:url" content="https://www.iglo-bus.rent/wynajem-mrozni" />
        <script type="application/ld+json">{JSON.stringify({
          "@context":"https://schema.org",
          "@type":"LocalBusiness",
          name:"Iglo-Bus Rent",
          url:"https://www.iglo-bus.rent/wynajem-mrozni",
          telephone:"+48XXXXXXXXX",
          areaServed:"Śląskie",
          address:{ "@type":"PostalAddress", addressRegion:"Śląskie", addressCountry:"PL" },
          priceRange:"$$"
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context":"https://schema.org",
          "@type":"FAQPage",
          mainEntity:[
            { "@type":"Question", name:"Ile kosztuje wynajem samochodu mroźni na 1 dzień?", acceptedAnswer:{ "@type":"Answer", text:"Stawka zależy od modelu i przebiegu. Podaj termin i trasę — przygotujemy wycenę." }},
            { "@type":"Question", name:"Czy dostanę wydruk temperatur dla odbiorcy?", acceptedAnswer:{ "@type":"Answer", text:"Tak, rejestrator Esco DR201 umożliwia szybki wydruk." }},
            { "@type":"Question", name:"Czy mogę wynająć mroźnię na dłużej (1–3 miesiące)?", acceptedAnswer:{ "@type":"Answer", text:"Tak, oferujemy lepsze stawki i serwis przy najmie długoterminowym." }}
          ]
        })}</script>
      </Helmet>

      <section className="grid md:grid-cols-2 gap-6 py-10">
        <div>
          <h1 className="text-3xl md:text-5xl font-extrabold">Wynajem samochodów mroźni — Gliwice, Katowice, Śląsk</h1>
          <p className="text-slate-300 mt-3">Zakres <b>-20°C do +20°C</b>, zabudowy z <b>atestem Sanepid</b>, <b>wydruk z rejestratora (Esco DR201)</b>, najem krótko- i długoterminowy, szybka podmiana auta.</p>
          <div className="flex gap-3 mt-4 flex-wrap">
            <a className="rounded-2xl px-4 py-3 font-bold bg-cyan-400 text-slate-900" href="tel:+48XXXXXXXXX">Zadzwoń teraz</a>
            <a className="rounded-2xl px-4 py-3 font-bold border border-cyan-400 text-cyan-400" href="/kontakt">Zapytaj o dostępność</a>
          </div>
          <p className="text-slate-400 text-sm mt-2">Obsługujemy Śląsk i okolice. Odbiór w Gliwicach / dostawa do klienta.</p>
        </div>
        <img className="w-full rounded-2xl border border-slate-700" src="/images/mrozna-hero.jpg" alt="Samochód mroźnia do wynajęcia — Iglo-Bus Rent" loading="lazy" />
      </section>

      <section>
        <h2 className="text-2xl md:text-3xl font-bold">Dlaczego mroźnia od Iglo-Bus Rent</h2>
        <div className="grid md:grid-cols-3 gap-4 mt-3">
          {[
            ["Pełna zgodność","Zabudowy z atestem Sanepid, czysta dokumentacja."],
            ["Kontrola temperatury","Rejestrator Esco DR201 — szybkie wydruki."],
            ["Elastyczny najem","Dzień, tydzień, miesiąc — dopasowujemy stawki."],
            ["Szybki start","Dostępność „od ręki”, podstawienie pod adres."],
            ["Ekonomia","Nowoczesna flota = niskie zużycie."],
            ["Wsparcie","Telefon 7 dni w tygodniu, szybka podmiana."]
          ].map(([t, d]) => (
            <div key={t} className="rounded-2xl border border-slate-700 p-4 bg-slate-900/40">
              <b>{t}</b><br/>{d}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-700 p-4 bg-slate-900/40">
          <h2 className="text-xl font-bold mb-2">Parametry techniczne</h2>
          <ul className="list-disc pl-5">
            <li>Temperatura: <b>-20°C do +20°C</b></li>
            <li>Zabudowy: izotermy / chłodnie / mroźnie</li>
            <li>Rejestrator: <b>Esco DR201</b> (wydruki)</li>
            <li>Zasilanie: agregat + opcjonalne <b>230V</b></li>
            <li>Wyposażenie: półki, punkty mocowania</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-700 p-4 bg-slate-900/40">
          <h2 className="text-xl font-bold mb-2">Warunki wynajmu</h2>
          <ul className="list-disc pl-5">
            <li>Atest Sanepid, dokumentacja do odbiorów</li>
            <li>Śląsk + okolice, dostawa/odbiór</li>
            <li>Faktury VAT, umowa online</li>
            <li>Krótkoterminowo i długoterminowo</li>
          </ul>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl md:text-3xl font-bold">Przykładowe auta mroźnie</h2>
        <div className="grid md:grid-cols-2 gap-4 mt-3">
          <div className="rounded-2xl border border-slate-700 p-3 bg-slate-900/40">
            <img className="w-full rounded-xl border border-slate-700" src="/images/mrozna-1.jpg" alt="Mroźnia klasy L2H2 — przykładowy model" loading="lazy"/>
            <p className="text-slate-400 text-sm mt-2">Typ L2H2 — idealny do dystrybucji miejskiej.</p>
          </div>
          <div className="rounded-2xl border border-slate-700 p-3 bg-slate-900/40">
            <img className="w-full rounded-xl border border-slate-700" src="/images/mrozna-2.jpg" alt="Mroźnia z zasilaniem 230V" loading="lazy"/>
            <p className="text-slate-400 text-sm mt-2">Opcja 230V — utrzymanie temperatury podczas postoju.</p>
          </div>
        </div>
        <p className="mt-3">
          <a className="rounded-2xl px-4 py-3 font-bold border border-cyan-400 text-cyan-400 inline-block" href="/flota">Zobacz pełną flotę</a>
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl md:text-3xl font-bold">FAQ — wynajem mroźni</h2>
        <div className="grid gap-3 mt-2">
          {[
            ["Ile kosztuje wynajem samochodu mroźni na 1 dzień?","Stawka zależy od modelu i przebiegu. Podaj termin i trasę — przygotujemy wycenę."],
            ["Czy dostanę wydruk temperatur dla odbiorcy?","Tak. Rejestrator Esco DR201 umożliwia szybki wydruk z całej trasy."],
            ["Czy mogę wynająć mroźnię na dłużej (1–3 miesiące)?","Tak. Przy najmie długoterminowym oferujemy lepsze stawki i serwis."]
          ].map(([q,a]) => (
            <details key={q} className="rounded-2xl border border-slate-700 p-4 bg-slate-900/40">
              <summary className="font-bold cursor-pointer">{q}</summary>
              <p className="mt-2">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-10 text-center">
        <h2 className="text-2xl md:text-3xl font-bold">Sprawdź dostępność</h2>
        <p className="text-slate-400">Odpowiadamy szybko — zwykle w kilkanaście minut.</p>
        <div className="flex gap-3 justify-center mt-3">
          <a className="rounded-2xl px-4 py-3 font-bold bg-cyan-400 text-slate-900" href="tel:+48XXXXXXXXX">Zadzwoń</a>
          <a className="rounded-2xl px-4 py-3 font-bold border border-cyan-400 text-cyan-400" href="/kontakt">Wyślij zapytanie</a>
        </div>
      </section>
    </main>
  );
}