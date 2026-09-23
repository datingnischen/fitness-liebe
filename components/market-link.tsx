import Link from "next/link";
import type { ReactNode } from "react";
import type { MarketCode } from "@/lib/markets";

type Props = { market: MarketCode; path?: string; children: ReactNode; className?: string };

// Nur ein Markt: relative Links funktionieren auf der Live-Domain und auf Vercel-Previews gleichermaßen.
export function MarketLink({ path = "/", children, className }: Props) {
  const normalized = path === "/" ? "/" : `/${path.replace(/^\/+|\/+$/g, "")}`;
  return (
    <Link className={className} href={normalized}>
      {children}
    </Link>
  );
}
