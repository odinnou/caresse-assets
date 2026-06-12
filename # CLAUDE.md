# CLAUDE.md — Caresse

## 🧠 Contexte global

Caresse est une application mobile (iOS / Android) proposant des expériences audio immersives à visée intime et sensorielle.

L’application permet à un utilisateur, seul ou à deux, de générer des scénarios personnalisés (audio + texte) grâce à une intelligence artificielle. Ces expériences sont guidées par une voix synthétique et visent à créer un moment de détente, de connexion et d’exploration personnelle ou partagée.

L’application se positionne comme une solution de **bien-être émotionnel et sensoriel**, et non comme un service de contenu explicite.

---

## 🎯 Objectif produit

- Offrir des expériences immersives personnalisées
- Favoriser la reconnexion à soi et/ou à son/sa partenaire
- Encourager la lenteur, la présence et l’écoute
- Proposer un cadre sécurisé basé sur le consentement

---

## 👥 Utilisation

- Utilisation **solo ou en couple**
- Public strictement **majeur (18+)**
- Expériences guidées par audio (voix IA)
- Personnalisation :
  - ambiance sonore
  - ton
  - pratiques suggérées
  - accessoires éventuels
  - genre libre (inclusif)

---

## 🤖 Nature de l’IA

- Génération **à la volée**
- Contenu **non déterministe**
- Possibilité d’incohérences ou variations
- L’IA agit comme un **outil de suggestion narrative**, pas comme un auteur humain

---

## ⚠️ Positionnement légal important

- L’application n’est pas un service pour adultes au sens pornographique le contenu se rapproche plus de l'érotisme
- Les scénarios sont des **fictions guidées**
- Aucune instruction ne doit être interprétée comme une obligation ou une recommandation réelle

---

## 🛡️ Sécurité & consentement

- Le consentement est central et rappelé dans les expériences
- L’utilisateur reste responsable de ses actions
- L’application encourage des pratiques "safe & sane"
- Aucun contrôle sur le comportement réel des utilisateurs

---

## 💰 Modèle économique

- Achat de crédits (consommables)
- Déclenchement de génération = consommation de crédit
- Unlock optionnel :
  - accès étendu aux options (pratiques, accessoires)
  - achat unique (lifetime)
- Aucun remboursement pour motif subjectif (contenu génératif)

---

## 🔐 Données & confidentialité

- Authentification via Firebase (OAuth / guest)
- Stockage d’un UID anonyme
- Données de scénarios utilisées uniquement pour génération
- Transmission anonymisée aux services d’IA
- Aucune revente de données personnelles
- Suppression complète possible (droit à l’oubli)

---

## 📁 Assets légaux disponibles

Les documents suivants sont présents dans le projet :

- `cgu.html` (CGU)
- `cgv.html` (CGV)
- `privacy.html`
- `legals.html` (mentions légales)

---

## ✍️ Objectif des prompts

Les prompts adressés à Claude doivent permettre :

- d’améliorer la clarté juridique
- d’assurer la conformité (France / UE / US)
- de renforcer la protection de l’éditeur
- d’éviter toute ambiguïté sur :
  - la nature du contenu
  - la responsabilité
  - la génération IA
- de conserver un ton accessible, humain et cohérent avec le produit

---

## 🧾 Contraintes importantes

- Ne pas rendre les textes trop techniques ou illisibles
- Conserver un équilibre entre :
  - protection juridique
  - expérience utilisateur
- Éviter tout wording pouvant faire basculer l’application en contenu adulte explicite
- Rester compatible avec les guidelines Apple / Google

---

## 🚀 Notes

Caresse est un produit en cours de lancement, développé par un solopreneur.

Les documents existants sont déjà bien structurés, mais peuvent être optimisés en termes de :
- précision juridique
- cohérence globale
- robustesse face aux risques

---

## 💡 Exemple de prompt

> Améliore ce document juridique en conservant son ton, en renforçant la protection légale de l’éditeur, et en clarifiant les points liés à l’IA générative et à la responsabilité utilisateur.

---

## 🌐 Architecture multilingue FR / EN

Le site sert le **FR depuis la racine** (`/`, `/for-couples/`, etc.) et l'**EN depuis `/en/`** (`/en/`, `/en/for-couples/`, etc.). Chaque URL contient une seule langue dans son DOM (pas de toggle JS qui swap le contenu) — c'est ce qui permet à Google d'indexer correctement les deux versions.

### Mapping FR ↔ EN

| FR | EN |
|---|---|
| `/` | `/en/` |
| `/for-couples/` | `/en/for-couples/` |
| `/for-solo-exploration/` | `/en/for-solo-exploration/` |
| `/for-new-couples/` | `/en/for-new-couples/` |
| `/for-long-term-couples/` | `/en/for-long-term-couples/` |
| `/for-busy-couples/` | `/en/for-busy-couples/` |
| `/for-adventurous-couples/` | `/en/for-adventurous-couples/` |

### ⚠️ Propagation FR → EN obligatoire

**Quand tu modifies une page FR, propage le change à la page EN équivalente** (et inversement). Il n'y a pas de build script : les deux versions sont des fichiers HTML maintenus manuellement en parallèle.

Points à synchroniser systématiquement :

- **Contenu visible** (`<h1>`, `<h2>`, paragraphes, FAQ, etc.) — traduire
- **`<title>`, `<meta description>`, `og:*`, `twitter:*`** — traduire
- **JSON-LD** (`FAQPage`, `WebPage`, `SoftwareApplication`, etc.) — traduire les champs `name`, `description`, `text` des Q&A, etc.
- **Liens internes** — les pages FR linkent vers `/for-*/`, les pages EN vers `/en/for-*/`
- **Images screens** — les pages FR utilisent `screens/fr/*`, les pages EN `screens/en/*`
- **hreflang** — chaque page doit avoir 3 `<link rel="alternate" hreflang>` (`fr` vers la FR, `en` vers la EN, `x-default` vers la FR)
- **canonical** — chaque page pointe vers sa propre URL
- **Sitemap** — `sitemap.xml` contient les 14 URLs (7 FR + 7 EN) avec leurs hreflang croisés

### Toggle de langue

Le toggle FR/EN dans le header n'est **pas un bouton JS**, c'est un vrai lien (`<a href="/en/for-X/">`) qui pointe vers la version équivalente dans l'autre langue. Le toggle actif a `aria-current="page"`.

### Témoignages

Les quotes "Manon & Yannick", "Sophie & James" etc. sur les pages satellites sont **illustratives, pas des vrais avis utilisateurs**. Ne pas ajouter de `Review` / `AggregateRating` schema autour — risque de pénalité Google et trompeur.