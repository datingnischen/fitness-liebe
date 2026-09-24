import type { Metadata } from "next";
import Link from "@/components/local-link";
import { canonicalMagazinePagePath } from "@/lib/about-section";
import { classifyFitnesswelt } from "@/lib/fitnesswelten";
import { getMagazineTopicLinks } from "@/lib/magazine-topics";
import { resolveMarket, type MarketParams } from "@/lib/market-params";
import { REGISTRATION_URL, marketAlternates, publicUrl } from "@/lib/markets";
import { staticAsset } from "@/lib/static-asset";
import {
  MAGAZINE_POSTS_PER_PAGE,
  formatUpdatedDate,
  getUpdatedDate,
  getMagazinePages,
  getMagazinePostsPage,
  stripHtml,
} from "@/lib/wordpress";

export const revalidate = 300;

type PageProps = { params: MarketParams };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const market = await resolveMarket(params);
  return {
    title: "Fitness-Magazin: Dating, Training & Ernährung",
    description:
      "Das Magazin von fitness-liebe.de: Fitness-Dating und Flirten, Fit als Paar, Training, Ernährung und Rezepte – von Datingexperte Christian M. Haas.",
    alternates: marketAlternates(market, "/magazin"),
    openGraph: {
      title: "Fitness-Magazin: Dating, Training & Ernährung",
      description:
        "Das Magazin von fitness-liebe.de: Fitness-Dating und Flirten, Fit als Paar, Training, Ernährung und Rezepte – von Datingexperte Christian M. Haas.",
      url: publicUrl(market, "/magazin"),
    },
  };
}

// Gazi bleibt ausgeblendet, solange die Kooperation nicht feststeht.
const SIDEBAR_HIDDEN_PAGES = new Set(["datenschutz", "impressum", "gazi-avakhti"]);
const SIDEBAR_PAGE_IMAGES: Record<string, { src: string; alt: string }> = {
  christian: { src: "/images/authors/christian-m-haas-tennis.webp", alt: "Christian M. Haas auf dem Tennisplatz" },
};

export default async function MagazineOverviewPage() {
  const [{ posts, totalPages, totalItems }, pages, topics] = await Promise.all([
    getMagazinePostsPage(1, MAGAZINE_POSTS_PER_PAGE),
    getMagazinePages(),
    getMagazineTopicLinks(),
  ]);

  const featuredPost = posts[0];
  const latestPosts = posts.slice(0, 3);
  const importantPages = pages.filter((page) => !SIDEBAR_HIDDEN_PAGES.has(page.slug)).slice(0, 6);

  return (
    <main className="shell shell-narrow magazine-overview-page">
      <section className="hero-card hero-brand hero-brand-magazine">
        <span className="eyebrow">Fitness-Magazin</span>
        <h1>Wir verbinden Liebe und Fitness: Training, Ernährung und Dating für sportliche Singles.</h1>
        <p>
          Flirten im Gym, fit bleiben als Paar, Krafttraining, Kalorienbedarf und Rezepte fürs Kochdate — geschrieben
          von Datingexperte Christian M. Haas, mit direktem Weg zur Anmeldung.
        </p>
        <div className="button-row">
          <Link className="button button-primary" href={REGISTRATION_URL}>
            Kostenlos registrieren
          </Link>
          <Link className="button button-secondary" href="/magazin/fitnesswelten">
            Fitnesswelten entdecken
          </Link>
        </div>
      </section>

      {featuredPost ? (
        <section className="content-section">
          <article className="editorial-feature-card editorial-feature-card-magazine">
            {featuredPost.featuredImage ? (
              <div className="editorial-feature-media editorial-feature-media-magazine">
                <img
                  src={featuredPost.featuredImage}
                  alt={featuredPost.featuredImageAlt || featuredPost.title}
                  loading="eager"
                  decoding="async"
                />
              </div>
            ) : null}
            <div className="editorial-feature-copy editorial-feature-copy-magazine">
              <span className="eyebrow eyebrow-muted">Gerade beliebt</span>
              <h2>{featuredPost.title}</h2>
              <p>{stripHtml(featuredPost.excerpt || featuredPost.content).slice(0, 220)}…</p>
              <div className="meta-row editorial-feature-meta">
                {featuredPost.authorName ? <span>Von {featuredPost.authorName}</span> : null}
                {getUpdatedDate(featuredPost) ? <span>{formatUpdatedDate(featuredPost)}</span> : null}
              </div>
              <div className="button-row">
                <Link className="button button-primary" href={`/magazin/${featuredPost.slug}`}>
                  Jetzt lesen
                </Link>
              </div>
            </div>
          </article>
        </section>
      ) : null}

      <section className="content-section content-section-tight magazine-category-section">
        <div className="section-header magazine-category-header">
          <div>
            <span className="eyebrow">Beliebte Kategorien</span>
            <h2>Fitnesswelten mit direktem Einstieg</h2>
            <p>Schnelle Wege zu Fitness-Dating, Paar-Workouts, Training, Ernährung und Rezepten.</p>
          </div>
        </div>
        <div className="magazine-topic-grid">
          <Link className="magazine-topic-card magazine-topic-card-index" href="/magazin/inhalt">
            <span className="magazine-topic-icon" aria-hidden="true">
              📚
            </span>
            <span className="magazine-topic-copy">
              <strong>Inhaltsverzeichnis: alle Beiträge &amp; Seiten A–Z</strong>
              <small>Alle Artikel nach Fitnesswelt sortiert – durchsuchbar auf einer Seite</small>
            </span>
            <span className="magazine-topic-arrow" aria-hidden="true">
              →
            </span>
          </Link>
          {topics.slice(0, 8).map((topic) => (
            <Link key={topic.slug} className="magazine-topic-card" href={`/magazin/thema/${topic.slug}`}>
              <span className="magazine-topic-icon" aria-hidden="true">
                {topic.emoji}
              </span>
              <span className="magazine-topic-copy">
                <strong>{topic.name}</strong>
                {topic.count > 0 ? (
                  <small>
                    {topic.count} {topic.count === 1 ? "Beitrag" : "Beiträge"}
                  </small>
                ) : null}
              </span>
              <span className="magazine-topic-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid-two magazine-overview-grid">
        <article className="panel-card panel-card-magazine-main">
          <div className="section-header">
            <span className="eyebrow">Neueste Beiträge</span>
            <h2>Aktuelle Artikel im Überblick</h2>
            <p>Die wichtigsten frischen Themen mit mehr Luft, klarerer Hierarchie und direktem Einstieg ins Magazin.</p>
          </div>
          <div className="stack-list magazine-overview-posts">
            {latestPosts.map((post) => (
              <Link key={post.id} href={`/magazin/${post.slug}`} className="article-card article-card-rich article-card-rich-magazine">
                {post.featuredImage ? (
                  <div className="article-card-media article-card-media-magazine">
                    <img src={post.featuredImage} alt={post.featuredImageAlt || post.title} loading="lazy" decoding="async" />
                  </div>
                ) : null}
                <div className="article-card-copy article-card-copy-magazine">
                  <div className="meta-row article-card-meta-magazine">
                    <span>{classifyFitnesswelt(post).shortName}</span>
                    {getUpdatedDate(post) ? <span>{formatUpdatedDate(post)}</span> : null}
                  </div>
                  <h3>{post.title}</h3>
                  <p>{stripHtml(post.excerpt || post.content).slice(0, 170)}…</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="pagination-bar pagination-bar-magazine">
            <span>
              Seite 1 von {totalPages} · {totalItems} Beiträge
            </span>
            <div className="pagination-actions">
              <Link className="button button-secondary" href={totalPages > 1 ? "/magazin/page/2" : "/magazin"}>
                {totalPages > 1 ? "Ältere Beiträge" : "Zum Magazin"}
              </Link>
            </div>
          </div>
        </article>

        <article className="panel-card panel-card-magazine-side">
          <div className="section-header">
            <span className="eyebrow">Autoren</span>
            <h2>Unsere Autoren und Experten</h2>
            <p>Wer hinter dem Magazin steht: Dating-Erfahrung und Leidenschaft für Sport.</p>
          </div>
          <div className="stack-list important-page-list">
            {importantPages.map((page) => (
              <Link key={page.id} href={canonicalMagazinePagePath(page.slug)} className="article-card article-card-compact article-card-page-link">
                {SIDEBAR_PAGE_IMAGES[page.slug] ? (
                  <img
                    className="article-card-page-photo"
                    src={staticAsset(SIDEBAR_PAGE_IMAGES[page.slug].src)}
                    alt={SIDEBAR_PAGE_IMAGES[page.slug].alt}
                    width={640}
                    height={800}
                    loading="lazy"
                    decoding="async"
                  />
                ) : null}
                <h3>{page.title}</h3>
                <p>{stripHtml(page.excerpt || page.content).slice(0, 120)}…</p>
              </Link>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
