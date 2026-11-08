// One-time, lossless extraction of the remaining trusted, versioned HTML pages.
// Running again after migration is a no-op: only HTML still in public/ is read.
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { parse } from 'parse5';
import { readInventory } from './sitemap-inventory.mjs';

const read = (file) => JSON.parse(readFileSync(file, 'utf8'));
const write = (file, data) => { mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, JSON.stringify(data, null, 2) + '\n'); };
const hash = (text) => createHash('sha256').update(text).digest('hex').slice(0, 16);
const walk = (directory) => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? walk(join(directory, entry.name)) : [join(directory, entry.name)]);
const attrs = (node) => Object.fromEntries((node?.attrs ?? []).map(({ name, value }) => [name, value]));
const children = (node) => (node.childNodes ?? []).filter((child) => child.tagName);
const text = (node) => node.nodeName === '#text' ? node.value : (node.childNodes ?? []).map(text).join('');
const routes = read('src/data/routes.json');
const inventory = new Set(readInventory().map((entry) => new URL(entry.loc).pathname));
const stores = read('src/data/stores.json');
const chrome = new Map(readdirSync('src/data/chrome').map((file) => [JSON.stringify(read(join('src/data/chrome', file))), file.slice(0, -5)]));
const styles = new Map(readdirSync('src/styles').map((file) => [readFileSync(join('src/styles', file), 'utf8').trim(), file]));
const files = walk('public').filter((file) => file.endsWith('.html')).sort();
if (!files.length) { console.log('No legacy HTML remains in public/.'); process.exit(0); }
const documents = files.map((file) => {
  const source = readFileSync(file, 'utf8');
  const document = parse(source, { sourceCodeLocationInfo: true });
  const html = document.childNodes.find((node) => node.tagName === 'html');
  const head = children(html).find((node) => node.tagName === 'head');
  const body = children(html).find((node) => node.tagName === 'body');
  const path = '/' + file.slice('public/'.length).replace(/index\.html$/, '');
  const alternates = Object.fromEntries(children(head).filter((node) => node.tagName === 'link' && attrs(node).hreflang).map((node) => [attrs(node).hreflang, new URL(attrs(node).href).pathname]));
  const canonicalNode = children(head).find((node) => node.tagName === 'link' && attrs(node).rel === 'canonical');
  const canonical = canonicalNode ? new URL(attrs(canonicalNode).href).pathname : null;
  const locale = attrs(html).lang;
  const refresh = children(head).find((node) => attrs(node)['http-equiv']?.toLowerCase() === 'refresh');
  const kind = refresh ? 'redirect' : path.startsWith('/legal/') ? 'legal' : 'page';
  return { file, source, html, head, body, path, alternates, canonical, locale, kind };
});
const existing = new Map(Object.entries(routes).flatMap(([family, locales]) => Object.values(locales).map((route) => [route.path, family])));
for (const doc of documents) {
  const root = doc.kind === 'redirect' ? doc.path : doc.alternates.fr ?? doc.alternates['x-default'] ?? doc.path.replace(/^\/legal\/(fr|en|es|pt)\//, '/legal/').replace(/^\/(en|es|pt)\//, '/');
  doc.family = existing.get(root) ?? (root.replace(/^\/+|\/+$/g, '').replace(/\//g, '-') || 'home');
  if (doc.kind === 'redirect') doc.family = 'redirect-' + doc.path.replace(/^\/+|\/+$/g, '').replace(/\//g, '-');
  if (routes[doc.family]?.[doc.locale] && routes[doc.family][doc.locale].path !== doc.path) throw new Error(`Conflicting family ${doc.family}.${doc.locale}: ${doc.path}`);
  doc.id = `${doc.family}.${doc.locale}`;
  routes[doc.family] ??= {};
  routes[doc.family][doc.locale] = { path: doc.path, canonical: doc.canonical, alternates: doc.alternates };
}
function sharedChrome(prefix, value) {
  const serialized = JSON.stringify(value);
  if (chrome.has(serialized)) return chrome.get(serialized);
  const name = prefix + '-' + hash(serialized);
  write(`src/data/chrome/${name}.json`, value); chrome.set(serialized, name); return name;
}
const count = { pages: 0, blocks: 0, scripts: new Set(), styles: new Set() };
for (const doc of documents) {
  const { source, id, family, locale, path, kind } = doc;
  const outer = (node) => { const loc = node.sourceCodeLocation; if (!loc) throw new Error(`${id}: synthesized ${node.tagName}`); return source.slice(loc.startOffset, loc.endOffset); };
  const inner = (node) => { const loc = node.sourceCodeLocation; return loc?.startTag ? source.slice(loc.startTag.endOffset, loc.endTag?.startOffset ?? loc.endOffset) : ''; };
  const element = (node) => ({ tag: node.tagName, attrs: attrs(node), html: inner(node) });
  const script = (node) => {
    const code = inner(node); const result = { type: 'script', attrs: attrs(node) };
    if (code) {
      const file = 'script-' + hash(code) + '.js'; mkdirSync('src/content/scripts', { recursive: true }); writeFileSync(join('src/content/scripts', file), code);
      result.file = file; count.scripts.add(file);
    }
    return result;
  };
  const headerNode = (node) => {
    if (!node.tagName) return { html: outer(node) };
    const a = attrs(node);
    if (node.tagName === 'a' && a.hreflang && doc.alternates[a.hreflang] && new URL(a.href, 'https://caresse.app').pathname === doc.alternates[a.hreflang]) {
      const { href, ...rest } = a; return { ...element(node), attrs: rest, language: a.hreflang };
    }
    const hasLanguages = (n) => n.tagName === 'a' && attrs(n).hreflang || (n.childNodes ?? []).some(hasLanguages);
    return hasLanguages(node) ? { tag: node.tagName, attrs: a, children: (node.childNodes ?? []).filter((n) => n.nodeName !== '#comment').map(headerNode) } : element(node);
  };
  const fragment = (node) => {
    const value = outer(node), file = `${id}/${String(count.blocks++).padStart(4, '0')}`;
    mkdirSync(`src/content/blocks/${id}`, { recursive: true }); writeFileSync(`src/content/blocks/${file}.html`, value);
    return { type: 'html', file };
  };
  const blocks = (node) => {
    // Spaces between inline siblings affect layout (e.g. breadcrumb links).
    const inline = children(node).some((n) => ['a', 'span', 'em', 'strong', 'small', 'label', 'button', 'input', 'br'].includes(n.tagName));
    return (node.childNodes ?? []).filter((n) => n.nodeName !== '#comment' && (n.tagName || n.value?.trim() || inline && n.value)).map(block);
  };
  function block(node) {
    if (!node.tagName) return { type: 'text', html: outer(node) };
    const a = attrs(node);
    if (node.tagName === 'script') return script(node);
    if (node.tagName === 'style') return fragment(node);
    if (node.tagName === 'header') return { type: 'header', ref: sharedChrome('header', { attrs: a, nodes: (node.childNodes ?? []).filter((n) => n.nodeName !== '#comment').map(headerNode) }) };
    if (node.tagName === 'footer') return { type: 'footer', attrs: a, nodes: (node.childNodes ?? []).filter((n) => n.nodeName !== '#comment' && (n.tagName || n.value?.trim())).map((n) => sharedChrome('footer', n.tagName ? element(n) : { html: outer(n) })) };
    const kids = children(node);
    if (node.tagName === 'section' && /(?:^|\s)(hero|intro)(?:\s|$)/.test(a.class ?? '')) {
      return { type: 'intro', attrs: a, children: kids.map((child) => {
        const links = children(child);
        if (child.tagName === 'div' && links.length && links.every((link) => link.tagName === 'a' && [stores.ios[locale], stores.android].includes(attrs(link).href)) && !text(child).replace(/\s/g, '')) {
          return { attrs: attrs(child), links: links.map((link) => { const { href, ...rest } = attrs(link); return { store: href === stores.android ? 'android' : 'ios', attrs: rest, html: inner(link) }; }) };
        }
        return element(child);
      }) };
    }
    if (node.tagName === 'div' && /(?:^|\s)faq-list(?:\s|$)/.test(a.class ?? '') && kids.length && kids.every((n) => n.tagName === 'div' && children(n).length === 2 && children(n)[0].tagName === 'h3' && children(n)[1].tagName === 'p')) {
      return { type: 'faq', attrs: a, prefix: '', suffix: '', items: kids.map((item) => ({ attrs: attrs(item), children: children(item).map(element) })) };
    }
    if (node.tagName === 'div' && /(?:^|\s)[\w-]*grid(?:\s|$)/.test(a.class ?? '') && kids.length && kids.every((n) => ['a', 'div', 'article'].includes(n.tagName))) return { type: 'cards', attrs: a, prefix: '', suffix: '', items: kids.map(element) };
    if (['main', 'article', 'section', 'div'].includes(node.tagName) && kids.length) return { type: 'container', tag: node.tagName, attrs: a, blocks: blocks(node) };
    if (['h1','h2','h3','h4','h5','h6','p','ul','ol','a','aside','details','nav','figure','img','hr','br','audio','video','table','dl','noscript','button','form','label','input'].includes(node.tagName)) return { type: 'element', ...element(node) };
    return fragment(node);
  }
  const page = { id, family, locale, path, kind, layout: 'composed', sitemap: inventory.has(path), htmlAttrs: attrs(doc.html), bodyAttrs: attrs(doc.body), title: '', meta: [], links: [], schemas: [], styles: [], styleAttrs: {}, headScripts: [], scripts: [], headOrder: [], blocks: [] };
  for (const node of children(doc.head)) {
    const a = attrs(node);
    if (node.tagName === 'meta') { page.headOrder.push({ type: 'meta', index: page.meta.length }); page.meta.push(a); }
    else if (node.tagName === 'title') { page.title = text(node); page.headOrder.push({ type: 'title' }); }
    else if (node.tagName === 'link' && a.rel === 'canonical') { const {href,...rest}=a;page.headOrder.push({ type: 'canonical', attrs: rest }); }
    else if (node.tagName === 'link' && a.hreflang) { const {href,...rest}=a;page.headOrder.push({ type: 'alternate', locale: a.hreflang, attrs: rest }); }
    else if (node.tagName === 'link') { page.headOrder.push({ type: 'link', index: page.links.length }); page.links.push(a); }
    else if (node.tagName === 'script' && a.type === 'application/ld+json') { page.headOrder.push({ type: 'schema', index: page.schemas.length, attrs: a }); page.schemas.push(JSON.parse(inner(node))); }
    else if (node.tagName === 'script') page.headOrder.push(script(node));
    else if (node.tagName === 'style') {
      const css = inner(node); let file = styles.get(css.trim());
      if (!file) { file = 'shared-' + hash(css.trim()) + '.css'; writeFileSync(join('src/styles',file),css); styles.set(css.trim(),file); }
      page.styles.push(file); page.styleAttrs[file] = a; page.headOrder.push({ type: 'style', file, attrs: a });count.styles.add(file);
    } else throw new Error(`${id}: unknown head element ${node.tagName}`);
  }
  page.blocks = blocks(doc.body);
  // Bind JSON-LD to the visible FAQ only when doing so preserves every value.
  const faqs = [];
  const findFaqs = (items) => { for (const item of items) { if (item.type === 'faq') faqs.push(item); if (item.blocks) findFaqs(item.blocks); } }; findFaqs(page.blocks);
  if (faqs.length === 1) {
    const faq = faqs[0];
    const plain = (html) => { const d=parse('<!doctype html><body>'+html); return text(d).trim(); };
    const entities = faq.items.map((item) => ({ '@type': 'Question', name: plain(item.children[0].html), acceptedAnswer: { '@type': 'Answer', text: plain(item.children[1].html) } }));
    for (const schema of page.schemas) if (schema['@type'] === 'FAQPage' && JSON.stringify(schema.mainEntity) === JSON.stringify(entities)) schema.mainEntity = { block: 'faq' };
  }
  write(`src/content/pages/${id}.json`, page); count.pages++;
}
write('src/data/routes.json', routes);
const migration = read('src/data/migration.json');
migration.scope = '226 pages : toutes les URL historiques, en FR/EN/ES/PT, dont pages légales et redirections';
migration.comparisonIds = [...migration.pilotIds, ...documents.map((doc) => doc.id)].sort();
write('src/data/migration.json', migration);
// All source files are extracted before removing their published HTML copies.
for (const file of files) unlinkSync(file);
console.log(`Migrated ${count.pages} pages; ${count.styles.size} shared styles; ${count.scripts.size} shared scripts.`);
