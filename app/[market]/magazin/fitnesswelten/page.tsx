import type { Metadata } from "next";
import Link from "@/components/local-link";
import { getAllMagazineEntries, getEntryCoverImage, type MagazineEntry } from "@/lib/wordpress";
import { buildMagazineFaqGraph } from "@/lib/magazine-faq";
import { serializeJsonLd } from "@/lib/json-ld";
import { resolveMarket, type MarketParams } from "@/lib/market-params";
import { REGISTRATION_URL, getMarket, marketAlternates, publicUrl, type MarketCode } from "@/lib/markets";
import {
  FITNESSWELTEN,
  FITNESSWELT_ARTICLE_COUNT,
  FITNESSWELT_FAQ,
  FITNESSWELT_MATCHES,
  entriesForFitnesswelt,
  findFitnessweltArticle,
} from "@/lib/fitnesswelten";
import "./fitnesswelten.css";

export const revalidate = 300;

const TITLE = "Fitnesswelten: Dating, Training, Ernährung & Rezepte";
const DESCRIPTION =
  "Alle Themenwelten von fitness-liebe.de auf einen Blick – Fitness-Dating und Flirten, Fit als Paar, Training, Ernährung und Fitness-Rezepte. Mit direktem Weg zu sportlichen Singles.";

const PAGE_PATH = "/magazin/fitnesswelten";

type PageProps = { params: MarketParams };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const market = await resolveMarket(params);
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: marketAlternates(market, PAGE_PATH),
    openGraph: { title: TITLE, description: DESCRIPTION, url: publicUrl(market, PAGE_PATH), type: "website" },
  };
}

const faqItems = FITNESSWELT_FAQ.map((item, index) => ({
  id: `faq-frage-${index + 1}`,
  question: item.question,
  answerHtml: item.answer,
  answerText: item.answer,
}));

function buildPageGraph(market: MarketCode) {
  const PAGE_URL = publicUrl(market, PAGE_PATH);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${PAGE_URL}#webpage`,
        url: PAGE_URL,
        name: TITLE,
        description: DESCRIPTION,
        inLanguage: getMarket(market).locale,
        breadcrumb: { "@id": `${PAGE_URL}#breadcrumb` },
        mainEntity: { "@id": `${PAGE_URL}#fitnesswelten` },
      },
      {
        "@type": "ItemList",
        "@id": `${PAGE_URL}#fitnesswelten`,
        name: "Fitnesswelten auf fitness-liebe.de",
        numberOfItems: FITNESSWELTEN.length,
        itemListElement: FITNESSWELTEN.map((world, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: world.name,
          url: publicUrl(market, `/magazin/thema/${world.id}`),
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${PAGE_URL}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Magazin", item: publicUrl(market, "/magazin") },
          { "@type": "ListItem", position: 2, name: "Fitnesswelten", item: PAGE_URL },
        ],
      },
    ],
  };
}

async function loadEntries() {
  try {
    return await getAllMagazineEntries();
  } catch {
    return [] as MagazineEntry[];
  }
}

export default async function FitnessweltenPage({ params }: PageProps) {
  const market = await resolveMarket(params);
  const PAGE_URL = publicUrl(market, PAGE_PATH);
  const entries = await loadEntries();
  const bySlug = new Map(entries.map((entry) => [entry.slug, entry]));
  const posts = entries.filter((entry) => entry.type === "post");
  const faqGraph = buildMagazineFaqGraph({ items: faqItems, pageUrl: PAGE_URL, pageName: "Häufige Fragen zu fitness-liebe.de" });

  return (
    <main className="shell fitnesswelten-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildPageGraph(market)) }} />
      {faqGraph ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqGraph) }} /> : null}

      <nav className="fitnesswelten-breadcrumb" aria-label="Brotkrumen">
        <Link href="/magazin">Magazin</Link>
        <span aria-hidden="true">›</span>
        <span aria-current="page">Fitnesswelten</span>
      </nav>

      <section className="fitnesswelten-hero">
        <div className="fitnesswelten-hero-copy">
          <span className="eyebrow">Alle Fitnesswelten</span>
          <h1>
            Finde deine Fitnesswelt – <span>und Menschen, die im selben Takt laufen.</span>
          </h1>
          <p>
            Gym-Flirt, Paar-Workout, Krafttraining oder Meal-Prep? Jede Fitnesswelt bündelt die passenden Magazin-Artikel –
            und führt dich direkt zu Singles, die Bewegung genauso lieben wie du.
          </p>
          <div className="button-row">
            <a className="button button-primary" href={`#${FITNESSWELTEN[0].id}`}>
              Fitnesswelten entdecken
            </a>
            <Link className="button button-secondary" href={REGISTRATION_URL}>
              Kostenlos registrieren
            </Link>
          </div>
        </div>
        <ul className="fitnesswelten-hero-stats" aria-label="Fitnesswelten in Zahlen">
          <li>
            <strong>{FITNESSWELTEN.length}</strong>
            <span>Fitnesswelten</span>
          </li>
          <li>
            <strong>{posts.length || FITNESSWELT_ARTICLE_COUNT}</strong>
            <span>Artikel</span>
          </li>
          <li>
            <strong>0 €</strong>
            <span>zum Start</span>
          </li>
        </ul>
      </section>

      <nav className="fitnesswelten-group-nav" aria-label="Direkt zur Fitnesswelt">
        {FITNESSWELTEN.map((world) => {
          const count = entriesForFitnesswelt(world.id, posts).length;
          return (
            <a key={world.id} href={`#${world.id}`} className="fitnesswelten-group-tile">
              <span className="fitnesswelten-group-emoji" aria-hidden="true">
                {world.emoji}
              </span>
              <span className="fitnesswelten-group-name">{world.shortName}</span>
              <span className="fitnesswelten-group-count">
                {count} {count === 1 ? "Artikel" : "Artikel"}
              </span>
            </a>
          );
        })}
      </nav>

      {FITNESSWELTEN.map((world) => (
        <section key={world.id} id={world.id} className="fitnesswelten-group" aria-labelledby={`${world.id}-titel`}>
          <header className="fitnesswelten-group-header">
            <span className="fitnesswelten-group-badge" aria-hidden="true">
              {world.emoji}
            </span>
            <div>
              <h2 id={`${world.id}-titel`}>{world.name}</h2>
              <p className="fitnesswelten-group-claim">{world.claim}</p>
              <p>{world.intro}</p>
              <Link className="fitnesswelten-group-more" href={`/magazin/thema/${world.id}`}>
                Alle Artikel zu {world.shortName} →
              </Link>
            </div>
          </header>

          <div className={`fitnesswelten-grid${world.highlights.length === 1 ? " fitnesswelten-grid-single" : ""}`}>
            {world.highlights.map((article) => {
              const entry = bySlug.get(article.slug);
              const cover = entry ? getEntryCoverImage(entry) : undefined;
              return (
                <article key={article.slug} className="fitnesswelt-card">
                  <Link href={`/magazin/${article.slug}`} className="fitnesswelt-card-media" tabIndex={-1} aria-hidden="true">
                    {cover ? (
                      <img src={cover} alt="" loading="lazy" decoding="async" />
                    ) : (
                      <span className="fitnesswelt-card-fallback">{world.emoji}</span>
                    )}
                    <span className="fitnesswelt-card-tagline">{article.tagline}</span>
                  </Link>
                  <div className="fitnesswelt-card-body">
                    <h3>
                      <Link href={`/magazin/${article.slug}`}>{article.name}</Link>
                    </h3>
                    <p>{article.teaser}</p>
                    <ul className="fitnesswelt-card-traits" aria-label={`Stichworte zu ${article.name}`}>
                      {article.traits.map((trait) => (
                        <li key={trait}>{trait}</li>
                      ))}
                    </ul>
                    <Link className="fitnesswelt-card-cta" href={`/magazin/${article.slug}`}>
                      {article.cta} <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}

      <section className="fitnesswelten-match" aria-labelledby="fitnesswelten-match-titel">
        <div className="section-header">
          <span className="eyebrow eyebrow-brand">Orientierung</span>
          <h2 id="fitnesswelten-match-titel">Wo willst du anfangen?</h2>
          <p>Noch unentschlossen? Starte bei dem, was dich gerade am meisten beschäftigt.</p>
        </div>
        <ul className="fitnesswelten-match-list">
          {FITNESSWELT_MATCHES.map((match) => (
            <li key={match.need} className="fitnesswelten-match-item">
              <span className="fitnesswelten-match-emoji" aria-hidden="true">
                {match.emoji}
              </span>
              <span className="fitnesswelten-match-need">{match.need}</span>
              <span className="fitnesswelten-match-links">
                {match.slugs.map((slug) => {
                  const found = findFitnessweltArticle(slug);
                  const label = found?.article.name ?? bySlug.get(slug)?.title;
                  return label ? (
                    <Link key={slug} className="chip" href={`/magazin/${slug}`}>
                      {label}
                    </Link>
                  ) : null;
                })}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="fitnesswelten-cta">
        <div>
          <span className="eyebrow">Singlebörse</span>
          <h2>Dein Trainingsplan ist kein Nebensatz im Profil.</h2>
          <p>
            Bei fitness-liebe.de ist er der Anfang. Lerne Singles kennen, für die Laufrunde, Yogamatte oder Hantelbank
            genauso zum Alltag gehören wie für dich.
          </p>
        </div>
        <Link className="button button-primary" href={REGISTRATION_URL}>
          Jetzt kostenlos registrieren
        </Link>
      </section>

      <section className="breed-faq-card fitnesswelten-faq" id="faq" aria-labelledby="faq-titel">
        <div className="breed-faq-header">
          <span className="eyebrow eyebrow-brand">FAQ</span>
          <h2 id="faq-titel">Häufige Fragen zu fitness-liebe.de</h2>
        </div>
        <div className="breed-faq-list">
          {faqItems.map((item, index) => (
            <details key={item.id} className="breed-faq-item" id={item.id} open={index === 0}>
              <summary>{item.question}</summary>
              <div className="breed-faq-answer">
                <p>{item.answerText}</p>
              </div>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
