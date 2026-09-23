import type { MetadataRoute } from "next";
import { ABOUT_OVERVIEW_PATH, ABOUT_SOCIAL_MEDIA_PATH, DATING_TIPS_PATH } from "@/lib/about-section";
import { getKnownAuthorSlugs, isNoindexAuthorArchive } from "@/lib/author-profiles";
import { FITNESSWELTEN } from "@/lib/fitnesswelten";
import { getMarketCityPages } from "@/lib/market-partnersuche";
import { SITE_URL, getMagazinePages, getMagazinePosts } from "@/lib/wordpress";

const NOINDEX_PAGES = new Set(["datenschutz", "impressum"]);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, pages, authors] = await Promise.all([getMagazinePosts(), getMagazinePages(), getKnownAuthorSlugs()]);

  const staticRoutes: Array<[string, MetadataRoute.Sitemap[number]["changeFrequency"], number]> = [
    ["/", "daily", 1],
    ["/magazin", "daily", 0.9],
    ["/partnersuche", "weekly", 0.9],
    ["/magazin/fitnesswelten", "weekly", 0.8],
    ["/magazin/inhalt", "daily", 0.7],
    [DATING_TIPS_PATH, "monthly", 0.7],
    [ABOUT_OVERVIEW_PATH, "monthly", 0.7],
    [ABOUT_SOCIAL_MEDIA_PATH, "monthly", 0.6],
  ];

  return [
    ...staticRoutes.map(([path, changeFrequency, priority]) => ({ url: `${SITE_URL}${path}`, changeFrequency, priority })),
    ...posts.map((post) => ({
      url: `${SITE_URL}/magazin/${post.slug}`,
      lastModified: post.modified || post.date,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...pages
      .filter((page) => !NOINDEX_PAGES.has(page.slug))
      .map((page) => ({
        url: `${SITE_URL}/magazin/${page.slug}`,
        lastModified: page.modified || page.date,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
    ...FITNESSWELTEN.map((world) => ({
      url: `${SITE_URL}/magazin/thema/${world.id}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...authors
      .filter((slug) => !isNoindexAuthorArchive(slug))
      .map((slug) => ({
        url: `${SITE_URL}/magazin/author/${slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.5,
      })),
    ...getMarketCityPages("de").map((page) => ({
      url: `${SITE_URL}${page.path}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
