import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import test from "node:test";
import matter from "gray-matter";
import {
  getAllMagazineEntries,
  getMagazineCategories,
  getMagazineCategoryBySlug,
  getMagazineEntryBySlug,
  getMagazinePages,
  getMagazinePosts,
  getMagazinePostsByCategory,
  getMagazinePostsPage,
} from "../lib/magazine.ts";

const root = new URL("../", import.meta.url);
const rootPath = (path) => new URL(path, root);
const readText = (path) => readFileSync(rootPath(path), "utf8");
const readJson = (path) => JSON.parse(readText(path));

const inventory = readJson("data/magazin-wp-inventar.json");

function files(folder) {
  return readdirSync(rootPath(`content/magazin/${folder}/`))
    .filter((name) => name.endsWith(".md"))
    .map((name) => ({ slug: name.replace(/\.md$/, ""), raw: readText(`content/magazin/${folder}/${name}`), ...matter(readText(`content/magazin/${folder}/${name}`)) }));
}

const posts = files("beitraege");
const pages = files("seiten");

test("Magazin liest aus Dateien: alle WordPress-Slugs sind vorhanden", async () => {
  assert.equal(inventory.posts.length, 45);
  assert.equal(inventory.pages.length, 4);
  assert.deepEqual(posts.map((item) => item.slug).sort(), inventory.posts);
  assert.deepEqual(pages.map((item) => item.slug).sort(), inventory.pages);
  assert.deepEqual((await getMagazinePosts()).map((item) => item.slug).sort(), inventory.posts);
  assert.deepEqual((await getMagazinePages()).map((item) => item.slug).sort(), inventory.pages);
  assert.equal((await getAllMagazineEntries()).length, 49);
});

test("Kategorien und Autoren entsprechen WordPress", async () => {
  assert.deepEqual(readJson("data/magazin-kategorien.json").map((item) => item.slug).sort(), inventory.categories);
  assert.deepEqual(readJson("data/magazin-autoren.json").map((item) => item.slug).sort(), inventory.authors);
  const categories = await getMagazineCategories();
  assert.equal(categories.find((item) => item.slug === "allgemein").count, 43);
  assert.equal(categories.find((item) => item.slug === "rezepte").count, 2);
  const rezepte = await getMagazineCategoryBySlug("rezepte");
  assert.deepEqual((await getMagazinePostsByCategory(rezepte.id)).map((item) => item.slug).sort(), ["kartoffelsalat-moggstar", "veggie-vulkan-spaghetti"]);
  assert.equal(await getMagazineCategoryBySlug("gibt-es-nicht"), null);
});

test("Beiträge sind nach Datum absteigend sortiert und werden seitenweise geliefert", async () => {
  const all = await getMagazinePosts();
  for (let i = 1; i < all.length; i += 1) assert.ok(all[i - 1].date >= all[i].date, all[i].slug);
  const first = await getMagazinePostsPage(1, 12);
  assert.equal(first.posts.length, 12);
  assert.equal(first.totalItems, 45);
  assert.equal(first.totalPages, 4);
  assert.equal((await getMagazinePostsPage(4, 12)).posts.length, 9);
});

test("Autoren und Seiten werden aufgelöst", async () => {
  const entry = await getMagazineEntryBySlug("sperm-maxxing-maennergesundheit");
  assert.equal(entry.type, "post");
  assert.equal(entry.authorSlug, "christian-m-haas");
  assert.equal(entry.authorName, "Christian M. Haas");
  assert.equal((await getMagazineEntryBySlug("impressum")).type, "page");
  assert.equal(await getMagazineEntryBySlug("gibt-es-nicht"), null);
});

test("Frontmatter: SEO-Titel, Description, Datum und Beitragsbild sind sauber", () => {
  for (const item of [...posts, ...pages]) {
    const d = item.data;
    assert.ok(d.title, `${item.slug}: Titel`);
    assert.ok(d.published && d.updated, `${item.slug}: Datum`);
    if (d.seoTitle) assert.ok(d.seoTitle.length <= 60, `${item.slug}: SEO-Titel zu lang (${d.seoTitle.length})`);
    if (d.description) assert.ok(d.description.length >= 50 && d.description.length <= 165, `${item.slug}: Description ${d.description.length}`);
    assert.doesNotMatch(`${d.seoTitle ?? ""}${d.description ?? ""}`, /#site_title|#post_title|#separator_sa|&nbsp;|&amp;/i, `${item.slug}: Smart-Tag-Rest`);
  }
  for (const item of posts) {
    assert.ok(item.data.description, `${item.slug}: Description fehlt`);
    assert.ok(item.data.image, `${item.slug}: Beitragsbild fehlt`);
    assert.ok(item.data.imageAlt && item.data.imageAlt.trim().length > 3, `${item.slug}: Alt-Text des Beitragsbilds`);
    assert.ok(["allgemein", "rezepte"].includes(item.data.category), `${item.slug}: Kategorie`);
  }
});

test("Bilder und Audiodateien existieren unter public/", () => {
  const referenced = new Set();
  for (const item of [...posts, ...pages]) {
    if (item.data.image) referenced.add(item.data.image);
    for (const m of item.content.matchAll(/(?:src|href)="(\/magazin\/wp-content\/uploads\/[^"]+)"/g)) referenced.add(m[1]);
    for (const m of item.content.matchAll(/(\/magazin\/wp-content\/uploads\/[^\s",]+)\s+\d+w/g)) referenced.add(m[1]);
  }
  assert.ok(referenced.size > 100);
  for (const path of referenced) assert.ok(existsSync(rootPath(`public${path}`)), `${path} fehlt`);
});

test("Alt-Texte: kein <img> ohne oder mit leerem alt", () => {
  let total = 0;
  for (const item of [...posts, ...pages]) {
    for (const [tag] of item.content.matchAll(/<img\b[^>]*>/gi)) {
      total += 1;
      const alt = tag.match(/\salt=(["'])(.*?)\1/s);
      assert.ok(alt && alt[2].trim().length > 2, `${item.slug}: ${tag.slice(0, 120)}`);
    }
  }
  assert.ok(total >= 40);
});

test("Keine WordPress-Reste im Inhalt", () => {
  for (const item of [...posts, ...pages]) {
    assert.doesNotMatch(item.content, /data-src=|lazyload|smush|data:image\/svg/i, `${item.slug}: Lazyload-Rest`);
    assert.doesNotMatch(item.content, /fitness-liebe\.de\/magazin\/wp-content/i, `${item.slug}: absolute Upload-URL`);
    assert.doesNotMatch(item.content, /<script|<style|\[caption|\[gallery|<!--more-->/i, `${item.slug}: Plugin-/Editor-Rest`);
    assert.doesNotMatch(item.raw, /vercel\.app|fonts\.googleapis/i, `${item.slug}: Hostname im Inhalt`);
  }
});

test("Titelbilder werden beim Laden auf den Asset-Host umgeschrieben", async () => {
  const entry = await getMagazineEntryBySlug("sperm-maxxing-maennergesundheit");
  assert.match(entry.featuredImage, /^https:\/\/fitness-liebe\.vercel\.app\/app-assets\/magazin\/wp-content\/uploads\//);
  assert.match(entry.content, /src="https:\/\/fitness-liebe\.vercel\.app\/app-assets\/magazin\/wp-content\/uploads\/.*\.mp3"/);
});

test("alte Slugs leiten um und zeigen auf vorhandene Beiträge", () => {
  const redirects = readJson("data/magazin-weiterleitungen.json");
  assert.equal(redirects.diebestezeitzumtrainieren, "beste-zeit-zum-trainieren");
  for (const target of Object.values(redirects)) assert.ok(inventory.posts.includes(target), target);
  const config = readText("next.config.ts");
  assert.match(config, /magazin-weiterleitungen\.json/);
  assert.match(config, /trailingSlash: true/);
});

test("Quellcode greift nicht mehr auf WordPress zu", () => {
  const offenders = [];
  function walk(dir) {
    for (const entry of readdirSync(rootPath(`${dir}/`), { withFileTypes: true })) {
      const path = `${dir}/${entry.name}`;
      if (entry.isDirectory()) walk(path);
      else if (/\.(tsx?|mjs)$/.test(entry.name) && !path.startsWith("tests/") && /wp-json|WORDPRESS_REST|fetchWp|wp\/v2/.test(readText(path))) offenders.push(path);
    }
  }
  for (const dir of ["app", "components", "lib"]) walk(dir);
  assert.deepEqual(offenders, []);
  assert.ok(!existsSync(rootPath("lib/wordpress.ts")));
  assert.ok(!existsSync(rootPath("lib/wordpress")));
  assert.doesNotMatch(readText("package.json"), /#wordpress/);
});
