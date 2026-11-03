# Caresse — site web

Site statique (HTML/CSS/JS vanilla, sans build) servant [caresse.app](https://caresse.app), déployé via GitHub Pages.

Caresse est une application mobile (iOS/Android) proposant des expériences audio immersives générées par IA, à visée intime et sensorielle, solo ou en couple.

**Priorité du travail sur ce dépôt : optimiser le SEO et la visibilité de Caresse sur l’App Store et Google Play pour obtenir davantage d’installations.** Lire [SEO-GOLDEN-RULE.md](SEO-GOLDEN-RULE.md) avant toute intervention.

## Structure

- `index.html` — page d'accueil (FR)
- `en/` — version anglaise du site (même arborescence que la racine)
- `es/`, `pt/` — pages support traduites
- `for-*/` — pages satellites SEO par cas d'usage (couples, solo, etc.)
- `vs-*/` — pages de comparaison face à des concurrents
- `blog/`, `alternatives/`, `support/`, `legal/` — contenu éditorial et légal
- `saint-valentin/`, `cadeau-saint-valentin-couple/`, `noel-en-couple/`, `nouvel-an-en-couple/` — pages saisonnières, traduites en EN/ES/PT ; styles intégrés, contrôles Caresse, illustration audio de l’accueil et visuel d’ambiance dans `seasonal/`
- `screens/` — captures d'écran de l'app par langue
- `sitemap.xml`, `robots.txt`, `CNAME` — configuration SEO et domaine custom
- `download-store-router.js` — routage iOS/Android des pages de téléchargement de secours, avec choix manuel sur ordinateur

## Architecture multilingue FR / EN

Le FR est servi depuis la racine (`/`, `/for-couples/`, ...) et l'EN depuis `/en/` (`/en/`, `/en/for-couples/`, ...). Chaque page contient une seule langue dans son DOM — pas de toggle JS qui swap le contenu.

**Toute modification d'une page FR doit être propagée à la page EN équivalente** (et inversement) : contenu visible, `<title>`/`<meta>`/`og:*`/`twitter:*`, JSON-LD, liens internes, images `screens/`, hreflang, canonical, et `sitemap.xml`. Voir `# CLAUDE.md` pour le détail complet du mapping et des points de synchronisation.

## Déploiement

Aucun build : le contenu de la branche `main` est publié tel quel sur GitHub Pages, à l'adresse `caresse.app` (voir `CNAME`)

## Acquisition saisonnière

[Calendrier Noël 2026 / Saint-Valentin 2027](SEO-CALENDRIER-SAISONNIER-2026-2027.md) : intentions des quatre pages, variantes de recherche, étapes de publication et d’indexation, calendrier de diffusion, sept brouillons de publications et mesure des clics vers les stores. Conserver les URL saisonnières sans année pour les enrichir au fil des saisons.
