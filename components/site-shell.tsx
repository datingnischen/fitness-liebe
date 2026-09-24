"use client";

import { usePathname } from "next/navigation";
import { MarketLink } from "@/components/market-link";
import { platformUrl, registrationUrl, stripMarketPrefix, type MarketCode } from "@/lib/markets";
import { staticAsset } from "@/lib/static-asset";

type NavLink = { label: string; href: string; external?: boolean };
type Props = { market?: MarketCode; hasCityPages?: boolean };

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
const platform = (path: string, label: string): NavLink => ({ label, href: platformUrl(path), external: true });

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
  return /^\/partnersuche\/[a-z0-9-]+\/?$/i.test(stripMarketPrefix(pathname));
}

function registrationHref(pathname: string) {
  return registrationUrl(isCityPage(pathname) ? "location" : "magazin");
}

// Länder ohne Stadtseiten verlinken die Partnersuche nicht.
function navFor(hasCityPages: boolean) {
  return hasCityPages ? headerNav : headerNav.filter((item) => item.href !== "/partnersuche");
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

  return (
    <header className="site-header-shell">
      <div className="site-header-bar compact-header-bar">
        <Brand market={market} />
        <div className="header-actions compact-header-actions" aria-label="Nutzeraktionen">
          <a className="login-link" href={platformUrl("/login/")}>Login</a>
          <a className="header-register header-register-primary" href={register}>Registrieren</a>
          <details className="header-menu">
            <summary aria-label="Menü öffnen">
              <span className="menu-icon" aria-hidden="true"><span /><span /><span /></span>
              <span className="sr-only">Menü</span>
            </summary>
            <div className="header-menu-panel">
              <nav className="main-nav compact-menu-nav" aria-label="Hauptnavigation">
                {navFor(hasCityPages).map((item) => <span key={item.href}>{localLink(market, item.href, item.label)}</span>)}
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
