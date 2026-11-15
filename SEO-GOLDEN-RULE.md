# Règle d'or — le site existe pour installer l'app

Document de référence, prioritaire sur toute autre considération SEO ou éditoriale.
En cas de contradiction avec `SEO-LINKING.md`, `SEO-WIP.md` ou tout autre document,
**c'est ce fichier qui tranche**.

## Priorité absolue — rappel du propriétaire, 24 octobre 2026

**L’objectif principal de toute intervention est d’optimiser le SEO et d’améliorer
la visibilité de Caresse sur l’App Store et Google Play, pour obtenir davantage
d’installations.** Cette priorité doit être conservée d’une session à l’autre.

Les choix de contenu, de nouvelles pages, de langues, de maillage, de présentation
et de CTA doivent servir cette acquisition : être découvert sur des recherches
pertinentes, donner envie d’essayer l’app et conduire directement au bon store.
L’optimisation des fiches stores (ASO), lorsqu’elle entre dans le périmètre du
travail, poursuit le même objectif de visibilité et de conversion en installations.

Les résultats à suivre sont les impressions et clics organiques pertinents, les
clics vers chaque store, la visibilité des fiches et les installations lorsqu’elles
sont mesurables. Le nombre de pages créées ou le temps passé sur le site ne sont
pas des objectifs en soi.

Les textes s’adressent à des personnes : ton naturel, accueil inclusif des adultes
de tous genres et orientations, consentement libre et mutuel tout au long de
l’expérience. Ces messages doivent rester clairs, sans répétitions qui alourdissent
le parcours de téléchargement.

## L'énoncé

> Le site existe **uniquement** pour le reach SEO et pour les obligations légales des
> stores. Son objectif est d'obtenir des installations d'application. Rien d'autre.

Le mouvement optimal, celui à viser sur chaque page :

```
l'utilisateur arrive par une requête → le PREMIER lien qu'il clique l'amène au store
```

Pas le deuxième. Pas après avoir « découvert l'univers ». Le premier.

## Ce qui découle de la règle

### Le site n'est pas une destination

Le trafic SEO n'est pas une fin. Une session longue, un fort nombre de pages vues, un
faible taux de rebond : ce sont des **métriques de site média**, pas les nôtres. Un
visiteur qui lit trois pages et repart sans installer est un échec, même si l'analytics
est flatteur. Un visiteur qui arrive et clique immédiatement vers le store est une
réussite, même si la session dure douze secondes et compte pour un rebond.

**Le rebond vers le store est l'objectif, pas le symptôme d'un problème.**

### Le SEO amène, la page convertit

Deux rôles séparés, à ne jamais confondre :

| Rôle | Pour qui | Moyen |
|---|---|---|
| Faire venir | Le crawler, l'algorithme | Contenu, maillage interne, schema, hreflang |
| Convertir | L'utilisateur final | Un CTA store, direct, visible, sans détour |

Le maillage interne se fait **pour le SEO, pas pour l'utilisateur final**. Un lien interne
a sa place dans le corps du texte, le footer ou la nav — là où il transmet du jus de lien
sans détourner un humain. Il n'a jamais sa place en CTA visible.

### Les prénoms et les crédits dans les comparatifs

Sur `/alternatives/` et les pages `/vs-*/`, mettre en avant les deux bénéfices
concrets de Caresse : les prénoms ou pseudonymes intégrés au scénario généré et
prononcés dans la narration, en solo ou en duo ; le paiement des générations par
crédits, sans abonnement. Cette personnalisation doit être visible dès
l'introduction, dans toutes les langues, et précisée dans les critères pertinents
des tableaux. Les démos pré-générées utilisent des noms d'exemple ; elles ne sont
pas adaptées au prénom du visiteur.

Comparer séparément sélection de contenus, génération à la demande et prénoms
prononcés. Ne pas revendiquer l'exclusivité de cette fonction ni son absence chez
un concurrent sans vérification. Conserver les libellés et destinations des CTA
stores pendant ces changements éditoriaux.

### `/demo/` ne cannibalise jamais l'app

`/demo/` est une page d'atterrissage SEO, **pas une étape du tunnel de conversion**.

- Aucun CTA visible (`.cta-pink`, `.cta-ghost`) ne pointe vers `/demo/` depuis une page
  qui porte déjà un CTA store.
- Sur `/demo/` même, le CTA store est prioritaire et répété : en hero, à la sortie
  d'écoute, et en pied de page.
- Le lien interne vers `/demo/` reste autorisé en lien texte discret, footer ou nav.

### Aucun lien vers un concurrent — sans exception

- Dans les pages `alternatives` et `vs-*`, aucun lien cliquable vers le site, le
  support, les tarifs, les réseaux sociaux ou la fiche App Store / Google Play des
  alternatives comparées, y compris dans les sources décrivant leurs offres.
- Sur tout le site, aucun lien vers un concurrent : site, support, tarifs, réseaux
  sociaux, stores ou article de blog. Cette interdiction couvre aussi les citations
  de sources, même avec `nofollow`. Les attributions restent en texte simple.
- `nofollow`, `noopener` ou l’ouverture dans un nouvel onglet ne constituent pas une
  exception : ils n’autorisent pas ces liens promotionnels.
- Les comparatifs peuvent citer les marques et leurs offres. Les attributions de
  sources sur les offres comparées restent en texte simple : éditeur, document ou
  fiche consultée, date, sans URL externe de concurrent.
- Les liens vers nos propres pages de comparaison (`/vs-*/`, `/en/vs-*/`, etc.)
  restent autorisés : ils pointent vers Caresse, pas vers les concurrents.
- Le maillage interne vers nos comparatifs reste important, y compris dans les
  tableaux : le rappel du propriétaire du 15 novembre 2026 vise les liens sortants
  qui donnent de la visibilité aux concurrents, pas nos propres pages Caresse.
- Les études et sources qui ne sont pas des alternatives à Caresse peuvent être
  liées, conformément à la précision du propriétaire du 15 novembre 2026.
  Tawkify et Connected Couples sont utilisés ici comme références éditoriales ;
  les liens restent limités aux études citées, sans lien vers leurs offres.
- La règle s’applique à toutes les langues. Les liens légaux et institutionnels
  restent autorisés.
- `npm run build` contrôle tous les HTML générés : destinations externes limitées
  aux liens Caresse et aux références non concurrentes déjà vérifiées ; seules les
  fiches stores et les profils sociaux Caresse sont autorisés. Toute nouvelle
  destination externe nécessite une vérification avant ajout à la liste autorisée
  de `scripts/check-no-competitor-links.mjs`.

## Les invariants techniques

À vérifier avant tout commit touchant un CTA :

1. **Le CTA principal (`.cta-pink`) pointe directement vers le store**
   (`https://apps.apple.com/...` ou `https://play.google.com/...`). Il ne pointe jamais
   vers une page interne ni vers l'ancre `#download`.
2. **Pas de page de rebond** sur le chemin du CTA principal — ni `/download/`, ni `/demo/`,
   ni aucune autre. Chaque clic intermédiaire coûte des installs.
3. **Toute page portant un `id="hero-cta"` embarque le script de bascule Android** en pied
   de page. Sans lui, 100 % des visiteurs Android atterrissent sur l'App Store.
   Si une page a plusieurs CTA store, le script les couvre **tous** (tableau d'ids).
4. **Les liens store s'ouvrent avec** `target="_blank" rel="noopener"`.
5. **Toutes les langues du site en même temps** — FR, EN, ES, PT et DE. Une correction de CTA sur une seule
   locale est une correction non faite.

## Ce qui ne se change pas sans raison mesurée

Le libellé d'un CTA qui convertit ne se réécrit pas au passage d'un autre chantier. Si un
libellé paraît incohérent avec sa destination, c'est une observation à remonter — pas une
licence pour le modifier. Réparer un lien et réécrire son texte dans le même commit rend
tout résultat ininterprétable : impossible de savoir laquelle des deux variables a agi.

## L'incident fondateur — 2026-08-28

Le commit `2427ccf` a basculé le CTA hero de 24 pages alternatives (`/alternatives/` et
`vs-*`, sur les 3 locales) du lien store direct vers `/demo/`, et supprimé au passage le
script de bascule Android.

Trois régressions simultanées :

- un clic supplémentaire inséré avant le store, sur les pages à plus forte intention
  d'achat du site ;
- tous les visiteurs Android renvoyés vers l'App Store, faute de script ;
- `/download/` passée en `noindex`.

Reverté le 2026-08-29. Ce que l'incident enseigne : l'intention était bonne — renforcer le
maillage interne vers `/demo/` — mais elle a été appliquée à l'endroit exact où la
conversion se joue. **Le maillage interne ne se paie jamais en CTA de conversion.**

### La mesure

Dans les **15 minutes** suivant le revert, le nombre de téléchargements de la journée a
quasiment **doublé**.

Un clic intermédiaire inséré entre l'utilisateur et le store a coûté environ la moitié des
installations. C'est l'ordre de grandeur à garder en tête chaque fois qu'un CTA store est
remplacé par un lien interne : ce n'est pas une optimisation à la marge, c'est la moitié
du résultat.

## Checklist avant merge

- [ ] Aucun `.cta-pink` ne pointe vers une page interne
- [ ] Aucun `.cta-ghost` ne pointe vers `/demo/` sur une page portant un CTA store
- [ ] Toute page avec `id="hero-cta"` a son script Android, couvrant tous ses ids
- [ ] Toutes les langues du site sont traitées (FR, EN, ES, PT, DE)
- [ ] Aucun libellé de CTA modifié sans décision explicite
- [ ] Aucun lien sortant vers les alternatives comparées dans `alternatives` / `vs-*`
- [ ] Aucun lien vers un concurrent, y compris dans les sources du blog
- [ ] Maillage interne vers nos comparatifs conservé, y compris dans les tableaux
- [ ] Tous les liens vers des fiches App Store / Google Play ciblent Caresse
