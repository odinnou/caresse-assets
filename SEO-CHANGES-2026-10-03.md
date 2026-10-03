# Améliorations du 3 octobre 2026

## Objectif principal

Augmenter le **nombre d’événements `store_click` hors tests**. Le nombre de visites
ayant cliqué et le taux visite → clic store servent à interpréter ce volume. Le temps
passé sur le site et le nombre de pages vues ne sont pas des critères de réussite.

## Changements réalisés

- **Melt FR / EN / ES** : premier écran centré sur l’audio personnalisé, l’installation
  sur iPhone/Android et les démos gratuites. Titres SEO et libellés des boutons
  conservés. Une réponse distingue Caresse du téléchargement officiel de Melt.
- **Dipsea FR / EN / ES** : premier écran plus court, disponibilité des langues et
  absence d’abonnement explicites. H1 français et espagnol alignés sur l’intention
  d’alternative dans ces langues. Les FAQ distinguent démos et génération payante.
- **Couples game FR / EN / ES** : retrait du bouton secondaire vers `#diff` en hero,
  ajout d’un CTA store après le tableau, routage Android de tous les CTA automatiques.
  Les FAQ précisent essai gratuit et application mobile. Les titres restent inchangés.
- **Nouvelles pages** : `/tarifs/`, `/en/pricing/`, `/es/precios/`. Intention distincte :
  gratuité, crédits et achat unique optionnel. CTA store directs en hero, après les
  offres et en fin de page. Les montants exacts sont renvoyés à l’affichage de l’app,
  car les tableaux historiques du site datent de juin et les tarifs des stores n’ont
  pas pu être vérifiés. Aucun nouveau prix n’a été inventé.
- **Maillage** : lien texte tarifs dans le footer des accueils, comparatifs Melt et
  Dipsea et pages jeux, dans les trois langues. Liens contextuels depuis les tarifs
  vers Couples game et Alternatives. Les boutons de téléchargement restent directs.
- **Réparation** : neuf liens vers les anciennes ancres du hub démo remplacés par
  les URL des démos dédiées. Ces liens restent facultatifs et éditoriaux.
- **SEO technique** : canonical, hreflang réciproques et sitemap pour les trois
  nouvelles URL. FAQ visibles et JSON-LD cohérents. `lastmod` actualisés uniquement
  pour les pages modifiées.

## Mesure Umami

L’événement `store_click` conserve ses champs historiques et ajoute :

- `first_store_click` : premier clic store de la visite définie par le script,
  indépendamment d’un éventuel clic interne précédent ;
- `acquisition_source` : source d’entrée conservée entre les pages ;
- `client_visit_started_at` et `visit_definition=client-30min-v2` : définition
  explicite du parcours côté navigateur. Elle reste distincte du `visit_id` Umami.

Le marqueur `analytics_test=1` est conservé pendant la visite pour marquer les clics
de test après navigation. `analytics_test=0` le désactive explicitement. Les aperçus
sur un domaine autre que `caresse.app` n’émettent pas de conversions. Un stockage
indisponible ou un tracker en erreur ne bloque jamais l’ouverture du store.

Les neuf pages d’acquisition portent une nouvelle valeur de `variant` terminée par
`seo-oct03-v1`. Les pages tarifs portent `pricing-v3`. Ce marquage identifie le lot ;
il ne constitue pas un test A/B randomisé.

## Vérification

- 21 pages : H1 unique, canonical, hreflang existants et réciproques, nouvelles
  destinations internes valides, présence des scripts et attributs des liens stores.
- JSON-LD valide et textes des FAQ présents dans le contenu visible.
- Sitemap XML valide : 106 URL, sans doublon, nouvelles pages incluses.
- Simulations JavaScript : clics Apple/Google, clics répétés, première conversion
  après un lien interne, conservation de la source, expiration après inactivité,
  conservation du marqueur de test, absence d’événements locaux, stockage/analytics
  indisponibles. Routage Android, iPhone, iPad et choix desktop vérifiés.
- `git diff --check` valide.
- Aucun navigateur connecté : contrôle visuel du rendu réel non réalisé.

## Lecture après publication

Comparer des fenêtres de 28 jours, avec les mêmes règles d’exclusion des tests :
nombre de `store_click`, puis visites avec au moins un clic store, par canal et par
page d’entrée. Comparer séparément les neuf pages modifiées et les nouvelles pages.
Un CTR ou un taux de clic store en hausse ne suffit pas si le volume total diminue.

La correction de bouton Play Store du 2 octobre précède ce lot. Le nouveau tracking
et la définition explicite de visite créent aussi une rupture de mesure : les taux
avant/après ne doivent pas être interprétés comme un effet causal certain.

Les modifications sont locales. Aucun commit, push ou déploiement effectué.

## Refonte des tarifs après retour visuel

Les trois pages tarifs reprennent désormais les composants des comparatifs
existants : règles de styles extraites de `vs-melt/index.html`, header et footer
repris dans chaque langue, hero centré avec titre dégradé, grille `pricing-grid`,
cartes `price-card`, sections et FAQ identiques au reste du site. Le déverrouillage
optionnel reste séparé des crédits. Le fichier `seo-pricing.css` a été retiré ; les
styles sont intégrés au HTML comme dans les 122 autres pages. Il n’y a pas eu de
refactorisation des styles du reste du site.

Les CTA restent directs vers le store et adaptatifs sur Android ; les choix
App Store et Google Play sont explicites pour les appareils non identifiés. Canonicals,
hreflang, URL et réponses structurées sont conservés. Les montants payants restent
à confirmer ; aucun prix non vérifié n’a été ajouté. Les contrôles statiques des
21 pages et `git diff --check` passent. Le rendu visuel réel reste à contrôler : aucun
navigateur Chrome ou intégré n’est disponible dans la session.

## Vérification de la langue des slugs du site

Comptage sur les 125 pages HTML du projet actuel, y compris les nouvelles pages
tarifs, les pages légales et les pages de téléchargement. Les trois accueils n’ont
pas de slug. Les préfixes de locale ne sont pas comptés comme des slugs ; chaque nom
de page distinct n’est compté qu’une fois, même s’il est repris sur plusieurs locales.

Classification lexicale manuelle, avec marques et termes communs dans une catégorie
séparée (`blog`, `demo`, `support`, `alternatives`, `solo-sextoys`, `vs-*`) :

| Langue du slug | Slugs distincts | Part des 49 slugs |
| --- | ---: | ---: |
| Anglais | 19 | 38,8 % |
| Français, y compris les sigles CGU/CGV | 12 | 24,5 % |
| Espagnol | 5 | 10,2 % |
| Communs ou noms de marques | 13 | 26,5 % |

Sur les 31 slugs classés anglais ou français seulement : 61,3 % anglais et 38,7 %
français. Ce comptage concerne la langue des noms d’URL, pas celle du contenu.

Les six démos détaillées EN réutilisent les slugs FR : cinq sont français et
`solo-sextoys` est classé commun. Leurs canonicals HTML pointent néanmoins vers
leurs propres URL `/en/demo/.../`. Aucune URL de démo n’a été renommée.

## Lot suivant autorisé : migration des démos et CTA

La vérification des slugs ci-dessus décrit l’état avant ce nouveau lot. Dix URL
de démos EN/ES sont maintenant localisées. Les anciens chemins sont conservés
avec un `meta refresh` instantané et un canonical vers la nouvelle URL. Il ne
s’agit pas de réponses HTTP 301 : le site est hébergé en statique sur GitHub Pages.
Les URL françaises et les URL d’acquisition restent inchangées.

Les 18 démos détaillées ont un CTA store avant le lecteur, un rappel démo gratuite /
crédits payants et un sélecteur de langue vers le même scénario. Le bouton mobile
fixe se cache uniquement pour un autre lien store visible, pas pour un footer
générique. Les paramètres de redirection et la source d’acquisition sont préservés
avec JavaScript et stockage disponible ; leur absence ne bloque pas la navigation.

Les nouveaux canonicals, hreflang, URL structurées, liens et sitemap sont validés.
Le sitemap reste à 106 URL canoniques et le dépôt contient 135 pages HTML, dont
dix redirections. Les 119 scénarios JavaScript passent. Aucun gain d’indexation
n’est prétendu obtenu : aucun blocage local des démos n’a été établi et leur statut
Google actuel reste à inspecter. Aucun contrôle visuel réel n’a été possible.

Détail et mapping : [`SEO-DEMO-MIGRATION-2026-10-03.md`](SEO-DEMO-MIGRATION-2026-10-03.md).
