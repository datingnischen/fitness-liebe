import { notFound } from "next/navigation";
import { resolveMarket, type MarketParams } from "@/lib/market-params";
import { hasMagazine } from "@/lib/markets";

// Länder ohne eigenes Magazin leitet proxy.ts ins DE-Magazin um; direkt erreicht sind sie 404.
export default async function MagazineLayout({ children, params }: { children: React.ReactNode; params: MarketParams }) {
  if (!hasMagazine(await resolveMarket(params))) notFound();
  return children;
}
