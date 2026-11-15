import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'parse5';

const ownHosts = new Set(['caresse.app', 'mokuton.studio']);
const socialProfiles = new Map([
  ['x.com', '/app_caresse'], ['instagram.com', '/caresse.app'],
  ['youtube.com', '/@app.caresse'], ['tiktok.com', '/@caresse.app'],
]);
// Sources already reviewed as non-competing editorial or institutional references.
// New external destinations require an explicit review before joining this list.
const editorialHosts = new Set([
  'converteo.com', 'talan.com', 'groupe-vyv.fr', 'cbnews.fr', 'mckinsey.com',
  'salesforce.com', 'newsroom.cisco.com', 'cnil.fr', 'asu.elsevierpure.com',
  'emarketer.com', 'pewresearch.org', 'podnews.net', 'ec.europa.eu',
  'itreseller.es', 'news.microsoft.com', 'prnoticias.com', 'iabspain.es',
]);
// These existing study citations are editorial references, not alternatives to Caresse.
// Only the cited articles are allowed, never the services' commercial pages.
const studyPaths = new Map([
  ['tawkify.com', '/blog/dating/scheduling-intimacy'],
  ['connectedcouples.app', '/blog/relationship-statistics'],
]);
const ownPath = (path, profile) => path === profile || path.startsWith(profile + '/');

function allowedDestination(url) {
  const host = url.hostname.toLowerCase().replace(/\.$/, '').replace(/^www\./, '');
  if (ownHosts.has(host)) return true;
  if (url.protocol !== 'https:') return false;
  if (host === 'apps.apple.com') return /\/id6758887086\/?$/.test(url.pathname);
  if (host === 'play.google.com') return url.pathname === '/store/apps/details' && url.searchParams.get('id') === 'studio.mokuton.caresse';
  if (socialProfiles.has(host)) return ownPath(url.pathname, socialProfiles.get(host));
  if (host === 'medium.com') return ownPath(url.pathname, '/@odinnou');
  if (studyPaths.has(host)) return url.pathname.replace(/\/$/, '') === studyPaths.get(host);
  return editorialHosts.has(host);
}

export function findForbiddenLinks(html, path = '/') {
  const failures = [];
  const document = parse(html);
  function walk(node) {
    if (node.tagName === 'a' || node.tagName === 'area') {
      const href = node.attrs.find(({ name }) => name === 'href')?.value;
      if (href) {
        try {
          const url = new URL(href, 'https://caresse.app' + path);
          if (!['mailto:', 'tel:'].includes(url.protocol)) {
            if (!['http:', 'https:'].includes(url.protocol) || !allowedDestination(url)) {
              failures.push(`unapproved external destination: ${href}`);
            }
          }
        } catch {
          failures.push(`invalid destination: ${href}`);
        }
      }
    }
    for (const child of node.childNodes ?? []) walk(child);
    // Include inert template markup so a later script cannot expose an unchecked link.
    if (node.content) walk(node.content);
  }
  walk(document);
  return failures;
}

export function checkBuiltLinks(directory = 'dist') {
  let count = 0;
  const failures = [];
  function visit(dir, prefix = '/') {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const file = join(dir, entry.name);
      const path = prefix + entry.name;
      if (entry.isDirectory()) visit(file, path + '/');
      else if (entry.name.endsWith('.html')) {
        count++;
        for (const reason of findForbiddenLinks(readFileSync(file, 'utf8'), path)) failures.push(`${path}: ${reason}`);
      }
    }
  }
  visit(directory);
  if (failures.length) throw new Error(`Forbidden links in generated site:\n${failures.join('\n')}`);
  return count;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(`Competitor-link policy verified across ${checkBuiltLinks()} generated HTML pages.`);
}
