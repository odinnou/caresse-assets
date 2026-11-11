# Suivi GEO : de la découverte au clic store

> Branche de référence pour l’analyse et l’outillage, à conserver hors de `main_v2`.
> Les améliorations du site sont proposées séparément dans la PR #101.
> Les descriptions d’implémentation ci-dessous documentent ce travail ; le code
> de production correspondant appartient à cette autre branche. Pour de futurs
> travaux SEO/GEO, consulter cette analyse uniquement sur demande explicite du propriétaire.

Le panel contient 40 questions FR/EN/ES/PT/DE : 29 intentions compatibles,
10 vérifications de marque et un contrôle négatif sur les enregistrements allemands.
Les questions ES/PT ont été ajoutées le 10 novembre 2026. Comparer les séries avec
le même périmètre de questions ; les nouveaux marchés n’ont pas de mesure antérieure.

## Relever les réponses IA

Préparer le petit panel hebdomadaire pour ChatGPT et Perplexity :

```sh
npm run geo:prepare
```

Pour le bilan mensuel dans les cinq produits :

```sh
npm run geo:prepare -- --cadence=mensuel --moteurs=chatgpt,perplexity,claude,gemini,copilot --out=artifacts/geo/releve-mensuel.csv
```

Ces commandes préparent un CSV à remplir. Elles n’appellent aucun modèle, ne
créent aucun abonnement ni tâche planifiée et ne déclarent aucune réponse obtenue.
Chaque question a deux répétitions : utiliser deux nouvelles conversations sans
contexte Caresse, poser la question exactement, ne pas ajouter la marque aux
questions de découverte. Activer la recherche quand elle existe et noter le mode
réel ; une API ou une recherche web isolée ne représente pas tous les produits IA.

Champs du relevé :

- `statut_execution` : `execute`, `non_execute` ou `erreur`.
- Pour `execute` : date UTC complète, moteur, version affichée (ou `non_affichee`),
  mode de recherche réel, pays et référence de capture ou de réponse sauvegardée.
- `marque_mentionnee` et `erreur_produit` : `true` ou `false`, explicitement.
- `url_caresse_citee` : URL Caresse réellement citée ; laisser vide si absente.
- `urls_citees` : autres sources consultables pour relire la réponse.
- `description_erreur` : préciser toute erreur, surtout gratuité, langues,
  paiement, confidentialité ou génération illimitée.

Conserver les captures hors du site public ; ne pas y mettre de conversation
personnelle. Pour DE02, l’absence de recommandation de Caresse est acceptable.
Une recommandation comme fournisseur d’audio allemand est une erreur.

```sh
npm run geo:report -- --input=artifacts/geo/releve-a-remplir.csv --out=artifacts/geo/bilan-panel.md
```

Le rapport sépare dates, moteurs, versions, modes, pays et langues. La découverte
exclut marque et contrôle négatif. Il refuse les réponses sans référence, les
doublons d’une répétition le même jour et les domaines de citation trompeurs.
Les essais non faits et erreurs techniques n’entrent pas dans les dénominateurs.
Le modèle versionné `resultats-modele.csv` reste vide tant que le panel n’a pas été
exécuté. Le bilan initial est donc « non mesuré », jamais « 0 % ».

## Lire les clics Umami

Configuration confirmée par le propriétaire : **Search Console et Umami**.
Bing Webmaster Tools reste à configurer. OpenSEO est connecté, le projet Caresse
est créé et le compte Google a été relié pendant le travail. La première lecture
a échoué faute de connexion ; les suivantes ont fourni les pages, les requêtes et
les inspections Search Console. Le bilan et les réponses sources sont conservés
dans `artifacts/geo/openseo/` (non versionné et non publié). Un export Umami natif
a ensuite été reçu et analysé localement dans `artifacts/geo/umami/`. Les rapports
ne publient ni les identifiants ni les paramètres des visites. La création et les
lectures Search Console n’utilisent pas de crédits.

Le suivi `store_click` conserve la source, les UTM et la page d’arrivée. Le lot
du 10 novembre ajoute `acquisition_channel`, `ai_provider`,
`acquisition_referrer_host` et `acquisition_definition=observed-source-v1`.
Les domaines connus de ChatGPT, Perplexity, Claude, Gemini et Copilot sont regroupés,
en conservant la source et le domaine du référent. Seul le domaine est ajouté,
sans chemin ni contenu de conversation. Les UTM explicites restent prioritaires.

Un référent Gemini est désormais distingué des autres domaines Google. Les
anciens événements déjà classés Google ne sont pas réécrits. Google Search,
Bing et les visites sans source ne deviennent jamais automatiquement « IA ».
Un signal de référent ou d’UTM n’est pas une preuve de citation ou d’installation.

Après le build, `python scripts/check-ai-attribution-browser.py` vérifie les
parcours directs et après navigation, sur ordinateur, iPhone et Android dans les
cinq langues. Il sert les ressources et destinations stores depuis le build local,
intercepte les appels Umami et bloque les autres requêtes : aucun événement de
production n’est envoyé. Ce contrôle s’exécute aussi en CI.

Dans Umami, filtrer `store_click`, `test=false`, `acquisition_channel=ai`, puis
segmenter assistant × langue × page d’arrivée × store. Compter séparément tous
les clics et `first_store_click=true`. `first_link_click=true` mesure les parcours
où le premier lien cliqué conduit au store, conformément à la règle d’or du dépôt.

Pour un bilan hors du tableau de bord, adapter l’export aux colonnes du fichier
`evenements-modele.csv` (format normalisé, pas une promesse sur le format natif
d’Umami). Exporter uniquement les propriétés d’événements utiles ; ne pas ajouter
d’identifiant personnel ou de conversation.

L’export natif reçu utilise deux tables : `website_event.csv` et `event_data.csv`,
à joindre par site et identifiant d’événement. Un clic doit être compté une fois,
indépendamment du nombre de propriétés associées. Sur l’historique, conserver les
versions de suivi, écarter `test=true` et qualifier les destinations avec
`store_click_definition=caresse-only-v1`. Les anciennes sources ChatGPT peuvent
être analysées comme signaux historiques sans inventer les nouvelles propriétés
du code local. Les visites de l’export et les contextes de premier clic ne sont
pas automatiquement la même unité. Le premier bilan et sa méthode restent privés.

```sh
npm run geo:clicks -- chemin/export-normalise.csv artifacts/geo/bilan-clics.md
```

Le rapport exclut les tests, distingue les événements historiques non enrichis,
et ne calcule pas de taux par visite sans dénominateur comparable. Rapprocher les
visites de la même période et du même périmètre dans Umami. Les installations
nécessitent les données des stores ; les clics n’en sont pas une estimation.

## Vérifier publication et indexation

```sh
npm run geo:http
```

Le contrôle relève 45 pages prioritaires et les trois fichiers publics : HTTP,
canonical, sitemap et autorisations robots. User-agent d’audit identifié, sans
simulation d’IP des moteurs, aucun clic store ni événement analytics envoyé.
Le résultat du 10 novembre est conservé dans `controle-http-2026-11-10.csv`.
Le HTML public peut différer du build local tant que les corrections ne sont pas
publiées. Un HTTP 200 et une règle robots permissive ne prouvent pas l’indexation.

Après publication, dans Search Console : inspecter l’accueil, couples, tarifs,
sécurité et Dipsea dans les marchés prioritaires ; relever canonical retenu,
dernier passage et état d’indexation. Soumettre le sitemap existant si nécessaire.
L’export Web de Search Console ne doit pas être présenté comme un inventaire
exhaustif des citations IA.

Pour Bing : ajouter `https://caresse.app/` dans Bing Webmaster Tools ou importer la
propriété depuis Search Console, terminer la vérification du propriétaire puis
soumettre `https://caresse.app/sitemap.xml`. La préparation de ces instructions ne
constitue pas une configuration ni une soumission. Archiver ensuite l’état des
mêmes URL et les données AI Performance disponibles, avec la surface couverte.

## Décider des améliorations

Relever une période initiale, publier un lot identifiable, puis comparer des
périodes de même durée avec les mêmes moteurs, modes et questions. Noter les
changements de modèle et les campagnes en cours. Le lot pilote rend l’introduction
« couples » et « jeu pour couple » plus factuelles dans les cinq langues, sans modifier CTA ni mise en page.
Ce n’est pas un test A/B randomisé ; une évolution ne prouve pas à elle seule sa cause.

La distribution extérieure reste utile : fiches stores cohérentes, présentation
du produit par son éditeur et retours indépendants vérifiés. Les brouillons et
preuves proposés sont dans `../GEO-EXECUTION-2026-11-10.md`. Aucun message à un média,
forum ou autre tiers n’est envoyé par ces outils.
