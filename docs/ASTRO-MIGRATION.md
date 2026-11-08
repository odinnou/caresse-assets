# Migration Astro — issue #90

Astro produit les fichiers statiques dans GitHub Actions ; GitHub Pages les sert. Les commandes `dev` et `preview` sont uniquement locales. Aucun serveur applicatif, base de données ou CMS distant n’est requis en production.

## Périmètre

Référence avant migration : `3c1cb3838d9b6201d3345f03d3dac68d0dade575`.

Exemples de familles initialement validées dans le pilote :

| Famille | FR | EN | ES | PT |
|---|---|---|---|---|
| Accueil | `/` | `/en/` | `/es/` | `/pt/` |
| Couples | `/for-couples/` | `/en/for-couples/` | `/es/for-couples/` | `/pt/para-casais/` |
| Comparatif | `/vs-dipsea/` | `/en/vs-dipsea/` | `/es/vs-dipsea/` | `/pt/vs-dipsea/` |
| Article | `/blog/raviver-la-flamme-couple/` | `/en/blog/rekindle-relationship-spark/` | `/es/blog/reavivar-la-llama-en-pareja/` | `/pt/blog/reacender-conexao-casal/` |

Après validation du pilote, les 210 autres pages ont été migrées avec le même protocole. Astro génère maintenant les 226 URL historiques : 196 pages du sitemap, 16 documents légaux en `noindex`, 4 pages de téléchargement hors sitemap et 10 anciennes URL de démos qui redirigent. Tous les assets et fichiers publics de configuration restent dans `public/`, sans changement de leurs octets. Les documents de travail et tests restent hors du répertoire publié. Le sitemap conserve exactement ses 196 entrées : cette migration n’ajoute pas les pages historiquement absentes.

## Édition

1. Chercher l’URL dans `src/data/routes.json` pour trouver sa famille et sa langue.
2. Ouvrir `src/content/pages/<famille>.<langue>.json`.
3. Modifier le titre, les métadonnées ou les blocs concernés. `intro`, `cards` et `faq` utilisent des composants communs. Un bloc `container` regroupe d’autres blocs dans `blocks` ; un bloc `element` contient une balise, ses attributs et son contenu éditable `html`. Les blocs `html` et `markdown` renvoient vers `src/content/blocks/`.
4. L’article pilote contient des paragraphes et titres Markdown. Les autres pages utilisent des données structurées et des fragments propres aux éléments qui nécessitent leur HTML spécifique. Les scripts partagés sont référencés dans `src/content/scripts/` ; ils ne doivent pas être recopiés pour modifier un texte.
5. Propager les changements éditoriaux aux traductions concernées, puis exécuter `npm test` et `npm run build` et prévisualiser.

Le HTML des données et fragments est du contenu éditorial de confiance, versionné dans Git ; il n’est jamais alimenté par une saisie visiteur.

Canonical et hreflang proviennent du registre des routes. Les redirections conservent leur canonical vers la nouvelle URL ; les documents légaux conservent leur absence de canonical/hreflang. `sitemap: false` préserve les exclusions historiques sans ajouter ces pages au sitemap. L’ordre des éléments du head est conservé par `headOrder` sur les pages ajoutées après le pilote. Les variantes Open Graph/Twitter, les schémas et les dates existantes restent spécifiques aux pages.

Le JSON-LD `FAQPage` d’un bloc FAQ structuré est généré depuis ses questions/réponses visibles : une seule modification suffit. Les autres JSON-LD restent dans `schemas` et doivent être vérifiés lors des changements éditoriaux.

## Créer une page

```sh
npm run page:new -- nouvelle-occasion fr /nouvelle-occasion/ couples.fr
npm run page:new -- nouvelle-occasion en /en/new-occasion/ couples.en
```

La famille regroupe les traductions ; le modèle doit être une page de contenu indexée dans la même langue que la nouvelle page. Les documents légaux, redirections et pages de téléchargement de secours ne servent pas de modèles SEO. La commande copie les données et les contenus propres à la page, y compris les fragments imbriqués, réutilise la présentation commune, ajoute l’URL au sitemap et met à jour les hreflang réciproques. Les langues pas encore créées ne sont pas affichées.

Adapter ensuite textes, titre, description, Open Graph/Twitter, noms/descriptions des schémas, fil d’Ariane et liens contextuels copiés. La commande ne traduit ni ne rédige. Le canonical et les références de schéma pointant exactement vers l’ancienne URL sont remplacés automatiquement. Une nouvelle variante analytics est attribuée à la famille.

## Éléments partagés

- Structure : `src/components/`, `src/layouts/SitePage.astro` pour le pilote et `src/layouts/ComposedPage.astro` pour les compositions complètes.
- Boutons des introductions structurées : `StoreLink.astro` et `src/data/stores.json`. Les autres liens historiques conservent leurs attributs et destinations.
- Navigation/footer : fichiers de `src/data/chrome/`, référencés par `header` et `footer` ou par les blocs correspondants. `Markup.astro` conserve les différentes structures de navigation et résout leurs liens de langue depuis le registre des routes. Les variantes existantes sont conservées, même lorsqu’elles diffèrent légèrement.
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

Dans un environnement où le dossier personnel n’est pas accessible en écriture, utiliser un cache npm temporaire et désactiver la télémétrie de l’outil Astro pour éviter ses écritures de configuration :

```sh
npm_config_cache=/tmp/caresse-npm-cache npm ci
npm test
ASTRO_TELEMETRY_DISABLED=1 npm run build
```

Ces réglages ne modifient ni le verrouillage des dépendances ni les scripts analytics du site. Le registre `registry.npmjs.org` doit être autorisé pour les métadonnées et les archives des paquets.

- `test:parity` vérifie la présence de tous les fichiers publics de référence, l’identité binaire des assets/pages non migrées et l’égalité du DOM des pages migrées et du sitemap. Il ignore commentaires, espaces de formatage et ordre des éléments du head ; il compare métadonnées, JSON-LD, CSS et scripts.
- `test:browser` compare les 226 URL en desktop 1440 px et Android 390 px, soit 452 comparaisons : captures complètes, pixels, titres, liens, images, URL finale et instantanés d’accessibilité. Il conserve les 8 scénarios d’attribution UTM après navigation accueil → couples puis clic store. Il vérifie aussi les anciennes URL de démos et les pages de téléchargement sur les deux profils, avec conservation des paramètres de campagne et des fragments sur les alias.
- Ressources externes et lecture de médias sont bloquées identiquement. L’horloge et les animations SVG sont figées au même instant ; les images locales sont décodées avant capture. Les espaces de formatage du texte sont normalisés, avec une comparaison des pixels conservée strictement. Les requêtes vers le domaine de production sont interceptées ; Umami est remplacé par un collecteur local. Aucun événement de production n’est envoyé. Ce protocole n’est pas un audit Lighthouse, un test d’écoute audio ou un test sur appareils physiques.
- Chromium utilise les mêmes réglages de rastérisation pour les deux versions : un seul worker, sans cache partiel ni optimisations CPU Skia, et traitement de toutes les étapes de composition avant capture. Sans ces réglages, Chromium 155 peut produire un anticrénelage différent sur les bords arrondis du sélecteur de langue, y compris entre deux captures du même site historique. Aucun pixel n’est masqué et aucune tolérance de différence n’est ajoutée.
- Les navigations vers les stores sont interceptées par une réponse locale neutre : le contrôle compare leur destination sans ouvrir de connexion au store. Les captures Android des 4 pages de téléchargement montrent cette destination interceptée ; celles des alias de démos montrent la page cible. La parité HTML contrôle également le document initial de chacune de ces URL.
- Les comparaisons sont réparties entre 4 processus isolés (`BROWSER_WORKERS=1` à `4` pour adapter les ressources), avec un rapport consolidé exhaustif. Rapports JSON et captures sont écrits dans `artifacts/` et joints à la CI. Un écart fait échouer le workflow avant déploiement.

Ces comparaisons figent le contenu historique pour valider sa migration complète. Le manifeste `src/data/migration.json` conserve les 16 identifiants du pilote et énumère les 226 identifiants comparés. Elles s’exécutent en CI pour la PR `feat/90-astro-static`, ou sur lancement manuel avec `compare_migration` activé. Les modifications éditoriales ultérieures restent contrôlées par les tests de contenu, les tests unitaires et le build, sans être bloquées par cette référence historique. Les commandes de comparaison manuelles restent disponibles ; une évolution volontaire du périmètre nécessite une référence adaptée.

`scripts/migrate-legacy.mjs` documente l’extraction initiale du HTML versionné vers les données et composants partagés. Il ne fait rien lorsqu’aucun HTML ne reste dans `public/`. Il ne sert pas à modifier les contenus après migration.

## Tokens et coûts

La factorisation ne prouve pas un gain de tokens. Comparer les mêmes tâches : modifier un texte, créer une page et propager une correction commune. Enregistrer modèle, prompt, tokens entrée/sortie, tarifs et temps passé. Aucun coût réel n’est déduit des caractères ou du nombre de fichiers. Les tailles HTML du rapport de parité mesurent une autre chose.

## Publication et retour arrière

La source GitHub Pages doit être « GitHub Actions ». Le workflow déploie uniquement sur `main_v2`, après validation. Les PR ne publient pas le site. Seul `dist/` est envoyé ; sources, dépendances et tests ne sont pas servis.

Pour revenir en arrière, rétablir le commit voulu et son mode de publication compatible. La référence antérieure est du HTML directement publiable. Conserver le domaine et les URL, ainsi que `public/CNAME` pour la version Astro.
