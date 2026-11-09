import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readInventory, writeInventory } from './sitemap-inventory.mjs';
import languages from '../src/data/languages.json' with { type: 'json' };

const read = (file) => JSON.parse(readFileSync(file, 'utf8'));
const write = (file, data) => writeFileSync(file, JSON.stringify(data, null, 2) + '\n');

export function createPage({ root = process.cwd(), family, locale, path, from }) {
  if (!/^[a-z0-9-]+$/.test(family ?? '') || !Object.hasOwn(languages, locale ?? '') || !/^\/(?:[a-z0-9-]+\/)+$/.test(path ?? '')) {
    throw new Error(`Usage: npm run page:new -- <family> <${Object.keys(languages).join('|')}> </new-path/> <template-id>`);
  }
  const id = `${family}.${locale}`;
  const pagesDirectory = join(root, 'src/content/pages');
  const destination = join(pagesDirectory, id + '.json');
  const page = read(join(pagesDirectory, from + '.json'));
  const routesFile = join(root, 'src/data/routes.json');
  const routes = read(routesFile);
  const inventory = readInventory(root);
  if (page.locale !== locale) throw new Error('Choose a template in the same language as the new page.');
  if (['legal', 'redirect'].includes(page.kind) || page.sitemap === false) throw new Error('Choose an indexed content page as the template, not a legal page, redirect or download fallback.');
  if (existsSync(destination) || existsSync(join(root, 'public', path, 'index.html')) ||
    Object.values(routes).some((locales) => Object.values(locales).some((route) => route.path === path))) throw new Error(`Page/URL already exists: ${id} ${path}`);
  const oldUrl = 'https://caresse.app' + page.path;
  const newUrl = 'https://caresse.app' + path;
  const replaceSelf = (value) => {
    if (typeof value === 'string') return value === oldUrl || value.startsWith(oldUrl + '#') ? newUrl + value.slice(oldUrl.length) : value;
    if (Array.isArray(value)) return value.map(replaceSelf);
    if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, replaceSelf(item)]));
    return value;
  };
  const next = replaceSelf(page);
  Object.assign(next, { id, family, locale, path });
  next.htmlAttrs['data-analytics-variant'] = `${family}-v1`;
  const copies = [];
  let copiedBlocks = 0;
  const copyBlocks = (blocks) => { for (const block of blocks) {
    if (block.blocks) copyBlocks(block.blocks);
    if (!['html', 'markdown'].includes(block.type)) continue;
    const extension = block.type === 'html' ? '.html' : '.md';
    const original = join(root, 'src/content/blocks', block.file + extension);
    if (!existsSync(original)) throw new Error(`Missing template content ${original}`);
    block.file = `${id}/${String(copiedBlocks++).padStart(2, '0')}`;
    copies.push([original, join(root, 'src/content/blocks', block.file + extension)]);
  } };
  copyBlocks(next.blocks);
  routes[family] ??= {};
  routes[family][locale] = { path, alternates: {} };
  const alternates = Object.fromEntries(Object.entries(routes[family]).map(([language, route]) => [language, route.path]));
  alternates['x-default'] = routes[family].fr?.path ?? Object.values(routes[family])[0].path;
  for (const route of Object.values(routes[family])) route.alternates = alternates;
  const templateEntry = inventory.find((entry) => entry.loc === oldUrl);
  inventory.push({ ...templateEntry, loc: newUrl, lastmod: new Date().toISOString().slice(0, 10), alternates: [] });
  for (const route of Object.values(routes[family])) {
    const entry = inventory.find((item) => item.loc === 'https://caresse.app' + route.path);
    entry.alternates = Object.entries(alternates).map(([hreflang, href]) => ({ rel: 'alternate', hreflang, href: 'https://caresse.app' + href }));
  }
  for (const [original, target] of copies) {
    mkdirSync(dirname(target), { recursive: true });
    copyFileSync(original, target);
  }
  write(destination, next);
  write(routesFile, routes);
  writeInventory(root, inventory);
  return id;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [family, locale, path, from] = process.argv.slice(2);
  const id = createPage({ family, locale, path, from });
  console.log(`Created src/content/pages/${id}.json and independent content files. Edit the copied title, metadata, schemas and text before publishing.`);
}
