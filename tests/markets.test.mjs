import assert from "node:assert/strict";
import { readdir } from "node:fs/promises";
import test from "node:test";
import { getMarketCityPages, getMarketPartnersucheHub, hasCityPages, marketsWithCity } from "../lib/market-partnersuche.ts";
import {
  MARKET_CODES,
  contentMarket,
  hasMagazine,
  marketsForPath,
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

test("pages live below the country prefix", () => {
  assert.equal(marketPath("de", "/partnersuche"), "/de/partnersuche");
  assert.equal(marketPath("at", "/"), "/at");
  assert.equal(marketPath("ch", "magazin/cardio-training/"), "/ch/magazin/cardio-training");
  assert.equal(publicUrl("de", "/partnersuche/berlin"), "https://fitness-liebe.de/de/partnersuche/berlin");
  assert.equal(publicUrl("at"), "https://fitness-liebe.de/at");
});

test("internal links get the country prefix exactly once", () => {
  assert.equal(localizeHref("at", "/social-media"), "/at/social-media");
  assert.equal(localizeHref("de", "/magazin"), "/de/magazin");
  assert.equal(localizeHref("ch", "/"), "/ch");
  assert.equal(localizeHref("de", "/magazin/inhalt?q=x#a"), "/de/magazin/inhalt?q=x#a");
  assert.equal(localizeHref("at", "/de/magazin"), "/de/magazin");
  assert.equal(localizeHref("ch", "/ueber-uns"), "/ch/ueber-uns");
  assert.equal(localizeHref("at", "https://fitness-liebe.de/login/"), "https://fitness-liebe.de/login/");
  assert.equal(localizeHref("at", "#faq"), "#faq");
  assert.equal(localizeHref("at", "/deutsch"), "/at/deutsch");
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
  assert.equal(localizeHref("at", "/magazin"), "/de/magazin");
  assert.equal(localizeHref("ch", "/magazin/cardio-training"), "/de/magazin/cardio-training");
  assert.equal(contentMarket("at", "/magazin/thema/training"), "de");
  assert.equal(contentMarket("at", "/magazinfoo"), "at");
  assert.deepEqual(marketsForPath("/magazin/cardio-training"), ["de"]);
  assert.deepEqual(Object.keys(marketAlternates("de", "/magazin").languages), ["de-DE", "x-default"]);
});

test("hreflang lists every country plus x-default", () => {
  const alternates = marketAlternates("at", "/social-media");
  assert.equal(alternates.canonical, "https://fitness-liebe.de/at/social-media");
  assert.deepEqual(alternates.languages, {
    "de-DE": "https://fitness-liebe.de/de/social-media",
    "de-AT": "https://fitness-liebe.de/at/social-media",
    "de-CH": "https://fitness-liebe.de/ch/social-media",
    "x-default": "https://fitness-liebe.de/de/social-media",
  });
  assert.deepEqual(Object.keys(marketAlternates("de", "/partnersuche/berlin", marketsWithCity("berlin")).languages), ["de-DE", "x-default"]);
});

test("city pages exist only where they are imported", () => {
  assert.ok(hasCityPages("de"));
  assert.ok(getMarketPartnersucheHub("de"));
  for (const market of ["at", "ch"]) {
    assert.equal(hasCityPages(market), getMarketCityPages(market).length > 0);
    if (!hasCityPages(market)) assert.equal(getMarketPartnersucheHub(market), null);
  }
});

test("all content routes live below app/[market]", async () => {
  const top = (await readdir(new URL("../app/", import.meta.url), { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
  assert.deepEqual(top, ["[market]"]);
});
