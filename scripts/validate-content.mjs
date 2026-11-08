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
  const publishedPaths = new Set(pages.map((page) => page.path));
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
    if (!page.title?.trim() || (!['legal', 'redirect'].includes(page.kind) && !page.meta.some((meta) => meta.name === 'description' && meta.content?.trim()))) fail(page, 'title or description missing');
    if (page.kind === 'legal' && !page.meta.some((meta) => meta.name === 'robots' && /\bnoindex\b/.test(meta.content))) fail(page, 'legal page must preserve noindex');
    if (page.kind === 'redirect' && (!publishedPaths.has(route.canonical) || route.canonical === page.path || !page.meta.some((meta) => meta['http-equiv']?.toLowerCase() === 'refresh' && meta.content?.includes(`https://caresse.app${route.canonical}`)))) fail(page, 'redirect target or refresh missing');
    for (const [locale, path] of Object.entries(route.alternates)) {
      const translated = Object.values(routes[page.family]).find((candidate) => candidate.path === path);
      if (!translated || (locale !== 'x-default' && routes[page.family][locale]?.path !== path)) fail(page, `invalid alternate ${locale}: ${path}`);
    }
    if (existsSync(join(root, 'public', page.path, 'index.html'))) fail(page, 'URL also exists in public/');
    if (page.layout !== 'composed') {
      reference(page, 'src/data/chrome', page.header, '.json');
      for (const key of page.footer) reference(page, 'src/data/chrome', key, '.json');
    }
    for (const style of page.styles) reference(page, 'src/styles', style, '');
    const validateScript = (script) => { if (script.file) reference(page, 'src/content/scripts', script.file, ''); };
    const validateBlocks = (blocks) => { for (const block of blocks) {
      if (block.type === 'html' || block.type === 'markdown') reference(page, 'src/content/blocks', block.file, block.type === 'html' ? '.html' : '.md');
      else if (block.type === 'intro') {
        if (!Array.isArray(block.children)) fail(page, 'intro children missing');
        for (const child of block.children) for (const link of child.links ?? []) {
          if (!['ios', 'android'].includes(link.store)) fail(page, 'unknown store');
        }
      } else if (block.type === 'faq' || block.type === 'cards') {
        if (!Array.isArray(block.items) || !block.items.length) fail(page, `${block.type} items missing`);
      } else if (block.type === 'header') reference(page, 'src/data/chrome', block.ref, '.json');
      else if (block.type === 'footer') for (const key of block.nodes) reference(page, 'src/data/chrome', key, '.json');
      else if (block.type === 'script') validateScript(block);
      else if (block.type === 'container') {
        if (!['main', 'article', 'section', 'div'].includes(block.tag) || !Array.isArray(block.blocks)) fail(page, 'invalid container');
        validateBlocks(block.blocks);
      } else if (block.type === 'element') {
        if (!/^[a-z][a-z0-9-]*$/.test(block.tag ?? '') || typeof block.html !== 'string') fail(page, 'invalid content element');
      } else if (block.type === 'text') {
        if (typeof block.html !== 'string') fail(page, 'invalid text block');
      } else fail(page, `unknown block ${block.type}`);
    } };
    validateBlocks(page.blocks);
    for (const item of page.headOrder ?? []) {
      if (item.type === 'script') validateScript(item);
      else if (item.type === 'style') reference(page, 'src/styles', item.file, '');
      else if (['meta', 'link', 'schema'].includes(item.type)) {
        const collection = { meta: page.meta, link: page.links, schema: page.schemas }[item.type];
        if (!Number.isInteger(item.index) || !collection[item.index]) fail(page, 'invalid head reference');
      } else if (!['title', 'canonical', 'alternate'].includes(item.type)) fail(page, `unknown head element ${item.type}`);
    }
    const listed = inventory.some((entry) => entry.loc === `https://caresse.app${page.path}`);
    if (page.sitemap === false ? listed : !listed) fail(page, 'URL differs from sitemap inventory');
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
