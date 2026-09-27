import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";
import { NextRequest } from "next/server.js";
import { SITE_SEARCH_MAX_RESULTS, SITE_SEARCH_PATH, normalizeSearchText, searchDocuments } from "../lib/site-search.ts";
import { platformPageUrl } from "../lib/markets.ts";
import { proxy } from "../proxy.ts";

const repoRoot = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, repoRoot), "utf8");
const SEARCH_PAGE = "app/[market]/ueber-uns/suche/page.tsx";

test("site search lives under Über uns per market, never at /suche", async () => {
  assert.equal(SITE_SEARCH_PATH, "/ueber-uns/suche");
  await access(new URL(SEARCH_PAGE, repoRoot));
  const rootRoutes = await readdir(new URL("app/", repoRoot));
  const marketRoutes = await readdir(new URL("app/[market]/", repoRoot));
  assert.ok(!rootRoutes.includes("suche"), "app/suche darf es nicht geben");
  assert.ok(!marketRoutes.includes("suche"), "app/[market]/suche darf es nicht geben");
  // /suche/ gehört ICONY – auch mit Länderpräfix leitet proxy.ts dorthin um.
  assert.equal(platformPageUrl("/suche"), "https://fitness-liebe.de/suche/");
  assert.equal(platformPageUrl(SITE_SEARCH_PATH), null);
  const response = proxy(new NextRequest("https://fitness-liebe.vercel.app/de/suche/"));
  assert.equal(response.headers.get("location"), "https://fitness-liebe.de/suche/");
  const own = proxy(new NextRequest("https://fitness-liebe.vercel.app/at/ueber-uns/suche/?q=wien"));
  assert.equal(own.headers.get("location"), null);
});

test("site search is noindex, canonical without query and not in the sitemap", async () => {
  const page = await read(SEARCH_PAGE);
  assert.match(page, /robots:\s*\{\s*index:\s*false,\s*follow:\s*true\s*\}/);
  assert.match(page, /canonical:\s*publicUrl\(market, SITE_SEARCH_PATH\)/);
  const sitemap = await read("app/sitemap.ts");
  assert.doesNotMatch(sitemap, /SITE_SEARCH_PATH|site-search|["/]suche\b/);
});

test("search form is linked in the header menu and on the Über-uns hub", async () => {
  assert.match(await read("components/site-shell.tsx"), /SiteSearchForm/);
  assert.match(await read("app/[market]/ueber-uns/page.tsx"), /SiteSearchForm/);
  assert.match(await read("components/site-search-form.tsx"), /localizeHref\(market, SITE_SEARCH_PATH\)/);
});

test("normalization folds umlauts and diacritics", () => {
  assert.equal(normalizeSearchText("Ernährung & Müsli"), "ernaehrung muesli");
  assert.equal(normalizeSearchText("Fußball Café"), "fussball cafe");
  assert.equal(normalizeSearchText("München"), normalizeSearchText("muenchen"));
});

test("title hits rank before excerpt and text hits, results are capped", () => {
  const docs = [
    { section: "Magazin", title: "Laufen im Winter", excerpt: "Tipps", text: "Ernährung", path: "/magazin/a" },
    { section: "Magazin", title: "Proteine", excerpt: "Ernährung für Sportler", path: "/magazin/b" },
    { section: "Fitnesswelt", title: "Ernährung & Fitness", excerpt: "", path: "/magazin/thema/ernaehrung" },
  ];
  assert.deepEqual(
    searchDocuments(docs, "ernaehrung").map((hit) => hit.path),
    ["/magazin/thema/ernaehrung", "/magazin/b", "/magazin/a"],
  );
  assert.deepEqual(searchDocuments(docs, "   "), []);
  assert.deepEqual(searchDocuments(docs, "yoga"), []);
  const many = Array.from({ length: 80 }, (_, i) => ({ section: "Magazin", title: `Training ${i}`, excerpt: "", path: `/magazin/t${i}` }));
  assert.equal(searchDocuments(many, "training").length, SITE_SEARCH_MAX_RESULTS);
});
