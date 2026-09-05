---
id: SPEC-blackball-training
companions:
  - glossary.md
  - ../../planning-artifacts/prds/prd-blackball-training-2026-09-05/content-catalog.md
  - ../../planning-artifacts/architecture/architecture-blackball-training-2026-09-05/ARCHITECTURE-SPINE.md
  - ../../planning-artifacts/ux-designs/ux-blackball-training-2026-09-05/DESIGN.md
  - ../../planning-artifacts/ux-designs/ux-blackball-training-2026-09-05/EXPERIENCE.md
sources:
  - ../../planning-artifacts/briefs/brief-blackball-training-2026-09-05/brief.md
  - ../../planning-artifacts/briefs/brief-blackball-training-2026-09-05/addendum.md
  - ../../planning-artifacts/prds/prd-blackball-training-2026-09-05/prd.md
  - ../../planning-artifacts/prds/prd-blackball-training-2026-09-05/addendum.md
---

> **Contrat canonique.** Ce SPEC et les fichiers listés dans `companions:` forment le contrat complet et validé pour ce qui doit être construit, testé et validé. Les documents de `sources:` sont conservés pour traçabilité — à consulter seulement pour la rationale narrative que ce contrat omet volontairement.

# Carnet de Score Blackball DFA

## Pourquoi

Fifi s'entraîne seul, en salle de billard et sans arbitre-animateur, vers les Diplômes Fédéraux d'Aptitude (D.F.A.) de la F.F.B. — Bronze, Argent, Or. Le papier (stylo requis pendant le jeu, une main déjà occupée par la queue) et le tableur (ressaisie différée après la séance, toujours repoussée puis abandonnée) ont chacun été essayés puis abandonnés : la friction de saisie a fait disparaître tout suivi. Cette application remplace les deux à la fois : elle affiche le schéma officiel de chaque exercice et permet de saisir le résultat d'un geste simple à une main, en calculant automatiquement le score selon le barème exact du règlement — y compris pour les exercices Argent/Or où plusieurs billes s'enchaînent dans un même essai.

## Capabilities

- **CAP-1** — Catalogue de contenu D.F.A.
  - **intent:** Le joueur peut consulter, pour chaque niveau (Bronze/Argent/Or), la liste officielle de ses exercices, chacun avec son schéma fidèle et son énoncé.
  - **success:** Les 35 exercices (Bronze 20, Argent 9, Or 6) sont tous présents, chaque schéma est tracé depuis les données de grille du catalogue (jamais une composition libre), vérifiable exercice par exercice contre `content-catalog.md`.

- **CAP-2** — Saisie de séance et moteur de notation
  - **intent:** Le joueur peut jouer une séance à niveau fixe, saisir le résultat de chaque essai d'un geste simple à une main, et voir son score calculé automatiquement selon le barème officiel — y compris pour les séquences multi-billes Argent/Or.
  - **success:** Le score d'un essai = nombre de billes de la séquence empochées × valeur de barème de cet essai ; le score d'exercice = le meilleur essai retenu. Démontrable sur les deux exemples officiels chiffrés du règlement (Bronze p.43, Argent p.45, cf `content-catalog.md`).

- **CAP-3** — Suivi du score total en continu vs seuil
  - **intent:** Le joueur voit, à tout moment pendant la séance, si son score cumulé franchirait le seuil de réussite du diplôme visé.
  - **success:** Le total affiché se met à jour immédiatement après chaque exercice saisi, sans action supplémentaire, et l'écart au seuil (50/60/70 selon le niveau) est visible sans calcul mental.

- **CAP-4** — Clôture et verrouillage de séance
  - **intent:** Une fois tous les exercices du niveau saisis, la séance est marquée terminée et son résultat figé.
  - **success:** Après clôture, aucune donnée de la séance (scores, essais) n'est modifiable ni supprimable ; une séance quittée avant d'avoir couvert tous les exercices du niveau n'apparaît jamais dans l'historique.

- **CAP-5** — Historique en lecture seule
  - **intent:** Le joueur peut consulter la liste de ses séances passées et le détail par exercice/essai de chacune.
  - **success:** L'historique liste les séances clôturées, triées de la plus récente à la plus ancienne (date, niveau, score total, seuil atteint ou non), et permet d'ouvrir le détail par exercice et par essai — aucune action d'édition ou de suppression n'est exposée.

## Constraints

- 100% hors-ligne : PWA installable, service worker mettant en cache tous les assets nécessaires (schémas, code) dès l'installation ; aucune dépendance réseau en usage.
- Toutes les données de séance restent sur l'appareil : pas de compte, pas de synchronisation cloud, aucune donnée envoyée à un tiers.
- Le catalogue des 35 exercices (schémas, barèmes, séquences) est fixe et embarqué dans l'app — pas d'édition de contenu in-app (pas de CMS) ; toute mise à jour passe par une nouvelle version de l'app.
- Le barème et les seuils de réussite suivent strictement le règlement F.F.B. en vigueur — non personnalisables.
- Toute saisie d'essai doit être exécutable au pouce, à une main, sans clavier, avec une cible tactile ≥ 44dp.
- Une séance ne mélange jamais plusieurs niveaux : le niveau est choisi au démarrage et fixe pour toute sa durée — il détermine le catalogue, le barème et le seuil applicables.
- Les maquettes UX (DESIGN.md, EXPERIENCE.md, mockups) illustrent uniquement les patterns d'interaction et le visuel ; elles ne font jamais autorité sur le contenu réel d'un exercice (nombre de billes, ordre de poche, géométrie du schéma) — seule autorité : `content-catalog.md`.
- La saisie ne doit jamais être simplifiée au point de perdre la fidélité du score réel (pas de saisie automatique ou approximative) — le nombre de séances enregistrées n'est jamais optimisé au détriment de cette fidélité.
- Une séance clôturée est immuable : aucune modification ni suppression de ses scores ou essais après clôture.
- Une séance quittée avant d'avoir couvert tous les exercices du niveau est abandonnée : aucune progression partielle n'est conservée, pas de reprise ultérieure d'une séance abandonnée. Ceci est distinct d'une mise en arrière-plan ou d'un verrouillage d'écran passager pendant une séance active, qui ne doivent jamais effacer la progression en cours.
- Le score affiché n'est jamais une valeur saisie ou stockée à plat : il est toujours dérivé, à la lecture, des billes empochées par essai selon le barème du niveau.

## Non-goals

- Comptes multi-utilisateurs, partage ou classement club, synchronisation cloud.
- Mode « compétition officielle » (rôle arbitre-animateur, feuille de résultats imprimable, remontée F.F.B.).
- Toute autre discipline de billard que le Blackball D.F.A.
- Personnalisation du barème ou des seuils de réussite.
- Édition ou suppression d'une séance après sa clôture.
- Contenu pédagogique sur les techniques (coulé, rétro, effet latéral) ou les pages d'introduction officielles par niveau — l'app affiche le schéma et le barème par exercice, pas un tutoriel.
- Vérification ou blocage des prérequis pédagogiques entre niveaux — le choix du niveau reste entièrement libre à chaque séance.
- Édition de contenu in-app (pas de CMS pour le catalogue des 35 exercices).
- Reprise d'une séance explicitement abandonnée (à distinguer de la résilience à un verrouillage d'écran/arrière-plan, couverte en Constraints).

## Success signal

Fifi utilise l'app pour la totalité de ses séances d'entraînement — zéro séance reportée sur papier ou tableur — durant le mois suivant sa mise en service, et sait à tout moment, sans calcul mental et sans interrompre son jeu, si sa séance en cours franchirait le seuil du diplôme visé.

## Assumptions

- Aucune notion de compte ou de profil n'est nécessaire en v1 : un seul jeu de données local, implicite (usage strictement mono-utilisateur).
- Pas de mode clair : le thème sombre est le seul look de l'app, cohérent avec l'absence de tout écran Réglages en v1.
- « Reprise d'une séance interrompue » (hors périmètre) désigne la reprise après un abandon **explicite** de la part du joueur — fermer l'app, verrouiller l'écran, ou changer d'onglet ne sont jamais des abandons ; la séance en cours est retrouvée telle quelle à la réouverture tant qu'aucun abandon explicite n'a eu lieu.
