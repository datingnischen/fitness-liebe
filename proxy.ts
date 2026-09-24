import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { DEFAULT_MARKET, contentMarket, marketFromPathname, marketPath, platformPageUrl, stripMarketPrefix } from "@/lib/markets";

// Dateien und Metadaten-Routen ohne Länderpräfix (robots.txt, sitemap.xml, icon.png …).
const UNPREFIXED = /^\/(?:_next|app-assets|api)(?:\/|$)|\.[a-z0-9]+$/i;

/** Alte URLs ohne Länderpräfix (/, /partnersuche/berlin, /magazin/…) ziehen dauerhaft nach /de/… um. */
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
  if (target === market) return NextResponse.next();

  const destination = request.nextUrl.clone();
  destination.pathname = marketPath(target, path);
  return NextResponse.redirect(destination, 308);
}

export const config = { matcher: ["/((?!_next/static|_next/image|app-assets/).*)"] };
