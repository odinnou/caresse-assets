# Règle d'or — le site existe pour installer l'app

Document de référence, prioritaire sur toute autre considération SEO ou éditoriale.
En cas de contradiction avec `SEO-LINKING.md`, `SEO-WIP.md` ou tout autre document,
**c'est ce fichier qui tranche**.

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

### `/demo/` ne cannibalise jamais l'app

`/demo/` est une page d'atterrissage SEO, **pas une étape du tunnel de conversion**.

- Aucun CTA visible (`.cta-pink`, `.cta-ghost`) ne pointe vers `/demo/` depuis une page
  qui porte déjà un CTA store.
- Sur `/demo/` même, le CTA store est prioritaire et répété : en hero, à la sortie
  d'écoute, et en pied de page.
- Le lien interne vers `/demo/` reste autorisé en lien texte discret, footer ou nav.

### Ne pas faire la promotion des alternatives à Caresse

- Dans les pages `alternatives` et `vs-*`, aucun lien cliquable vers le site, le
  support, les tarifs, les réseaux sociaux ou la fiche App Store / Google Play des
  alternatives comparées, y compris dans les sources décrivant leurs offres.
- Sur le reste du site non plus, aucun CTA ni lien commercial pour découvrir,
  acheter ou télécharger une alternative à Caresse.
- `nofollow`, `noopener` ou l’ouverture dans un nouvel onglet ne constituent pas une
  exception : ils n’autorisent pas ces liens promotionnels.
- Les comparatifs peuvent citer les marques et leurs offres. Les attributions de
  sources sur les offres comparées restent en texte simple : éditeur, document ou
  fiche consultée, date, sans URL externe de concurrent.
- Les liens vers nos propres pages de comparaison (`/vs-*/`, `/en/vs-*/`, etc.)
  restent autorisés : ils pointent vers Caresse, pas vers les concurrents.
- Les références éditoriales du blog sont distinctes des liens promotionnels : un
  lien d’attribution vers une enquête ou un dossier statistique cité reste autorisé.
  Tawkify et Connected Couples sont utilisés ici comme références, pas comme
  alternatives à recommander. Seuls les liens vers les documents cités sont
  conservés, sans lien vers leurs offres commerciales ou leurs stores.
- La règle s’applique à toutes les langues. Les liens légaux et institutionnels
  restent autorisés.

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
5. **Les quatre locales en même temps** — FR, EN, ES, PT. Une correction de CTA sur une seule
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
- [ ] Les quatre locales sont traitées (FR, EN, ES, PT)
- [ ] Aucun libellé de CTA modifié sans décision explicite
- [ ] Aucun lien sortant vers les alternatives comparées dans `alternatives` / `vs-*`
- [ ] Aucun lien promotionnel vers une alternative ; les références du blog pointent
      uniquement vers les documents cités
- [ ] Tous les liens vers des fiches App Store / Google Play ciblent Caresse
