# Démonstrations : migration ciblée et clics store

## Périmètre

Objectif principal : augmenter le nombre de `store_click` hors tests. Aucun objectif
de temps passé ou de pages vues. Dix slugs de démos EN/ES sont localisés. Les six
URL françaises, `solo-sextoys`, les hubs démo et toutes les URL d’acquisition sont
conservés. Le sitemap contient toujours 106 URL canoniques.

Les changements sont locaux : aucun commit, push, déploiement ou demande
d’indexation dans Search Console n’a été effectué par l’agent.

## Résultat de l’audit

- L’export valide fourni liste 83 URL, dont les trois hubs démo. Les 18 pages
  détaillées ne figurent pas dans cette liste. Le graphique s’arrête au
  21 septembre et la liste d’exemples n’est pas une inspection en temps réel.
- Les pages détaillées existent dans Git depuis le 30 août, donc leur absence ne
  s’explique pas simplement par une création après la période du rapport.
- Aucun `noindex`, blocage robots, canonical interlangue, MP3 local manquant ou lien
  interne cassé constaté sur les 18 démos. Leurs textes HTML sont propres à chaque
  scénario. Aucune cause précise de non-indexation Google n’est établie.
- Deux routes en production vérifiées en lecture seule (`/demo/couple-romantique/`
  et `/en/demo/couple-romantique/`) répondent HTTP 200 et sont servies par GitHub.
  Cela vérifie l’accès à ces deux pages, pas l’état de l’index Google ni les autres
  routes en production.
- Le CTA principal des 18 démos était uniquement sous le lecteur et les sections
  éditoriales. Un CTA direct vers le store est ajouté avant le lecteur.
- Le sélecteur de langue des pages détaillées renvoyait aux hubs. Il conserve
  désormais le scénario sélectionné.
- Le bouton mobile fixe se cachait dès que le footer était visible, même sans
  store. Il se cache désormais uniquement lorsqu’un autre lien store est visible.

## Mapping des slugs

Chaque ancien chemin EN/ES est conservé comme page de redirection vers le nouveau.
Les noms de fichiers audio restent strictement inchangés.

| Slug FR conservé | Nouveau slug sous `/en/demo/` | Nouveau slug sous `/es/demo/` |
| --- | --- | --- |
| `couple-romantique` | `romantic-couple` | `pareja-romantica` |
| `couple-torride` | `passionate-couple` | `pareja-apasionada` |
| `couple-deux-femmes` | `couple-two-women` | `pareja-dos-mujeres` |
| `couple-deux-hommes` | `couple-two-men` | `pareja-dos-hombres` |
| `solo-decouverte-sensuelle` | `solo-sensual-discovery` | `exploracion-sensual-en-solitario` |

Mapping vérifiable par les tests : `tests/fixtures/demo-redirects.json`.
Les liens HTML, canonical, hreflang, URL Open Graph, AudioObject, BreadcrumbList,
ItemList des hubs et sitemap ont été mis à jour. Les anciennes URL ne figurent
plus dans le sitemap ni dans les liens internes du contenu actif. Les `lastmod`
des pages réellement modifiées sont actualisés, pas ceux de tout le site.
Les annotations `x-default` des 18 démos sont alignées entre HTML et sitemap.

## Redirections compatibles avec GitHub Pages

GitHub Pages sert des fichiers statiques. Aucune règle `.htaccess`, `_redirects`
ou redirection HTTP 301 n’est prétendue opérationnelle dans ce dépôt.

Chaque ancienne URL contient un `meta refresh` à zéro seconde, un canonical et
un lien de secours vers la nouvelle URL. Google interprète le `meta refresh`
instantané comme une redirection permanente. Le serveur renverra toutefois un
statut HTTP 200 pour ce fichier HTML, et non 301. Si des règles 301 sont ajoutées
ultérieurement sur un proxy ou un nouvel hébergement, reprendre le même mapping.

Le script de redirection utilise `location.replace` et conserve la query string
et le fragment, notamment `utm_source` et `analytics_test`. Avec JavaScript
désactivé, le `meta refresh` permet encore d’accéder à la destination, mais ne
conserve pas dynamiquement les paramètres. Les redirections n’émettent pas de
pageview ou de `store_click` : elles n’embarquent pas de tracker.

Le referrer original est transmis par un contexte temporaire en sessionStorage,
consommé une fois par le tracker de destination si la route correspond et si son
âge ne dépasse pas 30 secondes. Un contexte invalide, périmé ou un stockage
indisponible n’empêchent ni la redirection ni l’ouverture du store.

Conserver les anciens chemins au moins un an après publication, idéalement
indéfiniment pour les liens partagés. Ne pas supprimer les stubs après la première
indexation des nouvelles URL.

Références :

- [Redirections et Google Search](https://developers.google.com/search/docs/crawling-indexing/301-redirects)
- [Migration d’URL](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes)
- [Limites du rapport d’indexation](https://support.google.com/webmasters/answer/7440203?hl=fr)
- [GitHub Pages : hébergement statique](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)

## Conversion et mesure

- CTA direct avant le lecteur sur les 18 démos, avec le composant visuel existant
  `hero-store-cta`. Styles, titres, H1, audio et libellés des CTA de fin conservés.
- Routage partagé des deux CTA vers Google Play sur Android et App Store sur iOS.
- Mention visible : démo gratuite, sessions personnalisées par crédits payants,
  sans abonnement. Pas de prix inventé ni de promesse de génération gratuite.
- `variant=demo-seo-oct03-v1` pour les 18 démos détaillées,
  `demo-hub-seo-oct03-v1` pour les trois hubs. Les positions `hero` et `end` sont
  explicites sur les démos détaillées.
- Correction du bouton fixe partagée avec les autres pages du site. Pas de
  réécriture des libellés des CTA existants. Lorsqu’il est caché, son lien est retiré
  de l’ordre de tabulation. Le bouton fixe est désactivé sur desktop et ne dépend
  plus de la simple présence du footer.

Cette livraison combine migration et correction de CTA. Elle ne constitue pas
un test A/B : ne pas attribuer un changement de `store_click` aux seuls slugs.
Pour la comparaison, regrouper chaque ancien et nouveau chemin via le mapping,
exclure les tests et suivre d’abord le volume total de clics store par source.

## Vérifications et limites

- `python3 tests/validate-demo-seo.py` : 135 fichiers HTML, 106 URL de sitemap,
  18 démos canoniques, 10 redirections et 3 633 liens internes, aucune erreur.
- Canonicals auto-référents, hreflang HTML/sitemap réciproques, données structurées
  valides, lecteurs et fichiers MP3 existants, sélecteurs de langue équivalents.
- `node tests/demo-migration.test.mjs` : 119 scénarios JavaScript, dont les
  18 démos sur quatre configurations Android/iPhone/iPad/iPadOS, les dix
  redirections avec/sans stockage, la conservation des paramètres, l’attribution
  Google, les contextes invalides et la non-émission de conversions locales.
  Exécutés ici dans le runtime Node disponible, sans dépendance tierce.
- Comparaison au commit initial `7c782c3` : CSS, titres, audio et libellés des
  CTA de fin inchangés sur les 18 démos. 96 URL du sitemap sont conservées et
  dix remplacées, leurs anciennes routes restant disponibles par redirection.
- Le validateur préexistant des 21 pages du lot SEO initial passe également.
- `git diff --check` valide.
- Les six liens store de secours des trois pages `download` en `noindex` conservent
  leur comportement existant dans le même onglet, hors périmètre de ce lot.
- Aucun navigateur connecté : rendu visuel réel non vérifié. Les tests de DOM sont
  des simulations, pas un contrôle des intersections dans un navigateur réel.
- L’état d’indexation actuel et le canonical choisi par Google nécessitent
  l’inspection d’URL dans Search Console. Aucun gain SEO ou store n’est garanti.

## Après publication autorisée

1. Vérifier en production les dix anciennes routes et leurs destinations, les
   lecteurs, les CTA mobile et la conservation de `analytics_test=1`.
2. Soumettre le sitemap actualisé dans Search Console et inspecter les nouvelles
   URL prioritaires. Ne pas soumettre les anciennes URL comme nouvelles pages.
3. Comparer les volumes de `store_click` hors tests sur des fenêtres comparables,
   avec regroupement ancien/nouveau chemin. La réactivation Android début octobre
   et les changements de tracking sont des facteurs de confusion à garder visibles.
