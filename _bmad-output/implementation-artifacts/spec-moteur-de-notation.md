---
title: 'Moteur de notation (domain/scoring)'
type: 'feature'
created: '2026-09-06'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Aucun moteur de calcul du score n'existe — impossible de dériver le score d'un essai, d'un exercice ou d'une séance à partir des billes empochées (FR-5, FR-6, FR-7).

**Approche :** Implémenter `domain/scoring` comme module pur, sans dépendance (AD-6 — pas d'import de `domain/catalog`, React ou Dexie) :
- Score d'un essai = (nombre de billes empochées à cet essai) × (valeur de barème du niveau pour cet essai). Barème : Bronze 5/3/2 (1er/2e/3e essai) ; Argent et Or 4/3/2,5 (glossaire PRD §3).
- Score d'un exercice = le meilleur score d'essai parmi les essais joués (0 à 3) ; 0 si aucun essai n'a réussi à empocher une bille (FR-5, convention architecture "Erreurs/bords").
- Score total de séance = somme des scores d'exercice.
- Statut de seuil = score total ≥ seuil du niveau (Bronze 50, Argent 60, Or 70).
- Cohérent avec AD-1 : ce module ne persiste rien, il ne fait que dériver un score à partir de faits bruts (billes empochées) fournis par l'appelant.

</frozen-after-approval>

## Implementation Notes

- `domain/scoring/types.ts` + `index.ts` créés : `calculerScoreEssai`, `calculerScoreExercice` (meilleur essai retenu, FR-5), `calculerScoreTotal`, `getSeuil`, `estSeuilAtteint`. `Niveau` redéfini localement (pas d'import de `domain/catalog`) pour rester totalement découplé (AD-6) — trois valeurs littérales dupliquées plutôt qu'un couplage inter-module.
- `scripts/verify-scoring.mjs` (Node natif, `assert`, aucune nouvelle dépendance) rejoue les exemples officiels du règlement : barème Bronze 5/3/2, exemple Argent/Or confirmé (3 billes × 4 = 12 pts, addendum.md), exemple worked PRD p.45 ligne A (essai1 4pts, essai2 6pts → meilleur retenu 6, pas 10), exercice sans essai joué → 0, total Bronze parfait 20×5=100 vs seuil 50. `npm run verify-scoring` + `npm run build` passent. Ajouté comme script `npm run verify-scoring`.
- Aucun arrêt/replanification déclenché — aucune surprise, footprint conforme à l'Intent (2 fichiers domain + 1 script de vérification).
- Revue (Blind Hunter) : `calculerScoreExercice` lève désormais une erreur explicite au-delà de 3 essais (au lieu de propager silencieusement un `NaN`, cf Review Triage Log) ; ajout d'une vérification à la compilation (import `type`-only, coût runtime nul) garantissant que le `Niveau` de `domain/scoring` reste synchronisé avec celui de `domain/catalog` ; `verify-scoring.mjs` étendu (barème complet Argent/Or, cas à 3 essais, rejet du 4e essai).

## Review Triage Log

- **[patch, medium]** `calculerScoreExercice` : un essai au-delà du 3e (`indexEssai=4`) produisait un score `NaN` silencieusement ignoré (`NaN > meilleur` est toujours faux) au lieu de signaler l'état invalide — réel risque de fidélité du score si un futur appelant (parcours de séance) passe par erreur plus de 3 essais. Fix : lève une erreur explicite (`3 essais maximum`) ; testé (`verify-scoring.mjs`).
- **[patch, low]** Barème 2e/3e essai Argent/Or (3 et 2,5 pts) jamais testé indépendamment, seul le 1er essai l'était — fix trivial : 6 assertions ajoutées.
- **[patch, low]** Cas complet à 3 essais (FR-5) jamais démontré dans les tests — fix trivial : un cas où le 2e essai (pas le dernier) est le meilleur.
- **[patch, low]** `Niveau` dupliqué entre `domain/scoring` et `domain/catalog` sans garde contre une désynchronisation future (un ajout/renommage de niveau dans un module ne casserait que silencieusement à l'exécution, `BAREME[niveau]` devenant `undefined`) — fix : assertion de type à la compilation (import `type`-only, effacé au build, zéro dépendance runtime, cohérent avec AD-6) ; vérifié qu'elle échoue bien si les deux unions divergent (testé manuellement, revert immédiat).
- **[patch, low]** Aucun JSDoc ne documentait la précondition de `calculerScoreEssai`/`calculerScoreExercice` (bornes de `billesEmpochees`, qui valide N contre le catalogue) — fix trivial : JSDoc ajouté.
- **[false]** Absence de `baseline_commit` dans le frontmatter du spec, jugée incohérente avec `spec-catalogue-contenu-dfa.md` — vérifié : ce champ est spécifique au flux `dispatch` (génération de diff pour la revue multi-couches) ; le flux `oneshot` (celui-ci) ne l'utilise jamais, la revue portant directement sur l'arbre de travail (step-oneshot.md). Pas une incohérence.
- **[low, rejected]** Aucun getter exposant le barème brut (seules les fonctions de calcul le sont) — rejeté : aucun consommateur actuel n'en a besoin (FR-1 dit le barème est *consommé par* le moteur de score, pas qu'il doive être ré-exposé) ; ajouter cette surface serait concevoir pour un besoin hypothétique.
- **[moot, superseded]** `estSeuilAtteint` ne documentait pas son comportement sur un `NaN` — sans objet : le chemin qui produisait ce `NaN` (essai #4) lève désormais une erreur, `NaN` ne peut plus atteindre `estSeuilAtteint` via l'usage documenté.

