import { notFound } from "next/navigation";
import { isMarketCode, type MarketCode } from "@/lib/markets";

export type MarketParams = Promise<{ market: string }>;

/** Land aus den Routenparametern; unbekannte Länder sind 404. */
export async function resolveMarket(params: Promise<{ market: string }>): Promise<MarketCode> {
  const { market } = await params;
  if (!isMarketCode(market)) notFound();
  return market;
}
