/** Small CSV reader shared by the offline GEO workflow; no network or model calls. */
export function parseCsv(input) {
  const rows = [];
  let row = [], cell = '', quoted = false, closed = false;
  const source = input.replace(/^\uFEFF/u, '');
  for (let i = 0; i < source.length; i++) {
    const char = source[i];
    if (quoted) {
      if (char === '"' && source[i + 1] === '"') { cell += '"'; i++; }
      else if (char === '"') { quoted = false; closed = true; }
      else cell += char;
    } else if (char === '"') {
      if (cell || closed) throw new Error('Invalid CSV quote');
      quoted = true;
    } else if (char === ',' || char === '\n' || char === '\r') {
      row.push(cell); cell = ''; closed = false;
      if (char !== ',') {
        if (row.some((value) => value !== '')) rows.push(row);
        row = [];
        if (char === '\r' && source[i + 1] === '\n') i++;
      }
    } else {
      if (closed) throw new Error('Unexpected text after a CSV quote');
      cell += char;
    }
  }
  if (quoted) throw new Error('Unterminated CSV quote');
  if (cell || row.length || closed) { row.push(cell); rows.push(row); }
  if (!rows.length) throw new Error('CSV header missing');
  const [headers, ...values] = rows;
  if (headers.some((key) => !key) || new Set(headers).size !== headers.length) throw new Error('Invalid CSV header');
  return values.map((values, index) => {
    if (values.length !== headers.length) throw new Error(`CSV row ${index + 2}: wrong number of cells`);
    return Object.fromEntries(headers.map((key, i) => [key, values[i]]));
  });
}

export function formatCsv(headers, rows) {
  const cell = (value) => /[",\r\n]/u.test(String(value ?? '')) ? '"' + String(value).replaceAll('"', '""') + '"' : String(value ?? '');
  return [headers, ...rows.map((row) => headers.map((key) => row[key] ?? ''))].map((row) => row.map(cell).join(',')).join('\n') + '\n';
}

export const resultColumns = ['date_utc', 'moteur', 'version_affichee', 'mode_recherche', 'locale', 'pays', 'question_id', 'repetition', 'statut_execution', 'marque_mentionnee', 'url_caresse_citee', 'urls_citees', 'erreur_produit', 'description_erreur', 'reference_capture'];

export function summarizePanel(panel, results) {
  const questions = new Map(panel.map((question) => [question.id, question]));
  if (questions.size !== panel.length || panel.some((question) => !question.id || !['dans_offre', 'verification_marque', 'hors_offre'].includes(question.eligibilite_caresse))) throw new Error('Invalid question panel');
  const groups = new Map(), seen = new Set(), executed = new Set();
  let missing = 0, failed = 0;
  const boolean = (value, field) => {
    if (!['true', 'false'].includes(value)) throw new Error(`${field}: expected true or false`);
    return value === 'true';
  };
  for (const row of results) {
    const question = questions.get(row.question_id);
    if (!question || row.locale !== question.locale) throw new Error(`Unknown question or locale: ${row.question_id}`);
    if (row.statut_execution === 'non_execute') { missing++; continue; }
    if (row.statut_execution === 'erreur') { failed++; continue; }
    if (row.statut_execution !== 'execute') throw new Error('statut_execution: expected execute, non_execute or erreur');
    for (const key of ['date_utc', 'moteur', 'version_affichee', 'mode_recherche', 'pays', 'reference_capture']) {
      if (!row[key]?.trim()) throw new Error(`${row.question_id}: missing ${key}`);
    }
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|\+00:00)$/u.test(row.date_utc) || !Number.isFinite(Date.parse(row.date_utc)) || new Date(row.date_utc).toISOString().slice(0, 10) !== row.date_utc.slice(0, 10)) throw new Error('date_utc: valid UTC timestamp required');
    if (!['1', '2'].includes(row.repetition)) throw new Error('repetition: expected 1 or 2');
    const mentioned = boolean(row.marque_mentionnee, 'marque_mentionnee');
    const productError = boolean(row.erreur_produit, 'erreur_produit');
    let cited = false;
    if (row.url_caresse_citee) {
      const url = new URL(row.url_caresse_citee);
      if (url.protocol !== 'https:' || !['caresse.app', 'www.caresse.app'].includes(url.hostname)) throw new Error('url_caresse_citee: a real Caresse HTTPS URL is required');
      cited = true;
    }
    if (productError && (!row.description_erreur?.trim() || !(mentioned || cited))) throw new Error('Product errors need a Caresse response and an explanation');
    // Do not merge dates, model versions, countries or search modes into one rate.
    const dimensions = [row.date_utc.slice(0, 10), row.moteur, row.version_affichee, row.mode_recherche, row.locale, row.pays];
    const groupKey = JSON.stringify(dimensions);
    const attemptKey = JSON.stringify([...dimensions, row.question_id, row.repetition]);
    if (seen.has(attemptKey)) throw new Error(`Duplicate attempt: ${row.question_id}`);
    seen.add(attemptKey); executed.add(row.question_id);
    if (!groups.has(groupKey)) groups.set(groupKey, { dimensions, discovery: 0, mentions: 0, citations: 0, brand: 0, negative: 0, negativeErrors: 0, caresseResponses: 0, productErrors: 0 });
    const group = groups.get(groupKey);
    if (question.eligibilite_caresse === 'dans_offre') {
      group.discovery++; group.mentions += Number(mentioned); group.citations += Number(cited);
    } else if (question.eligibilite_caresse === 'verification_marque') group.brand++;
    else { group.negative++; group.negativeErrors += Number(productError); }
    group.caresseResponses += Number(mentioned || cited);
    group.productErrors += Number(productError);
  }
  return { groups: [...groups.values()], missingRows: missing, failedRows: failed, untestedQuestions: panel.filter((q) => !executed.has(q.id)).map((q) => q.id) };
}
