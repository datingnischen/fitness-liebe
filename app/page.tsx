import type { Metadata } from "next";
import Link from "next/link";
import { ExpertTrustCard } from "@/components/expert-trust-card";
import { getAuthorProfile } from "@/lib/author-profiles";
import { FITNESSWELTEN, entriesForFitnesswelt } from "@/lib/fitnesswelten";
import { HOME_FEATURES, HOME_INTRO, HOME_SECTIONS, HOME_TRUST_TILES } from "@/lib/home-content";
import { getMarketCityPages } from "@/lib/market-partnersuche";
import { publicUrl, REGISTRATION_URL } from "@/lib/markets";
import { staticAsset } from "@/lib/static-asset";
import {
  SITE_URL,
  formatGermanDate,
  getEntryCoverImage,
  getMagazinePosts,
  getReadingMinutes,
  stripHtml,
  type MagazineEntry,
} from "@/lib/wordpress";
import "./home.css";

export const revalidate = 300;

const HOME_HERO_IMAGE = staticAsset("/home/frontpage-visual-fitnessliebe.webp");
const TITLE = "Wir verlieben sportliche Singles – fitness-liebe.de";
const DESCRIPTION =
  "Finde sportliche Singles in deiner Umgebung: fitness-liebe.de ist die Partnervermittlung für Fitness-Fans – mit geprüften Profilen, Magazin zu Training, Ernährung und Fitness-Dating und kostenlosem Start.";
const HOME_CITY_ORDER = ["berlin", "hamburg", "muenchen", "koeln", "frankfurt", "stuttgart"];

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}/`, images: [HOME_HERO_IMAGE] },
};

async function loadPosts() {
  try {
    return await getMagazinePosts();
  } catch {
    return [] as MagazineEntry[];
  }
}

function teaser(post: MagazineEntry, length: number) {
  const text = stripHtml(post.excerpt || post.content);
  return text.length > length ? `${text.slice(0, length).replace(/\s+\S*$/, "")} …` : text;
}

export default async function HomePage() {
  const [posts, expert] = await Promise.all([loadPosts(), getAuthorProfile("christian-m-haas").catch(() => null)]);
  const [featured, ...more] = posts;
  const latest = more.slice(0, 3);
  const cities = getMarketCityPages("de");
  const homeCities = HOME_CITY_ORDER.map((slug) => cities.find((city) => city.slug === slug)).filter(
    (city): city is (typeof cities)[number] => Boolean(city),
  );

  const organizationGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: "fitness-liebe.de",
        description: DESCRIPTION,
        inLanguage: "de-DE",
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "fitness-liebe.de",
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}/app-assets/brand/fitness-liebe-logo.svg`,
        sameAs: [
          "https://www.facebook.com/profile.php?id=61578910400002",
          "https://www.youtube.com/@fitness-liebe",
          "https://www.pinterest.com/fitnessliebede/",
        ],
      },
    ],
  };

  return (
    <main className="home-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationGraph) }} />

      <section className="fl-hero">
        <picture className="fl-hero-media">
          <img src={HOME_HERO_IMAGE} alt="Sportliches Paar lacht nach dem Lauf am Flussufer" loading="eager" fetchPriority="high" decoding="async" />
        </picture>
        <div className="fl-hero-inner">
          <div className="fl-hero-copy">
            <span className="fl-kicker">
              <span aria-hidden="true">⚡</span> Wir verlieben sportliche Singles
            </span>
            <h1>
              Finde jetzt sportliche Singles <span>in deiner Umgebung.</span>
            </h1>
            <p>
              Laufrunde, Yogamatte oder Hantelbank: Bei fitness-liebe.de triffst du Menschen, die Bewegung genauso lieben wie
              du – für eine ernsthafte Beziehung mit gemeinsamem Puls.
            </p>
            <div className="fl-hero-actions">
              <a className="button button-primary fl-hero-cta" href={REGISTRATION_URL}>
                Kostenlos registrieren
              </a>
              <Link className="button fl-hero-ghost" href="/partnersuche">
                Singles in deiner Stadt
              </Link>
            </div>
            <ul className="fl-hero-trust" aria-label="Vertrauenssignale">
              <li>Über 20 Jahre Erfahrung</li>
              <li>Server in Deutschland</li>
              <li>Keine versteckten Kosten</li>
            </ul>
          </div>

          {featured ? (
            <Link className="fl-hero-card" href={`/magazin/${featured.slug}`}>
              <span className="fl-hero-card-label">Neu im Magazin</span>
              <strong>{featured.title}</strong>
              <span className="fl-hero-card-meta">
                {getReadingMinutes(featured.content)} Min. Lesezeit <span aria-hidden="true">→</span>
              </span>
            </Link>
          ) : null}
        </div>
      </section>

      <div className="shell home-shell">
        <section className="fl-stats" aria-label="fitness-liebe.de in Zahlen">
          <div>
            <strong>750.000+</strong>
            <span>Mitglieder im Netzwerk</span>
          </div>
          <div>
            <strong>{cities.length}</strong>
            <span>Städte mit Stadtseite</span>
          </div>
          <div>
            <strong>{posts.length || "40+"}</strong>
            <span>Magazin-Artikel</span>
          </div>
          <div>
            <strong>0 €</strong>
            <span>für den Start</span>
          </div>
        </section>

        <section className="fl-trust-grid" aria-label="Darauf kannst du dich verlassen">
          {HOME_TRUST_TILES.map((tile) => (
            <a key={tile.path} className="fl-trust-tile" href={publicUrl("de", tile.path)}>
              <span className="fl-trust-icon" aria-hidden="true">
                {tile.icon}
              </span>
              <strong>{tile.title}</strong>
              <p>{tile.text}</p>
              <span className="fl-link-arrow">
                Weiterlesen <span aria-hidden="true">→</span>
              </span>
            </a>
          ))}
        </section>

        <section className="fl-section" aria-labelledby="fitnesswelten-titel">
          <div className="fl-section-head">
            <div className="section-header">
              <span className="eyebrow eyebrow-brand">Fitnesswelten</span>
              <h2 id="fitnesswelten-titel">Womit willst du starten?</h2>
              <p>Vom Flirt im Gym bis zum Rezept fürs Kochdate – das Magazin nach Themen sortiert.</p>
            </div>
            <Link className="fl-section-link" href="/magazin/fitnesswelten">
              Alle Fitnesswelten <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="fl-world-grid">
            {FITNESSWELTEN.map((world) => {
              const count = entriesForFitnesswelt(world.id, posts).length;
              return (
                <Link key={world.id} className={`fl-world-tile fl-world-${world.id}`} href={`/magazin/thema/${world.id}`}>
                  <span className="fl-world-emoji" aria-hidden="true">
                    {world.emoji}
                  </span>
                  <strong>{world.name}</strong>
                  <span className="fl-world-claim">{world.claim}</span>
                  {count ? <small>{count} Artikel</small> : null}
                </Link>
              );
            })}
          </div>
        </section>

        {homeCities.length ? (
          <section className="fl-section" aria-labelledby="staedte-titel">
            <div className="fl-section-head">
              <div className="section-header">
                <span className="eyebrow eyebrow-brand">Partnersuche vor Ort</span>
                <h2 id="staedte-titel">Sportliche Singles in deiner Stadt</h2>
                <p>Laufstrecken, Outdoor-Parks und Treffpunkte – plus echte Profilvorschauen aus deiner Region.</p>
              </div>
              <Link className="fl-section-link" href="/partnersuche">
                Alle {cities.length} Städte <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="fl-city-grid">
              {homeCities.map((city) => (
                <Link key={city.slug} className="fl-city-tile" href={city.path}>
                  {city.imageUrl ? <img src={city.imageUrl} alt={city.imageAlt || `Sportliche Singles in ${city.cityName}`} loading="lazy" decoding="async" /> : null}
                  <span className="fl-city-label">
                    <small>Singles in</small>
                    <strong>{city.cityName}</strong>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <section className="fl-section" aria-labelledby="features-titel">
          <div className="section-header">
            <span className="eyebrow eyebrow-brand">Kennenlernen leicht gemacht</span>
            <h2 id="features-titel">Drei Wege zum ersten Match</h2>
          </div>
          <div className="fl-feature-grid">
            {HOME_FEATURES.map((feature) => (
              <a key={feature.path} className="fl-feature-card" href={publicUrl("de", feature.path)}>
                <span className="fl-feature-media">
                  <img src={staticAsset(feature.image)} alt="" loading="lazy" decoding="async" />
                </span>
                <span className="fl-feature-body">
                  <small>{feature.label}</small>
                  <strong>{feature.title}</strong>
                  <p>{feature.text}</p>
                  <span className="fl-link-arrow">
                    {feature.cta} <span aria-hidden="true">→</span>
                  </span>
                </span>
              </a>
            ))}
          </div>
        </section>

        {latest.length ? (
          <section className="fl-section" aria-labelledby="magazin-titel">
            <div className="fl-section-head">
              <div className="section-header">
                <span className="eyebrow eyebrow-brand">Magazin</span>
                <h2 id="magazin-titel">Frisch aus dem Fitness-Magazin</h2>
              </div>
              <Link className="fl-section-link" href="/magazin">
                Alle Magazin-Artikel <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="fl-post-grid">
              {latest.map((post) => {
                const cover = getEntryCoverImage(post);
                return (
                  <Link key={post.id} className="fl-post-card" href={`/magazin/${post.slug}`}>
                    <span className="fl-post-media">{cover ? <img src={cover} alt="" loading="lazy" decoding="async" /> : null}</span>
                    <span className="fl-post-body">
                      <small>
                        {post.date ? formatGermanDate(post.date) : null} · {getReadingMinutes(post.content)} Min.
                      </small>
                      <strong>{post.title}</strong>
                      <span>{teaser(post, 130)}</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        ) : null}

        {expert ? (
          <section className="content-section">
            <ExpertTrustCard
              profile={expert}
              eyebrow="Unser Datingexperte & Sport-Enthusiast"
              title="Hinter fitness-liebe.de steht ein reales Profil – mit Sportbiografie, Dating-Erfahrung und klarer Magazinbegleitung."
              primaryLabel="Zum Expertenprofil"
            />
          </section>
        ) : null}

        <section className="fl-story" aria-labelledby="story-titel">
          <div className="fl-story-media">
            <img src={staticAsset("/home/erfolgsgeschichten.webp")} alt="Glückliches Paar aus den Erfolgsgeschichten" loading="lazy" decoding="async" />
          </div>
          <div className="fl-story-copy">
            <span className="eyebrow">Unsere Erfolgsgeschichten</span>
            <h2 id="story-titel">Es funktioniert.</h2>
            <p>
              Täglich finden sich bei uns neue Paare – und das freut uns. Manche Ex-Singles haben vor lauter Glück kaum noch Zeit,
              sich zu melden. Aber viele neue Paare finden auch gemeinsam die Zeit, uns zu schreiben.
            </p>
            <a className="button button-primary" href={publicUrl("de", "/unsere-erfolgsgeschichten.html")}>
              Zu den Erfolgsgeschichten
            </a>
          </div>
        </section>

        <section className="fl-editorial" aria-labelledby="editorial-titel">
          <div className="fl-editorial-intro">
            <span className="eyebrow eyebrow-brand">Über fitness-liebe.de</span>
            <h2 id="editorial-titel">{HOME_INTRO.heading}</h2>
            {HOME_INTRO.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <a className="button button-primary" href={REGISTRATION_URL}>
              Triff heute noch sportliche Singles
            </a>
          </div>
          <div className="fl-editorial-list">
            {HOME_SECTIONS.map((section, index) => (
              <details key={section.heading} className="fl-editorial-item" open={index === 0}>
                <summary>{section.heading}</summary>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </details>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
