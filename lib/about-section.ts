import { SITE_URL } from "@/lib/wordpress";

export const ABOUT_OVERVIEW_PATH = "/ueber-uns";
// Die Social-Media-Seite liegt live unter /social-media/ – der Pfad bleibt erhalten.
export const ABOUT_SOCIAL_MEDIA_PATH = "/social-media";
export const DATING_TIPS_PATH = "/dating-tipps";

export function canonicalMagazinePagePath(slug: string) {
  return `/magazin/${slug}`;
}

export function aboutOverviewCanonical() {
  return `${SITE_URL}${ABOUT_OVERVIEW_PATH}`;
}

export function aboutSocialMediaCanonical() {
  return `${SITE_URL}${ABOUT_SOCIAL_MEDIA_PATH}`;
}

export function datingTipsCanonical() {
  return `${SITE_URL}${DATING_TIPS_PATH}`;
}
