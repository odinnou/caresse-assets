import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { formatCsv, parseCsv } from '../src/lib/geo-measurement.mjs';

function directory(t) {
  const path = mkdtempSync(join(tmpdir(), 'caresse-geo-'));
  t.after(() => rmSync(path, { recursive: true, force: true }));
  return path;
}
const run = (script, args) => spawnSync(process.execPath, [script, ...args], { encoding: 'utf8' });

test('panel targets real translations and discovery questions do not include the Caresse brand', () => {
  const panel = parseCsv(readFileSync('docs/geo/panel-questions.csv', 'utf8'));
  const routes = JSON.parse(readFileSync('src/data/routes.json', 'utf8'));
  assert.equal(new Set(panel.map((question) => question.id)).size, panel.length);
  for (const question of panel) {
    // EN08 explicitly asks whether the German website implies German app audio.
    const targetLocale = question.id === 'EN08' ? 'de' : question.locale;
    assert.ok(Object.values(routes).some((family) => family[targetLocale]?.path === question.page_cible), question.id);
    assert.ok(['hebdomadaire', 'mensuel'].includes(question.cadence), question.id);
    if (question.eligibilite_caresse === 'dans_offre') assert.doesNotMatch(question.question, /caresse/iu, question.id);
    if (question.eligibilite_caresse === 'verification_marque') assert.match(question.question, /caresse/iu, question.id);
  }
});

test('prepares two independent unexecuted attempts without fabricating model responses', (t) => {
  const output = join(directory(t), 'queue.csv');
  const result = run('scripts/geo-panel.mjs', ['prepare', '--moteurs=test-only', '--cadence=tous', '--out=' + output]);
  assert.equal(result.status, 0, result.stderr);
  const rows = parseCsv(readFileSync(output, 'utf8'));
  assert.equal(rows.length, 80);
  assert.deepEqual([...new Set(rows.map((row) => row.locale))].sort(), ['de', 'en', 'es', 'fr', 'pt']);
  for (const row of rows) {
    assert.equal(row.statut_execution, 'non_execute');
    assert.equal(row.date_utc, '');
    assert.equal(row.url_caresse_citee, '');
    assert.ok(row.question && row.page_cible.startsWith('/'));
  }
  assert.deepEqual(rows.filter((row) => row.question_id === 'DE02').map((row) => row.repetition), ['1', '2']);
});

test('an empty response template produces a missing-data report, not a fabricated citation rate', (t) => {
  const output = join(directory(t), 'report.md');
  const result = run('scripts/geo-panel.mjs', ['report', '--out=' + output]);
  assert.equal(result.status, 0, result.stderr);
  const report = readFileSync(output, 'utf8');
  assert.match(report, /40\/40/);
  assert.match(report, /Aucune réponse IA mesurée/);
  assert.doesNotMatch(report, /\(0\.0 %\)/);
});

test('click reporting excludes tests and legacy events and does not pretend clicks are installs', (t) => {
  const root = directory(t), input = join(root, 'events.csv'), output = join(root, 'report.md');
  const event = { event_name: 'store_click', test: 'false', acquisition_definition: 'observed-source-v1', acquisition_channel: 'ai', ai_provider: 'perplexity', locale: 'fr', landing_page: '/for-couples/', store: 'app_store', first_store_click: 'true', first_link_click: 'true' };
  writeFileSync(input, formatCsv(Object.keys(event), [event, { ...event, first_store_click: 'false', first_link_click: 'false' }, { ...event, test: 'true' }, { ...event, acquisition_definition: '' }]));
  const result = run('scripts/geo-clicks-report.mjs', [input, output]);
  assert.equal(result.status, 0, result.stderr);
  const report = readFileSync(output, 'utf8');
  assert.match(report, /perplexity \| fr \| \/for-couples\/ \| app_store \| 2 \| 1 \| 1/);
  assert.match(report, /1 lignes exclues/);
  assert.match(report, /1 anciens événements/);
  assert.match(report, /Aucun taux par visite ni nombre d’installations/);
  writeFileSync(input, formatCsv(Object.keys(event), [{ ...event, test: '' }]));
  assert.notEqual(run('scripts/geo-clicks-report.mjs', [input, output]).status, 0);
});
