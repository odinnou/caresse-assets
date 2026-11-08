import { readInventory } from '../../scripts/sitemap-inventory.mjs';
import routes from '../data/routes.json';

const site = 'https://caresse.app';
const inventory = readInventory();
const escape = (value: string) => value.replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;',
})[char]!);

export function GET() {
  const migrated = new Map(Object.values(routes).flatMap((locales) =>
    Object.values(locales).map((page) => [new URL(page.path, site).href, page.alternates] as const)));
  const entries = inventory.map((entry) => {
    const alternates = migrated.get(entry.loc);
    const links = alternates
      ? Object.entries(alternates).map(([hreflang, path]) => ({ rel: 'alternate', hreflang, href: new URL(path, site).href }))
      : entry.alternates ?? [];
    const fields = Object.entries(entry).filter(([key]) => key !== 'alternates')
      .map(([key, value]) => `    <${key}>${escape(value as string)}</${key}>`).join('\n');
    const languages = links.map((attrs) => `    <xhtml:link ${Object.entries(attrs).map(([key, value]) => `${key}="${escape(value)}"`).join(' ')}/>`).join('\n');
    return `  <url>\n${fields}\n${languages}\n  </url>`;
  });
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>\n`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
