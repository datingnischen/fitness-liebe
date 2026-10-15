import type { Metadata } from "next";
import Link from "@/components/local-link";
import { DEFAULT_MARKET, REGISTRATION_URL, isMarketCode, marketAlternates, marketPath, publicUrl } from "@/lib/markets";
import { notFound, redirect } from "next/navigation";
import { MAGAZINE_POSTS_PER_PAGE, getMagazinePostsPage } from "@/lib/magazine";
import { PostCard } from "@/components/post-card";
import "../../magazin.css";

type PageProps = {
  params: Promise<{ market: string; page: string }>;
};

function parsePageNumber(value: string) {
  const pageNumber = Number(value);
  return Number.isInteger(pageNumber) && pageNumber > 0 ? pageNumber : null;
}

export async function generateStaticParams() {
  const { totalPages } = await getMagazinePostsPage(1, MAGAZINE_POSTS_PER_PAGE);
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) => ({ market: DEFAULT_MARKET, page: String(index + 2) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { market, page } = await params;
  const pageNumber = parsePageNumber(page);
  if (!pageNumber || !isMarketCode(market)) return {};
  if (pageNumber === 1) {
    return {
      alternates: marketAlternates(market, "/magazin"),
    };
  }

  return {
    title: `Fitness-Magazin – Seite ${pageNumber}`,
    description: `Weitere Magazin-Beiträge zu Fitness-Dating, Training und Ernährung für sportliche Singles – Seite ${pageNumber}.`,
    alternates: marketAlternates(market, `/magazin/page/${pageNumber}`),
    openGraph: {
      title: `Fitness-Magazin – Seite ${pageNumber}`,
      description: `Weitere Magazin-Beiträge zu Fitness-Dating, Training und Ernährung für sportliche Singles – Seite ${pageNumber}.`,
      url: publicUrl(market, `/magazin/page/${pageNumber}`),
    },
  };
}

export default async function MagazinePaginationPage({ params }: PageProps) {
  const { market, page } = await params;
  const pageNumber = parsePageNumber(page);
  if (!pageNumber || !isMarketCode(market)) notFound();
  if (pageNumber === 1) redirect(marketPath(market, "/magazin"));

  const { posts, totalPages, totalItems } = await getMagazinePostsPage(pageNumber, MAGAZINE_POSTS_PER_PAGE);
  if (!posts.length || pageNumber > totalPages) notFound();

  return (
    <main className="mag-page">
      <section className="mag-stage mag-stage-compact" aria-labelledby="mag-title">
        <div className="mag-stage-inner">
          <div className="mag-stage-copy">
            <span className="mag-kicker">Fitness-Magazin · Seite {pageNumber}</span>
            <h1 id="mag-title">
              Weitere Beiträge für <span className="mag-mark">sportliche Singles</span>
            </h1>
            <p>
              Hier findest du weitere Artikel, Trainingstipps und Dating-Ratgeber aus dem Magazin – ideal zum Stöbern
              zwischen Workout, Ernährung und Fitness-Flirt.
            </p>
            <div className="mag-stage-actions">
              <a className="button button-primary button-xl" href={REGISTRATION_URL}>
                Kostenlos registrieren <span aria-hidden="true">→</span>
              </a>
              <Link className="button button-ghost" href="/magazin">
                Zur ersten Magazin-Seite
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="shell mag-shell">
        <section className="mag-section" aria-labelledby="mag-latest-title">
          <div className="mag-section-head">
            <div className="section-header">
              <span className="eyebrow">Seite {pageNumber}</span>
              <h2 id="mag-latest-title">Weitere aktuelle Artikel</h2>
            </div>
            <span className="mag-count">
              Seite {pageNumber} von {totalPages} · {totalItems} Beiträge
            </span>
          </div>
          <div className="post-grid">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          <nav className="mag-pagination" aria-label="Seitennavigation Magazin">
            {pageNumber > 2 ? (
              <Link className="button button-secondary" href={`/magazin/page/${pageNumber - 1}`}>
                <span aria-hidden="true">←</span> Neuere Beiträge
              </Link>
            ) : (
              <Link className="button button-secondary" href="/magazin">
                <span aria-hidden="true">←</span> Neuere Beiträge
              </Link>
            )}
            {pageNumber < totalPages ? (
              <Link className="button button-secondary" href={`/magazin/page/${pageNumber + 1}`}>
                Ältere Beiträge <span aria-hidden="true">→</span>
              </Link>
            ) : null}
          </nav>
        </section>
      </div>
    </main>
  );
}
