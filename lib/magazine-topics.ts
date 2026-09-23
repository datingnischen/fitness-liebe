import { cache } from "react";
import { FITNESSWELTEN, entriesForFitnesswelt, getFitnesswelt } from "@/lib/fitnesswelten";
import {
  getMagazineCategories,
  getMagazineCategoryBySlug,
  getMagazinePosts,
  getMagazinePostsByCategory,
  stripHtml,
  type MagazineEntry,
} from "@/lib/wordpress";

export type MagazineTopic = {
  slug: string;
  name: string;
  emoji: string;
  intro: string;
  posts: MagazineEntry[];
};

// "Allgemein" ist die WordPress-Sammelkategorie und kein Thema, das man ansteuern will.
export const HIDDEN_CATEGORY_SLUGS = new Set(["allgemein", "uncategorized"]);

export type MagazineTopicLink = { slug: string; name: string; emoji: string; count: number };

/** Themen für Navigation und Kacheln: zuerst die Fitnesswelten, dann weitere WP-Kategorien. */
export const getMagazineTopicLinks = cache(async (): Promise<MagazineTopicLink[]> => {
  const [posts, categories] = await Promise.all([getMagazinePosts(), getMagazineCategories()]);
  const worlds = FITNESSWELTEN.map((world) => ({
    slug: world.id,
    name: world.shortName,
    emoji: world.emoji,
    count: entriesForFitnesswelt(world.id, posts).length,
  }));
  const extra = categories
    .filter((category) => !HIDDEN_CATEGORY_SLUGS.has(category.slug) && !getFitnesswelt(category.slug))
    .map((category) => ({ slug: category.slug, name: category.name, emoji: "📌", count: category.count }));
  return [...worlds, ...extra].filter((topic) => topic.count > 0);
});

export const getMagazineTopic = cache(async (slug: string): Promise<MagazineTopic | null> => {
  const world = getFitnesswelt(slug);
  if (world) {
    const posts = entriesForFitnesswelt(world.id, await getMagazinePosts());
    return { slug, name: world.name, emoji: world.emoji, intro: world.intro, posts };
  }
  if (HIDDEN_CATEGORY_SLUGS.has(slug)) return null;

  const category = await getMagazineCategoryBySlug(slug);
  if (!category) return null;
  return {
    slug,
    name: category.name,
    emoji: "📌",
    intro:
      stripHtml(category.description) ||
      `Hier findest du Artikel, Ratgeber und praktische Einstiege rund um ${category.name} – für sportliche Singles und aktive Paare.`,
    posts: await getMagazinePostsByCategory(category.id),
  };
});

export function topicEmoji(slug: string) {
  return getFitnesswelt(slug)?.emoji ?? "💪";
}
