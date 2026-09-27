import type { Metadata } from "next";
import { MarketLink } from "@/components/market-link";
import { SiteSearchForm } from "@/components/site-search-form";
import { ABOUT_OVERVIEW_PATH, ABOUT_SOCIAL_MEDIA_PATH } from "@/lib/about-section";
import { FITNESSWELTEN } from "@/lib/fitnesswelten";
import { getMarketCityPages, hasCityPages } from "@/lib/market-partnersuche";
import { resolveMarket, type MarketParams } from "@/lib/market-params";
import { publicUrl, type MarketCode } from "@/lib/markets";
import { SOCIAL_CHANNELS } from "@/lib/social-channels";
import { SITE_SEARCH_MAX_RESULTS, SITE_SEARCH_PATH, searchDocuments, searchTerms, shortExcerpt, type SearchDocument } from "@/lib/site-search";
import { NOINDEX_MAGAZINE_PAGES, getMagazinePages, getMagazinePosts, stripHtml } from "@/lib/wordpress";

const TITLE = "Suche";
const DESCRIPTION = "Durchsuche Magazin, Fitnesswelten und Städteseiten von fitness-liebe.de.";

type PageProps = { params: MarketParams; searchParams: Promise<{ q?: string | string[] }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const market = await resolveMarket(params);
  return {
    title: TITLE,
    description: DESCRIPTION,
    // Suchergebnisse gehören nicht in den Index; canonical immer auf die Suche ohne Query.
    robots: { index: false, follow: true },
    alternates: { canonical: publicUrl(market, SITE_SEARCH_PATH) },
  };
}

async function loadDocuments(market: MarketCode): Promise<SearchDocument[]> {
  // Gecachte Listen-Helfer (react cache + revalidate 300 s) – kein eigener WP-Request pro Suchanfrage.
  const [posts, pages] = await Promise.all([
    getMagazinePosts().catch(() => []),
    getMagazinePages().catch(() => []),
  ]);

  const docs: SearchDocument[] = [
    ...posts.map((post) => ({
      section: "Magazin",
      title: post.title,
      excerpt: stripHtml(post.excerpt),
      text: stripHtml(post.content),
      path: `/magazin/${post.slug}`,
    })),
    ...FITNESSWELTEN.map((world) => ({
      section: "Fitnesswelt",
      title: world.name,
      excerpt: world.claim,
      text: [world.shortName, world.intro, ...world.highlights.map((item) => `${item.name} ${item.tagline} ${item.teaser}`)].join(" "),
      path: `/magazin/thema/${world.id}`,
    })),
    ...getMarketCityPages(market).map((page) => ({
      section: "Stadt",
      title: page.title || `Partnersuche ${page.cityName}`,
      excerpt: page.lead || page.description,
      text: `${page.cityName} ${page.description} ${stripHtml(page.contentHtml)}`,
      path: `/partnersuche/${page.slug}`,
    })),
    ...pages
      .filter((page) => !NOINDEX_MAGAZINE_PAGES.has(page.slug))
      .map((page) => ({
        section: "Autoren",
        title: page.title,
        excerpt: stripHtml(page.excerpt),
        text: stripHtml(page.content),
        path: `/magazin/${page.slug}`,
      })),
    {
      section: "Über uns",
      title: "Über fitness-liebe.de",
      excerpt: "Wer hinter fitness-liebe.de steht, wofür wir stehen und worauf du dich verlassen kannst.",
      text: "Über uns Team Gründer Christian M. Haas Sicherheit Vertrauen",
      path: ABOUT_OVERVIEW_PATH,
    },
    {
      section: "Über uns",
      title: "Social Media",
      excerpt: `fitness-liebe.de auf ${SOCIAL_CHANNELS.map((channel) => channel.name).join(", ")}.`,
      text: "Kanäle Community Videos",
      path: ABOUT_SOCIAL_MEDIA_PATH,
    },
    {
      section: "Magazin",
      title: "Inhaltsverzeichnis A–Z",
      excerpt: "Alle Beiträge des Magazins nach Fitnesswelt sortiert.",
      path: "/magazin/inhalt",
    },
  ];

  if (hasCityPages(market)) {
    docs.push({
      section: "Stadt",
      title: "Partnersuche nach Städten",
      excerpt: "Sportliche Singles in deiner Stadt – alle Städteseiten im Überblick.",
      text: "Städte Regionen Partnersuche Singles",
      path: "/partnersuche",
    });
  }

  return docs;
}

export default async function SiteSearchPage({ params, searchParams }: PageProps) {
  const market = await resolveMarket(params);
  const { q } = await searchParams;
  const query = (Array.isArray(q) ? q[0] : q)?.trim().slice(0, 100) ?? "";
  const hasTerms = searchTerms(query).length > 0;
  const results = hasTerms ? searchDocuments(await loadDocuments(market), query) : [];

  return (
    <main className="shell shell-narrow site-search-page">
      <section className="hero-card hero-brand">
        <span className="eyebrow">Über uns · Suche</span>
        <h1>Was suchst du?</h1>
        <p>Durchsuche das Magazin, unsere Fitnesswelten und die Städteseiten – zum Beispiel nach „Krafttraining“, „Rezepte“ oder deiner Stadt.</p>
        <SiteSearchForm market={market} defaultValue={query} autoFocus={!query} />
      </section>

      <section className="content-section" aria-live="polite">
        {!query ? (
          <article className="panel-card">
            <h2>Gib einen Suchbegriff ein</h2>
            <p>Tipp: Kurze Begriffe finden am meisten. Umlaute kannst du auch als ae, oe oder ue schreiben.</p>
            <div className="chip-row">
              {FITNESSWELTEN.map((world) => (
                <MarketLink key={world.id} className="chip" market={market} path={`/magazin/thema/${world.id}`}>
                  {world.emoji} {world.shortName}
                </MarketLink>
              ))}
            </div>
          </article>
        ) : results.length === 0 ? (
          <article className="panel-card">
            <h2>Leider nichts gefunden</h2>
            <p>
              Zu „{query}“ haben wir nichts gefunden. Probier es mit einem anderen oder kürzeren Begriff – oder stöbere im
              Magazin.
            </p>
            <div className="button-row">
              <MarketLink className="button button-primary" market={market} path="/magazin">
                Zum Magazin
              </MarketLink>
              <MarketLink className="button button-secondary" market={market} path="/magazin/inhalt">
                Inhaltsverzeichnis A–Z
              </MarketLink>
            </div>
          </article>
        ) : (
          <>
            <p className="site-search-status">
              {results.length === 1 ? "1 Treffer" : `${results.length} Treffer`} für „{query}“
              {results.length >= SITE_SEARCH_MAX_RESULTS ? " – die besten zuerst" : ""}
            </p>
            <ol className="site-search-results">
              {results.map((result) => (
                <li key={result.path}>
                  <MarketLink className="panel-card site-search-card" market={market} path={result.path}>
                    <span className="site-search-section">{result.section}</span>
                    <h2>{result.title}</h2>
                    {result.excerpt ? <p>{shortExcerpt(result.excerpt)}</p> : null}
                  </MarketLink>
                </li>
              ))}
            </ol>
          </>
        )}
      </section>
    </main>
  );
}
