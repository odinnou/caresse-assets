// Run with: node tests/demo-migration.test.mjs (no third-party dependencies).
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const mobileCode = await fs.readFile(new URL('mobile-store-cta.js', root), 'utf8');
const trackingCode = await fs.readFile(new URL('umami-store-tracking.js', root), 'utf8');
const redirects = JSON.parse(await fs.readFile(new URL('tests/fixtures/demo-redirects.json', root), 'utf8'));
const apple = 'https://apps.apple.com/us/app/caresse/id6758887086';
const play = 'https://play.google.com/store/apps/details?id=studio.mokuton.caresse';
let scenarios = 0;

function storage(seed = {}, fails = false) {
    const values = new Map(Object.entries(seed));
    return {
        getItem(key) { if (fails) throw new Error('Storage unavailable'); return values.get(key) ?? null; },
        setItem(key, value) { if (fails) throw new Error('Storage unavailable'); values.set(key, String(value)); },
        removeItem(key) { if (fails) throw new Error('Storage unavailable'); values.delete(key); },
    };
}

function element(tag, attrs = {}, text = '') {
    const classes = new Set((attrs.class || '').split(/\s+/).filter(Boolean));
    const value = {
        tag, attrs: {...attrs}, id: attrs.id || '', href: attrs.href || '',
        target: attrs.target || '', rel: attrs.rel || '', textContent: text,
        dataset: Object.fromEntries(Object.entries(attrs).filter(([k]) => k.startsWith('data-')).map(([k, v]) => [k.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase()), v])),
        children: [], listeners: {},
        setAttribute(key, val) { this.attrs[key] = val; },
        hasAttribute(key) { return Object.hasOwn(this.attrs, key); },
        appendChild(child) { this.children.push(child); child.parent = this; },
        addEventListener(event, callback) { this.listeners[event] = callback; },
        classList: {contains(c) {return classes.has(c);}, add(c) {classes.add(c);}, toggle(c, on) {if (on) classes.add(c); else classes.delete(c);}},
        closest(selector) {
            if (selector === 'a[href]') return tag === 'a' ? this : null;
            if (selector === '.mobile-store-cta') return this.parent?.className === 'mobile-store-cta' ? this.parent : null;
            return null;
        },
    };
    return value;
}

function setupMobile({ua = 'Android', platform = '', touch = 0, mobile = true, auto = true, observer = true, extra = [], initialLinks, inlineCode = []} = {}) {
    const hero = initialLinks?.find(a => a.id === 'hero-store-cta') || element('a', {id: 'hero-store-cta', href: apple, ...(auto ? {'data-store-auto': ''} : {})}, 'Download');
    const end = initialLinks?.find(a => a.id === 'demo-store-cta') || element('a', {id: 'demo-store-cta', href: apple, ...(auto ? {'data-store-auto': ''} : {})}, 'Continue');
    const footer = element('footer');
    const body = element('body');
    const links = [hero, end, ...extra];
    const observations = [];
    const viewport = {matches: mobile, addEventListener(_event, callback) {this.callback = callback;}};
    const doc = {
        documentElement: element('html'), head: element('head'), body,
        createElement: tag => element(tag),
        getElementById(id) {return links.find(a => a.id === id) || null;},
        querySelector(selector) {return selector === 'footer' ? footer : hero;},
        querySelectorAll(selector) {
            if (selector === 'a[data-store-auto]') return links.filter(a => a.hasAttribute('data-store-auto'));
            if (selector === 'a[href]') return [...links, ...body.children.flatMap(c => c.children)];
            throw new Error('Unexpected selector: ' + selector);
        },
    };
    const sandbox = {
        document: doc, navigator: {userAgent: ua, platform, maxTouchPoints: touch},
        window: {matchMedia: () => viewport},
        ...(observer ? {IntersectionObserver: class {
            constructor(callback) {this.callback = callback; this.targets = []; observations.push(this);}
            observe(target) {this.targets.push(target);}
        }} : {}),
    };
    for (const code of inlineCode) vm.runInNewContext(code, sandbox);
    vm.runInNewContext(mobileCode, sandbox);
    const sticky = body.children[0];
    function intersect(entries) {
        for (const obs of observations) {
            const matched = entries.filter(e => obs.targets.includes(e.target));
            if (matched.length) obs.callback(matched);
        }
    }
    return {hero, end, footer, doc, viewport, observations, sticky, intersect};
}

for (const config of [
    {ua: 'Android', expected: play},
    {ua: 'iPhone', expected: apple},
    {ua: 'iPad', expected: apple},
    {ua: 'Macintosh', platform: 'MacIntel', touch: 5, expected: apple},
]) {
    const state = setupMobile(config);
    assert.equal(state.hero.href, config.expected);
    assert.equal(state.end.href, config.expected);
    assert.equal(state.sticky.children[0].href, config.expected);
    assert(state.doc.documentElement.classList.contains('store-platform-known'));
    scenarios++;
}

{
    const s = setupMobile();
    const link = s.sticky.children[0];
    assert.equal(link.tabIndex, -1);
    s.intersect([{target: s.hero, isIntersecting: true}, {target: s.end, isIntersecting: false}]);
    assert(!s.sticky.classList.contains('is-visible'));
    s.intersect([{target: s.hero, isIntersecting: false}]);
    assert(s.sticky.classList.contains('is-visible'));
    assert.equal(link.tabIndex, 0);
    assert.equal(s.sticky.attrs['aria-hidden'], 'false');
    // The generic footer is deliberately not observed: keep the store CTA visible.
    assert(s.observations.every(o => !o.targets.includes(s.footer)));
    s.intersect([{target: s.footer, isIntersecting: true}]);
    assert(s.sticky.classList.contains('is-visible'));
    s.intersect([{target: s.end, isIntersecting: true}]);
    assert(!s.sticky.classList.contains('is-visible'));
    assert.equal(link.tabIndex, -1);
    s.intersect([{target: s.end, isIntersecting: false}]);
    assert(s.sticky.classList.contains('is-visible'));
    s.viewport.matches = false;
    s.viewport.callback();
    assert(!s.sticky.classList.contains('is-visible'));
    s.viewport.matches = true;
    s.viewport.callback();
    assert(s.sticky.classList.contains('is-visible'));
    scenarios += 8;
}

{
    const badgeA = element('a', {href: apple});
    const badgeB = element('a', {href: play});
    const editorial = element('a', {href: '/en/demo/'});
    const s = setupMobile({extra: [badgeA, badgeB, editorial]});
    assert(s.observations[0].targets.includes(badgeA));
    assert(s.observations[0].targets.includes(badgeB));
    assert(!s.observations[0].targets.includes(editorial));
    s.intersect([{target: s.hero, isIntersecting: false}, {target: badgeA, isIntersecting: true}, {target: badgeB, isIntersecting: true}]);
    assert(!s.sticky.classList.contains('is-visible'));
    s.intersect([{target: badgeA, isIntersecting: false}]);
    assert(!s.sticky.classList.contains('is-visible'));
    s.intersect([{target: badgeB, isIntersecting: false}]);
    assert(s.sticky.classList.contains('is-visible'));
    scenarios += 3;
}

assert.equal(setupMobile({observer: false}).hero.href, play);
assert.equal(setupMobile({ua: 'Desktop browser', mobile: false}).sticky, undefined);
assert.equal(setupMobile({ua: 'Desktop browser', auto: false, mobile: false}).sticky.attrs['aria-hidden'], 'true');
scenarios += 3;

const sitemap = await fs.readFile(new URL('sitemap.xml', root), 'utf8');
const demoPaths = [...sitemap.matchAll(/<loc>https:\/\/caresse\.app(\/(?:en\/|es\/)?demo\/[^/]+\/)<\/loc>/g)].map(m => m[1]);
assert.equal(demoPaths.length, 18);
for (const route of demoPaths) {
    const html = await fs.readFile(new URL(route.slice(1) + 'index.html', root), 'utf8');
    const inlineCode = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
    for (const config of [
        {ua: 'Android', expected: play},
        {ua: 'iPhone', expected: apple},
        {ua: 'iPad', expected: apple},
        {ua: 'Macintosh', platform: 'MacIntel', touch: 5, expected: apple},
    ]) {
        const initialLinks = [...html.matchAll(/<a\s+([^>]+)>([^<]*)<\/a>/g)].map(m => {
            const attrs = Object.fromEntries([...m[1].matchAll(/([^\s=]+)(?:="([^"]*)")?/g)].map(a => [a[1], a[2] || '']));
            return element('a', attrs, m[2]);
        }).filter(a => ['hero-store-cta', 'demo-store-cta'].includes(a.id));
        const s = setupMobile({...config, initialLinks, inlineCode});
        assert.equal(s.hero.href, config.expected, route + ': hero');
        assert.equal(s.end.href, config.expected, route + ': end');
        assert.equal(s.sticky.children[0].href, config.expected, route + ': sticky');
        scenarios++;
    }
}

function setupTracking({pathname = '/en/demo/romantic-couple/', search = '', referrer = '', seed = {}, hostname = 'caresse.app', fails = false} = {}) {
    const session = storage(seed, fails);
    const events = [];
    const listeners = {};
    const location = {hostname, pathname, search, href: `https://${hostname}${pathname}${search}`};
    const doc = {
        referrer, documentElement: {lang: 'en', dataset: {analyticsVariant: 'demo-seo-oct03-v1'}},
        addEventListener(name, callback) {listeners[name] = callback;},
    };
    const sandbox = {window: {location, umami: {track(name, props) {events.push({name, props});}}}, document: doc,
        sessionStorage: session, URL, URLSearchParams, Date};
    vm.runInNewContext(trackingCode, sandbox);
    function click(href = apple) {
        const a = element('a', {href, id: 'hero-store-cta', 'data-cta-position': 'hero'}, 'Download');
        listeners.click?.({target: a});
    }
    return {events, session, click};
}

for (const route of redirects) {
    const text = await fs.readFile(new URL(route.from.slice(1) + 'index.html', root), 'utf8');
    const code = text.match(/<script>([\s\S]*?)<\/script>/)[1];
    for (const fails of [false, true]) {
        let destination;
        const session = storage({}, fails);
        const meta = element('meta');
        const sandbox = {
            sessionStorage: session, Date,
            document: {referrer: 'https://www.google.com/', querySelector() {return meta;}},
            window: {location: {pathname: route.from, search: '?utm_source=chatgpt.com&analytics_test=1', hash: '#listen', replace(url) {destination = url;}}},
        };
        vm.runInNewContext(code, sandbox);
        assert.equal(destination, 'https://caresse.app' + route.to + '?utm_source=chatgpt.com&analytics_test=1#listen');
        assert.equal(meta.attrs.content, '0; url=' + destination);
        if (!fails) assert.equal(JSON.parse(session.getItem('caresse_redirect_context')).target_path, route.to);
        scenarios++;
    }
}

{
    const s = setupTracking({referrer: 'https://caresse.app/en/demo/couple-romantique/', seed: {
        caresse_redirect_context: JSON.stringify({target_path: '/en/demo/romantic-couple/', referrer: 'https://www.google.com/search?q=audio', created_at: Date.now()}),
    }});
    s.click(); s.click(play);
    assert.equal(s.events.length, 2);
    assert.equal(s.events[0].props.acquisition_source, 'google');
    assert.equal(s.events[0].props.first_store_click, true);
    assert.equal(s.events[1].props.first_store_click, false);
    assert.equal(s.session.getItem('caresse_redirect_context'), null);
    scenarios++;
}

for (const context of [
    {target_path: '/wrong/', referrer: 'https://www.google.com/', created_at: Date.now()},
    {target_path: '/en/demo/romantic-couple/', referrer: 'https://www.google.com/', created_at: Date.now() - 60000},
    {target_path: '/en/demo/romantic-couple/', referrer: 'https://www.google.com/', created_at: Date.now() + 60000},
    {target_path: '/en/demo/romantic-couple/', referrer: null, created_at: Date.now()},
]) {
    const s = setupTracking({seed: {caresse_redirect_context: JSON.stringify(context)}});
    s.click();
    assert.equal(s.events[0].props.acquisition_source, 'direct_or_unknown');
    scenarios++;
}

for (const seed of [{caresse_redirect_context: 'not-json'}, {caresse_redirect_context: 'null'}]) {
    const s = setupTracking({seed, referrer: 'https://chatgpt.com/'});
    s.click();
    assert.equal(s.events[0].props.acquisition_source, 'chatgpt');
    scenarios++;
}

{
    const s = setupTracking({search: '?utm_source=chatgpt.com&analytics_test=1', fails: true});
    s.click();
    assert.equal(s.events[0].props.acquisition_source, 'chatgpt');
    assert.equal(s.events[0].props.test, true);
    assert.equal(s.events[0].props.cta_position, 'hero');
    scenarios++;
}
{
    const s = setupTracking({hostname: 'localhost'});
    s.click();
    assert.equal(s.events.length, 0);
    scenarios++;
}

export const result = {scenarios, redirects: redirects.length, errors: 0};
console.log(JSON.stringify(result));
