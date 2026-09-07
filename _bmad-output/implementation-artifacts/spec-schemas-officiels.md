---
title: 'Remplacement des schémas SVG par les images officielles'
type: 'feature'
created: '2026-09-06'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context: []
baseline_commit: 'd148abe98d13bc92c55500e326fb9752bdd1ed5f'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Le schéma affiché par `TableDiagram` (SVG généré depuis les coordonnées de grille de `domain/catalog`) ne respecte pas suffisamment les schémas officiels du règlement — constat de l'utilisateur, confirmé visuellement (grille, angles de flèches, style trait). Les 21 images officielles (une par Figure, cf `gfx/base/*.png`, déjà au format attendu : billes numérotées, flèches Bronze, aucune flèche Argent/Or) sont maintenant disponibles.

**Approche :** Remplacer le rendu SVG de `TableDiagram.tsx` par l'affichage direct de l'image officielle correspondant à `figure.id` (copiée en `src/assets/schemas/{figure.id}.png`, une image par Figure — inchangé : en Bronze plusieurs Exercices partagent la même image, AD-2). `figure`/`exercice` restent les mêmes props (aucun appelant à modifier, `Exercice.tsx` inchangé) ; seul l'intérieur du composant change. `EssaiButtons.tsx` ne consomme que `couleur`/`ordrePoche`/`nombreBillesSequence`, jamais `x`/`y`/`pocheCible` — aucun impact sur la saisie. `domain/catalog/data.ts` (coordonnées x/y/pocheCible) n'est pas modifié : ces champs deviennent inutilisés par le rendu mais ne sont pas supprimés (fichier volumineux, vérifié page par page contre le PDF officiel — toucher au-delà du strict nécessaire dépasse cette story).

</frozen-after-approval>

## Review Triage Log

Une couche (blind-hunter) sur les fichiers modifiés du worktree. Taille des changements ≈ 911 Ko (dominée par les 21 images) → N = min(floor(sqrt(911)+1), 10) = 10 ; 11 signalements rendus.

- **AD-2 (ARCHITECTURE-SPINE.md) contredit désormais le code : sa justification "éviter 35 assets dessinés à la main" est exactement ce que ce changement introduit** — verdict: **medium** — vérifié (texte AD-2 lu) ; la clause `nombreBillesSequence`/`ordrePoche` reste valide et non affectée, seule la justification "asset dessiné" l'est → **patch** (AD-2 annotée SUPERSEDÉ avec historique de la décision, clause active préservée).
- **`data.ts` (or-e) : commentaire "aucune bille noire visible" contredit l'image officielle `or-e.png`, qui en montre une** — verdict: **medium** — vérifié par inspection directe de l'image (bille noire distincte des points de poche) → **defer** (correction du catalogue hors périmètre, nécessite re-vérification rigoureuse ; signalé prominemment à l'utilisateur et dans `deferred-work.md`, impact score potentiel FR-6).
- **11 tokens CSS `--table-*`/`--ball-*`/`--pocket` dans `index.css` devenus inutilisés, `DESIGN.md` obsolète** — verdict: **low** — vérifié (grep : plus aucune référence hors définition) → **patch** (tokens supprimés, `--table-rail` conservé ; DESIGN.md mis à jour).
- **Images blanches sur fond d'app exclusivement sombre — clash visuel non anticipé par la vérification (dimensions/alt/erreurs console seulement)** — verdict: **low** — réel (vérifié visuellement) mais rejeté : lecture légitime "reproduction de document officiel encadrée" plutôt qu'un défaut, cohérent avec l'objectif de fidélité de cette story → **rejeté**, signalé néanmoins à l'utilisateur en présentation (choix de goût, pas un bug).
- **`alt` dupliquant `exercice.enonce` déjà affiché en texte juste au-dessus — double annonce lecteur d'écran** — verdict: **low** — vérifié (`Exercice.tsx`, `exercise-body`) → **patch** (`alt=""`, image décorative/redondante ; prop `exercice` retirée de `TableDiagram` devenue inutile).
- **`verify-catalog.mjs` non étendu pour vérifier qu'chaque Figure a une image correspondante — une Figure renommée/ajoutée sans image se rendrait en boîte vide, silencieusement** — verdict: **medium** — vérifié (`schemaPour` retourne `undefined` sans avertissement) → **patch** (assertion ajoutée, toutes les 21 figures couvertes).
- **Aucun test unitaire couvrant les 21 ids de figure, seulement 3 spot-checks Playwright** — même cause racine que le précédent → couvert par la même assertion `verify-catalog.mjs` (existence de fichier pour les 21 ids).
- **`<img>` sans `width`/`height`/`aspect-ratio` — saut de mise en page possible entre exercices** — verdict: **low** — vérifié (les 21 images partagent exactement 970×548) → **patch** (`aspect-ratio: 970/548` ajouté).
- **`display: flex` sur `.table-diagram` sans propriété d'accompagnement, sans effet visible** — verdict: **low** — vérifié → **patch** (retiré).
- **`x`/`y`/`pocheCible` devenus morts pour le rendu sans note trackée sur `data.ts`/`types.ts`** — verdict: **low** — réel → **patch** (commentaire ajouté sur `Bille` dans `types.ts`).
- **`schemaPour` fait un scan `Object.entries().find()` avec `endsWith` au lieu d'un lookup direct par clé** — verdict: **low** — vérifié (clés `import.meta.glob` déterministes et connues) → **patch** (lookup direct par clé construite).

## Implementation Notes

Implémenté directement (pas de subagent, changement contenu et bien compris après investigation).

Investigation clé avant d'implémenter : vérifié que `EssaiButtons.tsx` (saisie d'essai) ne lit jamais `bille.x`/`bille.y`/`bille.pocheCible` — uniquement `couleur`, `ordrePoche`, `nombreBillesSequence` — donc aucun risque de désaligner une cible de saisie superposée à l'image (il n'y en a pas). Vérifié aussi que les 21 images (`gfx/base/*.png`) correspondent exactement aux 21 Figures de `domain/catalog/data.ts` (diff des ids, aucun écart) et qu'elles incrustent déjà les numéros de bille/flèches par Figure entière (Bronze : mêmes numéros 1-4 que les Exercices siblings partageant la Figure, AD-2) — confirme que le modèle de partage Figure↔Exercices n'a pas changé, seul le mode de rendu change.

Fichiers touchés :
- `src/assets/schemas/*.png` (nouveau, 21 fichiers, 952 Ko) -- copie de `gfx/base/*.png`, renommés en minuscules pour correspondre exactement à `figure.id` (`bronze-A.png` -> `bronze-a.png`). `gfx/base/*.png` original laissé tel quel (même convention que les autres `gfx/*`, hors périmètre applicatif).
- `src/adapters/ui/shared/TableDiagram.tsx` -- réécrit : `import.meta.glob` charge les 21 images, sélectionne celle de `figure.id`, affiche un `<img>` avec `alt` reprenant le texte de l'énoncé (même contenu que l'ancien `aria-label` du SVG). Props (`{figure, exercice}`) inchangées -- aucun appelant à modifier (`Exercice.tsx` intact).
- `src/adapters/ui/shared/TableDiagram.css` -- simplifié pour un `<img>` (plus de règles SVG).
- Tout le rendu SVG précédent (coordonnées, flèches, poches, cercles) est supprimé de `TableDiagram.tsx` -- remplacé, pas conservé en fallback.

Vérifié en navigateur réel (Playwright) : un exercice de chaque niveau (Bronze/Argent/Or) affiche bien l'image officielle attendue (dimensions naturelles chargées, `alt` correct), aucune erreur console, `npm run build` précache les 21 images (32 entrées, 1398 Ko au total) sans modification nécessaire de `vite.config.ts` (`png` déjà dans `workbox.globPatterns`).

**Patches post-revue (cf. Review Triage Log) :**
- `ARCHITECTURE-SPINE.md` (AD-2) et `DESIGN.md` (§Components, "Table diagram") mis à jour pour refléter le nouveau rendu par image (la clause AD-2 sur `nombreBillesSequence`/`ordrePoche` reste inchangée, seule la justification "asset dessiné à la main" est retirée).
- `src/index.css` : 11 tokens CSS devenus inutilisés (`--table-felt/-line/-arrow/-order-label/-replacement-zone`, `--ball-*`, `--pocket`) supprimés ; `--table-rail` conservé (cadre de l'image).
- `TableDiagram.tsx` : lookup direct par clé (`SCHEMAS[...]`) au lieu d'un scan `Object.entries().find()` ; `alt=""` (l'image est redondante avec l'énoncé texte déjà affiché juste au-dessus, cf `Exercice.tsx`) ; prop `exercice` retirée (devenue inutilisée) -- `Exercice.tsx` mis à jour en conséquence.
- `TableDiagram.css` : `display: flex` sans effet retiré ; `aspect-ratio: 970/548` ajouté (les 21 images partagent exactement ces dimensions, vérifié) pour éviter un saut de mise en page au chargement.
- `domain/catalog/types.ts` : commentaire ajouté sur `Bille.x/y/pocheCible` notant qu'ils ne sont plus consommés par le rendu (conservés, `data.ts` non modifié).
- `scripts/verify-catalog.mjs` : nouvelle assertion -- chaque Figure du catalogue doit avoir une image correspondante dans `src/assets/schemas/`.

Revérifié après patches : `npm run build`, `verify-catalog`, `verify-scoring`, `verify-historique` tous verts ; navigateur réel (Bronze/Argent/Or) confirmant le lookup direct et `alt=""`.

**Déféré (non corrigé dans cette story, cf. `deferred-work.md`) :** la revue a révélé que l'image officielle `or-e.png` montre une bille noire absente du modèle `domain/catalog/data.ts` actuel (qui ne liste que 2 rouges + 3 jaunes) -- possible erreur de contenu antérieure à cette story, désormais visible grâce aux images officielles. Non corrigé ici : nécessite une re-vérification rigoureuse (position exacte, quelles billes sont "obstacle" vs "séquence") comme celle déjà faite pour le reste du catalogue, pas une correction hâtive sur une seule lecture visuelle. Signalé explicitement à l'utilisateur en présentation (impact potentiel sur le score FR-6 de l'exercice or-e-1).
