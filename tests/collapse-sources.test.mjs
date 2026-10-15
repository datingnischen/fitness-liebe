import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import test from "node:test";
import { collapseSourceSections } from "../lib/collapse-sources.ts";

const html = [
  "<h2>Stand, Quellen &amp; Transparenz</h2>",
  "<p>Stand der Informationen: Juni 2026</p>",
  "<h3>Genutzte Quellen</h3>",
  '<ul><li><a href="https://www.dge.de/">dge.de</a></li></ul>',
  "<h2>Kurz zusammengefasst</h2>",
  "<p>Fazit</p>",
].join("\n");

test("Quellenabschnitt wird zugeklappter Block am Ende des Beitrags", () => {
  const out = collapseSourceSections(html);
  assert.match(out, /<details class="magazine-sources">\n<summary>Quellen &amp; Transparenz|<details class="magazine-sources">\n<summary>Quellen & Transparenz/);
  assert.doesNotMatch(out, /<details class="magazine-sources" open/);
  assert.doesNotMatch(out, /<h2>Stand, Quellen/);
  assert.ok(out.indexOf("Kurz zusammengefasst") < out.indexOf("magazine-sources"), "Quellen stehen am Ende");
  assert.match(out, /href="https:\/\/www\.dge\.de\/"/, "Links bleiben erhalten");
  assert.match(out, /Stand der Informationen: Juni 2026/);
  assert.match(out, /<p class="magazine-sources__label">Genutzte Quellen<\/p>/);
});

test("medizinischer Hinweis bleibt sichtbar vor den eingeklappten Quellen", () => {
  const out = collapseSourceSections(
    "<p>Text</p>\n<h2>Stand, Quellen &amp; Transparenz</h2>\n<p>Stand: Juni 2026</p>\n<p>Der Beitrag ersetzt keine medizinische Beratung.</p>\n<h3>Genutzte Quellen</h3>\n<ul><li>who.int</li></ul>",
  );
  const details = out.indexOf("<details");
  const notice = out.indexOf('<p class="magazine-notice">Der Beitrag ersetzt keine medizinische Beratung.</p>');
  assert.ok(notice > -1 && notice < details, "Hinweis steht sichtbar vor dem Block");
  assert.ok(out.indexOf("who.int") > details, "Quellen bleiben eingeklappt");
  assert.ok(out.indexOf("Stand: Juni 2026") > details);
});

test("Ratgeberfragen und Fließtext mit „Quelle“ bleiben unverändert", () => {
  const text = "<h2>Welche Quellen sollte ich vor der Buchung prüfen?</h2><p>a</p><h2>Seniorentreffs, eine Quelle der Inspiration</h2><p>b</p>";
  assert.equal(collapseSourceSections(text), text);
});

test("FAQ-Karte nach den Quellen bleibt außerhalb des Quellenblocks", () => {
  const out = collapseSourceSections('<h2>Quellen</h2><ul><li>x</li></ul><section class="breed-faq-card"><h2>Häufige Fragen</h2></section>');
  assert.ok(out.indexOf("breed-faq-card") < out.indexOf("magazine-sources"));
});

test("alle Magazinbeiträge mit Quellen werden eingeklappt", () => {
  const dir = new URL("../content/magazin/beitraege/", import.meta.url);
  const files = readdirSync(dir).filter((name) => name.endsWith(".md"));
  let withSources = 0;
  for (const name of files) {
    const body = readFileSync(new URL(name, dir), "utf8");
    if (!/<h2>[^<]*Quellen/.test(body)) continue;
    withSources += 1;
    const out = collapseSourceSections(body);
    assert.match(out, /<details class="magazine-sources">/, name);
    assert.doesNotMatch(out, /<h[23]>[^<]*Quellen[^<?]*<\/h[23]>/, name);
  }
  assert.ok(withSources > 20);
});

test("Artikelseite nutzt den Quellenblock", () => {
  const page = readFileSync(new URL("../app/[market]/magazin/[slug]/page.tsx", import.meta.url), "utf8");
  assert.match(page, /collapseSourceSections\(/);
});
