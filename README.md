# Caresse — site web

Site statique servant [caresse.app](https://caresse.app), construit avec **Astro** dans GitHub Actions et déployé via GitHub Pages. Aucun serveur applicatif en production.

Caresse est une application mobile (iOS/Android) proposant des expériences audio immersives générées par IA, à visée intime et sensorielle, solo ou en couple

**Priorité du travail sur ce dépôt : optimiser le SEO et la visibilité de Caresse sur l’App Store et Google Play pour obtenir davantage d’installations.** Lire [SEO-GOLDEN-RULE.md](SEO-GOLDEN-RULE.md) avant toute intervention.

## Structure

Astro génère les 226 pages historiques en FR/EN/ES/PT : pages éditoriales, comparatifs, démos, pages saisonnières, support, téléchargement, documents légaux et anciennes URL de démos. Les assets restent dans `public/`.

La version allemande ajoute 54 pages sous `/de/`, dont 49 au sitemap. Chaque page conserve la composition complète de sa référence, contrôlée automatiquement ; l’application et ses audios ne sont pas traduits en allemand. Voir [le guide allemand](docs/GERMAN-WEBSITE.md).

- `src/content/pages/` — données éditables : SEO, blocs, FAQ et références de contenu
- `src/content/blocks/` — contenus propres aux pages : Markdown et fragments HTML conservés
- `src/content/scripts/` — scripts historiques partagés, injectés sans transformation
- `src/components/`, `src/layouts/` — présentation commune, navigation, footer, CTA, FAQ, grilles et blocs imbriqués
- `src/data/routes.json` — URL et correspondances entre traductions
- `src/data/chrome/` — éléments de navigation et de footer partagés
- `src/data/sitemap/` — inventaire du sitemap généré par Astro
- `public/` — assets et fichiers de configuration publics, copiés sans transformation
- `dist/` — résultat du build, généré et non versionné

Les chemins ci-dessous désignent les **URL publiques** ; les pages sont composées depuis `src/` et les assets sont conservés dans `public/`.

- `index.html` — page d'accueil (FR)
- `en/` — version anglaise du site (même arborescence que la racine)
- `es/`, `pt/` — pages support traduites
- `for-*/` — pages satellites SEO par cas d'usage (couples, solo, etc.)
- `vs-*/` — pages de comparaison face à des concurrents
- `blog/`, `alternatives/`, `support/`, `legal/` — contenu éditorial et légal
- `saint-valentin/`, `cadeau-saint-valentin-couple/`, `noel-en-couple/`, `nouvel-an-en-couple/` — pages saisonnières, traduites en EN/ES/PT ; styles intégrés, contrôles Caresse, illustration audio de l’accueil et visuel d’ambiance dans `seasonal/`
- `anniversaire-de-couple/`, `en/relationship-anniversary/`, `es/aniversario-de-pareja/`, `pt/aniversario-de-relacionamento/` — anniversaire de rencontre, union civile ou mariage ; suivi Umami `store_click` filtrable par `variant=anniversary-v1`, `landing_page` et `locale`
- `screens/` — captures d'écran de l'app par langue
- `sitemap.xml`, `robots.txt`, `CNAME` — configuration SEO et domaine custom
- `download-store-router.js` — routage iOS/Android des pages de téléchargement de secours, avec choix manuel sur ordinateur

## Architecture multilingue FR / EN

Le FR est servi depuis la racine (`/`, `/for-couples/`, ...) et l'EN depuis `/en/` (`/en/`, `/en/for-couples/`, ...). Chaque page contient une seule langue dans son DOM — pas de toggle JS qui swap le contenu.

**Toute modification d'une page FR doit être propagée à la page EN équivalente** (et inversement) : contenu visible, `<title>`/`<meta>`/`og:*`/`twitter:*`, JSON-LD, liens internes, images `screens/`, hreflang, canonical, et `sitemap.xml`. Voir `# CLAUDE.md` pour le détail complet du mapping et des points de synchronisation.

## Déploiement

Node 24 est utilisé dans la CI. Installer les dépendances avec `npm ci`, puis :

```sh
npm run dev          # prévisualisation locale seulement
npm test             # contenu, création de pages et attribution Umami
npm run build        # validation des sources puis génération de dist/
npm run test:i18n    # liens, langues, SEO, médias et parité des 54 compositions allemandes
npm run preview      # prévisualisation du résultat statique
```

Créer une page et sa traduction à partir des blocs existants :

```sh
npm run page:new -- nouvelle-occasion fr /nouvelle-occasion/ couples.fr
npm run page:new -- nouvelle-occasion en /en/new-occasion/ couples.en
```

La commande crée des contenus indépendants et met à jour les traductions et le sitemap. Adapter les textes, titres, métadonnées et données structurées copiés avant publication.

Le workflow `.github/workflows/pages.yml` vérifie les PR. Sur `main_v2`, il publie uniquement `dist/` après les contrôles. La source de GitHub Pages doit être **GitHub Actions**. Le domaine reste `caresse.app` (`public/CNAME`).

Procédure d’édition et protocole avant/après : [docs/ASTRO-MIGRATION.md](docs/ASTRO-MIGRATION.md).

Audit de la duplication des contenus et plan pour réduire les fichiers à modifier :
[analyse de maintenabilité Astro](docs/ANALYSE-MAINTENABILITE-ASTRO-2026-11-09.md).

Analyse GEO révisée après correction des pages allemandes : contenu publié,
contrôles HTTP, cohérence des faits et plan de mesure :
[analyse GEO du 9 novembre 2026](docs/ANALYSE-GEO-2026-11-09.md).

Faits produit harmonisés pour le contenu et `llms.txt`, avec leur source et la
portée des garanties de confidentialité : [référentiel GEO](docs/GEO-PRODUCT-FACTS.md).
Le contrôle `test:i18n` vérifie aussi les réponses FAQ visibles et les liens de
l’inventaire `llms.txt` après le build.

Suite du chantier : [mise en œuvre GEO du 10 novembre](docs/GEO-EXECUTION-2026-11-10.md),
[panel, rapports Umami et contrôles publics](docs/geo/README.md).
`geo:prepare`, `geo:report`, `geo:clicks` et `geo:http` préparent et analysent les
relevés sans envoyer de messages ni déclencher de requêtes d’indexation.

[Implémentation GEO et axes SEO du 11 novembre](docs/GEO-IMPLEMENTATION-2026-11-11.md) :
accueils/démos, identité produit commune, dates de modification et priorités
fondées sur Search Console et Umami. Aucun contrôle IA payant n’est lancé.

## Acquisition saisonnière

[Calendrier Noël 2026 / Saint-Valentin 2027](SEO-CALENDRIER-SAISONNIER-2026-2027.md) : intentions des quatre pages, variantes de recherche, étapes de publication et d’indexation, calendrier de diffusion, sept brouillons de publications et mesure des clics vers les stores. Conserver les URL saisonnières sans année pour les enrichir au fil des saisons.
