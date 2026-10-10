# Analyse SEO et conversion de Caresse

Date : 5 octobre 2026. Site : https://caresse.app/

## Objectif et diagnostic

Ton objectif est d’abord d’augmenter le reach, puis d’optimiser le clic sur le bouton de téléchargement. Le parcours à piloter est donc : **impressions sur des recherches pertinentes → visites organiques → clics vers l’App Store ou Google Play**.

Mon diagnostic : la base technique et le parcours de téléchargement sont déjà bien préparés. Le prochain levier est de renforcer quelques portes d’entrée correspondant à des recherches concrètes, puis de rendre leur promesse et leur action principale plus claires. Les démos sont un atout particulièrement utile pour faire comprendre un produit audio.

Le nombre de clics qualifiés vers les stores doit guider les décisions. Un contenu qui attire beaucoup de visites mais très peu de personnes intéressées par l’application peut contribuer au reach, sans devenir une priorité commerciale.

## Périmètre et limites

Analyse du HTML public actuel de l’accueil, de robots.txt, du sitemap, des scripts de suivi et de bouton mobile, ainsi que des pages suivantes : blog, jeu pour couple, alternatives, hub de démos, démo couple romantique, article sur la flamme dans un couple et comparatif Melba. Certaines pages ont été relues directement sur le serveur pour éviter les anciennes versions conservées par le moteur de recherche.

Je n’ai pas accès aux données de Search Console, au tableau de bord Umami ni aux statistiques des stores. Je ne peux donc pas établir les volumes de recherche, les positions Google réelles, le taux de conversion actuel ou un gain chiffré. Je n’ai pas effectué de mesure Lighthouse/Core Web Vitals ni de vérification visuelle dans un navigateur disponible. Les recommandations de conversion sont des hypothèses à tester ; le comportement des scripts est vérifié dans leur code, sans test interactif sur téléphone.

## 1. Les acquis à conserver

| Élément observé | Intérêt pour ton objectif |
| --- | --- |
| Contenu de l’accueil présent dans le HTML | Le contenu principal peut être lu sans attendre un rendu JavaScript. |
| Title, description, canonical et hreflang FR/EN/ES sur l’accueil | Fondations présentes pour décrire la page et ses variantes linguistiques. |
| robots.txt autorisant l’exploration et déclarant le sitemap | Aucun blocage général d’exploration constaté. |
| 106 URL déclarées dans le sitemap | Une structure de contenus existe déjà. Cela ne prouve pas leur indexation. |
| Pages par usage, comparatifs et articles | Plusieurs portes d’entrée, au-delà de la recherche de marque. |
| Démonstrations audio accessibles sans compte | Preuve concrète de l’expérience avant le téléchargement. |
| Adaptation du bouton aux stores et bouton mobile fixe prévus dans le script | Les visiteurs mobiles disposent déjà d’un parcours pensé pour le téléchargement. |
| Suivi Umami `store_click` avec source, page d’entrée et emplacement | Une base de mesure existe déjà pour analyser la conversion. |

Sources : [accueil](https://caresse.app/), [sitemap](https://caresse.app/sitemap.xml), [robots.txt](https://caresse.app/robots.txt), [script du bouton mobile](https://caresse.app/mobile-store-cta.js), [script de suivi](https://caresse.app/umami-store-tracking.js).

## 2. Augmenter le reach : partir des recherches des utilisateurs

### Prioriser les intentions proches du produit

« Application d’intimité guidée par l’IA » décrit le produit, mais je n’en ferais pas ton unique angle d’acquisition. Il faut aussi répondre aux mots employés par quelqu’un qui cherche une expérience à deux ou du contenu audio. Les expressions ci-dessous sont des pistes éditoriales, sans volume ni difficulté vérifiés.

| Intention à travailler | Page à renforcer | Réponse attendue |
| --- | --- | --- |
| Jeu pour couple, jeu de couple sur téléphone | `/couples-game/` | Expliquer une expérience audio à deux et montrer un exemple. |
| Application pour couple, sortir de la routine à deux | `/for-couples/` | Montrer les situations d’usage, les limites et le déroulement. |
| Audio sensuel en français, audio érotique en français | Hub et pages de démos | Donner une écoute réelle et expliquer le format proposé. |
| Alternative à Melba, Dipsea ou Quinn | Comparatifs existants | Aider au choix avec des critères vérifiables et à jour. |
| Comment raviver la flamme en couple | Article existant | Répondre au besoin puis proposer une expérience pertinente. |

**Je commencerais par le jeu pour couple, une démo couple et les comparatifs les plus proches du produit.** Ce sont des hypothèses de trafic qualifié à vérifier dans Search Console et Umami. Les articles plus larges peuvent élargir le reach ensuite.

Sources : [jeu pour couple](https://caresse.app/couples-game/), [couples](https://caresse.app/for-couples/), [démos](https://caresse.app/demo/), [alternatives](https://caresse.app/alternatives/).

### Renforcer les pages existantes avant de multiplier les variantes

Les pages « nouveaux couples », « longue date », « débordés » et « aventuriers » peuvent être utiles si chacune apporte une réponse propre : exemple de situation, façon de commencer, configuration pertinente et démo associée. Je n’ajouterais pas de nouvelles variantes sans besoin de recherche distinct ou valeur supplémentaire.

Pour les articles, ajouter des exemples immédiatement utilisables : phrases pour lancer une conversation, proposition de rituel, façon de vérifier que les deux partenaires ont envie de participer. L’article sur la flamme contient aussi des affirmations générales sur le cerveau et les mécanismes du désir : les sourcer, les nuancer et afficher clairement l’auteur et la date renforcerait sa crédibilité. C’est une recommandation éditoriale, pas une promesse de classement.

Source : [article actuel](https://caresse.app/blog/raviver-la-flamme-couple/).

### Clarifier les titres et le début des pages

Le H1 de l’accueil, « Ralentir. Ressentir. Se reconnecter. », exprime une ambiance mais explique peu le produit. Le sous-titre et le paragraphe suivant répètent ensuite presque la même définition.

Proposition à tester :

- **Title :** `Caresse : audio intime personnalisé pour couples et solo`
- **H1 :** `Une voix pour guider vos moments intimes, à deux ou en solo.`
- **Sous-titre :** `Choisissez vos envies et vos limites. Caresse crée une expérience audio personnalisée, en français, avec vos prénoms.`
- **Description :** `Découvrez des expériences audio intimes pour couples et solo. Démos gratuites sans inscription sur iOS et Android. Sessions personnalisées sans abonnement.`

Pour la page jeu, un titre principal comme « Un jeu audio pour couple, personnalisé selon vos envies » expliciterait plus vite la différence proposée. L’IA peut rester un argument de personnalisation, tandis que le bénéfice ouvre la page.

Google recommande des titres descriptifs et concis et peut utiliser le titre principal pour construire le lien affiché dans ses résultats. Ces changements ne garantissent pas un meilleur classement. Sources : [accueil](https://caresse.app/), [documentation Google sur les titres](https://developers.google.com/search/docs/appearance/title-link).

### Donner une distribution aux contenus

Le rapport « State of AI Romance 2026 » et l’angle accessibilité/audio sont des pistes pour obtenir des citations et des liens éditoriaux. Leur effet dépend de leur qualité et de leur diffusion : statistiques clairement sourcées, méthodologie compréhensible, conclusions originales et ressources faciles à citer.

Je privilégierais quelques contacts éditoriaux pertinents et des contenus audio/vidéo montrant l’expérience. Les liens de campagne doivent permettre de mesurer les visites puis les clics stores. Aucun contact ni publication n’a été effectué pendant cet audit.

Les coulisses techniques peuvent servir à faire connaître le projet et son équipe. Leur audience a toutefois une intention différente de celle d’une personne cherchant une expérience intime : évaluer leur contribution séparément avant d’y consacrer une grande part de l’effort d’acquisition.

Source : [blog actuel](https://caresse.app/blog/).

## 3. Optimiser le clic de téléchargement

### Corriger d’abord les incohérences de promesse

Ces corrections précèdent les tests de couleur ou de forme du bouton :

| Constat actuel | Correction recommandée |
| --- | --- |
| L’accueil parle de démos gratuites et de sessions personnalisées payantes, puis annonce une session découverte offerte. Le comparatif Melba annonce une première session offerte. | Définir exactement ce qui est offert : démos pré-générées, crédit de génération ou autre. Utiliser la même formulation partout. |
| Le comparatif Melba affirme que la durée est précise et choisie ; le hub démo dit que la durée dépend de la génération. | Aligner le comparatif sur le comportement réel de l’application. |
| Le hub démo emploie encore « anonyme de bout en bout, paiement compris », alors que l’accueil précise que les achats passent par le compte Apple ou Google. | Conserver la distinction entre absence de compte Caresse et transaction auprès du store. |
| L’article sur la flamme utilise « Découvrir Caresse » pour un lien qui ouvre directement le store. | Employer « Télécharger Caresse gratuitement » ; réserver « Écouter une démo » à une écoute sur le site. |

Sources : [accueil](https://caresse.app/), [comparatif Melba actuel](https://caresse.app/vs-melba/), [hub démo](https://caresse.app/demo/), [article](https://caresse.app/blog/raviver-la-flamme-couple/).

### Garder le téléchargement principal, rendre la preuve facile d’accès

Le premier écran peut suivre cette séquence : bénéfice compréhensible → phrase expliquant le produit → bouton de téléchargement → conditions rassurantes → accès secondaire à une démo.

Proposition de microtexte sous le bouton, sous réserve de conformité à l’offre réelle :

> Démos gratuites · Sans inscription à Caresse · Sans abonnement  
> Les sessions personnalisées sont payantes.

Tester un lien secondaire discret « Écouter une démo avant de télécharger ». Pour un produit audio, entendre la voix peut lever une hésitation que le texte ne résout pas. Cette option peut aussi détourner des clics directs : il faut mesurer **les clics stores obtenus sur tout le parcours**, y compris après l’écoute.

Sur les pages d’articles, proposer une démo liée au sujet, tout en conservant un téléchargement clairement nommé. Sur les comparatifs, rendre le téléchargement accessible après le tableau de décision, sans imposer un retour à l’accueil.

### Exploiter ce qui existe déjà sur mobile

Le script actuel détecte Android/iOS, adapte les liens marqués pour cela et crée un bouton fixe mobile quand le bouton source et les autres liens stores ne sont plus visibles. **Il est déjà implémenté.** La prochaine étape est de vérifier son comportement sur de vrais téléphones et de comparer les clics du premier écran à ceux du bouton fixe.

Sur ordinateur, l’accueil prévoit les badges des deux stores ; le bouton textuel adaptatif est réservé au mobile reconnu. Une variante desktop peut tester une action plus explicite avec choix de plateforme et QR code. À prioriser seulement si les visites desktop représentent une part significative de l’acquisition.

Source : [script mobile actuel](https://caresse.app/mobile-store-cta.js).

### Tester peu de choses à la fois

| Ordre | Test | Critère de décision |
| --- | --- | --- |
| 1 | Promesse actuelle contre bénéfice plus concret sur le premier écran | Part des visites éligibles avec premier clic store. |
| 2 | Téléchargement seul contre téléchargement + lien secondaire démo | Conversion totale du parcours, au-delà du clic immédiat. |
| 3 | « Découvrir Caresse » contre « Télécharger Caresse gratuitement » sur l’article | Clics stores par visite de cet article. |

Pour les variantes de conversion, garder les canaux et appareils comparables et éviter de modifier simultanément titre, texte, emplacement et libellé. Un champ `variant` dans le suivi ne constitue pas, à lui seul, un système d’affectation aléatoire pour un test A/B. Avec peu de trafic, interpréter les écarts comme des signaux, sans annoncer prématurément un gagnant.

## 4. Mesurer les deux étapes séparément

### Reach et acquisition

Dans Search Console, suivre par pays, langue et page : impressions hors marque, clics hors marque, requêtes, CTR et position. Comparer les pages correspondant à une même intention et vérifier leur indexation. Le CTR Google dépend notamment de la position : sa variation seule ne permet pas d’attribuer un gain au nouveau title.

### Clic vers les stores

Le script Umami prévoit déjà l’événement `store_click` avec `landing_page`, `cta_position`, `store`, `locale`, `acquisition_source`, `first_store_click`, `elapsed_ms` et `variant`. L’exploitation de ces dimensions est la prochaine étape ; leur réception effective doit être vérifiée dans le tableau de bord.

Indicateur principal recommandé :

**Taux de clic store = visites éligibles ayant au moins un clic store / visites éligibles.**

Employer une définition cohérente de visite pour le numérateur et le dénominateur. Le script utilise sa propre continuité de visite de 30 minutes dans `sessionStorage` : ne pas supposer qu’elle correspond exactement aux sessions natives d’Umami. Dédupliquer les clics répétés et exclure les événements de test.

Tableau à construire :

| Page d’entrée | Source | Appareil | Visites | Visites avec clic store | Taux |
| --- | --- | --- | --- | --- | --- |
| Accueil | Google | Mobile | À mesurer | À mesurer | À calculer |
| Jeu pour couple | Google | Mobile | À mesurer | À mesurer | À calculer |
| Comparatifs | Google | Mobile | À mesurer | À mesurer | À calculer |
| Articles | Google | Mobile | À mesurer | À mesurer | À calculer |
| Démos | Google | Mobile | À mesurer | À mesurer | À calculer |

Suivre aussi la conversion des visites qui écoutent une démo, sans conclure qu’une corrélation prouve que l’écoute cause le clic. Un clic vers le store n’est pas une installation ; la mesure des installations constitue une étape distincte, à rapprocher ensuite des outils des stores.

Source : [script de suivi actuel](https://caresse.app/umami-store-tracking.js).

## 5. Points techniques et visibilité à surveiller

- **SafeSearch :** l’absence d’images explicites ne garantit pas une visibilité sans filtrage. Google considère notamment le texte et les liens. Vérifier la visibilité des pages publiques avec et sans SafeSearch avant d’attribuer une faible portée à un seul problème de mots-clés. Je n’ai pas établi que Caresse était filtré. [Documentation Google](https://developers.google.com/search/docs/specialty/explicit/guidelines).
- **Données structurées :** le JSON-LD de l’application sur l’accueil déclare `inLanguage: [fr, en]`, alors que le site annonce aussi l’espagnol. Ajouter `es` et contrôler les autres propriétés contre les faits actuels. Vérifier également la date de publication déclarée. [Accueil](https://caresse.app/).
- **Performance mobile :** contrôler Core Web Vitals dans Search Console et mesurer les pages prioritaires. La présence d’images WebP et de chargement différé sur plusieurs images est un bon point de départ, sans prouver la rapidité réelle. Aucun score de performance n’est attribué dans cet audit.
- **Sitemap et hreflang :** la présence des 106 URL et des variantes de l’accueil est vérifiée ; la validité de chaque URL, les correspondances linguistiques et l’indexation complète restent à contrôler. [Sitemap](https://caresse.app/sitemap.xml).
- **Contenu daté :** les comparatifs comportent des informations de prix et de fonctionnalités. Les vérifier régulièrement sur les sources des éditeurs et conserver les dates de vérification. Cet audit ne valide pas toutes les affirmations concernant les concurrents.

## 6. Ordre d’exécution recommandé

| Priorité | Action | Effet recherché |
| --- | --- | --- |
| P0 | Harmoniser gratuité, durée et anonymat ; clarifier le bouton de l’article | Donner une promesse cohérente et une action prévisible. |
| P0 | Vérifier les événements Umami et établir la référence par page/source/appareil | Pouvoir évaluer les changements suivants. |
| P1 | Renforcer jeu pour couple, une démo couple et les comparatifs prioritaires | Attirer des visiteurs proches d’un téléchargement. |
| P1 | Clarifier title et début des pages prioritaires | Améliorer la compréhension dans les résultats et à l’arrivée. |
| P1 | Tester la promesse du premier écran puis l’accès secondaire à la démo | Augmenter le taux de clic store. |
| P2 | Enrichir les articles utiles et distribuer les ressources originales | Élargir la portée et obtenir des citations pertinentes. |
| P2 | Étendre les sujets et les langues à partir des résultats | Investir dans les portes d’entrée qui apportent des clics qualifiés. |

Le prochain cycle de travail devrait produire trois résultats concrets : une offre expliquée de façon identique partout, un tableau de mesure fiable, puis quelques pages d’acquisition renforcées avec des tests de conversion simples.
