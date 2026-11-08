# Migration Astro — issue #90

Astro produit les fichiers statiques dans GitHub Actions ; GitHub Pages les sert. Les commandes `dev` et `preview` sont uniquement locales. Aucun serveur applicatif, base de données ou CMS distant n’est requis en production.

## Périmètre

Référence avant migration : `3c1cb3838d9b6201d3345f03d3dac68d0dade575`.

| Famille | FR | EN | ES | PT |
|---|---|---|---|---|
| Accueil | `/` | `/en/` | `/es/` | `/pt/` |
| Couples | `/for-couples/` | `/en/for-couples/` | `/es/for-couples/` | `/pt/para-casais/` |
| Comparatif | `/vs-dipsea/` | `/en/vs-dipsea/` | `/es/vs-dipsea/` | `/pt/vs-dipsea/` |
| Article | `/blog/raviver-la-flamme-couple/` | `/en/blog/rekindle-relationship-spark/` | `/es/blog/reavivar-la-llama-en-pareja/` | `/pt/blog/reacender-conexao-casal/` |

Les 210 autres pages et tous les assets sont déplacés dans `public/`, sans changement de leurs URL ni de leurs octets. Les documents de travail et tests restent hors du répertoire publié. L’inventaire du sitemap conserve ses 196 entrées : cette migration n’ajoute pas les pages absentes du sitemap initial.

## Édition

1. Chercher l’URL dans `src/data/routes.json` pour trouver sa famille et sa langue.
2. Ouvrir `src/content/pages/<famille>.<langue>.json`.
3. Modifier le titre, les métadonnées ou les blocs concernés. `intro`, `cards` et `faq` utilisent des composants communs. Les blocs `html` et `markdown` renvoient vers `src/content/blocks/`.
4. L’article pilote contient des paragraphes et titres Markdown, avec les cartes HTML existantes conservées. Les fragments des autres pages conservent leur HTML spécifique.
5. Propager les changements éditoriaux aux traductions concernées, puis exécuter `npm test` et `npm run build` et prévisualiser.

Le HTML des données et fragments est du contenu éditorial de confiance, versionné dans Git ; il n’est jamais alimenté par une saisie visiteur.

Canonical et hreflang proviennent du registre des routes. Le sitemap utilise ce registre pour les pages migrées et l’inventaire conservé pour les autres. Les variantes Open Graph/Twitter, les schémas et les dates existantes restent spécifiques aux pages.

Le JSON-LD `FAQPage` d’un bloc FAQ structuré est généré depuis ses questions/réponses visibles : une seule modification suffit. Les autres JSON-LD restent dans `schemas` et doivent être vérifiés lors des changements éditoriaux.

## Créer une page

```sh
npm run page:new -- nouvelle-occasion fr /nouvelle-occasion/ couples.fr
npm run page:new -- nouvelle-occasion en /en/new-occasion/ couples.en
```

La famille regroupe les traductions ; le modèle doit être dans la même langue que la nouvelle page. La commande copie les données et les contenus propres à la page, réutilise la présentation commune, ajoute l’URL au sitemap et met à jour les hreflang réciproques. Les langues pas encore créées ne sont pas affichées.

Adapter ensuite textes, titre, description, Open Graph/Twitter, noms/descriptions des schémas, fil d’Ariane et liens contextuels copiés. La commande ne traduit ni ne rédige. Le canonical et les références de schéma pointant exactement vers l’ancienne URL sont remplacés automatiquement. Une nouvelle variante analytics est attribuée à la famille.

## Éléments partagés

- Structure : `src/components/` et `src/layouts/SitePage.astro`.
- Boutons des introductions structurées : `StoreLink.astro` et `src/data/stores.json`. Les autres liens historiques restent inchangés pendant le pilote.
- Navigation/footer : fichiers de `src/data/chrome/`, référencés par `header` et `footer` dans les pages. Les variantes existantes sont conservées, même lorsqu’elles diffèrent légèrement.
- Styles : `src/styles/`. Les styles identiques entre langues sont mutualisés et les différences conservées. Ils sont injectés tels quels, sans scope Astro ni nouvelle feuille globale.

Respecter `SEO-GOLDEN-RULE.md` : préserver libellés et destinations des CTA, bascule Android, variantes analytics et scripts pendant cette migration technique.

## Comparaison avant/après

```sh
npm run build
npm run test:parity
python -m pip install -r requirements-test.txt
python -m playwright install chromium
npm run test:browser
```

Le commit de référence doit exister localement ; la CI utilise `fetch-depth: 0`. `BASELINE_REF` sélectionne une autre référence. `BASELINE_DIR` fournit éventuellement un checkout déjà extrait. `CHROMIUM_EXECUTABLE` permet d’utiliser un Chromium installé localement.

- `test:parity` vérifie la présence de tous les fichiers publics de référence, l’identité binaire des assets/pages non migrées et l’égalité du DOM des pages migrées et du sitemap. Il ignore commentaires, espaces de formatage et ordre des éléments du head ; il compare métadonnées, JSON-LD, CSS et scripts.
- `test:browser` compare les 16 pages en desktop 1440 px et Android 390 px : captures complètes, pixels, titres, liens, images et instantanés d’accessibilité. Il vérifie aussi l’attribution UTM après navigation accueil → couples puis clic store, dans les quatre langues et sur les deux profils.
- Ressources externes et lecture de médias sont bloquées identiquement. Les requêtes vers le domaine de production sont interceptées ; Umami est remplacé par un collecteur local. Aucun événement de production n’est envoyé. Ce protocole n’est pas un audit Lighthouse, un test d’écoute audio ou un test sur appareils physiques.
- Rapports JSON et captures sont écrits dans `artifacts/` et joints à la CI. Un écart fait échouer le workflow avant déploiement.

Ces comparaisons figent le contenu du pilote pour valider sa migration. Une évolution éditoriale volontaire exige une mise à jour explicite du périmètre ou de la référence ; ne pas masquer les écarts en assouplissant les assertions. La généralisation attend la validation du pilote.

## Tokens et coûts

La factorisation ne prouve pas un gain de tokens. Comparer les mêmes tâches : modifier un texte, créer une page et propager une correction commune. Enregistrer modèle, prompt, tokens entrée/sortie, tarifs et temps passé. Aucun coût réel n’est déduit des caractères ou du nombre de fichiers. Les tailles HTML du rapport de parité mesurent une autre chose.

## Publication et retour arrière

La source GitHub Pages doit être « GitHub Actions ». Le workflow déploie uniquement sur `main_v2`, après validation. Les PR ne publient pas le site. Seul `dist/` est envoyé ; sources, dépendances et tests ne sont pas servis.

Pour revenir en arrière, rétablir le commit voulu et son mode de publication compatible. La référence antérieure est du HTML directement publiable. Conserver le domaine et les URL, ainsi que `public/CNAME` pour la version Astro.
