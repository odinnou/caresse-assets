# Astro : réduire le nombre de fichiers à modifier

Date : 9 novembre 2026. Statut : analyse et proposition, sans refonte mise en œuvre.
Périmètre : dépôt Caresse Assets, après la correction des compositions allemandes et
avec le correctif App Store allemand en cours de revue.

## Conclusion

Le problème vient de la séparation incomplète entre présentation, données communes
et traductions. Astro construit déjà les pages et mutualise des composants, mais
une grande partie du HTML historique, de ses attributs et de ses liens reste copiée
dans les fichiers de contenu de chaque langue.

**Modifier le pays d’une boutique devrait demander une seule modification de
configuration.** Aujourd’hui, cette configuration n’alimente qu’une partie des
liens. Le correctif allemand a donc dû remplacer 140 occurrences dans 54 fichiers
de contenu, en plus de la configuration, des contrôles et du guide : 59 fichiers
modifiés avant l’ajout de cette analyse.

La priorité recommandée est de terminer la centralisation des liens store dans
**les cinq langues**, puis de partager les compositions et les données réellement
communes par famille de pages. L’accueil, les alternatives et les articles gardent
leurs compositions distinctes. Les traductions fournissent les textes et les
exceptions éditoriales nécessaires.

Le chantier doit préserver les installations : CTA directs, libellés existants,
bascule Android, attribution, SEO et présentations actuelles. La référence est
[SEO-GOLDEN-RULE.md](../SEO-GOLDEN-RULE.md).

## Constats mesurés dans le dépôt

Inventaire des fichiers suivis dans `src/`, hors `dist/`, dépendances et artefacts.
Les occurrences ci-dessous sont des occurrences dans les sources, pas des liens
uniques ni un nombre de liens rendus dans le navigateur.

| Observation | Mesure | Conséquence |
| --- | ---: | --- |
| Configurations de page | 280, dans 5 langues | Une configuration reste propre à chaque URL. |
| Familles du registre | 64, alias historiques inclus | Ce nombre ne représente pas 64 compositions visuelles à créer. |
| Répartition des layouts | 260 `composed`, 20 `SitePage` | Le rendu générique domine ; chaque JSON décrit encore sa composition. |
| Fragments sur disque | 1 067 HTML, 9 Markdown | Déplacer du HTML dans des fichiers de contenu conserve sa duplication. |
| Fichiers de navigation/footer | 362 | Les variantes sont référencées, mais leurs textes, liens et balises restent dispersés. |
| Feuilles de styles | 58 | Une partie des styles est déjà mutualisée ; ces fichiers ne sont pas tous des doublons. |
| Scripts historiques extraits | 18 | Certains scripts sont déjà partagés ; d’autres restent intégrés aux données de page. |
| URL App Store Caresse littérales | 702 occurrences dans 267 fichiers | 5 occurrences sont la configuration légitime ; 697 sont dans le contenu. |
| Configurations contenant des liens `store` structurés | 19, pour 29 références | Une page comptée peut aussi avoir d’autres liens store écrits en HTML. |
| Composant de rendu important `stores.json` | `StoreLink.astro` | Les liens qui ne passent pas par ce composant échappent à la configuration. |

La répartition des pages est : FR 54, EN 59, ES 59, PT 54, DE 54. Les différences
incluent des anciennes redirections ; elles ne prouvent pas des traductions manquantes.

### Exemple concret : le lien App Store allemand

Avant le correctif, les sources allemandes contenaient 140 fois l’URL américaine :
133 occurrences dans les JSON de page et 7 dans des fragments HTML, réparties sur
54 fichiers. Il s’agit du même lien commercial, reproduit dans différents contextes :
hero, badge, pied de page, téléchargement ou données structurées.

Le chemin mutualisé existe :

```text
Intro → StoreLink → stores.json
```

Mais plusieurs autres chemins restent indépendants :

```text
Element.html / Cards.items.html / fragment HTML → lien écrit dans le contenu
Element.attrs.href                         → URL littérale
schemas                                   → URL littérale
```

Ajouter `ios.de` à `stores.json` ne suffisait donc pas. Le correctif actuel rend les
destinations allemandes cohérentes et ajoute des contrôles ; **il ne termine pas
cette centralisation**. Le prochain changement de destination nécessiterait encore
des remplacements tant que les références de contenu ne seront pas normalisées.

### Fichiers à examiner pour un nettoyage

Quatre anciens Markdown n’ont plus de référence dans les blocs des 280 pages :

- `src/content/blocks/article.de/00.md`
- `src/content/blocks/comparison.de/00.md`
- `src/content/blocks/home.de/00.md`
- `src/content/blocks/couples.de/00.md`

Leurs noms sans extension correspondent à des fragments HTML encore utilisés :
un contrôle fondé uniquement sur le nom de base peut donc les croire référencés.
L’inventaire de nettoyage doit comparer **chemin et extension**, puis vérifier les
imports et le rendu avant suppression. Ils ne sont pas supprimés par cette analyse.

### Méthode de vérification

Les mesures sont reproductibles avec les JSON de `src/content/pages/`, le registre
`src/data/routes.json` et un parcours récursif de `src/content/blocks/`,
`src/data/chrome/`, `src/styles/` et `src/content/scripts/`.

Pour les liens, chercher les URL canoniques Caresse contenant
`apps.apple.com/{us,fr,es,br,de}/app/caresse/id6758887086` dans les sources ; distinguer
`src/data/stores.json` des fichiers éditoriaux. Pour mesurer l’incident initial,
utiliser les sources allemandes du commit de fusion de la correction des
compositions, avant le remplacement des URL. Le relevé décrit cet état du dépôt ;
il doit être recalculé après une normalisation.

## Pourquoi la migration n’a pas encore réduit assez les mises à jour

L’extraction initiale a préservé les pages historiques, avec une comparaison du
rendu avant/après. C’est documenté dans [ASTRO-MIGRATION.md](ASTRO-MIGRATION.md).
Ce protocole a conservé les variantes au lieu de les réinventer.

Aujourd’hui, `[...path].astro` charge les JSON et choisit un layout. `PageBlocks`
assemble leurs blocs, et `Element` affiche souvent leur champ `html`. Le moteur
connaît alors une balise ou une chaîne HTML, sans connaître son rôle commercial :
un lien de téléchargement ne se distingue pas toujours d’un lien éditorial.

Les points de lecture du diagnostic sont [PageBlocks](../src/components/PageBlocks.astro),
[Element](../src/components/Element.astro), [Intro](../src/components/Intro.astro),
[StoreLink](../src/components/StoreLink.astro),
[le compilateur de schémas](../src/lib/schemas.mjs) et
[le générateur de pages](../scripts/new-page.mjs).

Le script `new-page.mjs` copie également les données et fragments de la page choisie.
Il crée un point de départ indépendant, pas une liaison durable avec une composition
commune. Une amélioration de la page d’origine ne se propage donc pas automatiquement.

Des centralisations utiles existent déjà : routes et hreflang, registre des langues,
certains styles/scripts et génération de certains schémas FAQ depuis le contenu
visible. Il faut étendre cette approche aux endroits qui changent souvent.

## Architecture proposée

### 1. Configuration commune et références de liens

Conserver `stores.json` comme source des destinations. Tous les liens Caresse,
y compris les schémas et la page de téléchargement, doivent utiliser une référence
au store et à la locale, résolue **au build**.

Exemple de donnée cible, illustratif et non implémenté :

```json
{
  "type": "store-link",
  "store": "ios",
  "label": "Jetzt herunterladen",
  "attrs": {
    "id": "hero-cta",
    "class": "cta-pink",
    "data-cta-position": "hero"
  }
}
```

`StoreLink` peut être réutilisé et étendu : il reçoit le libellé et les attributs
existants, puis calcule la destination commune. Le schéma de données doit empêcher
une référence de store et un `href` concurrent sur le même élément.

Pour les liens intégrés aux paragraphes, prévoir un format de texte riche avec des
références de liens. Pendant la transition, des marqueurs explicites dans les anciens
fragments sont une option, à condition d’avoir un résolveur unique, une validation
du contexte et aucun marqueur restant dans le HTML généré. Ne pas réparer les copies
par une substitution globale et implicite des URL après rendu.

Les scripts de `public/` sont copiés tels quels. Ils doivent recevoir les destinations
calculées via des attributs de données ou une configuration injectée au build ;
ils ne doivent pas conserver une deuxième liste de destinations. Le `href` initial
reste direct et fonctionnel sans JavaScript. Aucune requête de configuration ni
page intermédiaire ne doit retarder le premier clic vers le store.

Le pays de la boutique, la langue de sa fiche, la langue du site et les langues
réellement disponibles dans l’application doivent rester des données distinctes.

### 2. Compositions partagées par famille et textes par langue

Une famille utilise une composition de sections réutilisable dans ses traductions.
Les données localisées contiennent les textes, labels, descriptions, alternatives
textuelles et exceptions métier propres à leur langue ou à leur marché.

Exemple de séparation visée :

```text
composition de l’accueil + textes de l’accueil en allemand
                        + données produit et stores communes
                        → page allemande complète au build
```

L’accueil conserve carrousel, étapes et vidéo ; les alternatives conservent leur
matrice ; les comparatifs, démos, articles, pages saisonnières et pages légales
gardent leurs structures adaptées. Partager un composant ne signifie pas imposer
un même modèle de page à tous ces contenus.

Les variantes de navigation deviennent des variantes nommées avec une liste de
familles de routes et des clés de traduction. Le contenu long des articles peut
rester en Markdown ; il n’a pas besoin d’être découpé en clés pour chaque phrase.
Les exceptions de composition réelles doivent être déclarées, pas effacées.
Les anciens `prefix` et `suffix` peuvent répartir les balises d’une section entre
plusieurs chaînes : les parser et les resérialiser isolément peut déplacer le contenu.
Leur remplacement doit porter sur une section complète et conserver son arbre HTML.

### 3. Données métier et métadonnées dérivées

Extraire les faits partagés : liens commerciaux, caractéristiques de Caresse,
langues de l’app et références médias. Pour les comparatifs, distinguer faits
sourcés, date de vérification, marché/devise et présentation localisée. Ne pas
convertir automatiquement une valeur en dollars en prix européen.

Générer les schémas depuis les mêmes données que le contenu visible, comme le fait
déjà `compileSchemas` pour certaines FAQ. Les titres et descriptions propres à une
intention SEO restent éditoriaux ; des valeurs Open Graph ou Twitter peuvent en
dériver avec des surcharges explicites lorsqu’elles diffèrent volontairement.

Conserver `routes.json` pour les slugs traduits et liens entre familles. Une famille
reste une identité stable même si ses URL françaises, allemandes et portugaises
diffèrent. Les exclusions du sitemap, dates historiques, canonical et hreflang
continuent à être contrôlés.

### 4. Validation des données

Les Content Collections d’Astro avec schémas sont une piste adaptée pour typer les
références, détecter les traductions manquantes et valider les variantes. Elles
n’éliminent pas la duplication à elles seules : un champ contenant tout le HTML
reste une copie, même validée par un schéma.

Le chargeur actuel par `import.meta.glob` peut rester pendant la normalisation des
liens. Passer aux collections ne doit pas devenir une condition préalable à la
réparation de chaque petit problème. Aucune dépendance à un CMS, serveur applicatif
ou changement de framework n’est nécessaire pour atteindre l’objectif.

## Plan d’exécution recommandé

| Lot | Travail | Critère de sortie |
| --- | --- | --- |
| P0 — Liens commerciaux | Un résolveur commun, références dans les cinq langues, schémas et scripts compris. Migration ponctuelle des anciennes copies. | Modifier une destination dans la configuration met à jour tous les rendus concernés, sans éditer les traductions. |
| P1 — Famille pilote | Séparer composition et textes d’une famille dans les cinq langues, puis tester accueil et alternatives comme cas distincts. | Une modification de structure commune se fait dans sa composition ; chaque langue conserve tout son contenu et ses médias. |
| P2 — Données et navigation | Regrouper les variantes compatibles, faits produit et génération de métadonnées. Ajouter les schémas de validation utiles. | Une donnée commune a une source éditable ; une traduction modifie uniquement les textes concernés. |
| P3 — Extension et nettoyage | Étendre famille par famille ; adapter `page:new` ; supprimer les anciens fragments seulement après migration de toutes leurs références. | Inventaire sans fragments orphelins ; les nouvelles langues réutilisent les compositions complètes. |

Le premier lot de normalisation touchera encore de nombreux fichiers : c’est le
coût ponctuel nécessaire pour supprimer les copies. Son gain se mesure sur les
changements suivants. La correction de liens actuelle reste un correctif distinct
de cette refonte proposée ; ce document n’annonce pas la refonte comme terminée.

### Contrôles à conserver pendant les lots

- Avant chaque migration, enregistrer le rendu de la famille dans chacune de ses
  langues ; comparer ensuite structure, tableaux, cartes, FAQ, médias et comportements.
- Conserver le contrôle des 54 pages allemandes et les exceptions linguistiques
  explicites. Une comparaison avec l’anglais ne suffit pas à couvrir les variantes
  historiques de toutes les autres langues.
- Vérifier les CTA de toutes les locales sur ordinateur, iPhone et Android, ainsi
  que téléchargement, bouton flottant et attribution, sans contacter les vrais stores.
- Ajouter un contrôle interdisant les URL Caresse de store littérales dans le contenu,
  une fois le lot P0 terminé ; autoriser leur configuration commune et les fixtures
  de test explicitement identifiées.
- Ne pas réécrire les libellés, réduire les sections ou ajouter des liens commerciaux
  vers les concurrents pendant ce chantier technique.

### Réduire aussi le travail de CI inutile

Le workflow actuel exécute le build et le navigateur pour toute PR, même documentaire.
Proposer une classification des fichiers modifiés : contrôle documentaire pour une
modification uniquement documentaire, contrôles de contenu pour les traductions et
contrôles complets pour templates, styles, scripts, stores et routes.

Garder un statut de contrôle requis qui termine dans tous les cas ; éviter qu’un
filtrage du workflow laisse une PR bloquée avec un contrôle requis jamais lancé.
Les changements partagés et les déploiements continuent à vérifier toutes les
locales concernées. Cette optimisation du workflow n’est pas implémentée ici.

## Mesurer le résultat avec des tâches réelles

| Tâche | Situation actuelle | Objectif après normalisation |
| --- | --- | --- |
| Changer une destination de store | 54 fichiers de contenu allemand pour le cas observé | 1 fichier de configuration ; aucun contenu localisé à reprendre. |
| Modifier un détail visuel partagé | Selon le cas, composant commun ou balises copiées | 1 composant ou style pour la variante concernée. |
| Corriger un texte allemand | JSON ou fragment contenant aussi des attributs et liens | Le fichier éditorial allemand concerné, sans recopie des faits communs. |
| Ajouter une langue | Copier de nombreux blocs et compositions | Ajouter traductions, routes et médias réellement localisés, sans recopier la structure. |

Mesurer les fichiers éditoriaux touchés, le volume de source à relire, la taille du
diff, le temps de validation et les régressions détectées. Pour les coûts IA, mesurer
les tokens réels sur les mêmes tâches et modèles. Le nombre de fichiers n’est pas
une mesure de tokens, et aucun gain financier ou temporel n’est établi par cet audit.
Astro peut régénérer les 280 pages HTML après une modification unique : ces fichiers
de sortie ne sont pas des sources à éditer ni à versionner.

## Recherche : documentation officielle consultée

Sources consultées le 9 novembre 2026 ; le projet déclare Astro 7.4.7. Les capacités
documentées ci-dessous appuient la proposition ; les choix de migration et mesures
ci-dessus proviennent de l’inspection du dépôt.

- [Composants Astro et props](https://docs.astro.build/en/basics/astro-components/) :
  composants composables recevant des données, et slots pour conserver des contenus
  spécifiques. Base des compositions réutilisables proposées.
- [Content Collections](https://docs.astro.build/en/guides/content-collections/) :
  données locales, schémas Zod et références entre entrées. Utile pour valider le
  contenu une fois ses responsabilités séparées.
- [Recette i18n](https://docs.astro.build/en/recipes/i18n/) : dictionnaires de labels
  et correspondances de routes traduites. Applicable aux éléments communs ; les
  articles longs et variantes éditoriales gardent des contenus propres.
- [Routage internationalisé](https://docs.astro.build/en/guides/internationalization/) :
  configuration des locales et fonctions de construction des liens. Le dépôt dispose
  déjà d’un registre de slugs ; adopter ces fonctions ne remplace pas cette cartographie
  et ne justifie pas de changer les URL historiques.
