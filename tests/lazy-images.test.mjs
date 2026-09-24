import test from "node:test";
import assert from "node:assert/strict";
import { unwrapLazyImages } from "../lib/wordpress.ts";

test("Smush-Lazyload-Bilder bekommen ihre echte URL zurück", () => {
  const html =
    '<img decoding="async" class="alignnone wp-image-711 size-medium lazyload" data-src="https://x.de/a-243x300.png" alt="" width="243" height="300" data-srcset="https://x.de/a-243x300.png 243w, https://x.de/a.png 900w" data-sizes="(max-width: 243px) 100vw, 243px" src="data:image/svg+xml;base64,PHN2Zz4=" style="--smush-placeholder-width: 243px;" />';
  const result = unwrapLazyImages(html);
  assert.match(result, / src="https:\/\/x\.de\/a-243x300\.png"/);
  assert.match(result, / srcset="https:\/\/x\.de\/a-243x300\.png 243w/);
  assert.match(result, / sizes="\(max-width: 243px\)/);
  assert.doesNotMatch(result, /data:image|data-src|lazyload|smush-placeholder/);
});

test("normale Bilder bleiben unverändert", () => {
  const html = '<img class="alignnone" src="https://x.de/b.png" alt="">';
  assert.equal(unwrapLazyImages(html), html);
});
