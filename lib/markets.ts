// Jedes Land hat ein eigenes Pfadpräfix (/de, /at, /ch …). Ein weiteres Land kommt dazu,
// indem es hier in MARKET_CODES und MARKETS eingetragen wird; Routen, Sitemap, hreflang
// und die Weiterleitungen alter URLs lesen alle aus dieser Liste.
export const MARKET_CODES = ["de", "at", "ch"] as const;
export type MarketCode = (typeof MARKET_CODES)[number];

export const DEFAULT_MARKET: MarketCode = "de";

export type MarketConfig = {
  code: MarketCode;
  countryName: string;
  /** hreflang und <html lang> */
  locale: `de-${string}`;
};

const MARKETS: Record<MarketCode, MarketConfig> = {
  de: { code: "de", countryName: "Deutschland", locale: "de-DE" },
  at: { code: "at", countryName: "Österreich", locale: "de-AT" },
  ch: { code: "ch", countryName: "Schweiz", locale: "de-CH" },
};

/** Domain dieser Website; alle Länder liegen als Unterordner darunter. */
export const SITE_ORIGIN = "https://fitness-liebe.de";

/** ICONY-Plattform (Login, Registrierung, Rechtstexte, Vertrauensseiten) – gibt es nur auf der .de-Domain. */
export const PLATFORM_ORIGIN = "https://fitness-liebe.de";
export const PLATFORM_ID = "fitnessliebe";

export function isMarketCode(value: string): value is MarketCode {
  return MARKET_CODES.includes(value as MarketCode);
}

export function getMarket(code: MarketCode): MarketConfig {
  return MARKETS[code];
}

export function getMarkets(): MarketConfig[] {
  return MARKET_CODES.map((code) => MARKETS[code]);
}

function normalizePath(pathname: string) {
  return pathname === "/" || pathname === "" ? "/" : `/${pathname.replace(/^\/+|\/+$/g, "")}`;
}

/** Seitenpfad im Land: marketPath("at", "/magazin") → "/at/magazin". */
export function marketPath(market: MarketCode, pathname = "/"): string {
  const normalized = normalizePath(pathname);
  return normalized === "/" ? `/${market}` : `/${market}${normalized}`;
}

/** Absolute URL einer eigenen Seite, z. B. für canonical, Sitemap und JSON-LD. */
export function publicUrl(market: MarketCode, pathname = "/"): string {
  return `${SITE_ORIGIN}${marketPath(market, pathname)}`;
}

/** Basis-URL eines Landes ohne abschließenden Slash: "https://fitness-liebe.de/at". */
export function marketUrl(market: MarketCode): string {
  return `${SITE_ORIGIN}/${market}`;
}

/** Absolute URL auf der ICONY-Plattform; diese Seiten werden nie auf Vercel gerendert. */
export function platformUrl(pathname: string): string {
  return `${PLATFORM_ORIGIN}/${pathname.replace(/^\/+/, "")}`;
}

/**
 * canonical plus hreflang-Alternativen. `markets` begrenzt die Alternativen auf Länder,
 * in denen die Seite existiert (z. B. Stadtseiten nur in einem Land).
 */
export function marketAlternates(market: MarketCode, pathname = "/", markets: readonly MarketCode[] = MARKET_CODES) {
  const languages: Record<string, string> = {};
  for (const code of markets) languages[getMarket(code).locale] = publicUrl(code, pathname);
  if (markets.includes(DEFAULT_MARKET)) languages["x-default"] = publicUrl(DEFAULT_MARKET, pathname);
  return { canonical: publicUrl(market, pathname), languages };
}

/** Registrierung auf der ICONY-Plattform; AID steuert die Attribution (magazin, location …). */
export function registrationUrl(aid = "magazin") {
  return platformUrl(`/registration/?AID=${aid}`);
}

/** Individuelle ICONY-Suche (Ort, Umkreis, Alter); nur auf der Live-Domain vorhanden. */
export function searchUrl(aid = "location") {
  return platformUrl(`/suche/?AID=${aid}`);
}

export const REGISTRATION_URL = registrationUrl("magazin");
export const LOCATION_REGISTRATION_URL = registrationUrl("location");
export const LOCATION_SEARCH_URL = searchUrl("location");

const MARKET_PREFIX = new RegExp(`^/(?:${MARKET_CODES.join("|")})(?=/|$)`);

/** Setzt vor interne Pfade das Länderpräfix, lässt externe, Anker- und bereits präfixierte Links unverändert. */
export function localizeHref(market: MarketCode, href: string): string {
  if (!href.startsWith("/") || href.startsWith("//") || MARKET_PREFIX.test(href)) return href;
  const [, path = "/", suffix = ""] = href.match(/^([^?#]*)(.*)$/) ?? [];
  return `${marketPath(market, path)}${suffix}`;
}

/** Entfernt das Länderpräfix: "/at/partnersuche/wien" → "/partnersuche/wien". */
export function stripMarketPrefix(pathname: string): string {
  return pathname.replace(MARKET_PREFIX, "") || "/";
}

/** Das Land aus dem ersten Pfadsegment, sonst null. */
export function marketFromPathname(pathname: string): MarketCode | null {
  const segment = pathname.split("/")[1] ?? "";
  return isMarketCode(segment) ? segment : null;
}
