import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { parseCsv } from '../src/lib/geo-measurement.mjs';

const input = process.argv[2];
if (!input) throw new Error('Usage: node scripts/geo-clicks-report.mjs normalized-events.csv [output.md]');
const rows = parseCsv(readFileSync(input, 'utf8'));
const groups = new Map();
let legacy = 0, excluded = 0;
for (const row of rows) {
  if (row.event_name !== 'store_click') { excluded++; continue; }
  if (!['true', 'false'].includes(row.test)) throw new Error('test must explicitly be true or false');
  if (row.test === 'true') { excluded++; continue; }
  if (!row.acquisition_definition) { legacy++; continue; }
  if (row.acquisition_definition !== 'observed-source-v1') throw new Error('Unknown acquisition definition; analyze separately');
  if (row.acquisition_channel !== 'ai') continue;
  if (!['chatgpt', 'perplexity', 'claude', 'gemini', 'copilot'].includes(row.ai_provider)) throw new Error('Unknown AI provider');
  if (!['app_store', 'google_play'].includes(row.store) || !row.landing_page?.startsWith('/') || !row.locale) throw new Error('Missing store, landing page or locale');
  for (const key of ['first_store_click', 'first_link_click']) if (!['true', 'false'].includes(row[key])) throw new Error(`${key} must be true or false`);
  const key = JSON.stringify([row.ai_provider, row.locale, row.landing_page, row.store]);
  if (!groups.has(key)) groups.set(key, { dimensions: [row.ai_provider, row.locale, row.landing_page, row.store], clicks: 0, first: 0, direct: 0 });
  const group = groups.get(key);
  group.clicks++; group.first += Number(row.first_store_click === 'true'); group.direct += Number(row.first_link_click === 'true');
}
const cell = (value) => String(value).replaceAll('|', '\\|').replaceAll('\n', ' ');
const lines = ['# Clics store attribués aux assistants IA', '', `Source : ${input}`, '',
  '| Assistant | Langue | Page d’arrivée | Store | Clics | Premiers clics store | Store dès le premier lien |',
  '| --- | --- | --- | --- | --- | --- | --- |'];
for (const group of groups.values()) lines.push('| ' + [...group.dimensions, group.clicks, group.first, group.direct].map(cell).join(' | ') + ' |');
if (!groups.size) lines.push('', 'Aucun événement IA exploitable dans ce fichier. Cela ne prouve pas une absence de trafic IA.');
lines.push('', `${excluded} lignes exclues (tests/autres événements). ${legacy} anciens événements non reclassés automatiquement.`, '',
  'Signaux UTM/référent observés, pas preuves de citations. Les premiers clics utilisent le contexte navigateur, pas une session Umami. Aucun taux par visite ni nombre d’installations n’est calculé.', '');
const output = process.argv[3] ?? 'artifacts/geo/bilan-clics.md';
mkdirSync(dirname(output), { recursive: true }); writeFileSync(output, lines.join('\n')); console.log(output);
