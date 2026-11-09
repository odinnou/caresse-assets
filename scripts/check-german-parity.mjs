/** Compare every German page with its own native English composition, after build. */
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'parse5';

const json = (file) => JSON.parse(readFileSync(file, 'utf8'));
const pages = new Map(readdirSync('src/content/pages').filter((name) => name.endsWith('.json'))
  .map((name) => { const page = json(join('src/content/pages', name)); return [page.id, page]; }));
const german = [...pages.values()].filter((page) => page.locale === 'de');
const attrs = (node) => Object.fromEntries((node.attrs ?? []).map(({ name, value }) => [name, value]));
function nodes(node) { return [node, ...(node.childNodes ?? []).flatMap(nodes)]; }
const document = (page) => parse(readFileSync(join('dist', page.path, 'index.html'), 'utf8'));
// Translation may change text and URLs. The small, explicit language availability
// note and the active language state are the only allowed structural differences.
function structure(node) {
  if (node.nodeName === '#text') return node.value.trim() ? ['#text'] : null;
  if (!node.tagName && node.nodeName !== '#document') return null;
  const a = attrs(node);
  if (a.class?.split(/\s+/).includes('language-notice')) return null;
  const className = (a.class ?? '').split(/\s+/).filter((name) => name && !['active', 'lang-de'].includes(name)).sort().join(' ');
  const kept = {};
  for (const key of ['id', 'colspan', 'rowspan', 'width', 'height', 'type', 'loading', 'controls', 'style', 'role']) {
    if (a[key] !== undefined) kept[key] = a[key];
  }
  // Media must retain their actual recordings, screenshots and video facade.
  if (['img', 'source', 'audio', 'video', 'iframe', 'script'].includes(node.tagName)) {
    for (const key of ['src', 'srcset', 'poster']) if (a[key] !== undefined) kept[key] = a[key];
  }
  return [node.tagName ?? node.nodeName, className, kept,
    (node.childNodes ?? []).map(structure).filter(Boolean)];
}
const results = [];
for (const page of german) {
  assert.equal(page.translationSource, `${page.family}.en`, `${page.id}: explicit reference required`);
  const source = pages.get(page.translationSource);
  assert.ok(source, page.id);
  assert.equal(page.layout, source.layout, `${page.id}: layout changed`);
  assert.deepEqual(page.styles, source.styles, `${page.id}: page styles changed`);
  assert.deepEqual(page.styleAttrs, source.styleAttrs, `${page.id}: style attributes changed`);
  const deDoc = document(page), enDoc = document(source);
  const deNodes = nodes(deDoc), enNodes = nodes(enDoc);
  const body = (all) => all.find((n) => n.tagName === 'body');
  assert.deepEqual(structure(body(deNodes)), structure(body(enNodes)), `${page.id}: composition differs from ${source.id}`);
  // CSS contents, including shared layout fixes, must be identical as rendered.
  const css = (all) => all.filter((n) => n.tagName === 'style').map((n) => (n.childNodes ?? []).map((c) => c.value ?? '').join(''));
  assert.deepEqual(css(deNodes), css(enNodes), `${page.id}: rendered CSS differs`);
  const count = (tag) => deNodes.filter((n) => n.tagName === tag).length;
  results.push({ page: page.path, reference: source.path, sections: count('section'), tables: count('table'), rows: count('tr'), cells: count('td') + count('th'), images: count('img'), audio: count('audio'), details: count('details'), ok: true });
}
assert.equal(german.length, [...pages.values()].filter((p) => p.locale === 'en' && p.kind !== 'redirect').length);
mkdirSync('artifacts/german', { recursive: true });
writeFileSync('artifacts/german/parity-report.json', JSON.stringify(results, null, 2) + '\n');
console.log(`German composition parity verified for all ${german.length} pages: full DOM, sections, tables, cards, FAQ, media, scripts and CSS.`);
