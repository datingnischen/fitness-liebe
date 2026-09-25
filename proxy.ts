import type { NextRequest } from "next/server.js";
import { NextResponse } from "next/server.js";
import { DEFAULT_MARKET, contentMarket, marketFromPathname, marketPath, platformPageUrl, stripMarketPrefix } from "#markets";

// Dateien und Metadaten-Routen ohne Länderpräfix und ohne Schrägstrich (robots.txt, sitemap.xml, icon.png …).
const UNPREFIXED = /^\/(?:_next|app-assets|api|\.well-known)(?:\/|$)|\.[a-z0-9]+$/i;

/**
 * Seitenpfade enden immer auf "/" und liegen unter einem Länderpräfix. Alte URLs ohne Präfix
 * (/, /partnersuche/berlin, /magazin/…) und Pfade ohne Schrägstrich gehen in EINER 308-Umleitung
 * ans Ziel. Das Länderpräfix ist Teil der öffentlichen URL (fitness-liebe.de/at/…), die Umleitung
 * bleibt darum relativ auf demselben Host. Die eingebaute Slash-Umleitung von Next.js ist aus
 * (skipTrailingSlashRedirect), sonst kämen alte URLs erst nach zwei Umleitungen an.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (UNPREFIXED.test(pathname)) return NextResponse.next();

  const market = marketFromPathname(pathname);
  const path = market ? stripMarketPrefix(pathname) : pathname;
  // ICONY-Seiten (z. B. Dating-Tipps) gehören der Plattform, auch wenn sie mit Länderpräfix aufgerufen werden.
  const platformPage = platformPageUrl(path);
  if (platformPage) return NextResponse.redirect(platformPage, 308);
  // Länder ohne eigenes Magazin (AT/CH) leiten ins DE-Magazin um, statt dieselben Artikel doppelt auszuliefern.
  const target = market ? contentMarket(market, path) : DEFAULT_MARKET;
  const targetPath = marketPath(target, path);
  if (targetPath === pathname) return NextResponse.next();

  // Plain URL statt nextUrl.clone(): NextURL normalisiert den Schrägstrich sonst selbst.
  const destination = new URL(request.nextUrl.href);
  destination.pathname = targetPath;
  return NextResponse.redirect(destination, 308);
}

export const config = { matcher: ["/((?!_next/static|_next/image|app-assets/).*)"] };
