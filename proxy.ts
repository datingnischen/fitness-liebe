import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { DEFAULT_MARKET, marketFromPathname, marketPath } from "@/lib/markets";

// Dateien und Metadaten-Routen ohne Länderpräfix (robots.txt, sitemap.xml, icon.png …).
const UNPREFIXED = /^\/(?:_next|app-assets|api)(?:\/|$)|\.[a-z0-9]+$/i;

/** Alte URLs ohne Länderpräfix (/, /partnersuche/berlin, /magazin/…) ziehen dauerhaft nach /de/… um. */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (UNPREFIXED.test(pathname) || marketFromPathname(pathname)) return NextResponse.next();

  const destination = request.nextUrl.clone();
  destination.pathname = marketPath(DEFAULT_MARKET, pathname);
  return NextResponse.redirect(destination, 308);
}

export const config = { matcher: ["/((?!_next/static|_next/image|app-assets/).*)"] };
