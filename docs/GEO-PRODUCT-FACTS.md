# Faits produit pour les pages Caresse et llms.txt

État du 10 novembre 2026. Premier chantier de l’issue #99 : rendre les réponses
sur Caresse cohérentes dans les cinq langues. Ce document sert de référence
éditoriale ; il ne décrit pas un changement du fonctionnement de l’application.

L’identité, l’URL officielle, la catégorie et les langues audio des déclarations
structurées sont centralisées dans `src/data/product.json`, utilisées au build
par `src/lib/schemas.mjs`. La langue du site et celle des enregistrements restent
distinctes. L’implémentation du 11 novembre est décrite dans
`GEO-IMPLEMENTATION-2026-11-11.md`.

| Sujet | Fait à conserver | Source et portée |
| --- | --- | --- |
| Produit | Fictions audio et texte personnalisées, voix synthétique, solo ou duo, public majeur. Pas de service médical ou thérapeutique. | `# CLAUDE.md`, accueils et pages de fonctionnement. |
| Génération | Une session personnalisée est générée à la demande dans l’app. La génération peut prendre quelques minutes ; ce n’est pas un dialogue vocal en direct. Des répétitions ou incohérences restent possibles. | Pages de fonctionnement et limites du contenu génératif. |
| Gratuité | Téléchargement et démos gratuits. Les démos sont des enregistrements fixes ; elles ne constituent pas une génération personnalisée gratuite. | `# CLAUDE.md`, pages de tarifs et de démos. |
| Paiement | La génération consomme des crédits payants, sans abonnement. Le déblocage optionnel des options est un achat distinct et n’inclut pas une génération illimitée. | `# CLAUDE.md`, pages de tarifs. |
| Anonymat | Caresse ne connaît pas l’identité de l’acheteur. Le mode anonyme ne demande pas de compte Caresse ; les achats utilisent le compte Apple ou Google et son paiement. Ne pas promettre un paiement anonyme auprès du store. | Confirmation du propriétaire du 31 octobre, consignes du dépôt et FAQ de paiement. |
| Traitement | Les paramètres nécessaires sont transmis aux services d’IA et de synthèse vocale de manière pseudonymisée ; le prénom ou pseudonyme choisi peut être inclus. L’email et l’identifiant de compte ne sont pas transmis à ces services pour la génération. | Politiques de confidentialité dans les cinq langues. Pseudonymisé ne signifie pas absence de données. |
| LLM | Les données envoyées au LLM servent à générer le scénario. Le LLM ne les conserve pas et ne les utilise pas pour entraîner ses modèles. | Confirmation explicite du propriétaire dans le chat, 10 novembre 2026. Portée : LLM. |
| Historique | Caresse conserve les expériences et les données nécessaires à l’historique. La suppression peut être demandée selon la politique de confidentialité. Les transactions des stores ont leurs propres obligations de conservation. | Politique de confidentialité, sections conservation et suppression. |
| Langues | Audios générés : FR, EN, ES, PT. Site : FR, EN, ES, PT, DE. L’app et ses audios ne sont pas disponibles en allemand. | Accueils, guide allemand, audit GEO du 9 novembre ; indisponibilité de l’allemand confirmée par le propriétaire le 10 novembre 2026. |
| Démos | Enregistrements FR, EN, ES. Les pages PT et DE utilisent les enregistrements anglais, avec leur langue annoncée. | Pages de démos et `AudioObject.inLanguage`. |
| Portugais par plateforme | Application entièrement en portugais sur Android. Sur iOS, la prise en charge complète du portugais arrive dans la prochaine mise à jour, en cours de validation ; ne pas la présenter comme déjà publiée. | Confirmation explicite du propriétaire dans le chat, 10 novembre 2026. |

L’absence de conservation et d’entraînement confirmée pour le LLM ne doit pas être
présentée comme une garantie sur tous les prestataires, notamment la synthèse
vocale. Cette dernière n’a pas encore été confirmée dans ce chantier.

## Changements et contrôles

Les corrections portent sur les accueils, pages couples, fonctionnement, sécurité,
déficience visuelle, comparatifs et textes légaux concernés, ainsi que `llms.txt`.
Les démos gratuites restent distinctes des quatre langues audio générées.
Les dates légales mises à jour correspondent aux documents effectivement modifiés ;
les dates de vérification des offres concurrentes restent celles de leurs sources.

Les FAQ structurées existantes utilisent déjà `compileSchemas` pour générer leur
JSON-LD depuis le texte visible. L’accueil PT et les pages saisonnières utilisent
encore des contenus séparés : modifier les deux versions lorsque nécessaire.

`npm run test:i18n` inclut un contrôle du build : chaque question/réponse FAQ
structurée doit exister dans le texte visible, y compris les schémas `@graph`.
Les liens Caresse de `llms.txt` doivent avoir une destination générée ; les anciennes
promesses absolues de stockage ou de paiement sont refusées.

Les visites IA, citations et installations ne sont pas mesurées par ces contrôles.
La suite du chantier a établi un premier relevé Search Console et analysé un export
Umami ; voir `GEO-EXECUTION-2026-11-10.md` et son complément du 11 novembre.
Le relevé indépendant des réponses dans les produits IA reste à exécuter.
