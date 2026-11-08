import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { validateContent } from '../scripts/validate-content.mjs';

function editFixture(t, edit) {
  const fixture = mkdtempSync(join(tmpdir(), 'caresse-content-'));
  cpSync('src', join(fixture, 'src'), { recursive: true });
  symlinkSync(join(process.cwd(), 'public'), join(fixture, 'public'), 'dir');
  t.after(() => rmSync(fixture, { recursive: true, force: true }));
  const file = join(fixture, 'src/content/pages/couples.fr.json');
  const page = JSON.parse(readFileSync(file));
  edit(page);
  writeFileSync(file, JSON.stringify(page));
  return fixture;
}

test('all 16 pages and their translations reference existing content and public routes', () => {
  const registry = JSON.parse(readFileSync('src/data/routes.json'));
  assert.equal(validateContent().length, Object.values(registry).reduce((count, locales) => count + Object.keys(locales).length, 0));
});
test('fails before building when an editorial block was deleted', (t) => {
  const root = editFixture(t, (page) => { page.blocks = [{ type: 'markdown', file: 'missing' }]; });
  assert.throws(() => validateContent(root), /missing\/invalid reference/);
});
test('rejects a route change without updating the translation registry', (t) => {
  const root = editFixture(t, (page) => { page.path = '/renamed/'; });
  assert.throws(() => validateContent(root), /translation registry/);
});
test('rejects unknown blocks rather than publishing an incomplete page', (t) => {
  const root = editFixture(t, (page) => { page.blocks = [{ type: 'typo' }]; });
  assert.throws(() => validateContent(root), /unknown block/);
});
test('rejects missing SEO metadata and mismatched HTML language', (t) => {
  const root = editFixture(t, (page) => { page.title = ''; });
  assert.throws(() => validateContent(root), /title or description missing/);
  const other = editFixture(t, (page) => { page.htmlAttrs.lang = 'en'; });
  assert.throws(() => validateContent(other), /HTML language/);
});
