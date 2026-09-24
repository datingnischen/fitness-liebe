'use client';

import { usePathname } from 'next/navigation';
import { registrationUrl } from '@/lib/markets';

export function StickyCTAButton() {
  const pathname=usePathname()||'/';
  const cityIntent=pathname.includes('/partnersuche');
  const text='Sportliche Singles kennenlernen';
  const href=registrationUrl(cityIntent?'location':'magazin');
  return <a href={href} className="sticky-cta-button" aria-label={text}><span className="sticky-cta-text">{text}</span><span className="sticky-cta-icon" aria-hidden="true">→</span></a>;
}
