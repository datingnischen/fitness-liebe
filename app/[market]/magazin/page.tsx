import type { Metadata } from "next";
import Link from "@/components/local-link";
import { canonicalMagazinePagePath } from "@/lib/about-section";
import { PostCard, postTeaser } from "@/components/post-card";
import { getMagazineTopicLinks } from "@/lib/magazine-topics";
import { resolveMarket, type MarketParams } from "@/lib/market-params";
import { REGISTRATION_URL, marketAlternates, publicUrl } from "@/lib/markets";
import { staticAsset } from "@/lib/static-asset";
import { MAGAZINE_POSTS_PER_PAGE, getEntryCoverImage, getMagazinePages, getMagazinePostsPage, getReadingMinutes } from "@/lib/magazine";
import "./magazin.css";

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
  // alle Beiträge der ersten Seite zeigen, sonst fehlen sie in der Blätterfolge (Seite 2 beginnt bei Nr. 13)
  const latestPosts = posts.slice(1);
  const importantPages = pages.filter((page) => !SIDEBAR_HIDDEN_PAGES.has(page.slug)).slice(0, 6);
  const featuredCover = featuredPost ? getEntryCoverImage(featuredPost) : null;

  return (
    <main className="mag-page">
      <section className="mag-stage" aria-labelledby="mag-title">
        <div className="mag-stage-inner">
          <div className="mag-stage-copy">
            <span className="mag-kicker">Fitness-Magazin</span>
            <h1 id="mag-title">
              Training, Ernährung und <span className="mag-mark">Dating</span> für sportliche Singles
            </h1>
            <p>
              Flirten im Gym, fit bleiben als Paar, Krafttraining, Kalorienbedarf und Rezepte fürs Kochdate – geschrieben
              von Datingexperte Christian M. Haas, mit direktem Weg zur Anmeldung.
            </p>
            <div className="mag-stage-actions">
              <a className="button button-primary button-xl" href={REGISTRATION_URL}>
                Kostenlos registrieren <span aria-hidden="true">→</span>
              </a>
              <Link className="button button-ghost" href="/magazin/fitnesswelten">
                Fitnesswelten entdecken
              </Link>
            </div>
          </div>

          {featuredPost ? (
            <article className="mag-featured">
              <div className="mag-featured-media">
                {featuredCover ? (
                  <img src={featuredCover} alt={featuredPost.featuredImageAlt || featuredPost.title} loading="eager" fetchPriority="high" decoding="async" />
                ) : null}
              </div>
              <div className="mag-featured-copy">
                <span className="mag-featured-label">Gerade beliebt</span>
                <h2>
                  <Link href={`/magazin/${featuredPost.slug}`}>{featuredPost.title}</Link>
                </h2>
                <p>{postTeaser(featuredPost, 150)}</p>
                <span className="mag-featured-meta">
                  {featuredPost.authorName ? `Von ${featuredPost.authorName} · ` : null}
                  {getReadingMinutes(featuredPost.content)} Min. Lesezeit <span aria-hidden="true">→</span>
                </span>
              </div>
            </article>
          ) : null}
        </div>
        <svg className="mag-stage-pulse" viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <path d="M0 80h520l22-40 28 74 26-96 28 104 20-42h556" />
        </svg>
      </section>

      <div className="shell mag-shell">
        <section className="mag-section" aria-labelledby="mag-topics-title">
          <div className="mag-section-head">
            <div className="section-header">
              <span className="eyebrow">Fitnesswelten</span>
              <h2 id="mag-topics-title">Direkt ins Thema</h2>
              <p>Schnelle Wege zu Fitness-Dating, Paar-Workouts, Training, Ernährung und Rezepten.</p>
            </div>
            <Link className="mag-section-link" href="/magazin/inhalt">
              Alle Beiträge A–Z <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="mag-topic-grid">
            {topics.slice(0, 8).map((topic) => (
              <Link key={topic.slug} className="mag-topic" href={`/magazin/thema/${topic.slug}`}>
                <span className="mag-topic-icon" aria-hidden="true">
                  {topic.emoji}
                </span>
                <strong>{topic.name}</strong>
                {topic.count > 0 ? (
                  <small>
                    {topic.count} {topic.count === 1 ? "Beitrag" : "Beiträge"}
                  </small>
                ) : null}
                <i aria-hidden="true">→</i>
              </Link>
            ))}
          </div>
        </section>

        <section className="mag-section" aria-labelledby="mag-latest-title">
          <div className="mag-section-head">
            <div className="section-header">
              <span className="eyebrow">Neueste Beiträge</span>
              <h2 id="mag-latest-title">Frisch aus dem Magazin</h2>
            </div>
            <span className="mag-count">
              Seite 1 von {totalPages} · {totalItems} Beiträge
            </span>
          </div>
          <div className="post-grid">
            {latestPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          <div className="mag-pagination">
            <Link className="button button-secondary" href={totalPages > 1 ? "/magazin/page/2" : "/magazin/inhalt"}>
              {totalPages > 1 ? "Ältere Beiträge" : "Alle Beiträge A–Z"} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {importantPages.length ? (
          <section className="mag-section mag-authors" aria-labelledby="mag-authors-title">
            <div className="section-header">
              <span className="eyebrow">Autoren</span>
              <h2 id="mag-authors-title">Wer hinter dem Magazin steht</h2>
              <p>Dating-Erfahrung und Leidenschaft für Sport – die Menschen hinter den Artikeln.</p>
            </div>
            <div className="mag-author-grid">
              {importantPages.map((page) => (
                <article key={page.id} className="mag-author">
                  {SIDEBAR_PAGE_IMAGES[page.slug] ? (
                    <img
                      src={staticAsset(SIDEBAR_PAGE_IMAGES[page.slug].src)}
                      alt={SIDEBAR_PAGE_IMAGES[page.slug].alt}
                      width={800}
                      height={640}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : null}
                  <div>
                    <h3>
                      <Link href={canonicalMagazinePagePath(page.slug)}>{page.title}</Link>
                    </h3>
                    <p>{postTeaser(page, 140)}</p>
                    <span className="mag-author-more" aria-hidden="true">
                      Profil ansehen →
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
