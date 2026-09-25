import type { Metadata } from "next";
import Link from "@/components/local-link";
import { formatUpdatedLabel, getMagazinePages, getMagazinePosts } from "@/lib/wordpress";
import { buildMagazineIndex, countIndexLinks } from "@/lib/magazine-index";
import { serializeJsonLd } from "@/lib/json-ld";
import { resolveMarket, type MarketParams } from "@/lib/market-params";
import { marketAlternates, publicUrl } from "@/lib/markets";
import { MagazineIndexBrowser } from "./magazine-index-browser";
import "./inhalt.css";

export const revalidate = 300;

const TITLE = "Inhaltsverzeichnis: alle Magazin-Beiträge & Seiten A–Z";
const DESCRIPTION =
  "Alle Beiträge des fitness-liebe.de Magazins auf einen Blick – Fitness-Dating, Fit als Paar, Training, Ernährung und Rezepte, nach Thema sortiert und durchsuchbar.";

type PageProps = { params: MarketParams };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const market = await resolveMarket(params);
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: marketAlternates(market, "/magazin/inhalt"),
    openGraph: { title: TITLE, description: DESCRIPTION, url: publicUrl(market, "/magazin/inhalt"), type: "website" },
  };
}

export default async function MagazineIndexPage({ params }: PageProps) {
  const market = await resolveMarket(params);
  const PAGE_URL = publicUrl(market, "/magazin/inhalt");
  const [posts, pages] = await Promise.all([getMagazinePosts(), getMagazinePages()]);
  const sections = buildMagazineIndex({ posts, pages, formatDate: formatUpdatedLabel });
  const total = countIndexLinks(sections);

  const breadcrumbGraph = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Magazin", item: publicUrl(market, "/magazin") },
      { "@type": "ListItem", position: 2, name: "Inhaltsverzeichnis", item: PAGE_URL },
    ],
  };

  return (
    <main className="shell magazine-index-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbGraph) }} />

      <nav className="magazine-index-breadcrumb" aria-label="Brotkrumen">
        <Link href="/magazin">Magazin</Link>
        <span aria-hidden="true">›</span>
        <span aria-current="page">Inhaltsverzeichnis</span>
      </nav>

      <section className="magazine-index-hero">
        <span className="eyebrow">Inhaltsverzeichnis</span>
        <h1>Alles aus dem Magazin – auf einen Blick.</h1>
        <p>
          {posts.length} Beiträge zu Fitness-Dating, Training, Ernährung und Rezepten – plus unsere Autorenprofile.
          Tippe einfach los oder spring direkt zum Thema.
        </p>
      </section>

      <MagazineIndexBrowser sections={sections} total={total} />
    </main>
  );
}
