/** Check what a text reader can actually recover from the generated site. */
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { parse, parseFragment } from 'parse5';
import product from '../src/data/product.json' with { type: 'json' };

const nodes = (node) => [node, ...(node.childNodes ?? []).flatMap(nodes)];
const text = (node) => {
  if (node.nodeName === '#text') return node.value;
  if (['script', 'style', 'template'].includes(node.tagName)) return '';
  return (node.childNodes ?? []).map(text).join('');
};
// Inline markup can split words or punctuation. Compare the decoded text without
// whitespace, while keeping every word and punctuation mark in its original order.
const normalize = (value) => text(parseFragment(value)).replace(/\s+/gu, '');
function* schemaNodes(value) {
  if (Array.isArray(value)) {
    for (const child of value) yield* schemaNodes(child);
  } else if (value && typeof value === 'object') {
    yield value;
    for (const child of Object.values(value)) yield* schemaNodes(child);
  }
}

const obsolete = /paiement compris|payments? included|pago incluido|aucune donnée sensible stockée|no sensitive data stored|sin datos sensibles almacenados/iu;
let questions = 0;
let applications = 0;
for (const file of readdirSync('src/content/pages').filter((name) => name.endsWith('.json'))) {
  const page = JSON.parse(readFileSync(join('src/content/pages', file), 'utf8'));
  const document = nodes(parse(readFileSync(join('dist', page.path, 'index.html'), 'utf8')));
  const body = text(document.find((node) => node.tagName === 'body'));
  const visible = normalize(body);
  assert.doesNotMatch(body, obsolete, `${page.id}: obsolete product claim`);
  for (const script of document.filter((node) => node.tagName === 'script' &&
    node.attrs.some(({ name, value }) => name === 'type' && value === 'application/ld+json'))) {
    const data = JSON.parse(script.childNodes.map((node) => node.value ?? '').join(''));
    for (const schema of schemaNodes(data)) {
      if (schema.name === product.name && ['MobileApplication', 'SoftwareApplication'].some((type) => [schema['@type']].flat().includes(type))) {
        assert.equal(schema['@id'], product.id, `${page.id}: inconsistent Caresse identity`);
        assert.equal(schema.url, product.url, `${page.id}: inconsistent official product URL`);
        assert.equal(schema.applicationCategory, product.applicationCategory, `${page.id}: inconsistent product category`);
        assert.deepEqual(schema.inLanguage, product.audioLanguages, `${page.id}: app languages differ from the product facts`);
        applications++;
      }
      if (![schema['@type']].flat().includes('FAQPage')) continue;
      assert.ok(Array.isArray(schema.mainEntity), `${page.id}: FAQ questions missing`);
      for (const question of schema.mainEntity) {
        assert.ok(typeof question.name === 'string' && question.name.trim(), `${page.id}: FAQ question empty`);
        assert.ok(typeof question.acceptedAnswer?.text === 'string' && question.acceptedAnswer.text.trim(), `${page.id}: FAQ answer empty`);
        assert.ok(visible.includes(normalize(question.name)), `${page.id}: FAQ question absent from visible text: ${question.name}`);
        assert.ok(visible.includes(normalize(question.acceptedAnswer.text)), `${page.id}: FAQ answer differs from visible text: ${question.name}`);
        questions++;
      }
    }
  }
}

const inventory = readFileSync('dist/llms.txt', 'utf8');
assert.doesNotMatch(inventory, /real time|illustrative examples|Manon & Yannick/iu, 'llms.txt: outdated description');
let links = 0;
for (const [, destination] of inventory.matchAll(/\]\((https:\/\/caresse\.app\/[^\s)]*)\)/gu)) {
  const url = new URL(destination);
  const path = decodeURIComponent(url.pathname);
  assert.ok(existsSync(join('dist', path, path.endsWith('/') ? 'index.html' : '')), `llms.txt: missing destination ${destination}`);
  links++;
}
assert.ok(questions > 0 && links > 0, 'GEO checks must inspect real FAQs and inventory links');
console.log(`GEO content verified: ${questions} visible FAQ answers, ${applications} consistent Caresse entities, ${links} inventory links, no obsolete absolute claims.`);
