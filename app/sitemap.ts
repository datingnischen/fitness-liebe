import type { MetadataRoute } from "next";
import { ABOUT_OVERVIEW_PATH, ABOUT_SOCIAL_MEDIA_PATH, DATING_TIPS_PATH } from "@/lib/about-section";
import { getKnownAuthorSlugs, isNoindexAuthorArchive } from "@/lib/author-profiles";
import { FITNESSWELTEN } from "@/lib/fitnesswelten";
import { getMarketCityPages, marketsWithCity } from "@/lib/market-partnersuche";
import { MARKET_CODES, marketAlternates, publicUrl, type MarketCode } from "@/lib/markets";
import { NOINDEX_MAGAZINE_PAGES, getMagazinePages, getMagazinePosts } from "@/lib/wordpress";


type Entry = MetadataRoute.Sitemap[number];
type Route = Omit<Entry, "url" | "alternates"> & { path: string; markets?: readonly MarketCode[] };

// Jede Seite steht einmal je Land in der Sitemap, mit hreflang-Verweisen auf die anderen Länder.
function localized(route: Route): Entry[] {
  const { path, markets = MARKET_CODES, ...entry } = route;
  return markets.map((market) => ({
    ...entry,
    url: publicUrl(market, path),
    alternates: { languages: marketAlternates(market, path, markets).languages },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, pages, authors] = await Promise.all([getMagazinePosts(), getMagazinePages(), getKnownAuthorSlugs()]);
  const partnersucheMarkets = MARKET_CODES.filter((market) => getMarketCityPages(market).length);

  const routes: Route[] = [
    { path: "/", changeFrequency: "daily", priority: 1 },
    { path: "/magazin", changeFrequency: "daily", priority: 0.9 },
    { path: "/partnersuche", changeFrequency: "weekly", priority: 0.9, markets: partnersucheMarkets },
    { path: "/magazin/fitnesswelten", changeFrequency: "weekly", priority: 0.8 },
    { path: "/magazin/inhalt", changeFrequency: "daily", priority: 0.7 },
    { path: DATING_TIPS_PATH, changeFrequency: "monthly", priority: 0.7 },
    { path: ABOUT_OVERVIEW_PATH, changeFrequency: "monthly", priority: 0.7 },
    { path: ABOUT_SOCIAL_MEDIA_PATH, changeFrequency: "monthly", priority: 0.6 },
    ...posts.map((post): Route => ({
      path: `/magazin/${post.slug}`,
      lastModified: post.modified || post.date,
      changeFrequency: "weekly",
      priority: 0.8,
    })),
    ...pages
      .filter((page) => !NOINDEX_MAGAZINE_PAGES.has(page.slug))
      .map((page): Route => ({
        path: `/magazin/${page.slug}`,
        lastModified: page.modified || page.date,
        changeFrequency: "monthly",
        priority: 0.7,
      })),
    ...FITNESSWELTEN.map((world): Route => ({ path: `/magazin/thema/${world.id}`, changeFrequency: "weekly", priority: 0.7 })),
    ...authors
      .filter((slug) => !isNoindexAuthorArchive(slug))
      .map((slug): Route => ({ path: `/magazin/author/${slug}`, changeFrequency: "monthly", priority: 0.5 })),
  ];

  // Stadtseiten gibt es nur in den Ländern, für die sie importiert sind.
  const citySlugs = new Set(partnersucheMarkets.flatMap((market) => getMarketCityPages(market).map((page) => page.slug)));
  for (const slug of citySlugs) {
    routes.push({ path: `/partnersuche/${slug}`, changeFrequency: "weekly", priority: 0.8, markets: marketsWithCity(slug) });
  }

  return routes.flatMap(localized);
}
