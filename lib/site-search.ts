// Seitensuche unter /<land>/ueber-uns/suche/. Die Suche liegt unter „Über uns“, weil der nginx vor der
// Live-Domain nur bestimmte Pfade an Next.js durchreicht; /suche/ gehört der ICONY-Plattform.
// Reine Funktionen ohne Datenquellen – die Seite reicht Magazin, Fitnesswelten und Stadtseiten herein.

export const SITE_SEARCH_PATH = "/ueber-uns/suche";
export const SITE_SEARCH_MAX_RESULTS = 50;

export type SearchDocument = {
  /** Bereich auf der Ergebniskarte, z. B. „Magazin“ oder „Stadt“. */
  section: string;
  title: string;
  /** Kurzer Text für die Karte (Auszug, Claim, Lead). */
  excerpt: string;
  /** Weiterer durchsuchbarer Text (Inhalt ohne HTML). */
  text?: string;
  /** Seitenpfad ohne Länderpräfix, z. B. /magazin/cardio-training */
  path: string;
};

export type SearchResult = SearchDocument & { score: number };

/** Kleinschreibung, ä/ö/ü/ß ≙ ae/oe/ue/ss, übrige Diakritika weg. */
export function normalizeSearchText(text = ""): string {
  return text
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function searchTerms(query = ""): string[] {
  return [...new Set(normalizeSearchText(query).split(" ").filter((term) => term.length > 1))];
}

type Prepared = { doc: SearchDocument; title: string; excerpt: string; text: string };

function prepare(doc: SearchDocument): Prepared {
  return {
    doc,
    title: ` ${normalizeSearchText(doc.title)} `,
    excerpt: ` ${normalizeSearchText(doc.excerpt)} `,
    text: ` ${normalizeSearchText(doc.text)} `,
  };
}

/**
 * Alle Begriffe müssen vorkommen (Titel, Auszug oder Text). Titel-Treffer zählen am meisten,
 * danach Auszug, dann Text; die ganze Phrase im Titel gibt einen Extrabonus.
 */
export function searchDocuments(docs: SearchDocument[], query: string, limit = SITE_SEARCH_MAX_RESULTS): SearchResult[] {
  const terms = searchTerms(query);
  if (!terms.length) return [];
  const phrase = terms.join(" ");
  const results: SearchResult[] = [];
  const seen = new Set<string>();

  for (const item of docs.map(prepare)) {
    if (seen.has(item.doc.path)) continue;
    let score = 0;
    let matchedAll = true;
    for (const term of terms) {
      if (item.title.includes(` ${term}`)) score += 100;
      else if (item.title.includes(term)) score += 70;
      else if (item.excerpt.includes(term)) score += 20;
      else if (item.text.includes(term)) score += 5;
      else {
        matchedAll = false;
        break;
      }
    }
    if (!matchedAll) continue;
    if (terms.length > 1 && item.title.includes(phrase)) score += 50;
    seen.add(item.doc.path);
    results.push({ ...item.doc, score });
  }

  return results
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, "de"))
    .slice(0, limit);
}

/** Kurzer Auszug für die Ergebniskarte. */
export function shortExcerpt(text = "", maxLength = 180): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= maxLength) return clean;
  const cut = clean.slice(0, maxLength);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(" "), maxLength - 30)).trim()} …`;
}
