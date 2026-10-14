import assert from "node:assert/strict";
import test from "node:test";
import { NextRequest } from "next/server.js";
import { withTrailingSlash } from "../lib/markets.ts";
import { proxy } from "../proxy.ts";

function run(path) {
  const response = proxy(new NextRequest(`https://fitness-liebe.vercel.app${path}`));
  return { status: response.status, location: response.headers.get("location") };
}

function assertRedirect(path, location) {
  assert.deepEqual(run(path), { status: 308, location }, path);
}

function assertPass(path) {
  const { status, location } = run(path);
  assert.equal(location, null, path);
  assert.equal(status, 200, path);
}

function rewriteOf(path) {
  return proxy(new NextRequest(`https://fitness-liebe.vercel.app${path}`)).headers.get("x-middleware-rewrite");
}

test("withTrailingSlash appends the slash to pages only", () => {
  assert.equal(withTrailingSlash("/de/magazin"), "/de/magazin/");
  assert.equal(withTrailingSlash("/de/magazin/"), "/de/magazin/");
  assert.equal(withTrailingSlash("/de/magazin?x=1#a"), "/de/magazin/?x=1#a");
  assert.equal(withTrailingSlash(""), "/");
  assert.equal(withTrailingSlash("/sitemap.xml"), "/sitemap.xml");
  assert.equal(withTrailingSlash("/app-assets/brand/logo.svg"), "/app-assets/brand/logo.svg");
});

test("AT/CH paths without slash redirect relatively with 308", () => {
  assertRedirect("/at", "https://fitness-liebe.vercel.app/at/");
  assertRedirect("/at/partnersuche", "https://fitness-liebe.vercel.app/at/partnersuche/");
  assertRedirect("/ch/ueber-uns?AID=x", "https://fitness-liebe.vercel.app/ch/ueber-uns/?AID=x");
});

// Seit dem Reverse-Proxy-Livegang (Heiko, 2026-10-14): nginx reicht nur präfixfreie Seitenrouten an Vercel weiter.
// DE ist darum öffentlich ohne Präfix; /de/… ist nur noch der interne Routenpfad.
test("DE prefix redirects to the public prefix-free path in one redirect", () => {
  assertRedirect("/de", "https://fitness-liebe.vercel.app/");
  assertRedirect("/de/", "https://fitness-liebe.vercel.app/");
  assertRedirect("/de/magazin/", "https://fitness-liebe.vercel.app/magazin/");
  assertRedirect("/de/partnersuche/berlin?AID=x", "https://fitness-liebe.vercel.app/partnersuche/berlin/?AID=x");
  assertRedirect("/partnersuche/berlin", "https://fitness-liebe.vercel.app/partnersuche/berlin/");
});

test("prefix-free DE pages are rewritten internally to /de/… without a redirect", () => {
  assertPass("/");
  assertPass("/magazin/cardio-training/");
  assert.match(rewriteOf("/"), /\/de\/$/);
  assert.match(rewriteOf("/magazin/cardio-training/?q=1"), /\/de\/magazin\/cardio-training\/\?q=1$/);
  assert.match(rewriteOf("/partnersuche/berlin/"), /\/de\/partnersuche\/berlin\/$/);
  assert.match(rewriteOf("/ueber-uns/suche/?q=wien"), /\/de\/ueber-uns\/suche\/\?q=wien$/);
  assert.equal(rewriteOf("/at/partnersuche/"), null);
});

test("AT/CH magazine goes straight to the prefix-free DE magazine with slash", () => {
  assertRedirect("/at/magazin", "https://fitness-liebe.vercel.app/magazin/");
  assertRedirect("/ch/magazin/cardio-training/?q=1", "https://fitness-liebe.vercel.app/magazin/cardio-training/?q=1");
});

test("Dating-Tipps stays on the ICONY platform", () => {
  assertRedirect("/at/dating-tipps", "https://fitness-liebe.de/dating-tipps/");
});

test("pages with slash, files and technical paths pass without redirect", () => {
  assertPass("/magazin/");
  assertPass("/at/partnersuche/");
  assertPass("/magazin/cardio-training/?q=1");
  assertPass("/sitemap.xml");
  assertPass("/robots.txt");
  assertPass("/icon.png");
  assertPass("/_next/data/x");
  assertPass("/api/revalidate");
  assertPass("/.well-known/security");
});
