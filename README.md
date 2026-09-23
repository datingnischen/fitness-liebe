# fitness-liebe.de – Next.js-Frontend

Headless-Frontend für fitness-liebe.de nach dem Muster der anderen Nischenprojekte (Vorlage: tierisch-verliebt).

## Quellen

- **Magazin:** WordPress unter `https://fitness-liebe.de/magazin/wp-json/wp/v2` (Revalidate 300 s)
- **Stadtseiten:** ICONY `/partnersuche/<stadt>/`, importiert nach `data/partnersuche-markets.json`
  (`python scripts/import_partnersuche.py`)
- **Plattformseiten** (Login, Registrierung, Sicherheit, Redaktionelle Kontrolle, Basis-Mitgliedschaft,
  Erfolgsgeschichten, Rechtstexte …) bleiben bei ICONY und werden immer absolut auf `https://fitness-liebe.de` verlinkt.

## Struktur

| Route | Inhalt |
| --- | --- |
| `/` | Startseite (Hero, Fitnesswelten, Städte, Flirt-Features, Magazin, Texte der ICONY-Startseite) |
| `/partnersuche`, `/partnersuche/[stadt]` | 15 Stadtseiten mit ICONY-Profilwidget |
| `/magazin`, `/magazin/[slug]` | Magazin-Übersicht und Artikel (Audio-Zusammenfassung, FAQ, verwandte Artikel) |
| `/magazin/fitnesswelten`, `/magazin/thema/[slug]` | Themenwelten aus `lib/fitnesswelten.ts` |
| `/magazin/inhalt` | Inhaltsverzeichnis A–Z |
| `/magazin/christian`, `/magazin/gazi-avakhti` | Autorenprofile (WP-Seiten) |
| `/dating-tipps`, `/social-media`, `/ueber-uns` | Übernommene ICONY-Inhaltsseiten |

WordPress kennt nur die Kategorien „Allgemein" und „Rezepte". Die Zuordnung zu Fitnesswelten
steht in `lib/fitnesswelten.ts`; neue Beiträge landen per Titel-Stichwort automatisch in einer Welt.

## Assets

`NEXT_PUBLIC_ASSET_HOST` bleibt leer, solange die Seite komplett über Vercel läuft. Leitet der
nginx der Live-Domain später nur Seitenrouten weiter, dort den Vercel-Host eintragen.

## Befehle

```bash
npm run dev
npm test
npm run build
```
