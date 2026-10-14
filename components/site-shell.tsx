"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { MarketLink } from "@/components/market-link";
import { SiteSearchForm } from "@/components/site-search-form";
import { PLATFORM_PAGES, platformUrl, registrationUrl, stripMarketPrefix, type MarketCode } from "@/lib/markets";
import { SITE_SEARCH_PATH } from "@/lib/site-search";
import { staticAsset } from "@/lib/static-asset";

type NavLink = { label: string; href: string; external?: boolean };
type Props = { market?: MarketCode; hasCityPages?: boolean };

// Vertrauens- und Plattformseiten gehören ICONY: immer absolut auf die Live-Domain.
const platform = (path: string, label: string): NavLink => ({ label, href: platformUrl(path), external: true });

type MenuLink = NavLink & { hint: string };

// Hauptbereiche: auf dem Desktop direkt im Header, im Menü mit kurzer Beschreibung
const headerNav: MenuLink[] = [
  { label: "Partnersuche", href: "/partnersuche", hint: "Sportliche Singles in deiner Stadt" },
  { label: "Magazin", href: "/magazin", hint: "Alle Ratgeber und Artikel" },
  { label: "Fitness-Dating", href: "/magazin/thema/fitness-dating", hint: "Flirten, Dates und Profil-Tipps" },
  { label: "Training", href: "/magazin/thema/training", hint: "Kraft, Ausdauer und Motivation" },
  { label: "Ernährung", href: "/magazin/thema/ernaehrung", hint: "Essen für Leistung und Genuss" },
  { label: "Rezepte", href: "/magazin/thema/rezepte", hint: "Fit kochen – gern auch zu zweit" },
];

const quickNav = ["/partnersuche", "/magazin", "/magazin/thema/training", "/magazin/thema/ernaehrung", "/magazin/thema/rezepte"];

const serviceNav: NavLink[] = [
  { label: "Start", href: "/" },
  platform(PLATFORM_PAGES.datingTips, "Dating-Tipps"),
  { label: "Über uns", href: "/ueber-uns" },
  { label: "Häufige Fragen", href: "/faq" },
  { label: "Suche", href: SITE_SEARCH_PATH },
];


const footerColumns: Array<{ title: string; links: NavLink[] }> = [
  {
    title: "Fitness-Dating",
    links: [
      { label: "Flirten im Fitnessstudio", href: "/magazin/flirten-im-fitnessstudio" },
      { label: "Sportarten fürs erste Date", href: "/magazin/sportarten-fuer-erstes-date" },
      { label: "Fit bleiben als Paar", href: "/magazin/fit-bleiben-als-paar" },
      platform(PLATFORM_PAGES.datingTips, "Dating-Tipps"),
    ],
  },
  {
    title: "Training & Ernährung",
    links: [
      { label: "Krafttraining-Grundlagen", href: "/magazin/krafttraining-grundlagen" },
      { label: "Cardio-Training", href: "/magazin/cardio-training" },
      { label: "Kalorienbedarf berechnen", href: "/magazin/kalorienbedarf-berechnen" },
      { label: "Fitness-Rezepte", href: "/magazin/thema/rezepte" },
    ],
  },
  {
    title: "Über uns & Magazin",
    links: [
      { label: "Über fitness-liebe.de", href: "/ueber-uns" },
      { label: "Christian M. Haas", href: "/magazin/christian" },
      { label: "Social Media", href: "/ueber-uns/social-media" },
      { label: "Häufige Fragen (FAQ)", href: "/faq" },
      { label: "Inhaltsverzeichnis A–Z", href: "/magazin/inhalt" },
      { label: "Suche", href: SITE_SEARCH_PATH },
    ],
  },
  {
    title: "Fakten & Service",
    links: [
      platform("/sicherheit-und-datenschutz.html", "Sicherheit & Datenschutz"),
      platform("/redaktionelle-kontrolle.html", "Redaktionelle Kontrolle"),
      platform("/kostenlose-basis-mitgliedschaft.html", "Basis-Mitgliedschaft"),
      platform("/unsere-erfolgsgeschichten.html", "Erfolgsgeschichten"),
      platform("/hilfe/", "Hilfe & Support"),
    ],
  },
];

function localLink(market: MarketCode, href: string, children: React.ReactNode, className?: string) {
  return (
    <MarketLink className={className} market={market} path={href}>
      {children}
    </MarketLink>
  );
}

function isCityPage(pathname: string) {
  return /^\/partnersuche\/[a-z0-9-]+\/?$/i.test(stripMarketPrefix(pathname));
}

function registrationHref(pathname: string) {
  return registrationUrl(isCityPage(pathname) ? "location" : "magazin");
}

// Länder ohne Stadtseiten verlinken die Partnersuche nicht.
function navFor(hasCityPages: boolean) {
  return hasCityPages ? headerNav : headerNav.filter((item) => item.href !== "/partnersuche");
}

function isActive(pathname: string, href: string) {
  const current = stripMarketPrefix(pathname).replace(/\/+$/, "") || "/";
  const target = href.replace(/\/+$/, "") || "/";
  if (target === "/") return current === "/";
  if (target === "/magazin") return current === "/magazin";
  return current === target || current.startsWith(`${target}/`);
}

function Brand({ market }: { market: MarketCode }) {
  return localLink(
    market,
    "/",
    <img
      className="brand-logo-image"
      src={staticAsset("/brand/fitness-liebe-logo.svg")}
      alt="fitness-liebe.de Logo"
      width="216"
      height="31"
    />,
    "brand-lockup brand-lockup-header",
  );
}

function PulseLine({ className, peakAt = 180 }: { className: string; peakAt?: number }) {
  return (
    <svg className={className} viewBox="0 0 600 80" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path d={`M0 40h${peakAt}l18-26 22 52 20-62 22 70 16-34h${502 - peakAt}`} />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <path d="M5 10.5l3.2 3.2L15 7" />
    </svg>
  );
}

export function SiteHeader({ market = "de", hasCityPages = true }: Props) {
  const pathname = usePathname() || "/";
  const register = registrationHref(pathname);
  const menuRef = useRef<HTMLDetailsElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const nav = navFor(hasCityPages);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // <details> bleibt nach einer Client-Navigation offen: beim Seitenwechsel schließen
  useEffect(() => {
    if (menuRef.current) menuRef.current.open = false;
  }, [pathname]);

  useEffect(() => {
    const close = (event: Event) => {
      const menu = menuRef.current;
      if (!menu?.open) return;
      if (event instanceof KeyboardEvent ? event.key === "Escape" : !menu.contains(event.target as Node)) {
        menu.open = false;
        if (event instanceof KeyboardEvent) menu.querySelector("summary")?.focus();
      }
    };
    document.addEventListener("keydown", close);
    document.addEventListener("pointerdown", close);
    return () => {
      document.removeEventListener("keydown", close);
      document.removeEventListener("pointerdown", close);
    };
  }, []);

  const toggle = () => document.documentElement.classList.toggle("fl-menu-open", Boolean(menuRef.current?.open));

  return (
    <header className={`fl-header${scrolled ? " is-scrolled" : ""}`}>
      <div className="fl-header-bar">
        <Brand market={market} />
        <nav className="fl-header-quick" aria-label="Hauptbereiche">
          {nav
            .filter((item) => quickNav.includes(item.href))
            .map((item) => (
              <span key={item.href} className={isActive(pathname, item.href) ? "is-active" : undefined}>
                {localLink(market, item.href, item.label)}
              </span>
            ))}
        </nav>
        <div className="fl-header-actions">
          <a className="fl-header-login" href={platformUrl("/login/")}>Login</a>
          <a className="fl-header-register" href={register}>
            <span className="fl-header-register-long">Kostenlos</span>Registrieren
          </a>
          <details className="fl-menu" ref={menuRef} onToggle={toggle}>
            <summary aria-label="Menü öffnen oder schließen">
              <span className="fl-burger" aria-hidden="true"><span /><span /><span /></span>
              <span className="fl-menu-label">Menü</span>
            </summary>
            <div className="fl-menu-panel">
              <div className="fl-menu-main">
                <p className="fl-menu-kicker">Entdecken</p>
                <nav className="fl-menu-nav" aria-label="Hauptnavigation">
                  {nav.map((item, index) => (
                    <span key={item.href} className={isActive(pathname, item.href) ? "is-active" : undefined}>
                      {localLink(
                        market,
                        item.href,
                        <>
                          <small aria-hidden="true">{String(index + 1).padStart(2, "0")}</small>
                          <strong>{item.label}</strong>
                          <em>{item.hint}</em>
                        </>,
                      )}
                    </span>
                  ))}
                </nav>
              </div>
              <div className="fl-menu-side">
                <a className="fl-menu-login" href={platformUrl("/login/")}>
                  Schon Mitglied? <strong>Einloggen</strong>
                </a>
                <SiteSearchForm market={market} compact />
                <p className="fl-menu-kicker">Service</p>
                <ul className="fl-menu-service">
                  {serviceNav.map((item) => (
                    <li key={item.href}>{item.external ? <a href={item.href}>{item.label}</a> : localLink(market, item.href, item.label)}</li>
                  ))}
                </ul>
                <a className="fl-menu-cta" href={register}>
                  <PulseLine className="fl-menu-cta-pulse" peakAt={300} />
                  <span>Liebe mit Puls</span>
                  <strong>Sportliche Singles kostenlos kennenlernen</strong>
                  <i aria-hidden="true">→</i>
                </a>
              </div>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter({ market = "de" }: Props) {
  const pathname = usePathname() || "/";
  const register = registrationHref(pathname);

  return (
    <footer className="fl-footer">
      <div className="fl-footer-inner">
        <section className="fl-footer-cta" aria-label="Registrierung">
          <PulseLine className="fl-footer-cta-pulse" peakAt={400} />
          <div className="fl-footer-cta-copy">
            <p className="fl-footer-kicker">Partnervermittlung für Fitness-Fans</p>
            <h2>Triff sportliche Singles, die deine Leidenschaft für Bewegung teilen.</h2>
            <p>Über 750.000 Mitglieder, jedes Profil vom Supportteam geprüft – und der Start ist kostenlos.</p>
          </div>
          <a className="fl-footer-cta-button" href={register}>
            Jetzt kostenlos starten
            <span aria-hidden="true">→</span>
          </a>
        </section>

        <div className="fl-footer-main">
          <div className="fl-footer-brand">
            {localLink(
              market,
              "/",
              <img
                src={staticAsset("/brand/fitness-liebe-logo-light.svg")}
                alt="fitness-liebe.de Logo"
                width="216"
                height="31"
              />,
              "fl-footer-logo",
            )}
            <p className="fl-footer-claim">
              <PulseLine className="fl-footer-claim-pulse" />
              Liebe mit Puls
            </p>
            <p className="fl-footer-intro">
              fitness-liebe.de bringt Menschen zusammen, denen ein aktiver und gesunder Alltag wichtig ist – für eine
              ernsthafte, langfristige Beziehung statt flüchtiger Flirts.
            </p>
            <ul className="fl-footer-trust" aria-label="Vertrauensmerkmale">
              <li><CheckIcon />Über 20 Jahre Erfahrung im Online-Dating</li>
              <li><CheckIcon />Server in Deutschland</li>
              <li><CheckIcon />Keine versteckten Kosten</li>
            </ul>
          </div>
          <nav className="fl-footer-nav" aria-label="Footer Navigation">
            {footerColumns.map((column) => (
              <div className="fl-footer-column" key={column.title}>
                <h2>{column.title}</h2>
                <ul>
                  {column.links.map((link) => (
                    <li key={link.label}>
                      {link.external ? <a href={link.href}>{link.label}</a> : localLink(market, link.href, link.label)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="fl-footer-bottom">
          <span>© {new Date().getFullYear()} fitness-liebe.de · Wir verlieben sportliche Singles</span>
          <div className="fl-footer-legal">
            <a href={register}>Registrieren</a>
            {localLink(market, "/magazin", "Magazin")}
            <a href={platformUrl("/agb.html")}>AGB</a>
            <a href={platformUrl("/datenschutz.html")}>Datenschutz</a>
            <a href={platformUrl("/impressum.html")}>Impressum</a>
            <a href={platformUrl("/barrierefreiheit.html")}>Barrierefreiheit</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
