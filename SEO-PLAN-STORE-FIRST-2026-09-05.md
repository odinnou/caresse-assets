# Caresse — plan SEO priorisé pour envoyer les visiteurs vers les stores

Date : 5 septembre 2026. Proposition fondée sur les trois exports Search Console, le dépôt au commit `324dafa` et la consultation de caresse.app. Document de travail interne contenant des statistiques d’acquisition.

## Décision recommandée

**La première optimisation consiste à faire sortir plus vite vers les stores le trafic qui arrive déjà.** Ensuite, développer les recherches qui donnent envie d’essayer Caresse, en priorité les alternatives et comparatifs qui apportent déjà des visiteurs.

La règle de décision pour chaque modification est celle-ci : **augmente-t-elle le nombre de visiteurs qui ouvrent une fiche store ?** Une visite de cinq secondes suivie d’un départ vers un store est une réussite. Cinq minutes de lecture sans départ vers un store sont un échec de conversion pour cette visite. Le temps passé, les pages vues et les écoutes de démo ne sont pas des objectifs.

Le parcours visé est : `Google → page adaptée à la recherche → App Store ou Google Play`, avec un seul clic sur la page pour rejoindre le store. Chaque page peut donner les explications nécessaires, mais doit permettre de télécharger avant de les lire.

Le clic sortant est le principal indicateur observable depuis le site. Il ne prouve ni que la fiche s’est chargée, ni qu’une installation a eu lieu. Les vues de fiche et installations disponibles dans les consoles stores servent à vérifier la qualité de ces sorties, sans imposer d’étapes supplémentaires au visiteur.

## 1. Ce que disent les données

### Périmètre et limites

| Source | Données effectivement disponibles | Limite à respecter |
|---|---|---|
| `caresse.app-Performance-on-Search-2026-09-05.xlsx` | Recherche Web ; filtre « Les 6 derniers mois » ; dates présentes du 23/04 au 02/09/2026 | Le 5 septembre est la date d’export, pas la dernière journée mesurée |
| `caresse.app-Coverage-2026-09-05.xlsx` | Courbe du 07/06 au 28/08/2026 et motifs de non-indexation | Pas de liste des URL concernées par chaque motif |
| `caresse.app-Video-indexing-Drilldown-2026-09-05.xlsx` | Courbe jusqu’au 03/09 ; deux URL concernées | Rapport sur l’indexation des vidéos, pas sur la conversion |
| Dépôt | 122 fichiers HTML, un script JS partagé, site statique | Le code observé est plus récent qu’une partie des données GSC |
| Site déployé | Accueils FR/EN, comparatifs et hub démo consultés ; HTML de l’accueil FR vérifié directement | Pas de session de navigateur mobile disponible pour valider le rendu ou l’ouverture native des stores |

Les exports ont été analysés en lecture seule. Ils ne contiennent ni sessions web, ni clics sortants, ni installations. Ils ne croisent pas requête × page × appareil : on ne peut donc pas attribuer automatiquement une requête à une page, ni déduire la répartition iOS/Android de la catégorie « Mobile ».

### Acquisition actuelle

| Indicateur | Résultat | Conséquence |
|---|---:|---|
| Clics Google, total propriété | 195 | Petit volume : privilégier des corrections évidentes et peu de variantes |
| Impressions Google, total propriété | 4 714 | Visibilité existante à convertir, encore limitée |
| CTR global recalculé | 4,14 % | Indicateur d’acquisition, pas de conversion store |
| Clics mobile | 172 / 195 = **88,2 %** | Priorité au bouton visible et au bon store sur téléphone |
| Clics ordinateur / tablette | 22 / 1 | Prévoir les deux badges sur ordinateur ; le QR code reste secondaire |
| France | 87 clics ; 656 impressions | Premier marché observé en clics |
| États-Unis | 35 clics ; 1 771 impressions | Visibilité anglaise importante, à qualifier |
| 28 jours du 09/07 au 05/08 | 39 clics ; 1 290 impressions ; CTR 3,02 % | Période de comparaison de même durée |
| 28 jours du 06/08 au 02/09 | 144 clics ; 3 100 impressions ; CTR 4,65 % | Croissance réelle du trafic observé, sans preuve de causalité liée à un changement précis |

Sources : onglets `Graphique!A1:E134`, `Appareils!A1:E4` et `Pays!A1:E140` du fichier Performance. CTR recalculés par division des totaux, et non par moyenne des CTR journaliers.

**Attention aux dénominateurs :** la table Pages totalise 201 clics et 5 482 impressions, tandis que Graphique, Pays et Appareils totalisent 195 clics et 4 714 impressions. Les agrégations par page et par propriété diffèrent. La table Requêtes ne restitue que 35 clics et 2 450 impressions pour 124 requêtes : elle ne décrit donc pas l’intégralité de l’acquisition. Ces écarts ne doivent pas être « corrigés » en inventant une répartition. Google documente les [différences d’agrégation par page](https://support.google.com/webmasters/answer/17010961?hl=en) et les [limites de restitution des requêtes](https://support.google.com/webmasters/answer/96568?hl=en).

### Les pages qui justifient l’ordre de travail

| Page | Clics | Impressions | CTR GSC | Position moyenne | Décision |
|---|---:|---:|---:|---:|---|
| `/` | 39 | 503 | 7,75 % | 10,27 | Supprimer le détour du bouton de téléchargement |
| `/alternatives/` | 30 | 190 | 15,79 % | 5,55 | Conserver l’acquisition ; clarifier la sortie store |
| `/en/vs-melt/` | 26 | 1 603 | 1,62 % | 7,71 | Premier chantier éditorial de croissance |
| `/en/` | 21 | 1 115 | 1,88 % | 8,75 | Même correction de parcours que l’accueil FR |
| `/en/alternatives/` | 17 | 298 | 5,70 % | 6,76 | Même travail de conversion que le hub FR |
| `/en/vs-dipsea/` | 8 | 270 | 2,96 % | 7,25 | Deuxième comparatif à optimiser pour l’acquisition |
| `/for-couples/` | 8 | 85 | 9,41 % | 5,60 | Renforcer la promesse immédiate et la sortie store |
| `/couples-game/` | 8 | 61 | 13,11 % | 6,59 | Même priorité, sans développer un jeu web |
| `/en/vs-magicwave/` | 7 | 38 | 18,42 % | 5,29 | Préserver ; volume trop petit pour conclure sur le CTR |
| `/for-solo-exploration/` | 6 | 103 | 5,83 % | 5,41 | Renforcer le bénéfice solo près du téléchargement |

Source : Performance, `Pages!A1:E67`, notamment lignes 2 à 11. Les dix pages ci-dessus totalisent **170/201 clics de la table Pages, soit 84,6 %**.

Autre regroupement utile, distinct du précédent : les accueils totalisent 63 clics et les pages `/alternatives/` ou `/vs-*` 105 clics, soit **168/201 = 83,6 %** à eux seuls. Le blog, index de blog inclus, totalise **1 clic pour 97 impressions**. Les URL `/demo/` et leurs pages filles n’apparaissent pas dans cette table ; cela ne prouve pas qu’elles ne sont pas indexées ou qu’elles ne reçoivent aucun autre trafic.

Par langue d’URL, la table Pages donne FR 107 clics, EN 88, ES 6. Travailler les corrections communes en FR/EN/ES, mais concentrer la recherche éditoriale et les mesures initiales sur FR et EN.

### Requêtes à exploiter avec discernement

| Requête observée | Clics / impressions | Interprétation et action |
|---|---:|---|
| `melt stories` | 12 / 1 113 | Forte visibilité relative ; intention possiblement de retrouver Melt, donc présenter honnêtement une alternative |
| `meltstories` | 4 / 137 | Même sujet ; enrichir la page existante plutôt que créer une page par variante |
| `melt stories app free download` | 0 / 20 | Intention de téléchargement intéressante, mais ne pas se présenter comme le téléchargement officiel de Melt |
| `caresse` | 4 / 761 | Terme ambigu ; position moyenne 13,64. Renforcer « Caresse, l’application audio » plutôt qu’attribuer tout le faible CTR à un mauvais titre |
| `dipsea alternatives` / `dipsea alternative` | 0 / 14 et 0 / 13 | Travailler le comparatif existant, avec une réponse courte sur la différence et le prix |
| `dipsea en español` | 1 / 15 | Signal cohérent avec la disponibilité de Caresse en espagnol ; petite opportunité ciblée |
| `application comme melba gratuit` | 1 / 8 | Expliquer immédiatement ce qui est gratuit chez Caresse et ce qui est payant |
| `magicwave free` | 2 / 7 | Signal à conserver ; sept impressions ne justifient pas un chantier massif |

Source : Performance, `Requêtes!A1:E125`, notamment lignes 2–9, 20–23. Les associations page/requête sont des hypothèses de travail à vérifier avec un export filtré par page. Ne pas créer des pages pour les fautes de frappe, ni traiter toutes les occurrences de « caresse » comme des recherches de marque : l’export contient aussi des recherches sans rapport avec l’application.

## 2. Ordre de priorité

Effort indicatif relatif : faible = modification ciblée ; moyen = composant partagé ou travail éditorial avec vérifications. Aucun gain chiffré n’est garanti par les données actuelles.

| Ordre | Priorité | Action | Pourquoi maintenant | Effort |
|---|---|---|---|---|
| 1 | P0 | Mesurer les sorties stores | Permet de piloter la règle d’or | Moyen |
| 2 | P0 | Accueils : store direct au premier clic, puis même correction sur Bonded | 63 clics sur les accueils ; détour confirmé | Faible à moyen |
| 3 | P0 | Clarifier les CTA comparatifs et réduire leurs concurrents visuels | Comparatifs = 105 clics de la table Pages | Faible |
| 4 | P1 | Optimiser `/en/vs-melt/`, puis Dipsea et les hubs alternatives | Visibilité déjà acquise, intention à qualifier | Moyen |
| 5 | P1 | Faire de chaque landing une proposition d’essai autonome | Couple, jeu et solo apportent déjà des visiteurs | Moyen |
| 6 | P1 | Vérifier les URL non indexées à enjeu commercial | Possibilité de perte d’acquisition ; cibles absentes de l’export | Faible pour le diagnostic, correction variable |
| 7 | P2 | Corriger les liens démo et améliorer leur sortie store | Frictions réelles, mais pas d’acquisition GSC démontrée pour ces pages | Faible à moyen |
| 8 | P2 | Renforcer la notoriété de l’app et la continuité avec les fiches stores | Rend les recherches et clics plus qualifiés | Moyen, puis continu |
| 9 | P3 | Étendre le contenu, les langues et la vidéo uniquement sur preuve de contribution | Faible rendement démontré actuellement | À différer |

Les points 1 à 3 forment le premier lot. Poser la mesure avant sa mise en ligne, mais ne pas attendre plusieurs semaines de statistiques pour corriger le détour avéré vers `#download`.

## 3. P0 — Mesurer la réussite réelle

### Constat

Le dépôt contient Cloudflare Web Analytics dans 92 fichiers HTML, notamment `index.html:841`. Aucun événement de sortie store dédié n’a été identifié. Le gestionnaire de clic de `mobile-store-cta.js:28` actualise seulement le lien du bouton flottant.

**Précision apportée par le propriétaire le 5 septembre 2026 : Cloudflare Analytics n’a jamais fonctionné et affiche zéro donnée depuis le lancement.** La présence du script ne démontre donc pas une collecte effective. Il n’existe pas d’historique Cloudflare exploitable pour cet audit ; ce zéro ne signifie pas zéro visite. Les exports Search Console établissent, eux, l’existence de clics depuis Google. La cause de l’absence de remontée Cloudflare n’a pas été diagnostiquée.

Cloudflare Web Analytics ne prend actuellement pas en charge les événements personnalisés ni les paramètres UTM dans ses rapports : ajouter seulement des UTM aux liens ne permettra donc pas de mesurer ces conversions dans cet outil. Source : [FAQ Cloudflare](https://developers.cloudflare.com/web-analytics/faq/).

### Proposition concrète

Ajouter un événement `store_click`, via une collecte qui accepte les événements personnalisés. Conserver un vrai lien HTTPS direct vers le store : le comptage s’effectue en parallèle et ne doit jamais retarder ou conditionner l’ouverture. Éviter une page de redirection créée uniquement pour compter les clics.

Partir d’une mesure à établir et à vérifier de bout en bout, plutôt que supposer qu’un outil existant fournit déjà les visites. La première livraison doit montrer une arrivée de test et sa sortie store dans le dispositif de collecte puis dans le rapport, sur iPhone et Android. Vérifier également une visite sans sortie. Écarter ces visites de test des résultats commerciaux. La période de référence commence seulement lorsque cette remontée est confirmée ; aucune conversion historique ne peut être reconstituée avec les seuls exports GSC.

Un diagnostic Cloudflare peut expliquer la panne, mais sa réparation seule ne fournirait pas les événements de conversion nécessaires. Ne pas en faire un préalable bloquant aux corrections de liens directs : la priorité est une mesure fonctionnelle des arrivées et sorties stores, pas la remise en service de Cloudflare pour elle-même.

Champs utiles : `landing_page`, `page`, `locale`, `store`, `cta_position` (`hero`, `sticky`, `inline`, `footer`), `device_class`, `acquisition_channel`, `elapsed_ms`, `first_link_click`, `variant`. Le canal et la page d’entrée doivent être conservés pendant la visite pour ne pas perdre l’origine Google après une navigation interne. Employer des codes de page/campagne fixes ; ne transmettre ni préférences intimes, ni texte libre, ni identifiants personnels aux stores.

Définir les indicateurs ainsi :

- **Volume principal :** visites issues de Google ayant au moins un `store_click`, dédupliquées par visite.
- **Taux de sortie store :** ces visites divisées par les visites Google mesurées par le même dispositif, sur la même période. Ne pas utiliser les clics GSC comme dénominateur de sessions analytics.
- **Premier clic vers le store :** part des visites Google dont le premier clic sur un lien ouvre un store. Un clic d’ancre interne compte comme clic interne ; les changements de langue sont identifiés séparément pour interpréter les écarts.
- **Sortie rapide :** part des visites Google avec sortie store dans les cinq premières secondes. Une sortie plus tardive reste une réussite.
- **Diagnostic :** répartition par landing, OS/store, langue et emplacement du bouton ; médiane du délai parmi les visites converties.
- **Contrôle aval :** vues de fiche et téléchargements attribués lorsqu’ils sont disponibles dans les consoles stores. Un clic répété dix fois par une même visite ne devient pas dix conversions.

Conserver les arrivées, les clics bruts et les conversions dédupliquées : cela permet de repérer une erreur de comptage, notamment lorsque le bouton flottant clone un CTA.

Pour Apple, utiliser les liens de campagne générés par App Store Connect avec de vrais identifiants de fournisseur et de campagne. Commencer par quelques campagnes regroupant accueil/comparatifs/autres et langue, sans fragmenter chaque bouton en microcampagne. Les rapports ont des délais et seuils : une campagne sans données visibles ne signifie pas nécessairement zéro installation. Source : [liens de campagne Apple](https://developer.apple.com/help/app-store-connect-analytics/acquisition/campaign-links).

**Validation :** un clic ouvre le bon store même si la collecte échoue ; un événement porte la destination réellement ouverte ; pas de double comptage entre le lien et son clone ; une visite courte convertie est reconnue ; une écoute ou un scroll seul ne déclenche aucune conversion store.

## 4. P0 — Ouvrir le store dès le premier clic sur l’accueil

### Constat vérifié

Dans `index.html:872`, le CTA principal pointe vers `#download`, dont les badges sont en bas de page. La même construction existe dans `en/index.html` et `es/index.html`. Le HTML déployé de [l’accueil FR](https://caresse.app/) confirme ce lien. Il faut donc cliquer, descendre, puis choisir un badge.

Les trois accueils ne chargent pas `mobile-store-cta.js` et ne portent pas les identifiants dont ce script a besoin. Les trois pages `vs-bonded/index.html`, `en/vs-bonded/index.html`, `es/vs-bonded/index.html` utilisent également `#download` comme CTA principal. Sur Bonded FR, le lien vers le comparatif précède même le CTA rose dans le groupe de boutons.

Le document `SEO-GOLDEN-RULE.md` tolère encore `#download`. Cette tolérance est moins exigeante que l’objectif formulé ici : premier clic directement vers le store. **Je recommande de supprimer cette exception dans une prochaine mise à jour de la règle.**

### Modification proposée

1. Sur téléphone, afficher dans le premier écran un CTA explicite vers la fiche du bon store : iOS → App Store ; Android → Google Play.
2. Utiliser des liens présents dans le HTML. Prévoir les deux badges accessibles en cas d’OS inconnu ou de JavaScript indisponible ; ne pas rendre le téléchargement dépendant de la détection.
3. Sur ordinateur, présenter les deux badges près de la promesse. Un QR code peut aider, mais n’est pas prioritaire avec 22 clics desktop observés. Son scan n’est pas une installation et ne doit pas être compté comme telle.
4. Étendre le bouton flottant partagé aux accueils et à Bonded, sans dupliquer une deuxième mécanique concurrente. Tous les CTA adaptatifs d’une page doivent suivre le même routage ; les badges explicitement Apple/Google conservent leur destination propre.
5. Rendre les explications secondaires visuellement : supprimer le gros bouton « Découvrir l’app » voisin du téléchargement ; conserver si utile un lien texte descriptif plus bas. Sortir du paragraphe hero les liens vers les pages couple/solo et les replacer dans leur section de contenu.

Garder la vidéo, les captures et les réponses aux objections disponibles pour qui en a besoin. Le téléchargement doit précéder ces éléments et ne dépendre ni de leur lecture, ni d’une vidéo, ni d’une démo.

Conserver initialement les libellés de téléchargement existants pour isoler l’effet de la destination. Pour une révision ultérieure, proposition de hero FR :

> **Caresse, l’application audio intime pour explorer seul·e ou à deux.**
>
> Une voix vous guide, selon vos envies et vos limites. Découvrez le format gratuitement dans l’application, sans inscription.
>
> **Télécharger sur l’App Store** / **Télécharger sur Google Play**
>
> 18+ · Démos gratuites · Sessions personnalisées payantes · Sans abonnement

Vérifier les promesses dans la version actuelle de l’app avant publication. Le message commercial ne doit pas laisser croire que toute génération personnalisée est gratuite.

**Validation :** iPhone, Android et ordinateur ; largeur mobile étroite ; bouton atteignable sans scroll sur les formats cibles ; ouverture en un clic ; bon identifiant d’app ; liens fonctionnels sans analytics ; flottant non superposé à un contrôle audio. Garder `target="_blank" rel="noopener"` conformément à la règle actuelle, et vérifier son comportement sur les appareils réels.

## 5. P0 — Clarifier les comparatifs et leur appel au téléchargement

### Constat

Les comparatifs classiques disposent déjà d’un CTA direct et d’une bascule Android : **il faut préserver ce fonctionnement**. Par exemple, `vs-melba/index.html:325` et `en/vs-melt/index.html:341` proposent une écoute gratuite mais pointent vers l’App Store. Les boutons secondaires proposent le verdict ou la matrice.

Le problème de libellé se retrouve dans les hubs alternatives. La page [Melt en anglais](https://caresse.app/en/vs-melt/) donne beaucoup de place à la comparaison avant de préciser ce que l’utilisateur obtient en téléchargeant Caresse.

### Modification proposée

- Remplacer, dans un lot éditorial identifié, « Écouter les démos gratuites » par **« Télécharger l’app gratuitement »** ; EN : **“Download the app free”** ; ES : **“Descargar la app gratis”**. Ajouter juste dessous « Démos gratuites dans l’app, sans inscription. Sessions personnalisées payantes, sans abonnement. »
- Garder la destination store directe. La clarification du texte ne doit pas réintroduire `/demo/` comme destination du bouton.
- Remonter un verdict de deux phrases avant le CTA, spécifique au concurrent et factuellement vérifié. Le tableau détaillé reste plus bas.
- Transformer « Voir le verdict » / « Voir la matrice » en liens texte secondaires, ou les retirer du groupe hero. Le téléchargement reste la seule action visuellement dominante.
- Répéter un CTA store immédiatement après le verdict ou le tableau, pour qu’une personne convaincue n’ait pas à chercher le bas de page.

Ces libellés sont des **propositions à mesurer**, pas des formulations prouvées plus performantes. Les traiter séparément du changement de destination des accueils, comme le demande la règle locale sur l’interprétabilité des changements.

**Ordre de pages :** `/alternatives/` et `/en/alternatives/`, puis `/en/vs-melt/`, `/en/vs-dipsea/`, `/en/vs-magicwave/`. Propager le comportement commun aux équivalents FR/EN/ES, même lorsque leur trafic est faible.

**Validation :** une personne comprend avant son clic qu’elle ouvrira une fiche d’application ; le CTA n’annonce pas un lecteur web ; les clics directs et le taux de sortie store augmentent ou sont au minimum préservés ; aucune régression Android.

## 6. P1 — Acquérir davantage de visiteurs prêts à essayer

### 6.1. Priorité éditoriale : `/en/vs-melt/`

Avec 1 603 impressions et une position moyenne de 7,71, cette page offre la plus grande surface d’amélioration observée parmi les pages comparatives. Son CTR de 1,62 % n’implique pas automatiquement un mauvais extrait : une partie des internautes veut probablement Melt lui-même.

Le titre actuel, `Melt Stories Alternative: Free Audio Demo | Caresse`, vise déjà une alternative. Il n’est pas nécessaire de reconstruire la page ou de changer son URL. Tester ensuite une promesse centrée sur l’application :

| Élément | Proposition |
|---|---|
| Title | `Melt Stories Alternative: Personalized Audio App | Caresse` |
| H1 | `Looking for a Melt Stories alternative in audio?` |
| Description | `Try Caresse for personalized intimate audio, solo or together. Download on iOS or Android. Free demos; paid custom sessions, no subscription.` |
| CTA | `Download the app free` |
| Preuve proche du CTA | Capture de l’app + personnalisation + démos dans l’app + modèle de paiement clair |

Conserver l’expression « Melt Stories » et une comparaison utile. Répondre brièvement aux questions effectivement présentes dans l’export : application téléchargeable, gratuité des démos, différence entre texte et audio, absence d’abonnement. Ne pas promettre un téléchargement de Melt ni un catalogue gratuit illimité.

Google peut construire le titre affiché à partir de plusieurs éléments de la page : aligner title, H1 et texte visible ; une longueur de titre n’est pas une garantie d’affichage. Source : [documentation Google sur les liens de titre](https://developers.google.com/search/docs/appearance/title-link).

**Ordre de test :** sortie directe et libellé explicite, puis promesse du hero, puis title/description dans un lot distinct. Ne pas modifier toutes les variables le même jour.

### 6.2. Ensuite : Dipsea et les hubs alternatives

Sur `/en/vs-dipsea/`, répondre tôt à trois objections : langue, contenu généré/personnalisé, démos gratuites versus sessions payantes. Vérifier les faits et prix des concurrents sur leurs sources officielles avant toute réécriture. Les affirmations concurrentielles du code sont des contenus à contrôler, pas des preuves indépendantes.

Sur les hubs `/alternatives/`, garder un comparatif réel et compréhensible dans la page. Ajouter le CTA direct immédiatement après une synthèse. Les liens vers les fiches comparatives restent utiles pour un lecteur qui veut approfondir, mais ne deviennent pas une étape requise pour télécharger.

Ne pas créer une URL pour chaque variante de « alternative gratuite ». Les pages existantes couvrent déjà ces intentions. Réserver toute nouvelle page à une intention distincte, une promesse produit précise et une valeur explicative propre.

### 6.3. Mesurer l’acquisition et la conversion ensemble

Un meilleur CTR Google qui amène surtout des personnes cherchant du contenu web gratuit peut diminuer la qualité du trafic. Conserver comme critère final le **nombre de visites Google qui sortent vers un store**, avec le taux de sortie pour comprendre les changements.

Exemple purement illustratif : 100 visites × 20 % de sortie donnent 20 visites converties ; 70 × 40 % en donnent 28. Une baisse de trafic peut donc être acceptable. À l’inverse, une hausse du seul taux ne suffit pas si le nombre total de sorties s’effondre. Ces taux ne sont ni des observations ni des objectifs chiffrés pour Caresse.

## 7. P1 — Une promesse autonome sur les pages couple, jeu et solo

Sur `/for-couples/`, `/couples-game/` et `/for-solo-exploration/`, ainsi que leurs traductions, placer une réponse à l’intention avant le premier CTA :

| Intention | Proposition de bénéfice à préciser dans le hero |
|---|---|
| Couple | Une voix guide votre moment à deux, selon vos envies et vos limites |
| Jeu pour couple | Un jeu audio guidé sur téléphone, personnalisé pour vous deux |
| Solo | Une expérience audio intime, personnalisée à votre rythme |

À proximité immédiate : capture représentative, mention application iOS/Android, démos gratuites, absence d’abonnement et coût des sessions personnalisées expliqué. Ne pas imposer un quiz, un choix de profil, une inscription ou une page « comment ça marche » avant le store.

Préserver un contenu utile sous le hero : fonctionnement, limites, personnalisation, prix et réponses aux objections. Le SEO a besoin que la page réponde réellement à la recherche. **Alléger les distractions ne signifie pas vider les pages ou cacher du texte pour les robots.** Le maillage reste accessible, contextuel et lisible, avec une importance visuelle secondaire.

Le récit de marque « Ralentir. Ressentir. Se reconnecter. » peut rester une signature. Comme information principale, une promesse qui nomme l’application et l’expérience demandera moins d’interprétation à un nouveau visiteur. C’est une hypothèse de conversion à tester.

## 8. P1 — Indexation : intervenir sur les bonnes URL

L’export Coverage indique, à sa dernière date du **28 août**, 77 pages indexées et 16 non indexées. L’onglet `Problèmes critiques!A1:D7` répartit les motifs :

| Motif | Nombre | Traitement recommandé |
|---|---:|---|
| Bloquée par robots.txt | 3 | Obtenir les URL exactes et tester leur état actuel avant de modifier des règles |
| Exclue par noindex | 2 | Vérifier l’intention : une page légale ou utilitaire peut rester exclue |
| Page avec redirection | 2 | Vérifier la destination ; une redirection voulue n’est pas une panne SEO |
| 404 | 1 | Réparer en priorité si une landing utile a disparu ; sinon conserver une vraie 404 ou rediriger vers un équivalent pertinent |
| Détectée, actuellement non indexée | 8 | Inspecter les URL commerciales avant les autres, puis qualité, liens et rendu |
| Explorée, actuellement non indexée | 0 | Aucun stock signalé dans cet export |

**Le fichier ne permet pas de nommer ces URL.** Il faut ouvrir chaque motif dans Search Console et exporter ses exemples. Si une landing d’acquisition importante est réellement bloquée aujourd’hui, sa correction remonte immédiatement en P0.

Le code actuel ne confirme pas un blocage robots global : `robots.txt` autorise le crawl. Le sitemap contient **103 URL**, qui correspondent toutes à des fichiers locaux existants et dont aucune ne porte `noindex`. Ce contrôle local ne vaut ni vérification de tous les statuts HTTP déployés, ni preuve d’indexation par Google.

Ne pas calculer « 103 − 77 = 26 pages à réparer » : le sitemap actuel et la couverture du 28 août n’ont ni la même date ni nécessairement le même périmètre. Les pages démo ont notamment évolué après cette photographie.

Pour chaque URL commerciale concernée : vérifier HTTP 200, indexabilité, canonical, équivalent de langue, contenu rendu et liens contextuels existants ; demander ensuite une nouvelle exploration lorsqu’une correction le justifie. Google recommande de décider en fonction de l’objectif d’indexation de chaque URL, et pas seulement de son appartenance à une liste d’exclusion. Source : [rapport d’indexation Google](https://support.google.com/webmasters/answer/7440203?hl=en).

### Décision explicite sur `/download/`

Les trois pages de téléchargement portent actuellement `noindex, follow` et sont absentes du sitemap. Elles effectuent une redirection mobile, avec une exception pour les robots. `SEO-GOLDEN-RULE.md` décrit pourtant un épisode historique où leur passage en noindex faisait partie d’une régression.

**Recommandation : conserver pour l’instant leur rôle utilitaire et leur noindex**, tout en harmonisant la documentation. Le groupe n’apporte qu’un clic dans la table Pages. L’acquisition « télécharger Caresse » doit être satisfaite par une page indexable qui montre immédiatement les badges, sans rebond obligatoire. Si une vraie landing de téléchargement devient nécessaire, la concevoir comme une page stable et utile ; ne pas en faire simultanément une page SEO et une redirection différente selon le visiteur.

## 9. P2 — Démos : une preuve facultative, avec une sortie évidente

### Ce qui existe déjà

Le [hub démo](https://caresse.app/demo/) propose six pages d’écoute et un CTA store dans son hero. Les pages filles contiennent un lecteur audio et un CTA store ; le script mobile partagé est déjà chargé. Il ne faut donc pas proposer « ajouter des liens store aux démos » comme si rien n’existait.

Cependant, dans `demo/couple-romantique/index.html:252`, le lecteur précède le CTA statique, situé vers la ligne 277 après plusieurs paragraphes. Le bouton flottant peut compenser sur mobile, mais ne remplace pas un CTA clair près du lecteur, notamment sur ordinateur. La visibilité réelle doit encore être validée sur appareils.

### Corrections proposées

1. Mettre un CTA store explicite avant ou immédiatement à côté du lecteur, conserver celui situé après. L’écoute reste volontaire.
2. Présenter l’audio comme un aperçu de la voix et du format. Expliquer que l’app permet de générer une nouvelle session personnalisée ; éviter de laisser croire qu’elle déverrouille forcément la suite exacte de l’enregistrement web.
3. Proposer après l’écoute un CTA de personnalisation dans l’app, sans retour obligatoire au hub ou à une autre landing. Ne pas attendre la fin de l’audio pour rendre le CTA disponible.
4. Mesurer les visites démo → store. Une écoute complète sans sortie n’est pas une conversion. Les auditeurs et non-auditeurs ayant des intentions différentes, leur simple comparaison ne prouve pas l’effet causal de l’audio.
5. Tester éventuellement un aperçu plus court, clairement annoncé, si le volume le permet. Ne pas couper arbitrairement toutes les démos avant d’avoir une mesure ; ne pas transformer le site en catalogue à parcourir pour augmenter le temps passé.

### Neuf liens devenus imprécis

Le contrôle du code trouve neuf liens vers des ancres absentes du nouveau hub : `#demo-couple`, `#demo-pareja`, `#demo-solo`. Sources : les pages `for-couples/`, `couples-game/`, `for-solo-exploration/` dans les trois langues. Exemple : `for-couples/index.html:363`.

Ils ne produisent pas une 404 : ils ouvrent le hub sans rejoindre le lecteur promis, puis demandent un nouveau choix. Pour les conserver comme liens éditoriaux secondaires, pointer directement vers la page fille correspondante, par exemple `/demo/couple-romantique/` et `/demo/solo-decouverte-sensuelle/`, avec le préfixe de langue adapté. Actualiser aussi les mentions « quatre minutes avec Inès » pour correspondre au contenu réellement proposé.

Les CTA principaux de ces landings continuent à pointer vers les stores. Corriger ce maillage ne doit pas promouvoir l’écoute web au rang d’étape principale.

### Script mobile partagé

`mobile-store-cta.js` existe déjà sur 90 pages. Il masque le flottant dès que le footer entre dans le viewport, même si aucun badge store n’y est visible. Recommander une condition basée sur la visibilité d’un autre **CTA store**, plutôt que sur le footer entier, afin de ne pas supprimer la dernière occasion de conversion pendant la navigation de bas de page.

Vérifier aussi le focus clavier lorsque le flottant est masqué : `aria-hidden` et `opacity:0` ne retirent pas à eux seuls un lien du parcours Tab. Corriger cette accessibilité avec le comportement de visibilité, sans ajouter de pop-up.

## 10. P2 — Faire connaître Caresse comme application

### Clarifier la marque dans les résultats et sur les fiches

Employer de façon cohérente « Caresse » accompagné de sa catégorie : application audio intime, solo et couple, disponible sur iOS et Android. Une recherche de marque doit rapidement identifier le bon produit malgré les homonymes.

Les fiches publiques [App Store](https://apps.apple.com/us/app/caresse-intimate-ai-audio/id6758887086) et [Google Play](https://play.google.com/store/apps/details?id=studio.mokuton.caresse) sont accessibles. Le site doit préparer à ce que l’utilisateur y retrouve : même nom, même identité visuelle, même fonctionnement, même distinction démos gratuites/sessions payantes. Ne pas déduire de leur accessibilité web que l’ouverture native fonctionne sur tous les téléphones.

Sur les captures et les premières lignes de fiche, privilégier la compréhension rapide du produit et la possibilité d’essayer. Vérifier les formulations actuelles avant de promettre un nombre précis de démos : le site parle notamment d’une expérience de découverte et Google Play de cinq démos. Cela peut correspondre à des versions ou formats différents, mais mérite une harmonisation fondée sur l’app réellement distribuée.

Les badges Apple actuellement présents dans le code utilisent `/us/` y compris sur les pages FR. Ce n’est pas une preuve de panne : tester la fiche et la langue effectivement ouvertes en France avant de modifier les destinations régionales. Garder un accès simple aux deux stores.

### Acquisition externe après le premier lot

Préparer quelques présentations ciblées pour des médias, créateurs ou annuaires pertinents autour des applications pour couples et de l’audio. Le message doit montrer Caresse et donner envie de télécharger, avec un lien store direct lorsque le contexte s’y prête. Un lien direct vers une fiche store est une réussite commerciale même s’il n’ajoute pas une visite dans GSC.

Lorsqu’un lien vers le site est utile pour expliquer le produit et renforcer sa découverte, choisir la landing correspondant à l’intention, déjà équipée pour convertir immédiatement. Évaluer les placements par sorties stores et installations attribuables, pas uniquement par nombre de backlinks. Aucun contact externe n’a été effectué dans le cadre de cet audit.

## 11. P3 — Ce que je différerais

- **Un grand chantier blog.** Un seul clic observé pour l’ensemble du blog. Optimiser les pages commerciales qui ont déjà des entrées avant de produire des dizaines d’articles. Le contenu existant peut rester utile sans devenir l’axe principal.
- **De nouvelles langues ou de multiples pages proches.** Corriger FR/EN/ES ensemble, puis développer là où une intention et une contribution store sont établies. Ne pas supprimer des pages récentes pour la seule raison qu’elles n’ont pas encore de clics.
- **Une refonte globale de la navigation.** Garder une navigation suffisante pour comprendre le produit et accéder au support/légal, tout en donnant la priorité visuelle au store. Pas de menu enrichi destiné à augmenter les pages par visite.
- **Une réécriture massive des métadonnées.** Commencer par Melt EN, puis Dipsea. Les hubs qui ont déjà des clics ne nécessitent pas tous un changement de title simultané.
- **La chasse aux enrichissements de résultats sans enjeu identifié.** Ne pas inventer d’avis ou de notes structurées ; le dépôt précise que certains témoignages sont illustratifs. Le balisage ne compense pas un parcours de téléchargement indirect.
- **Une optimisation du temps passé ou du taux de rebond.** Une baisse du temps moyen accompagnée de davantage de sorties stores est conforme à l’objectif.

### L’alerte vidéo ne doit pas dicter le hero

Le fichier Video-indexing, `Tableau!A1:C3` et `Métadonnées!A1:B3`, signale deux pages : `/` et `/en/`, avec la même vidéo YouTube, et le motif « La vidéo n’est pas sur une page de lecture ». Les dernières explorations indiquées sont les 29 et 30 août.

**Ne pas mettre la vidéo au-dessus du téléchargement pour faire disparaître cette alerte.** Google distingue les pages consacrées à une vidéo des pages produit où elle est complémentaire ; ces dernières peuvent toujours apparaître comme résultats textuels. Une page vidéo dédiée n’a de sens ici que si elle attire une audience pertinente et génère des sorties stores. Source : [bonnes pratiques vidéo de Google](https://developers.google.com/search/docs/appearance/video).

De même, avant un chantier de performance, mesurer les pages prioritaires sur mobile. Aucun score Lighthouse ou Core Web Vitals n’a été établi dans cet audit. Charger le texte et le CTA en priorité, garder les médias secondaires légers et éviter qu’un futur outil de mesure retarde le téléchargement.

## 12. Séquence d’exécution et critères d’arrêt

### Premier lot : mesure et conversion

Installer la mesure et confirmer la réception effective des visites et événements dans les rapports, corriger les trois accueils et les trois pages Bonded, puis clarifier les CTA comparatifs dans un changement distinct. Vérifier les routes Apple/Android et les états du flottant. Faute d’historique analytics fonctionnel, ne pas annoncer de comparaison du taux de conversion avec la période antérieure. La correction d’un lien indirect ne doit pas attendre un test statistique.

Actualiser `SEO-GOLDEN-RULE.md` et `SEO-LINKING.md` : ce dernier conserve des passages décrivant des CTA envoyés vers `/demo/`, en contradiction avec le revert et la règle d’or. Remplacer aussi le schéma éditorial « article → landing → téléchargement » par une règle opérationnelle : **l’article offre lui-même une sortie store ; le lien vers la landing est facultatif**. Ces documents doivent empêcher la réintroduction du détour.

### Deuxième lot : acquisition existante

Travailler le hero et les extraits de Melt EN, puis Dipsea et les hubs, en conservant les URL. Exporter les requêtes filtrées par ces pages et les URL de non-indexation. Corriger immédiatement tout blocage confirmé d’une page stratégique. Réparer les neuf ancres démo dans ce lot ou dès qu’un fichier concerné est touché.

### Troisième lot : mesurer avant d’étendre

Observer au moins un cycle de 28 jours pour une lecture initiale, puis prolonger si les volumes restent trop faibles. Les 144 clics Google des derniers 28 jours ne permettent pas d’évaluer finement plusieurs variantes par page, langue et OS. Une comparaison avant/après reste indicative : la croissance du site, les changements de positions et le mix de requêtes peuvent expliquer une partie des variations.

Tenir un tableau hebdomadaire : période, version en ligne, visites Google mesurées, visites avec sortie store, taux de sortie, sorties au premier clic, délai de sortie, répartition store et installations attribuées disponibles. Ajouter les clics/impressions GSC dans des colonnes séparées, sans les confondre avec les sessions.

**Conserver** une évolution si elle améliore les sorties stores avec une promesse honnête et sans incident de parcours. **Revenir sur** une évolution qui réintroduit un clic obligatoire, envoie vers le mauvais store, fausse la mesure ou augmente les écoutes/pages vues sans contribution à la sortie store. Pour les résultats éditoriaux incertains, prolonger l’observation plutôt que déclarer un gagnant sur quelques clics.

L’épisode du 29 août rapporté dans `SEO-GOLDEN-RULE.md` est cohérent avec cette direction, mais l’affirmation d’un doublement des téléchargements en quinze minutes n’est pas vérifiable avec les fichiers fournis. Ne pas en tirer un gain garanti de 50 % pour les prochaines corrections.

## 13. Vérifications avant mise en ligne

- [ ] Premier CTA commercial directement relié à un store ; aucune page ni ancre intermédiaire obligatoire.
- [ ] Bon store sur iPhone et Android ; deux options explicites sur ordinateur/OS inconnu et en repli sans JS.
- [ ] FR, EN et ES synchronisés pour les comportements et les promesses équivalentes.
- [ ] CTA principal visible rapidement ; aucun CTA de navigation aussi dominant à côté.
- [ ] Chaque sortie est mesurée sans bloquer le lien ; conversions dédupliquées ; source de visite conservée.
- [ ] Le flottant reste cohérent avec les autres CTA, sans superposition ni focus invisible.
- [ ] Gratuité limitée à ce qui est réellement gratuit ; aucune promesse de session complète offerte non vérifiée.
- [ ] Canonical, hreflang et sitemap cohérents sur les pages modifiées ; liens démo précis et valides.
- [ ] Les changements de destination, de libellé et de title sont identifiables séparément dans le journal de déploiement.

## 14. Traçabilité et portée de la proposition

Fichiers source : les trois XLSX du dossier `/Users/odinnou/Downloads/SEO-caresse`. Les tableaux et calculs ci-dessus renvoient aux onglets et plages effectivement lus. L’analyse des feuilles a conservé leurs données originales et distingué fraîcheur d’export, période mesurée et périmètre d’agrégation.

Références code principales : `index.html:872`, `en/index.html`, `es/index.html`, `mobile-store-cta.js`, `alternatives/index.html`, `en/vs-melt/index.html`, `vs-melba/index.html:325`, les trois `vs-bonded/index.html`, `demo/index.html:343`, `demo/couple-romantique/index.html:252`, `for-couples/index.html:363`, `download/index.html:10`, `robots.txt`, `sitemap.xml`, `SEO-GOLDEN-RULE.md` et `SEO-LINKING.md`. Les numéros de ligne correspondent au dépôt audité.

Les sources publiques de référence sont liées au niveau des recommandations concernées. Le site a été consulté en ligne et le lien de l’accueil FR confirmé dans son HTML déployé ; les constats de code sur l’ensemble des fichiers ne sont pas présentés comme des tests navigateur de toutes les URL.

Ce livrable propose les modifications ; il ne les applique pas au site et n’effectue aucun déploiement. Il ne constitue pas une mesure d’installations existantes ni un audit exhaustif de performance, d’ASO ou de disponibilité internationale. Les seules informations supplémentaires nécessaires pour chiffrer les gains sont les événements de sortie store, les données d’acquisition des consoles stores et les URL détaillées des exclusions GSC.
