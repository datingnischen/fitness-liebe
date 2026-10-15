import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";
import { readFileSync } from "node:fs";
import { MARKET_CODES } from "./lib/markets";

// Alte WordPress-Slugs (data/magazin-weiterleitungen.json): alt -> aktueller Beitrag
const OLD_MAGAZINE_SLUGS = JSON.parse(readFileSync("./data/magazin-weiterleitungen.json", "utf8")) as Record<string, string>;

const DEFAULT_ASSET_HOST = "https://fitness-liebe.vercel.app";
const DEFAULT_ASSET_PATH_PREFIX = "/app-assets";

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

function normalizeAssetPathPrefix(value: string) {
  const withLeadingSlash = value.startsWith("/") ? value : `/${value}`;
  const trimmed = trimTrailingSlash(withLeadingSlash);
  return trimmed || DEFAULT_ASSET_PATH_PREFIX;
}

export default function nextConfig(phase: string): NextConfig {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;
  const assetHost = trimTrailingSlash(process.env.NEXT_PUBLIC_ASSET_HOST || DEFAULT_ASSET_HOST);
  const assetPathPrefix = normalizeAssetPathPrefix(
    process.env.NEXT_PUBLIC_ASSET_PATH_PREFIX || DEFAULT_ASSET_PATH_PREFIX,
  );

  return {
    turbopack: { root: process.cwd() },
    // Die Seitensuche liest Magazin-Dateien zur Laufzeit (searchParams): Inhalte in das Server-Bundle aufnehmen.
    outputFileTracingIncludes: {
      "/[market]/ueber-uns/suche": ["./content/magazin/**/*", "./data/magazin-*.json"],
      // Der WP-kompatible REST-Endpunkt (lib/wp-rest-compat.ts) liest die Magazin-Dateien ebenfalls zur Laufzeit.
      "/[market]/magazin/wp-json/[[...route]]": ["./content/magazin/**/*", "./data/magazin-*.json"],
      "/[market]/magazin/index.php": ["./content/magazin/**/*", "./data/magazin-*.json"],
    },
    // Seiten-URLs enden auf "/" wie auf der ICONY-Plattform. Die Umleitung übernimmt proxy.ts,
    // damit alte URLs ohne Länderpräfix und ohne Schrägstrich mit einer einzigen 308 ankommen.
    trailingSlash: true,
    skipTrailingSlashRedirect: true,
    assetPrefix: isDev || !assetHost ? undefined : `${assetHost}${assetPathPrefix}`,
    async redirects() {
      return [
        // Alte WordPress-Kategorie-URLs; DE-Ziele ohne /de-Präfix (nginx reicht /de/… nicht an Vercel durch)
        { source: "/magazin/kategorie/allgemein", destination: "/magazin/", permanent: true },
        { source: "/magazin/kategorie/:slug", destination: "/magazin/thema/:slug/", permanent: true },
        { source: `/:market(${MARKET_CODES.join("|")})/magazin/kategorie/allgemein`, destination: "/:market/magazin/", permanent: true },
        { source: `/:market(${MARKET_CODES.join("|")})/magazin/kategorie/:slug`, destination: "/:market/magazin/thema/:slug/", permanent: true },
        // Alte WordPress-Slugs, Schlagwort-Archive (alle leer) und Feeds
        ...Object.entries(OLD_MAGAZINE_SLUGS).flatMap(([oldSlug, slug]) => [
          { source: `/magazin/${oldSlug}`, destination: `/magazin/${slug}/`, permanent: true },
          { source: `/:market(${MARKET_CODES.join("|")})/magazin/${oldSlug}`, destination: `/:market/magazin/${slug}/`, permanent: true },
        ]),
        { source: "/magazin/schlagwort/:slug", destination: "/magazin/", permanent: true },
        { source: `/:market(${MARKET_CODES.join("|")})/magazin/schlagwort/:slug`, destination: "/:market/magazin/", permanent: true },
        { source: "/magazin/feed", destination: "/magazin/", permanent: true },
        { source: `/:market(${MARKET_CODES.join("|")})/magazin/feed`, destination: "/:market/magazin/", permanent: true },
      ];
    },
    async rewrites() {
      return [
        {
          source: `${assetPathPrefix}/:path*`,
          destination: "/:path*",
        },
      ];
    },
  };
}
