# Analyse SEO de Caresse — 3 octobre 2026

La visibilité et les clics Google progressent fortement. Les comparatifs et les pages « jeux pour couples » sont les moteurs observés. La priorité est de développer ces intentions déjà productives et d'améliorer le passage vers les stores sur Melt EN. ChatGPT constitue aussi un canal d'acquisition significatif. Le blog ne produit presque aucun clic Google sur la période.

## Sources et méthode

- Search Console : `caresse.app-Performance-on-Search-2026-10-03.xlsx`, onglets Graphique, Requêtes, Pages, Pays, Appareils et Filtres. Recherche Web, dates réellement présentes : 30 juin–29 septembre 2026, soit 92 jours.
- Umami : archive `9d575706-2bdb-4826-9b77-f924898d759f.zip`, avec `website_event.csv`, `event_data.csv` et `session_data.csv`. Événements du 5 septembre à 10:32:53 au 3 octobre à 08:54:34. Les jours aux extrémités sont incomplets. Le fuseau des horodatages n'est pas explicité dans les CSV.
- Contrôle limité des contenus actuels de Melt EN et Couples game EN sur le site public, ainsi que des métadonnées locales de ces pages et de Dipsea ES. Lecture du script local de suivi des clics. Aucun changement du site effectué.

Les totaux du site viennent de l'onglet Graphique. Les comparaisons de tendance utilisent deux périodes consécutives de 28 jours. CTR = clics / impressions. Positions agrégées recalculées en pondérant les positions exportées par les impressions, donc approximatives à cause des arrondis de l'export.

Pour Umami, une visite est un `visit_id` distinct. Sa page d'entrée est la première page vue enregistrée pour ce visit_id. Un succès est une visite avec au moins un événement `store_click`, sur n'importe quelle page de cette visite. Cela mesure un clic vers un store, pas une installation. Source attribuée à la première page vue : priorité aux UTM ChatGPT/OpenAI ou au référent ChatGPT, puis aux référents Google, puis aux autres UTM/référents. L'absence de source est classée « direct ou inconnu ».

## 1. Une croissance qui combine visibilité et efficacité

| Indicateur | 5 août–1er septembre | 2–29 septembre | Évolution |
| --- | ---: | ---: | ---: |
| Clics Google | 140 | 395 | +182,1 % |
| Impressions | 3 011 | 7 225 | +140,0 % |
| CTR | 4,65 % | 5,47 % | +0,82 point |
| Position moyenne approximative | 8,26 | 6,14 | Gain de 2,12 positions |

Le site apparaît plus souvent et obtient davantage de clics par impression. La meilleure position moyenne accompagne cette progression, mais elle peut aussi refléter un changement du mélange de requêtes et de pays. Ce n'est pas une preuve que chaque mot-clé a gagné deux positions.

Sur l'ensemble de l'export : **576 clics, 11 590 impressions, CTR 4,97 %, position moyenne approximative 7,08**.

| Mois | Clics | Impressions | CTR | Position approximative |
| --- | ---: | ---: | ---: | ---: |
| Juillet | 36 | 1 001 | 3,60 % | 9,79 |
| Août | 141 | 3 189 | 4,42 % | 8,33 |
| Septembre, du 1er au 29 | 399 | 7 391 | 5,40 % | 6,18 |

L'accélération continue dans septembre : 131 clics du 2 au 15, puis 264 du 16 au 29. Sur ces deux périodes de 14 jours, les impressions augmentent de 37,9 % et le CTR passe de 4,31 % à 6,30 %. Il n'y a pas de signal global de décrochage dans ces données.

Les exports ne permettent pas d'attribuer cette croissance à une modification précise. Plusieurs variantes de CTA coexistent sans dispositif expérimental documenté. L'historique local signale aussi une correction de bouton Play Store le 2 octobre : l'export Search Console s'arrête avant cette correction, et Umami ne dispose que d'un recul très court après celle-ci.

## 2. Les pages qui méritent le plus d'attention

Les quatre colonnes Google portent sur le 30 juin–29 septembre. Les trois colonnes Umami portent sur le 5 septembre–3 octobre. Elles décrivent des périodes différentes : elles ne constituent pas un entonnoir individuel Google → store.

| Page d'entrée | Clics Google | Impressions | CTR Google | Position | Visites Umami | Visites avec clic store | Taux visite → clic store |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `/en/vs-melt/` | 87 | 4 043 | 2,15 % | 6,77 | 86 | 14 | 16,3 % |
| `/` | 72 | 708 | 10,17 % | 5,63 | 123 | 32 | 26,0 % |
| `/en/couples-game/` | 68 | 462 | 14,72 % | 5,09 | 88 | 21 | 23,9 % |
| `/en/` | 55 | 2 374 | 2,32 % | 6,91 | 84 | 23 | 27,4 % |
| `/alternatives/` | 40 | 274 | 14,60 % | 5,49 | 23 | 9 | 39,1 % |
| `/couples-game/` | 37 | 326 | 11,35 % | 6,82 | 35 | 9 | 25,7 % |
| `/en/vs-dipsea/` | 36 | 924 | 3,90 % | 6,79 | 53 | 14 | 26,4 % |
| `/en/vs-magicwave/` | 26 | 153 | 16,99 % | 4,25 | 20 | 4 | 20,0 % |
| `/es/` | 22 | 311 | 7,07 % | 4,76 | 40 | 18 | 45,0 % |
| `/vs-melt/` | 20 | 261 | 7,66 % | 5,32 | 27 | 10 | 37,0 % |
| `/es/vs-dipsea/` | 16 | 115 | 13,91 % | 5,68 | 37 | 9 | 24,3 % |

### Melt EN : le plus grand réservoir de visibilité, avec deux points à améliorer

La page possède 4 043 impressions, bien davantage que les autres pages. Pourtant, son CTR Google est de 2,15 % et seulement 14 de ses 86 visites d'entrée ont un clic store. Sur les visites attribuées à Google uniquement, le résultat reste modeste : 11 / 65, soit 16,9 %. Ce n'est donc pas uniquement un effet de trafic direct.

La requête `melt stories` produit 2 510 impressions et 44 clics, à une position de 6,94. Une partie de cette audience cherche probablement Melt lui-même. **Hypothèse : le décalage d'intention explique une partie du faible CTR et du taux de passage au store.** L'export ne permet pas de le démontrer visite par visite.

La page actuelle dit déjà clairement qu'il s'agit d'une alternative audio, avec des démos gratuites, sans compte et sans abonnement. Ces arguments sont présents. Il faut tester leur efficacité et leur mise en évidence, plutôt que recommander de les ajouter comme s'ils manquaient. [Contenu actuel de Melt EN](https://caresse.app/en/vs-melt/).

Actions proposées : exporter les requêtes filtrées sur cette URL ; distinguer les recherches de navigation vers Melt des recherches d'alternatives ; tester une seule modification du titre ou du premier écran à la fois ; rendre perceptible immédiatement le bénéfice « audio personnalisé » et ce qui est gratuit. Garder un accès direct au téléchargement et une preuve audio facultative. Évaluer les visites Google avec clic store, en plus du CTR.

### Couples game : une intention déjà productive

Les trois versions `/couples-game/` cumulent **116 clics pour 909 impressions**, soit un CTR de 12,76 %. La version anglaise combine 68 clics Google et 21 visites d'entrée avec clic store dans Umami. Pour ses visites attribuées à Google, 17 / 71 ont un clic store, soit 23,9 %.

Les requêtes visibles `ai couple game` et `couples game ai drama` confirment une correspondance avec l'offre, même si leurs volumes restent faibles. Priorité : renforcer cette page et ses liens internes depuis des contenus réellement liés au jeu intime à deux. Développer quelques réponses spécifiques aux attentes des visiteurs, sans multiplier des pages presque identiques.

La page actuelle propose déjà une explication du fonctionnement et une démo. Ne pas attribuer la performance à l'une de ces composantes sans test. [Contenu actuel de Couples game EN](https://caresse.app/en/couples-game/).

### Dipsea et l'espagnol : des pistes à développer progressivement

`dipsea en español` apporte 11 clics / 114 impressions. Dipsea ES affiche un CTR de 13,91 % et 9 visites d'entrée avec clic store sur 37. L'accueil espagnol atteint 18 / 40, soit 45 %. Les volumes sont encore limités, mais justifient un effort ciblé sur l'espagnol et la disponibilité des démos, avec une distinction claire entre gratuité d'essai et sessions payantes.

Dipsea EN est aussi prioritaire : 924 impressions, position 6,79 et CTR 3,90 %, avec un taux visite → clic store de 26,4 %. Les termes « alternative », « apps like Dipsea » et les questions sur le prix sont des angles présents dans les requêtes. Les données ne fournissent cependant pas de correspondance requête × page : vérifier cette association par un export filtré avant toute réécriture.

### Le blog : résultat organique très limité à ce stade

Toutes les URL contenant `/blog/` cumulent **201 impressions et un seul clic Google**. Rien dans cet export ne justifie un calendrier massif d'articles généralistes. Garder un petit nombre de contenus répondant à des questions précises et alimentant les pages d'acquisition. L'export ne permet pas de conclure sur leur contribution indirecte aux recommandations d'IA, ni sur leur ancienneté ou leur indexation complète.

## 3. Google et ChatGPT produisent des visites avec clic store

Après retrait analytique d'une ligne dupliquée par `event_id` : **1 326 pages vues, 819 visites, 238 événements store_click et 209 visites avec au moins un clic store**. Taux global : **25,5 %**. Les 750 `session_id` distincts ne doivent pas être assimilés à 750 personnes uniques, notamment parce que la période traverse deux mois.

| Canal attribué à l'entrée | Visites | Part des visites | Visites avec clic store | Taux |
| --- | ---: | ---: | ---: | ---: |
| Google | 382 | 46,6 % | 99 | 25,9 % |
| ChatGPT/OpenAI | 169 | 20,6 % | 69 | 40,8 % |
| Direct ou inconnu | 248 | 30,3 % | 39 | 15,7 % |
| Autres sources | 20 | 2,4 % | 2 | 10,0 % |

ChatGPT représente 33,0 % des visites avec clic store. Son taux observé est environ 1,58 fois celui de Google. Cela signale une audience susceptible d'essayer l'application, mais ne prouve pas que ChatGPT apporte de meilleurs acheteurs : les pages d'entrée, pays et intentions diffèrent, et aucun achat n'est enregistré.

Conserver une présentation factuelle et explicite du produit : audio personnalisé, langues, gratuité des démos, compte, modèle tarifaire et différence avec les concurrents. Mesurer séparément Google et ChatGPT. Les recommandations par IA ne nécessitent pas de balisage spécial selon Google. [Documentation Google sur les fonctionnalités IA](https://developers.google.com/search/docs/appearance/ai-features).

### Comparaison sur des dates communes

Du **6 au 29 septembre**, pour éviter les journées Umami partielles et rester dans l'export Google : Search Console compte **357 clics**, contre **319 visites attribuées à Google** dans Umami. Parmi celles-ci, **82** ont un clic store, soit **25,7 %**.

L'écart de 38, soit 10,6 % des clics Search Console, ne constitue pas un taux de perte mesurable. Un clic Google et une visite Umami sont des unités différentes ; le fuseau, les référents absents et le déclenchement du suivi peuvent aussi créer des écarts. Il faut conserver ces deux métriques séparément.

## 4. Mobile et marchés

**84,5 % des clics Google viennent du mobile** : 487 / 576. CTR mobile 5,74 %, contre 2,73 % sur ordinateur. Le mobile bénéficie aussi d'une meilleure position moyenne : 5,94 contre 10,44. Il serait donc incorrect d'expliquer tout l'écart de CTR par le design ou le titre.

Dans Umami, les mobiles représentent 642 / 819 visites, soit 78,4 %. Parmi ces visites, 174 ont un clic store, soit 27,1 %. Les liens vers le store adapté au terminal et le premier écran mobile doivent rester prioritaires.

172 événements pointent vers l'App Store et 66 vers Google Play. Ce sont des clics, pas des installations, et la répartition peut être affectée par les boutons disponibles et leur routage historique.

| Pays | Clics Google | Impressions Google | CTR Google | Visites Umami, toutes sources | Visites avec clic store |
| --- | ---: | ---: | ---: | ---: | ---: |
| France | 165 | 1 503 | 10,98 % | 166 | 51 (30,7 %) |
| États-Unis | 90 | 4 203 | 2,14 % | 191 | 26 (13,6 %) |
| Canada | 32 | 568 | 5,63 % | 55 | 14 (25,5 %) |
| Inde | 31 | 411 | 7,54 % | 33 | 2 (6,1 %) |
| Mexique | 29 | 276 | 10,51 % | 56 | 23 (41,1 %) |
| Espagne | 24 | 425 | 5,65 % | 34 | 10 (29,4 %) |

Les périodes des deux sources diffèrent et les visites Umami incluent tous les canaux. Les États-Unis combinent une forte visibilité et un passage au store relativement faible. Les recherches de concurrents et les besoins de lecture plutôt que d'audio sont des hypothèses à examiner, pas des causes établies. La France et le Mexique justifient de préserver et développer leurs parcours. Ne pas choisir de nouvelles traductions uniquement à partir des impressions internationales.

## 5. Ce qui fonctionne dans les CTA, et ce qui reste inconnu

159 / 238 clics store viennent du hero, soit **66,8 %**, et 49 du bouton sticky, soit **20,6 %**. Les deux emplacements produisent ensemble 87,4 % des événements. La médiane de `elapsed_ms` est de 14,1 secondes, mais cette durée suit la session du script local, qui n'est pas strictement la visite Umami.

Maintenir des CTA directs dans ces emplacements est cohérent avec le comportement observé. La répartition des clics ne mesure pas leur efficacité comparative : les exports ne comptent pas les affichages de chaque CTA et les groupes ne sont pas randomisés. Les deux clics `post_listen` ne suffisent pas à conclure que les démos nuisent à la conversion.

## 6. Limites et contrôles de qualité

1. **Requêtes incomplètes.** Les 247 requêtes visibles cumulent 149 clics, soit seulement 25,9 % du total, et 5 879 impressions, soit 50,7 %. Impossible de calculer un partage fiable marque / hors marque ou d'expliquer toute la croissance par ces requêtes. Google omet notamment les requêtes anonymisées. [Définitions des dimensions Search Console](https://support.google.com/webmasters/answer/17011259?hl=en).
2. **Agrégation différente des pages.** Le total de l'onglet Pages est 585 clics / 12 966 impressions, contre 576 / 11 590 dans Graphique. Les groupes de pages servent à comparer des familles ; ils ne remplacent pas le total du site. Google documente des différences liées à l'agrégation par propriété ou par page. [Documentation des totaux Search Console](https://support.google.com/webmasters/answer/7576553?hl=en).
3. **Clics sans installation.** Aucun événement d'installation, de première ouverture, de génération ou d'achat dans l'archive. La rentabilité SEO demeure inconnue.
4. **Définition de la visite.** Le script local conserve la page d'entrée dans `sessionStorage` avec un délai de 30 minutes. Umami possède sa propre définition. Treize événements store_click présentent une différence entre `landing_page` et la première page vue de leur visit_id. Le rapport utilise systématiquement cette dernière pour attribuer les visites. [Définitions Umami](https://docs.umami.is/docs/metric-definitions).
5. **Tests internes non identifiables.** Tous les 238 store_click portent `test=false`. Aucun n'a donc été exclu comme test. Cela ne garantit pas l'absence de visites internes : leur identification n'est pas fournie. Trois visites ont un référent `mokka.corp.google.com`, sans clic store ; elles sont conservées parmi les autres sources.
6. **Un doublon exact.** Une page vue `/es/`, le 30 septembre à 16:40:12, possède deux lignes avec le même event_id. Une seule est retenue dans les calculs, sans toucher au fichier d'origine.
7. **Pas d'audit technique complet possible.** Les champs LCP, INP, CLS, FCP et TTFB sont tous absents. Aucun export d'indexation ou de liens n'est fourni. Aucune conclusion fondée sur ces exports concernant Core Web Vitals, couverture, pénalité ou backlinks.
8. **URLs et langues.** Les trois pages locales vérifiées possèdent déjà canonical et hreflang. Quelques variantes sans slash et `/en/couple-games/` apparaissent avec de très faibles impressions. Vérifier leur redirection/canonical est un contrôle ciblé, pas la preuve d'un problème majeur de duplication.
9. **Requêtes conversationnelles.** Certaines requêtes semblent être des échanges ou questions très courtes. Une contribution d'AI Mode est plausible puisque Google inclut ses performances dans Web, mais cet export ne permet pas de l'isoler. Ne pas créer des pages pour chaque formulation isolée. [Mesure des fonctionnalités IA](https://developers.google.com/search/docs/appearance/ai-features).

## 7. Ordre de travail recommandé

| Priorité | Travail proposé | Motif observé | Critère de suivi |
| --- | --- | --- | --- |
| P0 | Stabiliser la définition du parcours, exclure les visites internes identifiées et conserver la déduplication | 13 divergences de page d'entrée ; aucun suivi d'installation | Visites par source et page d'entrée avec au moins un clic store |
| P1 | Travailler Melt EN à partir d'un export de requêtes filtré ; tester une seule modification | 4 043 impressions ; CTR 2,15 % ; taux store 16,3 % | CTR par famille de requêtes, volume de visites Google avec clic store |
| P1 | Renforcer Couples game EN et les liens internes pertinents | 68 clics / 462 impressions ; 17 visites Google avec clic store | Hausse des visites Google avec clic store, sans dilution de l'intention |
| P1 | Développer Dipsea EN et ES | Position favorable, intention d'alternative/langue déjà visible | Visites Google et clics store par langue |
| P2 | Préserver les arguments factuels des comparatifs et mesurer ChatGPT séparément | 169 visites attribuées, 69 avec clic store | Volume de visites ChatGPT avec clic store puis résultats dans l'app |
| P2 | Vérifier les variantes d'URL et obtenir les exports d'indexation et de performances techniques | Petits signaux d'URL alternatives ; données techniques absentes | Absence de blocage confirmé sur les pages prioritaires |
| P3 | Publier seulement quelques contenus de soutien ciblés | Blog : un clic Google | Contribution aux pages d'acquisition et clics store |

### Mise en œuvre sur 30 jours

- Première semaine : figer une base de comparaison après la correction des boutons du 2 octobre, contrôler le tracking et exporter les requêtes par page pour Melt, Couples game et Dipsea. Vérifier la cohérence des offres et des démos annoncées.
- Deuxième semaine : effectuer un test ciblé sur Melt EN et renforcer les liens internes vers Couples game. Noter précisément les dates et périmètres des changements.
- Semaines trois et quatre : renforcer Dipsea ES/EN si les requêtes filtrées confirment les intentions, puis lire les résultats sur des fenêtres comparables. Les volumes par page sont modestes : prolonger la mesure si le nombre de succès est insuffisant pour décider.

Le KPI principal disponible est **le nombre de visites attribuées à Google avec au moins un clic store**, accompagné de son taux. Le chiffre de référence sur le 6–29 septembre est **82 / 319 = 25,7 %**. Ajouter ensuite les premières ouvertures et achats dans un dispositif d'attribution adapté pour juger la valeur économique.

À titre d'illustration, sur 86 visites, faire passer Melt EN de 16,3 % à 25 % correspondrait à environ 7–8 visites supplémentaires avec clic store. Il s'agit d'un scénario arithmétique, pas d'une prévision de gain ni d'une estimation d'installations.
