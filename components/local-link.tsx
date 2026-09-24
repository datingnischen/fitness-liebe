"use client";

import NextLink from "next/link";
import { useParams } from "next/navigation";
import type { ComponentProps } from "react";
import { DEFAULT_MARKET, isMarketCode, localizeHref } from "@/lib/markets";

type Props = Omit<ComponentProps<typeof NextLink>, "href"> & { href: string };

/** next/link mit Länderpräfix: href="/magazin" wird unter /at/… zu "/at/magazin". */
export default function Link({ href, ...props }: Props) {
  const params = useParams<{ market?: string }>();
  const market = params?.market && isMarketCode(params.market) ? params.market : DEFAULT_MARKET;
  return <NextLink href={localizeHref(market, href)} {...props} />;
}
