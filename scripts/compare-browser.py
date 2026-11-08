"""Compare the old site and dist/ in Chromium, serving files through interception.

No production traffic or analytics events leave the browser. External resources
and media playback are blocked identically for both versions.
"""
import json
from concurrent.futures import ProcessPoolExecutor
import mimetypes
import os
from pathlib import Path
import subprocess
import tempfile
from datetime import datetime, timedelta, timezone
from urllib.parse import unquote, urlparse

from PIL import Image, ImageChops
from playwright.sync_api import sync_playwright

ROOT = Path.cwd()
OUT = ROOT / "artifacts/browser"
OUT.mkdir(parents=True, exist_ok=True)
MIGRATION = json.loads((ROOT / "src/data/migration.json").read_text())
COMPARISON_IDS = MIGRATION.get("comparisonIds", MIGRATION["pilotIds"])
PAGES = [json.loads(path.read_text()) for path in sorted((ROOT / "src/content/pages").glob("*.json")) if path.stem in COMPARISON_IDS]
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
        if url.hostname in {"apps.apple.com", "play.google.com"} and request.is_navigation_request():
            # Exercise automatic download routing without contacting a store.
            route.fulfill(status=200, content_type="text/html", body="<!doctype html><title>Store destination intercepted</title><p>Store destination intercepted</p>")
            return
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
        frozen_time = datetime(2026, 11, 8, tzinfo=timezone.utc)
        # Start before the pause target so setup under load cannot make it past.
        # No site document or timer has loaded at this point.
        page.clock.install(time=frozen_time - timedelta(minutes=1))
        page.clock.pause_at(frozen_time)
        errors = []
        page.on("pageerror", lambda error: errors.append(str(error)))
        response = page.goto("https://caresse.app" + path, wait_until="networkidle")
        assert response.status == 200, path
        page.evaluate("document.fonts.ready")
        page.evaluate("""async () => {
            for (const image of document.images) image.loading = 'eager';
            await Promise.all([...document.images].map(image => image.decode().catch(() => {})));
            for (const svg of document.querySelectorAll('svg')) {
                svg.pauseAnimations?.();
                svg.setCurrentTime?.(0);
            }
        }""")
        page.add_style_tag(content="*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}")
        page.screenshot(path=str(OUT / (name + ".png")), full_page=True, animations="disabled")
        state = page.evaluate("""() => ({
            headings: [...document.querySelectorAll('h1,h2,h3')].map(e => [e.tagName, e.textContent.replace(/\\s+/g, ' ').trim()]),
            links: [...document.querySelectorAll('a')].map(e => [e.href, e.textContent.replace(/\\s+/g, ' ').trim(), e.target, e.rel]),
            images: [...document.images].map(e => [e.getAttribute('src'), e.alt, e.complete && e.naturalWidth > 0]),
            language: document.documentElement.lang,
            url: location.href,
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


def chromium_options():
    # Apply the same raster settings to both versions; pixel equality is strict.
    options = {"headless": True, "args": [
        "--num-raster-threads=1", "--disable-partial-raster",
        "--disable-skia-runtime-opts", "--run-all-compositor-stages-before-draw",
    ]}
    if os.environ.get("CHROMIUM_EXECUTABLE"):
        options["executable_path"] = os.environ["CHROMIUM_EXECUTABLE"]
    return options


def compare_group(task):
    worker, before_path, items = task
    before = Path(before_path)
    result = {"pages": [], "errors": []}
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(**chromium_options())
        for item, profile_name in items:
            profile = PROFILES[profile_name]
            name = item["id"] + "." + profile_name
            try:
                old, old_errors = capture(browser, before, profile, item["path"], name + ".before")
                new, new_errors = capture(browser, ROOT / "dist", profile, item["path"], name + ".after")
                differing = [key for key in old if old[key] != new[key]]
                if differing:
                    (OUT / (name + '.state-diff.json')).write_text(json.dumps({key: {'before': old[key], 'after': new[key]} for key in differing}, ensure_ascii=False, indent=2))
                assert not differing, f"DOM, links, assets or accessibility snapshot differ: {name} ({', '.join(differing)})"
                assert new_errors == old_errors, f"New browser errors: {new_errors} / baseline {old_errors}"
                with Image.open(OUT / (name + ".before.png")) as old_image, Image.open(OUT / (name + ".after.png")) as new_image:
                    assert old_image.size == new_image.size, f"Screenshot dimensions differ: {name}"
                    diff = ImageChops.difference(old_image.convert("RGB"), new_image.convert("RGB"))
                    changed = diff.getbbox()
                    if changed:
                        diff.save(OUT / (name + ".diff.png"))
                    assert changed is None, f"Pixel difference: {name}, rectangle {changed}"
                result["pages"].append({"page": item["path"], "profile": profile_name, "pixelDifference": 0, "destination": new["url"], "baselineBrowserErrors": old_errors})
            except Exception as error:
                result["errors"].append({"page": item["path"], "profile": profile_name, "error": str(error)})
            (OUT / f"worker-{worker}.json").write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n")
        browser.close()
    return result


def redirect_state(browser, directory, profile, item):
    with context(browser, directory, profile) as ctx:
        page = ctx.new_page()
        page.goto("https://caresse.app" + item["path"] + "?utm_source=instagram&utm_campaign=astro_redirect&analytics_test=1#sample", wait_until="networkidle")
        return {"url": page.url, "context": page.evaluate("sessionStorage.getItem('caresse_redirect_context')") if urlparse(page.url).hostname == "caresse.app" else None}


def main():
    workers = max(1, min(4, int(os.environ.get("BROWSER_WORKERS", "4"))))
    report = {"baseline": REF, "conditions": "Chromium; identical blocked external resources/media; store navigation intercepted; deterministic animations; strict pixels; 1440px desktop / 390px Android", "workers": workers, "pages": [], "attribution": [], "redirects": [], "errors": []}
    with tempfile.TemporaryDirectory(prefix="caresse-baseline-") as temporary:
        before = Path(os.environ.get("BASELINE_DIR", temporary))
        if "BASELINE_DIR" not in os.environ:
            archive = subprocess.Popen(["git", "archive", REF], stdout=subprocess.PIPE)
            subprocess.run(["tar", "-x", "-C", str(before)], stdin=archive.stdout, check=True)
            archive.stdout.close()
            assert archive.wait() == 0
        items = [(item, profile_name) for profile_name in PROFILES for item in PAGES]
        tasks = [(worker, str(before), items[worker::workers]) for worker in range(workers)]
        with ProcessPoolExecutor(max_workers=workers) as pool:
            for result in pool.map(compare_group, tasks):
                report["pages"].extend(result["pages"])
                report["errors"].extend(result["errors"])
                print(f"Compared {len(report['pages']) + len(report['errors'])}/{len(items)} pages/profiles", flush=True)
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(**chromium_options())
            for profile_name, profile in PROFILES.items():
                for locale in ["fr", "en", "es", "pt"]:
                    try:
                        old = attribution(browser, before, profile, locale)
                        new = attribution(browser, ROOT / "dist", profile, locale)
                        assert old == new
                        report["attribution"].append({"profile": profile_name, **new})
                    except Exception as error:
                        report["errors"].append({"locale": locale, "profile": profile_name, "error": "Attribution: " + str(error)})
                for item in [page for page in PAGES if page.get("kind") == "redirect" or page["family"] == "download"]:
                    try:
                        old = redirect_state(browser, before, profile, item)
                        new = redirect_state(browser, ROOT / "dist", profile, item)
                        # creation timestamps legitimately differ between visits.
                        for state in [old, new]:
                            if state["context"]:
                                state["context"] = json.loads(state["context"])
                                state["context"].pop("created_at", None)
                        assert old == new, f"Redirect differs: {old} / {new}"
                        if item.get("kind") == "redirect":
                            assert "utm_campaign=astro_redirect" in new["url"] and new["url"].endswith("#sample"), new
                        report["redirects"].append({"page": item["path"], "profile": profile_name, **new})
                    except Exception as error:
                        report["errors"].append({"page": item["path"], "profile": profile_name, "error": "Redirect: " + str(error)})
            browser.close()
    assert len(report["pages"]) + sum("page" in error and not error["error"].startswith("Redirect:") for error in report["errors"]) == len(PAGES) * len(PROFILES), "Incomplete visual coverage"
    (OUT / "report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"pagesPassed": len(report["pages"]), "attributionPassed": len(report["attribution"]), "redirectsPassed": len(report["redirects"]), "errors": report["errors"]}, ensure_ascii=False, indent=2))
    if report["errors"]:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
