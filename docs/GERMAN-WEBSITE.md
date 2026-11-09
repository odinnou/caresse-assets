# Allemand sur le site web

La locale `de` concerne le site uniquement. L’application conserve ses langues
actuelles et les démos leur audio existant. Aucune URL historique n’est renommée.

## Contenu et présentation

Les 54 pages allemandes couvrent toutes les familles anglaises hors anciennes
redirections : 49 pages indexables, 4 documents légaux en `noindex` et une page de
téléchargement hors sitemap.

Chaque fichier `src/content/pages/*.de.json` indique sa référence dans
`translationSource`. Il reprend la composition propre à cette page : layout,
sections, cartes, tableaux complets, FAQ, liens, médias et scripts. Les styles sont
ceux de la référence. Une règle de retour à la ligne permet aux mots allemands longs
de tenir dans les petits écrans ; le sélecteur reste compact sur mobile. L’accueil conserve notamment son carrousel, ses quatre étapes,
sa vidéo et ses sections de découverte. La page des alternatives conserve ses
comparaisons et sa matrice. Les articles, comparatifs, démos, pages saisonnières,
le support et les textes légaux conservent également leurs présentations distinctes.

Les traductions restent des données éditables dans les JSON et les fragments
`src/content/blocks/*.de/`. Les variantes allemandes du header et du footer
conservent la structure propre à chaque famille. Une courte mention dans un
paragraphe existant précise la disponibilité linguistique de l’application ; elle
n’ajoute pas une nouvelle section ni un thème commun aux pages.

Les formulations allemandes ne promettent pas de garantie thérapeutique,
d’anonymat du paiement ou de résultat individuel. Les références comparatives et
leurs dates sont conservées ; cette traduction ne constitue pas une nouvelle
vérification commerciale des offres tierces.

Lors de l’édition de fragments HTML, conserver les balises ouvrantes et fermantes
réparties entre `prefix`, `suffix` et fichiers. Leur sérialisation séparée par un
parseur HTML peut fermer une section prématurément et déplacer des éléments.
Le contrôle de parité vérifie le résultat HTML assemblé pour détecter ce défaut.

## Routes et SEO

`src/data/routes.json` reste la source des correspondances. Les slugs peuvent
différer selon les langues. Chaque page indexable conserve un canonical vers sa
propre URL et des hreflang réciproques. Les liens internes utilisent les routes
allemandes ; le sélecteur utilise les correspondances réelles de chaque famille.
Les documents légaux restent exclus du sitemap et en `noindex`.

`src/data/languages.json` alimente les sélecteurs et la commande de création de
page. Une traduction n’est proposée que si elle existe pour la famille en cours.
Les headers de support et des documents légaux disposent aussi d’un sélecteur.

Pour ajouter une page, choisir une famille dont la composition convient :

```sh
npm run page:new -- nouvelle-occasion de /de/neuer-anlass/ couples.de
```

Modifier ensuite les textes, métadonnées, schémas, liens et `translationSource`.
Cette commande ne traduit pas automatiquement. Une nouvelle famille doit aussi
avoir sa référence anglaise pour bénéficier du contrôle de composition.

## App, stores et médias

- L’app et les audios ne sont pas disponibles en allemand. Les schémas ne déclarent
  pas `de` comme langue de l’application ou des enregistrements.
- Les six démos conservent leurs MP3 anglais, étiquetés dans le contenu visible,
  avec `AudioObject.inLanguage: en`. Aucun nouvel audio n’est créé.
- Les captures de l’app et la vidéo conservent leur langue réelle et les mêmes
  ressources que la référence ; leurs textes d’accompagnement sont traduits.
- Les CTA restent directs vers les stores. L’iOS pointe vers la boutique allemande (`/de/`, `l=de-DE`), ce qui
  ne change pas les langues disponibles dans l’application ;
  `mobile-store-cta.js` sélectionne Google Play sur Android. La page de
  téléchargement conserve le routeur de secours.
- Les scripts d’attribution restent partagés et prennent la locale du document.

## Validation des 54 pages

```sh
npm ci
npm test
npm run build
npm run test:i18n
python scripts/check-german-browser.py
```

`test:i18n`, exécuté après le build en CI, vérifie les canonical, hreflang,
sélecteurs, liens, sitemap, médias et destinations des stores. Il exécute aussi
`check-german-parity.mjs` sur **toutes les pages allemandes**, y compris le support,
le téléchargement et les documents légaux :

- même layout et mêmes fichiers et contenus CSS que leur référence ;
- même arbre HTML, classes, identifiants et attributs de présentation ;
- mêmes sections, cartes, tableaux et dimensions de cellules, FAQ et médias ;
- mêmes sources de médias et de scripts.

Seuls les textes, les URL traduites, l’état de la langue active et la courte mention
de disponibilité linguistique sont autorisés à différer. Le rapport par page est
écrit dans `artifacts/german/parity-report.json`. Le contrôle de structure ne remplace
pas une relecture linguistique et factuelle.

Le contrôle Playwright parcourt également les 54 pages sur ordinateur et Android :
absence d’erreur JavaScript, débordement horizontal, sélecteur visible et destinations
stores. Il teste des parcours entre langues et produit des captures représentatives,
dont l’accueil et les alternatives. Les destinations stores et les ressources
externes sont interceptées ; aucun achat ni événement analytics de production
n’est déclenché. Les captures conservent les médias locaux. Les badges externes ne
sont pas chargés pendant ce contrôle isolé.

Les dépendances Python sont dans `requirements-test.txt`. `CHROMIUM_EXECUTABLE`
permet de sélectionner Chromium ; sinon, utiliser l’installation Playwright habituelle.
Les rapports et captures sont écrits dans `artifacts/german/` et sont archivés par
la CI sans être versionnés.

La PR ne déploie pas le site. Le déploiement existant suit la fusion dans la branche
principale.
