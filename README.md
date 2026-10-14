# fitness-liebe.de – Next.js-Frontend

Headless-Frontend für fitness-liebe.de nach dem Muster der anderen Nischenprojekte (Vorlage: tierisch-verliebt).

## Quellen

- **Magazin:** Dateien im Repo, kein WordPress mehr (Import am 2026-10-02, danach nie wieder ausführen):
  - `content/magazin/beitraege/<slug>.md` (45 Beiträge) und `content/magazin/seiten/<slug>.md` (Autorenprofile, Rechtstexte):
    Frontmatter (`title`, `seoTitle`, `description`, `excerpt`, `published`, `updated`, `category`, `author`, `image`, `imageAlt`)
    plus HTML-Körper (Audio-Zusammenfassung, Rezeptmarker `<!-- rezeptkarte -->` und FAQ-Blöcke hängen daran)
  - `data/magazin-kategorien.json`, `data/magazin-autoren.json`, `data/magazin-weiterleitungen.json` (alte Slugs)
  - Bilder und Audio unter `public/magazin/wp-content/uploads/…` (Pfad wie früher in WordPress, in der App über den Asset-Host)
  - `data/magazin-wp-inventar.json`: Slug-Inventar von WordPress, gegen das `tests/magazine-content.test.mjs` prüft
  - Neuer Beitrag = Datei in `content/magazin/beitraege/` anlegen (Vorlage: ein bestehender Beitrag), committen, pushen;
    `published`/`updated` als ISO-Zeitstempel, `imageAlt` nie leer, Bild nach `public/magazin/wp-content/uploads/<jahr>/<monat>/`
  - `scripts/import_wordpress.py` ist das einmalige Importwerkzeug (liest die öffentliche REST-API, überschreibt Korrekturen)
- **Stadtseiten:** ICONY `/partnersuche/<stadt>/`, importiert nach `data/partnersuche-markets.json`
  (`python scripts/import_partnersuche.py`)
- **Plattformseiten** (Login, Registrierung, Sicherheit, Redaktionelle Kontrolle, Basis-Mitgliedschaft,
  Erfolgsgeschichten, Rechtstexte …) bleiben bei ICONY und werden immer absolut auf `https://fitness-liebe.de` verlinkt.

## Länder

Alle Seiten liegen intern unter einem Länderpräfix (`app/[market]`). Öffentlich ist Deutschland präfixfrei
(`fitness-liebe.de/magazin/…`, `proxy.ts` schreibt intern nach `/de/…` um), Österreich und die Schweiz liegen unter
`/at/…` und `/ch/…`. Grund: Der nginx vor fitness-liebe.de reicht nur die Seitenrouten ohne Präfix an Vercel weiter
(Reverse-Proxy-Livegang Oktober 2026); `/de/…` führte dort ins Leere, `/at/…` und `/ch/…` muss nginx zusätzlich durchreichen.
Die Länderliste steht in `lib/markets.ts` (`MARKET_CODES`, `MARKETS`); ein weiteres Land ist dort ein Eintrag.
Routen, Sitemap, hreflang (`de-DE`, `de-AT`, `de-CH`, `x-default` → DE) und `<html lang>` lesen daraus.

- `/de/…` (alte Adressen, Vercel-Upstream) leitet `proxy.ts` per 308 auf den präfixfreien Pfad um; Pfade ohne
  Schrägstrich bekommen ihn in derselben Umleitung.
- Interne Links schreiben weiter `/magazin/…`; `components/local-link.tsx` bzw. `MarketLink` setzen das Präfix (AT/CH)
  oder lassen es weg (DE).
- Stadtseiten gibt es nur für Länder mit Daten in `data/partnersuche-markets.json` und Hub-Text in
  `lib/market-partnersuche.ts` – derzeit nur DE. Ohne Stadtseiten blenden AT/CH die Partnersuche aus.
- Das Magazin gibt es nur in DE (`MARKETS[…].magazine`): `/at/magazin/…` und `/ch/magazin/…` leiten per 308
  nach `/magazin/…` um, Magazinlinks aus AT/CH zeigen direkt dorthin, hreflang und Sitemap führen
  Magazinseiten nur für DE. Die übrigen Inhaltsseiten sind in allen Ländern gleich und verweisen per hreflang aufeinander.
- ICONY-Plattformseiten bleiben ohne Länderpräfix auf `https://fitness-liebe.de` (`platformUrl`).
  Dazu gehört auch `/dating-tipps/` (`PLATFORM_PAGES`): nie in Next.js rendern, `proxy.ts` leitet `/<land>/dating-tipps` dorthin um.

## Struktur

Alle Pfade relativ zum Land (DE ohne Präfix, `/at`, `/ch`); `/magazin/…` nur in DE.

| Route | Inhalt |
| --- | --- |
| `/` | Startseite (Hero, Fitnesswelten, Städte, Flirt-Features, Magazin, Texte der ICONY-Startseite) |
| `/partnersuche`, `/partnersuche/[stadt]` | 15 Stadtseiten mit ICONY-Profilwidget |
| `/magazin`, `/magazin/[slug]` | Magazin-Übersicht und Artikel (Audio-Zusammenfassung, FAQ, verwandte Artikel) |
| `/magazin/fitnesswelten`, `/magazin/thema/[slug]` | Themenwelten aus `lib/fitnesswelten.ts` |
| `/magazin/inhalt` | Inhaltsverzeichnis A–Z |
| `/magazin/christian`, `/magazin/gazi-avakhti` | Autorenprofile (Seiten in `content/magazin/seiten/`) |
| `/social-media`, `/ueber-uns` | Übernommene ICONY-Inhaltsseiten |
| `/ueber-uns/suche` | Seitensuche (Magazin, Fitnesswelten, Städte), `noindex`, nicht in der Sitemap – `/suche/` gehört ICONY |

Es gibt nur die Kategorien „Allgemein" und „Rezepte" (`data/magazin-kategorien.json`). Die Zuordnung zu Fitnesswelten
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
