"use client";

import { usePathname } from "next/navigation";
import { MarketLink } from "@/components/market-link";
import { publicUrl, type MarketCode } from "@/lib/markets";
import { staticAsset } from "@/lib/static-asset";

type NavLink = { label: string; href: string; external?: boolean };
type Props = { market?: MarketCode };

const headerNav: NavLink[] = [
  { label: "Start", href: "/" },
  { label: "Partnersuche", href: "/partnersuche" },
  { label: "Magazin", href: "/magazin" },
  { label: "Fitness-Dating", href: "/magazin/thema/fitness-dating" },
  { label: "Training", href: "/magazin/thema/training" },
  { label: "Ernährung", href: "/magazin/thema/ernaehrung" },
  { label: "Rezepte", href: "/magazin/thema/rezepte" },
  { label: "Dating-Tipps", href: "/dating-tipps" },
  { label: "Über uns", href: "/ueber-uns" },
];

// Vertrauens- und Plattformseiten gehören ICONY: immer absolut auf die Live-Domain.
const platform = (path: string, label: string): NavLink => ({ label, href: publicUrl("de", path), external: true });

const footerColumns: Array<{ title: string; links: NavLink[] }> = [
  {
    title: "Fitness-Dating",
    links: [
      { label: "Flirten im Fitnessstudio", href: "/magazin/flirten-im-fitnessstudio" },
      { label: "Sportarten fürs erste Date", href: "/magazin/sportarten-fuer-erstes-date" },
      { label: "Fit bleiben als Paar", href: "/magazin/fit-bleiben-als-paar" },
      { label: "Dating-Tipps", href: "/dating-tipps" },
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
      { label: "Gazi Avakhti", href: "/magazin/gazi-avakhti" },
      { label: "Social Media", href: "/social-media" },
      { label: "Inhaltsverzeichnis A–Z", href: "/magazin/inhalt" },
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
  return /^\/partnersuche\/[a-z0-9-]+\/?$/i.test(pathname);
}

function registrationHref(market: MarketCode, pathname: string) {
  return publicUrl(market, isCityPage(pathname) ? "/registration/?AID=location" : "/registration/?AID=magazin");
}

function Brand({ market, footer = false }: { market: MarketCode; footer?: boolean }) {
  const content = footer ? (
    <>
      <span className="brand-lockup-mark">FL</span>
      <span className="brand-lockup-copy">
        <strong>fitness-liebe</strong>
        <small>Wir verlieben sportliche Singles</small>
      </span>
    </>
  ) : (
    <img
      className="brand-logo-image"
      src={staticAsset("/brand/fitness-liebe-logo.svg")}
      alt="fitness-liebe.de Logo"
      width="216"
      height="31"
    />
  );
  return localLink(market, "/", content, footer ? "brand-lockup footer-brand-wordmark fl-brand-lockup" : "brand-lockup brand-lockup-header");
}

export function SiteHeader({ market = "de" }: Props) {
  const pathname = usePathname() || "/";
  const register = registrationHref(market, pathname);

  return (
    <header className="site-header-shell">
      <div className="site-header-bar compact-header-bar">
        <Brand market={market} />
        <div className="header-actions compact-header-actions" aria-label="Nutzeraktionen">
          <a className="login-link" href={publicUrl(market, "/login/")}>Login</a>
          <a className="header-register header-register-primary" href={register}>Registrieren</a>
          <details className="header-menu">
            <summary aria-label="Menü öffnen">
              <span className="menu-icon" aria-hidden="true"><span /><span /><span /></span>
              <span className="sr-only">Menü</span>
            </summary>
            <div className="header-menu-panel">
              <nav className="main-nav compact-menu-nav" aria-label="Hauptnavigation">
                {headerNav.map((item) => <span key={item.href}>{localLink(market, item.href, item.label)}</span>)}
              </nav>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter({ market = "de" }: Props) {
  const pathname = usePathname() || "/";
  const register = registrationHref(market, pathname);

  return (
    <footer className="site-footer-shell">
      <section className="footer-cta footer-cta-soft" aria-label="Registrierung">
        <div className="footer-cta-copy">
          <p className="eyebrow">Partnervermittlung für Fitness-Fans</p>
          <h2>Triff sportliche Singles, die deine Leidenschaft für Bewegung teilen.</h2>
          <p>Über 750.000 Mitglieder, jedes Profil vom Supportteam geprüft – und der Start ist kostenlos.</p>
        </div>
        <a className="footer-cta-button" href={register}>Jetzt kostenlos starten</a>
      </section>
      <div className="footer-main footer-main-showcase">
        <div className="footer-brand-panel footer-brand-panel-rich">
          <div className="footer-brand-topline">
            <Brand market={market} footer />
            <span className="footer-brand-badge">Liebe mit Puls</span>
          </div>
          <p className="footer-brand-intro">
            fitness-liebe.de bringt Menschen zusammen, denen ein aktiver und gesunder Alltag wichtig ist – für eine ernsthafte,
            langfristige Beziehung statt flüchtiger Flirts.
          </p>
          <ul className="footer-trust-list footer-trust-list-rich" aria-label="Vertrauensmerkmale">
            <li>Über 20 Jahre Erfahrung im Online-Dating</li>
            <li>Server in Deutschland</li>
            <li>Keine versteckten Kosten</li>
          </ul>
        </div>
        <nav className="footer-link-grid footer-link-grid-rich" aria-label="Footer Navigation">
          {footerColumns.map((column) => (
            <div className="footer-column" key={column.title}>
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
      <div className="sub-footer sub-footer-rich">
        <span className="sub-footer-copy">© {new Date().getFullYear()} fitness-liebe.de</span>
        <div className="sub-footer-links sub-footer-links-rich">
          <a href={register}>Registrieren</a>
          {localLink(market, "/magazin", "Magazin")}
          <a href={publicUrl(market, "/agb.html")}>AGB</a>
          <a href={publicUrl(market, "/datenschutz.html")}>Datenschutz</a>
          <a href={publicUrl(market, "/impressum.html")}>Impressum</a>
          <a href={publicUrl(market, "/barrierefreiheit.html")}>Barrierefreiheit</a>
        </div>
      </div>
    </footer>
  );
}
