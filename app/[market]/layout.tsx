import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { SiteFooter, SiteHeader } from "@/components/site-shell";
import { StickyCTAButton } from "@/components/sticky-cta-button";
import { hasCityPages } from "@/lib/market-partnersuche";
import { MARKET_CODES, SITE_ORIGIN, getMarket, isMarketCode } from "@/lib/markets";

type Props = Readonly<{ children: React.ReactNode; params: Promise<{ market: string }> }>;

// Nur die eingetragenen Länder werden gebaut; alles andere unter /xy/… ist 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return MARKET_CODES.map((market) => ({ market }));
}

export const metadata: Metadata = {
  title: { default: "fitness-liebe.de – Sportliche Singles, Fitness-Dating & Magazin", template: "%s | fitness-liebe.de" },
  description:
    "Die Singlebörse für sportliche Menschen: Finde Singles, die Fitness, Bewegung und einen gesunden Lifestyle teilen – mit Magazin zu Training, Ernährung und Fitness-Dating.",
  metadataBase: new URL(SITE_ORIGIN),
};

export default async function MarketLayout({ children, params }: Props) {
  const { market } = await params;
  if (!isMarketCode(market)) notFound();

  return (
    <html lang={getMarket(market).locale}>
      <body>
        <SiteHeader market={market} hasCityPages={hasCityPages(market)} />
        {children}
        <SiteFooter market={market} />
        <StickyCTAButton />
      </body>
    </html>
  );
}
