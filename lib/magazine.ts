import { loadMagazineCategories, loadMagazinePages, loadMagazinePosts } from "#magazine-content";
import { DEFAULT_MARKET, localizeHref, type MarketCode } from "#markets";

export const SITE_URL = "https://fitness-liebe.de";
export const MAGAZINE_POSTS_PER_PAGE = 12;

export type MagazineCategory = {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
};

export type MagazineEntry = {
  id: number;
  slug: string;
  type: "post" | "page";
  date?: string;
  modified?: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  featuredImageAlt?: string;
  authorName?: string;
  authorSlug?: string;
  categories: MagazineCategory[];
  /** SEO-Titel aus AIOSEO (beim Import von Smart-Tags befreit), ohne Seitennamen (den ergänzt das Title-Template). */
  seoTitle?: string;
  /** Meta-Description aus AIOSEO. */
  seoDescription?: string;
};

function decodeNamedEntities(text: string) {
  const entities: Record<string, string> = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
    nbsp: " ",
    ndash: "–",
    mdash: "—",
    rsquo: "’",
    lsquo: "‘",
    rdquo: "”",
    ldquo: "“",
    hellip: "…",
    auml: "ä",
    ouml: "ö",
    uuml: "ü",
    Auml: "Ä",
    Ouml: "Ö",
    Uuml: "Ü",
    szlig: "ß",
    eacute: "é",
    agrave: "à",
    ecirc: "ê",
    copy: "©",
    reg: "®",
    trade: "™",
  };

  return text.replace(/&([a-zA-Z]+);/g, (_, name: string) => entities[name] ?? `&${name};`);
}

export function decodeHtmlEntities(text = "") {
  return decodeNamedEntities(text)
    .replace(/&#(\d+);/g, (_, dec: string) => String.fromCodePoint(Number(dec)))
    .replace(/&#x([\da-fA-F]+);/g, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)));
}

export function stripHtml(text = "") {
  return decodeHtmlEntities(text)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Viele Beiträge haben kein Beitragsbild, aber Bilder im Inhalt – das erste taugt als Kartenbild.
// Steckbrief-Häkchen (check-icon-16.png) und Emojis sind keine Kartenbilder.
const DECORATIVE_IMAGE = /(?:icon|emoji|smilies)[^"'/]*\.(?:png|gif|svg)|-\d{2}x\d{2}\.|\/s\.w\.org\//i;

export function getEntryCoverImage(entry: Pick<MagazineEntry, "featuredImage" | "content">) {
  if (entry.featuredImage) return entry.featuredImage;
  for (const match of entry.content.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)) {
    const width = Number(match[0].match(/\swidth=["']?(\d+)/i)?.[1] || 0);
    if (DECORATIVE_IMAGE.test(match[1]) || (width && width < 120)) continue;
    return decodeHtmlEntities(match[1]);
  }
  return undefined;
}

export function getReadingMinutes(html = "") {
  const words = stripHtml(html).split(" ").filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

const INTERNAL_CONTENT_LINK =
  /href=(["'])https?:\/\/(?:www\.)?fitness-liebe\.de(\/(?:magazin|partnersuche|ueber-uns|social-media)(?:[\/?#][^"']*)?)\1/gi;

// WordPress speichert interne Links absolut; relativ mit Länderpräfix funktionieren sie auf Produktion und auf Vercel-Previews.
// localizeHref hängt den Schrägstrich an und führt Magazinlinks aus Ländern ohne Magazin nach /de.
export function relativizeInternalLinks(html = "", market: MarketCode = DEFAULT_MARKET) {
  return html.replace(INTERNAL_CONTENT_LINK, (match, quote: string, path: string) => {
    if (/\/wp-(?:content|admin|json)\//i.test(path)) return match;
    return `href=${quote}${localizeHref(market, path)}${quote}`;
  });
}

// Viele Beiträge beginnen mit einer Audio-Zusammenfassung ("Artikel kurz anhören").
const AUDIO_SUMMARY_BLOCK = /(?:<p>)?\s*<!--\s*audio-summary:start\s*-->([\s\S]*?)<!--\s*audio-summary:end\s*-->\s*(?:<\/p>)?/i;

export function getAudioSummarySource(html = "") {
  const block = html.match(AUDIO_SUMMARY_BLOCK)?.[1] ?? "";
  return block.match(/<source[^>]+src=["']([^"']+\.mp3)["']/i)?.[1] ?? block.match(/<audio[^>]+src=["']([^"']+)["']/i)?.[1];
}

/** Ersetzt den WordPress-Audioblock durch eine gestaltete Hörfassung. */
export function enhanceAudioSummary(html = "") {
  const src = getAudioSummarySource(html);
  if (!src) return html.replace(AUDIO_SUMMARY_BLOCK, "");
  const card = [
    '<aside class="audio-summary" aria-label="Artikel kurz anhören">',
    '<span class="audio-summary-icon" aria-hidden="true">🎧</span>',
    '<div class="audio-summary-copy"><strong>Artikel kurz anhören</strong><span>Die wichtigsten Punkte in wenigen Minuten</span></div>',
    `<audio controls preload="none" src="${src}">Dein Browser unterstützt das Audio-Element nicht.</audio>`,
    "</aside>",
  ].join("");
  return html.replace(AUDIO_SUMMARY_BLOCK, card);
}

export function formatGermanDate(dateString?: string) {
  if (!dateString) return "";

  try {
    return new Intl.DateTimeFormat("de-DE", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(dateString));
  } catch {
    return dateString.slice(0, 10);
  }
}

// Artikel zeigen das Änderungsdatum statt des Veröffentlichungsdatums (Fallback: date).
// Feste Seiten (type "page", Autoren, Hubs) zeigen gar kein Datum.
export function formatUpdatedLabel(dateString?: string) {
  const formatted = formatGermanDate(dateString);
  return formatted ? `Aktualisiert am ${formatted}` : "";
}

export function getUpdatedDate(entry: { date?: string; modified?: string }) {
  return entry.modified || entry.date;
}

export function formatUpdatedDate(entry: { date?: string; modified?: string }) {
  return formatUpdatedLabel(getUpdatedDate(entry));
}

// Magazin-Seiten ohne Index: Rechtstexte gehören der Plattform (datenschutz.html, impressum.html),
// Gazis Profil bleibt draußen, solange die Kooperation nicht feststeht.
export const NOINDEX_MAGAZINE_PAGES = new Set(["datenschutz", "impressum", "gazi-avakhti"]);

export const getMagazineCategories = async (): Promise<MagazineCategory[]> => loadMagazineCategories();

export const getMagazinePosts = async (): Promise<MagazineEntry[]> => loadMagazinePosts();

export const getMagazinePages = async (): Promise<MagazineEntry[]> => loadMagazinePages();

export const getMagazinePostsPage = async (
  page: number,
  perPage = MAGAZINE_POSTS_PER_PAGE,
): Promise<{ posts: MagazineEntry[]; totalPages: number; totalItems: number }> => {
  const all = loadMagazinePosts();
  return {
    posts: all.slice((page - 1) * perPage, page * perPage),
    totalPages: Math.max(1, Math.ceil(all.length / perPage)),
    totalItems: all.length,
  };
};

export const getAllMagazineEntries = async (): Promise<MagazineEntry[]> => [...loadMagazinePosts(), ...loadMagazinePages()];

export const getMagazineEntryBySlug = async (slug: string): Promise<MagazineEntry | null> =>
  loadMagazinePosts().find((entry) => entry.slug === slug) ?? loadMagazinePages().find((entry) => entry.slug === slug) ?? null;

export const getMagazineCategoryBySlug = async (slug: string): Promise<MagazineCategory | null> =>
  loadMagazineCategories().find((category) => category.slug === slug) ?? null;

export const getMagazinePostsByCategory = async (categoryId: number): Promise<MagazineEntry[]> =>
  loadMagazinePosts().filter((post) => post.categories.some((category) => category.id === categoryId));
