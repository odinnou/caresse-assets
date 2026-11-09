# Audit SEO / GEO — caresse.app

> Pour l’état vérifié au 9 novembre et les priorités actuelles, lire
> [l’analyse GEO du 9 novembre](docs/ANALYSE-GEO-2026-11-09.md).
> Les diagnostics et recommandations ci-dessous restent un historique d’août,
> et non un score GEO actuel ni une liste de prérequis des moteurs IA.

> **Photo au 2026-08-08** — État constaté sur la branche `main_v2` au commit `c6d7bcb` (`feat(melt): optimize alternative page (#37)`).
> Site live : https://caresse.app (GitHub Pages, `CNAME` → `caresse.app`).
>
> **⚠️ Ce document décrit l'état AVANT correction.** Une partie des points a été traitée
> le même jour — voir la section « Corrections appliquées » en fin de document pour
> l'état courant.

## Résumé

La base technique SEO est de très bon niveau : aucun lien interne cassé, aucun JSON-LD invalide, canonicals tous corrects, `<h1>` unique partout, hreflang réciproques à deux exceptions près. Le gisement de valeur est ailleurs :

1. **Le GEO est à zéro** — aucune infrastructure pour les moteurs de réponse IA.
2. **`/download/`, la page de conversion, est orpheline** (0 lien entrant).
3. **La home ne porte pas la sémantique de sa catégorie** — elle laisse les pages
   `/for-*` la porter seules.

## Périmètre mesuré

| Métrique | Valeur |
|---|---|
| Pages HTML totales | 86 |
| URLs dans `sitemap.xml` | 67 |
| Pages indexables hors sitemap | 3 (les 16 légales sont `noindex` par choix) |
| Locales | FR (racine), EN (`/en/`), ES (`/es/`), PT (`/pt/`, partiel) |
| Blocs JSON-LD invalides | 0 |
| Liens internes cassés | 0 (sur ~600 `href`/`src`) |

### Répartition par locale

| Locale | Pages (hors `/legal/`) | Légales |
|---|---|---|
| FR (racine) | 24 | 4 |
| EN | 24 | 4 |
| ES | 21 | 4 |
| PT | 1 (`/pt/support/`) | 4 |

## Contrôles conformes — à ne pas régresser

| Contrôle | Résultat |
|---|---|
| Canonicals (70 pages non-légales) | 100 % corrects, aucun mismatch avec l'URL réelle |
| Liens internes cassés | 0 |
| Validité JSON-LD | 86 pages parsées, 0 erreur |
| `<h1>` par page | exactement 1, partout |
| `x-default` hreflang | présent sur toutes les pages non-légales |
| hreflang → URL existante | 0 lien mort |
| Réciprocité hreflang | correcte partout **sauf `/blog/`** (cf. P0-5) |

### Vocabulaire schema.org en place

Types présents (occurrences) : `Question` 345, `Answer` 345, `ListItem` 139, `Organization` 87, `FAQPage` 57, `BreadcrumbList` 57, `WebPage` 54, `Offer` 51, `MobileApplication` 51, `WebSite` 48, `ImageObject` 24, `SoftwareApplication` 18, `BlogPosting` 15, `Article` 9, `CollectionPage` 3, `Blog` 3, `Audience` 3.

`Organization.sameAs` déclare 6 profils : App Store, Google Play, X, Instagram, YouTube, TikTok.

---

## P0 — Fort impact

### P0-1. Aucune infrastructure GEO

| Fichier | État |
|---|---|
| `/llms.txt` | **404** |
| `/llms-full.txt` | absent |
| `/ai.txt` | absent |
| `/.well-known/ai-plugin.json` | absent |

`robots.txt` fait 3 lignes utiles et ne mentionne **aucun** crawler IA (`GPTBot`, `ClaudeBot`, `PerplexityBot`, `OAI-SearchBot`, `CCBot`, `Google-Extended`) :

```
User-agent: *

Sitemap: https://caresse.app/sitemap.xml
```

**Enjeu.** La découverte se déplace vers des requêtes conversationnelles (« quelle appli audio intime sans créer de compte ? »). Les 4 piliers de positionnement — démos sans compte FR/EN/ES, anonymous-first, personnalisation profonde avec prénoms, pay-per-session — sont précisément le type de faits différenciants qu'un LLM cite **s'il les trouve structurés et attribuables**.

**Action.** Autoriser explicitement les crawlers IA dans `robots.txt` ; créer `llms.txt` listant les URLs clés avec une phrase de contexte chacune, plus les 4 piliers énoncés en clair, **limites factuelles incluses**.

### P0-2. 3 pages hors sitemap

> **Correction apportée à l'analyse initiale.** J'avais compté 19 pages manquantes en
> incluant les 16 pages légales. Vérification faite, celles-ci sont en
> `<meta name="robots" content="noindex, nofollow">`, leurs liens sont en
> `rel="nofollow"`, et le `<head>` des homepages porte le commentaire explicite
> « *Les pages legal/ ne sont pas référencées ici intentionnellement* ».
> **Leur exclusion du sitemap est un choix délibéré et cohérent — il n'y a rien à
> corriger.** Le manque réel se limite aux 3 pages ci-dessous.

Manquent :

- **`/download/`**, **`/en/download/`**, **`/es/download/`**

À noter tout de même : les 16 pages légales sont dépourvues de `canonical`,
`meta description`, `hreflang` et JSON-LD. C'est sans conséquence tant qu'elles
restent `noindex`. Si le choix évoluait vers une indexation (les pages légales sont un
signal E-E-A-T sur une thématique intime), il faudrait compléter leur `<head>` **avant**
de les ajouter au sitemap.

### P0-3. `/download/` orpheline — 0 lien entrant

Liens internes entrants, pages FR :

| Liens | Page |
|---|---|
| 25 | `/` |
| 23 | `/alternatives/`, `/blog/`, `/couples-game/`, `/how-it-works/`, `/is-caresse-safe/` |
| 22 | `/for-adventurous-couples/`, `/for-busy-couples/`, `/for-long-term-couples/`, `/for-solo-exploration/` |
| 21 | `/for-couples/` |
| 12 | `/for-new-couples/` |
| 8 | `/vs-coelle/`, `/vs-dipsea/`, `/vs-inthemoment/`, `/vs-magicwave/`, `/vs-melba/`, `/vs-melt/` |
| 3-4 | articles de blog |
| **1** | **`/support/`** |
| **0** | **`/download/`** |

La page de conversion la plus directe n'est liée depuis aucune page du site.

### P0-4. Home sans `FAQPage`, sous-dotée en contenu

| Page | Questions structurées | Mots |
|---|---|---|
| `/` | **0** | **615** |
| `/for-couples/` | 6 | 711 |
| `/how-it-works/` | 6 | 676 |
| `/is-caresse-safe/` | 8 | 829 |
| `/alternatives/` | 5 | 1467 |
| `/vs-melt/` | 7 | 1580 |

La home reçoit le plus de liens internes (25) et est la moins armée pour les extraits enrichis et les réponses IA.

### P0-5. `hreflang="es"` manquant sur `/blog/`

`/es/blog/` pointe vers ses équivalents FR et EN, mais ni `/blog/` ni `/en/blog/` ne lui répondent :

```
blog/index.html      : manque hreflang="es" → https://caresse.app/es/blog/
en/blog/index.html   : manque hreflang="es" → https://caresse.app/es/blog/
```

Grappe non réciproque : Google peut ignorer l'association et laisser la version ES hors index. **Seule anomalie hreflang du site.**

---

## P1 — Performance (Core Web Vitals)

### P1-6. 36 Mo d'assets morts à la racine

| Fichier | Poids | Référencé dans le HTML |
|---|---|---|
| `foreground-final.webm` | 24 Mo | **non** |
| `meditation.mp3` | 12 Mo | **non** |
| `clone.m4a` | 311 Ko | **non** |

Aucun impact LCP direct (jamais chargés), mais alourdissent le repo et restent publiquement téléchargeables.

### P1-7. 12 PNG servis alors que le `.webp` existe

Les `.webp` sont **déjà présents** dans `screens/fr/` et `screens/en/` — aucune conversion à faire.

Home FR (`index.html`), `~750 Ko` l'unité :

- `screens/fr/05_android_fr.png` (ligne 686)
- `screens/fr/07_android_fr.png` (ligne 697)
- `screens/fr/08_android_fr.png` (ligne 708)
- `screens/fr/09_android_fr.png` (ligne 719)

Même problème côté EN (`05`, `07`, `08`, `09_android_en.png`) et sur les variantes en chemin absolu. Ordre de grandeur : **~2,5 Mo évitables par page**.

État de l'optimisation images sur la home : 18 `<img>`, 13 en `loading="lazy"`, 12 avec `width`/`height` explicites.

### P1-8. GitHub Pages — `cache-control: max-age=600`

En-têtes constatés sur `https://caresse.app/` :

```
HTTP/2 200
server: GitHub.com
cache-control: max-age=600
x-github-edge-region: fra
```

10 minutes sur tous les assets, non configurable sur GitHub Pages. Un CDN devant (Cloudflare gratuit) apporterait cache long, Brotli et HTTP/3 — à considérer si les CWV mobiles coincent.

---

## P2 — Affinages

- **`speakable`, `QAPage`, `HowTo` absents partout** (0 page sur 86). `/how-it-works/` est un candidat évident pour `HowTo`.
- **Fraîcheur peu déclarée** : `dateModified` sur 9 pages, `datePublished` sur 15. Critère de sélection fort pour les moteurs IA. Les 6 pages `/vs-*` gagneraient un `dateModified` visible (« comparatif à jour en 2026 »).
- **Descriptions > 160 caractères** (tronquées en SERP) : `/couples-game/` 197, `/for-couples/` 189, `/alternatives/` 185, `/how-it-works/` 184.
- **Title trop long** : `/alternatives/` 92 caractères — coupé aussi.
- **Pages `/vs-*` sous-maillées** : 8 liens entrants contre 22 pour les `/for-*`, alors que leur contenu est le plus riche du site (1580 mots pour `/vs-melt/`). Ce sont les pages qui captent l'intention comparative, la plus qualifiée.
- **PT quasi inexistant** : `/pt/support/` seul, plus 4 pages légales. Décision à prendre : compléter ou assumer.

---

## Contrainte à respecter dans toute correction

Les quotes type « Manon & Yannick », « Sophie & James » sur les pages satellites sont **illustratives, pas de vrais avis utilisateurs**. Ne pas ajouter de `Review` / `AggregateRating` autour : risque de pénalité Google et caractère trompeur. Contrainte déjà documentée dans `# CLAUDE.md` et respectée dans les recommandations ci-dessus.

---

## Corrections appliquées le 2026-08-08

| Réf. | Action | État |
|---|---|---|
| P1-6 | Suppression des 36 Mo d'assets morts (`.webm`, `.mp3`, `.m4a`) | ✅ fait (par l'auteur) |
| P0-1 | `robots.txt` : 15 crawlers IA explicitement autorisés + `Allow: /` | ✅ fait |
| P0-1 | `llms.txt` créé : définition d'entité, 4 piliers, limites factuelles, 30 liens | ✅ fait |
| P0-3 | `/download/` + `/support/` ajoutés au `footer-links` de **63 pages** | ✅ fait |
| P0-5 | `hreflang="es"` + lien ES dans le toggle sur `/blog/` FR et EN | ✅ fait |
| P0-2 | 3 URLs `/download/` ajoutées au sitemap (70 URLs, XML valide) | ✅ fait |
| — | Repositionnement sémantique des 3 homepages (cf. ci-dessous) | ✅ fait |

### Repositionnement des homepages (FR / EN / ES)

Objectif : faire de la home le **centre sémantique** du site et la réponse
incontestable à « qu'est-ce que Caresse ? », sans sacrifier le branding.

- **`<h1>` conservé tel quel** (« Slow down. Feel. Reconnect. ») — c'est du branding
  qui fonctionne.
- **Ligne de catégorie ajoutée** sous le H1 (`.hero-category`) : *AI-guided intimacy
  app for couples & solo exploration*.
- **Premier paragraphe réécrit** pour porter la chaîne
  `intimacy app → couples → solo → AI → guided audio → personalized`, avec maillage
  contextuel vers `/for-couples/` et `/for-solo-exploration/`.
- **`<title>`, `meta description`, `og:*`, `twitter:*`** alignés sur la catégorie.
- **`MobileApplication.description` (JSON-LD)** réécrit en définition d'entité courte,
  factuelle et stable — le format le plus facilement récupérable par un moteur génératif.

Résultats mesurés après application :

| Indicateur | Avant | Après |
|---|---|---|
| Liens entrants `/download/` (FR) | 0 | 22 |
| Liens entrants `/support/` (FR) | 1 | 22 |
| URLs au sitemap | 67 | 70 |
| Anomalies hreflang | 1 (`/blog/`) | 0 |
| JSON-LD invalides | 0 | 0 |
| Liens internes cassés | 0 | 0 |
| `<h1>` non unique | 0 | 0 |

Longueurs des balises après réécriture (affichage réel, entités décodées) :

| Locale | `<title>` | `meta description` |
|---|---|---|
| FR | 57 | 157 |
| EN | 62 | 132 |
| ES | 64 | 150 |

### Seconde passe — 2026-08-08

| Réf. | Action | État |
|---|---|---|
| — | Vidéo YouTube + `VideoObject` sur les 3 homepages | ✅ fait |
| P1-7 | **36 références** PNG → `.webp` sur 27 pages | ✅ fait |
| P2 | 32 pages : titles > 75 car. et descriptions > 185 car. réécrits | ✅ fait |

#### Vidéo de présentation

Section `#video` insérée entre « 4 étapes » et « Pour qui ? » sur FR / EN / ES.

- **Façade cliquable** (miniature + bouton play, iframe injectée au clic) : 0 iframe au
  chargement, ~1 Mo de JS YouTube évité, aucun impact CWV.
- Embed via `youtube-nocookie.com`, cohérent avec le positionnement anonymous-first.
- `VideoObject` JSON-LD avec les métadonnées **réelles** relevées sur YouTube :
  `duration` `PT2M41S`, `uploadDate` `2026-07-12`, chaîne `@app.caresse`.
- Cadre en `aspect-ratio: 4/3` — la vidéo est en 1440×1080, un cadre 16:9 produisait
  des bandes noires.
- Vidéo en anglais servie sur les 3 langues (choix assumé) ; libellés de section
  traduits. `inLanguage: "en"` déclaré honnêtement sur les trois.

#### Images — gain réel supérieur à l'estimation

L'audit initial annonçait « 12 PNG / ~2,5 Mo par page » sur la base d'un échantillon de
la home FR. Le comptage exhaustif donne **36 références sur 7 écrans distincts et
27 pages** :

| Page | Images locales | Poids après | Gain vs PNG |
|---|---|---|---|
| `/` (FR) | 16 | 1 094 Ko | **−6 867 Ko** |
| `/en/` | 16 | 1 070 Ko | ≈ idem |

Les `.webp` étaient déjà présents dans le repo — aucune conversion n'a été nécessaire.
Les `og:image` restent en PNG (support des crawlers sociaux), vérifié.

#### Balises réécrites

32 pages dont le `<title>` dépassait 75 caractères ou la `description` 185. Principe
retenu : **conserver le différenciateur** (« sans compte », le nom du concurrent
comparé) et couper les redondances (« Caresse » dupliqué, énumération des trois
langues, « iOS & Android »). Exemples :

| Page | Avant | Après |
|---|---|---|
| `es/for-busy-couples/` | 95 car. | 48 |
| `alternatives/` | 92 car. | 48 |
| `vs-magicwave/` | 93 car. | 55 |
| `blog/state-of-ai-romance-2026/` (desc) | 215 car. | 147 |

Les 38 pages restant entre 60 et 75 caractères ont été **laissées telles quelles** :
zone grise où Google affiche fréquemment le titre entier, et y toucher risquait de
diluer des mots-clés qui fonctionnent peut-être déjà.

Les `og:title` / `twitter:title` n'ont pas été alignés de force sur les nouveaux
`<title>` : plusieurs pages portaient déjà un titre social distinct et pertinent, ce qui
est légitime.

### Troisième passe — 2026-08-08

| Réf. | Action | État |
|---|---|---|
| P2 | Maillage du cluster comparatif ouvert | ✅ fait |
| P0-4 | `FAQPage` + étoffement de la home | ✅ fait |

#### Cluster `/vs-*` — le diagnostic initial était incomplet

L'audit disait « 8 liens entrants contre 22 pour les `/for-*` ». En détaillant les
sources, le problème s'est révélé différent et plus sérieux : les 8 liens venaient
**uniquement des 5 pages sœurs, de `/alternatives/` et des 2 traductions**. Aucun lien
depuis la home, le blog, les `/for-*` ou le footer. Le cluster était un **îlot fermé** :
aucun jus n'y entrait depuis les pages fortes.

Second défaut, invisible dans le comptage : les 6 ancres de `/alternatives/` vers les
comparatifs étaient toutes « Voir la comparaison → ». Aucun signal sémantique
exploitable par Google ou un LLM.

Trois correctifs :

1. **18 ancres réécrites** (3 langues × 6) : « Voir la comparaison → » devient
   « Comparer Caresse et Melba → », etc.
2. **Section « Comparatifs » sur les 3 homepages**, entre la vidéo et « Pour qui ? » :
   6 cartes vers les `/vs-*` avec une ligne de différenciation factuelle chacune, plus
   un lien vers `/alternatives/`.
3. **Lien contextuel sur les 18 pages `/for-*`**, avant le CTA final, vers
   `/alternatives/` — aucune de ces pages n'en avait un seul dans son corps.

Le compteur brut de liens entrants ne passe que de 8 à 9 (il dédoublonne par page
source), mais la structure change de nature : la home ouvre directement sur les
6 comparatifs, et 18 pages bien maillées alimentent désormais la porte d'entrée du
cluster.

#### FAQ de la home

6 questions d'entrée de funnel, choisies pour **ne pas dupliquer** les FAQ existantes
(inventaire préalable des ~90 questions déjà présentes sur les satellites) : ce qu'est
Caresse, l'essai sans compte, le prix, la différence avec un catalogue audio, les
langues, solo/duo.

- Rendu en **HTML visible** (structure `.faq` / `.faq-item` reprise des satellites)
  **et** en `FAQPage` JSON-LD.
- Cohérence HTML ↔ JSON-LD vérifiée : les 6 questions sont strictement identiques dans
  les deux, sur les 3 langues — c'est une condition d'éligibilité aux rich results.
- Les réponses restent factuelles et **mentionnent les limites** (non-déterminisme,
  incohérences possibles), dans la même logique que `llms.txt`.

| Locale | Mots avant | Mots après | Questions structurées |
|---|---|---|---|
| FR | 615 | **992** | 0 → 6 |
| EN | ~600 | **934** | 0 → 6 |
| ES | ~600 | **995** | 0 → 6 |

**Le dernier P0 est clos.**

### Reste à faire

| # | Action | Réf. |
|---|---|---|
| 1 | `HowTo` sur `/how-it-works/` ; `dateModified` sur les `/vs-*` | P2 |
| 2 | Produire `screens/es/*` et `og-image-es.png` (assets, hors SEO) | — |
| 3 | Trancher sur PT : compléter ou assumer | P2 |
| 4 | CDN devant GitHub Pages si les CWV mobiles coincent | P1-8 |

### Localisation ES — solution intermédiaire appliquée

**Problème constaté** : `screens/es/` n'existe pas. Les pages `/es/` servaient les
captures FR et l'`og:image` FR — un visiteur hispanophone voyait une interface en
français.

**Correctif provisoire** : bascule des pages ES sur les assets **anglais**, plus
lisibles pour un hispanophone que le français.

| Élément | Avant | Après |
|---|---|---|
| Captures (`<img>` + `ImageObject`) | `screens/fr/*` (26 réf.) | `screens/en/*` |
| `og:image` / `twitter:image` | `og-image-fr.png` (36 réf.) | `og-image-en.png` |
| `image` dans JSON-LD blog | `og-image-fr.png` (2 réf.) | `og-image-en.png` |

Parité vérifiée avant bascule : chaque `screens/fr/N` a son équivalent `screens/en/N`.
Les `alt` et `og:image:alt` étaient déjà rédigés en espagnol — inchangés.
FR et EN non touchés.

**Reste à produire** : `screens/es/*` et `og-image-es.png`. Tant qu'ils n'existent pas,
les captures montrent une interface anglaise sur des pages espagnoles — acceptable en
transition, mais ce n'est pas l'état cible.

## Méthode

Audit statique des 86 fichiers HTML de la branche (parsing `hreflang`/`canonical`/JSON-LD, graphe de liens internes, comptage de mots hors `<script>`/`<style>`), complété par des requêtes HTTP sur le site live (en-têtes, `robots.txt`, présence de `llms.txt`, statut des pages légales).

**Non couvert** : données Search Console (impressions, positions, couverture réelle d'indexation), scores Lighthouse/CWV terrain, analyse de backlinks, recherche de volumes de mots-clés. Ces sources renseigneraient la priorisation mais n'étaient pas accessibles depuis le repo.
