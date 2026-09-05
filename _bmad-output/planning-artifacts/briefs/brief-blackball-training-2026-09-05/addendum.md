---
title: Addendum - Carnet de Score Blackball DFA
created: 2026-09-05
updated: 2026-09-05
---

# Addendum

Contenu de référence utile aux documents suivants (PRD, architecture) mais trop détaillé pour le brief exécutif.

## Source officielle

Règlement des Diplômes Fédéraux d'Aptitude (D.F.A.) Billard Blackball, Commission Formation Jeunesse / Direction Technique Nationale, F.F.B. — fichier fourni : `input/reglement-dfa-blackball.pdf` (47 pages). Pages 1-13 ont été lues pour ce brief (structure des 3 niveaux, règles de notation, feuille de marque, format des schémas d'exercice). Les schémas détaillés des 35 exercices s'étendent sur le reste du document (~pages 9 à 46) et restent à extraire intégralement lors du travail de PRD/architecture (catalogue de contenu).

## Règles de notation (identiques dans leur mécanique pour les 3 niveaux)

- Chaque exercice = jusqu'à **3 essais**. La bille blanche est replacée sur son point d'origine avant chaque essai.
- Un essai se termine dès que le joueur loupe l'empoche d'une bille ou commet une faute.
- Seul l'essai ayant rapporté le plus de points est retenu pour l'exercice.
- Barème par essai selon le niveau :
  - **Bronze** : 1er essai = 5 pts, 2e = 3 pts, 3e = 2 pts.
  - **Argent** et **Or** : 1er essai = 4 pts, 2e = 3 pts, 3e = 2,5 pts.
- Score total sur 100 points, seuil de réussite du diplôme :
  - Bronze : 50/100 (20 exercices × 5 pts max)
  - Argent : 60/100 (9 exercices)
  - Or : 70/100 (6 exercices)

## Structure du contenu par niveau

- **Bronze (D.F.A. 1)** : 20 exercices, organisés en figures (schémas de table, ex. « Figure A », « Figure B »...), chaque figure regroupant plusieurs exercices numérotés (souvent décrits comme « Positionner la bille marquée "n" en quantité X de bille »). Porte sur les coups de base : quantités de bille, viser pour empocher, attaque de la blanche sans effet.
- **Argent (D.F.A. 2)** : 9 exercices, coups de base + notions de replacement de la bille blanche.
- **Or (D.F.A. 3)** : 6 exercices, avec notions de lecture de table.

## Hypothèses techniques à valider en PRD/architecture

- Fonctionnement hors-ligne (pas de connexion fiable en salle) — non confirmé explicitement par Fifi, déduit du contexte d'usage (auto-évaluation seule, en salle de billard).
- Stockage local uniquement en v1 (pas de compte ni synchro cloud), cohérent avec l'usage mono-utilisateur.
- Les 35 schémas officiels devront être numérisés (images ou redessinés) à partir du PDF source pour être affichés dans l'app.
