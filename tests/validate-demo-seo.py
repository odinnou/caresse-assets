"""Read-only checks: python3 tests/validate-demo-seo.py (no dependencies)."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
from urllib.robotparser import RobotFileParser
import json
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = "https://caresse.app"
REDIRECTS = json.loads((ROOT / "tests/fixtures/demo-redirects.json").read_text())
ALIASES = {r["from"]: r["to"] for r in REDIRECTS}
ERRORS = []


class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.text = text
        self.tags = []
        self.json_scripts = []
        self.json_buffer = None
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        self.tags.append((tag, a))
        if tag == "script" and a.get("type") == "application/ld+json":
            self.json_buffer = []

    def handle_data(self, data):
        if self.json_buffer is not None:
            self.json_buffer.append(data)

    def handle_endtag(self, tag):
        if tag == "script" and self.json_buffer is not None:
            self.json_scripts.append(json.loads("".join(self.json_buffer)))
            self.json_buffer = None

    def attrs(self, tag):
        return [a for t, a in self.tags if t == tag]

    @property
    def canonical(self):
        return [a.get("href") for a in self.attrs("link") if a.get("rel") == "canonical"]

    @property
    def alternates(self):
        return {a["hreflang"]: a["href"] for a in self.attrs("link") if a.get("rel") == "alternate" and a.get("hreflang")}


def require(condition, message):
    if not condition:
        ERRORS.append(message)


def resolve(url, source=None):
    u = urlsplit(url)
    if u.hostname not in (None, "caresse.app") or u.scheme not in ("", "http", "https"):
        return None
    if not u.path:
        return source
    p = ROOT / unquote(u.path).lstrip("/") if u.path.startswith("/") else source.parent / unquote(u.path)
    return p / "index.html" if p.is_dir() or u.path.endswith("/") else p


pages = {}
for file in ROOT.rglob("*.html"):
    if any(part.startswith(".") for part in file.relative_to(ROOT).parts):
        continue
    try:
        pages[file] = Page(file.read_text())
    except (json.JSONDecodeError, UnicodeDecodeError) as error:
        ERRORS.append(f"{file.relative_to(ROOT)}: {error}")

ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9", "x": "http://www.w3.org/1999/xhtml"}
entries = ET.parse(ROOT / "sitemap.xml").findall("s:url", ns)
locs = [e.find("s:loc", ns).text for e in entries]
require(len(locs) == 106, "Unexpected sitemap URL count")
require(len(locs) == len(set(locs)), "Duplicate sitemap URLs")
robots = RobotFileParser()
robots.parse((ROOT / "robots.txt").read_text().splitlines())

for entry, url in zip(entries, locs):
    file = resolve(url)
    require(file in pages, f"Sitemap target missing: {url}")
    if file not in pages:
        continue
    page = pages[file]
    require(page.canonical == [url], f"Sitemap canonical is not self-referencing: {url}")
    require(not any("noindex" in a.get("content", "").lower() for a in page.attrs("meta") if a.get("name", "").lower() == "robots"), f"Sitemap page has noindex: {url}")
    require(not any(a.get("http-equiv", "").lower() == "refresh" for a in page.attrs("meta")), f"Redirect in sitemap: {url}")
    require(robots.can_fetch("Googlebot", url), f"Sitemap URL blocked by robots: {url}")
    language = page.attrs("html")[0]["lang"]
    require(page.alternates.get(language) == url, f"Missing self hreflang: {url}")
    sitemap_alternates = {a.get("hreflang"): a.get("href") for a in entry.findall("x:link", ns)}
    require(sitemap_alternates == page.alternates, f"HTML/sitemap hreflang mismatch: {url}")
    for lang, alternate in page.alternates.items():
        target = resolve(alternate)
        require(target in pages, f"Missing hreflang target: {alternate}")
        if target in pages:
            require(pages[target].alternates.get(language) == url, f"Non-reciprocal hreflang: {url} to {alternate}")
            if lang != "x-default":
                require(pages[target].attrs("html")[0]["lang"] == lang, f"Wrong hreflang language: {alternate}")

internal_links = 0
legacy_download_links = 0
for file, page in pages.items():
    for a in page.attrs("a"):
        href = a.get("href", "")
        target = resolve(href, file)
        if href and target is not None:
            internal_links += 1
            require(target.exists(), f"Broken internal link in {file.relative_to(ROOT)}: {href}")
            require(urlsplit(href).path not in ALIASES, f"Link uses old demo URL in {file.relative_to(ROOT)}: {href}")
        if urlsplit(href).hostname in ("apps.apple.com", "play.google.com"):
            if str(file.relative_to(ROOT)) in ("download/index.html", "en/download/index.html", "es/download/index.html"):
                # Existing same-tab fallback links on noindex redirect pages are
                # outside this migration. Do not rewrite that workflow implicitly.
                legacy_download_links += 1
            else:
                require(a.get("target") == "_blank" and "noopener" in a.get("rel", "").split(), f"Store link attributes: {file.relative_to(ROOT)}")

details = [(file, page) for file, page in pages.items() if re.fullmatch(r"(?:en/|es/)?demo/[^/]+/index.html", str(file.relative_to(ROOT))) and "/" + str(file.relative_to(ROOT)).removesuffix("index.html") not in ALIASES]
require(len(details) == 18, "Expected 18 canonical detailed demos")
for file, page in details:
    label = str(file.relative_to(ROOT))
    canonical = ORIGIN + "/" + label.removesuffix("index.html")
    require(page.canonical == [canonical], f"Wrong demo canonical: {label}")
    require(len(page.attrs("h1")) == 1, f"Demo H1 count: {label}")
    hero = [a for a in page.attrs("a") if a.get("id") == "hero-store-cta"]
    end = [a for a in page.attrs("a") if a.get("id") == "demo-store-cta"]
    require(len(hero) == 1 and len(end) == 1, f"Missing or duplicate demo CTA: {label}")
    for a in hero + end:
        require("data-store-auto" in a, f"Demo CTA lacks automatic store routing: {label}")
        require(urlsplit(a.get("href", "")).hostname in ("apps.apple.com", "play.google.com"), f"Indirect demo store CTA: {label}")
    require(0 <= page.text.find('id="hero-store-cta"') < page.text.find("<audio"), f"Demo hero CTA after audio: {label}")
    require(page.attrs("html")[0].get("data-analytics-variant") == "demo-seo-oct03-v1", f"Missing demo variant: {label}")
    require(any(a.get("src") == "/mobile-store-cta.js" for a in page.attrs("script")), f"Missing mobile CTA script: {label}")
    require(any(a.get("src") == "/umami-store-tracking.js" for a in page.attrs("script")), f"Missing store tracking: {label}")
    for a in page.attrs("a"):
        if "lang-btn" in a.get("class", "").split():
            require(ORIGIN + a["href"] == page.alternates.get(a.get("hreflang")), f"Language selector loses selected demo: {label}")
    audio = page.attrs("audio")
    require(len(audio) == 1 and resolve(audio[0].get("src"), file).is_file(), f"Missing demo audio: {label}")
    graph = [node for script in page.json_scripts for node in script.get("@graph", [])]
    objects = [node for node in graph if node.get("@type") == "AudioObject"]
    require(len(objects) == 1, f"Missing AudioObject: {label}")
    if objects and audio:
        require(objects[0]["url"] == canonical, f"Stale AudioObject URL: {label}")
        require(objects[0]["contentUrl"] == ORIGIN + audio[0]["src"], f"AudioObject media mismatch: {label}")
        require(objects[0]["inLanguage"] == page.attrs("html")[0]["lang"], f"Wrong AudioObject language: {label}")
    breadcrumb = [node for node in graph if node.get("@type") == "BreadcrumbList"]
    require(bool(breadcrumb) and breadcrumb[0]["itemListElement"][-1]["item"] == canonical, f"Stale breadcrumb URL: {label}")

require(len(ALIASES) == 10 and len(set(ALIASES.values())) == 10, "Duplicate redirect mapping")
for source, target in ALIASES.items():
    source_file, target_file = resolve(source), resolve(target)
    require(source_file in pages and target_file in pages, f"Missing redirect route: {source}")
    if source_file not in pages:
        continue
    page = pages[source_file]
    require(page.canonical == [ORIGIN + target], f"Wrong redirect canonical: {source}")
    refresh = [a["content"] for a in page.attrs("meta") if a.get("http-equiv", "").lower() == "refresh"]
    require(refresh == ["0; url=" + ORIGIN + target], f"Wrong instant redirect: {source}")
    require(ORIGIN + source not in locs and ORIGIN + target in locs, f"Wrong migration sitemap entry: {source}")
    require(target not in ALIASES, f"Chained redirect: {source}")
    require(not page.attrs("audio") and not any(a.get("src") for a in page.attrs("script")), f"Redirect should not contain content or analytics: {source}")
    require("window.location.search + window.location.hash" in page.text, f"Redirect drops URL parameters: {source}")

print(json.dumps({"html_pages": len(pages), "sitemap_urls": len(locs), "detailed_demos": len(details), "redirects": len(ALIASES), "internal_links_checked": internal_links, "legacy_download_links_unchanged": legacy_download_links, "errors": ERRORS}, ensure_ascii=False, indent=2))
raise SystemExit(bool(ERRORS))
