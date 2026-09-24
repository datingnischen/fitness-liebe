import { publicUrl, type MarketCode } from "@/lib/markets";

export const ABOUT_OVERVIEW_PATH = "/ueber-uns";
// Die Social-Media-Seite liegt live unter /social-media/ – der Pfad bleibt erhalten.
export const ABOUT_SOCIAL_MEDIA_PATH = "/social-media";

export function canonicalMagazinePagePath(slug: string) {
  return `/magazin/${slug}`;
}

export function aboutOverviewCanonical(market: MarketCode) {
  return publicUrl(market, ABOUT_OVERVIEW_PATH);
}

export function aboutSocialMediaCanonical(market: MarketCode) {
  return publicUrl(market, ABOUT_SOCIAL_MEDIA_PATH);
}
