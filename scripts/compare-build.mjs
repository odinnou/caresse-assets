import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'parse5';

const root = process.cwd();
const { baseline, pilotIds } = JSON.parse(readFileSync('src/data/migration.json'));
const ref = process.env.BASELINE_REF || baseline;
const pages = readdirSync('src/content/pages').filter((file) => file.endsWith('.json'))
  .map((file) => JSON.parse(readFileSync(join('src/content/pages', file))))
  .filter((page) => pilotIds.includes(page.id));
const migrated = new Set(pages.map((page) => page.path.slice(1) + 'index.html'));
const hash = (data) => createHash('sha256').update(data).digest('hex');
const stable = (value) => Array.isArray(value) ? value.map(stable) : value && typeof value === 'object'
  ? Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => [key, stable(item)])) : value;

function tree(node) {
  if (node.nodeName === '#comment') return null;
  if (node.nodeName === '#text') return node.value.trim() ? node.value.replace(/\s+/g, ' ').trim() : null;
  const attrs = Object.fromEntries((node.attrs ?? []).map(({ name, value }) => [name, value]).sort(([a], [b]) => a.localeCompare(b)));
  if (node.tagName === 'script' || node.tagName === 'style') {
    const text = (node.childNodes ?? []).map((child) => child.value ?? '').join('').trim();
    return { tag: node.tagName, attrs, text: attrs.type === 'application/ld+json' ? stable(JSON.parse(text)) : text };
  }
  const children = (node.childNodes ?? []).map(tree).filter((child) => child !== null);
  if (node.tagName === 'head') children.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
  return { tag: node.tagName ?? node.nodeName, attrs, children };
}

const files = execFileSync('git', ['ls-tree', '-r', '--name-only', '-z', ref], { encoding: 'utf8' }).split('\0').filter(Boolean)
  .filter((file) => !file.startsWith('.') && !file.startsWith('tests/') &&
    (file.includes('/') || /\.(html|js|png|svg|ico|mp4)$/.test(file) || ['CNAME', 'robots.txt', 'llms.txt', 'sitemap.xml'].includes(file)));
const report = { baseline: ref, migratedPages: [], unchangedFiles: 0, errors: [] };
for (const file of files) {
  try {
    const builtPath = join(root, 'dist', file);
    assert.ok(existsSync(builtPath), `Missing published file ${file}`);
    const before = execFileSync('git', ['show', `${ref}:${file}`], { maxBuffer: 128 * 1024 * 1024 });
    const after = readFileSync(builtPath);
    if (migrated.has(file) || file === 'sitemap.xml') {
      assert.deepEqual(tree(parse(before.toString())), tree(parse(after.toString())), `DOM/metadata/script/style difference: ${file}`);
      if (migrated.has(file)) report.migratedPages.push({ file, beforeBytes: before.length, afterBytes: after.length });
    } else {
      assert.equal(hash(after), hash(before), `Legacy page or asset changed: ${file}`);
      report.unchangedFiles++;
    }
  } catch (error) { report.errors.push({ file, message: error.message }); }
}
for (const file of ['package.json', 'README.md', 'src', 'tests', 'scripts', 'node_modules']) {
  if (existsSync(join('dist', file))) report.errors.push({ file, message: 'Source/development file exposed in build' });
}
assert.equal(report.migratedPages.length + report.errors.filter((error) => migrated.has(error.file)).length, pages.length, 'Not all migrated URLs were compared');
mkdirSync('artifacts', { recursive: true });
writeFileSync('artifacts/build-parity.json', JSON.stringify(report, null, 2) + '\n');
if (report.errors.length) {
  for (const error of report.errors) console.error(error.file, error.message.slice(0, 2000));
  process.exitCode = 1;
} else console.log(`Parity OK: ${pages.length} migrated pages, sitemap, ${report.unchangedFiles} identical legacy files/assets.`);
