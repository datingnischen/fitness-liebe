import assert from "node:assert/strict";
import { readdir } from "node:fs/promises";
import test from "node:test";
import { getMarketCityPages, getMarketPartnersucheHub, getMarketPartnersucheIntro, hasCityPages, marketsWithCity } from "../lib/market-partnersuche.ts";
import {
  LIVE_MARKETS,
  MARKET_CODES,
  contentMarket,
  hasMagazine,
  marketsForPath,
  internalPath,
  liveMarkets,
  localizeHref,
  marketAlternates,
  marketFromPathname,
  marketPath,
  platformPageUrl,
  platformUrl,
  publicUrl,
  registrationUrl,
  stripMarketPrefix,
} from "../lib/markets.ts";

test("de, at and ch are the configured countries", () => {
  assert.deepEqual([...MARKET_CODES], ["de", "at", "ch"]);
});

// Seit dem Reverse-Proxy-Livegang (Heiko, 2026-10-14) ist DE öffentlich präfixfrei: nginx reicht nur /magazin/, /faq/,
// /partnersuche/, /ueber-uns/ … an Vercel weiter, /de/… lief ins Leere. Intern bleibt app/[market]/de.
test("DE pages live without prefix, AT/CH below their country prefix", () => {
  assert.equal(marketPath("de", "/partnersuche"), "/partnersuche/");
  assert.equal(marketPath("de", "/"), "/");
  assert.equal(marketPath("at", "/"), "/at/");
  assert.equal(marketPath("ch", "magazin/cardio-training/"), "/ch/magazin/cardio-training/");
  assert.equal(publicUrl("de", "/partnersuche/berlin"), "https://fitness-liebe.de/partnersuche/berlin/");
  assert.equal(publicUrl("de", "/magazin"), "https://fitness-liebe.de/magazin/");
  assert.equal(publicUrl("at"), "https://fitness-liebe.de/at/");
  assert.equal(internalPath("de", "/magazin/"), "/de/magazin/");
  assert.equal(internalPath("de", "/"), "/de/");
  assert.equal(internalPath("at", "/partnersuche"), "/at/partnersuche/");
});

test("internal links get the country prefix exactly once", () => {
  assert.equal(localizeHref("at", "/social-media"), "/at/social-media/");
  assert.equal(localizeHref("de", "/magazin"), "/magazin/");
  assert.equal(localizeHref("de", "/"), "/");
  assert.equal(localizeHref("ch", "/"), "/ch/");
  assert.equal(localizeHref("de", "/magazin/inhalt?q=x#a"), "/magazin/inhalt/?q=x#a");
  assert.equal(localizeHref("at", "/de/magazin"), "/magazin/");
  assert.equal(localizeHref("de", "/at/partnersuche/wien"), "/at/partnersuche/wien/");
  assert.equal(localizeHref("ch", "/ueber-uns"), "/ch/ueber-uns/");
  assert.equal(localizeHref("at", "https://fitness-liebe.de/login/"), "https://fitness-liebe.de/login/");
  assert.equal(localizeHref("at", "#faq"), "#faq");
  assert.equal(localizeHref("at", "/deutsch"), "/at/deutsch/");
});

test("country prefix is recognised and stripped", () => {
  assert.equal(marketFromPathname("/ch/partnersuche"), "ch");
  assert.equal(marketFromPathname("/partnersuche"), null);
  assert.equal(marketFromPathname("/social-media"), null);
  assert.equal(stripMarketPrefix("/at/partnersuche/wien"), "/partnersuche/wien");
  assert.equal(stripMarketPrefix("/de"), "/");
});

test("Dating-Tipps is an ICONY page and never rendered by Next.js", async () => {
  assert.equal(platformPageUrl("/dating-tipps"), "https://fitness-liebe.de/dating-tipps/");
  assert.equal(platformPageUrl("/dating-tipps/"), "https://fitness-liebe.de/dating-tipps/");
  assert.equal(platformPageUrl("/social-media"), null);
  const routes = await readdir(new URL("../app/[market]/", import.meta.url));
  assert.ok(!routes.includes("dating-tipps"));
});

test("ICONY platform pages stay absolute on the live domain without country prefix", () => {
  assert.equal(platformUrl("/redaktionelle-kontrolle.html"), "https://fitness-liebe.de/redaktionelle-kontrolle.html");
  assert.equal(registrationUrl("location"), "https://fitness-liebe.de/registration/?AID=location");
});

test("only DE has its own magazine; AT/CH link to it instead of duplicating it", () => {
  assert.deepEqual(MARKET_CODES.filter(hasMagazine), ["de"]);
  assert.equal(localizeHref("at", "/magazin"), "/magazin/");
  assert.equal(localizeHref("ch", "/magazin/cardio-training"), "/magazin/cardio-training/");
  assert.equal(contentMarket("at", "/magazin/thema/training"), "de");
  assert.equal(contentMarket("at", "/magazinfoo"), "at");
  assert.deepEqual(marketsForPath("/magazin/cardio-training"), ["de"]);
  // Nur ein Land → keine hreflang-Verweise (ein einzelnes de-DE + x-default wäre ohne Mehrwert).
  assert.deepEqual(Object.keys(marketAlternates("de", "/magazin").languages), []);
});

test("hreflang lists only live-reachable countries (AT/CH answer 404 behind nginx until it forwards them)", () => {
  const alternates = marketAlternates("at", "/social-media");
  assert.equal(alternates.canonical, "https://fitness-liebe.de/at/social-media/");
  assert.deepEqual(LIVE_MARKETS, ["de"]);
  assert.deepEqual(alternates.languages, {});
  assert.deepEqual(liveMarkets(["de", "at", "ch"]), ["de"]);
  assert.deepEqual(Object.keys(marketAlternates("de", "/partnersuche/berlin", marketsWithCity("berlin")).languages), []);
});

test("city pages exist only where they are imported", () => {
  assert.ok(hasCityPages("de"));
  assert.ok(getMarketPartnersucheHub("de"));
  for (const market of ["at", "ch"]) {
    assert.equal(hasCityPages(market), getMarketCityPages(market).length > 0);
    if (!hasCityPages(market)) assert.equal(getMarketPartnersucheHub(market), null);
  }
});

test("AT and CH answer /partnersuche with an intro until they have city pages", () => {
  for (const market of ["at", "ch"]) {
    const intro = getMarketPartnersucheIntro(market);
    assert.ok(intro && intro.paragraphs.length > 0, market);
    assert.ok(!/\d{2,}/.test(intro.paragraphs.join(" ")), "keine erfundenen Zahlen");
  }
  assert.equal(getMarketPartnersucheIntro("de"), null);
  assert.ok(!/ß/.test(JSON.stringify(getMarketPartnersucheIntro("ch"))), "CH ohne ß");
});

test("all content routes live below app/[market]", async () => {
  const top = (await readdir(new URL("../app/", import.meta.url), { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
  // Einzige Ausnahme: /magazin/sitemap.xml, die ICONYs sitemap.php hinter nginx referenziert.
  assert.deepEqual(top.sort(), ["[market]", "magazin"]);
  const magazin = await readdir(new URL("../app/magazin/", import.meta.url));
  assert.deepEqual(magazin, ["sitemap.xml"]);
});
