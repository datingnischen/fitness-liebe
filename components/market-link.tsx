import Link from "next/link";
import type { ReactNode } from "react";
import { localizeHref, type MarketCode } from "@/lib/markets";

type Props = { market: MarketCode; path?: string; children: ReactNode; className?: string };

// Relative Links mit Länderpräfix funktionieren auf der Live-Domain und auf Vercel-Previews gleichermaßen.
export function MarketLink({ market, path = "/", children, className }: Props) {
  return (
    <Link className={className} href={localizeHref(market, path)}>
      {children}
    </Link>
  );
}
