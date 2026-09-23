import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

// Leer = Assets relativ vom selben Host. Sobald die Live-Domain nur Seitenrouten
// an Vercel weiterreicht, NEXT_PUBLIC_ASSET_HOST auf den Vercel-Host setzen.
const DEFAULT_ASSET_HOST = "";
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
    assetPrefix: isDev || !assetHost ? undefined : `${assetHost}${assetPathPrefix}`,
    async redirects() {
      return [
        // Alte WordPress-Kategorie-URLs
        { source: "/magazin/kategorie/allgemein", destination: "/magazin", permanent: true },
        { source: "/magazin/kategorie/:slug", destination: "/magazin/thema/:slug", permanent: true },
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
