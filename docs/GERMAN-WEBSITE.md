# Allemand sur le site web — issue #94

La locale `de` concerne le site uniquement. L’application conserve ses langues
actuelles et les démos leur audio existant. Aucune URL historique n’est renommée.

## Contenu et présentation

Les 54 pages allemandes couvrent toutes les familles anglaises, hors anciennes
redirections : 49 pages indexables, 4 documents légaux en `noindex` et une page de
téléchargement hors sitemap. Il n’est pas nécessaire de créer des alias allemands
pour les anciennes URL qui n’ont jamais existé en allemand.

Les fichiers `src/content/pages/*.de.json` utilisent `SitePage`, `Intro`, `Faq`,
`PageBlocks` et le thème couples existants. Le contenu allemand est éditable dans
`src/content/blocks/*.de/`. `localized-content.css` complète la typographie de ces
blocs Markdown. La navigation, le footer, l’indication des langues et la présentation
des crédits sont mutualisés dans les données et blocs partagés allemands.

Le contenu éditorial allemand est adapté et souvent plus concis que les versions
historiques : il ne reproduit pas chaque tableau, chaque section ou la mise en page
spécifique de toutes les pages anglaises. Le rapport de recherche se présente
explicitement comme une synthèse. Les comparatifs reprennent les informations
existantes en indiquant qu’il ne s’agit pas d’une nouvelle vérification des offres.
Relire les formulations allemandes et cette adaptation éditoriale lors de la revue.

Les documents légaux reprennent les textes et dates des versions existantes.
Le renvoi obsolète à la plateforme européenne de règlement en ligne est identifié
comme une référence historique, sans le présenter comme un recours actif. Les
autres langues ne sont pas réécrites dans cette modification.

## Routes et SEO

`src/data/routes.json` reste la source des correspondances. Par exemple :

| Famille | Anglais | Portugais | Allemand |
| --- | --- | --- | --- |
| Accueil | `/en/` | `/pt/` | `/de/` |
| Couples | `/en/for-couples/` | `/pt/para-casais/` | `/de/fuer-paare/` |
| Tarifs | `/en/pricing/` | `/pt/precos/` | `/de/preise/` |

Chaque page allemande a un canonical vers sa propre URL. Les pages indexables
relient les traductions par des hreflang réciproques, y compris les pages composées
dont `headOrder` a été créé avant l’ajout de cette langue. Le `x-default` existant
reste conservé. Les nouvelles entrées de sitemap sont ajoutées sans modifier les
URL ou les dates historiques des autres pages.

La liste `src/data/languages.json` alimente les sélecteurs et la commande de création
de page. Les composants proposent une traduction seulement si elle existe pour la
famille en cours. Les anciens headers de support et des documents légaux disposent
également d’un sélecteur. Les noms accessibles des langues sont conservés.

Pour ajouter une page en allemand :

```sh
npm run page:new -- nouvelle-occasion de /de/neuer-anlass/ couples.de
```

Modifier ensuite les textes, métadonnées, schémas et liens copiés avant publication.
Cette commande ne traduit pas automatiquement.

## App, stores et médias

- La mention de langue précise que le site est en allemand, mais que l’app et ses
  audios ne le sont pas. Les données structurées ne déclarent pas `de` comme langue
  de l’application ou des enregistrements.
- Les pages allemandes des six démos utilisent les fichiers MP3 anglais existants,
  clairement étiquetés, avec `AudioObject.inLanguage: en`. Les autres enregistrements
  sont accessibles par les liens vers les pages FR/ES. Aucun audio n’est créé.
- La capture d’application montrée sur l’accueil est identifiée comme anglaise.
  L’image de partage utilise le visuel d’ambiance existant, sans texte dans une autre
  langue ni promesse d’interface allemande.
- Les CTA restent directs vers les stores. L’iOS utilise le repli anglais existant ;
  `mobile-store-cta.js` sélectionne Google Play sur Android, y compris pour le bouton
  flottant. La page de téléchargement conserve le routeur de secours.
- Les scripts d’attribution restent partagés. Le champ `locale` vient du document
  HTML et accepte maintenant également `de` dans les tests de conversion.

## Validation

```sh
npm ci
npm test
npm run build
npm run test:i18n
python scripts/check-german-browser.py
```

Le dernier contrôle utilise Playwright et Chromium ; les dépendances Python sont
dans `requirements-test.txt`. `CHROMIUM_EXECUTABLE` sélectionne éventuellement un
Chromium déjà installé. Sinon, utiliser l’installation Playwright habituelle.

Le contrôle du build vérifie les canonical, hreflang réciproques, sélecteurs de
langues, liens internes, médias, sitemap, exclusions et langues des schémas. Il est
exécuté en CI après le build.

Le contrôle navigateur parcourt les pages allemandes sur ordinateur et Android,
vérifie l’absence d’erreur JavaScript, le débordement horizontal, la visibilité du
sélecteur et les destinations stores. Il contrôle aussi la navigation depuis les
anciennes langues vers les slugs allemands et le retour vers un slug portugais.
Les ressources externes et destinations stores sont interceptées : aucun événement
analytics de production ni achat n’est déclenché. Rapport et captures sont écrits
dans `artifacts/german/`, sans être versionnés. Il ne s’agit ni d’un audit complet
d’accessibilité ni d’un test d’écoute des enregistrements.

La PR ne déploie pas le site. Le déploiement existant reste réservé à la branche
principale après fusion.
