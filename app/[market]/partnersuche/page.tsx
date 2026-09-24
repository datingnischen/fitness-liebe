import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CitySearchFallback } from "@/components/city-search-fallback";
import { MarketLink } from "@/components/market-link";
import { getMarketPartnersucheHub } from "@/lib/market-partnersuche";
import { LOCATION_REGISTRATION_URL, getMarket, isMarketCode, marketAlternates, publicUrl, type MarketCode } from "@/lib/markets";

type PageProps = { params: Promise<{ market: string }> };

async function loadHub(params: PageProps["params"]) {
  const { market } = await params;
  const hub = isMarketCode(market) ? getMarketPartnersucheHub(market) : null;
  if (!hub) notFound();
  return hub;
}

export const revalidate = 86400;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const hub = await loadHub(params);
  const market: MarketCode = hub.market;
  return {
    title: hub.title,
    description: hub.description,
    alternates: marketAlternates(market, "/partnersuche"),
    openGraph: { title: hub.title, description: hub.description, url: publicUrl(market, "/partnersuche") },
  };
}

export default async function PartnersucheHubPage({ params }: PageProps) {
  const hub = await loadHub(params);
  const { market } = hub;
  const { countryName } = getMarket(market);
  return (
    <main className="shell shell-narrow">
      <section className="hero-card hero-brand">
        <span className="eyebrow">Partnersuche für Sportliche · {countryName}</span>
        <h1>{hub.title}</h1>
        <p>{hub.description}</p>
        <div className="chip-row">
          <span className="trust-chip">{hub.cities.length} regionale Stadtseiten</span>
          <span className="trust-chip">Echte Profilvorschauen</span>
          <span className="trust-chip">Laufstrecken & Outdoor-Parks</span>
        </div>
        <div className="button-row">
          <a className="button button-primary" href={LOCATION_REGISTRATION_URL}>Kostenlos sportliche Singles finden</a>
          <MarketLink className="button button-secondary" market={market} path="/magazin">Zum Fitness-Magazin</MarketLink>
        </div>
      </section>

      {hub.editorial.heroImageUrl ? (
        <section className="content-section">
          <figure className="article-hero-media">
            <img src={hub.editorial.heroImageUrl} alt={hub.editorial.heroImageAlt || hub.title} loading="eager" decoding="async" />
          </figure>
        </section>
      ) : null}

      <section className="content-section">
        <article className="panel-card">
          <div className="section-header">
            <span className="eyebrow">Städteübersicht</span>
            <h2>Wähle deine Stadt für den regionalen Einstieg</h2>
            <p>Jede Stadtseite verbindet aktuelle Profile mit Laufrouten, Parks und Trainingsorten – und Tipps für ein aktives Kennenlernen.</p>
          </div>
          {hub.editorial.introParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <div className="city-grid">
            {hub.cities.map((city) => (
              <MarketLink key={city.slug} className="city-card city-card-with-media" market={market} path={city.href}>
                {city.imageUrl ? (
                  <div className="city-card-media">
                    <img src={city.imageUrl} alt={city.imageAlt || `Sportliche Singles in ${city.cityName}`} loading="lazy" decoding="async" />
                  </div>
                ) : null}
                <div className="city-card-copy">
                  <span className="eyebrow eyebrow-muted">Sportliche Singles</span>
                  <h3>{city.cityName}</h3>
                  <p>Singles {city.cityName} entdecken</p>
                </div>
              </MarketLink>
            ))}
          </div>
          <CitySearchFallback />
        </article>
      </section>

      {hub.editorial.sections.map((section) => (
        <section key={section.heading} className="content-section">
          <article className="panel-card">
            {section.imageUrl ? (
              <figure className="article-hero-media">
                <img src={section.imageUrl} alt={section.imageAlt || section.heading} loading="lazy" decoding="async" />
              </figure>
            ) : null}
            <div className="section-header">
              <span className="eyebrow">Fitness-Dating in {countryName}</span>
              <h2>{section.heading}</h2>
            </div>
            {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </article>
        </section>
      ))}

      <p className="image-credit">
        Bildquellen: <a href="https://pixabay.com/de/photos/paar-fitnessstudio-%C3%BCbung-fitness-7437534/" rel="nofollow noopener">Pixabay</a>,{" "}
        <a href="https://pixabay.com/de/photos/yoga-drau%C3%9Fen-sonnenaufgang-6723315/" rel="nofollow noopener">Pixabay</a>
      </p>
    </main>
  );
}
