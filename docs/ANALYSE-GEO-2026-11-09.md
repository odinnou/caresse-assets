# Analyse GEO de Caresse — 9 novembre 2026

**Le meilleur investissement immédiat est de rendre les faits sur Caresse cohérents,
faciles à vérifier et mesurables jusqu’au clic store. Le site dispose déjà des
fondations d’exploration ; ajouter des noms de robots ou multiplier les traductions
ne suffira pas à créer un avantage.**

Le GEO désigne ici la visibilité de Caresse dans les réponses générées : présence de
la marque, citation d’une page pertinente, exactitude de la description et visite
qualifiée. L’objectif final reste l’installation de l’application, conformément à
[la règle d’or du dépôt](../SEO-GOLDEN-RULE.md). Un clic store reste une sortie vers
une boutique ; il ne prouve pas une installation.

La hausse du trafic IA est signalée par le propriétaire. Aucun export d’audience
n’a été consulté : son ampleur, les moteurs concernés et sa rentabilité ne sont pas
mesurés dans cette analyse. Être « parmi les premiers » est une ambition, pas une
position concurrentielle établie.

## Périmètre vérifié et limites

L’analyse croise le code et les contenus de la PR allemande, un échantillon HTTP de
production et les documentations officielles des moteurs consultées le 9 novembre.

- Production : accueil FR/EN, page couples FR, sécurité/confidentialité FR, tarifs FR,
  `robots.txt`, `llms.txt`, sitemap et accueil allemand. Les résultats sont conservés
  dans [le relevé HTTP](geo/controle-http-2026-11-09.csv).
- Les cinq pages éditoriales échantillonnées répondent en HTTP 200, avec un canonical
  propre et `index, follow`, sans en-tête `X-Robots-Tag` restrictif observé.
- `robots.txt`, `llms.txt` et le sitemap répondent en 200. Les deux fichiers texte
  sont identiques aux fichiers du dépôt. Le sitemap de production contient 196 URL.
- Au moment du contrôle, `/de/` répond en 404 : la PR allemande est ouverte et non
  fusionnée. Son build ajoute 49 URL indexables, soit 245 après intégration si la
  base reste inchangée. Un build réussi ne signifie pas que ces URL sont publiées.
- La PR dispose déjà de vérifications du HTML généré : liens, canonical, hreflang,
  sitemap, médias et destinations stores, ainsi que de contrôles navigateur.

Le client HTTP de cet audit s’identifie comme un audit Caresse. Un HTTP 200 depuis
cet environnement ne prouve ni le passage d’un robot authentique depuis ses IP,
ni une indexation, ni une citation. Aucun accès aux journaux d’exploration,
à Search Console, Bing Webmaster Tools, Umami ou aux consoles des stores n’a été
utilisé. Aucun test comparatif de réponses de ChatGPT, Claude, Gemini, Copilot ou
Perplexity n’a été exécuté. Le panel fourni ci-dessous est **à mesurer**, pas un
classement déjà obtenu.

## Ce qui est déjà favorable

| Élément constaté | Conséquence pratique | Limite |
| --- | --- | --- |
| HTML statique généré par Astro | Les textes et métadonnées sont présents sans attendre une application JavaScript | Cela ne garantit pas la sélection de la page par un moteur |
| Routes de traduction centralisées et canonical propres | Les langues peuvent être reliées même avec des slugs différents | Il faut contrôler les URL après publication |
| Accès autorisé à OAI-SearchBot, PerplexityBot et Bingbot ; règle générale permissive | Pas de blocage déclaré de ces moteurs dans le fichier actuel | Un hébergeur ou une protection réseau peut encore bloquer des requêtes |
| `llms.txt` déjà disponible | Un inventaire supplémentaire de l’offre et des pages existe | Ce n’est ni une garantie de citation, ni une exigence universelle |
| Pages produit, tarifs, confidentialité, démos et comparatifs | Les principales questions de choix ont déjà des pages de destination | Leur cohérence compte plus que leur nombre |
| Événement `store_click` avec source, langue, page d’entrée et store | Une partie du parcours d’acquisition est déjà instrumentée | Les volumes et la réception réelle des événements restent à vérifier dans Umami |

L’[audit d’août](../SEO-GEO-AUDIT-2026-08-08.md) décrit une situation historique.
Son constat initial d’absence de fichiers GEO ne correspond plus au site actuel.

## Les moteurs n’ont pas tous les mêmes contrôles

Les documentations officielles conduisent à distinguer découverte, recherche,
récupération à la demande et entraînement. Autoriser l’entraînement n’est pas une
condition générale pour être cité dans une recherche.

| Surface | Contrôle à surveiller | Lecture pour Caresse |
| --- | --- | --- |
| Recherche ChatGPT | `OAI-SearchBot`, accès réseau et IP officielles | Déjà autorisé. `GPTBot` concerne l’entraînement ; `ChatGPT-User` des récupérations déclenchées par des utilisateurs. Ces rôles sont distincts [S1] |
| Recherche Perplexity | `PerplexityBot`, accès aux plages IP documentées | Déjà autorisé ; le robot de recherche est distinct de l’entraînement [S2] |
| Recherche Claude | `Claude-SearchBot`, et `Claude-User` pour les demandes utilisateur | Non nommés explicitement, mais déjà couverts par `User-agent: * / Allow: /`. Leur ajouter un bloc serait une clarification, pas le déblocage d’un accès actuellement interdit [S3] |
| AI Overviews / AI Mode de Google | Googlebot, indexation et possibilité d’afficher un extrait | Pas de fichier IA ou schéma spécial exigé. `Google-Extended` ne remplace pas les contrôles de Google Search [S4] |
| Copilot / Bing et intégrations couvertes | Accès Bing et rapports Bing Webmaster Tools | Utiliser le rapport AI Performance pour les citations sur les surfaces qu’il couvre, sans l’extrapoler à tous les moteurs [S5–S6] |

L’accès actuel aux robots d’entraînement est conservé. Une éventuelle politique
d’entraînement relève d’un choix distinct, sans promesse de gain GEO associé.

## P0 — Réparer les faits avant d’amplifier leur diffusion

### 1. Confidentialité : corriger les contradictions visibles

**Constat confirmé en production :** la page couples affirme l’absence de stockage
de données sensibles et de partage avec des tiers. La page de sécurité décrit
pourtant des paramètres et un historique, ainsi que des transmissions
pseudonymisées aux fournisseurs IA/TTS. La politique de confidentialité décrit
également leur conservation.

Sources à rapprocher :

- [`couples.fr.json`](../src/content/pages/couples.fr.json), carte de confidentialité
  et réponse FAQ sur le partage ;
- [`legal-privacy.fr.json`](../src/content/pages/legal-privacy.fr.json), sections sur
  les données, les prestataires et la conservation ;
- [page couples publique](https://caresse.app/for-couples/) et
  [page de sécurité publique](https://caresse.app/is-caresse-safe/).

**Action recommandée :** remplacer les absolus marketing par une description
conforme au fonctionnement validé et à la politique : identifiant technique,
paramètres nécessaires, prénom ou alias, traitements pseudonymisés, suppression
possible. Distinguer absence de revente, absence de partage public et absence de
tout traitement tiers. Propager la correction aux traductions concernées.

**Critère de fin :** les pages commerciales, FAQ visibles, JSON-LD et `llms.txt`
donnent des réponses compatibles. Pas de nouvelle affirmation technique sans
vérification du fonctionnement de l’application.

### 2. Langues, paiement et preuves : un même référentiel

| Point trouvé dans les sources | Action recommandée |
| --- | --- |
| L’accueil décrit quatre langues audio ; la page FR pour les personnes aveugles ou malvoyantes en annonce encore trois | Séparer langues du site, interface, audio généré et enregistrements de démo, puis synchroniser les réponses |
| Certaines anciennes pages présentent le paiement comme anonyme sans distinguer les acteurs | Reprendre la distinction déjà présente sur l’accueil et les pages DE : pas d’identité fournie à Caresse, mais achat via un compte Apple/Google |
| `llms.txt` parle encore de témoignages illustratifs présents sur le site, alors que la consigne du dépôt indique leur retrait | Vérifier les pages restantes puis supprimer la description périmée ; ne conserver que des avis réels vérifiables si de nouveaux avis sont publiés |
| `llms.txt` ne référence pas la future version allemande | Ajouter les URL et la distinction site DE / app non DE dans le même déploiement que la traduction, sans annoncer des URL encore en 404 |
| La FAQ couples évoque des effets « rapportés » sans preuve jointe dans le passage inspecté | Produire une source vérifiable ou reformuler comme une possibilité, sans bénéfice relationnel établi |

La divergence de langues est visible dans
[`for-blind-and-low-vision.fr.json`](../src/content/pages/for-blind-and-low-vision.fr.json)
et [`home.fr.json`](../src/content/pages/home.fr.json). Les points relatifs aux autres
locales demandent un inventaire avant correction ; ils ne sont pas présentés comme
un audit exhaustif déjà réalisé.

**Référentiel éditorial proposé :** une table versionnée qui associe à chaque fait
sa formulation, sa portée (site/app/audio/store), sa source et sa date de vérification.
Les composants et contenus peuvent ensuite réutiliser ces faits. Le choix technique
du format est secondaire ; la première étape est de valider les valeurs.

## P1 — Gagner des citations sur les questions qui peuvent convertir

### Consolider huit pages existantes avant d’en créer d’autres

| Priorité éditoriale | Question à laquelle répondre immédiatement | Preuve utile |
| --- | --- | --- |
| Accueil | Qu’est-ce que Caresse et pour qui ? | Éditeur identifiable, plateformes, distinction site/app |
| Fonctionnement | Que génère réellement l’app et comment ? | Étapes observables, voix synthétique, limites de génération |
| Tarifs | Gratuit, abonnement ou crédits ? | Démos fixes gratuites, génération payante, déblocage distinct ; prix datés ou affichés dans l’app |
| Confidentialité | Que signifie utiliser Caresse anonymement ? | Description exacte des traitements et lien vers la politique |
| Personnalisation | Les noms sont-ils réellement dans l’audio ? | Démo identifiée comme exemple fixe, explication de la génération individuelle |
| Couples / jeu audio | Que fait la voix pendant une session ? | Format concret, choix des participants, aucune promesse thérapeutique |
| Alternatives | Quelle différence entre catalogue, texte, jeu et génération audio ? | Tableau de critères neutres, datés et vérifiables |
| Un comparatif choisi selon les données | Quelle différence avec l’alternative recherchée ? | Vérification récente des informations publiées par l’éditeur comparé, sans liens promotionnels concurrents |

Sur ces pages, tester un court passage de réponse au début, un tableau lorsque la
comparaison l’exige et des titres formulés comme de vraies questions. La longueur
doit suffire à répondre ; aucun nombre de mots n’est présenté comme une règle de
classement. Les faits importants doivent rester dans le texte visible et les
schémas doivent lui correspondre [S4].

Ces formats sont des hypothèses éditoriales à évaluer. Aucune documentation citée
ne promet qu’un tableau ou un paragraphe court fera citer Caresse. Les CTA directs
vers les stores restent prioritaires ; pas de détour imposé par une démo, un
formulaire ou une page de téléchargement.

### Créer des preuves propres à Caresse

Le levier défendable est une information que le site peut prouver : exemples du
format, caractéristiques vérifiées, politique de données claire et retours réels
attribuables lorsque leurs auteurs l’acceptent. Un article reprenant des études
générales sur l’IA ne démontre pas l’efficacité du produit.

Aligner l’identité de l’app, de Studio Mokuton et des fiches stores entre les pages,
profils et données structurées. Rechercher ensuite des tests éditoriaux indépendants
et pertinents : format audio, applications pour couples, confidentialité. C’est une
piste de distribution et de corroboration, pas un gain garanti par un backlink.
Aucune prise de contact ni publication externe n’est effectuée dans cette analyse.

### Traiter l’allemand comme un test d’acquisition

La nouvelle langue permet d’être compris par un public germanophone, mais ne rend
pas l’audio allemand. Il faut mesurer si ces visiteurs acceptent une des langues
disponibles et cliquent vers le store. Une hausse de visites DE avec peu de clics
qualifiés ne justifierait pas automatiquement davantage de pages DE. Les futures
versions linguistiques doivent dépendre de la demande et de l’adéquation au produit.

## P1 — Mesurer séparément visibilité, trafic et conversion

### Ce que le code sait déjà attribuer

[`umami-store-tracking.js`](../public/umami-store-tracking.js) reconnaît les sources
`chatgpt.com` et `openai` lorsqu’elles arrivent en UTM, ainsi que le référent
`chatgpt.com`. Il conserve l’attribution pendant la navigation interne selon sa
définition de visite de 30 minutes. D’autres référents restent enregistrés sous leur
nom de domaine. Les signaux UTM/référent sont déclaratifs, pas une preuve
d’authenticité de l’origine.

Il n’est donc pas nécessaire de recopier des UTM sur tous les liens internes ou
d’ajouter un nouveau système d’identification des visiteurs. En revanche, un
rapport doit regrouper explicitement les domaines de provenance connus, conserver
la valeur brute et garder une catégorie inconnue. Un référent absent ne devient
pas automatiquement une visite IA.

### Tableau de bord recommandé

| Niveau | Indicateur | Source / limite |
| --- | --- | --- |
| Visibilité mesurée | Réponses du panel mentionnant Caresse ; réponses citant une URL Caresse | Résultats du panel, avec moteur, mode de recherche, langue, date et répétition |
| Fidélité | Réponses comportant une erreur produit : langue, gratuité, paiement, confidentialité | Vérification contre le référentiel ; mention exacte distincte de citation |
| Citations observées par Bing | Pages citées, intentions et évolution | AI Performance ; seulement les surfaces et données couvertes par Microsoft [S5–S6] |
| Visites attribuées IA | Visites avec un signal IA observable, par source/page/langue | Umami ; attribution partielle, pas l’ensemble de l’influence IA |
| Sorties qualifiées | Visites attribuées avec au moins un premier clic store, par store/langue | `store_click`, `first_store_click`, définitions de visite à aligner avant calcul |
| Installations | Installations réellement attribuées si la chaîne de mesure le permet | Consoles stores / attribution disponible ; ne pas les déduire du nombre de clics |

**Ratios à suivre :**

- Taux de citation du panel = réponses qui citent Caresse / réponses exploitables.
  Le taux de mention de marque se calcule séparément. Un test non exécuté ou en
  erreur est marqué comme manquant, jamais comme une absence de citation.
- Taux d’erreur produit = réponses sur Caresse comportant au moins une erreur /
  réponses exploitables mentionnant Caresse.
- Taux de sortie store des visites attribuées IA = visites avec au moins un clic
  store / visites attribuées IA, selon une même définition de visite.
  `first_store_click` évite de compter tous les clics répétés comme des conversions,
  mais un rapport doit aussi vérifier sa correspondance avec les visites Umami.

Exclure les scénarios de test du rapport d’acquisition. Ne pas mélanger un compteur
d’événements, un nombre de personnes et une estimation d’installations. Ne pas
collecter les conversations ou préférences intimes pour ce suivi ; les codes de
test du panel ne contiennent pas de données personnelles.

Pour Google, les performances des fonctionnalités IA sont incluses dans le rapport
Web de Search Console ; ce n’est pas une ventilation propre de tout le trafic
génératif [S4]. Aucun export de ces outils n’a été obtenu pour l’analyse présente.

## Panel reproductible, sans résultat inventé

[Le panel CSV](geo/panel-questions.csv) contient 24 questions FR/EN/DE : découverte
sans mention de marque, comparaison et vérification de faits. Les deux premières
catégories servent à observer la découverte ; les questions sur Caresse servent à
mesurer la fidélité et ne doivent pas gonfler artificiellement le taux de découverte.

Commencer chaque semaine avec le sous-ensemble `hebdomadaire`, sur ChatGPT avec
recherche, Perplexity, Copilot et Gemini avec accès web lorsque disponible. Faire
deux essais indépendants pour observer la variabilité. Si un moteur ou mode n’est
pas accessible, le marquer non testé ; ne pas substituer un résultat d’API différent
sans le signaler. Le panel complet peut être repris mensuellement.

Chaque question est testée dans une nouvelle conversation, dans le même contexte
de langue et de pays, sans ajout de liens Caresse ou de consigne favorisant la
marque. Conserver moteur/version affichée, mode, date, langue, pays, formulation,
mention, citations exactes et erreurs constatées. Une répétition ne transforme pas
un moteur en classement stable. Le fichier
[modèle de résultats](geo/resultats-modele.csv) est volontairement vide.

## Plan d’exécution sur 30 jours

Les horizons ci-dessous servent à organiser le travail ; ce ne sont pas des
prévisions de délai d’indexation ou de gain de trafic.

| Fenêtre | Travail prioritaire | Livrable / critère de fin |
| --- | --- | --- |
| Jours 1–3 | Corriger confidentialité, langues, paiement et références périmées dans toutes les versions concernées | Inventaire des divergences, faits validés et contenus concordants ; `llms.txt` allemand aligné sur la publication |
| Semaine 1 | Établir les données de départ Umami, Search Console, Bing et premier panel | Période de référence documentée, rapports source × page × langue, résultats manquants identifiés |
| Semaine 2 | Améliorer un petit groupe de pages à forte intention et vérifier les comparatifs choisis | Réponses utiles et preuves visibles ; aucun CTA de conversion détourné ; version avant/après conservée |
| Semaine 3 | Produire une preuve produit et préparer une piste de test éditorial indépendant | Démo/fiche factuelle vérifiée et liste de publications pertinentes ; les contacts restent une action distincte |
| Semaine 4 | Rejouer le panel et comparer citations, exactitude, visites et clics stores | Décision documentée : continuer, corriger ou arrêter chaque essai ; pas de gain causal affirmé sans méthode adaptée |

Choisir la taille des lots selon les données et les ressources disponibles. Sur
de petits volumes, présenter les effectifs et l’incertitude plutôt qu’un pourcentage
spectaculaire. Sans export ni panel de départ, les objectifs chiffrés restent à
définir ; aucun objectif de croissance arbitraire n’est fixé ici.

## Ce qui n’est pas prioritaire

- Refaire `robots.txt` comme si les moteurs étaient bloqués, ou autoriser davantage
  d’entraînement dans l’espoir d’acheter une place dans les réponses.
- Ajouter `ai.txt`, `ai-plugin.json`, `llms-full.txt` ou un type de schéma uniquement
  pour obtenir un prétendu label GEO. Google n’exige ni fichier IA ni schéma
  spécifique pour ses fonctionnalités de recherche IA [S4].
- Traduire à grande échelle avant de vérifier l’adéquation entre langue du public
  et langues disponibles dans l’app.
- Actualiser artificiellement les dates ou transformer une synthèse de recherches
  générales en étude propriétaire sur Caresse.
- Optimiser uniquement le nombre de citations, de pages ou de visites. Le résultat
  utile reste une découverte pertinente, une description exacte et un parcours
  direct vers la bonne boutique.

## Statut de cette livraison

**Ajoutés :** analyse, preuves HTTP, panel de questions et modèle de relevé.
**Proposés, non implémentés ici :** corrections éditoriales transversales,
référentiel produit, mise à jour de `llms.txt`, rapports d’audience, modifications
de pages et démarches de distribution. La production n’est pas modifiée par ce
complément documentaire. La PR allemande reste à relire et à fusionner séparément.

## Sources officielles consultées

- **S1 — OpenAI, [Overview of OpenAI Crawlers](https://developers.openai.com/api/docs/bots).**
  Rôles distincts de recherche, entraînement et récupération utilisateur ; accès
  réseau et plages IP publiées.
- **S2 — Perplexity, [Perplexity Crawlers](https://docs.perplexity.ai/docs/resources/perplexity-crawlers).**
  Robot de recherche et conditions d’accès.
- **S3 — Anthropic, [Web crawlers and site-owner controls](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler).**
  Distinction ClaudeBot, Claude-SearchBot et Claude-User.
- **S4 — Google Search Central, [AI features and your website](https://developers.google.com/search/docs/appearance/ai-features).**
  Fondamentaux SEO, contenu visible, contrôles d’accès et mesure dans Search Console.
- **S5 — Microsoft Bing, [AI Performance in Bing Webmaster Tools](https://blogs.bing.com/webmaster/2026/2/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview/), 10 février 2026.**
  Citations et pages citées sur les surfaces prises en charge.
- **S6 — Microsoft Bing, [Intents, Topics, Citation Share, Compare](https://blogs.bing.com/search/2026/6/New-AI-Visibility-Insights-in-Bing-Webmaster-Tools-Intents-Topics-Citation-Share-Compare/), 16 juin 2026.**
  Élargissement des fonctions du rapport, présenté en préversion.

Ces pages documentent les produits de leurs éditeurs. Les priorités proposées pour
Caresse et les formats éditoriaux à tester sont une analyse du dépôt, pas une
garantie de classement ou de revenus émise par ces sources.
