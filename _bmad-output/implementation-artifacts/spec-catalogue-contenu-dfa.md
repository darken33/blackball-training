---
title: 'Catalogue de contenu D.F.A. — données et rendu des schémas'
type: 'feature'
created: '2026-09-06'
status: 'done'
route: 'dispatch'
review_loop_iteration: 0
context: []
baseline_commit: 'd1fb121cee107c4f2418d6bf660a5ac51bee9fa8'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** L'app n'a aucune donnée de contenu ni composant de rendu pour les 35 exercices D.F.A. (Bronze/Argent/Or) — impossible d'afficher un schéma officiel ou d'exposer le catalogue sans ça (FR-1, FR-2).

**Approche :** Modéliser Figure/Exercice dans `domain/catalog` (35 exercices, barèmes, coordonnées de grille) et construire un composant SVG `TableDiagram` réutilisable dans `adapters/ui/shared`, fidèle aux schémas officiels (architecture AD-2). Un harnais de vérification temporaire dans `App.tsx` permet de voir le résultat, en attendant l'écran Accueil réel d'une spec ultérieure.

## Boundaries & Constraints

**Always :**
- Fidélité exacte au règlement (nombre de billes de la séquence, ordre de poche, couleurs) — `content-catalog.md` fait autorité, jamais les maquettes UX (PRD FR-2).
- `domain/catalog` ne dépend de rien d'autre du projet — fonctions/données pures, pas de React/Dexie (AD-6).
- `TableDiagram` ne rend que les données de Figure + la cible de l'Exercice, jamais une image ni un markup spécifique par exercice (AD-2).

**Never :**
- Pas d'écran Accueil/Exercice/Session complet ni de navigation de séance (FR-3 à FR-8) — la capability map de l'architecture réserve FR-1/FR-2 à `domain/catalog` + `adapters/ui/shared` uniquement ; le reste est une spec ultérieure.
- Pas de moteur de score ni de persistance (FR-5/6/7, `domain/scoring`, `adapters/persistence`) — hors scope.
- Pas de flèche ni de poche cible pour les exercices Argent/Or — absente de la source officielle (cf Design Notes), ne pas en fabriquer une.

## I/O & Edge-Case Matrix

| Scénario | Entrée | Comportement attendu | Erreur |
|----------|--------|---------------------|--------|
| Exercice Bronze (ex. bronze-a-1) | Figure A (4 billes) | Rend les 4 billes de la Figure avec flèche + poche cible pour chacune ; identique pour les 4 exercices siblings | N/A |
| Exercice Argent (ex. argent-c) | Exercice = Figure (3 billes) | Rend les billes avec label d'ordre (1,2,3), aucune flèche | N/A |
| Exercice Or sans ordre (ex. or-a) | Exercice = Figure, `ordrePoche: null` | Rend les billes sans aucun label ni flèche | N/A |
| Exercice Or E/F | `zoneReplacement: true` | Aucune bille blanche positionnée ; ligne verticale pointillée (`table-replacement-zone`) visible | N/A |

</frozen-after-approval>

## Code Map

- `_bmad-output/planning-artifacts/architecture/architecture-blackball-training-2026-09-05/ARCHITECTURE-SPINE.md` -- AD-2 (schéma = rendu depuis coordonnées de grille, jamais asset dessiné), Structural Seed (chemins `domain/catalog`, `adapters/ui/shared`), Capability Map (FR-1/FR-2 → ces deux dossiers uniquement).
- `_bmad-output/planning-artifacts/prds/prd-blackball-training-2026-09-05/content-catalog.md` -- catalogue texte des 35 exercices (barèmes, séquences, couleurs, cibles) ; source de contenu, corrigée le 2026-09-06 (3 erreurs Bronze, comptage Or A/B, absence de flèches Argent/Or — cf Design Notes).
- `_bmad-output/implementation-artifacts/catalog-grid-{bronze,argent,or}.md` -- coordonnées de grille (%) des 11 figures, extraites directement du PDF règlement ; source de données pour l'auteur de `domain/catalog`.
- `_bmad-output/planning-artifacts/ux-designs/ux-blackball-training-2026-09-05/mockups/exercice.html` -- convention SVG de référence (viewBox `0 0 500 260`, feutre/bandes/poches, marker flèche) à reproduire dans `TableDiagram`.
- `_bmad-output/planning-artifacts/ux-designs/ux-blackball-training-2026-09-05/DESIGN.md` -- tokens couleur `table-*`/`ball-*`/`pocket` (absents de `src/index.css`, à ajouter).
- `src/index.css` -- aucun token de couleur actuellement ; y ajouter les variables du DESIGN.md.
- `src/adapters/ui/App.tsx` -- écran minimal actuel (aucune capacité métier) ; y brancher le harnais de vérification.
- `src/domain/catalog/` (vide, `.gitkeep`) -- cible : types + données des 35 exercices + fonctions d'accès.
- `src/adapters/ui/shared/` (vide, `.gitkeep`) -- cible : composant `TableDiagram`.

## Tasks & Acceptance

**Execution :**
- [x] `src/domain/catalog/types.ts` -- Définir `Figure` `{id, niveau, balls: {couleur, x, y}[], zoneReplacement?: boolean}` et `Exercice` `{id, figureId, nombreBillesSequence, ordrePoche: number[] | null, enonce, quantiteBille?}` -- fondation typée (AD-2/AD-6).
- [x] `src/domain/catalog/data.ts` -- Transcrire les 11 figures / 35 exercices depuis `catalog-grid-*.md` + `content-catalog.md` -- contenu officiel embarqué (FR-1). Barème (Bronze 5/3/2, Argent/Or 4/3/2,5) et seuils (50/60/70) sont des constantes de `domain/scoring` (hors scope, FR-6/7) ; ne pas les dupliquer ici, elles ne servent qu'à vérifier la cohérence des données (cf Acceptance Criteria).
- [x] `src/domain/catalog/index.ts` -- Fonctions pures `listerNiveaux()`, `listerExercices(niveau)`, `getExercice(id)`, `getFigure(id)` -- API de lecture seule pour les couches supérieures (AD-6).
- [x] `src/index.css` -- Ajouter les variables `--table-*`/`--ball-*`/`--pocket` de DESIGN.md -- tokens requis par `TableDiagram`.
- [x] `src/adapters/ui/shared/TableDiagram.tsx` -- Composant SVG rendant feutre/bandes/6 poches fixes + billes d'une Figure ; flèche+poche cible seulement si Bronze ; label d'ordre seulement si `ordrePoche` non-null ; ligne pointillée si `zoneReplacement` -- coeur de FR-2 (AD-2).
- [x] `src/adapters/ui/App.tsx` -- Harnais temporaire : sélecteur niveau → liste d'exercices → `TableDiagram` de l'exercice choisi -- preuve visuelle de FR-1/FR-2.

**Acceptance Criteria :**
- Given le niveau Bronze, when on liste ses exercices, then on obtient exactement 20 exercices (figures A-F), chacun `nombreBillesSequence: 1`.
- Given l'exercice `argent-e`, when on affiche son schéma, then `TableDiagram` rend 2 billes rouges + 1 noire numérotées 1/2/3, sans flèche.
- Given `or-a` (ordre libre), when on affiche son schéma, then aucun label de numéro n'est rendu.
- Given `or-e` ou `or-f`, when on affiche le schéma, then aucune bille blanche n'est positionnée et la ligne de zone de replacement est visible.
- Given les 35 exercices d'un niveau, when on calcule `Σ(nombreBillesSequence) × valeur du 1er essai`, then le total vaut exactement 100 pour chacun des 3 niveaux (Bronze 20×5 ; Argent Σbilles=25×4 ; Or Σbilles=25×4, où Or F contribue 5 billes et les 5 autres exercices Or 4 chacun) — vérifie la cohérence des données transcrites.

## Implementation Notes

- Implémenté par sous-agent (2026-09-06), une correction post-hoc appliquée : `bronze-c-1` avait `pocheCible: 'haut-gauche'` (copié depuis `content-catalog.md` avant sa correction) au lieu de `haut-milieu` — corrigé après vérification directe contre le PDF p.14 (les flèches de C1 et C2 ne convergent pas vers la même poche). `npm run build` re-vérifié après correction.
- Modélisation clé : la poche cible par bille vit sur `Figure.balls[].pocheCible` (pas sur `Exercice`), car la matrice I/O gelée exige que les 4 billes d'une Figure Bronze rendent leurs flèches identiquement quel que soit l'exercice sibling affiché. `Exercice.ordrePoche` porte des indices dans `Figure.balls`, utilisés uniquement pour les labels d'ordre Argent/Or.
- Vérification empirique des 4 lignes de la matrice I/O + du critère de somme à 100 pts : exécutée directement (Node, hors navigateur) contre `listerExercices`/`getFigure`/`getExercice` — les 4 scénarios et les 3 totaux (Bronze 100, Argent 100, Or 100) sont confirmés corrects.
- Non vérifié visuellement dans un navigateur (`npm run dev`) faute d'affichage dans cet environnement — la vérification manuelle listée ci-dessous reste à faire par un humain.
- Revue (2026-09-06) : 2 patches appliqués — `aria-label` de `TableDiagram` interpolé par exercice, et `scripts/verify-catalog.mjs` ajouté (garde-fou natif Node, `npm run verify-catalog`) pour protéger les invariants de contenu contre une régression de transcription future. `npm run build` et `npm run verify-catalog` repassent après patch.

## Review Triage Log

- **[patch]** `TableDiagram.tsx` : label Bronze dérivé de l'index brut du tableau `balls[]` (pas d'un champ explicite) — repose silencieusement sur l'invariant "la bille blanche est toujours `balls[0]`", non vérifié par le compilateur ni à l'exécution ; une future édition du catalogue pourrait décaler tous les labels sans erreur visible. **medium** (fidélité de contenu scoré ; probable seulement si le catalogue est retouché, mais alors silencieux). Fix : ajouter l'invariant au script `scripts/verify-catalog.mjs` plutôt que refactorer le modèle (catalogue fermé/embarqué, pas de cas d'usage runtime).
- **[patch]** Aucun garde-fou automatisé ne protège les 35 exercices/11 figures transcrits à la main (aucun framework de test dans le projet) — les nombreuses corrections faites cette session (Bronze B1/C1/C2/F3, comptage Or A/B) montrent que cette transcription est source d'erreur. Fix : script Node natif (`scripts/verify-catalog.mjs`, sans nouvelle dépendance) vérifiant les 4 lignes de la matrice I/O + le critère de somme à 100 pts, déjà validés une fois à la main.
- **[patch]** `TableDiagram.tsx` : `aria-label` du SVG statique et identique pour les 35 exercices — un lecteur d'écran ne distingue pas quel schéma est affiché. Fix trivial : interpoler `exercice.enonce`/`figure.id`.
- **[patch]** `catalog-grid-or.md` Exercice E : phrase de résolution auto-contradictoire ("only 3 red + 3 yellow" puis "disputed 2 vs 3") — corrigé directement (doc uniquement, hors code) : le tableau garde le comptage structuré (2 rouges), la phrase explique maintenant clairement le désaccord au lieu de se contredire.
- **[low, patch]** `catalog-grid-or.md` Exercice B : la bille noire était étiquetée "blocker" alors qu'elle conclut la séquence (comme A/C/D/F) — corrigé directement (doc uniquement) : "final".
- **[low, patch]** Spec `Tasks & Acceptance` : le calcul de somme omettait qu'Or F contribue 5 billes (pas 4) ; le libellé de la tâche `data.ts` laissait penser que barème/seuils étaient stockés dans `domain/catalog` alors qu'ils appartiennent à `domain/scoring` (hors scope) — corrigés directement (spec, section non gelée).
- **[false]** `App.tsx` : accès non gardé à `getFigure`/`getExercice` pouvant retourner `undefined` — vérifié : `exerciceCourantId` retombe toujours sur un id valide de la liste courante (`exercices.some(...) ? exerciceId : exercices[0]?.id`), et toutes les `figureId` référencées par un Exercice résolvent (vérifié empiriquement sur les 35 exercices) ; l'état "figure/exercice introuvable" n'est pas atteignable avec les données actuelles.
- **[false, rejected]** `TableDiagram.tsx` : ligne de zone de replacement à x=20 codé en dur, pas paramétrable par Figure — vérifié : les deux seules Figures concernées (or-e, or-f) partagent exactement cette valeur (cf catalog-grid-or.md) ; le catalogue est fermé/embarqué (pas d'édition in-app, architecture §Deferred), rendre ceci configurable ajouterait un champ pour un cas hypothétique jamais rencontré.
- **[false, rejected]** `domain/catalog/index.ts` : les fonctions retournent des références directes aux tableaux partagés (pas de clone), risque de mutation — vérifié : le seul consommateur actuel (`App.tsx`) ne fait que lire ; aucun chemin de mutation atteignable dans le code actuel.
- **[low, rejected]** Harnais (`App.css`) : couleurs hex codées en dur au lieu des tokens `--table-*`/`--ball-*` introduits par ce même diff — vérifié : ces tokens ne couvrent que `table-diagram` (portée explicite du Code Map), pas la palette générale (`accent-primary` etc., hors scope) ; le harnais est explicitement temporaire par l'Intent ("en attendant l'écran Accueil réel"), sera supprimé, pas remplacé.
- **[false, rejected]** `content-catalog.md` §2 : généralisation obsolète sur la "quantité de bille" (dit "Argent A/B/C uniquement" alors que §5/data.ts en portent aussi sur E-I) — vérifié préexistant, non touché par ce diff (**defer**, mais un correctif d'une ligne dans un futur passage sur ce fichier est peu coûteux — noté sans action requise ici).
- **[false, rejected]** Argent E n'a pas d'annotation "confirmed by Fifi" contrairement à D/F/G/H/I — vérifié : cette annotation n'a jamais été ajoutée par erreur d'omission, c'est le comptage de *cette session* (agent d'extraction), pas Fifi, qui l'a confirmé ; ne pas fabriquer une attribution inexacte n'est pas un défaut.
- **[rejected — fix would edit this build's spec]** La matrice I/O gelée n'exerce aucun scénario avec billes "obstacle" non étiquetées (argent-d/e, or-c/d/e/f) — vérifié empiriquement que le rendu actuel est déjà correct (pas de label, pas de flèche) pour `argent-e-1` ; le seul correctif possible serait d'ajouter une ligne à la matrice gelée, exclu par la règle de triage.
- **[false, rejected]** L'Intent gelé n'explique pas pourquoi la ligne de bande ("baulk line", visible sur les 35 schémas sources) n'est rendue que pour Or E/F — vérifié : DESIGN.md ne demande cette ligne que pour la zone de replacement (Or E/F) ; aucune exigence produit n'impose de la dessiner ailleurs, donc rien n'a été omis par erreur.

## Design Notes

**Corrections apportées à `content-catalog.md` (2026-09-06), vérifiées directement contre le PDF source :**
- Bronze B1 (rouge) cible en réalité la poche bas-gauche, pas haut-milieu.
- Bronze C1 (jaune) cible la poche haut-milieu, pas haut-gauche (haut-gauche est la cible de C2, une poche distincte).
- Bronze C2 est rouge, pas noire (aucune bille noire dans la Figure C).
- Bronze F3 (rouge) cible la poche bas-gauche, pas bas-droite.
- Or A et B comptent chacun 3 billes de leur couleur + noire (4 billes), pas 2 comme le raccourci du catalogue le suggérait.
- **Aucune flèche/poche cible n'existe dans les diagrammes source Argent ni Or** (confirmé par deux relectures indépendantes) — c'est une particularité du Bronze uniquement. `TableDiagram` ne doit donc jamais dessiner de flèche pour Argent/Or.
- Or E : deux relectures indépendantes ne localisent pas de bille noire visible dans ce diagramme précis (probable confusion avec la grille de points, le risque même que `content-catalog.md` §2 documente). La confirmation de Fifi (`nombreBillesSequence = 4`) fait foi pour le score ; le schéma affiché ne doit rendre que les billes effectivement visibles dans la source, sans en inventer une.
- **Validation croisée** : la somme des billes de séquence × 4 pts vaut exactement 100 pour Argent (9 exercices, Σ=25) et pour Or (6 exercices, Σ=25 avec Or A/B à 4 billes et Or E à 4) — cohérent avec le calibrage à 100 pts que le règlement revendique, ce qui corrobore ces corrections.

**Format des coordonnées :** pourcentage de la surface de jeu (x/y 0-100), converti en coordonnées SVG selon le rectangle feutre du mockup (`x_px = 30 + x%/100 × 440`, `y_px = 30 + y%/100 × 200`, viewBox `500×260`).

## Verification

**Commands :**
- `npm run build` -- expected: compile sans erreur TypeScript (valide la forme des 35 entrées Figure/Exercice).
- `npm run verify-catalog` -- expected: `OK` — script Node natif (`scripts/verify-catalog.mjs`, ajouté en revue) vérifiant les 4 scénarios de la matrice I/O + le critère de somme à 100 pts contre les données réelles.

**Manual checks (if no CLI) :**
- `npm run dev`, ouvrir le harnais : vérifier visuellement un exemple Bronze (flèche visible), un Argent (labels d'ordre, pas de flèche), un Or sans ordre (aucun label), et `or-e`/`or-f` (pas de bille blanche, ligne pointillée).
