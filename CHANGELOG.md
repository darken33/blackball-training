# Changelog

Format inspiré de [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/) ; versionnement [SemVer](https://semver.org/lang/fr/).
La version affichée dans l'application (en haut à droite des écrans) vient du champ `version` de `package.json`.

## [1.1.1] — 2026-10-07

### Corrigé
- Onglet Stats : une erreur de chargement des séances affiche désormais un message d'erreur au lieu de « Aucune séance terminée ».

### Modifié
- Écran titre allégé (837 Ko → 164 Ko) : l'image du splash est précachée par la PWA, elle alourdissait le premier chargement.

## [1.1.0] — 2026-10-05

### Ajouté
- **Onglet Stats** : à partir de l'historique, répond à « est-ce que je progresse ? » et « quels exercices me posent problème ? ».
  - Courbe de **progression** (difficulté moyenne par séance, échelle *Maîtrisé / Fragile / Limite / Problème*).
  - **Points faibles** : les 5 exercices les plus difficiles du niveau choisi.
  - Exercices **à tenter** (jamais joués) et exercices trop peu joués pour être évalués (moins de 3 séances).
  - Calculé sur les 10 dernières séances terminées, les plus récentes pesant davantage. Indicateur d'entraînement distinct du barème officiel F.F.B.
- **Numéro de version** affiché en haut à droite des écrans (hors écran Exercice et splash).
- Garde-fou `npm run verify-stats`.

### Modifié
- Écran titre mis à jour (la mention « Version 1.0 (MVP) » n'est plus d'actualité).

## [1.0.2] — 2026-09-14

### Corrigé
- Règle des boutons *Rejouer* / *Exercice suivant* : elle dépend désormais d'une faute ou d'un succès, et non plus du score.

## [1.0.1] — 2026-09-10

### Corrigé
- Plus de proposition de *Rejouer* après un succès complet en essai 2 ou 3.

## [1.0.0] — 2026-09-07

Première version publiée.

### Ajouté
- Catalogue officiel D.F.A. Bronze, Argent et Or (35 exercices), avec les schémas du règlement.
- Parcours de séance à niveau fixe : saisie d'essai à une main, score calculé en continu et comparé au seuil du diplôme.
- Historique des séances passées, en lecture seule.
- PWA 100 % hors-ligne, installable sans store, déployée sur GitHub Pages.
- Écran titre au démarrage.
