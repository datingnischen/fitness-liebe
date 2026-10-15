// Quellenabschnitte im Magazin: klein, standardmäßig zugeklappt und als
// eigener Block ans Ende des Beitrags. Inhalte und Links bleiben vollständig.

const SOURCE_HEADING = /<h([23])\b[^>]*>((?:(?!<\/h\1>)[\s\S])*?Quell(?:en|e)\b(?:(?!<\/h\1>)[\s\S])*?)<\/h\1>/gi;
// „Stand, Quellen & Transparenz“, „Genutzte Quellen“, „📚 Quellen“, „Quelle“ …
const SOURCE_TITLE = /^(?:[^\p{L}\p{N}]+)?(?:Stand,\s*)?(?:Genutzte\s+|Verwendete\s+)?Quellen?[^?]*$/iu;

function headingText(inner: string) {
  return inner
    .replace(/<[^>]+>/g, "")
    .replace(/&(amp|#038);/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function sectionEnd(html: string, from: number, level: string) {
  // Ein h2-Abschnitt endet am nächsten h2 bzw. an einer eingebauten Sektion
  // (FAQ-Karte), ein alleinstehender h3-Abschnitt schon am nächsten h2/h3.
  const stop = level === "2" ? /<h2\b|<section\b/gi : /<h[23]\b|<section\b/gi;
  stop.lastIndex = from;
  const match = stop.exec(html);
  return match ? match.index : html.length;
}

export function collapseSourceSections(html: string, summaryLabel = "Quellen & Transparenz") {
  if (!html || html.includes('class="magazine-sources"')) return html;

  const parts: string[] = [];
  let rest = html;
  for (let guard = 0; guard < 10; guard += 1) {
    SOURCE_HEADING.lastIndex = 0;
    let match: RegExpExecArray | null;
    let found: { start: number; end: number; level: string; body: string } | null = null;
    while ((match = SOURCE_HEADING.exec(rest))) {
      const text = headingText(match[2]);
      // Ratgeberfragen wie „Welche Quellen sollte ich prüfen?“ sind Inhalt.
      if (!SOURCE_TITLE.test(text)) continue;
      const bodyStart = match.index + match[0].length;
      const end = sectionEnd(rest, bodyStart, match[1]);
      const body = rest.slice(bodyStart, end).trim();
      // Der h2-Titel selbst entfällt, die Summary ersetzt ihn; Unterüberschriften
      // wie „Genutzte Quellen“ bleiben als Zwischentitel erhalten.
      found = { start: match.index, end, level: match[1], body: match[1] === "2" ? body : `<p class="magazine-sources__label">${match[2].trim()}</p>${body}` };
      break;
    }
    if (!found) break;
    parts.push(found.body);
    rest = `${rest.slice(0, found.start)}${rest.slice(found.end)}`;
  }

  if (!parts.length) return html;

  const body = parts.join("\n").replace(/<h3\b[^>]*>([\s\S]*?)<\/h3>/gi, '<p class="magazine-sources__label">$1</p>');
  return `${rest.trimEnd()}\n<details class="magazine-sources">\n<summary>${summaryLabel}</summary>\n<div class="magazine-sources__body">\n${body}\n</div>\n</details>\n`;
}
