---
title: Brief Produit - Carnet de Score Blackball DFA
status: draft
created: 2026-09-05
updated: 2026-09-05
---

# Product Brief: Carnet de Score Blackball DFA

## Executive Summary

Fifi s'entraîne au blackball en vue des Diplômes Fédéraux d'Aptitude (D.F.A.) de la F.F.B. — Bronze, Argent, Or — chacun basé sur un programme d'exercices officiel (schéma + barème de points par essai). Le papier et le tableur, essayés puis abandonnés, imposent soit un stylo en main pendant le jeu, soit une ressaisie sur ordinateur après coup : trop de friction pour un suivi régulier. Ce projet est une application mobile qui affiche le schéma officiel de chaque exercice et permet de saisir le score en quelques gestes, seul, en salle, sans matériel annexe — et qui conserve un historique des séances pour suivre la progression vers les seuils de réussite (50/60/70 points sur 100).

## The Problem

En salle, Fifi s'auto-évalue seule sur les programmes d'exercices du règlement D.F.A., sans arbitre-animateur. Deux méthodes de suivi ont déjà été essayées et abandonnées :
- **Papier** : nécessite d'avoir la feuille de marque et un stylo sur soi pendant qu'on joue, une main déjà occupée par la queue.
- **Tableur** : reporte la contrainte au retour, sous forme de ressaisie sur PC — la séance n'est jamais notée à chaud, et le report est souvent repoussé puis abandonné.

Résultat : plus aucun suivi n'est tenu aujourd'hui, alors que le règlement D.F.A. définit précisément la structure d'évaluation (exercice → jusqu'à 3 essais → meilleur essai retenu → total sur 100 → seuil du diplôme).

## The Solution

Une application mobile, pensée pour être utilisée à une main, sur la table, entre deux coups :
- Choisir le niveau (Bronze / Argent / Or) puis l'exercice à réaliser.
- Voir le schéma officiel de l'exercice (position des billes, quantité de bille visée).
- Saisir le résultat de chaque essai (jusqu'à 3) d'un geste simple ; l'app retient automatiquement le meilleur essai et calcule le score de l'exercice selon le barème du niveau.
- Voir le total de la séance se construire au fur et à mesure, comparé au seuil de réussite du diplôme visé.
- Retrouver l'historique des séances passées pour suivre sa progression dans le temps.

## What Makes This Different

- Construite directement sur le contenu officiel du règlement D.F.A. de la F.F.B. (35 exercices répartis sur 3 niveaux, avec leurs schémas et barèmes propres) plutôt qu'un carnet de score générique.
- Zéro friction de saisie : ni stylo requis en jeu, ni ressaisie différée sur PC — les deux frictions qui ont fait abandonner les méthodes précédentes disparaissent.
- [HYPOTHÈSE] Fonctionne hors-ligne : une salle de billard n'offre pas toujours une connexion fiable, l'app ne doit pas en dépendre.

## Who This Serves

**Utilisatrice principale : Fifi**, joueuse de blackball s'entraînant seule en salle vers les D.F.A. Bronze/Argent/Or, sans arbitre-animateur présent. Elle veut savoir, séance après séance, si son niveau de jeu du moment atteindrait le seuil du diplôme visé.

[HYPOTHÈSE] Secondaire, hors v1 : d'autres joueurs ou clubs pratiquant l'auto-évaluation D.F.A. pourraient avoir le même besoin, si l'usage personnel se révèle utile.

## Success Criteria

- Le papier et le tableur sont totalement remplacés : chaque séance d'entraînement est saisie dans l'app.
- Saisir le score d'un exercice prend quelques secondes, à une main, sans interrompre la séance.
- Fifi peut voir en un coup d'œil si sa séance en cours franchirait le seuil du diplôme visé, et comment son total évolue séance après séance.

## Scope

**Dans le périmètre (v1) :**
- Catalogue des 3 niveaux (Bronze/Argent/Or) avec leurs exercices officiels, schémas, barèmes par essai, et seuils de réussite.
- Parcours de séance : choix du niveau → liste des exercices → pour chaque exercice, affichage du schéma et saisie du résultat des essais (jusqu'à 3, meilleur essai retenu) → total en cours vs seuil.
- Historique des séances passées, consultable pour suivre la progression.

**Hors périmètre (v1) :**
- Comptes multi-utilisateurs, partage/classement club, synchronisation cloud.
- Mode « compétition officielle » (rôle arbitre-animateur, feuille de résultat imprimable, remontée F.F.B.).
- Toute autre discipline de billard que le Blackball D.F.A.

## Vision

Si l'outil tient sa promesse pour l'entraînement personnel de Fifi, il devient un modèle simple qu'un club ou un animateur pourrait remettre à ses jeunes joueurs pour s'entraîner en autonomie entre deux sessions D.F.A. encadrées — transformant une feuille de marque papier ponctuelle en un vrai outil de suivi de progression vers le Bronze, l'Argent et l'Or.
