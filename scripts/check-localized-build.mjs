import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'parse5';
import { readInventory } from './sitemap-inventory.mjs';

const json = (file) => JSON.parse(readFileSync(file, 'utf8'));
const routes = json('src/data/routes.json');
const pages = readdirSync('src/content/pages').filter((name) => name.endsWith('.json'))
  .map((name) => json(join('src/content/pages', name)));
const site = 'https://caresse.app';
const documents = new Map();
const attrs = (node) => Object.fromEntries((node.attrs ?? []).map(({ name, value }) => [name, value]));
const text = (node) => node.nodeName === '#text' ? node.value : (node.childNodes ?? []).map(text).join('');
function nodes(node) { return [node, ...(node.childNodes ?? []).flatMap(nodes)]; }
function document(path) {
  if (!documents.has(path)) documents.set(path, nodes(parse(readFileSync(join('dist', path, 'index.html'), 'utf8'))));
  return documents.get(path);
}
const elements = (path, tag) => document(path).filter((node) => node.tagName === tag);
const indexed = pages.filter((page) => page.sitemap !== false);
const german = pages.filter((page) => page.locale === 'de');
const inventory = readInventory();
const sitemap = readFileSync('dist/sitemap.xml', 'utf8');

// Check the rendered output, including composed pages whose head order predates DE.
for (const page of indexed) {
  const family = routes[page.family];
  const links = elements(page.path, 'link').map(attrs);
  assert.equal(links.filter((link) => link.rel === 'canonical').length, 1, page.id);
  assert.equal(links.find((link) => link.rel === 'canonical').href, site + page.path, page.id);
  const alternates = links.filter((link) => link.rel === 'alternate');
  assert.equal(new Set(alternates.map((link) => link.hreflang)).size, alternates.length, page.id);
  for (const [locale, path] of Object.entries(family[page.locale].alternates)) {
    assert.ok(alternates.some((link) => link.hreflang === locale && link.href === site + path), `${page.id}: missing ${locale} alternate`);
    if (locale !== 'x-default') {
      assert.equal(family[locale].alternates[page.locale], page.path, `${page.id}: non-reciprocal ${locale}`);
    }
  }
  if (family.de) {
    assert.ok(elements(page.path, 'a').some((link) => attrs(link).hreflang === 'de' && attrs(link).href === family.de.path), `${page.id}: missing German language switch`);
  }
}

const reached = new Set(['/de/']);
for (const page of german) {
  assert.equal(attrs(elements(page.path, 'html')[0]).lang, 'de', page.id);
  assert.equal(elements(page.path, 'h1').length, 1, page.id);
  assert.ok(elements(page.path, 'title').some((node) => text(node).trim()), page.id);
  const metas = elements(page.path, 'meta').map(attrs);
  if (page.kind !== 'legal') {
    assert.ok(metas.some((meta) => meta.name === 'description' && meta.content.trim()), page.id);
    if (page.sitemap !== false) assert.ok(metas.some((meta) => meta.property === 'og:locale' && meta.content === 'de_DE'), page.id);
  }
  if (page.kind === 'legal') {
    assert.ok(metas.some((meta) => meta.name === 'robots' && /noindex/.test(meta.content)), page.id);
  } else {
    const notice = document(page.path).find((node) => attrs(node).class === 'language-notice');
    assert.match(text(notice), /noch nicht auf Deutsch/, page.id);
  }
  const listed = inventory.some((entry) => entry.loc === site + page.path);
  assert.equal(listed, page.sitemap !== false, page.id);
  assert.equal(sitemap.includes(`<loc>${site + page.path}</loc>`), listed, page.id);
  if (listed) assert.ok(sitemap.includes(`hreflang="de" href="${site + page.path}"`), page.id);

  for (const node of elements(page.path, 'a')) {
    const link = attrs(node);
    if (!link.href || link.href.startsWith('mailto:')) continue;
    const url = new URL(link.href, site + page.path);
    if (url.origin === site) {
      assert.ok(existsSync(join('dist', decodeURIComponent(url.pathname), url.pathname.endsWith('/') ? 'index.html' : '')), `${page.id}: broken ${url.pathname}`);
      if (url.pathname.startsWith('/de/')) reached.add(url.pathname);
      // Only the language selector leaves the German route tree.
      if (url.pathname.endsWith('/') && !link.hreflang) assert.ok(url.pathname.startsWith('/de/'), `${page.id}: untranslated internal route ${url.pathname}`);
    } else if (link.class?.includes('cta-pink')) {
      assert.ok(['apps.apple.com', 'play.google.com'].includes(url.hostname), `${page.id}: indirect primary CTA`);
      assert.equal(link.target, '_blank', page.id);
      assert.ok(link.rel.split(/\s+/).includes('noopener'), page.id);
    }
  }
  for (const audio of elements(page.path, 'audio')) {
    const source = attrs(audio).src;
    assert.ok(existsSync(join('dist', source)), `${page.id}: missing demo recording`);
    assert.match(source, /-en-/, `${page.id}: demo must retain its English language`);
    assert.match(elements(page.path, 'body').map(text).join(''), /auf Englisch/, page.id);
  }
  for (const script of elements(page.path, 'script').filter((node) => attrs(node).type === 'application/ld+json')) {
    const walk = (schema) => {
      if (Array.isArray(schema)) return schema.forEach(walk);
      if (!schema || typeof schema !== 'object') return;
      if (['MobileApplication', 'SoftwareApplication'].includes(schema['@type'])) assert.ok(![].concat(schema.inLanguage ?? []).includes('de'), `${page.id}: app incorrectly claims German support`);
      if (schema['@type'] === 'AudioObject') assert.equal(schema.inLanguage, 'en', page.id);
      Object.values(schema).forEach(walk);
    };
    walk(JSON.parse(text(script)));
  }
}
for (const page of german) assert.ok(reached.has(page.path), `${page.id}: orphan German page`);
assert.equal(german.length, pages.filter((page) => page.locale === 'en' && page.kind !== 'redirect').length);
console.log('Localized build verified: German coverage, links, language switches, SEO, media and store destinations.');
