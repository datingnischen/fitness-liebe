/**
 * Löst den angehängten Bildnachweis („<p><small>Bildquelle: …</small></p>“, oft mit <hr> davor)
 * aus dem ICONY-Text, damit er zugeklappt unter dem Text stehen kann.
 */
export function extractImageCredit(html: string): { html: string; creditUrl: string | null } {
  const pattern = /(?:<hr\s*\/?>\s*)?<p>\s*<small>\s*Bildquelle:\s*([^<]*?)\s*<\/small>\s*<\/p>\s*$/i;
  const match = html.match(pattern);
  if (!match) return { html, creditUrl: null };
  // „https:https://…“ kommt in den Altdaten vor: die letzte vollständige URL zählt
  const urls = match[1].match(/https?:\/\/\S+/g);
  return { html: html.slice(0, match.index).trimEnd(), creditUrl: urls ? urls[urls.length - 1] : null };
}

export function creditLabel(url: string) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return host === "pixabay.com" ? "Pixabay" : host;
  } catch {
    return "Quelle";
  }
}
