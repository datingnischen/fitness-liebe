import { publicUrl, type MarketCode } from "@/lib/markets";

export const ABOUT_OVERVIEW_PATH = "/ueber-uns";
// Social Media liegt im Über-uns-Bereich; /social-media/ bleibt als Weiterleitung erhalten.
export const ABOUT_SOCIAL_MEDIA_PATH = "/ueber-uns/social-media";

export function canonicalMagazinePagePath(slug: string) {
  return `/magazin/${slug}`;
}

export function aboutOverviewCanonical(market: MarketCode) {
  return publicUrl(market, ABOUT_OVERVIEW_PATH);
}

export function aboutSocialMediaCanonical(market: MarketCode) {
  return publicUrl(market, ABOUT_SOCIAL_MEDIA_PATH);
}
