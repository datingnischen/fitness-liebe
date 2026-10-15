import { titleWidth } from "./seo-title";

/**
 * Meta-Descriptions auf die in Suchergebnissen sichtbare Länge kürzen. Google und Seobility messen in Pixeln
 * (Arial 14px, Grenze 1.000 px); Seobility meldete Beschreibungen mit 154 Zeichen als „zu lang“. Gekürzt wird
 * deshalb auf höchstens 150 Zeichen UND 980 px, bevorzugt am Satzende, sonst am Wortende mit Auslassungszeichen.
 * Der sichtbare Seitentext bleibt unverändert.
 */
export const META_DESCRIPTION_MAX = 150;
/** Pixelgrenze in Arial 14px (1.000 px bei Seobility, 20 px Puffer). */
export const META_DESCRIPTION_MAX_WIDTH = 980;
const MIN_SENTENCE_LENGTH = 90;

/** Breite in Arial 14px – die 20px-Tabelle aus seo-title.ts skaliert linear (14/20). */
export function descriptionWidth(text: string) {
  return titleWidth(text) * 0.7;
}

export function clampMetaDescription(text?: string | null, max = META_DESCRIPTION_MAX): string {
  if (!text) return "";
  const normalized = String(text)
    .replace(/\s+/g, " ")
    .replace(/^Artikel kurz anhören\s+Die wichtigsten Punkte kurz und verständlich zusammengefasst\.\s*(?:Dein Browser unterstützt das Audio-Element nicht\.\s*)?/i, "")
    .replace(/\s*(?:\[(?:…|\.\.\.)\]|\.\.\.|…)\s*$/, "")
    .trim();
  if (normalized.length <= max && descriptionWidth(normalized) <= META_DESCRIPTION_MAX_WIDTH) return normalized;

  // Längster Anfang, der in Zeichen- und Pixelgrenze passt (Platz für „ …“ eingerechnet).
  let end = Math.min(normalized.length, max);
  while (end > 0 && descriptionWidth(normalized.slice(0, end)) > META_DESCRIPTION_MAX_WIDTH - 12) end--;
  const window = normalized.slice(0, end);

  let sentenceEnd = -1;
  for (const match of window.matchAll(/[.!?](?=\s|$)/g)) sentenceEnd = match.index ?? sentenceEnd;
  if (sentenceEnd + 1 >= MIN_SENTENCE_LENGTH) return window.slice(0, sentenceEnd + 1);

  const cut = window.slice(0, -1);
  const lastSpace = cut.lastIndexOf(" ");
  const words = (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:–—-]+$/, "");
  return `${words} …`;
}
