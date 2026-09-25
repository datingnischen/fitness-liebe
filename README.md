# fitness-liebe.de – Next.js-Frontend

Headless-Frontend für fitness-liebe.de nach dem Muster der anderen Nischenprojekte (Vorlage: tierisch-verliebt).

## Quellen

- **Magazin:** WordPress unter `https://fitness-liebe.de/magazin/wp-json/wp/v2` (Revalidate 300 s)
- **Stadtseiten:** ICONY `/partnersuche/<stadt>/`, importiert nach `data/partnersuche-markets.json`
  (`python scripts/import_partnersuche.py`)
- **Plattformseiten** (Login, Registrierung, Sicherheit, Redaktionelle Kontrolle, Basis-Mitgliedschaft,
  Erfolgsgeschichten, Rechtstexte …) bleiben bei ICONY und werden immer absolut auf `https://fitness-liebe.de` verlinkt.

## Länder

Alle Seiten liegen unter einem Länderpräfix: `/de/…`, `/at/…`, `/ch/…` (`app/[market]`).
Die Länderliste steht in `lib/markets.ts` (`MARKET_CODES`, `MARKETS`); ein weiteres Land ist dort ein Eintrag.
Routen, Sitemap, hreflang (`de-DE`, `de-AT`, `de-CH`, `x-default` → DE) und `<html lang>` lesen daraus.

- Alte URLs ohne Präfix (`/partnersuche/berlin`, `/magazin/…`, `/`) leitet `proxy.ts` per 308 nach `/de/…` um.
- Interne Links schreiben weiter `/magazin/…`; `components/local-link.tsx` bzw. `MarketLink` setzen das Präfix.
- Stadtseiten gibt es nur für Länder mit Daten in `data/partnersuche-markets.json` und Hub-Text in
  `lib/market-partnersuche.ts` – derzeit nur DE. Ohne Stadtseiten blenden AT/CH die Partnersuche aus.
- Das Magazin gibt es nur in DE (`MARKETS[…].magazine`): `/at/magazin/…` und `/ch/magazin/…` leiten per 308
  nach `/de/magazin/…` um, Magazinlinks aus AT/CH zeigen direkt auf `/de`, hreflang und Sitemap führen
  Magazinseiten nur für DE. Die übrigen Inhaltsseiten sind in allen Ländern gleich und verweisen per hreflang aufeinander.
- ICONY-Plattformseiten bleiben ohne Länderpräfix auf `https://fitness-liebe.de` (`platformUrl`).
  Dazu gehört auch `/dating-tipps/` (`PLATFORM_PAGES`): nie in Next.js rendern, `proxy.ts` leitet `/<land>/dating-tipps` dorthin um.

## Struktur

Alle Pfade relativ zum Länderpräfix (`/de`, `/at`, `/ch`); `/magazin/…` nur unter `/de`.

| Route | Inhalt |
| --- | --- |
| `/` | Startseite (Hero, Fitnesswelten, Städte, Flirt-Features, Magazin, Texte der ICONY-Startseite) |
| `/partnersuche`, `/partnersuche/[stadt]` | 15 Stadtseiten mit ICONY-Profilwidget |
| `/magazin`, `/magazin/[slug]` | Magazin-Übersicht und Artikel (Audio-Zusammenfassung, FAQ, verwandte Artikel) |
| `/magazin/fitnesswelten`, `/magazin/thema/[slug]` | Themenwelten aus `lib/fitnesswelten.ts` |
| `/magazin/inhalt` | Inhaltsverzeichnis A–Z |
| `/magazin/christian`, `/magazin/gazi-avakhti` | Autorenprofile (WP-Seiten) |
| `/social-media`, `/ueber-uns` | Übernommene ICONY-Inhaltsseiten |

WordPress kennt nur die Kategorien „Allgemein" und „Rezepte". Die Zuordnung zu Fitnesswelten
steht in `lib/fitnesswelten.ts`; neue Beiträge landen per Titel-Stichwort automatisch in einer Welt.

## Assets

Assets (`/_next/*`, `/app-assets/*`) kommen in Production von `https://fitness-liebe.vercel.app`
(überschreibbar mit `NEXT_PUBLIC_ASSET_HOST`), damit die Live-Domain nur Seitenrouten weiterreichen muss.

## Befehle

```bash
npm run dev
npm test
npm run build
```
