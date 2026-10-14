export type HeadingAnchor = { id: string; text: string };

const UMLAUTS: Record<string, string> = { ä: "ae", ö: "oe", ü: "ue", ß: "ss" };

function decodeEntities(value: string) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

export function slugifyHeading(text: string) {
  return text
    .toLowerCase()
    .replace(/[äöüß]/g, (char) => UMLAUTS[char])
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64)
    .replace(/-+$/g, "");
}

/** Versieht alle <h2> ohne id mit einer Sprungmarke und liefert die Liste fürs Inhaltsverzeichnis. */
export function withHeadingAnchors(html: string): { html: string; headings: HeadingAnchor[] } {
  const headings: HeadingAnchor[] = [];
  const used = new Set<string>();
  const result = html.replace(/<h2(\s[^>]*)?>([\s\S]*?)<\/h2>/gi, (match, attrs: string | undefined, inner: string) => {
    const text = decodeEntities(inner.replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();
    if (!text) return match;
    const existing = attrs?.match(/\sid=["']([^"']+)["']/i)?.[1];
    let id = existing || slugifyHeading(text) || "abschnitt";
    if (!existing) {
      const base = id;
      for (let n = 2; used.has(id); n += 1) id = `${base}-${n}`;
    }
    used.add(id);
    headings.push({ id, text });
    return existing ? match : `<h2${attrs ?? ""} id="${id}">${inner}</h2>`;
  });
  return { html: result, headings };
}
