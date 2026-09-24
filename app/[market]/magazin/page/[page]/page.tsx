import type { Metadata } from "next";
import Link from "@/components/local-link";
import { REGISTRATION_URL, isMarketCode, marketAlternates, marketPath, publicUrl } from "@/lib/markets";
import { notFound, redirect } from "next/navigation";
import { MAGAZINE_POSTS_PER_PAGE, getMagazinePostsPage, stripHtml } from "@/lib/wordpress";

type PageProps = {
  params: Promise<{ market: string; page: string }>;
};

export const revalidate = 300;

function parsePageNumber(value: string) {
  const pageNumber = Number(value);
  return Number.isInteger(pageNumber) && pageNumber > 0 ? pageNumber : null;
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
    <main className="shell shell-narrow">
      <section className="hero-card hero-brand">
        <span className="eyebrow">Fitness-Magazin</span>
        <h1>Weitere Magazin-Beiträge für sportliche Singles</h1>
        <p>
          Hier findest du weitere Artikel, Trainingstipps und Dating-Ratgeber aus dem Magazin — ideal zum Stöbern
          zwischen Workout, Ernährung und Fitness-Flirt.
        </p>
        <div className="button-row">
          <Link className="button button-primary" href={REGISTRATION_URL}>
            Kostenlos registrieren
          </Link>
          <Link className="button button-secondary" href="/magazin">
            Zur ersten Magazin-Seite
          </Link>
        </div>
      </section>

      <section className="content-section">
        <div className="section-header">
          <span className="eyebrow">Seite {pageNumber}</span>
          <h2>Weitere aktuelle Artikel</h2>
        </div>
        <div className="stack-list">
          {posts.map((post) => (
            <Link key={post.id} href={`/magazin/${post.slug}`} className="article-card article-card-rich">
              {post.featuredImage ? (
                <div className="article-card-media">
                  <img src={post.featuredImage} alt={post.featuredImageAlt || post.title} loading="lazy" decoding="async" />
                </div>
              ) : null}
              <div className="article-card-copy">
                <h3>{post.title}</h3>
                <p>{stripHtml(post.excerpt || post.content).slice(0, 170)}…</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="pagination-bar" aria-label="Seitennavigation Magazin">
          <span>
            Seite {pageNumber} von {totalPages} · {totalItems} Beiträge
          </span>
          <div className="pagination-actions">
            {pageNumber > 2 ? (
              <Link className="button button-secondary" href={`/magazin/page/${pageNumber - 1}`}>
                Neuere Beiträge
              </Link>
            ) : pageNumber === 2 ? (
              <Link className="button button-secondary" href="/magazin">
                Neuere Beiträge
              </Link>
            ) : null}
            {pageNumber < totalPages ? (
              <Link className="button button-secondary" href={`/magazin/page/${pageNumber + 1}`}>
                Ältere Beiträge
              </Link>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
