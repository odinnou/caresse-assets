"""Check the generated German site without contacting analytics or real stores."""

import functools
import http.server
import json
import os
from pathlib import Path
import shutil
import threading

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
ARTIFACTS = ROOT / "artifacts/german"
SCREENSHOT_FAMILIES = {
    "home", "couples", "comparison", "article", "demo-couple-romantique",
    "legal-privacy", "support", "noel-en-couple",
}
ANDROID_AGENT = (
    "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 "
    "Chrome/130.0 Mobile Safari/537.36"
)
PROFILES = [
    ("desktop", {"width": 1440, "height": 1000}, {}),
    ("android", {"width": 360, "height": 800}, {
        "user_agent": ANDROID_AGENT, "is_mobile": True, "has_touch": True,
    }),
]
LANGUAGE_JOURNEYS = [
    ("/en/for-couples/", "/de/fuer-paare/"),
    ("/es/for-couples/", "/de/fuer-paare/"),
    ("/pt/para-casais/", "/de/fuer-paare/"),
    ("/for-couples/", "/de/fuer-paare/"),
    ("/en/support/", "/de/support/"),
    ("/en/valentines-day-at-home/", "/de/valentinstag-zu-hause/"),
]


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass


def check_page(tab, base, data, profile, width, errors):
    path = data["path"]
    errors.clear()
    tab.goto(base + path, wait_until="networkidle")
    if data["family"] == "download" and profile == "android":
        assert tab.url.startswith("https://play.google.com/"), tab.url
        return {"page": path, "profile": profile, "store_redirect": "google_play"}

    assert tab.locator("html").get_attribute("lang") == "de", path
    assert tab.locator("h1").count() == 1, path
    assert tab.locator('a[hreflang="de"][aria-current="page"]').count() == 1, path
    assert not tab.evaluate("document.documentElement.scrollWidth > innerWidth"), (
        path, profile, "horizontal overflow"
    )
    assert not errors, (path, profile, errors)
    expected_store = "play.google.com" if profile == "android" else "apps.apple.com"
    for link in tab.locator("a[data-store-auto]").all():
        target = link.get_attribute("href")
        assert target.startswith(f"https://{expected_store}/"), (path, target)

    # All language segments must fit in the narrow viewport.
    for link in tab.locator("header a[hreflang]").all():
        box = link.bounding_box()
        assert box and box["x"] >= 0 and box["x"] + box["width"] <= width + 1, (
            path, profile, box
        )
    if data["family"] in SCREENSHOT_FAMILIES:
        # A full-page screenshot alone does not load images below the fold.
        tab.locator("img").evaluate_all("""async images => {
            await Promise.all(images.map(async image => {
                image.loading = 'eager';
                await image.decode();
            }));
        }""")
        tab.screenshot(
            path=str(ARTIFACTS / f'{data["family"]}-{profile}.png'), full_page=True
        )
    return {"page": path, "profile": profile, "ok": True}


def main():
    ARTIFACTS.mkdir(parents=True, exist_ok=True)
    pages = sorted(
        (json.loads(file.read_text()) for file in (ROOT / "src/content/pages").glob("*.de.json")),
        key=lambda page: page["path"],
    )
    handler = functools.partial(QuietHandler, directory=str(ROOT / "dist"))
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{server.server_port}"
    results = []

    def intercept(route):
        if route.request.url.startswith(base + "/"):
            return route.continue_()
        if route.request.url.startswith(("https://apps.apple.com/", "https://play.google.com/")):
            return route.fulfill(
                status=200, content_type="text/plain", body="Store destination intercepted"
            )
        return route.abort()

    try:
        with sync_playwright() as playwright:
            executable = os.environ.get("CHROMIUM_EXECUTABLE") or shutil.which("chromium")
            browser = playwright.chromium.launch(
                **({"executable_path": executable} if executable else {}),
                args=["--no-sandbox"],
            )
            for profile, viewport, settings in PROFILES:
                context = browser.new_context(viewport=viewport, **settings)
                context.route("**/*", intercept)
                tab = context.new_page()
                errors = []
                tab.on("pageerror", lambda error: errors.append(str(error)))
                for page in pages:
                    results.append(check_page(
                        tab, base, page, profile, viewport["width"], errors
                    ))

                # Resolve real translation paths rather than constructing English slugs.
                for source, target in LANGUAGE_JOURNEYS:
                    tab.goto(base + source, wait_until="networkidle")
                    tab.locator('header a[hreflang="de"]').click()
                    assert tab.url == base + target, (source, tab.url)
                tab.goto(base + "/de/fuer-paare/", wait_until="networkidle")
                tab.locator('header a[hreflang="pt"]').click()
                assert tab.url == base + "/pt/para-casais/", tab.url

                if profile == "android":
                    tab.goto(base + "/de/fuer-paare/", wait_until="networkidle")
                    tab.evaluate("scrollTo(0, document.body.scrollHeight / 2)")
                    tab.wait_for_timeout(400)
                    sticky = tab.locator(".mobile-store-cta a")
                    assert sticky.count() == 1
                    assert sticky.get_attribute("href").startswith("https://play.google.com/")
                context.close()
            browser.close()
    finally:
        server.shutdown()
        server.server_close()

    (ARTIFACTS / "browser-report.json").write_text(json.dumps(results, indent=2) + "\n")
    print("German browser checks passed for desktop and Android: "
          "content, language switching, layout and store routing.")


if __name__ == "__main__":
    main()
