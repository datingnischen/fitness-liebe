import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";
import { DEFAULT_MARKET, MARKET_CODES } from "./lib/markets";

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
    assetPrefix: isDev || !assetHost ? undefined : `${assetHost}${assetPathPrefix}`,
    async redirects() {
      return [
        // Alte WordPress-Kategorie-URLs, ohne Länderpräfix landen sie in /de (siehe proxy.ts)
        { source: "/magazin/kategorie/allgemein", destination: `/${DEFAULT_MARKET}/magazin`, permanent: true },
        { source: "/magazin/kategorie/:slug", destination: `/${DEFAULT_MARKET}/magazin/thema/:slug`, permanent: true },
        { source: `/:market(${MARKET_CODES.join("|")})/magazin/kategorie/allgemein`, destination: "/:market/magazin", permanent: true },
        { source: `/:market(${MARKET_CODES.join("|")})/magazin/kategorie/:slug`, destination: "/:market/magazin/thema/:slug", permanent: true },
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
