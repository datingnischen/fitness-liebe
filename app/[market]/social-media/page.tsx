import { permanentRedirect } from "next/navigation";
import { ABOUT_SOCIAL_MEDIA_PATH } from "@/lib/about-section";
import { resolveMarket, type MarketParams } from "@/lib/market-params";
import { marketPath } from "@/lib/markets";

export default async function LegacySocialMediaRedirectPage({ params }: { params: MarketParams }) {
  permanentRedirect(marketPath(await resolveMarket(params), ABOUT_SOCIAL_MEDIA_PATH));
}
