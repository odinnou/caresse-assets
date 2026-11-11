# GEO : mise en œuvre et point de départ du 10 novembre 2026

> Branche de référence pour l’analyse et l’outillage, à conserver hors de `main_v2`.
> Les améliorations du site sont proposées séparément dans la PR #101.
> Les descriptions d’implémentation ci-dessous documentent ce travail ; le code
> de production correspondant appartient à cette autre branche. Pour de futurs
> travaux SEO/GEO, consulter cette analyse uniquement sur demande explicite du propriétaire.

L’objectif est d’être découvert sur des demandes compatibles avec Caresse, décrit
fidèlement, puis de conduire au store. Les améliorations sont préparées dans le
dépôt ; elles ne sont pas encore déployées. Aucun gain de citation, de trafic ou
d’installation n’est annoncé sans mesure.

## Ce que ce lot apporte

1. **Une réponse plus précise dès l’entrée.** L’introduction des cinq pages
   « couples » et des cinq pages « jeu pour couple » explique le format, les noms/pseudonymes, la voix synthétique,
   les démos gratuites et les crédits sans abonnement. Le lecteur comprend
   l’offre avant son clic. Les CTA, liens et compositions sont conservés.
2. **Un comparatif dont les sources sont datées.** Les notes de tarifs Dipsea ont
   été revérifiées auprès du centre d’aide officiel. Les prix USD sont identifiés
   comme tels ; les repères historiques EUR ne deviennent pas des prix actuels.
   Les pages n’ajoutent aucun lien commercial vers un concurrent.
3. **Des clics IA identifiables.** Le suivi distingue les signaux ChatGPT,
   Perplexity, Claude, Gemini et Copilot, conserve les sources et ne transforme
   pas le trafic Google/Bing général en trafic IA.
4. **Une mesure reproductible.** Panel de 40 questions dans cinq langues,
   préparation de deux essais indépendants, rapports de citations et de clics,
   contrôle public HTTP reproductible. Les données manquantes restent explicites.

Mode d’emploi : [suivi GEO](geo/README.md). Faits de référence :
[offre et confidentialité](GEO-PRODUCT-FACTS.md).

## Observations effectuées

- **48 requêtes HTTP réussies** : 45 pages prioritaires et robots/sitemap/llms.
  Les 45 pages ont leur canonical attendu et sont dans le sitemap. Les règles
  robots analysées autorisent les robots de recherche contrôlés.
- Le contrôle utilise un user-agent d’audit déclaré. Il ne prouve ni un passage
  des robots authentiques, ni l’indexation, ni une citation. Les fichiers publiés
  diffèrent en partie du build local, ce qui est attendu avant publication.
- Les recherches ponctuelles retrouvent des pages Caresse FR/EN/PT dans le lot
  retourné. L’outil regroupe les résultats : aucun rang individuel ni taux de
  présence par question n’en est déduit.
- Les extraits récupérés contiennent encore des formulations de l’ancienne
  version. La nouvelle rédaction locale ne peut pas améliorer les réponses
  publiques avant sa publication et sa récupération par les moteurs.

Preuves : [relevé HTTP](geo/controle-http-2026-11-10.csv) et
[observations de recherche](geo/observations-recherche-2026-11-10.csv).
Ces observations ne remplissent pas le fichier de résultats du panel IA.

## Exploiter les comptes existants

Le propriétaire confirme Search Console et Umami. Bing Webmaster Tools n’est
pas configuré à ce stade. Un export Umami a ensuite été fourni et analysé le
11 novembre ; il ne s’agit pas d’une connexion permanente au compte Umami.
OpenSEO est désormais connecté et le projet Caresse a été créé gratuitement.
Son contexte reprend les faits confirmés par le propriétaire. Le compte Google a
été relié pendant le travail : après une première réponse `not_connected`, la
propriété Search Console devient accessible. Les pages, requêtes et dix inspections
d’URL ont été consultées sans crédits. Les réponses et l’analyse sont conservées
localement dans `artifacts/geo/openseo/`, ignoré par Git et absent du site publié.
Le suivi de visibilité IA n’est pas configuré et aucun contrôle payant n’a été lancé.

La lecture Search Console change l’ordre des prochains essais : privilégier le jeu
pour couple, qui apporte déjà des clics, puis les intentions d’alternative adaptées.
Les impressions sur des requêtes de navigation concurrentes comme « login » ne
deviennent pas automatiquement des opportunités. L’accueil allemand est indexé ;
Google ne connaît pas encore le comparatif allemand Dipsea au moment du contrôle.
L’indexation reste à suivre après publication. Ce sont des données Google Web,
distinctes d’un relevé de citations dans les produits IA.

### Complément après réception de l’export Umami, 11 novembre

L’archive native contient les événements de pages et les propriétés des clics.
L’analyse rapproche les tables par identifiant d’événement, supprime un doublon
identique et exclut les tests. Les anciennes générations du suivi sont séparées
des clics portant la définition explicite des destinations Caresse. Les sources
inconnues ne sont pas reclassées automatiquement en IA.

Les rapports privés sont conservés dans `artifacts/geo/umami/`, avec les agrégats,
la méthode et l’empreinte de l’archive. Une période commune est calculée selon les
jours Search Console, en explicitant le fuseau. Les versions de contexte navigateur
restent identifiées : pas de taux de conversion calculé en divisant des unités
incompatibles, et aucune installation déduite des clics.

L’export confirme que ChatGPT apporte déjà des clics store, surtout depuis les
accueils et démos. Pour le GEO, ces entrées sont donc prioritaires à préserver et
améliorer. Cette lecture complète la priorité « jeu pour couple » observée dans
Google ; elle ne confond pas les deux canaux. Les réponses IA précises à l’origine
de ces visites restent à relever séparément.

Après publication :

1. Inspecter les URL prioritaires dans Search Console et conserver canonical
   retenu, dernier passage et indexation. Vérifier le sitemap déclaré.
2. Relever visites et premiers clics store dans Umami, avec les mêmes périodes
   et filtres ; exclure les tests. Les nouvelles propriétés ne réparent pas
   rétroactivement les événements historiques.
3. Jouer le panel dans les produits IA disponibles, dans des conversations
   neuves. Sauvegarder chaque réponse/capture avec sa version et son mode.
4. Ajouter Bing, vérifier la propriété et soumettre le sitemap. La procédure
   préparée n’est pas une soumission réalisée.
5. Comparer ensuite les mêmes questions, marchés et modes. Séparer les moteurs,
   versions et pays ; annoter campagnes et changements saisonniers. Un simple
   avant/après ne permet pas d’isoler toutes les causes.

La priorité d’amélioration se décide alors à partir de la chaîne observée :
absence de récupération, citation erronée, page peu adaptée, ou clic store absent.
Une hausse de citations accompagnée d’informations produit fausses est un échec.

## Distribution et preuves indépendantes : éléments prêts à utiliser

Les pages Caresse sont une source de l’éditeur. Les moteurs peuvent aussi trouver
des descriptions dans les fiches stores et des retours indépendants. Préparer des
présentations cohérentes, proposer un accès au produit pour un essai libre et
demander une description factuelle, sans imposer un avis favorable ni une citation.
Le consentement, les données, les langues et le paiement doivent garder les mêmes
limites dans les descriptions extérieures.

Pour un dossier de présentation, utiliser les captures existantes, une démo fixe
clairement étiquetée et le fonctionnement à la demande. Déclarer la langue réelle
des médias : les pages portugaises et allemandes utilisent les démos anglaises.
Ne pas inventer de témoignages, tests, notes, effets thérapeutiques ou gains chiffrés.

Brouillons de description, non envoyés et non publiés :

**FR** — Caresse est une application de fictions audio intimes pour adultes, en solo
ou à deux. Elle génère une session selon les noms ou pseudonymes, préférences et
limites choisis, racontée par une voix synthétique. Les démos sont gratuites ; les
sessions personnalisées utilisent des crédits payants, sans abonnement.

**EN** — Caresse creates guided intimate audio fiction for adults, solo or together.
Names or aliases, preferences and boundaries shape a session narrated by a synthetic
voice. Fixed demos are free; personalized generation uses paid credits without a
subscription. It is a wellbeing experience, not a medical or therapeutic service.

**PT** — O Caresse cria ficções íntimas em áudio para adultos, individualmente ou a
dois, com voz sintética e preferências escolhidas no app. Demos grátis; geração com
créditos pagos, sem assinatura. O app está totalmente em português no Android;
a próxima atualização iOS está em validação. As demos do site nesta versão são em inglês.

Aucun média, forum, annuaire ou utilisateur n’a été contacté. Les fiches stores
n’ont pas été modifiées dans ce lot.

## Sources primaires consultées

- Google Search Central, [AI features and your website](https://developers.google.com/search/docs/appearance/ai-features) :
  accès, indexation, contenu textuel, cohérence des données structurées ; absence
  d’exigence d’un fichier ou schéma spécial pour les fonctionnalités IA.
- Google Search Central, [Optimizing your website for generative AI features](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) :
  contenu utile et spécifique au produit, organisation compréhensible, structure
  technique et preuve de première main. Ce guide ne garantit pas un classement.
- OpenAI, [Overview of OpenAI Crawlers](https://developers.openai.com/api/docs/bots) :
  rôles distincts de recherche, récupération utilisateur et entraînement.
- Dipsea, [centre d’aide sur les tarifs](https://support.dipseastories.com/en/articles/5433822-how-much-does-a-subscription-to-dipsea-cost) :
  source de la vérification USD et des conditions d’essai. Les offres en euros
  ne sont pas déduites de cette source.

Les anciens audits restent des relevés datés. Leurs observations ne deviennent
pas automatiquement des défauts actuels après correction.
