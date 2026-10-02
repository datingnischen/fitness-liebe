"""
Einmaliger Import des WordPress-Magazins (fitness-liebe.de/magazin) in Dateien im Repo.

Nach dem Import liest die App ausschliesslich diese Dateien (lib/magazine-content.ts), kein WordPress-Request mehr
zur Laufzeit oder zum Build. Das Skript ist ein Einmalwerkzeug: nach redaktionellen Korrekturen im Repo NICHT erneut
ausfuehren (es wuerde die Korrekturen ueberschreiben).

Liest nur die oeffentliche REST-API (kein Login). Ist die Firmen-Firewall im Weg, darf WPIMPORT_INSECURE=1 gesetzt
werden - nur zum Lesen oeffentlicher Inhalte, nie mit Zugangsdaten.

Aufruf:  PYTHONIOENCODING=utf-8 python scripts/import_wordpress.py

Schreibt:
  content/magazin/beitraege/<slug>.md   Beitraege (Frontmatter + HTML-Koerper)
  content/magazin/seiten/<slug>.md      feste Seiten (Autorenprofile, Rechtstexte)
  data/magazin-kategorien.json          Kategorien
  data/magazin-autoren.json             Autoren
  data/magazin-weiterleitungen.json     alte Slugs -> aktuelle Slugs
  public/magazin/wp-content/uploads/…   alle im Inhalt und als Beitragsbild genutzten Dateien (Pfad wie in WordPress)
  data/magazin-wp-inventar.json         Slug-Inventar von WordPress zum Abgleich in den Tests
"""
from __future__ import annotations

import html
import json
import os
import re
import ssl
import sys
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CACHE = ROOT / ".wp-cache"
SITE = "https://fitness-liebe.de/magazin"
UPLOAD_PREFIX = "/magazin/wp-content/uploads/"
UA = {"User-Agent": "Mozilla/5.0 (datingnischen import)"}

SSL_CTX = None
if os.environ.get("WPIMPORT_INSECURE") == "1":
    SSL_CTX = ssl.create_default_context()
    SSL_CTX.check_hostname = False
    SSL_CTX.verify_mode = ssl.CERT_NONE

# Alte Slugs, die in WordPress per _wp_old_slug auf den aktuellen Beitrag umleiten (live geprueft: 301).
# Die WP-Datenbank liegt bei ICONY, nicht auf dem Plesk-VPS - die Liste stammt aus den Links in den Beitraegen.
ALTE_SLUGS = {
    "diebestezeitzumtrainieren": "beste-zeit-zum-trainieren",  # Link in einem Beitrag, WP leitet per 301 um
}

# Leere Alt-Texte der Autorenfotos (Dateiname-Teil -> Alt-Text). Nie leer lassen.
ALT_KORREKTUR = {
    "Christian-M-Haas-Middle": "Christian M. Haas, Dating-Experte und Sport-Enthusiast",
    "gazi-avakhti-full": "Gazi Avakhti, Personaltrainer und Erfinder des GA Shaker+",
}

# Textkorrekturen (alt, neu) - bewusst leer: Texte werden 1:1 uebernommen.
TEXT_KORREKTUR: list[tuple[str, str]] = []


def open_url(url: str, timeout: int = 120):
    return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=timeout, context=SSL_CTX)


def fetch_all(kind: str) -> list:
    out, page = [], 1
    while True:
        with open_url(f"{SITE}/wp-json/wp/v2/{kind}?per_page=100&page={page}") as r:
            out += json.load(r)
            pages = int(r.headers.get("X-WP-TotalPages", "1"))
        if page >= pages:
            return out
        page += 1


def load(kind: str) -> list:
    f = CACHE / f"{kind}.json"
    if f.exists():
        return json.loads(f.read_text("utf-8"))
    CACHE.mkdir(exist_ok=True)
    data = fetch_all(kind)
    f.write_text(json.dumps(data, ensure_ascii=False, indent=1), "utf-8")
    return data


# ------------------------------------------------------------------ Texte


def decode(value: str) -> str:
    return html.unescape(value or "")


def strip_tags(value: str) -> str:
    return re.sub(r"\s+", " ", decode(re.sub(r"<[^>]+>", " ", decode(value)))).strip()


AUDIO_BOILERPLATE = re.compile(
    r"^\s*Artikel kurz anhören\s*Die wichtigsten Punkte kurz und verständlich zusammengefasst\.\s*(?:Dein Browser unterstützt das Audio-Element nicht\.)?\s*",
    re.I,
)


def clean_excerpt(value: str) -> str:
    text = re.sub(r"\s+", " ", decode(re.sub(r"<[^>]+>", " ", value or "")))
    text = AUDIO_BOILERPLATE.sub("", text)
    text = re.sub(r"^Kurzantwort\s+", "", text, flags=re.I)
    text = re.sub(r"\s*(?:\[…\]|\[\.\.\.\]|…|\.\.\.)\s*$", "", text)
    return text.strip()


SITE_TITLE_SUFFIX = re.compile(r"\s*(?:[|–—-]|#separator_sa)?\s*#site_title\s*$", re.I)


def clean_smart_tags(value: str, post_title: str) -> str:
    v = decode(value).replace(" ", " ")
    v = SITE_TITLE_SUFFIX.sub("", v)
    v = re.sub(r"#post_title", lambda _: post_title, v, flags=re.I)
    v = re.sub(r"#separator_sa", "–", v, flags=re.I)
    v = re.sub(r"#site_title", "fitness-liebe.de", v, flags=re.I)
    v = re.sub(r"\s+", " ", v)
    v = re.sub(r"\s*[|–—-]\s*$", "", v)
    return v.strip()


def aioseo(item: dict) -> tuple[str | None, str | None]:
    """SEO-Titel und Description wie bisher im Frontend aus AIOSEO aufgeloest (Smart-Tags entfernt)."""
    post_title = decode(item["title"]["rendered"])
    meta = item.get("aioseo_meta_data") or {}
    title = clean_smart_tags(meta["title"], post_title) if meta.get("title") else ""
    desc = clean_smart_tags(meta["description"], post_title) if meta.get("description") else ""
    return (title or None, desc if len(desc) >= 50 else None)


# ------------------------------------------------------------------ HTML

UPLOAD_URL = re.compile(r"https?://(?:www\.)?fitness-liebe\.de/magazin/wp-content/uploads/([^\"'\s<>)]+)", re.I)
uploads: dict[str, str] = {}  # rel (wie in WordPress) -> lokaler rel


def local_rel(rel: str) -> str:
    rel = urllib.parse.unquote(rel)
    safe = re.sub(r"[^A-Za-z0-9._/-]", "-", rel)
    uploads[rel] = safe
    return safe


def unwrap_lazy(markup: str) -> str:
    """Smush-Lazyload zurueckdrehen: echte URL aus data-src/data-srcset/data-sizes in src/srcset/sizes."""

    def fix(m: re.Match) -> str:
        tag = m.group(0)
        tag = re.sub(r"\ssrc=([\"'])data:[^\"']*\1", "", tag, flags=re.I)
        tag = re.sub(r"\sdata-(src|srcset|sizes)=", lambda g: f" {g.group(1)}=", tag, flags=re.I)
        tag = re.sub(r"(\sclass=[\"'][^\"']*?)\s*\blazyload\b", r"\1", tag, flags=re.I)
        tag = re.sub(r"\sstyle=([\"'])--smush-placeholder[^\"']*\1", "", tag, flags=re.I)
        tag = re.sub(r"\sdata-load-mode=([\"'])[^\"']*\1", "", tag, flags=re.I)
        return tag

    return re.sub(r"<(?:img|iframe)\b[^>]*\bdata-src=[\"'][^\"']+[\"'][^>]*>", fix, markup, flags=re.I)


def fill_alt(markup: str, fallback: str) -> str:
    """Kein <img> ohne oder mit leerem alt."""

    def fix(m: re.Match) -> str:
        tag = m.group(0)
        alt = re.search(r"\salt=([\"'])(.*?)\1", tag, re.S)
        if alt and alt.group(2).strip():
            return tag
        text = fallback
        for key, value in ALT_KORREKTUR.items():
            if key in tag:
                text = value
        text = html.escape(text, quote=True)
        if alt:
            return tag.replace(alt.group(0), f' alt="{text}"')
        return tag.replace("<img", f'<img alt="{text}"', 1)

    return re.sub(r"<img\b[^>]*>", fix, markup, flags=re.I)


def clean_body(markup: str, title: str) -> str:
    body = unwrap_lazy(markup)
    body = UPLOAD_URL.sub(lambda m: UPLOAD_PREFIX + local_rel(m.group(1)), body)
    body = fill_alt(body, title)
    for old, new in TEXT_KORREKTUR:
        body = body.replace(old, new)
    return body.strip() + "\n"


# ------------------------------------------------------------------ Schreiben


def yaml_value(value) -> str:
    return json.dumps(value, ensure_ascii=False)


def write_md(path: Path, front: list[tuple[str, object]], body: str) -> None:
    lines = ["---"]
    for key, value in front:
        if value in (None, "", [], {}):
            continue
        lines.append(f"{key}: {yaml_value(value)}")
    lines.append("---")
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("\n".join(lines) + "\n\n" + body, "utf-8", newline="\n")


def featured_rel(media_item: dict | None, max_width: int = 1200) -> tuple[str | None, str]:
    """Beste vorhandene Bildgroesse <= max_width (sonst Original) als Upload-Pfad."""
    if not media_item:
        return None, ""
    details = media_item.get("media_details") or {}
    best = None
    for s in (details.get("sizes") or {}).values():
        w = s.get("width") or 0
        if w <= max_width and (best is None or w > best[0]):
            best = (w, s.get("source_url"))
    url = media_item["source_url"] if (details.get("width") or 0) <= max_width or not best else best[1]
    m = UPLOAD_URL.search(url or "")
    alt = decode(media_item.get("alt_text") or "").strip()
    return (UPLOAD_PREFIX + local_rel(m.group(1)) if m else None), alt


def download_uploads() -> None:
    public = ROOT / "public" / "magazin" / "wp-content" / "uploads"
    cache = CACHE / "uploads"
    n = 0
    for rel, safe in sorted(uploads.items()):
        src = cache / safe
        if not src.exists():
            src.parent.mkdir(parents=True, exist_ok=True)
            url = f"{SITE}/wp-content/uploads/" + urllib.parse.quote(rel)
            try:
                with open_url(url) as r:
                    src.write_bytes(r.read())
            except Exception as e:  # noqa: BLE001
                print(f"  FEHLER Datei {rel}: {e}", file=sys.stderr)
                continue
        dest = public / safe
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_bytes(src.read_bytes())
        n += 1
    print(f"{n}/{len(uploads)} Dateien nach public/magazin/wp-content/uploads/")


def main() -> None:
    posts = load("posts")
    pages = load("pages")
    categories = load("categories")
    users = load("users")
    media = load("media")
    if (CACHE / "media2.json").exists():
        media += json.loads((CACHE / "media2.json").read_text("utf-8"))
    media_by_id = {m["id"]: m for m in media}
    cat_by_id = {c["id"]: c for c in categories}
    user_by_id = {u["id"]: u for u in users}

    # Inventar sichern (Abgleich in den Tests)
    inventory = {
        "posts": sorted(p["slug"] for p in posts if p["status"] == "publish"),
        "pages": sorted(p["slug"] for p in pages if p["status"] == "publish"),
        "categories": sorted(c["slug"] for c in categories),
        "authors": sorted(u["slug"] for u in users),
    }

    def entry(item: dict, kind: str) -> None:
        if item["status"] != "publish":
            return
        title = decode(item["title"]["rendered"])
        seo_title, seo_desc = aioseo(item)
        image, image_alt = featured_rel(media_by_id.get(item.get("featured_media")))
        if image and not image_alt:
            image_alt = title
        cats = [cat_by_id[c]["slug"] for c in item.get("categories", []) if c in cat_by_id]
        author = user_by_id.get(item.get("author"))
        front = [
            ("id", item["id"]),
            ("title", title),
            ("seoTitle", seo_title),
            ("description", seo_desc),
            ("excerpt", clean_excerpt(item["excerpt"]["rendered"])),
            ("published", item["date"]),
            ("updated", item["modified"]),
            ("category", cats[0] if cats else None),
            ("author", author["slug"] if author else None),
            ("image", image),
            ("imageAlt", image_alt if image else None),
        ]
        folder = "beitraege" if kind == "post" else "seiten"
        write_md(ROOT / "content" / "magazin" / folder / f"{item['slug']}.md", front, clean_body(item["content"]["rendered"], title))

    for p in posts:
        entry(p, "post")
    for p in pages:
        entry(p, "page")

    (ROOT / "data").mkdir(exist_ok=True)
    cats_out = [
        {"id": c["id"], "slug": c["slug"], "name": decode(c["name"]), "description": decode(c.get("description") or "")}
        for c in sorted(categories, key=lambda c: c["id"])
    ]
    authors_out = [{"id": u["id"], "slug": u["slug"], "name": decode(u["name"])} for u in sorted(users, key=lambda u: u["id"])]
    for name, data in (
        ("magazin-kategorien.json", cats_out),
        ("magazin-autoren.json", authors_out),
        ("magazin-weiterleitungen.json", ALTE_SLUGS),
        ("magazin-wp-inventar.json", inventory),
    ):
        (ROOT / "data" / name).write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", "utf-8", newline="\n")

    download_uploads()
    print(f"{len(inventory['posts'])} Beitraege, {len(inventory['pages'])} Seiten, {len(cats_out)} Kategorien, {len(authors_out)} Autoren")


if __name__ == "__main__":
    main()
