# Analyse GEO de Caresse — révision après correction des pages allemandes

9 novembre 2026. Cette révision remplace le diagnostic initial du même jour, établi
avant la publication et le rétablissement des compositions allemandes.

**Les pages allemandes disposent maintenant de davantage de contenu exploitable
pour une réponse IA : comparaisons complètes, étapes, FAQ et liens contextuels.
L’amélioration est publiée et vérifiable. Un gain de citations ou d’installations
n’est pas encore mesuré. La priorité devient la cohérence des faits entre langues,
la mise à jour de `llms.txt` et la mesure de cette nouvelle version.**

Le GEO désigne ici une découverte pertinente de Caresse, une citation et une
explication fidèle de son offre. L’objectif reste l’installation de l’app, selon
[la règle d’or du dépôt](../SEO-GOLDEN-RULE.md). Une visite ou un clic store ne prouve
pas une installation. La hausse du trafic IA est signalée par le propriétaire ;
aucun export d’audience n’a été consulté pour en établir le volume ou la rentabilité.

## Ce qui a changé dans le diagnostic

| Sujet | État initial | État vérifié après correction | Conséquence pour le GEO |
| --- | --- | --- | --- |
| Publication DE | L’ancien relevé trouvait `/de/` en 404, avant fusion | Les 54 URL allemandes répondent en 200 | La publication n’est plus une tâche à effectuer ; l’indexation reste à vérifier dans les outils des moteurs |
| Sitemap | 196 URL lors du premier relevé | 245 URL, dont 49 allemandes | Les nouvelles destinations sont déclarées ; cela ne prouve pas leur indexation |
| Accueil DE | Composition simplifiée | 9 sections, carrousel, étapes, présentation vidéo, FAQ et maillage rétablis | Le moteur dispose des explications textuelles qui entourent les médias, pas seulement d’un résumé |
| Alternatives DE | Liste de formats et liens, sans matrice complète | Tableau de 16 lignes et 7 colonnes, en-tête inclus ; critères, sources et dates | Les différences entre formats sont explicites et peuvent étayer une comparaison |
| Ensemble DE | Plusieurs compositions propres aux pages n’étaient pas reprises | 20 tableaux, 181 lignes, 589 cellules et 257 entrées de FAQ structurées | Plus de faits contextualisés sont disponibles ; ces volumes ne sont pas des scores GEO |
| Destination iOS | Lien américain conservé dans les pages allemandes | Les 122 liens Caresse App Store du HTML contrôlé utilisent la boutique allemande | Correction du parcours de conversion ; aucun bonus de citation démontré pour ce changement de pays |
| Inventaire IA | `llms.txt` sans allemand | Toujours sans allemand et avec une mention de témoignages périmée | Le contenu principal a évolué, mais cet inventaire reste à synchroniser |

L’ancienne page des alternatives et son absence de tableau ont été recoupées dans
les sources de la première version allemande. Les comptes actuels viennent du HTML
publié. Ils ne constituent pas un avant/après de trafic.

## Périmètre et preuves

Le nouveau [relevé HTTP exhaustif DE](geo/controle-http-apres-correction-de-2026-11-09.csv)
contient 66 réponses : les 54 pages allemandes, 9 pages de référence FR/EN et les
fichiers `robots.txt`, `llms.txt` et sitemap. Toutes répondent en 200. Le
[premier relevé](geo/controle-http-2026-11-09.csv) est conservé comme historique :
son 404 allemand décrit un état antérieur, pas un incident encore présent.

La [synthèse du contrôle](geo/synthese-apres-correction-de-2026-11-09.json) conserve
les totaux et la référence du code. Le nouveau CSV inclut date/heure, destination
finale, en-têtes utiles, empreinte du document et comptes par page.

Sur les 54 pages allemandes :

- le texte et la structure du corps HTML publié correspondent au build corrigé ;
- les 49 pages destinées au sitemap ont un canonical propre, six alternates
  correspondant aux cinq langues et au `x-default`, sans `noindex` ni `nosnippet`
  observé dans leurs directives ;
- les quatre documents légaux restent en `noindex`, et la page de téléchargement
  reste hors sitemap ;
- les 54 URL sont atteignables depuis l’accueil DE en suivant les liens internes
  présents dans les documents allemands récupérés ;
- les tableaux ont les mêmes nombres de lignes que leurs références anglaises ;
- les six `AudioObject` des démos indiquent l’anglais ; les schémas de l’application
  ne déclarent pas l’allemand comme langue disponible ;
- `robots.txt` et `llms.txt` sont identiques à leurs sources actuelles du dépôt.

Méthode : requêtes HTTP avec un user-agent d’audit identifié, extraction du HTML
sans exécution JavaScript, comparaison avec le build et le registre des routes.
Les textes de scripts et styles sont exclus des textes analysés. Les liens vers
les stores n’ont pas été suivis dans ce relevé. Les vérifications navigateur déjà
intégrées au projet couvrent séparément le rendu et les parcours store.

Ce contrôle ne simule pas les IP d’un robot authentique et ne prouve pas son passage.
Il ne mesure ni citations dans les produits IA, ni accessibilité complète, ni
fonctionnement interne de l’app. Aucun journal serveur, export Umami, Search Console,
Bing Webmaster Tools ou console store n’a été exploité. Aucun panel indépendant de
réponses ChatGPT, Claude, Gemini, Copilot ou Perplexity n’a été exécuté.

## Ce que le nouveau format améliore réellement

### Des informations présentes dans le texte

Le retour du carrousel ou d’un style ne constitue pas en soi un levier GEO établi.
L’apport utile est celui des sections restaurées : les quatre étapes expliquent ce
qui est configuré puis généré ; les comparatifs distinguent catalogue, chat, jeu et
audio personnalisé ; les FAQ précisent prix, anonymat et langues.

Ces passages et tableaux existent dans le HTML statique. Leur lecture ne dépend
pas du lancement d’une vidéo ou d’une écoute audio. Les médias servent de preuves
du format, avec une explication textuelle et l’indication de leur langue réelle.

### Des comparaisons plus faciles à justifier

La matrice de `/de/alternativen/` explicite notamment le format, le compte, les noms,
les langues audio et les prix. Le comparatif Dipsea présente aussi son propre
tableau, avec critères et réponses distinctes. Un moteur dispose ainsi de passages
pour répondre à une question précise plutôt que d’inférer les différences depuis
les slogans.

Le contenu comparatif reste toutefois une présentation de l’éditeur Caresse. Il
n’est pas une validation indépendante. Les dates de vérification des offres tierces
restent celles d’août et d’octobre : restaurer leur mise en page ne les actualise pas.
Les sources peuvent être attribuées en texte simple, conformément à la règle du
dépôt, sans liens commerciaux vers les concurrents.

### Un meilleur contexte de langue et d’offre

Les pages, leurs liens et leurs schémas distinguent mieux le site allemand des
langues proposées dans l’app. Cette distinction réduit une ambiguïté importante :
une réponse en allemand peut présenter Caresse, mais ne doit pas le décrire comme
un fournisseur d’audio allemand.

Le nouveau maillage fournit des destinations cohérentes pour approfondir une
question dans la même langue. Canonical et hreflang facilitent l’identification
des versions ; ils ne constituent pas un mécanisme universel de sélection par les IA.

## Les points qui limitent encore la fiabilité des réponses

### P0 — Corriger les contradictions produit entre langues

La correction DE a rétabli les compositions. Elle n’a pas synchronisé toutes les
affirmations des versions historiques. Le nouveau contrôle retrouve en production :

| Point | Observation actuelle | Action prioritaire |
| --- | --- | --- |
| Confidentialité | La page couples FR dit qu’aucune donnée sensible n’est stockée et n’est partagée avec des tiers ; la politique décrit conservation et transmissions pseudonymisées à des services IA/TTS | Faire valider les faits opérationnels, puis harmoniser textes commerciaux, FAQ et schémas dans les cinq langues |
| Paiement | La page FR sur la déficience visuelle parle encore d’anonymat « paiement compris » ; les accueils et pages DE distinguent Caresse du compte Apple/Google | Conserver cette distinction partout, sans promettre un paiement anonyme auprès du store |
| Langues audio | La même page FR n’annonce que FR/EN/ES ; les accueils actuels FR/EN/DE annoncent aussi le portugais | Séparer site, interface, audio généré et démos ; vérifier puis partager les mêmes faits |
| Génération | `llms.txt` emploie « real time », alors que les étapes décrivent une génération à la demande en quelques minutes | Éviter la confusion avec un dialogue vocal interactif ; valider le fonctionnement puis employer une description précise |
| Gratuité et prix | Démo fixe, génération par crédits et déblocage des options sont des notions distinctes | Les conserver ensemble dans les réponses et schémas, avec le marché et la date lorsque des prix sont cités |

Sources publiques rapprochées : [couples FR](https://caresse.app/for-couples/),
[sécurité DE](https://caresse.app/de/datenschutz-und-sicherheit/),
[confidentialité FR](https://caresse.app/legal/fr/privacy/),
[page déficience visuelle FR](https://caresse.app/for-blind-and-low-vision/),
[fonctionnement DE](https://caresse.app/de/so-funktionierts/).
Ces documents établissent une divergence de communication ; ils ne remplacent pas
une vérification technique de la gestion réelle des données par l’app.

Le risque GEO est la coexistence de réponses incompatibles à propos du même produit.
Ajouter des pages ne corrige pas ce problème. Le
[chantier de maintenabilité Astro](ANALYSE-MAINTENABILITE-ASTRO-2026-11-09.md) propose
justement un référentiel partagé pour éviter les nouvelles copies de ces faits.

### P0 — Synchroniser `llms.txt` avec l’offre publiée

Le fichier public ne référence toujours aucune URL allemande. Il décrit également
des citations de témoignages illustratifs que la consigne éditoriale indique avoir
retirées. Mettre à jour ces éléments devient une action immédiate possible : les
URL DE ne sont plus en 404.

La mise à jour recommandée doit comporter l’accueil DE et les pages clés, expliciter
site DE / app non DE / démos anglaises, conserver les distinctions gratuité-crédits
et éviter une description ambiguë de la génération. Elle doit reprendre le
référentiel validé, sans créer une seconde version indépendante des faits.

Ce fichier est un inventaire supplémentaire. Sa cohérence est utile ; sa seule
présence ne prouve pas qu’un moteur le consomme et n’est pas une garantie de citation.
Le contenu visible et l’accès aux pages restent prioritaires.

### P1 — Relecture, fraîcheur et correspondance des FAQ

Sur 257 entrées FAQ structurées allemandes, 256 questions/réponses sont retrouvées
textuellement dans le corps HTML après normalisation. Une réponse de la
[page Noël](https://caresse.app/de/weihnachten-zu-zweit/) est formulée différemment
entre JSON-LD et contenu : les deux évoquent une démo gratuite et une génération
personnalisée payante. Ce n’est pas une contradiction produit identifiée ni une
preuve de schéma invalide ; c’est un point de dérive à supprimer en générant les
deux rendus depuis la même réponse.

Une relecture de l’allemand reste utile : la page de sécurité contient par exemple
la formulation incorrecte « Nein direkt identifizierende Daten ». Les contrôles de
structure ne certifient pas la qualité de la traduction. Corriger ces formulations
et vérifier les faits comparatifs avant d’amplifier leur diffusion.

## L’allemand : viser une audience compatible avec l’app

Le segment à tester est un lectorat germanophone acceptant l’une des langues audio
proposées : découverte de l’audio personnalisé, fonctionnement sans abonnement,
différences avec un catalogue et explication des traitements de données.

Une requête exigeant des enregistrements allemands ne correspond actuellement pas
à l’offre Caresse. Obtenir une citation trompeuse sur cette requête serait un échec
de fidélité, même si elle apportait des clics. Les pages doivent permettre de faire
ce choix avant le clic store. Le changement de boutique ne traduit pas l’application.

Le panel DE distingue donc désormais découverte compatible, vérification de marque
et contrôle négatif « audio en allemand ». Il reste possible qu’un moteur explique
correctement pourquoi Caresse ne répond pas à ce dernier besoin ; une absence de
recommandation est acceptable et ne doit pas être comptée comme une citation manquée.

## Publication, récupération et citations : trois états distincts

Un contrôle de recherche ponctuel `site:caresse.app/de/` n’a retourné aucune URL DE
dans les résultats fournis par l’outil de recherche de l’audit, alors que le relevé
HTTP les trouve en 200. Ce résultat **ne démontre pas une absence d’indexation** :
un opérateur de recherche n’est pas un inventaire exhaustif et l’outil peut fournir
des résultats de repli.

Autre observation : un résultat anglais fourni par cet outil affiche encore une
FAQ ne listant que trois langues ; le HTML anglais récupéré directement en annonce
quatre. C’est un écart observé de récupération, pas une preuve qu’une réponse de
ChatGPT ou de Google reproduit cette erreur. Les observations sont consignées
[séparément du panel IA](geo/observations-recherche-2026-11-09.csv).

Prochaine vérification : inspection d’un petit groupe d’URL DE dans Search Console
et Bing Webmaster Tools, lecture du canonical retenu, dernière exploration et
indexation ; soumission du sitemap actualisé si nécessaire. Aucune soumission à un
moteur n’est effectuée par cet audit. Ensuite seulement, observer les citations et
les visites. La publication réussie ne permet pas de sauter ces étapes de mesure.

## Ce que documentent actuellement les moteurs

Les sources officielles S1–S6 ont été revérifiées pour cette révision.

| Surface | Contrôle et lecture utile |
| --- | --- |
| ChatGPT Search | `OAI-SearchBot` concerne la recherche ; `GPTBot` l’entraînement ; `ChatGPT-User` certaines récupérations utilisateur. L’autorisation de recherche et les IP admises sont les contrôles utiles [S1] |
| Perplexity | `PerplexityBot` sert à la découverte pour la recherche ; `Perplexity-User` aux requêtes déclenchées par l’utilisateur [S2] |
| Claude | `Claude-SearchBot`, `Claude-User` et `ClaudeBot` ont des rôles distincts de recherche, récupération et entraînement [S3] |
| Google AI Overviews / AI Mode | Fondamentaux SEO, indexation et extrait autorisé ; aucun fichier IA ni schéma spécial n’est exigé [S4] |
| Bing / Copilot et intégrations couvertes | AI Performance peut renseigner les citations, pages et intentions, avec les limites des surfaces et préversions couvertes [S5–S6] |

Le `robots.txt` actuel autorise explicitement plusieurs de ces robots et comprend
une règle générale permissive. Les robots Claude de recherche/récupération non
nommés restent couverts par cette règle. Ajouter leur nom ne débloquerait donc pas
un accès actuellement interdit dans ce fichier. Les contrôles réseau effectifs
restent à vérifier avec les journaux ou outils des moteurs.

Modifier la politique d’entraînement n’est pas une condition générale de citation.
Ajouter des fichiers ou schémas « GEO » ne remplace pas le travail sur les faits et
la mesure. Les présentations recommandées ici sont des hypothèses d’amélioration
de la clarté, sans promesse de classement.

## Mesurer le résultat de la nouvelle version

### Suivi du parcours

Le code [Umami store tracking](../public/umami-store-tracking.js) conserve une source,
la langue, la page d’entrée et le store ; il reconnaît notamment des signaux
ChatGPT/OpenAI en UTM ou référent. Les autres domaines doivent être regroupés dans
les rapports en conservant leur valeur brute. Une visite sans référent identifiable
ne doit pas être reclassée automatiquement en trafic IA.

Comparer les mêmes périodes et segments : source × langue × page d’entrée, visites,
premiers clics store et destination. Les sessions DE doivent être séparées des FR/EN.
Une citation peut ne produire aucun clic ; un clic peut ne produire aucune
installation. Les installs ne sont mesurables qu’avec les données d’attribution
réellement disponibles dans les stores. Aucun taux de conversion n’est calculé ici.

Les fonctionnalités IA de Google sont agrégées dans le rapport Web de Search Console ;
ce n’est pas une ventilation exhaustive du trafic génératif [S4]. Utiliser le rapport
Bing sur les surfaces qu’il couvre, sans l’extrapoler aux autres moteurs.

### Panel et critères de réussite

Le [panel](geo/panel-questions.csv) conserve ses 24 questions FR/EN/DE. La colonne
`eligibilite_caresse` sépare les 17 intentions compatibles, les 6 vérifications de
marque et le contrôle négatif DE02. Les questions de marque ne servent pas à prouver
la découverte spontanée ; le contrôle négatif n’entre pas dans le dénominateur d’un
taux de découverte de l’offre compatible.

Sur le sous-ensemble hebdomadaire, exécuter deux essais indépendants par moteur et
mode de recherche disponible, dans de nouvelles conversations sans contexte Caresse
préalable. Conserver date, pays, langue, version affichée, mode, question, mention,
URL citée et erreur éventuelle dans le [modèle de relevé](geo/resultats-modele.csv).
Le fichier de résultats reste vide : les contrôles HTTP et recherches ponctuelles
ne sont pas des réponses mesurées de ces produits IA.

Indicateurs : taux de citation et de mention sur les questions compatibles ; taux
d’erreur produit parmi les réponses sur Caresse ; respect du contrôle négatif ;
visites attribuées IA avec premier clic store. Un test non exécuté reste manquant,
pas une absence de citation. Conserver les effectifs et ne pas confondre événements,
visites et installations.

Si la version du modèle, le moteur ou son mode de recherche change, noter le
changement et séparer les séries : une meilleure réponse avec un autre modèle ne
permet pas d’attribuer l’amélioration aux pages DE. Les corrections de structure,
de contenu, de publication et de destination store ayant eu lieu ensemble, leur
effet individuel n’est pas isolé par un simple avant/après.

## Plan d’action révisé

| Ordre | Travail | Critère de fin |
| --- | --- | --- |
| 1 — Cohérence | Valider et aligner confidentialité, anonymat du paiement, langues et génération dans toutes les versions concernées | Réponses compatibles dans contenu visible, FAQ, schémas et référentiel partagé |
| 2 — Inventaire | Actualiser `llms.txt` avec les pages DE publiées et retirer les descriptions périmées | Inventaire conforme aux pages et à l’offre réelle |
| 3 — Découverte | Inspecter les URL DE et le sitemap dans les outils des moteurs ; établir les données de départ | État d’exploration/indexation documenté et période d’audience identifiée |
| 4 — Qualité ciblée | Relire les pages prioritaires DE, aligner la FAQ Noël et revérifier les comparatifs choisis | Textes naturels, faits sourcés et datés, mêmes réponses entre HTML et schémas |
| 5 — Mesure | Rejouer le panel puis rapprocher citations, visites et premiers clics store | Résultats par moteur/langue, erreurs et données manquantes explicites |
| 6 — Amélioration | Décider des prochains essais éditoriaux et de la centralisation Astro à partir des résultats | Une modification isolée à la fois, sans changer les CTA ni retirer du contenu utile |

Il n’est plus prioritaire de « créer les tableaux allemands » ou de « publier `/de/` » :
c’est réalisé. Il n’est pas justifié d’ouvrir d’autres langues uniquement parce que
le site en supporte une de plus. Le prochain gain défendable vient d’informations
cohérentes, de preuves produit compréhensibles et d’une distribution mesurable.
Aucun objectif chiffré de croissance ni score GEO arbitraire n’est attribué au site.

## Statut de cette révision

Mis à jour : diagnostic, relevé HTTP des 54 pages DE, synthèse chiffrée, observations
de recherche et éligibilité du panel. Cette livraison est documentaire : elle ne
modifie ni pages, ni configuration des robots, ni `llms.txt`, ni application.
Les actions proposées restent à mettre en œuvre. Aucun message externe, demande
d’indexation ou événement analytics de production n’est envoyé par ces contrôles.

L’[audit d’août](../SEO-GEO-AUDIT-2026-08-08.md) et le premier relevé du 9 novembre
restent des références historiques ; leurs états techniques ne sont pas repris
comme des problèmes actuels lorsqu’ils ont été corrigés.

## Sources officielles revérifiées

- **S1 — OpenAI, [Overview of OpenAI Crawlers](https://developers.openai.com/api/docs/bots).**
  Séparation recherche/entraînement/récupération et accès documentés.
- **S2 — Perplexity, [Perplexity Crawlers](https://docs.perplexity.ai/docs/resources/perplexity-crawlers).**
  Robots de recherche et récupérations utilisateur.
- **S3 — Anthropic, [Web crawlers and site-owner controls](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler).**
  Rôles des robots et contrôles applicables.
- **S4 — Google Search Central, [AI features and your website](https://developers.google.com/search/docs/appearance/ai-features).**
  Conditions de présence, contenu textuel, mesure et absence de format IA spécial requis.
- **S5 — Microsoft Bing, [AI Performance in Bing Webmaster Tools](https://blogs.bing.com/webmaster/2026/2/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview/), 10 février 2026.**
  Mesure des citations sur les surfaces couvertes.
- **S6 — Microsoft Bing, [Intents, Topics, Citation Share, Compare](https://blogs.bing.com/search/2026/6/New-AI-Visibility-Insights-in-Bing-Webmaster-Tools-Intents-Topics-Citation-Share-Compare/), 16 juin 2026.**
  Fonctions supplémentaires présentées en préversion.
