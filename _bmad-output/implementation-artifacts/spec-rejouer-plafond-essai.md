---
title: 'Bouton Rejouer proposé à tort après un succès complet en essai 2/3'
type: 'bugfix'
created: '2026-09-10'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context: []
baseline_commit: '8b05ebcdee355f0f7b70fc40244f8cfafca6c54f'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Après une faute à l'essai 1 puis un rejeu réussi (toutes les billes empochées) à l'essai 2, le bouton "Rejouer l'essai" reste affiché à tort — seul "Exercice suivant" devrait l'être, puisqu'un 3e essai (barème plus faible) ne peut plus améliorer le score retenu. Cause : `application/session/useSession.ts` (le calcul de `peutRejouer` dans le `useMemo` `exerciceEnCours`, et le garde-fou identique dans `rejouerEssai`) comparent le score retenu à un plafond **figé sur le barème de l'essai n°1** (`calculerScoreEssai(niveau, 1, nombreBillesSequence)`), au lieu du plafond réellement atteignable au **prochain essai disponible** (`essaisCourant.length + 1`). Un succès complet obtenu à l'essai 2 ou 3 reste toujours sous ce plafond figé (plus haut que ce qui est encore jouable), donc le rejeu continue d'être proposé/accepté alors qu'il ne peut plus rien améliorer.

**Approche :** Dans les deux endroits (le `useMemo` et `rejouerEssai`), remplacer le plafond figé par `calculerScoreEssai(niveau, prochainIndex, nombreBillesSequence)` où `prochainIndex = essaisCourant.length + 1` (1|2|3) — le meilleur score que l'essai suivant pourrait encore apporter. Garder la garde `essaisCourant.length < 3` avant de calculer cet index (jamais d'index 4). Aucun autre fichier n'est concerné : `EssaiButtons.tsx`, `Exercice.tsx` et `domain/scoring` ne changent pas.

</frozen-after-approval>

## Review Triage Log

Une couche (blind-hunter) sur les fichiers modifiés. Taille des changements ≈ 5,7 Ko → N = min(floor(sqrt(5.73)+1), 10) = 3 ; 7 signalements rendus.

- **Logique de plafond dupliquée entre `rejouerEssai` et le `useMemo` — cause structurelle du bug initial, non corrigée par la simple duplication du correctif** — verdict: **medium** — vérifié (copié-collé confirmé) → **patch** (extraction dans `plafondProchainEssai`, source unique).
- **`maximum = 0` : valeur de repli jamais lue en pratique (le `&&` court-circuite avant), confuse** — verdict: **low** — vérifié par lecture (`length < 3` place avant `scoreExerciceRetenu < maximum` dans le `&&`) → **patch** (résolu par le même refactor : le helper retourne `null` explicitement, plus de valeur factice).
- **Aucun test de non-régression ajouté** — verdict: **low** — rejeté, cohérent avec le précédent déjà établi dans ce repo (aucune infra de test UI/hooks, `useSession`/`useHistorique` déjà non testés automatiquement) → **rejeté**.
- **`status` du spec resté `in-progress` alors que l'implémentation est déjà décrite comme terminée** — verdict: **low** — réel (ordre normal du processus, pas encore arrivé à l'étape de finalisation au moment de la revue) → **patch** (mis à `done` ci-dessous).
- **Chemin `essaisCourant.length === 3` non re-vérifié en navigateur après le refactor** — verdict: **low** — réel gap de vérification empirique, mais garantie logique directe (`maximum !== null` explicitement faux dans ce cas, pas de dépendance à un ordre d'évaluation) → **rejeté** (vérifié par lecture du code, noté dans Implementation Notes).
- **Niveau "or" jamais testé isolément** — verdict: **low** — rejeté : même tableau de barème que "argent", aucune branche conditionnelle par niveau dans le code touché → **rejeté**.
- **Commentaires explicatifs quasi dupliqués aux deux emplacements** — même cause racine que la duplication de logique → résolu par le même refactor (explication centralisée sur le helper).

## Implementation Notes

Implémenté directement (pas de subagent, correctif localisé et cause racine déjà identifiée avant la spec).

Fichier touché : `src/application/session/useSession.ts` — deux endroits (`rejouerEssai` et le `useMemo` `exerciceEnCours`), même correctif appliqué aux deux (ils dupliquaient déjà le même calcul avant ce correctif). Le plafond de comparaison passe de `calculerScoreEssai(niveau, 1, nombreBillesSequence)` (fixe, essai 1) à `calculerScoreEssai(niveau, prochainIndex, nombreBillesSequence)` où `prochainIndex = essaisCourant.length + 1` — le meilleur score encore atteignable au prochain essai réellement jouable. Dans le `useMemo`, le calcul est gardé derrière `essaisCourant.length < 3` pour ne jamais appeler `calculerScoreEssai` avec un index hors 1|2|3 (le cas `length === 3` retombe de toute façon sur `peutRejouer = false` via la garde déjà existante).

Vérifié en navigateur réel (Playwright), scénario du rapport initial : Bronze, essai 1 faute puis essai 2 rejoué et réussi (séquence complète) → "Rejouer l'essai" n'est plus proposé, seul "Exercice suivant" l'est (score retenu 3 pts affiché). Vérifié aussi que les cas déjà corrects avant ce correctif le restent : succès complet dès l'essai 1 (Bronze) → pas de rejeu proposé ; essai partiel (Argent, faute après 1 bille sur 2) → rejeu bien proposé, et reste proposé après un 2e essai encore partiel (le 3e essai pourrait encore améliorer le score retenu).

**Patch post-revue (cf. Review Triage Log) :** la même logique de plafond était dupliquée telle quelle entre `rejouerEssai` et le `useMemo` `exerciceEnCours` (cause structurelle du bug initial : les deux endroits avaient dérivé). Extraite dans un helper unique `plafondProchainEssai(niveau, essaisJoues, nombreBillesSequence)` (retourne `null` si les 3 essais sont déjà joués), utilisé aux deux endroits — `peutRejouer` se lit maintenant `maximum !== null && ...` au lieu d'un `length < 3` séparé dupliquant la même condition sous une autre forme. Revérifié après refactor : `npm run build` et les mêmes scénarios Playwright (comportement identique).

Cas non re-testé en navigateur après le refactor : les 3 essais déjà joués (`essaisJoues === 3`) → `plafondProchainEssai` retourne `null`, donc `peutRejouer` est `false` par lecture directe du code (pas par court-circuit d'une condition séparée comme avant) — vérifié par relecture, pas par clic (le scénario nécessite un exercice Argent/Or à 2-3 billes joué jusqu'au 3e essai, plus long à mettre en scène qu'un simple clic, et la garantie logique est directe : `maximum !== null` est explicitement `false` dans ce cas, aucune dépendance à l'ordre d'évaluation). Niveau "or" non re-testé isolément : même tableau de barème que "argent" (`[4, 3, 2.5]`) et aucune branche conditionnelle par niveau dans le code touché — testé indirectement via l'identité de code avec "argent".
