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

test("withTrailingSlash appends the slash to pages only", () => {
  assert.equal(withTrailingSlash("/de/magazin"), "/de/magazin/");
  assert.equal(withTrailingSlash("/de/magazin/"), "/de/magazin/");
  assert.equal(withTrailingSlash("/de/magazin?x=1#a"), "/de/magazin/?x=1#a");
  assert.equal(withTrailingSlash(""), "/");
  assert.equal(withTrailingSlash("/sitemap.xml"), "/sitemap.xml");
  assert.equal(withTrailingSlash("/app-assets/brand/logo.svg"), "/app-assets/brand/logo.svg");
});

test("paths with country prefix but without slash redirect relatively with 308", () => {
  assertRedirect("/de", "https://fitness-liebe.vercel.app/de/");
  assertRedirect("/at/partnersuche", "https://fitness-liebe.vercel.app/at/partnersuche/");
  assertRedirect("/de/partnersuche/berlin?AID=x", "https://fitness-liebe.vercel.app/de/partnersuche/berlin/?AID=x");
});

test("old URLs without country prefix reach /de/…/ in one redirect", () => {
  assertRedirect("/", "https://fitness-liebe.vercel.app/de/");
  assertRedirect("/partnersuche/berlin", "https://fitness-liebe.vercel.app/de/partnersuche/berlin/");
  assertRedirect("/magazin/cardio-training/", "https://fitness-liebe.vercel.app/de/magazin/cardio-training/");
});

test("AT/CH magazine goes straight to the DE magazine with slash", () => {
  assertRedirect("/at/magazin", "https://fitness-liebe.vercel.app/de/magazin/");
  assertRedirect("/ch/magazin/cardio-training/?q=1", "https://fitness-liebe.vercel.app/de/magazin/cardio-training/?q=1");
});

test("Dating-Tipps stays on the ICONY platform", () => {
  assertRedirect("/at/dating-tipps", "https://fitness-liebe.de/dating-tipps/");
});

test("pages with slash, files and technical paths pass without redirect", () => {
  assertPass("/de/");
  assertPass("/at/partnersuche/");
  assertPass("/de/magazin/cardio-training/?q=1");
  assertPass("/sitemap.xml");
  assertPass("/robots.txt");
  assertPass("/icon.png");
  assertPass("/_next/data/x");
  assertPass("/api/revalidate");
  assertPass("/.well-known/security");
});
