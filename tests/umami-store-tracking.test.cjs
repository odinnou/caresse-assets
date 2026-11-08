const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { test } = require('node:test');
const vm = require('node:vm');

const script = readFileSync(resolve(__dirname, '../public/umami-store-tracking.js'), 'utf8');
const iosStore = 'https://apps.apple.com/us/app/caresse/id6758887086';
const androidStore = 'https://play.google.com/store/apps/details?id=studio.mokuton.caresse';
const campaign = '?utm_source=instagram&utm_medium=paid_social&utm_campaign=novembre_2026_fr&utm_content=video_a';
const expectedCampaign = {
    utm_source: 'instagram', utm_medium: 'paid_social',
    utm_campaign: 'novembre_2026_fr', utm_content: 'video_a'
};

function browser({ storageMode, analytics = 'enabled' } = {}) {
    const storage = new Map();
    const events = [];
    let now = Date.parse('2026-11-04T21:00:00Z');
    return {
        storage, events,
        advance(ms) { now += ms; },
        page(path = '/', { referrer = '', locale = 'fr', hostname = 'caresse.app' } = {}) {
            const location = new URL(path, `https://${hostname}`);
            let onClick;
            const umami = analytics === 'missing' ? undefined : {
                track(name, data) {
                    if (analytics === 'throws') throw Error('unavailable');
                    events.push({ name, ...JSON.parse(JSON.stringify(data)) });
                }
            };
            vm.runInNewContext(script, {
                URL, URLSearchParams,
                Date: class extends Date { static now() { return now; } },
                sessionStorage: {
                    getItem(key) {
                        if (storageMode === 'blocked') throw Error('blocked');
                        return storage.get(key) ?? null;
                    },
                    setItem(key, value) {
                        if (storageMode) throw Error('blocked');
                        storage.set(key, value);
                    },
                    removeItem(key) { storage.delete(key); }
                },
                window: { location, umami },
                document: {
                    referrer,
                    documentElement: { lang: locale, dataset: { analyticsVariant: 'test-variant' } },
                    addEventListener(name, handler) { if (name === 'click') onClick = handler; }
                }
            });
            return {
                click(href = iosStore) {
                    const link = {
                        href, dataset: { ctaPosition: 'hero' },
                        closest() { return null; }, classList: { contains() { return false; } }
                    };
                    const event = {
                        target: { closest() { return link; } },
                        preventDefault() { assert.fail('Tracking must not cancel store navigation'); }
                    };
                    if (onClick) onClick(event);
                    assert.equal(link.href, href, 'Tracking must not rewrite links');
                    return events.at(-1);
                }
            };
        }
    };
}

function assertCampaign(event, expected = expectedCampaign) {
    const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
    assert.deepEqual(Object.fromEntries(keys.filter(key => key in event).map(key => [key, event[key]])), expected);
}

test('attributes direct store clicks to the campaign across all four locales', () => {
    for (const [path, locale] of [['/', 'fr'], ['/en/', 'en'], ['/es/', 'es'], ['/pt/', 'pt']]) {
        const b = browser();
        const event = b.page(path + campaign, { locale }).click(locale === 'fr' ? iosStore : androidStore);
        assertCampaign(event);
        assert.equal(event.name, 'store_click');
        assert.equal(event.acquisition_source, 'instagram');
        assert.equal(event.landing_page, path);
        assert.equal(event.locale, locale);
        assert.equal(event.store, locale === 'fr' ? 'app_store' : 'google_play');
        assert.equal(event.cta_position, 'hero');
        assert.equal(event.visit_definition, 'client-30min-v3');
    }
});

test('keeps the campaign, landing page and elapsed time through internal navigation', () => {
    const b = browser();
    b.page('/' + campaign).click('https://caresse.app/for-couples/');
    b.advance(5000);
    const event = b.page('/for-couples/', { referrer: 'https://caresse.app/' }).click();
    assertCampaign(event);
    assert.equal(event.acquisition_source, 'instagram');
    assert.equal(event.landing_page, '/');
    assert.equal(event.elapsed_ms, 5000);
    assert.equal(event.first_link_click, false);
    assert.equal(event.first_store_click, true);
});

test('reloading the same tagged URL preserves timing and first-click counters', () => {
    const b = browser();
    const first = b.page('/' + campaign).click();
    b.advance(1000);
    const second = b.page('/' + campaign).click();
    assertCampaign(second);
    assert.equal(second.client_visit_started_at, first.client_visit_started_at);
    assert.equal(second.elapsed_ms, 1000);
    assert.equal(second.first_store_click, false);
    assert.equal(second.first_link_click, false);
});

test('a tagged arrival replaces an existing direct or organic visit', () => {
    for (const referrer of ['', 'https://www.google.com/search?q=caresse']) {
        const b = browser();
        b.page('/for-couples/', { referrer }).click();
        b.advance(1000);
        const event = b.page('/' + campaign).click();
        assertCampaign(event);
        assert.equal(event.acquisition_source, 'instagram');
        assert.equal(event.landing_page, '/');
        assert.equal(event.elapsed_ms, 0);
        assert.equal(event.first_store_click, true);
        assert.equal(event.first_link_click, true);
    }
});

test('a different creative replaces the complete campaign context', () => {
    const b = browser();
    b.page('/' + campaign + '&utm_term=audience_a').click();
    b.advance(1000);
    const event = b.page('/for-couples/' + campaign.replace('video_a', 'video_b')).click();
    assertCampaign(event, { ...expectedCampaign, utm_content: 'video_b' });
    assert.equal(event.first_store_click, true);
    assert.equal(event.landing_page, '/for-couples/');
    assert.equal(event.elapsed_ms, 0);
});

test('expires a campaign after inactivity on navigation and on an already open page', () => {
    for (const navigate of [false, true]) {
        const b = browser();
        b.page('/' + campaign).click('https://caresse.app/for-couples/');
        let page = b.page('/for-couples/');
        b.advance(30 * 60 * 1000 + 1);
        if (navigate) page = b.page('/for-couples/');
        const event = page.click();
        assertCampaign(event, {});
        assert.equal(event.acquisition_source, 'direct_or_unknown');
        assert.equal(event.landing_page, '/for-couples/');
        assert.equal(event.first_store_click, true);
        assert.equal(event.elapsed_ms, 0);
    }
});

test('tracks the landing campaign when storage is blocked, without blocking navigation', () => {
    for (const storageMode of ['blocked', 'write-blocked']) {
        const b = browser({ storageMode });
        assertCampaign(b.page('/' + campaign).click());
        assertCampaign(b.page('/for-couples/').click(), {});
    }
});

test('recovers from malformed stored attribution using the current campaign', () => {
    const b = browser();
    b.storage.set('caresse_utm', '{broken');
    assertCampaign(b.page('/' + campaign).click());
    assertCampaign(b.page('/for-couples/').click());
});

test('continues older visits which only stored an acquisition source', () => {
    const b = browser();
    b.page('/for-couples/', { referrer: 'https://www.google.com/search?q=caresse' });
    b.storage.delete('caresse_utm');
    const event = b.page('/').click();
    assertCampaign(event, {});
    assert.equal(event.acquisition_source, 'google');
    assert.equal(event.landing_page, '/for-couples/');
});

test('allowlists and bounds campaign values without forwarding arbitrary parameters', () => {
    const b = browser();
    const event = b.page('/?utm_source=' + 'a'.repeat(100) + '&utm_campaign=' + 'b'.repeat(200) +
        '&utm_term=audience_a&utm_medium=%20%20&utm_content=%20video_a%20&fbclid=secret&email=private').click();
    assertCampaign(event, {
        utm_source: 'a'.repeat(64), utm_campaign: 'b'.repeat(128),
        utm_content: 'video_a', utm_term: 'audience_a'
    });
    assert.equal(event.acquisition_source, 'a'.repeat(64));
    assert.equal(JSON.stringify(event).includes('secret'), false);
    assert.equal(JSON.stringify(event).includes('private'), false);
});

test('an explicit UTM source takes precedence over the referrer', () => {
    const b = browser();
    const event = b.page('/' + campaign, { referrer: 'https://chatgpt.com/' }).click();
    assert.equal(event.acquisition_source, 'instagram');
    assertCampaign(event);
    assert.equal(browser().page('/', { referrer: 'https://chatgpt.com/' }).click().acquisition_source, 'chatgpt');
});

test('keeps analytics_test across internal pages and supports explicitly disabling it', () => {
    const b = browser();
    b.page('/' + campaign + '&analytics_test=1');
    assert.equal(b.page('/for-couples/').click().test, true);
    assert.equal(b.page('/for-couples/?analytics_test=0').click().test, false);
});

test('only tracks Caresse stores and never blocks navigation if Umami is unavailable', () => {
    const b = browser();
    const page = b.page('/' + campaign);
    page.click('https://apps.apple.com/us/app/other/id123');
    page.click('https://play.google.com/store/apps/details?id=other.app');
    page.click('https://caresse.app/en/');
    assert.equal(b.events.length, 0);
    for (const analytics of ['missing', 'throws']) {
        const unavailable = browser({ analytics });
        assert.doesNotThrow(() => unavailable.page('/' + campaign).click());
        assert.equal(unavailable.events.length, 0);
    }
});

test('local previews never send production events', () => {
    const b = browser();
    b.page('/' + campaign, { hostname: 'localhost' }).click();
    assert.equal(b.events.length, 0);
    assert.equal(b.storage.size, 0);
});
