import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readInventory } from './sitemap-inventory.mjs';

const json = (path) => JSON.parse(readFileSync(path, 'utf8'));
export function validateContent(root = process.cwd()) {
  const routes = json(join(root, 'src/data/routes.json'));
  const inventory = readInventory(root);
  const files = readdirSync(join(root, 'src/content/pages')).filter((file) => file.endsWith('.json'));
  const pages = files.map((file) => json(join(root, 'src/content/pages', file)));
  const paths = new Set();
  const ids = new Set();
  const fail = (page, message) => { throw new Error(`${page.id}: ${message}`); };
  const reference = (page, directory, name, extension) => {
    if (typeof name !== 'string' || name.split('/').some((part) => !part || part === '..') || !/^[\w./-]+$/.test(name) ||
      !existsSync(join(root, directory, name + extension))) fail(page, `missing/invalid reference ${directory}/${name}${extension}`);
  };
  for (const page of pages) {
    if (!page.id || ids.has(page.id)) fail(page, 'duplicate or missing ID');
    ids.add(page.id);
    if (!/^\/(?:[a-z0-9-]+\/)*$/.test(page.path) || paths.has(page.path)) fail(page, 'duplicate or invalid URL');
    paths.add(page.path);
    const route = routes[page.family]?.[page.locale];
    if (!route || route.path !== page.path) fail(page, 'URL differs from translation registry');
    if (page.htmlAttrs.lang !== page.locale) fail(page, 'HTML language differs from locale');
    if (!page.title?.trim() || !page.meta.some((meta) => meta.name === 'description' && meta.content?.trim())) fail(page, 'title or description missing');
    for (const [locale, path] of Object.entries(route.alternates)) {
      const translated = Object.values(routes[page.family]).find((candidate) => candidate.path === path);
      if (!translated || (locale !== 'x-default' && routes[page.family][locale]?.path !== path)) fail(page, `invalid alternate ${locale}: ${path}`);
    }
    if (existsSync(join(root, 'public', page.path, 'index.html'))) fail(page, 'URL also exists in public/');
    reference(page, 'src/data/chrome', page.header, '.json');
    for (const key of page.footer) reference(page, 'src/data/chrome', key, '.json');
    for (const style of page.styles) reference(page, 'src/styles', style, '');
    for (const block of page.blocks) {
      if (block.type === 'html' || block.type === 'markdown') reference(page, 'src/content/blocks', block.file, block.type === 'html' ? '.html' : '.md');
      else if (block.type === 'intro') {
        if (!Array.isArray(block.children)) fail(page, 'intro children missing');
        for (const child of block.children) for (const link of child.links ?? []) {
          if (!['ios', 'android'].includes(link.store)) fail(page, 'unknown store');
        }
      } else if (block.type === 'faq' || block.type === 'cards') {
        if (!Array.isArray(block.items) || !block.items.length) fail(page, `${block.type} items missing`);
      } else fail(page, `unknown block ${block.type}`);
    }
    if (!inventory.some((entry) => entry.loc === `https://caresse.app${page.path}`)) fail(page, 'URL missing from sitemap inventory');
  }
  for (const [family, locales] of Object.entries(routes)) {
    for (const [locale, page] of Object.entries(locales)) {
      if (!pages.some((candidate) => candidate.family === family && candidate.locale === locale && candidate.path === page.path)) throw new Error(`Missing page ${family}.${locale}`);
    }
  }
  const locations = new Set();
  for (const entry of inventory) {
    const url = new URL(entry.loc);
    if (url.origin !== 'https://caresse.app' || locations.has(entry.loc)) throw new Error(`Invalid or duplicate sitemap entry ${entry.loc}`);
    locations.add(entry.loc);
    if (!paths.has(url.pathname) && !existsSync(join(root, 'public', url.pathname, url.pathname.endsWith('/') ? 'index.html' : ''))) throw new Error(`Missing sitemap destination ${entry.loc}`);
  }
  return pages;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(`Validated ${validateContent().length} Astro pages and the complete sitemap inventory.`);
}
