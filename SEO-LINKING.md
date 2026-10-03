# Maillage interne — registre des cibles SEO

Ce fichier est le registre des relations **article ⇄ landing**. Le site étant du HTML
statique sans générateur, il n'existe pas de couche « propriété » : ce document tient
lieu de `primarySeoTarget` déclaratif. Toute modification du maillage se répercute ici.

## Principe

> ⚠️ Ce document décrit le maillage **pour le SEO**. Il est subordonné à
> [`SEO-GOLDEN-RULE.md`](SEO-GOLDEN-RULE.md) : aucun lien décrit ici ne doit prendre la
> forme d'un CTA visible concurrent du téléchargement. Le maillage sert le crawler,
> pas le détournement de l'utilisateur final.

Le graphe visé :

```
requête informationnelle → article de blog → landing adaptée au problème → téléchargement
```

Règles :

- **Une cible principale par article**, une secondaire au maximum. Pas cinq.
- **Deux liens contextuels maximum** vers la cible : un dans le corps du texte, un en
  bloc final. Les liens de footer ne comptent pas.
- **L'ancre décrit le problème, pas la marque.** « une expérience guidée pour les
  couples de longue date » et non « découvrir Caresse ». L'ancre donne à Google
  l'information sémantique sur la page de destination.
- **Le lien retour est obligatoire** : chaque landing renvoie vers l'article qui la
  nourrit, via un bloc éditorial « Pour aller plus loin ». Pas de grille générique.

## Clusters

### Cluster « raviver la flamme »

| | |
|---|---|
| Requête | raviver la flamme, couple installé, routine |
| Article | `/blog/raviver-la-flamme-couple/` · `/en/blog/rekindle-relationship-spark/` · `/es/blog/reavivar-la-llama-en-pareja/` |
| Cible principale | `/for-long-term-couples/` |
| Cible secondaire | `/for-busy-couples/` |
| Lien retour depuis | `/for-long-term-couples/`, `/couples-game/` |

### Cluster « parler de ses fantasmes »

| | |
|---|---|
| Requête | parler de ses fantasmes, désirs, communication de couple |
| Article | `/blog/parler-de-ses-fantasmes/` · `/en/blog/talk-about-fantasies/` · `/es/blog/hablar-de-tus-fantasias/` |
| Cible principale | `/for-couples/` |
| Cible secondaire | `/for-adventurous-couples/` |
| Lien retour depuis | `/for-couples/`, `/for-new-couples/` |

### Cluster « exploration solo »

| | |
|---|---|
| Requête | exploration solo, culpabilité, temps pour soi |
| Article | `/blog/exploration-solo-deculpabiliser/` · `/en/blog/solo-exploration-without-guilt/` · `/es/blog/exploracion-en-solitario-sin-culpa/` |
| Cible principale | `/for-solo-exploration/` |
| Lien retour depuis | `/for-solo-exploration/` |

### Cluster « intimité et handicap visuel »

| | |
|---|---|
| Requête | intimité handicap visuel, audio, accessibilité |
| Article | `/blog/intimite-handicap-visuel-audio/` · `/en/blog/intimacy-visual-impairment-audio/` · `/es/blog/intimidad-discapacidad-visual-audio/` |
| Cible principale | `/for-blind-and-low-vision/` |
| Lien retour depuis | `/for-blind-and-low-vision/` |

### Cluster « jeu pour couple »

| | |
|---|---|
| Requête | jeu pour couple, jeu coquin, jeu sans cartes |
| Page | `/couples-game/` (transactionnelle, pas un article) |
| Cible principale | `/for-couples/` |
| Lien retour depuis | `/for-couples/` renvoie vers `/couples-game/` (déjà en place via le corps de page) |

### Cluster « démo audio » (page d'atterrissage SEO)

| | |
|---|---|
| Requête | démo audio couple, expérience audio couple, audio intime couple, guided intimacy audio, couples audio experience |
| Page | `/demo/` · `/en/demo/` · `/es/demo/` (transactionnelle : écoute immédiate) |
| Rôle | Page d'atterrissage SEO pour la promesse « écouter avant de s'inscrire ». **Pas une étape du tunnel** : `/demo/` porte ses propres CTA store et ne doit jamais être la cible d'un CTA visible depuis une page qui en porte déjà un (cf. `SEO-GOLDEN-RULE.md`). |
| Liens entrants | Lien homepage sous la section vidéo, entrée de nav header (les 3 locales), un lien contextuel depuis `/couples-game/`, `/for-couples/` et `/for-solo-exploration/` (les 3 locales), et une entrée sitewide en tête du nav éditorial du footer (73 pages) |
| Liens sortants | `/for-couples/`, `/for-solo-exploration/`, `/alternatives/`, `/is-caresse-safe/`, `/how-it-works/` |

Les ancres de section sur `/demo/` préexistaient à ce maillage. Elles ne sont **pas**
homogènes entre locales : FR et EN exposent `#demo-soft` / `#demo-couple` / `#demo-solo`,
ES expose `#demo-soft` / **`#demo-pareja`** / `#demo-solo`. Chaque lien entrant doit viser
l'ancre de sa propre locale.

| Page source | Ancre visée | Démo pointée |
|---|---|---|
| `/couples-game/` | `/demo/#demo-couple` | Mathieu & Clara |
| `/for-couples/` | `/demo/#demo-couple` | Mathieu & Clara |
| `/for-solo-exploration/` | `/demo/#demo-solo` | Inès |
| `/en/couples-game/`, `/en/for-couples/` | `/en/demo/#demo-couple` | James & Emma |
| `/en/for-solo-exploration/` | `/en/demo/#demo-solo` | Maya |
| `/es/couples-game/`, `/es/for-couples/` | `/es/demo/#demo-pareja` | Álvaro & Marta |
| `/es/for-solo-exploration/` | `/es/demo/#demo-solo` | Nuria |

Un seul lien par page, placé en fin de section « 4 étapes », juste après l'étape où la
voix prend le relais — le point du texte où le lecteur se demande à quoi cette voix
ressemble. Ancre descriptive (« Écouter une démo de Caresse en couple / en solo »), pas
« découvrir Caresse ».

### Entrée footer sitewide — motif : accessibilité mobile

Le header applique `@media (max-width: 768px) { .header-link { display: none; } }` et il
n'existe **aucun menu burger de remplacement**. Les liens header disparaissent donc sous
768px. Ce n'est pas un problème de crawl (Googlebot suit les liens présents dans le DOM,
`display:none` compris, et un breakpoint responsive n'est pas du cloaking) : c'est un
problème d'**usage mobile**.

Blog, Comment ça marche, Jeu pour couple et Alternatives étaient déjà rattrapés par le
nav éditorial du footer. `/demo/` était la seule des cinq entrées header absente de ce
footer : sur mobile elle n'était atteignable par aucune navigation, alors que c'est la
page de conversion vers laquelle tout le reste du maillage pousse.

Corrigé en ajoutant `/demo/` **en première position** du `<nav>` éditorial du footer, sur
**73 pages** (fr 25 · en 25 · es 23), libellé traduit par locale (« Démo audio » /
« Audio demo » / « Demo de audio ») et style identique aux liens voisins.

Exclusions volontaires : les 3 pages `/demo/` elles-mêmes (auto-lien), `/download/` et
`/support/` (pas de nav éditorial), toutes les pages `legal/*`, et la locale `pt`
(une seule page, hors périmètre).

Si un menu burger est ajouté un jour, cette entrée footer reste pertinente et n'a pas à
être retirée.

Les MP3 sont servis en URLs stables sous `/demos/*.mp3` (GitHub Pages renvoie
`Content-Type: audio/mpeg`), déclarés en `AudioObject` JSON-LD dans un `ItemList`, et
rattachés à l'entité `MobileApplication`. Les `.mp3` ne sont pas dans le sitemap : c'est
`/demo/` qu'on veut faire ranker.

Les CTA « Écouter les démos gratuites » des comparatifs (`/alternatives/`, `/vs-*/`)
pointent désormais sur `/demo/` — **21 CTA, 7 pages × 3 locales**. Décision prise le
2026-08-28 après mesure : l'ancre promettait une écoute et menait à une installation.

⚠️ **Piège technique associé.** Ces pages portaient un script qui réécrivait
`document.getElementById('hero-cta').href` vers Google Play sur Android. Changer le seul
`href` aurait été **annulé sur mobile Android**, c'est-à-dire précisément la cible. Le
CTA basculé a donc été renommé `id="hero-cta-demo"`, et les 24 scripts devenus morts ont
été supprimés. Les 42 pages qui gardent un CTA store conservent leur `id="hero-cta"` et
leur script — ne pas les renommer.

Effet mesuré sur le maillage : liens éditoriaux entrants vers `/demo/` **7 → 14 par
locale** ; ratio global liens store / liens démo **2,13× → 1,67×**.

## Liens retour posés (bloc « Pour aller plus loin »)

Un bloc éditorial inséré juste avant la `cta-section` de chaque landing. Une seule
carte, ancre problème, formulée dans la langue de la locale.

| Landing | Article cible |
|---|---|
| `/for-long-term-couples/` | raviver la flamme |
| `/for-couples/` | parler de ses fantasmes |
| `/for-new-couples/` | parler de ses fantasmes |
| `/for-solo-exploration/` | exploration solo |
| `/for-blind-and-low-vision/` | intimité et handicap visuel |
| `/couples-game/` | raviver la flamme |

Décliné à l'identique sur `/en/…` et `/es/…`.

## Hors périmètre volontaire

- **Titles et H1 inchangés.** La courbe étant bonne, l'objectif est de faire circuler
  l'autorité entre les URLs existantes, pas de perturber leurs signaux.
- `/for-adventurous-couples/` et `/for-busy-couples/` n'ont pas encore d'article dédié :
  ils restent cibles secondaires, sans lien retour, jusqu'à publication.
- `/blog/state-of-ai-romance-2026/` est un contenu d'autorité/presse, pas un article de
  cluster : pas de cible transactionnelle assignée.

## Mesure

Suivre dans Search Console, par cluster : impressions de l'article, clics vers la
landing cible, et position moyenne de la landing. Étendre le modèle au reste du blog
une fois le signal confirmé.


## Lot du 3 octobre 2026 — acquisition et clics stores

Le KPI principal est le **nombre de store_click hors tests**, puis le nombre de visites
avec au moins un clic store, par source et page d'entrée. Le temps sur le site et le
nombre de pages vues ne sont pas des objectifs de ce lot.

- Nouvelle intention « prix, gratuité, abonnement » : `/tarifs/`, `/en/pricing/`,
  `/es/precios/`. Chaque page porte un CTA store direct en hero, après les offres et
  en fin de page. Elle explique les démos, les crédits et l'achat unique optionnel.
- Liens entrants vers les tarifs : footer des accueils, des pages Melt, Dipsea et
  Couples game dans les trois langues. Aucun bouton de téléchargement ne devient
  un lien vers les tarifs.
- Liens contextuels sortants des tarifs : Couples game et Alternatives dans la même
  langue. Les liens de langue, canonical et sitemap sont réciproques.
- Melt : premier écran raccourci, offre audio et essai gratuit précisés ; libellés de
  téléchargement et titres SEO conservés. FAQ visible et JSON-LD synchronisés.
- Dipsea : intention d'alternative en français/espagnol explicitée ; distinction
  démos gratuites / génération payante visible et reprise dans la FAQ.
- Couples game : suppression du bouton secondaire vers `#diff` dans le hero ; ajout
  d'un CTA store direct après le tableau, avec routage Android. Aucun changement du
  libellé du CTA principal. FAQ essai gratuit et application mobile ajoutée.

Cette section et `SEO-GOLDEN-RULE.md` remplacent les anciens passages de ce registre
qui décrivent un CTA de comparatif envoyé vers `/demo/` : les CTA restent directs vers
les stores. Les liens éditoriaux vers les démos restent facultatifs.

Les neuf liens éditoriaux de Couples game, For couples et For solo exploration ne
pointent plus vers les anciennes ancres du hub, qui n'existent plus. Ils ciblent les
pages `/demo/couple-romantique/` et `/demo/solo-decouverte-sensuelle/`, avec les préfixes
`/en/` et `/es/` dans chaque locale. Ils restent des liens texte facultatifs, jamais
la destination d'un CTA de téléchargement.
