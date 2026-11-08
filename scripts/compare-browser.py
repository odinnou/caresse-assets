"""Compare the old site and dist/ in Chromium, serving files through interception.

No production traffic or analytics events leave the browser. External resources
and media playback are blocked identically for both versions.
"""
import json
import mimetypes
import os
from pathlib import Path
import subprocess
import tempfile
from urllib.parse import unquote, urlparse

from PIL import Image, ImageChops
from playwright.sync_api import sync_playwright

ROOT = Path.cwd()
OUT = ROOT / "artifacts/browser"
OUT.mkdir(parents=True, exist_ok=True)
MIGRATION = json.loads((ROOT / "src/data/migration.json").read_text())
PAGES = [json.loads(path.read_text()) for path in sorted((ROOT / "src/content/pages").glob("*.json")) if path.stem in MIGRATION["pilotIds"]]
REF = os.environ.get("BASELINE_REF") or MIGRATION["baseline"]
PROFILES = {
    "desktop": {"viewport": {"width": 1440, "height": 1000}},
    "android": {
        "viewport": {"width": 390, "height": 844},
        "user_agent": "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36",
        "is_mobile": True, "has_touch": True,
    },
}
INIT = """() => {
  let seed = 1234;
  Math.random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  window.__events = [];
  window.umami = { track: (name, data) => window.__events.push({name, ...data}) };
}"""


def local_files(directory):
    def handle(route):
        request = route.request
        url = urlparse(request.url)
        if url.hostname != "caresse.app" or request.resource_type == "media":
            route.abort()
            return
        relative = unquote(url.path).lstrip("/")
        if not relative or relative.endswith("/"):
            relative += "index.html"
        target = (directory / relative).resolve()
        if not target.is_relative_to(directory.resolve()) or not target.is_file():
            route.fulfill(status=404, body="Not found")
            return
        content_type = mimetypes.guess_type(target.name)[0] or "application/octet-stream"
        route.fulfill(path=str(target), content_type=content_type)
    return handle


def context(browser, directory, profile):
    ctx = browser.new_context(**profile, reduced_motion="reduce", service_workers="block")
    ctx.add_init_script(script=f"({INIT})()")
    ctx.route("**/*", local_files(directory))
    return ctx


def capture(browser, directory, profile, path, name):
    with context(browser, directory, profile) as ctx:
        page = ctx.new_page()
        errors = []
        page.on("pageerror", lambda error: errors.append(str(error)))
        response = page.goto("https://caresse.app" + path, wait_until="networkidle")
        assert response.status == 200, path
        page.evaluate("document.fonts.ready")
        page.add_style_tag(content="*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}")
        page.screenshot(path=str(OUT / (name + ".png")), full_page=True, animations="disabled")
        state = page.evaluate("""() => ({
            headings: [...document.querySelectorAll('h1,h2,h3')].map(e => [e.tagName, e.textContent.trim()]),
            links: [...document.querySelectorAll('a')].map(e => [e.href, e.textContent.trim(), e.target, e.rel]),
            images: [...document.images].map(e => [e.getAttribute('src'), e.alt, e.complete && e.naturalWidth > 0]),
            language: document.documentElement.lang,
            canonical: document.querySelector('link[rel=canonical]')?.href
        })""")
        state["accessibility"] = page.locator("body").aria_snapshot()
        return state, errors


def attribution(browser, directory, profile, locale):
    home = next(page for page in PAGES if page["family"] == "home" and page["locale"] == locale)
    couples = next(page for page in PAGES if page["family"] == "couples" and page["locale"] == locale)
    with context(browser, directory, profile) as ctx:
        page = ctx.new_page()
        page.goto("https://caresse.app" + home["path"] + "?utm_source=instagram&utm_campaign=astro_parity&analytics_test=1", wait_until="networkidle")
        page.goto("https://caresse.app" + couples["path"], wait_until="networkidle")
        page.locator("#hero-cta").evaluate("element => element.click()")
        events = page.evaluate("window.__events")
        event = next(event for event in reversed(events) if event["name"] == "store_click")
        assert event["utm_source"] == "instagram" and event["utm_campaign"] == "astro_parity", event
        assert event["landing_page"] == home["path"] and event["locale"] == locale and event["test"], event
        expected = "google_play" if profile.get("is_mobile") else "app_store"
        assert event["store"] == expected, event
        return {key: event[key] for key in ["store", "locale", "utm_source", "utm_campaign", "landing_page", "test"]}


def main():
    report = {"baseline": REF, "conditions": "Chromium; identical blocked external resources/media; deterministic animations; 1440px desktop / 390px Android", "pages": [], "attribution": [], "errors": []}
    with tempfile.TemporaryDirectory(prefix="caresse-baseline-") as temporary:
        before = Path(os.environ.get("BASELINE_DIR", temporary))
        if "BASELINE_DIR" not in os.environ:
            archive = subprocess.Popen(["git", "archive", REF], stdout=subprocess.PIPE)
            subprocess.run(["tar", "-x", "-C", str(before)], stdin=archive.stdout, check=True)
            archive.stdout.close()
            assert archive.wait() == 0
        with sync_playwright() as playwright:
            options = {"headless": True}
            if os.environ.get("CHROMIUM_EXECUTABLE"):
                options["executable_path"] = os.environ["CHROMIUM_EXECUTABLE"]
            browser = playwright.chromium.launch(**options)
            for profile_name, profile in PROFILES.items():
                for item in PAGES:
                    name = item["id"] + "." + profile_name
                    try:
                        old, old_errors = capture(browser, before, profile, item["path"], name + ".before")
                        new, new_errors = capture(browser, ROOT / "dist", profile, item["path"], name + ".after")
                        assert new == old, f"DOM, links, assets or accessibility snapshot differ: {name}"
                        assert new_errors == old_errors, f"New browser errors: {new_errors} / baseline {old_errors}"
                        with Image.open(OUT / (name + ".before.png")) as old_image, Image.open(OUT / (name + ".after.png")) as new_image:
                            assert old_image.size == new_image.size, f"Screenshot dimensions differ: {name}"
                            diff = ImageChops.difference(old_image.convert("RGB"), new_image.convert("RGB"))
                            changed = diff.getbbox()
                            if changed:
                                diff.save(OUT / (name + ".diff.png"))
                            assert changed is None, f"Pixel difference: {name}, rectangle {changed}"
                        report["pages"].append({"page": item["path"], "profile": profile_name, "pixelDifference": 0, "baselineBrowserErrors": old_errors})
                    except Exception as error:
                        report["errors"].append({"page": item["path"], "profile": profile_name, "error": str(error)})
                for locale in ["fr", "en", "es", "pt"]:
                    try:
                        old = attribution(browser, before, profile, locale)
                        new = attribution(browser, ROOT / "dist", profile, locale)
                        assert old == new
                        report["attribution"].append({"profile": profile_name, **new})
                    except Exception as error:
                        report["errors"].append({"locale": locale, "profile": profile_name, "error": "Attribution: " + str(error)})
            browser.close()
    (OUT / "report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"pagesPassed": len(report["pages"]), "attributionPassed": len(report["attribution"]), "errors": report["errors"]}, ensure_ascii=False, indent=2))
    if report["errors"]:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
