import type { Metadata } from "next";
import Link from "@/components/local-link";
import { ExpertTrustCard } from "@/components/expert-trust-card";
import { getAuthorProfile } from "@/lib/author-profiles";
import { ABOUT_OVERVIEW_PATH, ABOUT_SOCIAL_MEDIA_PATH, DATING_TIPS_PATH, aboutOverviewCanonical } from "@/lib/about-section";
import { HOME_INTRO, HOME_SECTIONS, HOME_TRUST_TILES } from "@/lib/home-content";
import { resolveMarket, type MarketParams } from "@/lib/market-params";
import { REGISTRATION_URL, marketAlternates, platformUrl } from "@/lib/markets";
import { SOCIAL_CHANNELS } from "@/lib/social-channels";

export const revalidate = 3600;

const TITLE = "Über fitness-liebe.de";
const DESCRIPTION =
  "Wer hinter fitness-liebe.de steht, warum gemeinsame Bewegung verbindet und wo du uns findest: Team, Magazin-Autoren, Sicherheit und Social-Media-Kanäle.";

type PageProps = { params: MarketParams };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const market = await resolveMarket(params);
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: marketAlternates(market, ABOUT_OVERVIEW_PATH),
    openGraph: { title: TITLE, description: DESCRIPTION, url: aboutOverviewCanonical(market) },
  };
}

const WHY = HOME_SECTIONS.find((section) => section.heading === "Warum Fitness-Liebe.de?");
const STORY = HOME_SECTIONS.filter((section) => section !== WHY).slice(0, 3);

export default async function AboutOverviewPage() {
  // Gazi bleibt ausgeblendet, solange die Kooperation nicht feststeht (Profilseite ist noindex).
  const christian = await getAuthorProfile("christian-m-haas");

  return (
    <main className="shell shell-narrow">
      <section className="hero-card hero-brand">
        <span className="eyebrow">Über uns</span>
        <h1>Wir verbinden Liebe mit Fitness.</h1>
        <p>{HOME_INTRO.paragraphs.join(" ")}</p>
        <div className="button-row">
          <a className="button button-primary" href={REGISTRATION_URL}>
            Kostenlos registrieren
          </a>
          <Link className="button button-secondary" href="/magazin">
            Zum Magazin
          </Link>
          <Link className="button button-secondary" href={ABOUT_SOCIAL_MEDIA_PATH}>
            Social Media
          </Link>
        </div>
      </section>

      {WHY ? (
        <section className="content-section">
          <article className="panel-card">
            <div className="section-header">
              <span className="eyebrow">Unser Anspruch</span>
              <h2>{WHY.heading}</h2>
            </div>
            {WHY.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </article>
        </section>
      ) : null}

      <section className="grid-two content-section">
        {STORY.map((section) => (
          <article key={section.heading} className="panel-card">
            <div className="section-header">
              <span className="eyebrow">Fitness & Liebe</span>
              <h2>{section.heading}</h2>
            </div>
            <p>{section.paragraphs[0]}</p>
          </article>
        ))}
        <article className="panel-card">
          <div className="section-header">
            <span className="eyebrow">Tipps</span>
            <h2>Dating-Tipps für den Start</h2>
          </div>
          <p>Bleib du selbst, fülle dein Profil aus und schreib persönliche Nachrichten: Unsere Tipps für eine erfolgreiche Partnersuche online.</p>
          <Link className="button button-primary" href={DATING_TIPS_PATH}>
            Zu den Dating-Tipps
          </Link>
        </article>
      </section>

      <section className="content-section">
        <div className="section-header">
          <span className="eyebrow">Sicherheit & Vertrauen</span>
          <h2>Darauf kannst du dich verlassen</h2>
        </div>
        <div className="grid-three">
          {HOME_TRUST_TILES.map((tile) => (
            <a key={tile.path} className="panel-card trust-link-card" href={platformUrl(tile.path)}>
              <span className="trust-link-icon" aria-hidden="true">
                {tile.icon}
              </span>
              <h3>{tile.title}</h3>
              <p>{tile.text}</p>
            </a>
          ))}
        </div>
      </section>

      {christian ? (
        <section className="content-section">
          <ExpertTrustCard
            profile={christian}
            eyebrow="Gründer & Datingexperte"
            title="Hinter fitness-liebe.de stehen reale Menschen mit Sportbiografie und Dating-Erfahrung – keine anonymen Platzhalter."
            primaryLabel="Zum Expertenprofil"
          />
        </section>
      ) : null}

      <section className="content-section">
        <article className="panel-card">
          <div className="section-header">
            <span className="eyebrow">Community & Kanäle</span>
            <h2>Folge fitness-liebe.de</h2>
          </div>
          <p>Neuigkeiten, Videos und Inspiration rund um Fitness, Gesundheit und Partnersuche.</p>
          <div className="chip-row">
            {SOCIAL_CHANNELS.map((channel) => (
              <a key={channel.platform} className="chip" href={channel.href} target="_blank" rel="noopener">
                {channel.name}
              </a>
            ))}
            <Link className="chip" href={ABOUT_SOCIAL_MEDIA_PATH}>
              Alle Kanäle
            </Link>
          </div>
        </article>
      </section>
    </main>
  );
}
