import { parseFragment } from 'parse5';

const textContent = (node) => node.nodeName === '#text' ? node.value : (node.childNodes ?? []).map(textContent).join('');
const plainText = (html) => textContent(parseFragment(html)).trim();

export function compileSchemas(page) {
  return page.schemas.map((schema) => {
    if (schema['@type'] !== 'FAQPage' || schema.mainEntity?.block !== 'faq') return schema;
    const faq = page.blocks.find((block) => block.type === 'faq');
    if (!faq) throw new Error(`${page.id}: FAQ schema has no visible FAQ block`);
    return {
      ...schema,
      mainEntity: faq.items.map((item) => ({
        '@type': 'Question',
        name: plainText(item.children[0].html),
        acceptedAnswer: { '@type': 'Answer', text: plainText(item.children[1].html) },
      })),
    };
  });
}
