"""Importiert die ICONY-Stadtseiten unter fitness-liebe.de/partnersuche/ nach data/partnersuche-markets.json.

Aufruf: python scripts/import_partnersuche.py
"""

from __future__ import annotations

import html
import json
import re
import urllib.request
from pathlib import Path

BASE = "https://fitness-liebe.de"
PLATFORM_ID = "fitnessliebe"
OUT = Path(__file__).resolve().parent.parent / "data" / "partnersuche-markets.json"
UA = {"User-Agent": "Mozilla/5.0 (fitness-liebe partnersuche import)"}

# ICONY liefert für einzelne Städte keine PLZ im Profil-Frame
FALLBACK_ZIPS = {"mannheim": "68159"}

CITY_NAMES = {
    "muenchen": "München",
    "koeln": "Köln",
    "duesseldorf": "Düsseldorf",
    "nuernberg": "Nürnberg",
}


def fetch(url: str) -> str:
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30) as response:
        return response.read().decode("utf-8", errors="replace")


def text(value: str) -> str:
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", value))).strip()


def city_slugs() -> list[str]:
    sitemap = fetch(f"{BASE}/partner_sitemap.php")
    slugs = re.findall(r"<loc>https://fitness-liebe\.de/partnersuche/([a-z0-9-]+)/</loc>", sitemap)
    return list(dict.fromkeys(slugs))


def extract_content(page: str) -> str:
    start = page.find('<div class="text-content')
    if start < 0:
        return ""
    start = page.find(">", start) + 1
    depth, index = 1, start
    for match in re.finditer(r"<(/?)div\b[^>]*>", page[start:]):
        depth += -1 if match.group(1) else 1
        if depth == 0:
            index = start + match.start()
            break
    content = page[start:index]
    # Leere Absätze und Überschriften aus dem ICONY-Editor
    content = re.sub(r"<h2>(?:\s|&nbsp;)*</h2>", "", content)
    content = re.sub(r"<p>(?:\s|&nbsp;)*</p>", "", content)
    content = re.sub(r"\sdata-media-id=\"\d+\"", "", content)
    # Die Vorschaugröße 400 reicht für das Artikelbild nicht aus
    content = re.sub(r"(static-cms\.icony-hosting\.de/cms/[0-9A-F]+)/400/", r"\1/1000/", content)
    return html.unescape(content).strip()


def first_image(content: str) -> tuple[str | None, str | None]:
    match = re.search(r"<img[^>]+>", content)
    if not match:
        return None, None
    src = re.search(r'src="([^"]+)"', match.group(0))
    alt = re.search(r'alt="([^"]*)"', match.group(0))
    return (src.group(1) if src else None), (alt.group(1) if alt else None)


def import_city(slug: str) -> dict:
    url = f"{BASE}/partnersuche/{slug}/"
    page = fetch(url)
    title = text(re.search(r"<h1[^>]*>(.*?)</h1>", page, re.S).group(1))
    description = html.unescape(re.search(r'<meta name="description" content="([^"]*)"', page).group(1)).strip()
    frame = re.search(r'<iframe src="(https://js\.icony\.com/frame/[^"]+)"', page)
    frame_url = html.unescape(frame.group(1)) if frame else ""
    zip_code = re.search(r"[?&]z=(\d+)", frame_url)
    country = re.search(r"[?&]ctr=(\d*)", frame_url)
    content = extract_content(page)
    image_url, image_alt = first_image(content)
    attribution = None
    if image_alt:
        source = re.search(r"https?://\S+", image_alt)
        if source:
            attribution = source.group(0).rstrip("/") + "/"
            image_alt = image_alt.replace(source.group(0), "").strip(" -–")
    city = CITY_NAMES.get(slug, slug.replace("-", " ").title())
    return {
        "market": "de",
        "slug": slug,
        "path": f"/partnersuche/{slug}",
        "sourceUrl": url,
        "title": title,
        "description": description,
        "cityName": city,
        "lead": description,
        "imageUrl": image_url,
        "imageAlt": image_alt or f"Sportliche Singles in {city}",
        "contentHtml": content,
        "sourceAttributionUrl": attribution,
        "registrationUrl": f"{BASE}/registration/?AID=location",
        "searchUrl": f"{BASE}/suche/?AID=location",
        "icony": {
            "platformId": PLATFORM_ID,
            "zip": zip_code.group(1) if zip_code else FALLBACK_ZIPS.get(slug, ""),
            "country": int(country.group(1)) if country and country.group(1) else 49,
            "frameUrl": frame_url,
        },
    }


def main() -> None:
    pages = [import_city(slug) for slug in city_slugs()]
    data = {
        "de": {
            "market": "de",
            "title": "Sportliche Singles aus deiner Region",
            "description": "Wähle deine Stadt und entdecke sportliche Singles, Laufstrecken, Outdoor-Parks und Fitness-Treffpunkte für einen aktiven Einstieg.",
            "pages": pages,
        }
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"{len(pages)} Stadtseiten -> {OUT}")


if __name__ == "__main__":
    main()
