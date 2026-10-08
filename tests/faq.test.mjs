import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { faqCopy, faqSections, plainAnswer } from "../lib/faq-content.ts";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("FAQ gibt es in jedem Land, mit Landesbezug in Titel und Lead", () => {
  assert.ok(!/Österreich|Schweiz/.test(faqCopy("de").title));
  assert.match(faqCopy("at").title, /Österreich/);
  assert.match(faqCopy("ch").title, /Schweiz/);
});

test("CH-FAQ schreibt ohne ß, DE und AT behalten es", () => {
  const ch = JSON.stringify(faqSections("ch")) + JSON.stringify(faqCopy("ch"));
  assert.ok(!ch.includes("ß"));
  assert.ok(JSON.stringify(faqSections("de")).includes("ß"));
  assert.ok(JSON.stringify(faqSections("at")).includes("ß"));
});

test("FAQ nennt keine Preise, Zahlenversprechen oder Vercel-Links; ICONY-Seiten sind absolut", () => {
  const all = JSON.stringify(faqSections("de"));
  assert.ok(!/\d+[,.]\d{2}\s*(?:€|Euro)/.test(all), "Preise gehören in den Mitgliedschaftsbereich");
  assert.ok(!/vercel\.app/.test(all));
  const hrefs = [...all.matchAll(/href=\\"([^"\\]+)\\"/g)].map((m) => m[1]);
  assert.ok(hrefs.length > 0);
  for (const href of hrefs) assert.match(href, /^https:\/\/fitness-liebe\.de\//, href);
  for (const section of faqSections("de")) {
    for (const item of section.items) assert.ok(plainAnswer(item.answerHtml).length > 20, item.question);
  }
});

test("FAQ-Seite hat FAQPage-Schema, steht in Sitemap und Footer", async () => {
  assert.match(await read("app/[market]/faq/page.tsx"), /"@type": "FAQPage"/);
  assert.match(await read("app/sitemap.ts"), /path: "\/faq"/);
  assert.match(await read("components/site-shell.tsx"), /href: "\/faq"/);
});
