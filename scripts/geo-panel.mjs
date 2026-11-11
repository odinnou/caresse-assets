import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { formatCsv, parseCsv, resultColumns, summarizePanel } from '../src/lib/geo-measurement.mjs';

const [command, ...args] = process.argv.slice(2);
const option = (key, fallback) => args.find((arg) => arg.startsWith(`--${key}=`))?.slice(key.length + 3) ?? fallback;
const panel = parseCsv(readFileSync('docs/geo/panel-questions.csv', 'utf8'));
const save = (path, value) => { mkdirSync(dirname(path), { recursive: true }); writeFileSync(path, value); console.log(path); };

if (command === 'prepare') {
  const cadence = option('cadence', 'hebdomadaire');
  if (!['hebdomadaire', 'mensuel', 'tous'].includes(cadence)) throw new Error('Unknown cadence');
  const engines = [...new Set(option('moteurs', 'chatgpt,perplexity').split(',').map((name) => name.trim()).filter(Boolean))];
  if (!engines.length) throw new Error('At least one engine is required');
  const rows = panel.filter((question) => cadence === 'tous' || cadence === 'mensuel' || question.cadence === cadence)
    .flatMap((question) => engines.flatMap((engine) => ['1', '2'].map((attempt) => ({
      moteur: engine, locale: question.locale, question_id: question.id, repetition: attempt,
      statut_execution: 'non_execute', question: question.question, page_cible: question.page_cible
    }))));
  save(option('out', 'artifacts/geo/releve-a-remplir.csv'), formatCsv([...resultColumns, 'question', 'page_cible'], rows));
  console.log(`${rows.length} attempts prepared; no model has been queried.`);
} else if (command === 'report') {
  const path = option('input', 'docs/geo/resultats-modele.csv');
  const result = summarizePanel(panel, parseCsv(readFileSync(path, 'utf8')));
  const rate = (value, total) => total ? `${value}/${total} (${(value / total * 100).toFixed(1)} %)` : 'Non mesuré';
  const escape = (value) => String(value).replaceAll('|', '\\|').replaceAll('\n', ' ');
  const lines = ['# Bilan du panel GEO', '', `Source : ${path}`, '',
    `Questions sans essai exécuté : ${result.untestedQuestions.length}/${panel.length}. Tentatives non exécutées : ${result.missingRows}. Échecs techniques : ${result.failedRows}.`, '',
    'Les questions de marque et le contrôle négatif sont séparés de la découverte. Une donnée manquante ne vaut pas zéro citation.', '',
    '| Date UTC | Moteur | Version | Recherche | Langue | Pays | Mentions / découverte | Citations / découverte | Erreurs / réponses Caresse | Essais marque | Contrôles négatifs / erreurs |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |'];
  for (const group of result.groups) lines.push('| ' + [...group.dimensions, rate(group.mentions, group.discovery), rate(group.citations, group.discovery), rate(group.productErrors, group.caresseResponses), group.brand, `${group.negative} / ${group.negativeErrors}`].map(escape).join(' | ') + ' |');
  if (!result.groups.length) lines.push('', '**Aucune réponse IA mesurée. Aucun taux de citation calculable.**');
  lines.push('', 'Questions non testées : ' + (result.untestedQuestions.join(', ') || 'aucune') + '.', '', 'Les recherches web et contrôles HTTP sont consignés séparément. Ce bilan ne mesure ni les visites ni les installations.', '');
  save(option('out', 'artifacts/geo/bilan-panel.md'), lines.join('\n'));
} else throw new Error('Usage: node scripts/geo-panel.mjs prepare|report [--option=value]');
