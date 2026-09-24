// fitness-liebe gibt es nur in Deutschland; die Market-Struktur bleibt, damit
// Komponenten und Links dieselbe Form haben wie in den anderen Nischenprojekten.
export const MARKET_CODES = ["de"] as const;
export type MarketCode = (typeof MARKET_CODES)[number];

export type MarketConfig = {
  code: MarketCode;
  countryName: string;
  domain: string;
  locale: "de-DE";
  platformId: string;
};

const MARKETS: Record<MarketCode, MarketConfig> = {
  de: { code: "de", countryName: "Deutschland", domain: "fitness-liebe.de", locale: "de-DE", platformId: "fitnessliebe" },
};

export function isMarketCode(value: string): value is MarketCode {
  return MARKET_CODES.includes(value as MarketCode);
}

export function getMarket(code: MarketCode): MarketConfig {
  return MARKETS[code];
}

export function publicUrl(market: MarketCode, pathname = "/"): string {
  const normalized = pathname === "/" ? "/" : `/${pathname.replace(/^\/+/, "")}`;
  return `https://${getMarket(market).domain}${normalized}`;
}

/** Registrierung auf der ICONY-Plattform; AID steuert die Attribution (magazin, location …). */
export function registrationUrl(aid = "magazin") {
  return publicUrl("de", `/registration/?AID=${aid}`);
}

/** Individuelle ICONY-Suche (Ort, Umkreis, Alter); nur auf der Live-Domain vorhanden. */
export function searchUrl(aid = "location") {
  return publicUrl("de", `/suche/?AID=${aid}`);
}

export const REGISTRATION_URL = registrationUrl("magazin");
export const LOCATION_REGISTRATION_URL = registrationUrl("location");
export const LOCATION_SEARCH_URL = searchUrl("location");
