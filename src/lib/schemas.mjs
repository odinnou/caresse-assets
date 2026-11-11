import { parseFragment } from 'parse5';
import product from '../data/product.json' with { type: 'json' };

const textContent = (node) => node.nodeName === '#text' ? node.value : (node.childNodes ?? []).map(textContent).join('');
const plainText = (html) => textContent(parseFragment(html)).trim();

export function compileSchemas(page) {
  const isCaresseApp = (node) => node && typeof node === 'object' &&
    ['MobileApplication', 'SoftwareApplication'].some((type) => [node['@type']].flat().includes(type)) && node.name === product.name;
  const appIds = new Set();
  const collectIds = (node) => {
    if (Array.isArray(node)) node.forEach(collectIds);
    else if (node && typeof node === 'object') {
      if (isCaresseApp(node) && typeof node['@id'] === 'string') appIds.add(node['@id']);
      Object.values(node).forEach(collectIds);
    }
  };
  collectIds(page.schemas);
  const findFaq = (blocks) => {
    for (const block of blocks) {
      if (block.type === 'faq') return block;
      if (block.blocks) { const nested = findFaq(block.blocks); if (nested) return nested; }
    }
  };
  const compile = (node) => {
    if (Array.isArray(node)) return node.map(compile);
    if (!node || typeof node !== 'object') return node;
    const schema = Object.fromEntries(Object.entries(node).map(([key, value]) => [key, compile(value)]));
    if (appIds.has(schema['@id'])) schema['@id'] = product.id;
    if (isCaresseApp(schema)) {
      schema['@id'] = product.id;
      schema.url = product.url;
      schema.applicationCategory = product.applicationCategory;
      schema.inLanguage = [...product.audioLanguages];
    }
    if ([schema['@type']].flat().includes('FAQPage') && schema.mainEntity?.block === 'faq') {
      const faq = findFaq(page.blocks);
      if (!faq) throw new Error(`${page.id}: FAQ schema has no visible FAQ block`);
      schema.mainEntity = faq.items.map((item) => ({
        '@type': 'Question',
        name: plainText(item.children[0].html),
        acceptedAnswer: { '@type': 'Answer', text: plainText(item.children[1].html) },
      }));
    }
    return schema;
  };
  return page.schemas.map(compile);
}
