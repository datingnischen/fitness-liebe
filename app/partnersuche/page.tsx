import type { Metadata } from "next";
import { MarketLink } from "@/components/market-link";
import { getMarketPartnersucheHub } from "@/lib/market-partnersuche";
import { LOCATION_REGISTRATION_URL, publicUrl } from "@/lib/markets";

export const revalidate = 86400;

export function generateMetadata(): Metadata {
  const hub = getMarketPartnersucheHub("de");
  return {
    title: hub.title,
    description: hub.description,
    alternates: { canonical: publicUrl("de", "/partnersuche") },
    openGraph: { title: hub.title, description: hub.description, url: publicUrl("de", "/partnersuche") },
  };
}

export default function PartnersucheHubPage() {
  const hub = getMarketPartnersucheHub("de");
  return (
    <main className="shell shell-narrow">
      <section className="hero-card hero-brand">
        <span className="eyebrow">Partnersuche für Sportliche · Deutschland</span>
        <h1>{hub.title}</h1>
        <p>{hub.description}</p>
        <div className="chip-row">
          <span className="trust-chip">{hub.cities.length} regionale Stadtseiten</span>
          <span className="trust-chip">Echte Profilvorschauen</span>
          <span className="trust-chip">Laufstrecken & Outdoor-Parks</span>
        </div>
        <div className="button-row">
          <a className="button button-primary" href={LOCATION_REGISTRATION_URL}>Kostenlos sportliche Singles finden</a>
          <MarketLink className="button button-secondary" market="de" path="/magazin">Zum Fitness-Magazin</MarketLink>
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
              <MarketLink key={city.slug} className="city-card city-card-with-media" market="de" path={city.href}>
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
              <span className="eyebrow">Fitness-Dating in Deutschland</span>
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
