# Comparison pages — Chantier "Pages /vs-* + hub /alternatives/" — TERMINÉ + ITÉRATION 2 ✅

> **État au 2026-06-13** — Premier batch livré sur branche `feat/seo-5`. 8 pages (3 vs + 1 hub, FR et EN), sitemap mis à jour, hreflang croisés OK. **Itération 2 (même jour)** : repositionnement offensif autour des 4 piliers. **Itération 3 (2026-06-13)** : ajout des vrais prix Caresse (2,99 € / 8,49 € / 11,99 € + accès à vie) sur les 6 pages vs existantes ; création de `/vs-melt/` + `/en/vs-melt/` (Melt Stories) ; ajout de Melt dans la matrice et les featured cards des hubs `/alternatives/`.

## Pages créées

| URL FR | URL EN | Concurrent | Angle |
|---|---|---|---|
| `/vs-melba/` | `/en/vs-melba/` | **Melba** | Catalogue francophone pré-enregistré (thérapeutes) vs scénario unique avec prénoms |
| `/vs-coelle/` | `/en/vs-coelle/` | **Coelle** | Library d'intimité guidée internationale ($49.99/an) vs achat à la session |
| `/vs-inthemoment/` | `/en/vs-inthemoment/` | **InTheMoment** | Approche AI uniquement (cas d'usage différent) : prompts curatés vs génération ouverte |
| `/vs-melt/` | `/en/vs-melt/` | **Melt Stories** | Stories intimes pour couples (anglais, compte requis, pricing non communiqué) vs scénario unique avec prénoms |
| `/alternatives/` | `/en/alternatives/` | Hub | Panorama : 4 comparaisons mises en avant (Melba, Coelle, InTheMoment, Melt) + Dipsea / Ferly / Bloom Stories en cartes courtes |

## Itération 2 (2026-06-13) — repositionnement offensif

Après livraison initiale, repositionnement des 8 pages autour des **4 piliers Caresse** (cf memory). Objectif explicite : capture SEO offensive sur les recherches « <concurrent> alternative », « <concurrent> vs », « <concurrent> review ». L'utilisateur arrive sur ces pages parce qu'il évalue un concurrent, chaque page doit montrer une silver bullet qui penche clairement vers Caresse.

### Silver bullets martelées
1. **« Démo audio gratuite sans compte, FR/EN/ES »** — répété en hero, badge, tableau, FAQ, CTA. Différenciateur principal vs Coelle (compte obligatoire), valable vs tous les autres aussi.
2. **« Usage 100 % anonyme, paiement compris »** — Caresse est le seul à le proposer dans le segment. Verdict tableau, Choose, FAQ.
3. **« FR · EN · ES en audio »** — Caresse couvre les 3 langues nativement, en prod. Tous les concurrents sont monolingues ou anglophones.
4. **« Pay-per-session, pas d'abonnement »** — déjà présent, conservé.

### Style hero — soft, redevient explicite au verdict
- Hero h1 + meta + TL;DR : vocabulaire élégant (« écoutez avant de décider », « complicité », « rituel », « reconnexion »). Pas de « dirty-talk », « pratiques », « intensité » visibles au-dessus du fold.
- Dès la section verdict + bloc Caresse highlight + Choose + FAQ : on redevient précis (genres, pratiques, accessoires, intensité, dirty-talk, lieu, ambiance).
- Permet de passer plus facilement le scan rapide d'un visiteur peu à l'aise / sur un device partagé, sans perdre la précision SEO sur les termes spécifiques.

### Limite factuelle importante des démos
**Les démos ne permettent pas de choisir prénoms / pratiques / accessoires.** Elles sont des exemples réels qui démontrent la qualité sonore, le grain de voix, l'ambiance et les niveaux d'intensité. Seules les sessions sur-mesure (payantes) prennent en compte le profil personnalisé. Cette nuance est explicite sur chaque page (« les démos n'utilisent pas votre prénom ni votre profil, mais elles reflètent fidèlement l'expérience »).

### Ce qui a changé concrètement sur les 8 pages
- **Meta + title** : repositionnés sur « démo sans compte » + langues FR/EN/ES
- **Hero h1** : « Écoutez avant de vous décider » (FR) / « Listen first, decide later » (EN), avec variantes par page
- **Hero badge** : « Audio en français, anglais, espagnol · Sans compte, sans email »
- **CTA principal** : « Écouter les démos gratuites » (au lieu de « Première session offerte » qui était inexact)
- **TL;DR** : ajout des 2 silver bullets en pivot
- **Verdict tableau** : 2 nouvelles lignes en tête (« Démo audio sans compte », « Création de compte requise ») + langue mise à jour FR/EN/ES
- **Bloc colonne Caresse highlight** : 2 paragraphes restructurés (démos + session sur-mesure), 2 nouvelles bullets en tête
- **Bloc colonne concurrent muted** : ajout « compte requis » dans la liste finale
- **Choose Caresse if** : 2 bullets en tête (démos + anonymat) + langue ES ajoutée
- **FAQ** : 2 Q&A en tête (démo + anonymat) — JSON-LD synchro
- **CTA final** : « Écoutez d'abord. Décidez ensuite. »
- **Hub `/alternatives/` matrice** : 2 nouvelles colonnes (« Démo sans compte », « Usage anonyme ») + ES en langue Caresse
- **Hub `/alternatives/` Who** : 3 nouvelles cards (démo · anonymat · espagnol)

## Décisions structurelles (inchangées depuis itération 1)

1. **Structure type de chaque page `/vs-X/`** : Hero → TL;DR encadré → tableau verdict 10 critères → 2 colonnes narratives (Caresse highlight + concurrent muted) → Pricing one-shot vs abonnement → "Choose if…" double colonne → FAQ + `FAQPage` JSON-LD → CTA → liens internes → footer. La page `/vs-inthemoment/` ajoute en plus une section **"Quality deep dive"** sur le pipeline 6 phases.
2. **Hub `/alternatives/`** structure différente : Hero → 3 cards "featured comparisons" → matrice globale 7 lignes × 7 colonnes → "more alternatives" pour Dipsea/Ferly/Bloom → "Who should pick what" (8 cards) → FAQ.
3. **Hreflang croisés FR ↔ EN** sur toutes les pages (`alternate` + `x-default` pointant vers FR).
4. **JSON-LD** : `FAQPage` + `WebPage` (ou `CollectionPage` sur le hub). Breadcrumb dans le JSON-LD inclut `Alternatives` comme niveau intermédiaire.
5. **Pas de Review schema** (les noms cités sont des concurrents — pas notre place de leur donner une note avec `aggregateRating`). Cohérent avec [memory/caresse-testimonial-quotes.md](~/.claude/projects/-Users-odinnou-dev-assets/memory/caresse-testimonial-quotes.md).
6. **Ton concurrent** : factuel et respectueux. Chaque page reconnaît la valeur du concurrent avant d'expliquer pourquoi Caresse choisit autrement. Pas de bashing.
7. **Toggle de langue** : vrais liens `<a href>` vers le miroir (convention SEO-3, pas de JS).
8. **Header link "Alternatives"** : ajouté à côté de "Blog" dans le header. **À propager aux pages existantes** (home, `/for-*/`, blog, EN miroirs) lors du prochain passage — non fait dans ce chantier pour rester surgical.
9. **Footer** : un lien "Alternatives" ajouté dans la nav du footer de chaque page `/vs-*` et `/alternatives/`. Les pages anciennes n'ont pas été touchées.

## Données concurrents (tarifs au premier trimestre 2026, taux 1 EUR = 1,16 USD)

À mettre à jour si les concurrents changent:

| Concurrent | Modèle | Tarif affiché (EUR) | Tarif source | Langue | Source |
|---|---|---|---|---|---|
| Melba | Abonnement | Non chiffré (vérifier officiel) | — | FR | melba.app |
| Coelle | Abonnement annuel | ~43 €/an | $49.99/yr | EN | coelle.app |
| Dipsea | Abonnement annuel | ~60 €/an | $69.99/yr | EN | mention via coelle/dipsea |
| InTheMoment | Gratuit + Pro | ~7,99 £/mois (devise originale) | £7.99/mo | EN + 9 (Pro) | inthemoment.app |
| Ferly | Abonnement | Non chiffré | — | EN | - |
| Bloom Stories | Abonnement | Non chiffré | — | EN | - |
| Melt Stories | Non communiqué | Non communiqué publiquement | — | EN | meltstories.com |

**Tarifs Caresse (en vigueur juin 2026)** : 2,99 € / 1 expérience (25–35 min) · 8,49 € / 3 expériences · 11,99 € / 5 expériences. Chaque expérience générée est disponible à vie sur le compte. Ces tarifs sont affichés sur toutes les pages `/vs-*` depuis l'itération 3.

**Choix éditorial** : Coelle et Dipsea convertis en EUR (taux 1.16 fourni par le métier). InTheMoment laissé en £ (devise originale UK, plus précis). La mention `Tarifs au premier trimestre 2026, conversion 1 EUR = 1,16 USD` est présente sur chaque page (pricing-footnote / footnote / FAQ).

## Melba : démos / mode offline

Melba propose un **mode offline avec quelques scénarios gratuits** (constaté Q1 2026). Mention factuelle sans en faire la promo : on dit « Quelques scénarios disponibles en mode offline » (FR) / « A few scenarios available in offline mode » (EN) dans le verdict tableau de `/vs-melba/` et dans la matrice de `/alternatives/`. On ne fait pas plus que mentionner. La page reste positionnée sur la silver bullet Caresse (dizaines de démos sans compte ni inscription).

## Sitemap

8 nouvelles entrées ajoutées avec `priority=0.7` (entre `/for-*/` à 0.8 et blog à 0.7). `lastmod=2026-06-13`. Hreflang croisés FR ↔ EN.

## Maintenance — règles de propagation

Comme pour les pages `/for-*/`, **toute modif d'une page `/vs-X/` (FR) doit être propagée sur `/en/vs-X/`**. Idem pour `/alternatives/`. Pas de build script — duplication manuelle.

**Tarifs concurrents** : vérifier au moins 1× par trimestre sur les sites officiels. Si un tarif a changé, mettre à jour les tableaux + la date du `pricing-footnote`.

## Risques à surveiller à la reprise

- **Lien `Alternatives` non ajouté aux pages existantes** : home, `/for-*/`, blog, EN miroirs. À faire au prochain passage pour cohérence de navigation.
- **`vs-dipsea/` non créée** : volontaire (phase ultérieure). Si on la crée, ajouter la card "featured" sur `/alternatives/` et déplacer Dipsea hors de la section "more".
- **Dérive des tarifs** : si Coelle, Dipsea ou InTheMoment changent leur pricing, les pages comparison référencent des chiffres qui vieillissent. La footnote "constaté en juin 2026" limite le risque mais ne le supprime pas.
- **Risque juridique faible** : on ne fait pas de claim chiffré comparatif type "Caresse est 30% moins cher" — juste des descriptions factuelles avec date de constatation. Pas de `Review` ni `aggregateRating` sur les concurrents.

## Suite éventuelle

- **Versions ES** : `/es/vs-melba/`, `/es/vs-coelle/`, `/es/vs-inthemoment/`, `/es/alternatives/` — reporté en phase ultérieure. Comme Caresse propose ES en audio, on capte du SEO hispanophone. À faire en une seule passe disciplinée pour conserver la cohérence avec FR/EN. Si oui, ajouter aussi le toggle de langue à 3 boutons (FR · EN · ES) sur toutes les pages (y compris les `/for-*/`).
- `/vs-dipsea/` + `/en/vs-dipsea/` si ROI SEO confirmé sur les premières pages.
- Propager le lien "Alternatives" dans la nav header de toutes les pages existantes (home, `/for-*/`, blog).
- Page `/pricing/` (FR + EN) qui détaille l'offre pay-per-session Caresse, référencée depuis les pages `/vs-*/` à la place du bloc pricing inline.
- **Atterrissage démos** : si une URL spécifique existe pour les démos audio (ex: `/demos/` ou Play Store deep-link), router les CTA « Écouter les démos gratuites » vers elle au lieu du Play Store générique pour réduire la friction de découverte.
