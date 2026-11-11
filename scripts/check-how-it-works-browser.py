"""Check screenshot proportions, step layout and store links without external requests."""

import json
import mimetypes
import os
from pathlib import Path
import shutil
from urllib.parse import parse_qs, unquote, urlparse

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]
DIST = (ROOT / "dist").resolve()
ARTIFACTS = ROOT / "artifacts/how-it-works"
PROFILES = [
    ("desktop", {"viewport": {"width": 1440, "height": 1000}}),
    ("above-breakpoint", {"viewport": {"width": 641, "height": 960}}),
    ("at-breakpoint", {"viewport": {"width": 640, "height": 960}}),
    ("iphone", {
        "viewport": {"width": 390, "height": 844},
        "is_mobile": True, "has_touch": True,
        "user_agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1",
    }),
    ("android", {
        "viewport": {"width": 360, "height": 800},
        "is_mobile": True, "has_touch": True,
        "user_agent": "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/130.0 Mobile Safari/537.36",
    }),
]


def intercept(route):
    url = urlparse(route.request.url)
    if url.hostname == "caresse.app":
        path = (DIST / unquote(url.path).lstrip("/")).resolve()
        if not path.is_relative_to(DIST):
            return route.abort()
        if url.path.endswith("/"):
            path = path / "index.html"
        if path.is_file():
            return route.fulfill(
                path=str(path),
                content_type=mimetypes.guess_type(str(path))[0] or "application/octet-stream",
            )
        return route.fulfill(status=404, body="Missing local build resource")
    if url.hostname in ["apps.apple.com", "play.google.com"]:
        return route.fulfill(status=200, content_type="text/plain", body="Store intercepted locally")
    return route.abort()


def check_steps(tab, path, width):
    cards = tab.locator(".step-detail-card")
    assert cards.count() == 4, (path, "missing steps")
    for card in cards.all():
        image = card.locator("img")
        assert image.count() == 1, path
        image.evaluate("async image => { image.loading = 'eager'; await image.decode(); }")
        geometry = image.evaluate("""image => {
            const rect = image.getBoundingClientRect();
            return { width: rect.width, height: rect.height,
                naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight };
        }""")
        assert geometry["naturalWidth"] > 0 and geometry["naturalHeight"] > 0, (path, geometry)
        expected_height = geometry["width"] * geometry["naturalHeight"] / geometry["naturalWidth"]
        assert abs(geometry["height"] - expected_height) <= 1, (path, "stretched screenshot", geometry)
        assert 0 < geometry["width"] <= (200 if width <= 640 else 140) + 1, (path, geometry)
        image_box = image.bounding_box()
        text_box = card.locator(":scope > div").bounding_box()
        assert image_box and text_box, path
        if width <= 640:
            assert text_box["y"] >= image_box["y"] + image_box["height"], (path, "mobile text must follow image")
        else:
            assert text_box["x"] >= image_box["x"] + image_box["width"], (path, "text must sit beside image")


def main():
    routes = json.loads((ROOT / "src/data/routes.json").read_text())["how-it-works"]
    ARTIFACTS.mkdir(parents=True, exist_ok=True)
    checked = 0
    with sync_playwright() as playwright:
        executable = os.environ.get("CHROMIUM_EXECUTABLE") or shutil.which("chromium")
        browser = playwright.chromium.launch(
            **({"executable_path": executable} if executable else {}), args=["--no-sandbox"],
        )
        for profile, settings in PROFILES:
            context = browser.new_context(service_workers="block", **settings)
            context.route("**/*", intercept)
            tab = context.new_page()
            errors = []
            tab.on("pageerror", lambda error: errors.append(str(error)))
            for locale in ["fr", "en", "es", "pt", "de"]:
                path = routes[locale]["path"]
                errors.clear()
                tab.goto("https://caresse.app" + path, wait_until="networkidle")
                assert tab.locator("html").get_attribute("lang") == locale, path
                assert tab.locator("h1").count() == 1, path
                check_steps(tab, path, settings["viewport"]["width"])
                assert not tab.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth"), (path, "overflow")
                assert not errors, (path, errors)
                store = "play.google.com" if profile == "android" else "apps.apple.com"
                for link in tab.locator("a.cta-pink").all():
                    assert urlparse(link.get_attribute("href")).hostname == store, (path, profile)
                with context.expect_page() as opened:
                    tab.locator("#hero-cta").click()
                popup = opened.value
                popup.wait_for_url("https://" + store + "/**")
                destination = urlparse(popup.url)
                if profile == "android":
                    assert parse_qs(destination.query).get("id") == ["studio.mokuton.caresse"], popup.url
                else:
                    assert "id6758887086" in destination.path, popup.url
                popup.close()
                if locale == "fr" and profile in ["desktop", "android"]:
                    tab.locator(".step-detail-card").first.screenshot(path=str(ARTIFACTS / f"step-{profile}.png"))
                checked += 1
            context.close()
        browser.close()
    print(f"How it works: {checked} page/profile checks passed; screenshot proportions, responsive steps and store links verified locally.")


if __name__ == "__main__":
    main()
