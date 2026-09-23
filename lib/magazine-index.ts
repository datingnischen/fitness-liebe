import { FITNESSWELTEN, classifyFitnesswelt } from "#fitnesswelten";
import type { MagazineEntry } from "./wordpress";

// Inhaltsverzeichnis für /magazin/inhalt: alle Beiträge nach Fitnesswelt, dazu die Seiten.

export type MagazineIndexLink = {
  label: string;
  href: string;
};

export type MagazineIndexItem = MagazineIndexLink & {
  meta?: string;
  children: MagazineIndexLink[];
};

export type MagazineIndexSection = {
  id: string;
  title: string;
  emoji: string;
  kind: "posts" | "pages";
  href?: string;
  items: MagazineIndexItem[];
};

// Rechtstexte liegen auf der Plattform; im Verzeichnis zählen nur redaktionelle Seiten.
const LEGAL_PAGE_SLUGS = new Set(["datenschutz", "impressum"]);

export function magazineTopicEmoji(slug: string) {
  return FITNESSWELTEN.find((world) => world.id === slug || world.wpCategory === slug)?.emoji ?? "💪";
}

function byLabel(a: MagazineIndexLink, b: MagazineIndexLink) {
  return a.label.localeCompare(b.label, "de");
}

export function buildMagazineIndex({
  posts,
  pages,
  formatDate = (date?: string) => date?.slice(0, 10) ?? "",
}: {
  posts: MagazineEntry[];
  pages: MagazineEntry[];
  formatDate?: (date?: string) => string;
}): MagazineIndexSection[] {
  const sections: MagazineIndexSection[] = FITNESSWELTEN.map((world) => ({
    id: `thema-${world.id}`,
    title: world.name,
    emoji: world.emoji,
    kind: "posts" as const,
    href: `/magazin/thema/${world.id}`,
    items: posts
      .filter((post) => classifyFitnesswelt(post).id === world.id)
      .map((post) => ({ label: post.title, href: `/magazin/${post.slug}`, meta: formatDate(post.date), children: [] })),
  })).filter((section) => section.items.length);

  const editorialPages = pages
    .filter((page) => !LEGAL_PAGE_SLUGS.has(page.slug))
    .map((page) => ({ label: page.title.split(/\s+[–-]\s+/)[0], href: `/magazin/${page.slug}`, children: [] }))
    .sort(byLabel);
  if (editorialPages.length) {
    sections.push({ id: "autoren", title: "Autoren & Experten", emoji: "🧑‍🏫", kind: "pages", items: editorialPages });
  }

  return sections;
}

export function countIndexLinks(sections: MagazineIndexSection[]) {
  return sections.reduce(
    (sum, section) => sum + section.items.reduce((inner, item) => inner + 1 + item.children.length, 0),
    0,
  );
}
