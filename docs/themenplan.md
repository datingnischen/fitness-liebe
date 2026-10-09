# fitness-liebe.de – Themenplan Magazin

Trello: „Mit Fitness Singles mehr Themen abbilden“ (Karte 1079). Inspiration: Seiten wie fitness-singles.com zeigen Paare beim gemeinsamen Wandern, Klettern, Skifahren. Unser Magazin deckt bisher vor allem Gym, Training und Ernährung ab (45 Beiträge, 5 Fitnesswelten). Es fehlen die **Sportarten und Erlebnisse draußen und zu zweit**.

Die Trello-Checkliste an der Karte ist die lebendige Fassung; dieses Dokument hält den Stand vom 2026-10-09 fest.

## Abgleich mit dem Bestand (Stand 2026-10-09)

Die bestehenden Beiträge `fitness-dating-ideen` (15 Dates), `sportarten-fuer-erstes-date`, `outdoor-sportarten`, `fitness-events`, `fitnessroutinen`, `laufpartner-oder-lebenspartner` und `sportliches-date-outfits` behandeln viele Sportarten bereits in je einem Abschnitt. Neue Beiträge zur selben Sportart konkurrieren sonst um dieselben Suchanfragen.

Kennzeichnung:

- 🟢 **Lücke**: Thema fehlt im Bestand, frei zu schreiben, wird zuerst umgesetzt.
- 🔵 **Vertiefung**: Sportart ist im Bestand als Abschnitt vorhanden. Der neue Beitrag braucht einen eigenen, tieferen Winkel (siehe Liste), verlinkt auf den Überblicksbeitrag und wird von dort zurückverlinkt. Kein zweiter „Sportart als Date“-Beitrag mit gleichem Titel.
- ⛔ **Entfällt als eigener Beitrag**: bestehenden Beitrag ergänzen statt neu schreiben.

## Leitlinien

- Tempo: 3–4 Beiträge pro Monat, jeder einzeln recherchiert, mit Quellen und eigener Bildsprache (Paare in Bewegung, keine Stock-Klischees).
- Jeder Beitrag verbindet **Sportart + Kennenlernen/Beziehung** (Dating-Winkel), sonst ist er Fitness-Allerweltswissen.
- Vor jedem Beitrag: Bestand nach dem Thema durchsuchen (`content/magazin/beitraege`), Winkel festlegen, Titel-Keyword gegen vorhandene Titel prüfen.
- Sachlich, keine Heilsversprechen, bei Gesundheit und Risikosport Hinweis auf Einsteigerkurse, Sicherheit und Arzt.
- Sicherheit für Dates: erste Treffen mit Fremden nur in Gruppen oder an öffentlichen, gut erreichbaren Orten (Klettern in der Halle statt allein am Fels).
- Pro Beitrag: Title max. 60, Description 110–155 Zeichen, FAQ-Block, interne Links in die Welt, Link zur Partnersuche (AID wie bei den bestehenden Beiträgen).
- Keine Links auf alte Domains, ICONY-Seiten absolut auf Live-Domain.

## Vorgeschlagene neue Fitnesswelten

| Welt | Kern | Neu/vorhanden |
|---|---|---|
| Outdoor & Abenteuer zu zweit | Wandern, Klettern, Radfahren, Wassersport | **neu** |
| Wintersport & Berge | Ski, Snowboard, Langlauf, Schneeschuh | **neu** (oder Teil von Outdoor) |
| Yoga, Tanz & Achtsamkeit | Yoga, Paartanz, Pilates, Entspannung | **neu** |
| Fitness-Dating & Flirten | wie bisher, erweitert um Events/Reisen | vorhanden |
| Fit als Paar | wie bisher | vorhanden |
| Training / Ernährung / Rezepte | wie bisher | vorhanden |

Umsetzung: `lib/fitnesswelten.ts` um die Welten erweitern (Slugs, Stichwort-Regex, Highlights), Hub-Texte und Bilder pro Welt.

## Themenliste

### A – Outdoor & Abenteuer zu zweit

1. 🟢 Mehrtageswanderung und Hüttentouren: wann ist man bereit für gemeinsames Übernachten?
2. 🟢 Schwimmen und Open-Water: Badesee, Sicherheit, Kälte
3. 🟢 (teilweise) Ski und Snowboard: Skikurse, Hüttenabende, Skireisen für Singles (bisher nur Kurzabschnitt in `sportarten-fuer-erstes-date`)
4. 🔵 Wandern: Gesprächsthemen, Tempo, Etikette unterwegs (vorhanden: `fitness-dating-ideen` Nr. 2, `outdoor-sportarten`)
5. 🔵 Bouldern für Einsteiger: Ablauf, Etikette, Sicherheit in der Halle (vorhanden: `fitness-dating-ideen` Nr. 6)
6. 🔵 Radtour zu zweit: Tagestour planen, Tempoabstimmung, E-Bike ja/nein (vorhanden: `fitness-dating-ideen` Nr. 3)
7. 🔵 Kanu und Kajak: Tour planen, Sicherheit, Kentern (SUP steht schon in `fitness-dating-ideen` Nr. 4)
8. 🔵 Outdoor-Training in Gruppen (Yoga im Park, Parkgruppen): so findest du sie (vorhanden: `fitnessroutinen`, `fitness-events`)
9. 🔵 Zuletzt prüfen: Trailrunning, nur mit eigenem Winkel (Gelände, Gruppenläufe), sonst entfällt (vorhanden: `laufpartner-oder-lebenspartner`, `mit-dem-joggen-anfangen`)

### B – Reisen & Erlebnisse

10. 🟢 Aktivurlaub für Singles (Wander-, Rad-, Segelreisen)
11. 🟢 Fitness-Retreats: Leistungen, Kosten, für wen sinnvoll
12. 🟢 Wochenende in den Bergen zu zweit
13. 🟢 Camping und Zelten als Paar

### C – Yoga, Tanz, Achtsamkeit

14. 🟢 Pilates und Rücken: Alltagsfitness für Büro-Singles
15. 🟢 Schlaf, Erholung, Regeneration
16. 🟢 Meditation und Atmung: Stressabbau vor dem Date
17. 🔵 Partner-Yoga: Übungen, Studio-Etikette, Einstieg für Singles (vorhanden: `sportarten-fuer-erstes-date`, `fitness-dating-ideen` Nr. 7)
18. 🔵 Tanzkurs für Singles: Kurswahl, Partnerwechsel, Etikette (vorhanden: `sportarten-fuer-erstes-date`, `fitness-dating-ideen` Nr. 8)

### D – Teamsport & Gruppen

19. 🟢 Teamsport für Singles (Volleyball, Fußball, Handball, Basketball)
20. 🟢 Sportvereine und Lauftreffs finden
21. 🟢 Tennis, Padel, Badminton als Date
22. 🟢 CrossFit, HIIT und Gruppenkurse: Community im Studio
23. 🟢 Kampfsport und Selbstverteidigung: Selbstbewusstsein und Sicherheit

### E – Dating-Winkel (Beziehung & Psychologie)

24. 🟢 Eifersucht und Trainingspartner:innen: Grenzen im Gym
25. 🟢 Wenn Sport zur Obsession wird: Warnzeichen, ehrlich eingeordnet
26. 🟢 Body Positivity im Fitnessstudio
27. 🟢 Fitness-Tracker und Apps beim Kennenlernen (Strava, Komoot)
28. 🟢 (teilweise) Sport-Hobby vs. Partnerschaft: Zeit teilen (streift `beziehungsboost`)
29. 🔵 Dating-Profil für Sportliche: Fotos und Texte (vorhanden: `sportlicher-single`)
30. 🔵 Gesprächsstarter aus der Sportwelt für Chat und Date (vorhanden: `sportlicher-single`, `flirten-im-fitnessstudio`)
31. 🔵 Unterschiedliche Fitnesslevel: Konflikte und Kompromisse im Alltag (vorhanden: `fit-bleiben-als-paar`, `fitness-dating`)

### F – Ausrüstung & Praxis

32. 🟢 Erste Hilfe und Sicherheit draußen
33. 🟢 Date-Picknick und Proviant für Touren (Verknüpfung zu den Rezepten)

### G – Saisonale Beiträge (Termin fest einplanen)

34. Neujahrsvorsätze und gemeinsame Ziele (Dezember/Januar)
35. Frühlingsstart: Outdoor-Saison eröffnen (März)
36. Sommer: Wasser, Hitze, Training bei 30 Grad (Juni)
37. Herbstwandern und Pilzwanderung (September)
38. Wintersport-Saisonstart (November)

Vor dem Schreiben prüfen, ob der Winkel sich mit den Beiträgen aus Block A überschneidet (z. B. Herbstwandern gegen Wandern).

### ⛔ Entfällt als eigener Beitrag

- Sportevents zum Kennenlernen: steckt in `fitness-events` (Fun Runs, Mud Runs, Bootcamps, Dance-Events); bei Bedarf dort um Spartan Race und Firmenlauf ergänzen.
- Outfit und Ausrüstung für Outdoor-Dates: steckt in `sportliches-date-outfits` (Schichtprinzip, Klettern); dort um Wandern und Winter ergänzen.

## Reihenfolge der ersten drei Monate

Zuerst die 🟢 Lücken, die zur Jahreszeit passen, dazwischen einzelne 🔵 Vertiefungen.

| Monat | Beiträge |
|---|---|
| Okt/Nov 2026 | Ski und Snowboard (3), Pilates und Rücken (14), Meditation und Atmung (16), Schlaf und Regeneration (15) |
| Dez 2026 | Neujahrsvorsätze zu zweit (34), Teamsport für Singles (19), Sportvereine und Lauftreffs (20), Aktivurlaub für Singles (10) |
| Jan 2027 | Fitness-Retreats (11), Tennis/Padel/Badminton (21), Body Positivity (26), Bouldern für Einsteiger (5) |

Danach nach Saison und Nachfrage (Search Console und Controlling auswerten, welche Welt Klicks bringt).

## Pro Beitrag zu klären

- Titel-Keyword und Suchintention (Recherche vorher), Abgleich mit vorhandenen Titeln
- Bei 🔵: Winkel festlegen, Überblicksbeitrag um Link auf den neuen Beitrag ergänzen
- Bildidee: Paar-Szene, Quelle und Lizenz in `docs/bildquellen` eintragen
- Welt-Zuordnung (`slugs` in `lib/fitnesswelten.ts`) und 2–3 interne Links
- Faktenprüfung bei Gesundheit/Risikosport (Quellen nennen)
- Audio-Zusammenfassung (ElevenLabs, nach Freigabe des Textes)
