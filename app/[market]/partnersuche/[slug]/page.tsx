import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IconySinglesWidget } from "@/components/icony-singles-widget";
import { MarketLink } from "@/components/market-link";
import { ExpertTrustCard } from "@/components/expert-trust-card";
import { MoreCities } from "@/components/more-cities";
import { getAuthorProfile } from "@/lib/author-profiles";
import { getMarketCityPage, getMarketCityPages, getNearbyMarketCities, marketsWithCity } from "@/lib/market-partnersuche";
import { extractLeadImage } from "@/lib/magazine-lead-image";
import { withHeadingAnchors } from "@/lib/heading-anchors";
import { creditLabel, extractImageCredit } from "@/lib/image-credit";
import { MARKET_CODES, isMarketCode, marketAlternates, publicUrl, type MarketCode } from "@/lib/markets";

type PageProps = { params: Promise<{ market: string; slug: string }> };

export const revalidate = 86400;

export function generateStaticParams() {
  return MARKET_CODES.flatMap((market) => getMarketCityPages(market).map(({ slug }) => ({ market, slug })));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { market, slug } = await params;
  const city = isMarketCode(market) ? getMarketCityPage(market, slug) : null;
  if (!city) return {};
  return {
    title: city.title,
    description: city.description,
    alternates: marketAlternates(city.market, city.path, marketsWithCity(slug)),
    openGraph: {
      title: city.title,
      description: city.description,
      url: publicUrl(city.market, city.path),
      images: city.imageUrl ? [city.imageUrl] : undefined,
    },
  };
}

export default async function PartnersucheCityPage({ params }: PageProps) {
  const { market: marketParam, slug } = await params;
  if (!isMarketCode(marketParam)) notFound();
  const market: MarketCode = marketParam;
  const [city, expert] = [getMarketCityPage(market, slug), await getAuthorProfile("christian-m-haas")];
  if (!city) notFound();
  const nearby = getNearbyMarketCities(market, slug);
  // Das erste Bild im ICONY-Text steht schon im Hero
  const rawBody = city.imageUrl ? (extractLeadImage(city.contentHtml)?.content ?? city.contentHtml) : city.contentHtml;
  const { html: bodyWithoutCredit, creditUrl } = extractImageCredit(rawBody);
  const { html: body, headings } = withHeadingAnchors(bodyWithoutCredit);

  return (
    <main className="city-page">
      <section className={`city-stage${city.imageUrl ? "" : " city-stage-plain"}`} aria-labelledby="city-title">
        {city.imageUrl ? (
          <img className="city-stage-image" src={city.imageUrl} alt={city.imageAlt || `Sportliche Singles in ${city.cityName}`} loading="eager" fetchPriority="high" decoding="async" />
        ) : null}
        <div className="city-stage-inner">
          <nav className="city-stage-crumbs" aria-label="Brotkrumen">
            <MarketLink market={market} path="/">Start</MarketLink>
            <span aria-hidden="true">/</span>
            <MarketLink market={market} path="/partnersuche">Partnersuche</MarketLink>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{city.cityName}</span>
          </nav>
          <span className="city-stage-kicker">Fitness-Dating in {city.cityName}</span>
          <h1 id="city-title"><CityTitle title={city.title} city={city.cityName} /></h1>
          <p className="city-stage-lead">{city.description}</p>
          <ul className="city-stage-chips" aria-label="Vorteile">
            <li>Profile aus der Region</li>
            <li>Laufstrecken & Treffpunkte</li>
            <li>Kostenlos starten</li>
          </ul>
          <div className="city-stage-actions">
            <a className="button button-primary button-xl" href={city.registrationUrl}>
              Sportliche Singles in {city.cityName} finden <span aria-hidden="true">→</span>
            </a>
            <MarketLink className="button button-ghost" market={market} path="/partnersuche">Alle Städte</MarketLink>
          </div>
        </div>
        <svg className="city-stage-pulse" viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <path d="M0 80h520l22-40 28 74 26-96 28 104 20-42h556" />
        </svg>
        {city.imageUrl && city.sourceAttributionUrl ? (
          <p className="city-stage-credit">
            Bild: <a href={city.sourceAttributionUrl} rel="nofollow noopener">Pixabay</a>
          </p>
        ) : null}
      </section>

      <div className="city-proof" role="list" aria-label="Darum fitness-liebe.de">
        <div role="listitem"><strong>750.000+</strong><span>Mitglieder</span></div>
        <div role="listitem"><strong>Geprüft</strong><span>jedes Profil vom Support</span></div>
        <div role="listitem"><strong>20 Jahre</strong><span>Erfahrung im Online-Dating</span></div>
        <div role="listitem"><strong>0 €</strong><span>für den Start</span></div>
      </div>

      <div className="shell city-shell">
        <section className="content-section"><IconySinglesWidget city={city.cityName} zip={city.icony.zip} country={city.icony.country} platformId={city.icony.platformId} registrationUrl={city.registrationUrl} searchUrl={city.searchUrl} /></section>

        <section className="content-section city-guide" aria-labelledby="city-guide-title">
          <div className="city-guide-head">
            <span className="eyebrow">Tipps & Highlights vor Ort</span>
            <h2 id="city-guide-title">Fitness, Flirt und Treffpunkte in {city.cityName}</h2>
          </div>
          <div className="city-guide-grid">
            {headings.length > 2 ? (
              <aside className="city-guide-aside">
                <nav className="city-toc" aria-label={`Inhalt: ${city.cityName}`}>
                  <p>Auf dieser Seite</p>
                  <ol>
                    {headings.map((heading) => (
                      <li key={heading.id}><a href={`#${heading.id}`}>{heading.text}</a></li>
                    ))}
                  </ol>
                </nav>
                <a className="city-guide-cta" href={city.registrationUrl}>
                  <span>Bereit für dein erstes Fitness-Date?</span>
                  <strong>Singles in {city.cityName} ansehen <i aria-hidden="true">→</i></strong>
                </a>
              </aside>
            ) : null}
            <article className="city-guide-body">
              <div className="rich-content" dangerouslySetInnerHTML={{ __html: body }} />
              {creditUrl ? (
                <details className="city-sources">
                  <summary>Bildnachweis</summary>
                  <p>
                    Titelbild {city.cityName}: <a href={creditUrl} rel="nofollow noopener">{creditLabel(creditUrl)}</a>
                  </p>
                </details>
              ) : null}
            </article>
          </div>
        </section>

        <MoreCities market={market} cities={nearby} total={getMarketCityPages(market).length} />
        {expert ? <section className="content-section"><ExpertTrustCard profile={expert} eyebrow="Unser Datingexperte" title={`Christian begleitet Fitness-Dating-Themen und regionale Einstiege auch für ${city.cityName}.`} primaryLabel="Zum Expertenprofil" registrationHref={city.registrationUrl} /></section> : null}
      </div>
    </main>
  );
}

// Hebt den Stadtnamen in der Überschrift hervor, ohne den Titel zu verändern.
function CityTitle({ title, city }: { title: string; city: string }) {
  const index = title.lastIndexOf(city);
  if (index < 0) return <>{title}</>;
  return (
    <>
      {title.slice(0, index)}
      <span className="city-stage-mark">{city}</span>
      {title.slice(index + city.length)}
    </>
  );
}
