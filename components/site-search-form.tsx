import { localizeHref, type MarketCode } from "@/lib/markets";
import { SITE_SEARCH_PATH } from "@/lib/site-search";
import "./site-search.css";

type Props = { market: MarketCode; defaultValue?: string; autoFocus?: boolean; compact?: boolean };

// GET-Formular auf /<land>/ueber-uns/suche/ – relativ, damit es auf der Live-Domain und auf Vercel funktioniert.
export function SiteSearchForm({ market, defaultValue = "", autoFocus = false, compact = false }: Props) {
  return (
    <form className={compact ? "site-search-form site-search-form-compact" : "site-search-form"} action={localizeHref(market, SITE_SEARCH_PATH)} method="get" role="search">
      <label className="site-search-field">
        <span className="site-search-icon" aria-hidden="true">
          🔍
        </span>
        <span className="sr-only">Suchbegriff</span>
        <input type="search" name="q" defaultValue={defaultValue} autoFocus={autoFocus} placeholder="z. B. Krafttraining, Rezepte, Berlin …" maxLength={100} />
      </label>
      <button className="button button-primary" type="submit">
        Suchen
      </button>
    </form>
  );
}
