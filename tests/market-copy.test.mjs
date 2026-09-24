import assert from "node:assert/strict";
import test from "node:test";
import { aboutCopy, datingTipsCopy, homeCopy, localizeTexts, socialMediaCopy } from "../lib/market-copy.ts";

const pages = { home: homeCopy, datingTips: datingTipsCopy, about: (market) => aboutCopy(market, "Einleitung."), socialMedia: socialMediaCopy };

test("AT and CH get their own title, description, heading and lead on every shared page", () => {
  for (const [name, copy] of Object.entries(pages)) {
    const de = copy("de");
    for (const market of ["at", "ch"]) {
      const local = copy(market);
      for (const field of ["title", "description", "heading", "lead"]) {
        assert.notEqual(local[field], de[field], `${name}.${field} in ${market} gleicht DE`);
      }
    }
    assert.match(copy("at").title, /Österreich/);
    assert.match(copy("ch").title, /Schweiz/);
  }
});

test("Swiss pages use ss instead of ß, DE and AT keep ß", () => {
  const text = { heading: "Großartig", list: ["Spaß"] };
  assert.deepEqual(localizeTexts("ch", text), { heading: "Grossartig", list: ["Spass"] });
  assert.equal(localizeTexts("at", text), text);
  for (const copy of Object.values(pages)) assert.doesNotMatch(JSON.stringify(copy("ch")), /ß/);
});
