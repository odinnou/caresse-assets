# SEO WIP — Chantier "URLs /en/ séparées"

> **État au 2026-06-10** — Branche `feat/new-seo`. Travail en cours sur le chantier #2 de l'audit SEO (création de pages EN avec URLs propres pour qu'elles soient indexées par Google).

## Contexte

Avant ce chantier, le site avait un seul DOM par URL (`/`, `/for-couples/`, etc.) avec un toggle JS FR/EN qui swap les blocs `data-lang="fr"` et `data-lang="en"`. Problème : Google rend la page et ne voit qu'une langue (le CSS cache les autres). Donc le contenu EN n'est **jamais indexé**.

Solution : créer des URLs `/en/...` parallèles avec un DOM purement EN, et faire pointer le toggle de langue vers ces URLs comme de vrais liens (pas de swap JS).

## Décisions prises

1. **Stratégie de génération** : duplication manuelle (pas de build script). Quand on modifie une page FR, il faut propager le change à la page EN équivalente. → à documenter dans `CLAUDE.md`.
2. **Toggle de langue** : transformé en liens `<a href="/en/...">` au lieu de boutons JS. Chaque URL a une seule langue dans son DOM (Google heureux).
3. **Pas de redirect auto navigateur** : si tu arrives sur `/en/` avec navigator.language=fr, on ne redirige pas (respect du choix utilisateur).
4. **Quotes/témoignages** : pas de Review schema (les noms sont fictifs — cf. `~/.claude/projects/-Users-odinnou-dev-assets/memory/caresse-testimonial-quotes.md`).

## Avancement (tasks)

| # | Task | Statut |
|---|---|---|
| 1 | Créer la structure /en/ et dupliquer les 7 pages | ✅ Fait |
| 2 | Transformer chaque page EN (lang, meta, contenu) | ⏳ **En cours** — home faite, 6 satellites à finir |
| 3 | Ajouter hreflang croisés sur les pages FR | ❌ À faire |
| 4 | Mettre à jour sitemap.xml avec URLs /en/ | ❌ À faire |
| 5 | Lier les deux versions (toggle FR → /en/ lien) sur les pages FR | ❌ À faire |
| 6 | Ajouter note CLAUDE.md sur la propagation FR→EN | ❌ À faire |

## Détail état actuel

### Fichiers créés
- `/en/index.html` — **transformé**, à valider visuellement
- `/en/for-couples/index.html` — FR stripped, head à transformer
- `/en/for-solo-exploration/index.html` — FR stripped, head à transformer
- `/en/for-new-couples/index.html` — FR stripped, head à transformer
- `/en/for-long-term-couples/index.html` — FR stripped, head à transformer
- `/en/for-busy-couples/index.html` — FR stripped, head à transformer
- `/en/for-adventurous-couples/index.html` — FR stripped, head à transformer

### Script utilisé pour strip les blocs FR
`/tmp/strip_fr.py` — supprime tous les éléments `data-lang="fr"` et l'attribut `data-lang="en"` du contenu restant. Réutilisable.

### Transformations restantes par page EN (template à reproduire 6× pour les satellites)

D'après ce qui a été fait sur `en/index.html` :

**Dans le `<head>` :**
1. `<html lang="fr">` → `<html lang="en">`
2. `<title>` → version EN (traduire)
3. `<meta name="description">` → version EN
4. `<link rel="canonical">` → ajouter `/en/` au path
5. `hreflang fr` URL → page FR équivalente (sans `/en/`), `hreflang en` URL → page EN courante avec `/en/`
6. `og:url` → URL `/en/` courante
7. `og:title`, `og:description`, `og:image:alt`, `twitter:title`, `twitter:description`, `twitter:image:alt` → EN
8. `og:image`, `twitter:image` → `og-image-en.png`
9. `og:locale` → `en_US`, `og:locale:alternate` → `fr_FR`
10. JSON-LD : `name`, `description`, `url`, `inLanguage` (ordre `["en", "fr"]`)

**Dans le `<body>` :**
1. `<body class="lang-fr">` → `<body class="lang-en">`
2. Le lang-toggle : 2 `<button onclick="setLang('fr')">` → 2 `<a href>` : `FR → /` (ou /for-xxx/ équivalent FR), `EN → /en/` (active)
3. Carousel/images : remplacer `screens/fr/N_android_fr.webp` par `screens/en/N_android_en.webp` (sed disponible)
4. Liens internes : `href="/for-..."` → `href="/en/for-..."` (sed disponible)
5. Texte du `hero-eyebrow` ou autres textes non-`data-lang` qui étaient en FR → traduire
6. Supprimer le JS `function setLang() { ... }` et l'appel `setLang(userLang)` (inutile)
7. Alt-text des images : traduire en EN si encore en FR

### Pages FR (les sources actuelles) — modifs à faire (task #3 + #5)
Pour chaque page FR (`/`, `/for-couples/`, etc.) :

1. `hreflang en` doit pointer vers la version `/en/...` correspondante
2. `og:locale:alternate` → `en_US` (déjà ok je pense)
3. Le toggle JS : transformer en `<a href>` qui navigue vers `/en/...` équivalent
4. Pages FR doivent rester `body class="lang-fr"` et **garder** uniquement les blocs `data-lang="fr"` (idem strip mais inverse — il faudrait écrire un `strip_en.py` analogue, ou faire un Edit manuel ; option plus simple : les pages FR gardent le `data-lang` mais on retire la possibilité de switcher en JS sur la même page).

**Option simple recommandée pour task #5** : sur les pages FR, supprimer les blocs `data-lang="en"` aussi (pour être propre côté SEO), et transformer le toggle en simple lien.

### Sitemap (task #4)
Ajouter 7 entrées `<url>` pour `/en/...`, avec hreflang croisés entre FR et EN. Le sitemap actuel n'a que les FR.

## Comment reprendre

1. **Valider visuellement la home EN** : lancer un serveur local (`python3 -m http.server 8000`) et ouvrir `http://localhost:8000/en/` pour confirmer que tout est bon.
2. **Si OK**, écrire un script Python qui automatise les transformations du `<head>` listées ci-dessus pour les 6 satellites (chaque page a son URL et ses textes différents → besoin d'un mapping).
3. **Sinon**, ajuster la home EN d'abord et propager une fois la recette correcte.
4. Finir tasks #3, #4, #5, #6.

## Mapping URL FR ↔ EN

| FR | EN |
|---|---|
| `/` | `/en/` |
| `/for-couples/` | `/en/for-couples/` |
| `/for-solo-exploration/` | `/en/for-solo-exploration/` |
| `/for-new-couples/` | `/en/for-new-couples/` |
| `/for-long-term-couples/` | `/en/for-long-term-couples/` |
| `/for-busy-couples/` | `/en/for-busy-couples/` |
| `/for-adventurous-couples/` | `/en/for-adventurous-couples/` |

## Risques connus à surveiller à la reprise

- **Liens internes oubliés** : sur les satellites EN, après strip, vérifier que tous les `href="/for-..."` ont bien été remplacés par `/en/for-...`.
- **Images du carousel** : sur les satellites, l'écran principal pointe vers `screens/fr/Nx_android_fr.png` dans la balise og:image et dans le HTML — à patcher.
- **Scories FR non taggées `data-lang`** : `hero-eyebrow`, certains alt, commentaires HTML. Faire un grep des accents FR à la fin sur chaque page EN.
- **Le toggle de langue sur les pages FR** : doit aussi devenir un lien (cohérence). Tant qu'on ne le fait pas, sur la version FR le toggle EN ne mène nulle part de propre.
