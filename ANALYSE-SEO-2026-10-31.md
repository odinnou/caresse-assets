# Analyse SEO de Caresse — 31 octobre 2026

L’objectif retenu est l’acquisition d’installations : recherches pertinentes → arrivée sur le site → clic vers le bon store → installation. Le trafic, le temps passé et le nombre de pages ne suffisent pas à juger le résultat.

**Diagnostic : aucun blocage technique général détecté sur les URL du sitemap. Les premiers correctifs concernent la cohérence des promesses et la crédibilité des contenus. Le choix des pages à développer devra ensuite dépendre de Search Console et des clics stores mesurés dans Umami.**

## Périmètre et niveau de preuve

Audit HTTP réalisé directement sur le site public, indépendamment des versions parfois anciennes restituées par le moteur de recherche :

- Lecture de `robots.txt` et du sitemap en production.
- Téléchargement et analyse des **172 URL du sitemap**, soit **43 pages par langue** : FR, EN, ES et PT.
- Vérification de **38 destinations internes supplémentaires** : 18 fichiers MP3 et 20 pages légales/de téléchargement.
- Contrôle des statuts, redirections finales, canonical, H1, titles, descriptions, hreflang réciproques, concordance HTML/sitemap, liens HTML internes et syntaxe JSON-LD.
- Lecture éditoriale approfondie d’un échantillon français : accueil, jeu pour couple, pages couples, trois nouvelles pages d’usage, démos, comparatifs et articles. Lecture complémentaire de la version portugaise des démos.
- Avant les corrections locales consignées ci-dessous, les 172 HTML récupérés étaient identiques octet par octet aux fichiers du dépôt. Cela permet de rapprocher les constats publics de la documentation locale.
- Lecture du code local des scripts de conversion et de mesure. Leur comportement interactif sur téléphone et la réception des événements dans Umami ne sont pas validés ici.

Sans les exports, cet audit ne mesure ni l’indexation effective, ni les positions Google, ni les volumes de recherche, ni les backlinks, ni les conversions et installations réelles. Aucun score Lighthouse ou Core Web Vitals n’est attribué. Le navigateur de vérification visuelle était indisponible.

L’inventaire vérifiable est livré dans [SEO-INVENTAIRE-2026-10-31.csv](SEO-INVENTAIRE-2026-10-31.csv). Les anciennes URL de démos, absentes du sitemap et du maillage courant, n’ont pas été contrôlées en HTTP dans ce passage.

## 1. La base technique est saine sur les contrôles effectués

| Contrôle | Résultat en production | Interprétation |
|---|---|---|
| URL du sitemap | 172/172 répondent en 200, sans redirection finale | Les pages déclarées sont accessibles. |
| Robots | Exploration autorisée ; sitemap déclaré | Pas de blocage global observé. |
| Indexabilité déclarée | Aucun `noindex` ni en-tête `X-Robots-Tag: noindex` sur ces 172 pages | Compatible avec une indexation, sans la prouver. |
| Canonical | Chaque page désigne sa propre URL | Pas de canonical contradictoire détectée. |
| Title et description | Présents et uniques sur les 172 pages | Pas de duplication exacte de ces balises. |
| H1 | Un H1 par page | Structure principale identifiable. |
| Hreflang | Liens réciproques et concordants entre HTML et sitemap | Aucun défaut détecté dans les correspondances testées. |
| Maillage | Aucune page du sitemap sans lien entrant depuis cet ensemble | Pas de page orpheline dans ce périmètre. |
| Profondeur | Toutes accessibles en trois liens HTML au maximum depuis l’accueil FR | Architecture exploitable sans chantier de navigation général. |
| Destinations internes complémentaires | 38/38 répondent en 200 | Aucun lien cassé trouvé dans cet ensemble. |
| JSON-LD | Tous les blocs analysés se parsèment | La syntaxe est lisible ; cela ne valide pas tous les champs ni l’éligibilité aux résultats enrichis. |
| Boutons principaux | Les 200 liens portant `.cta-pink` ciblent directement un store | Le parcours principal conserve un accès direct au téléchargement. |

Les pages légales et de téléchargement complémentaires portent un `noindex` et sont absentes du sitemap. Je ne recommande pas de les indexer par défaut : leur exclusion n’empêche pas les pages d’acquisition de conduire directement au store.

Sources : [robots.txt](https://caresse.app/robots.txt), [sitemap](https://caresse.app/sitemap.xml), [accueil](https://caresse.app/). Les correspondances linguistiques ont été contrôlées selon le principe des liens de retour décrit dans la [documentation Google](https://developers.google.com/search/docs/specialty/international/localized-versions).

## 2. Aligner les formulations sur l’offre réelle

Référence confirmée par le propriétaire le 31 octobre 2026 : **les démos sont gratuites et les sessions personnalisées sont payantes. L’acheteur reste anonyme vis-à-vis de Caresse : le propriétaire ne reçoit aucune information permettant de connaître son identité.**

La distinction entre téléchargement gratuit, démos gratuites et génération payante est beaucoup plus claire sur les pages récentes. La correction reste incomplète sur certaines pages plus anciennes.

### Gratuité : plusieurs formulations suggèrent encore une génération offerte

L’accueil et les nouvelles pages expliquent que les sessions personnalisées utilisent des crédits payants. Pourtant :

- Les comparatifs [MagicWave](https://caresse.app/vs-magicwave/), [Coelle](https://caresse.app/vs-coelle/), [InTheMoment](https://caresse.app/vs-inthemoment/) et [Quinn](https://caresse.app/vs-quinn/) annoncent encore une première session offerte.
- Des pages pour les [couples de longue date](https://caresse.app/for-long-term-couples/), [nouveaux couples](https://caresse.app/for-new-couples/), [couples débordés](https://caresse.app/for-busy-couples/) et [couples aventuriers](https://caresse.app/for-adventurous-couples/), ainsi que [le fonctionnement](https://caresse.app/how-it-works/) et [l’accessibilité](https://caresse.app/for-blind-and-low-vision/), mentionnent une session découverte offerte.

**Action prioritaire : employer « démos gratuites » et « sessions personnalisées payantes » sur toutes les locales.** Remplacer les formulations laissant entendre qu’une première génération personnalisée est offerte. Une promesse plus généreuse sur une page d’entrée peut attirer un clic qui se transforme ensuite en déception. L’impact actuel sur les installations reste à mesurer.

**Correction réalisée dans le dépôt le 31 octobre :** 68 formulations ont été alignées en français, anglais et espagnol, y compris les réponses FAQ visibles et leur JSON-LD. Les formulations portugaises contrôlées distinguaient déjà les démos gratuites des générations avec crédits payants.

### Anonymat vis-à-vis de Caresse : promesse confirmée

Le propriétaire confirme ne recevoir aucune information sur l’identité de l’acheteur. Le paiement via Apple ou Google est donc compatible avec un achat anonyme vis-à-vis de Caresse. Les formulations observées sur les pages [Coelle](https://caresse.app/vs-coelle/), [InTheMoment](https://caresse.app/vs-inthemoment/), [Quinn](https://caresse.app/vs-quinn/) et [accessibilité](https://caresse.app/for-blind-and-low-vision/) ne constituent pas, à ce titre, une incohérence de l’offre.

**Correction de l’audit : retirer l’anonymat du paiement des problèmes à corriger.** La mention du compte du store explique le fonctionnement de la transaction ; elle ne contredit pas l’anonymat de l’acheteur vis-à-vis de Caresse.

### Ce qui a déjà progressé

Le comparatif Melba et les tableaux contrôlés expliquent maintenant que la durée dépend de la génération. Le hub démo distingue l’extrait figé de la session personnalisée. L’application déclare aussi les quatre langues dans son balisage principal. Ces sujets ne justifient donc plus de reprendre les recommandations anciennes telles quelles.

Sources : [Melba](https://caresse.app/vs-melba/), [démos](https://caresse.app/demo/), [audio personnalisé](https://caresse.app/audio-intime-personnalise/).

## 3. La preuve sociale mérite une correction explicite

La documentation locale [`# CLAUDE.md`](%23%20CLAUDE.md) indique que les citations des pages satellites sont illustratives et ne correspondent pas à de vrais avis. Pourtant, cinq pages françaises attribuent une citation à des « utilisateurs Caresse » : couples, longue date, nouveaux couples, couples débordés et aventuriers.

**Recommandation : remplacer ces citations par des retours vérifiés, ou présenter clairement ces situations comme des exemples fictifs.** C’est un problème de crédibilité observable. Cet audit ne conclut à aucune sanction Google. Aucun balisage `Review` ou `AggregateRating` n’a été trouvé dans les pages du sitemap.

**Suivi du 31 octobre 2026 :** le propriétaire confirme le caractère illustratif des témoignages et autorise leur retrait. Les 24 témoignages ont été supprimés dans le dépôt : six pages par langue (couples, solo, longue date, nouveaux couples, couples débordés et aventuriers). Les sections dédiées ont été retirées ; les cartes intégrées aux pages nouveaux couples ont été supprimées et la présentation adaptée sur une colonne. Les dates `lastmod` des 24 pages ont été actualisées dans le sitemap. Cette correction locale reste à publier ; l’inventaire CSV conserve l’état de production observé au moment de l’audit.

Le site peut aussi mieux étayer son expérience réelle : exemples de configuration, extraits audio correspondant aux promesses, captures actuelles et limites du génératif. Les nouvelles pages le font déjà plus clairement que certaines anciennes pages satellites.

Source publique : [page couples](https://caresse.app/for-couples/). Référence générale : [contenus utiles et fiables selon Google](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).

## 4. Concentrer l’effort sur quelques intentions proches du produit

Chaque langue comporte notamment 12 comparatifs, six articles et six pages de démos. Le site couvre déjà beaucoup de portes d’entrée. La prochaine décision doit porter sur leur rendement plutôt que sur leur multiplication.

| Intention candidate | Page principale | Travail possible après lecture des données |
|---|---|---|
| Jeu coquin pour couple sur téléphone | [Jeu pour couple](https://caresse.app/couples-game/) | Confirmer les requêtes réellement obtenues ; renforcer l’exemple d’une première utilisation. |
| Audio intime personnalisé | [Audio personnalisé](https://caresse.app/audio-intime-personnalise/) | Démontrer la personnalisation et distinguer clairement génération et catalogue. |
| Massage sensuel guidé à deux | [Massage en couple](https://caresse.app/massage-sensuel-couple/) | Vérifier si les recherches visent un guidage audio ou un tutoriel pratique. |
| Soirée romantique chez soi | [Soirée romantique](https://caresse.app/soiree-romantique-maison/) | Évaluer l’adéquation entre une recherche d’idées et la proposition d’application. |
| Alternative à une app connue | [Comparatifs](https://caresse.app/alternatives/) | Investir d’abord dans les marques qui apportent impressions pertinentes et clics stores. |
| Entendre le produit | [Démos](https://caresse.app/demo/) | Mesurer leur rôle réel dans les parcours d’acquisition et de téléchargement. |

Ces expressions sont des **hypothèses d’intention**, sans volume ni difficulté vérifiés. Le fait que plusieurs pages parlent de couple ne prouve pas une cannibalisation : il faudra observer les couples requête/page dans Search Console avant d’envisager une fusion ou une réorientation.

Les nouvelles pages d’usage sont déclarées modifiées le 24 octobre, une semaine avant cet audit. Il est trop tôt pour juger leur potentiel sur une courte fenêtre de résultats. Conserver leurs dates de lancement et de modification pour lire les exports correctement.

### Clarifier le premier écran sans lancer une réécriture générale

Le H1 de l’accueil reste très évocateur, mais décrit peu l’offre. La définition du produit arrive juste après et se répète. Le title actuel est déjà descriptif : je ne le changerais pas mécaniquement avant de voir ses requêtes et son CTR.

Une piste de test ultérieure serait un titre principal comme **« Vos moments intimes, guidés par un audio personnalisé »**, suivi d’une seule phrase expliquant le mode solo/duo et les prénoms dans la narration. C’est une hypothèse de compréhension et de conversion ; aucune garantie SEO n’en découle. Google utilise plusieurs éléments de la page pour construire le titre affiché dans les résultats. [Documentation sur les titres](https://developers.google.com/search/docs/appearance/title-link).

### Donner plus de substance aux articles qui obtiennent déjà des impressions

L’article sur la flamme explique les mécanismes du désir et du cerveau de manière assez affirmative, sans références de fond dans son corps. Il possède déjà un auteur et des dates dans le JSON-LD : il ne faut pas déclarer ces métadonnées absentes.

L’amélioration utile serait d’identifier visiblement la responsabilité éditoriale, nuancer les généralités et citer des sources primaires pour les affirmations concernées. Prioriser ce travail si ces articles captent des recherches utiles au produit. [Article contrôlé](https://caresse.app/blog/raviver-la-flamme-couple/).

## 5. Multilingue et données structurées : des ajustements ciblés

**Le portugais dispose de 43 pages, mais ses démos utilisent les fichiers audio anglais.** La page l’annonce clairement : ce n’est pas une promesse cachée. Si le PT apporte du trafic qualifié, produire une preuve audio en portugais pourrait améliorer la compréhension et le clic store. Sa priorité dépendra des volumes et des conversions par langue. [Démos portugaises](https://caresse.app/pt/demo/).

Trois ajustements de balisage restent secondaires :

- L’application porte `datePublished: 2025-01-01` sur les accueils FR/EN/ES. Vérifier cette date dans l’historique réel et la corriger ou l’omettre si elle n’est pas fondée.
- Plusieurs `WebPage.inLanguage` déclarent FR et EN ensemble pour une page dont le contenu est dans une seule langue. Mettre la langue de la page dans `WebPage` ; conserver les langues prises en charge dans l’entité de l’application.
- Le JSON-LD lisible ne garantit pas un résultat enrichi d’application : Google demande notamment une note ou un avis répondant à ses règles. Ne rien fabriquer pour satisfaire ce critère. [Documentation SoftwareApplication](https://developers.google.com/search/docs/appearance/structured-data/software-app).

**Corrections réalisées dans le dépôt le 31 octobre :** 83 valeurs de langue ont été ajustées dans les données structurées : langue propre à la page et quatre langues prises en charge par l’application. Les langues originales des articles externes référencés ont été conservées. Les trois dates de publication non étayées ont été supprimées, sans inventer de date de remplacement. Deux liens du hub de démos portugais ont aussi été corrigés : les mentions des versions française et espagnole pointent maintenant vers leurs hubs respectifs.

Je ne consacrerais pas un chantier aux FAQ structurées dans l’espoir de gagner des encarts Google : la documentation consultée indique que cet affichage a été retiré depuis mai 2026. Les FAQ peuvent rester utiles dans le contenu. De même, `llms.txt` n’est pas un levier de classement Google annoncé. [Mises à jour officielles Google](https://developers.google.com/search/updates).

## 6. Les points encore indéterminés

**SafeSearch.** Le positionnement adulte et les pages de démos justifient de vérifier le comportement du site avec et sans filtrage sur les mêmes requêtes. L’absence d’images explicites ne suffit pas à conclure, car Google considère aussi le texte et les liens. Aucun filtrage de Caresse n’est établi ici. [Documentation Google](https://developers.google.com/search/docs/specialty/explicit/guidelines).

**Performance mobile.** Les pages utilisent des WebP, des dimensions d’images, du chargement différé et une façade vidéo. Ce sont des choix favorables, sans prouver de bons Core Web Vitals. Les temps HTTP de ce crawl ne sont pas des mesures de LCP, INP ou CLS. Contrôler les données réelles dans Search Console, puis mesurer les pages d’entrée importantes si nécessaire.

**Autorité et distribution.** Aucun inventaire de backlinks n’a été réalisé. Je ne conclus donc pas à un manque d’autorité. Les ressources originales sur l’audio et l’accessibilité peuvent servir une distribution éditoriale, si elles apportent une information utile et documentée.

**Visibilité réelle.** Une requête `site:` ou les résultats du moteur utilisé pour cet audit ne donnent pas le nombre fiable de pages indexées ni les positions Google. Certaines réponses consultées restituaient d’anciennes versions ; les constats de contenu ci-dessus reposent sur les téléchargements directs actuels.

## 7. Mesurer l’acquisition avec les exports

Le code de suivi prévoit `store_click` avec notamment la page d’entrée, la source, le store, l’emplacement du bouton, la langue, la variante et les indicateurs de premier clic. C’est une bonne base, à confirmer dans les données reçues.

La définition de visite du script repose sur 30 minutes et `sessionStorage`. Elle n’est pas automatiquement identique aux sessions Umami et ne se partage pas entre tous les onglets. Ne pas diviser des événements bruts par des visiteurs uniques et appeler le résultat un taux de conversion de session.

Indicateur souhaité : **visites éligibles avec au moins un clic store / visites éligibles**, à condition de disposer d’une correspondance fiable. À défaut, présenter séparément les visiteurs, sessions et événements, et signaler l’approximation. Un clic store reste distinct d’une installation.

Exports utiles, idéalement sur les trois derniers mois avec une période précédente comparable :

| Source | Données à fournir |
|---|---|
| Search Console — performances Web | Dates, requêtes, pages, pays, appareils, clics, impressions, CTR et position ; historique plus long si disponible. |
| Search Console — indexation | Pages indexées/exclues et motifs, état du sitemap ; inspections de quelques pages prioritaires si nécessaire. |
| Search Console — expérience | Core Web Vitals, si des données sont disponibles. |
| Umami — acquisition | Visiteurs, visites, pages/entrées si disponibles, sources, appareils/OS, pays, UTM et évolution quotidienne. |
| Umami — conversion | `store_click` et propriétés disponibles, dont `landing_page`, `acquisition_source`, `store`, `cta_position`, `first_store_click`, `first_link_click`, `variant`, `test` et définitions de mesure. |

Les onglets GSC « Requêtes » et « Pages » d’un export standard sont souvent des agrégats séparés : ils ne permettent pas à eux seuls de reconstruire chaque association requête/page. Nous exploiterons le niveau réellement fourni. Écarter les événements de test et tenir compte des changements de suivi entre périodes.

Le rapprochement devra permettre de distinguer : manque d’impressions pertinentes, difficulté d’indexation, CTR faible à position comparable, page qui attire mais produit peu de clics stores, et éventuelle perte après l’arrivée sur le store. Ce dernier point nécessiterait ensuite les données des stores.

## 8. Ordre de travail proposé

| Priorité | Action | Critère de décision |
|---|---|---|
| Réalisé dans le dépôt | Harmoniser les mentions de gratuité sur les quatre langues | 68 formulations corrigées ; version portugaise contrôlée. |
| Réalisé dans le dépôt | Retirer les témoignages illustratifs dans les quatre langues | 24 témoignages supprimés ; publication à effectuer. |
| P1 | Analyser les exports et vérifier la réception des événements | Une référence fiable par page, source, langue et appareil. |
| P2 | Renforcer quelques pages déjà visibles ou proches du téléchargement | Impressions pertinentes, clics Google puis clics stores. |
| P2 | Ajuster le premier écran des pages retenues, une variable à la fois | Conversion comparable avant/après ; prudence avec les petits volumes. |
| Réalisé dans le dépôt | Corriger les métadonnées secondaires et les liens de langue du hub démo PT | 83 valeurs de langue corrigées, trois dates non étayées retirées et deux liens réparés. |
| Selon les exports | Investir dans les démos audio PT | Rendement par langue et priorité d’acquisition à établir. |

L’audit initial n’a modifié aucun HTML ni script. À la suite de l’accord du propriétaire, le retrait des témoignages puis les corrections d’offre et de métadonnées ont été réalisés dans le dépôt. Ce dernier lot touche 63 pages, dont les 24 pages de témoignages déjà modifiées. Les dates du sitemap et les champs `dateModified` existants ont été actualisés pour ces pages ; le marqueur `seo-consistency-oct31-v1` a été ajouté aux variantes de suivi pour identifier cette révision après publication. Ce marqueur ne constitue pas un test A/B.

Les changements de ciblage, de title, de H1 et de premier écran, l’enrichissement des articles selon leur visibilité, la création de démos portugaises et les travaux guidés par les Core Web Vitals restent à confronter aux exports annoncés. Les fichiers corrigés sont locaux ; la publication n’a pas été effectuée pendant cette intervention.

Vérification finale : 202 fichiers HTML analysés, 366 blocs JSON-LD parsés et 200 CTA principaux contrôlés. Les canonical, les hreflang réciproques et leur concordance avec les 172 URL du sitemap sont conservés. Les libellés et destinations des CTA principaux, les scripts de routage mobile et de suivi des clics sont inchangés. Le contrôle `git diff --check` passe. Cette vérification porte sur les fichiers ; elle ne remplace pas un contrôle visuel sur téléphone ni les mesures réelles dans Umami et Search Console.
