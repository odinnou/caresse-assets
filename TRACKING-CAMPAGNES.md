# Suivre une campagne Instagram avec Umami

Objectif : distinguer les visites des campagnes et les clics vers chaque store,
y compris lorsqu’une personne change de page avant de cliquer. Les événements
`store_click` mesurent une sortie vers le store, pas une installation.

## Liens à utiliser

Exemple pour une publicité de novembre :

```text
https://caresse.app/?utm_source=instagram&utm_medium=paid_social&utm_campaign=novembre_2026_fr&utm_content=video_a
```

- `utm_source=instagram` : source du trafic.
- `utm_medium=paid_social` pour les publicités ; `organic_social` pour le profil ou les publications gratuites.
- `utm_campaign` : nom stable de la campagne, avec période et langue.
- `utm_content` : code du créatif ou du placement, par exemple `video_a`, `video_b`, `story_a`.
- `utm_term` : code de segment facultatif, si nécessaire.

Utiliser des codes marketing fixes, sans identité ni préférence personnelle.
Conserver la même casse, de préférence en minuscules. Chaque publicité doit
utiliser son propre lien si l’on veut comparer les créatifs. Pour EN/ES/PT,
choisir la page locale correspondante. Les liens internes restent sans UTM et
les boutons de téléchargement continuent de pointer directement vers les stores.

## Attribution des clics

Le script commun `umami-store-tracking.js` ajoute les UTM présents à chaque
événement `store_click`. Il conserve aussi la source d’acquisition, la page
d’arrivée, le store, la position du bouton et la langue.

L’attribution utilise le `sessionStorage` existant, dans le même onglet et sur le
même domaine, avec expiration après 30 minutes d’inactivité suivie par le script :

- Une navigation sans UTM conserve la campagne et la page d’arrivée.
- Recharger la même URL de campagne conserve le contexte et les compteurs.
- Une arrivée avec des UTM différents ouvre un nouveau contexte d’attribution,
  avec la nouvelle page d’arrivée, un nouveau délai et de nouveaux compteurs de
  premier clic. Les anciens champs absents du nouveau lien sont effacés.
- Après expiration, le contexte repart depuis la page courante et ses éventuels UTM.
- Si le stockage est indisponible, les UTM restent utilisables sur la page
  d’arrivée, mais leur conservation entre pages n’est pas garantie.

Seuls les cinq paramètres UTM ci-dessus sont conservés : 64 caractères pour
`utm_source`, 128 pour chaque autre valeur, après retrait des espaces aux
extrémités. Les valeurs vides sont omises. `fbclid` et les autres paramètres ne
sont pas ajoutés aux propriétés personnalisées par ce script.

La propriété `visit_definition=client-30min-v3` distingue cette règle de
l’ancienne définition. `first_store_click=true` compte le premier clic du
contexte d’attribution côté navigateur ; ce contexte ne correspond pas
nécessairement à une session Umami, notamment après un changement de campagne.
Les anciens événements ne sont pas enrichis rétroactivement.

Le suivi GEO ajoute aussi un regroupement des sources IA, tout en conservant la
priorité des UTM : voir [le guide des rapports et du panel](docs/geo/README.md).
Ces propriétés sont des signaux d’acquisition, pas une preuve de citation.

## Contrôle avant de lancer la campagne

1. Après déploiement, ouvrir le lien de campagne dans le navigateur intégré
   d’Instagram sur iOS puis Android, en ajoutant `&analytics_test=1`.
2. Cliquer directement vers le store, puis refaire le parcours dans un nouvel
   onglet en passant d’abord par une autre page ou langue du site.
3. Dans Umami, contrôler les événements `store_click` : `utm_source`,
   `utm_medium`, `utm_campaign`, `utm_content`, `store`, `landing_page` et
   `test=true`. Vérifier que les deux parcours gardent la campagne attendue.
4. Dans le même onglet, ouvrir un lien avec `utm_content=video_b` et vérifier
   que le nouveau clic porte ce créatif, sans reprendre celui de `video_a`.
5. Exclure les événements `test=true` du bilan. Ce marquage concerne les
   événements de clic personnalisés ; il n’exclut pas automatiquement les vues
   de page collectées par Umami.

Sur localhost, le script ne produit aucun événement de production. Les tests
automatisés s’exécutent sans dépendance supplémentaire avec Node.js :

```sh
node tests/umami-store-tracking.test.cjs
```

## Bilan de campagne

Dans les rapports de données d’événement Umami, filtrer `store_click` par
`utm_campaign` et `utm_medium`, puis comparer `utm_content` et `store`. Les noms
exacts des vues et les filtres disponibles sont à vérifier dans le tableau de
bord utilisé. Les propriétés décrites ci-dessus sont envoyées par le script ;
aucun tableau de bord n’est créé automatiquement.

Suivre les visites attribuées par Umami, le volume de clics par créatif et store,
et les premiers clics par contexte (`first_store_click=true`). Pour un taux de
conversion par visite, vérifier que numérateur et dénominateur utilisent la même
définition de visite, les mêmes filtres et la même période. Le total brut des
événements peut compter plusieurs clics d’une même personne.

Les bloqueurs, interruptions réseau ou choix de navigateur peuvent empêcher la
collecte. La navigation vers le store reste indépendante de l’envoi analytics.
L’attribution des installations ou achats se traite séparément dans les consoles
des stores ; ajouter des UTM au site ne suffit pas à la mettre en place.
