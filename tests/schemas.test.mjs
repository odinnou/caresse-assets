import assert from 'node:assert/strict';
import test from 'node:test';
import { compileSchemas } from '../src/lib/schemas.mjs';

const app = { '@type': 'MobileApplication', name: 'Caresse', '@id': 'https://caresse.app/en/demo/#app', url: 'https://caresse.app/en/', applicationCategory: 'HealthApplication', inLanguage: ['de'], description: 'Localized description', offers: { price: '0', priceCurrency: 'EUR' } };
const faq = { type: 'faq', items: [{ children: [{ html: 'A &amp; B?' }, { html: 'A <strong>visible</strong> answer.' }] }] };

test('all Caresse app declarations and their references resolve to one product identity', () => {
  const page = { id: 'demo.en', blocks: [], schemas: [app, { '@type': 'WebPage', about: { '@id': app['@id'] }, inLanguage: 'en' }] };
  const original = structuredClone(page);
  const [compiled, webpage] = compileSchemas(page);
  assert.equal(compiled['@id'], 'https://caresse.app/#app');
  assert.equal(compiled.url, 'https://caresse.app/');
  assert.equal(compiled.applicationCategory, 'LifestyleApplication');
  assert.deepEqual(compiled.inLanguage, ['fr', 'en', 'es', 'pt']);
  assert.equal(webpage.about['@id'], compiled['@id']);
  assert.equal(webpage.inLanguage, 'en');
  assert.deepEqual(compiled.offers, app.offers);
  assert.equal(compiled.description, app.description);
  assert.deepEqual(page, original, 'compilation must not mutate editorial sources');
});

test('nested graph applications and FAQ use the same rules as top-level schemas', () => {
  const page = { id: 'home.pt', blocks: [{ type: 'container', blocks: [faq] }], schemas: [{ '@graph': [app, { '@type': 'FAQPage', mainEntity: { block: 'faq' } }, { about: { '@id': app['@id'] } }] }] };
  const graph = compileSchemas(page)[0]['@graph'];
  assert.equal(graph[0]['@id'], 'https://caresse.app/#app');
  assert.equal(graph[2].about['@id'], graph[0]['@id']);
  assert.equal(graph[1].mainEntity[0].name, 'A & B?');
  assert.equal(graph[1].mainEntity[0].acceptedAnswer.text, 'A visible answer.');
});

test('competitors, recordings and localized webpage identities remain independent', () => {
  const schemas = [
    { ...app, name: 'Another app' },
    { '@type': 'AudioObject', '@id': 'https://caresse.app/de/demo/#recording', inLanguage: 'en' },
    { '@type': 'WebPage', '@id': 'https://caresse.app/de/#webpage', inLanguage: 'de' }
  ];
  assert.deepEqual(compileSchemas({ id: 'de', blocks: [], schemas }), schemas);
});

test('an inline app without an identifier gets the common identity, without declaring German audio', () => {
  const [page] = compileSchemas({ id: 'home.de', blocks: [], schemas: [{ '@type': 'WebPage', inLanguage: 'de', about: { '@type': 'SoftwareApplication', name: 'Caresse' } }] });
  assert.equal(page.about['@id'], 'https://caresse.app/#app');
  assert.equal(page.inLanguage, 'de');
  assert.ok(!page.about.inLanguage.includes('de'));
});
