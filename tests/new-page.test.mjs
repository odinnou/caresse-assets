import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { createPage } from '../scripts/new-page.mjs';
import { validateContent } from '../scripts/validate-content.mjs';

test('adding a page and translation updates routing/sitemap and keeps copied content independent', (t) => {
  const root = mkdtempSync(join(tmpdir(), 'caresse-new-page-'));
  cpSync('src', join(root, 'src'), { recursive: true });
  symlinkSync(join(process.cwd(), 'public'), join(root, 'public'), 'dir');
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const before = validateContent(root).length;
  createPage({ root, family: 'new-occasion', locale: 'fr', path: '/nouvelle-occasion/', from: 'couples.fr' });
  createPage({ root, family: 'new-occasion', locale: 'en', path: '/en/new-occasion/', from: 'couples.en' });
  assert.equal(validateContent(root).length, before + 2);
  const routes = JSON.parse(readFileSync(join(root, 'src/data/routes.json')));
  assert.deepEqual(routes['new-occasion'].fr.alternates, {
    fr: '/nouvelle-occasion/', en: '/en/new-occasion/', 'x-default': '/nouvelle-occasion/',
  });
  const page = JSON.parse(readFileSync(join(root, 'src/content/pages/new-occasion.fr.json')));
  assert.equal(page.meta.find((meta) => meta.property === 'og:url').content, 'https://caresse.app/nouvelle-occasion/');
  const block = page.blocks.find((item) => item.type === 'html');
  writeFileSync(join(root, 'src/content/blocks', block.file + '.html'), 'Independent text');
  assert.notEqual(readFileSync(join(root, 'src/content/blocks/couples.fr/00.html'), 'utf8'), 'Independent text');
  assert.throws(() => createPage({ root, family: 'duplicate', locale: 'fr', path: '/nouvelle-occasion/', from: 'couples.fr' }), /already exists/);
});

test('composed templates copy nested editorial files and resolve new translations', (t) => {
  const root = mkdtempSync(join(tmpdir(), 'caresse-composed-page-'));
  cpSync('src', join(root, 'src'), { recursive: true });
  symlinkSync(join(process.cwd(), 'public'), join(root, 'public'), 'dir');
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const source = JSON.parse(readFileSync(join(root, 'src/content/pages/noel-en-couple.fr.json')));
  source.blocks.push({ type: 'container', tag: 'section', blocks: [{ type: 'html', file: 'couples.fr/00' }] });
  writeFileSync(join(root, 'src/content/pages/noel-en-couple.fr.json'), JSON.stringify(source));
  createPage({ root, family: 'new-season', locale: 'fr', path: '/nouvelle-saison/', from: 'noel-en-couple.fr' });
  const page = JSON.parse(readFileSync(join(root, 'src/content/pages/new-season.fr.json')));
  const nested = page.blocks.at(-1).blocks[0];
  assert.ok(nested.file.startsWith('new-season.fr/'));
  writeFileSync(join(root, 'src/content/blocks', nested.file + '.html'), 'Independent nested content');
  assert.notEqual(readFileSync(join(root, 'src/content/blocks/couples.fr/00.html'), 'utf8'), 'Independent nested content');
  validateContent(root);
  assert.throws(() => createPage({ root, family: 'new-redirect', locale: 'en', path: '/en/new-redirect/', from: 'redirect-en-demo-couple-deux-femmes.en' }), /indexed content page/);
});
