# Codex-Auftrag: Titelbild Kassel-Stadtseite

Stand: 2026-11-02, angelegt von Claude Code.

## Ziel
Titelbild für die neue eigene Stadtseite https://fitness-liebe.de/partnersuche/kassel/ (Daten: `data/partnersuche-eigene-staedte.json`, Eintrag `kassel`, Feld `imageUrl` ist noch `null`).

## Motiv
- Ein sportliches Paar (fiktive Personen, ca. 30–45 Jahre) läuft bergauf durch den Bergpark Wilhelmshöhe; im Hintergrund das Oktogon mit dem Herkules.
- Natürliches Tageslicht, Laufkleidung, freundliche Stimmung, keine Markenlogos, keine erkennbaren realen Personen.
- Farben passend zum Design „Liebe mit Puls“ (Akzent Gelb/Orange wie im Logo, `pc=FBCA08`).

## Technik
- Datei: `public/partnersuche/kassel.webp` (über den Asset-Host ausliefern wie andere statische Bilder), 1600 × 900, unter 300 KB.
- In `data/partnersuche-eigene-staedte.json` `imageUrl` auf den Pfad setzen; `imageAlt` steht schon: „Läuferpaar im Bergpark Wilhelmshöhe mit Blick zum Herkules in Kassel“.
- KI-Bild sichtbar kennzeichnen (Bildnachweis „KI-generiert, illustrativ“), da kein dokumentarisches Foto.
- Keine Infografik nötig (Stadtseite, kein Magazinartikel).

## Prüfen
`npm test`, Build, danach https://fitness-liebe.vercel.app/partnersuche/kassel/ bei 1440 und 375 px.
