import type { NextRequest } from "next/server.js";
import { NextResponse } from "next/server.js";
import { isWpRestPath, isWpRestRoot, restRewriteUrl } from "#wp-rest-paths";
import { DEFAULT_MARKET, contentMarket, internalPath, marketFromPathname, marketPath, platformPageUrl, stripMarketPrefix } from "#markets";

// Dateien und Metadaten-Routen ohne Länderpräfix und ohne Schrägstrich (robots.txt, sitemap.xml, icon.png …).
const UNPREFIXED = /^\/(?:_next|app-assets|api|\.well-known)(?:\/|$)|\.[a-z0-9]+$/i;

/**
 * Seitenpfade enden immer auf "/". Deutschland liegt öffentlich ohne Präfix (fitness-liebe.de/magazin/…) und wird
 * intern nach app/[market]/de/… umgeschrieben; AT/CH tragen ihr Präfix in der öffentlichen URL (fitness-liebe.de/at/…).
 * Alte oder abweichende Adressen (/de/magazin/…, Pfade ohne Schrägstrich, /at/magazin/…) gehen in EINER 308-Umleitung
 * ans Ziel, relativ auf demselben Host. Die eingebaute Slash-Umleitung von Next.js ist aus (skipTrailingSlashRedirect),
 * sonst kämen alte URLs erst nach zwei Umleitungen an.
 * Hintergrund: Der nginx vor fitness-liebe.de reicht nur die Seitenrouten ohne Präfix an Vercel weiter (Heiko, 2026-10-14).
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // WordPress-kompatibler REST-Endpunkt des Magazins (lib/wp-rest-compat.ts): antwortet als JSON direkt unter
  // /magazin/wp-json/… und /magazin/index.php?rest_route=… (auch /magazin/?rest_route=…), ohne Umleitung. Die
  // Route liegt unter /[market]/…; Adressen ohne Länderpräfix gehen intern nach /de.
  if (isWpRestRoot(pathname, request.nextUrl.searchParams)) {
    return NextResponse.rewrite(restRewriteUrl(request.nextUrl.href, `/${DEFAULT_MARKET}/magazin/index.php`));
  }
  if (isWpRestPath(pathname)) {
    if (marketFromPathname(pathname)) return NextResponse.next();
    return NextResponse.rewrite(restRewriteUrl(request.nextUrl.href, `/${DEFAULT_MARKET}${pathname}`));
  }
  if (UNPREFIXED.test(pathname)) return NextResponse.next();

  const market = marketFromPathname(pathname);
  const path = market ? stripMarketPrefix(pathname) : pathname;
  // ICONY-Seiten (z. B. Dating-Tipps) gehören der Plattform, auch wenn sie mit Länderpräfix aufgerufen werden.
  const platformPage = platformPageUrl(path);
  if (platformPage) return NextResponse.redirect(platformPage, 308);
  // Länder ohne eigenes Magazin (AT/CH) leiten ins DE-Magazin um, statt dieselben Artikel doppelt auszuliefern.
  const target = market ? contentMarket(market, path) : DEFAULT_MARKET;
  const targetPath = marketPath(target, path);
  // Plain URL statt nextUrl.clone(): NextURL normalisiert den Schrägstrich sonst selbst.
  const destination = new URL(request.nextUrl.href);
  if (targetPath !== pathname) {
    destination.pathname = targetPath;
    return NextResponse.redirect(destination, 308);
  }
  if (target !== DEFAULT_MARKET) return NextResponse.next();
  // Öffentliche DE-Adresse ohne Präfix: intern liegt die Seite unter /de/…
  destination.pathname = internalPath(DEFAULT_MARKET, path);
  return NextResponse.rewrite(destination);
}

export const config = { matcher: ["/((?!_next/static|_next/image|app-assets/).*)"] };
