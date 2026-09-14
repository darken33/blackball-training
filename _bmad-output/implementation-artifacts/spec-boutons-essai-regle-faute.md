---
title: 'Régle simple (faute vs succès) pour les boutons Rejouer/Exercice suivant'
type: 'bugfix'
created: '2026-09-14'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context: []
baseline_commit: '3d2ae8e3c8c32515e1e899e014056e4d9399e19e'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** `src/application/session/useSession.ts` décide d'afficher "Rejouer l'essai" en comparant le score retenu à un plafond théorique (`plafondProchainEssai`, le meilleur score qu'un succès complet au prochain essai pourrait apporter). Cette heuristique masque à tort le bouton après une FAUTE avec essais restants dès que le score déjà obtenu est proche ou égal à ce plafond (ex. essai 1 empoche 3/4 billes puis faute : score partiel élevé au barème de l'essai 1 déjà ≥ ce qu'un succès complet à l'essai 2, barème plus faible, pourrait apporter). Or la règle métier voulue ne dépend pas du score : c'est uniquement la nature de la clôture (faute vs succès complet) et le nombre d'essais déjà joués qui décident.

**Approche :** Dans `useSession.ts`, remplacer `plafondProchainEssai` et son usage (dans le `useMemo` `exerciceEnCours` et dans `rejouerEssai`) par une règle directe basée sur `essai.faute` et `essaisCourant.length` :
- Essai clos par succès complet (pas faute) → `peutRejouer = false` (seul "Exercice suivant" doit être proposé, quel que soit le score).
- Essai clos par une faute avec moins de 3 essais déjà joués → `peutRejouer = true`.
- Essai clos par une faute avec 3 essais déjà joués → `peutRejouer = false`.

Supprimer le helper `plafondProchainEssai` (et son commentaire associé) devenu inutile — aucune autre référence dans le code (confirmé par recherche). `rejouerEssai` doit refuser d'avancer dans les mêmes cas où `peutRejouer` serait `false` (garde-fou miroir). Aucun autre fichier ne change : `Exercice.tsx` ne fait que lire `peutRejouer`/`essaiClos` sans recalcul (confirmé), `EssaiButtons.tsx` n'est pas concerné.

</frozen-after-approval>

## Implementation Notes

Implémenté directement (pas de subagent, correctif localisé, cause déjà comprise avant la spec).

Fichier touché : `src/application/session/useSession.ts`. `plafondProchainEssai` (et son commentaire) supprimé, remplacé par `essaiRejouable(dernier, essaisJoues)` — `return dernier.faute && essaisJoues < 3`. Utilisé aux deux endroits :
- `rejouerEssai` : `if (!essaiRejouable(dernier, sessionActive.essaisCourant.length)) return` (garde-fou, en plus de la garde `essaiEstClos` déjà présente).
- `useMemo` `exerciceEnCours` : `peutRejouer: essaiCourant.clos && essaiRejouable(dernier, sessionActive.essaisCourant.length)`.

`calculerScoreExercice` reste utilisé (pour `scoreExerciceRetenu`, toujours affiché) ; seul son usage dans le calcul du plafond a disparu.

`npm run build` : succès (tsc + vite), aucune erreur.

Vérifié en navigateur réel (Playwright) :
- Bronze, essai 1 succès complet immédiat → pas de Rejouer, seulement Exercice suivant.
- Argent (exercice à 2 billes), essai 1 : empoche 1/2 billes puis faute (score partiel déjà élevé) → Rejouer proposé (c'était le cas que l'ancienne heuristique de plafond masquait à tort). Rejoué, essai 2 réussi en entier → Rejouer disparaît, seul Exercice suivant reste.
- Bronze, 3 fautes consécutives (essais 1, 2, 3) → Rejouer proposé après essai 1 et essai 2, absent après l'essai 3 (essais épuisés) ; Exercice suivant toujours présent aux quatre étapes.
- Aucune erreur console/page dans les trois scénarios.

**Patch post-revue (cf. Review Triage Log) :** la valeur `3` (nombre max d'essais) était dupliquée entre le garde-fou déjà présent en tête de `rejouerEssai` et le nouveau `essaiRejouable` — extraite en constante `NOMBRE_ESSAIS_MAX = 3`, et le garde-fou devenu redondant en tête de `rejouerEssai` (`if (essaisCourant.length >= 3) return`) supprimé puisque `essaiRejouable` couvre déjà ce cas (il est maintenant la seule source de vérité, comme le dit son JSDoc). JSDoc de `essaiRejouable` complété : précondition (`dernier` doit déjà être clos) et sens du paramètre `essaisJoues`. Revérifié après ces patches : `npm run build` + les mêmes scénarios Playwright (comportement identique).

## Review Triage Log

Une couche (blind-hunter) sur le fichier modifié. Taille du diff ≈ 3,57 Ko → N = min(floor(sqrt(3.57)+1), 10) = 2 ; 6 signalements rendus.

- **Valeur `3` (nombre max d'essais) dupliquée sans constante partagée** — verdict: **low** — vérifié (trois occurrences littérales) → **patch** (extraction en `NOMBRE_ESSAIS_MAX`).
- **Garde-fou `essaisCourant.length >= 3` en tête de `rejouerEssai` devenu redondant avec `essaiRejouable`** — verdict: **low** — vérifié par lecture (les deux vérifient la même condition) → **patch** (garde-fou supprimé, `essaiRejouable` devient la seule source de vérité comme annoncé par son propre commentaire).
- **`essaiRejouable` non exportée, donc pas testable isolément par un script `verify-*.mjs`** — verdict: **low** — rejeté, cohérent avec le précédent déjà établi dans ce repo (`useSession.ts` importe React et `adapters/persistence/repository` (Dexie) ; même en exportant la fonction, un script `node --experimental-strip-types` qui l'importerait évaluerait tout le module et ses imports Dexie/React, ce qui l'exclut du même motif déjà accepté pour `useSession`/`useHistorique`) → **rejeté**.
- **Aucun `verify-session.mjs` couvrant les 3 scénarios vérifiés manuellement** — même cause racine que le point précédent (le fichier n'est pas éligible au motif de script léger) → **rejeté**.
- **JSDoc de `essaiRejouable` ne documente pas la précondition (`dernier` déjà clos) ni le sens de `essaisJoues`** — verdict: **low** — réel → **patch** (JSDoc complété).
- **Etat théorique `faute: true` ET `billesEmpochees >= nombreBillesSequence` simultanés, qui ferait considérer `essaiRejouable` un essai comme rejouable à tort** — verdict: **false** — seuls `tapBille`, `tapFaute` et `rejouerEssai` écrivent des `EssaiJoue`, et chacun exige `!essaiEstClos(dernier)` (donc `billesEmpochees < nombreBillesSequence` et `faute` encore `false`) avant de muter — `tapFaute` ne peut donc jamais produire un essai où `billesEmpochees` a déjà atteint la cible ; cette combinaison ne peut donc jamais être persistée, ni revenir via `getDetailSession` à la reprise. Même refutation déjà établie lors d'une story précédente pour un signalement identique sur `formatEssaiTexte`.
