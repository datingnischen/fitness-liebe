import test from "node:test";
import assert from "node:assert/strict";
import { RECIPE_CARD_MARKER, buildRecipeNode, getRecipe, isoDuration } from "../lib/recipes.ts";

test("formats ISO-8601 durations", () => {
  assert.equal(isoDuration(35), "PT35M");
  assert.equal(isoDuration(60), "PT1H");
  assert.equal(isoDuration(70), "PT1H10M");
  assert.equal(isoDuration(0), "PT0M");
});

test("builds a complete Recipe node for both magazine recipes", () => {
  for (const slug of ["kartoffelsalat-moggstar", "veggie-vulkan-spaghetti"]) {
    const recipe = getRecipe(slug);
    assert.ok(recipe, slug);
    const pageUrl = `https://fitness-liebe.de/de/magazin/${slug}`;
    const node = buildRecipeNode({ recipe, pageUrl, image: "https://example.org/bild.png", inLanguage: "de-DE" });
    assert.equal(node["@type"], "Recipe");
    assert.equal(node["@id"], `${pageUrl}#rezept`);
    assert.ok(node.recipeIngredient.length >= 10);
    assert.ok(node.recipeIngredient.every((item) => typeof item === "string" && item.trim()));
    assert.equal(node.recipeInstructions[0].url, `${pageUrl}#rezept-schritt-1`);
    assert.match(node.totalTime, /^PT/);
    assert.deepEqual(node.image, ["https://example.org/bild.png"]);
  }
});

test("Kartoffelsalat carries its YouTube video", () => {
  const node = buildRecipeNode({ recipe: getRecipe("kartoffelsalat-moggstar"), pageUrl: "https://x.test/a", inLanguage: "de-DE" });
  assert.equal(node.totalTime, "PT1H10M");
  assert.equal(node.video.embedUrl, "https://www.youtube.com/embed/spa1PEtqyI4");
  assert.equal(node.video.duration, "PT22S");
});

test("finds the WordPress marker even inside an autop paragraph", () => {
  const [before, after] = "<p>Intro</p>\n<p><!-- rezeptkarte --></p>\n<h2>Tipps</h2>".split(RECIPE_CARD_MARKER, 2);
  assert.equal(before, "<p>Intro</p>");
  assert.equal(after, "<h2>Tipps</h2>");
});
