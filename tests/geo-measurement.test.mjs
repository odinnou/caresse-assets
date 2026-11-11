import assert from 'node:assert/strict';
import test from 'node:test';
import { formatCsv, parseCsv, summarizePanel } from '../src/lib/geo-measurement.mjs';

const panel = [
  { id: 'FR01', locale: 'fr', eligibilite_caresse: 'dans_offre' },
  { id: 'FR07', locale: 'fr', eligibilite_caresse: 'verification_marque' },
  { id: 'DE02', locale: 'de', eligibilite_caresse: 'hors_offre' }
];
const result = (changes = {}) => ({ date_utc: '2026-11-10T21:00:00Z', moteur: 'test-engine', version_affichee: 'v1', mode_recherche: 'web', locale: 'fr', pays: 'FR', question_id: 'FR01', repetition: '1', statut_execution: 'execute', marque_mentionnee: 'true', url_caresse_citee: 'https://caresse.app/for-couples/', urls_citees: '', erreur_produit: 'false', description_erreur: '', reference_capture: 'fixture-not-a-real-answer', ...changes });

test('CSV preserves quoted commas, line breaks, escaped quotes and empty values', () => {
  const rows = [{ question: 'Une "voix", à deux\nSans abonnement ?', url: '' }];
  assert.deepEqual(parseCsv('\uFEFF' + formatCsv(['question', 'url'], rows).replaceAll('\n', '\r\n')), [{ question: 'Une "voix", à deux\r\nSans abonnement ?', url: '' }]);
  for (const source of ['a,a\n1,2\n', 'a,b\n1\n', 'a\n"unfinished', 'a\n"ok"bad']) assert.throws(() => parseCsv(source));
});

test('unexecuted questions and failed retrievals never become zero citations', () => {
  const empty = summarizePanel(panel, []);
  assert.deepEqual(empty.groups, []);
  assert.equal(empty.untestedQuestions.length, 3);
  const absent = summarizePanel(panel, [result({ statut_execution: 'non_execute' }), result({ statut_execution: 'erreur' })]);
  assert.equal(absent.groups.length, 0);
  assert.equal(absent.missingRows, 1);
  assert.equal(absent.failedRows, 1);
  assert.equal(absent.untestedQuestions.length, 3);
});

test('brand checks and negative German control stay outside the discovery denominator', () => {
  const summary = summarizePanel(panel, [result(), result({ question_id: 'FR07' }), result({ question_id: 'DE02', locale: 'de', marque_mentionnee: 'false', url_caresse_citee: '' })]);
  const french = summary.groups.find((group) => group.dimensions[4] === 'fr');
  assert.equal(french.discovery, 1);
  assert.equal(french.citations, 1);
  assert.equal(french.brand, 1);
  const german = summary.groups.find((group) => group.dimensions[4] === 'de');
  assert.equal(german.discovery, 0);
  assert.equal(german.negative, 1);
  assert.equal(german.negativeErrors, 0);
});

test('separates model versions, countries, dates and search modes', () => {
  const rows = [result(), result({ version_affichee: 'v2' }), result({ pays: 'BE' }), result({ mode_recherche: 'sans_web' }), result({ date_utc: '2026-11-11T21:00:00Z' })];
  assert.equal(summarizePanel(panel, rows).groups.length, 5);
  assert.throws(() => summarizePanel(panel, [result(), result({ date_utc: '2026-11-10T22:00:00Z' })]), /Duplicate/);
});

test('rejects unverifiable answers, spoofed citation hosts and ambiguous result values', () => {
  for (const changes of [
    { reference_capture: '' }, { version_affichee: '' }, { marque_mentionnee: '' },
    { question_id: 'invented' }, { locale: 'en' }, { repetition: '3' },
    { date_utc: 'not-a-date' }, { date_utc: '2026-02-30T21:00:00Z' },
    { url_caresse_citee: 'https://caresse.app.example.com/' },
    { erreur_produit: 'true', description_erreur: '' }
  ]) assert.throws(() => summarizePanel(panel, [result(changes)]));
});
