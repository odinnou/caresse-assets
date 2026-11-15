import assert from 'node:assert/strict';
import test from 'node:test';
import { findForbiddenLinks } from '../scripts/check-no-competitor-links.mjs';

test('competitor destinations are rejected in comparisons and elsewhere, including source citations', () => {
  for (const path of ['/vs-adesira/', '/en/alternatives/', '/blog/research/']) {
    for (const href of ['https://adesira.com/', '//www.femtasy.com/', 'https://adesira.com/blog/research', 'https://www.femtasy.com/blog/research']) {
      assert.equal(findForbiddenLinks(`<a href="${href}" rel="nofollow">Source</a>`, path).length, 1, `${path}: ${href}`);
    }
  }
  assert.equal(findForbiddenLinks('<a href="https://adesira&#46;com/">Source</a>').length, 1);
  assert.equal(findForbiddenLinks('<template><a href="https://adesira.com/">Source</a></template>').length, 1);
});

test('store and social hosts do not allow competing app listings or profiles', () => {
  for (const href of ['https://apps.apple.com/fr/app/other/id123456', 'https://play.google.com/store/apps/details?id=other.app', 'https://www.instagram.com/other', 'https://x.com/app_caresse_other']) {
    assert.equal(findForbiddenLinks(`<a href="${href}">App</a>`).length, 1, href);
  }
});

test('internal comparison links remain allowed inside and outside tables', () => {
  assert.deepEqual(findForbiddenLinks('<table><tr><td><a href="/en/vs-melba/">Melba</a></td></tr></table>', '/en/alternatives/'), []);
  assert.deepEqual(findForbiddenLinks('<table><tr><td>Melba</td></tr></table><a href="/en/vs-melba/">Caresse vs Melba</a>', '/en/alternatives/'), []);
});

test('Caresse links and reviewed non-competing sources remain usable', () => {
  for (const href of ['/vs-adesira/', 'https://apps.apple.com/fr/app/caresse/id6758887086?l=fr-FR', 'https://play.google.com/store/apps/details?id=studio.mokuton.caresse', 'https://www.instagram.com/caresse.app', 'mailto:contact@caresse.app']) {
    assert.deepEqual(findForbiddenLinks(`<a href="${href}">Caresse</a>`, '/vs-adesira/'), [], href);
  }
  assert.deepEqual(findForbiddenLinks('<a href="https://www.cnil.fr/fr/ia">CNIL</a>', '/blog/research/'), []);
  assert.deepEqual(findForbiddenLinks('<a href="https://www.cnil.fr/fr/ia">CNIL</a>', '/vs-adesira/'), []);
});

test('reviewed study citations remain allowed without opening commercial pages', () => {
  for (const href of ['https://tawkify.com/blog/dating/scheduling-intimacy', 'https://www.connectedcouples.app/blog/relationship-statistics']) {
    assert.deepEqual(findForbiddenLinks(`<a href="${href}">Study</a>`, '/blog/research/'), [], href);
  }
  for (const href of ['https://tawkify.com/', 'https://www.connectedcouples.app/pricing']) {
    assert.equal(findForbiddenLinks(`<a href="${href}">Offer</a>`, '/blog/research/').length, 1, href);
  }
});
