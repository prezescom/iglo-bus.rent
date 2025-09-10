import { Link } from "wouter";
import { Helmet } from "react-helmet-async";

export default function WynajemChlodni() {
  const canonical = "https://www.iglo-bus.rent/wynajem-chlodni";

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Wynajem samochodów chłodni – Śląsk | Iglo-Bus Rent</title>
        <meta
          name="description"
          content="Wynajem samochodów chłodni z atestem Sanepid i kontrolą temperatury. Krótko- i długoterminowo."
        />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Wynajem samochodów chłodni – Iglo-Bus Rent" />
        <meta property="og:description" content="Chłodnie z atestem Sanepid. Krótko- i długoterminowo, szybkie podstawienie." />
        <meta property="og:image" content="https://www.iglo-bus.rent/images/og-home-1200.jpg" />
      </Helmet>

      <header className="border-b bg-white sticky top-0 z-40">
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-semibold">Iglo-bus.rent</Link>
          <a href="mailto:kontakt@iglo-bus.rent" className="text-sm">kontakt@iglo-bus.rent</a>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <section className="rounded-2xl overflow-hidden border">
          <img
            src="/images/chlodnie-hero-1280.jpg"
            alt="Samochód chłodnia – zdjęcie poglądowe"
            width={1280} height={640}
            className="w-full h-64 object-cover"
          />
        </section>

        <h1 className="mt-6 text-3xl font-bold">Wynajem samochodów chłodni</h1>
        <p className="mt-2 text-slate-700">
          Opisz w 2–3 zdaniach usługę i korzyści (zakres temperatur, dokumenty, szybkie podstawienie).
        </p>

        <div className="mt-6 flex gap-3">
          <a href="tel:+48530410504" className="bg-sky-600 text-white px-5 py-3 rounded-xl font-semibold">Zadzwoń: +48 530 410 504</a>
          <a href="mailto:kontakt@iglo-bus.rent" className="border-2 border-sky-600 text-sky-700 px-5 py-3 rounded-xl font-semibold">Wyślij zapytanie</a>
        </div>
      </main>
    </div>
  );
}