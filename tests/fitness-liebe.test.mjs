import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";
import {
  FITNESSWELTEN,
  FITNESSWELT_MATCHES,
  classifyFitnesswelt,
  entriesForFitnesswelt,
  findFitnessweltArticle,
} from "../lib/fitnesswelten.ts";
import { buildMagazineIndex } from "../lib/magazine-index.ts";
import { getMarketCityPages, getMarketPartnersucheHub } from "../lib/market-partnersuche.ts";
import {
  enhanceAudioSummary,
  formatUpdatedDate,
  getAudioSummarySource,
  relativizeInternalLinks,
  resolveAioseoMeta,
} from "../lib/wordpress.ts";

const repoRoot = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, repoRoot), "utf8");

const EXPECTED_CITIES = [
  "berlin",
  "muenchen",
  "hamburg",
  "koeln",
  "frankfurt",
  "stuttgart",
  "duesseldorf",
  "dortmund",
  "essen",
  "bremen",
  "mannheim",
  "hannover",
  "nuernberg",
  "leipzig",
  "dresden",
];

test("every curated article belongs to exactly one Fitnesswelt", () => {
  const seen = new Map();
  for (const world of FITNESSWELTEN) {
    for (const slug of world.slugs) {
      assert.ok(!seen.has(slug), `${slug} steht in ${seen.get(slug)} und ${world.id}`);
      seen.set(slug, world.id);
    }
  }
  for (const world of FITNESSWELTEN) {
    for (const highlight of world.highlights) {
      assert.equal(classifyFitnesswelt({ slug: highlight.slug, title: highlight.name }).id, world.id, highlight.slug);
    }
  }
});

test("new posts are classified by WP category first, then by title keywords", () => {
  assert.equal(classifyFitnesswelt({ slug: "neu", title: "Proteinbowl", categories: [{ slug: "rezepte" }] }).id, "rezepte");
  assert.equal(classifyFitnesswelt({ slug: "neu", title: "Flirten beim Spinning" }).id, "fitness-dating");
  assert.equal(classifyFitnesswelt({ slug: "neu", title: "Kniebeugen richtig ausführen: 5 Übungen" }).id, "training");
  assert.equal(classifyFitnesswelt({ slug: "neu", title: "Wie viel Eiweiß beim Essen?" }).id, "ernaehrung");
  assert.equal(classifyFitnesswelt({ slug: "neu", title: "Irgendwas ganz anderes" }).id, "fitness-dating");
});

test("Fitnesswelt filtering and orientation links resolve", () => {
  const posts = [
    { slug: "cardio-training", title: "Cardio" },
    { slug: "fit-bleiben-als-paar", title: "Paar" },
    { slug: "kartoffelsalat-moggstar", title: "Salat" },
  ];
  assert.deepEqual(entriesForFitnesswelt("training", posts).map((post) => post.slug), ["cardio-training"]);
  for (const match of FITNESSWELT_MATCHES) {
    for (const slug of match.slugs) {
      const known = findFitnessweltArticle(slug) || FITNESSWELTEN.some((world) => world.slugs.includes(slug));
      assert.ok(known, `${slug} ist keiner Fitnesswelt zugeordnet`);
    }
  }
});

test("magazine index groups posts by Fitnesswelt and hides legal pages", () => {
  const post = (slug, title) => ({ id: 0, slug, type: "post", title, excerpt: "", content: "", date: "2026-01-02", categories: [] });
  const page = (slug, title) => ({ id: 0, slug, type: "page", title, excerpt: "", content: "", categories: [] });
  const sections = buildMagazineIndex({
    posts: [post("cardio-training", "Cardio"), post("gymder", "Gymder")],
    pages: [page("christian", "Christian M. Haas – Dating-Experte"), page("impressum", "Impressum")],
  });
  assert.deepEqual(
    sections.map((section) => section.id),
    ["thema-fitness-dating", "thema-training", "autoren"],
  );
  assert.deepEqual(sections.at(-1).items.map((item) => item.label), ["Christian M. Haas"]);
});

test("publishes the 15 ICONY city pages with location attribution", () => {
  const pages = getMarketCityPages("de");
  assert.deepEqual(pages.map((page) => page.slug), EXPECTED_CITIES);
  for (const page of pages) {
    assert.equal(page.path, `/partnersuche/${page.slug}`);
    assert.equal(new URL(page.sourceUrl).hostname, "fitness-liebe.de");
    assert.match(page.icony.zip, /^\d{5}$/);
    assert.equal(page.icony.platformId, "fitnessliebe");
    assert.ok(page.registrationUrl.endsWith("/registration/?AID=location"));
    assert.equal(new URL(page.searchUrl).searchParams.get("AID"), "location");
    assert.ok(page.contentHtml.includes("<h2>"), `${page.slug} ohne Inhalt`);
    assert.ok(!/tierisch|tierlieb/i.test(JSON.stringify(page)), `${page.slug} enthält Vorlagen-Reste`);
  }
  const hub = getMarketPartnersucheHub("de");
  assert.equal(hub.cities.length, EXPECTED_CITIES.length);
  assert.ok(hub.editorial.introParagraphs.length >= 2);
});

test("audio summaries become a styled card and never leak into excerpts", () => {
  const html =
    '<p><!-- audio-summary:start --></p>\n<h2>Artikel kurz anhören</h2>\n<p>Die wichtigsten Punkte.</p>\n<p><audio controls preload="none"><source src="https://fitness-liebe.de/magazin/wp-content/uploads/a.mp3" type="audio/mpeg">Dein Browser unterstützt das Audio-Element nicht.</audio><br />\n<!-- audio-summary:end --></p>\n<h2>Kurzantwort</h2><p>Text</p>';
  assert.equal(getAudioSummarySource(html), "https://fitness-liebe.de/magazin/wp-content/uploads/a.mp3");
  const enhanced = enhanceAudioSummary(html);
  assert.match(enhanced, /class="audio-summary"/);
  assert.doesNotMatch(enhanced, /<h2>Artikel kurz anhören<\/h2>/);
  assert.match(enhanced, /<h2>Kurzantwort<\/h2>/);
});

test("internal WordPress links become relative with country prefix, uploads stay absolute", () => {
  const html =
    '<a href="https://fitness-liebe.de/magazin/fitnessroutinen/">Routine</a> <a href="https://fitness-liebe.de/magazin/wp-content/uploads/x.jpg">Bild</a>';
  assert.equal(
    relativizeInternalLinks(html),
    '<a href="/de/magazin/fitnessroutinen/">Routine</a> <a href="https://fitness-liebe.de/magazin/wp-content/uploads/x.jpg">Bild</a>',
  );
  // CH hat kein eigenes Magazin: der Link führt direkt ins DE-Magazin statt über eine Umleitung.
  assert.match(relativizeInternalLinks(html, "ch"), /href="\/de\/magazin\/fitnessroutinen\/"/);
  assert.match(
    relativizeInternalLinks('<a href="https://fitness-liebe.de/partnersuche/berlin?x=1#top">B</a>', "at"),
    /href="\/at\/partnersuche\/berlin\/\?x=1#top"/,
  );
});

test("ICONY trust and legal pages link absolutely to the live domain", async () => {
  const sources = [await read("components/site-shell.tsx"), await read("lib/home-content.ts")].join("\n");
  for (const path of [
    "/sicherheit-und-datenschutz.html",
    "/redaktionelle-kontrolle.html",
    "/kostenlose-basis-mitgliedschaft.html",
    "/unsere-erfolgsgeschichten.html",
    "/datenschutz.html",
    "/impressum.html",
  ]) {
    assert.ok(sources.includes(path), `${path} fehlt`);
  }
  const shell = await read("components/site-shell.tsx");
  assert.match(shell, /platform\("\/redaktionelle-kontrolle\.html"/);
  assert.doesNotMatch(shell, /href: "\/(?:sicherheit-und-datenschutz|redaktionelle-kontrolle|kostenlose-basis-mitgliedschaft)/);
});

test("no template leftovers from tierisch-verliebt in app code", async () => {
  const roots = ["app", "components", "lib"];
  const offenders = [];
  async function walk(dir) {
    for (const entry of await readdir(new URL(`${dir}/`, repoRoot), { withFileTypes: true })) {
      const path = `${dir}/${entry.name}`;
      if (entry.isDirectory()) await walk(path);
      else if (/\.(tsx?|css)$/.test(entry.name) && /tierisch|tierlieb|Tierwelt|Hunderass|Katzenrass/i.test(await read(path))) {
        offenders.push(path);
      }
    }
  }
  for (const root of roots) await walk(root);
  assert.deepEqual(offenders, []);
});

test("AIOSEO titles and descriptions resolve smart tags and drop the site name", () => {
  const item = (title, meta) => ({ title: { rendered: "Cardio Training &#8211; Alles" }, aioseo_meta_data: { title, description: meta } });
  const description = "Was ist Cardio-Training? Welchen Nutzen bringt es?&nbsp;Wie lange und wie oft solltest du trainieren?";
  assert.deepEqual(resolveAioseoMeta(item("Cardio Training | #site_title&nbsp;", description)), {
    seoTitle: "Cardio Training",
    seoDescription: "Was ist Cardio-Training? Welchen Nutzen bringt es? Wie lange und wie oft solltest du trainieren?",
  });
  assert.equal(resolveAioseoMeta(item("Die beste Zeit zum Trainieren#separator_sa #site_title", null)).seoTitle, "Die beste Zeit zum Trainieren");
  assert.equal(resolveAioseoMeta(item("Fitness-Dating #separator_sa #site_title", null)).seoTitle, "Fitness-Dating");
  assert.equal(resolveAioseoMeta(item("#post_title", null)).seoTitle, "Cardio Training – Alles");
  assert.deepEqual(resolveAioseoMeta(item(null, "Impressum")), { seoTitle: undefined, seoDescription: undefined });
  assert.deepEqual(resolveAioseoMeta({ title: { rendered: "X" }, aioseo_meta_data: null }), { seoTitle: undefined, seoDescription: undefined });
});

test("Städteübersicht verweist auf die individuelle Suche der Live-Domain", async () => {
  const { LOCATION_SEARCH_URL } = await import("../lib/markets.ts");
  assert.equal(LOCATION_SEARCH_URL, "https://fitness-liebe.de/suche/?AID=location");
  const component = await read("components/city-search-fallback.tsx");
  assert.match(component, /href=\{LOCATION_SEARCH_URL\}/);
  assert.match(component, /Deine Stadt fehlt\?/);
  const hub = await read("app/[market]/partnersuche/page.tsx");
  assert.match(hub, /<CitySearchFallback \/>/);
});

test("articles show the modified date as 'Aktualisiert am', falling back to date", () => {
  assert.equal(formatUpdatedDate({ date: "2025-11-12T10:00:00", modified: "2026-03-05T10:00:00" }), "Aktualisiert am 05. März 2026");
  assert.equal(formatUpdatedDate({ date: "2025-11-12T10:00:00" }), "Aktualisiert am 12. November 2025");
  assert.equal(formatUpdatedDate({}), "");
});

test("fixed pages show no visible date, articles use the update date", async () => {
  const read = (path) => readFile(new URL(path, repoRoot), "utf8");
  const author = await read("app/[market]/magazin/author/[slug]/page.tsx");
  assert.ok(!author.includes("formatGermanDate"), "Autorenseite zeigt Veröffentlichungsdatum");
  const detail = await read("app/[market]/magazin/[slug]/page.tsx");
  assert.match(detail, /entry\.type === "post" \? <span>\{formatUpdatedDate\(entry\)\}/);
  assert.match(detail, /datePublished: entry\.date/);
  const thema = await read("app/[market]/magazin/thema/[slug]/page.tsx");
  assert.ok(!thema.includes("<span>Neuester Artikel</span>") && !thema.includes("Intl.DateTimeFormat"), "Hub zeigt Datum des neuesten Artikels");
});
