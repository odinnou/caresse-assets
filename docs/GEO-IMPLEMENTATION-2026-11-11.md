# Implémentation GEO et priorités SEO — 11 novembre 2026

Le propriétaire demande de poursuivre l’implémentation, sans contrôle IA payant.
Aucun contrôle payant ni suivi récurrent n’a été lancé. La suite s’appuie sur les
données Search Console et l’export Umami déjà obtenus, sans nouvelle collecte payante.

## Axes mis en œuvre

| Priorité | Axe | Changements dans le site | Ce que cela sert |
| --- | --- | --- | --- |
| 1 | Accueils et démos : entrées GEO existantes | Présentation courte de l’app, voix synthétique, noms/pseudonymes, démos fixes gratuites et crédits sans abonnement ; réponses FAQ autonomes. | Faciliter une description fidèle de l’offre sur les pages qui apportent déjà des clics IA. |
| 2 | Une identité produit cohérente | Toutes les déclarations structurées Caresse utilisent le même identifiant, la même URL officielle, la catégorie Lifestyle et les quatre langues audio. Les références de schéma suivent cette identité. | Éviter de présenter chaque démo comme une application différente ou de décrire le site allemand comme une app allemande. |
| 3 | Répondre aux intentions de recherche compatibles | Les pages « couples » et « jeu pour couple » expliquent déjà le format audio, les choix, les limites et le paiement. Les métadonnées des démos qualifient l’extrait gratuit et la création payante. | Renforcer les intentions « jeu audio », « audio personnalisé » et « alternative », sans viser les recherches de connexion d’un concurrent. |
| 4 | Découverte et fraîcheur vérifiables | Dates de modification des dix accueils/démos alignées dans leurs schémas de page et le sitemap. Canonical, hreflang et routes conservés. | Signaler les changements réels sans rafraîchir artificiellement toutes les pages. |
| 5 | Conversion et mesure | CTA directs, libellés, routage Android et médias conservés. Attribution des sources IA et contrôles de FAQ déjà intégrés. | Conduire au store dès le premier clic et distinguer les clics des installations. |

Ces choix reposent sur deux signaux distincts : les accueils et démos apportent des
clics attribués à ChatGPT dans Umami ; les pages jeu pour couple ont une traction
Google dans Search Console. L’un ne mesure pas l’autre.

## Données qui déterminent l’ordre

| Signal observé | Périmètre | Conséquence pour l’implémentation |
| --- | --- | --- |
| 136 clics store attribués à ChatGPT, soit 25,9 % des 526 clics qualifiés | Export Umami fourni, filtre `test=false` et définition `caresse-only-v1` | Consolider les entrées GEO existantes avant de multiplier les pages. Ces clics ne sont pas des installations. |
| 69 de ces clics ChatGPT ont pour entrée l’accueil FR ou EN | Même export et même filtre | Les accueils FR/EN passent avant une expansion allemande de l’app, qui n’existe pas. |
| 198 clics Google sur les pages jeu pour couple FR, EN et ES | Search Console, 11 octobre–7 novembre 2026, recherche Web, données définitives | Améliorer ces pages existantes et leur maillage éditorial. |
| Des requêtes « login » contribuent aux impressions du comparatif Melt | Même période Search Console | Évaluer les requêtes et leur intention avant de chercher à augmenter le CTR. |

L’export Umami et la période Search Console ne couvrent pas les mêmes dates.
Ces volumes servent à prioriser ; ils ne constituent pas un taux de conversion
croisé entre les deux outils.

## Détail du lot du 11 novembre

- Sur les cinq accueils, l’introduction donne le format et le modèle économique.
  Les FAQ expliquent le coût et distinguent site vitrine, démos et création dans
  l’app. Une question sur la génération sur le site complète les versions qui
  n’en disposaient pas ; la version PT conserve sa question existante.
- Sur les cinq hubs de démos, introduction, description SEO, Open Graph, Twitter
  et réponse sur la personnalisation précisent la différence entre extrait fixe
  et session créée avec un crédit. Le texte et les schémas FAQ partagent la même
  source quand le bloc FAQ structuré existe.
- Les démos PT/DE restent explicitement en anglais. L’app est entièrement en
  portugais sur Android ; la prochaine version iOS est en validation. La mention
  de traduction partielle retirée des métadonnées PT ne correspondait plus à cet état.
- `src/data/product.json` centralise l’identité et les langues de l’app pour les
  schémas. `compileSchemas` traite aussi les déclarations imbriquées et les
  références à leurs anciens identifiants. Les descriptions propres aux pages,
  offres et boutiques localisées restent conservées. Les concurrents et médias
  ne sont pas normalisés comme s’ils étaient Caresse.
- La catégorie des déclarations Caresse devient `LifestyleApplication`, cohérente
  avec la présentation de bien-être et l’absence de service médical ou thérapeutique.

## Axes SEO suivants, sans chantier de pages en masse

1. **Consolider les intentions qui apportent déjà du trafic.** Prioriser jeu audio
   pour couple, personnalisation et alternatives réellement cherchées. Relire les
   requêtes avant de modifier un titre : une impression sur « login » n’est pas une
   intention d’essayer Caresse. Les pages existantes couvrent déjà ces usages.
2. **Entretenir le maillage éditorial.** Relier ces intentions par des liens texte
   dans les paragraphes, navigation ou footer, avec les slugs locaux réels. Garder
   les CTA visibles vers les stores, sans passer par `/demo/` ou `/download/`.
3. **Suivre l’indexation des pages récentes.** L’accueil DE est indexé ; le
   comparatif DE Dipsea n’était pas connu de Google lors de l’inspection. Vérifier
   son évolution après publication, sans le présenter comme un défaut résolu par
   l’ajout de schémas. Aucune demande d’indexation n’a été envoyée ici.
4. **Aligner les fiches stores et les descriptions extérieures.** Reprendre les
   mêmes faits et langues, avec des captures et retours réels. Les brouillons
   existants sont prêts ; aucun message externe ni changement de fiche store n’a
   été effectué.
5. **Comparer les résultats après publication.** Même période, sources et version
   du suivi. Les données historiques constituent un point de départ ; elles ne
   prouvent pas un gain des corrections encore locales.

Les rapports détaillés Search Console et Umami restent dans `artifacts/geo/`,
hors Git et hors site publié. Les guides de suivi et les contrôles du build sont
disponibles dans [geo/README.md](geo/README.md).

## Vérification du lot

- Les 42 tests automatisés passent ; le build et les contrôles de traduction passent.
- Le HTML généré contient 1 264 réponses FAQ conformes au texte visible,
  131 déclarations cohérentes de Caresse et 124 liens `llms.txt` valides.
- Les contrôles navigateur allemands passent sur ordinateur et Android, avec
  vérification complémentaire des liens iPhone.
- Les 30 parcours des accueils et démos passent sur ordinateur, iPhone et Android,
  dans les cinq langues : aucun débordement horizontal, bon store, attribution IA
  conservée et absence d’URL de conversation dans l’événement. Les requêtes sont
  interceptées localement ; aucun événement réel ni clic store réel n’est envoyé.
- Le contrôle navigateur conservé en CI inclut désormais les accueils et démos,
  en plus des pages couples et jeu pour couple.

Les changements restent locaux : aucun déploiement n’a été effectué dans ce lot.
