---
title: "Statistiques d'entraînement et numéro de version (v1.1.0)"
type: 'feature'
created: '2026-10-05'
status: 'done'
route: 'party-mode'
retroactive: true
review_loop_iteration: 0
context:
  - '../../../experiments/blackball-stats-salle/DECISIONS.md'
baseline_commit: '2bcada8'
delivered_commit: '121bff0'
---

> **SPEC RÉTROACTIVE.** Rédigée *après* l'implémentation, à partir de `experiments/blackball-stats-salle/DECISIONS.md`, du code livré (commit `121bff0`, tag `v1.1.0`) et de `scripts/verify-stats.mjs`. Elle documente ce qui a été conçu en party mode ; elle n'a **pas** servi de contrat avant le code (pas design-first). La conception réelle s'est faite par itération libre avec la salle, d'où les écarts notés en fin de document.

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problème :** L'application n'a aucune notion de version, et l'historique des séances reste une liste en lecture seule : il ne dit ni si le joueur progresse, ni quels exercices lui posent le plus de problèmes. Or le but n'est pas de viser le diplôme mais de **choisir quoi s'entraîner** (D2).

**Approche :** (1) Source unique de version = `package.json`, injectée à la build et affichée. (2) Un onglet **Stats** dérivé de l'historique existant, sans migration de schéma (AD-1 : faits bruts déjà stockés), basé sur un **indice de difficulté** d'entraînement distinct du barème officiel F.F.B.

</frozen-after-approval>

## Capacités

**CAP-1 — Version visible.** Le numéro de version est affiché en haut à droite, en miroir du titre d'écran, une seule fois dans le shell.
- Succès : `v{package.json.version}` apparaît sur Séance (accueil, résumé), Historique et Stats ; **absent** sur l'écran Exercice (bouton Abandonner déjà présent) et sous le splash.
- Contraintes : aucune valeur de version codée en dur ailleurs que `package.json` ; le badge ne capte aucun tap (`pointer-events: none`) et ne recouvre aucun contrôle.

**CAP-2 — Indice de difficulté par exercice (D4).** Pour un exercice joué dans une séance : réussi à l'essai 1 = **0** (maîtrisé), essai 2 = **1** (fragile), essai 3 = **2** (limite), joué sans réussite = **3** (problème), aucun essai = non joué (`null`).
- « Réussi » : `billesEmpochees === nombreBillesSequence` (même règle que `formatEssaiTexte`). L'ordre du tableau d'essais est ignoré, seul `index` compte.
- Succès : cas couverts par `verify-stats.mjs` (`difficulteExercice`).

**CAP-3 — Indice agrégé par exercice (D5, D10).** Sur les **10 dernières séances terminées du niveau** (tri par `demarreeLe`, séances en cours/abandonnées exclues), moyenne **pondérée par la récence** des difficultés des séances où l'exercice a été joué : la plus récente a le poids *n*, la plus ancienne 1 (*n* = nombre de séances de la fenêtre).
- Statut : `a-tenter` (jamais joué dans la fenêtre), `insuffisant` (1 ou 2 séances : pas d'indice, `nbSeances` renseigné), `mesure` (≥ 3 séances : indice dans [0 ; 3]).
- Succès : `calculerStatsNiveau` retourne une entrée par exercice du catalogue, dans l'ordre canonique ; cas pondération, fenêtre de 10, filtre de niveau couverts par les tests.

**CAP-4 — Points faibles (D7).** Les **5 exercices mesurés** du niveau choisi ayant l'indice le plus élevé, par ordre décroissant. Les exercices `insuffisant` et `a-tenter` sont signalés à part (texte), jamais classés (D11).
- Succès : `pointsFaibles(stats, 5)` ; un exercice non mesuré n'y figure jamais.

**CAP-5 — Progression (D8, D12).** Courbe de la difficulté moyenne simple des exercices joués de chaque séance de la fenêtre, du plus ancien au plus récent, filtrable par niveau.
- Affichage : axe vertical à quatre paliers nommés (*Maîtrisé / Fragile / Limite / Problème*, de bas en haut), dates de la première et dernière séance ; minimum 2 séances pour tracer, sinon message explicatif.
- Succès : `progression` ; écran vérifié visuellement par Fifi (échelle ajoutée après un premier retour sur la lisibilité).

**CAP-6 — Entrée dans l'application (D6, D11).** Troisième onglet **Stats** dans la barre du bas, avec un sélecteur de niveau (Bronze par défaut) et un état vide par niveau (« Aucune séance … terminée »).

## Contraintes

- Indicateur d'entraînement **distinct** du barème officiel : `domain/scoring` n'est ni lu ni modifié.
- Faits bruts uniquement (AD-1), calcul dans `application/stats/deriver.ts` (pur, AD-6) ; la persistance n'est appelée que par le hook `useStats` ; aucun import direct de `adapters/persistence` côté UI.
- Aucune migration Dexie : pas d'horodatage par essai dans le modèle, la chronologie repose sur `demarreeLe` de la séance.
- Moins de 3 séances sur un exercice : aucun indice affiché (D3, pas de faux précis). Pas de « probabilité de réussir le diplôme ».

## Hors périmètre

- Prédiction ou jauge de préparation au diplôme.
- Analyse intra-séance (fatigue, ordre des essais) : impossible sans horodatage par essai.
- Prescription automatique de séance (« rejouez ces exercices ») : l'écran informe, le joueur choisit.
- Miniature du schéma dans la liste des points faibles (envisagée, non faite).
- Tests automatiques de l'UI et des hooks.

## Signal de réussite

`npm run verify-stats` passe ; `tsc -b` et `vite build` passent ; sur des séances réelles, l'onglet Stats classe en tête les exercices que le joueur rate effectivement, et la courbe descend quand il progresse. **Ce dernier point reste à constater en usage réel en salle** (D11 validé, test réel prévu).

## Journal de réalisation

- Tests d'abord : `scripts/verify-stats.mjs` écrit avant le code, rouge (module absent) puis vert dès la première implémentation.
- Fichiers : `src/application/stats/{deriver,types,index}.ts`, `src/adapters/ui/stats/Stats.{tsx,css}`, `src/adapters/ui/shared/VersionBadge.{tsx,css}`, `App.tsx` (onglet + badge), `vite.config.ts` (`define: __APP_VERSION__`), `vite-env.d.ts`, `package.json` (1.1.0, script `verify-stats`).
- Mesures de l'expérience (Sonnet 5.5, ~1h30, ~5 % de la fenêtre de 5 h) : voir `experiments/blackball-stats-salle/DECISIONS.md`.

## Écarts connus avec une spec « avant le code »

- Décisions D11 (onglet plutôt que bouton, points faibles limités aux exercices mesurés) prises par l'assistant puis validées après coup par Fifi.
- Échelle du graphique et badge de version nés d'un retour d'usage **après** les décisions initiales, donc absents du plan de départ.
- Aucun critère d'acceptation écrit avant l'implémentation : les assertions de `verify-stats.mjs` en tenaient lieu.
- Aucune revue de code formelle (pas de triage) : seule la vérification automatique et le visuel de Fifi.
