'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { registrationUrl } from '@/lib/markets';

// Schwebt erst nach dem ersten Bildschirm ein und weicht dem Footer, der eine eigene Registrierung hat.
export function StickyCTAButton() {
  const pathname=usePathname()||'/';
  const cityIntent=pathname.includes('/partnersuche');
  const text='Sportliche Singles kennenlernen';
  const href=registrationUrl(cityIntent?'location':'magazin');
  const [scrolled,setScrolled]=useState(false);
  const [footerInView,setFooterInView]=useState(false);

  useEffect(()=>{
    const onScroll=()=>setScrolled(window.scrollY>Math.min(520,window.innerHeight*0.6));
    onScroll();
    window.addEventListener('scroll',onScroll,{passive:true});
    const footer=document.querySelector('.fl-footer');
    const observer=footer?new IntersectionObserver(([entry])=>setFooterInView(entry.isIntersecting)):null;
    if(footer&&observer) observer.observe(footer);
    return ()=>{window.removeEventListener('scroll',onScroll);observer?.disconnect();};
  },[pathname]);

  const visible=scrolled&&!footerInView;
  return (
    <a href={href} className={`sticky-cta${visible?' is-visible':''}`} aria-label={text} aria-hidden={visible?undefined:true} tabIndex={visible?undefined:-1}>
      <span className="sticky-cta-beat" aria-hidden="true">
        <svg viewBox="0 0 48 24" focusable="false"><path d="M0 12h12l4-8 6 16 5-12 3 4h18" /></svg>
      </span>
      <span className="sticky-cta-copy">
        <strong>{text}</strong>
        <small>Kostenlos registrieren</small>
      </span>
      <span className="sticky-cta-arrow" aria-hidden="true">→</span>
    </a>
  );
}
