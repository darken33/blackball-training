---
title: Carnet de Score Blackball DFA
status: final
created: 2026-09-05
updated: 2026-09-05
---

# PRD: Carnet de Score Blackball DFA
*Working title — à confirmer.*

## 0. Objet du document

Ce PRD s'adresse à Fifi, à la fois product owner et utilisateur unique de l'app, pour cadrer ce qui doit être construit avant de passer à l'architecture technique. Il s'appuie sur le [Brief Produit](../../briefs/brief-blackball-training-2026-09-05/brief.md) déjà rédigé (problème, solution, périmètre v1) et l'étend avec les exigences fonctionnelles précises. Le contenu exhaustif des 35 exercices officiels (schémas, barèmes, conventions de dessin) vit dans [addendum.md](addendum.md) et [content-catalog.md](content-catalog.md) de ce workspace — ce PRD le référence sans le dupliquer. Vocabulaire : les termes du Glossaire (§3) sont utilisés tels quels partout dans ce document ; les exigences fonctionnelles (FR) sont numérotées globalement.

## 1. Vision

Une application mobile qui remplace le papier et le tableur pour l'auto-évaluation aux Diplômes Fédéraux d'Aptitude (D.F.A.) de billard Blackball : Bronze, Argent, Or. Elle affiche le schéma officiel de chaque exercice, permet de saisir le résultat de chaque essai d'un geste simple à une main — pendant que l'autre main tient encore la queue — et calcule automatiquement le score selon le barème exact du règlement F.F.B., y compris pour les exercices Argent/Or où plusieurs billes s'enchaînent dans un même essai.

Ce que ça change pour Fifi : il peut s'entraîner seul, en salle, sans arbitre-animateur, et savoir en temps réel si sa séance du jour franchirait le seuil du diplôme visé (50/60/70 sur 100) — sans jamais interrompre son jeu pour écrire, et sans jamais avoir à reporter une ressaisie — celle qu'on remet toujours à plus tard et qui, au final, ne se fait jamais. L'historique des séances passées transforme une pratique jusque-là abandonnée en un vrai suivi de progression dans le temps.

## 2. Utilisateur cible

### 2.1 Ce que l'app doit permettre (JTBD)

- Savoir, séance après séance, si mon niveau de jeu actuel franchirait le seuil du diplôme (Bronze/Argent/Or) que je vise.
- Enregistrer un score d'exercice sans interrompre mon jeu ni lâcher ma queue plus que nécessaire.
- Ne plus avoir à ressaisir quoi que ce soit après la séance sur un autre appareil.
- Revoir mes séances passées pour voir si je progresse.

### 2.2 Hors périmètre utilisateur (v1)

L'app est conçue pour un usage strictement mono-utilisateur (Fifi). [ASSUMPTION: aucune notion de compte, de profil, ou de sélection d'utilisateur n'est nécessaire en v1 — un seul jeu de données local, implicite.] Le cas d'autres joueurs/clubs pratiquant l'auto-évaluation D.F.A. est une piste hors v1 (cf Vision du brief), non traitée ici.

### 2.3 Parcours utilisateur clés

- **UJ-1. Fifi fait sa séance Bronze en salle, seul.**
  - **Persona + contexte :** Fifi, en salle de billard, seul, une main sur la queue, vise le diplôme Bronze.
  - **État d'entrée :** ouvre l'app (déjà installée en PWA sur son téléphone Android), aucune séance en cours.
  - **Parcours :** Choisit le niveau "Bronze" → l'app affiche la liste des 20 exercices du niveau → il ouvre le premier exercice, voit le schéma officiel (position des billes, bille et poche visées) → joue son 1er essai, tape "raté" (l'essai suivant se prépare) → rejoue, tape "réussi" au 2e essai → l'app calcule et affiche le score de l'exercice (3 pts, valeur du 2e essai Bronze) et passe à l'exercice suivant.
  - **Climax :** en bas d'écran, le total de la séance progresse au fur et à mesure ("38/100 — seuil Bronze 50") ; Fifi voit en un coup d'œil où il en est sans calcul mental.
  - **Résolution :** dernier exercice saisi, l'app affiche le total final de la séance et si le seuil est atteint ; la séance est enregistrée dans l'historique et devient figée.
  - **Cas limite :** si Fifi doit s'arrêter avant d'avoir fait les 20 exercices (fin de créneau salle), la séance est abandonnée : elle n'est pas enregistrée dans l'historique.

- **UJ-2. Fifi fait un exercice Argent multi-billes.**
  - **Persona + contexte :** Fifi vise l'Argent, exercice C ("empocher les deux jaunes en séquence, puis se replacer pour jouer la noire").
  - **État d'entrée :** en cours de séance Argent, ouvre l'exercice C, voit le schéma avec l'ordre de poche indiqué (1, 2 sur les jaunes).
  - **Parcours :** joue son 1er essai — empoche la 1ère jaune (tape "bille 1 réussie"), empoche la 2e jaune (tape "bille 2 réussie"), rate le placement pour la noire, l'essai s'arrête là. L'app enregistre 2 billes empochées à l'essai 1.
  - **Climax :** l'app calcule le score de l'essai comme 2 billes × 4 pts (valeur du 1er essai Argent) = 8 pts, sans que Fifi ait à faire le calcul.
  - **Résolution :** si les essais suivants ne font pas mieux, ce score de 8 pts est retenu pour l'exercice ; passage à l'exercice suivant.

- **UJ-3. Fifi consulte sa progression.**
  - **Persona + contexte :** Fifi, chez lui ou en salle avant de jouer, veut savoir s'il progresse.
  - **État d'entrée :** ouvre l'onglet "Historique".
  - **Parcours :** voit la liste des séances passées (date, niveau, score total, seuil atteint ou non), triée de la plus récente à la plus ancienne → tape sur une séance pour voir le détail par exercice et par essai.
  - **Climax :** il repère une tendance (ex. son total Bronze progresse de séance en séance) sans avoir à reporter quoi que ce soit dans un tableur.
  - **Résolution :** referme le détail, revient à la liste ou lance une nouvelle séance.

## 3. Glossaire

- **Niveau** — Bronze, Argent, ou Or (correspondant officiellement à D.F.A. 1/2/3). Fixé pour toute la durée d'une **Séance**.
- **Séance** — Une session d'entraînement sur un seul **Niveau**, composée de la saisie de tous les **Exercices** de ce niveau, aboutissant à un **Score total**.
- **Figure** — Un schéma de table partagé par un ou plusieurs **Exercices** (structure propre au niveau Bronze ; en Argent/Or, une Figure = un seul Exercice).
- **Exercice** — Une unité de notation du règlement D.F.A. : un schéma, une ou plusieurs **Billes** à empocher (dans un ordre prescrit par le schéma, ou sans ordre imposé pour certains exercices Or "lecture de table"), jusqu'à 3 **Essais**, un **Score d'exercice**.
- **Essai** — Une tentative sur un Exercice ; se termine dès qu'une bille de la séquence est ratée ou qu'une faute est commise. Jusqu'à 3 essais par exercice, la bille blanche étant replacée à son point d'origine avant chaque essai (sauf Or E/F, cf **Zone de replacement**).
- **Bille(s) de la séquence** — Les billes à empocher pour un Exercice donné (1 en Bronze, 2 à 5 en Argent/Or selon l'exercice), dans l'ordre indiqué par le schéma si un ordre est prescrit, sinon en nombre libre choisi par le joueur (cf Or A/C/D/F, "lecture de table").
- **Barème** — La valeur en points de chaque essai selon le Niveau : Bronze 5/3/2 (1er/2e/3e essai) ; Argent et Or 4/3/2,5.
- **Score de l'essai** — Nombre de billes de la séquence effectivement empochées lors de cet essai × valeur de Barème de cet essai.
- **Score d'exercice** — Le Score de l'essai le plus élevé parmi les essais joués sur cet Exercice (meilleur essai retenu).
- **Score total** — Somme des Scores d'exercice de la Séance, sur 100 points maximum pour le Niveau choisi.
- **Seuil de réussite** — Score total à atteindre pour valider le diplôme du Niveau : Bronze 50, Argent 60, Or 70.
- **Quantité de bille** — Fraction de contact visée entre bille blanche et bille jouée (¼, ½, ¾, bille pleine), donnée textuelle d'un Exercice.
- **Fermer la table** — Type d'Exercice (Argent D-I, tout l'Or) où les billes sont disposées pour qu'aucun tir direct ne soit possible, forçant un tir indirect/à la bande.
- **Zone de replacement** — Zone où la bille blanche peut être placée librement par le joueur (Or exercices E et F uniquement), plutôt qu'à une position fixe.
- **Historique** — Liste consultable en lecture seule des Séances passées, avec vue résumé (liste) et vue détail (par exercice/essai) par séance.

## 4. Fonctionnalités

### 4.1 Catalogue de contenu D.F.A.

**Description :** Le contenu officiel des 3 niveaux (35 exercices au total) est embarqué dans l'app : chaque Niveau expose ses Figures/Exercices, chacun avec son schéma redessiné fidèlement à l'original et son énoncé (bille(s) à jouer, quantité de bille si applicable, poche(s) visée(s), ordre de poche si prescrit). Réalise UJ-1, UJ-2. Le détail exhaustif exercice par exercice vit dans [content-catalog.md](content-catalog.md) — cette section porte les exigences sur *comment* ce contenu est présenté, pas son contenu lui-même.

**Exigences fonctionnelles :**

#### FR-1 : Catalogue des 3 niveaux
Le système expose les 3 niveaux (Bronze/Argent/Or) avec, pour chacun, la liste complète de ses exercices officiels, dans l'ordre du règlement.

**Conséquences (testables) :**
- Bronze compte 20 exercices (Figures A-F), Argent 9 (A-I), Or 6 (A-F) — 35 au total, conforme au règlement F.F.B.
- Chaque exercice porte le nombre de billes de la séquence attendu (1 pour Bronze, 2-3 pour la plupart des exercices Argent, 3-5 pour l'Or, cf [content-catalog.md](content-catalog.md)) et le Barème du niveau — donnée consommée par le moteur de score (§4.2, FR-6).

#### FR-2 : Affichage du schéma d'exercice
Pour un exercice donné, le système affiche son schéma officiel (position des billes sur la table, poche(s) visée(s), ordre de poche si prescrit) et son énoncé texte.

**Conséquences (testables) :**
- Les 35 schémas tracent tous vers les données de grille extraites du règlement dans content-catalog.md — aucun schéma n'est une composition libre/illustrative, y compris les figures Bronze et les exercices Argent A-C non « fermer la table ». La variance mineure de position tolérée pour les figures Bronze simples (cf addendum.md) porte uniquement sur le tracé/repositionnement fin, jamais sur le nombre de billes ou la séquence de l'exercice, qui doivent correspondre exactement au catalogue.
- Les schémas "fermer la table" (Argent D-I, tout l'Or) reproduisent fidèlement la disposition de blocage du tir direct de l'original — pas de recomposition libre.
- Les schémas Or E et F n'affichent pas de position fixe de bille blanche (placement libre en zone de replacement).
- Les schémas ne portent aucune annotation de technique (effet, coulé, rétro) — le règlement ne les encode pas visuellement non plus ; **hors scope v1**, cf §5.
- Les maquettes UX ([DESIGN.md](../../ux-designs/ux-blackball-training-2026-09-05/DESIGN.md), [EXPERIENCE.md](../../ux-designs/ux-blackball-training-2026-09-05/EXPERIENCE.md), `mockups/*.html`) illustrent les patterns d'interaction et le visuel — elles ne font jamais autorité sur le contenu réel d'un exercice (géométrie du schéma, nombre de billes, ordre de poche) ; cette autorité est exclusivement content-catalog.md. *(Écart réel corrigé en réplique à cette exigence : `mockups/exercice.html` représentait l'exercice Argent C avec 2 cibles de saisie au lieu des 3 confirmées par le catalogue — bille noire omise de la séquence.)*

**Notes :** *[NOTE FOR PM]* Le format technique du schéma (image statique vs rendu depuis coordonnées de grille) est une décision d'architecture, cf addendum.md — mais capturer les positions de billes comme données de grille dès la constitution du contenu garde cette option ouverte sans coût de retour en arrière.

### 4.2 Parcours de séance et moteur de notation

**Description :** Une séance porte sur un seul niveau choisi au démarrage. Pour chaque exercice du niveau, l'utilisateur saisit le résultat de ses essais (jusqu'à 3), l'app retient le meilleur et calcule le score en continu. Réalise UJ-1, UJ-2.

**Exigences fonctionnelles :**

#### FR-3 : Choix du niveau en début de séance
L'utilisateur choisit un niveau (Bronze/Argent/Or) au démarrage d'une séance. Réalise UJ-1.

**Conséquences (testables) :**
- Le niveau est fixe pour toute la durée de la séance ; aucune séance ne mélange des exercices de plusieurs niveaux.
- Le choix du niveau détermine la liste d'exercices (FR-1), le Barème applicable (FR-6), et le Seuil de réussite affiché (FR-7).

#### FR-4 : Saisie d'un essai à une main
Pour l'exercice en cours, l'utilisateur saisit le résultat de chaque bille de la séquence de l'essai (réussie/ratée) d'un geste tactile simple, sans clavier. Réalise UJ-2.

**Conséquences (testables) :**
- Pour un exercice à ordre de poche prescrit (numéroté sur le schéma), la saisie présente les billes dans cet ordre et permet d'enregistrer entre 0 et N billes réussies avant l'échec/la fin de l'essai — pas juste un binaire réussi/raté global pour les exercices multi-billes.
- Pour un exercice sans ordre prescrit (Or A/C/D/F, "lecture de table"), la saisie ne force aucun ordre ni identité de bille : elle se limite à un compteur de billes empochées avec succès avant l'échec de l'essai.
- L'essai s'arrête dès qu'une bille de la séquence est ratée ou qu'une faute est déclarée par l'utilisateur ; les billes restantes de la séquence ne sont pas proposées à la saisie pour cet essai.

#### FR-5 : Meilleur essai retenu
Le système retient, pour le score de l'exercice, l'essai ayant obtenu le score le plus élevé parmi ceux joués (jusqu'à 3).

**Conséquences (testables) :**
- Si l'utilisateur obtient un score suffisant dès le 1er essai, les essais suivants restent accessibles (le règlement ne les rend pas obligatoires) mais ne peuvent que confirmer le score retenu, ou le remplacer par un meilleur score.

#### FR-6 : Calcul du score par bille empochée
Le score d'un essai = (nombre de billes de la séquence effectivement empochées lors de cet essai) × (valeur de Barème de cet essai pour le niveau en cours).

**Conséquences (testables) :**
- Bronze (1 bille par exercice) : score de l'essai = 5, 3, ou 2 pts si la bille est empochée au 1er/2e/3e essai respectivement, 0 si jamais empochée en 3 essais.
- Argent/Or, exemple à 3 billes de séquence toutes empochées au 1er essai : score = 3 × 4 = 12 pts, conforme à l'exemple officiel du règlement.
- Le score d'exercice (FR-5) et le score total de séance (FR-7) sont dérivés de ce calcul, jamais d'une valeur plate saisie manuellement.

#### FR-7 : Total de séance en continu vs seuil
Le total de la séance (somme des scores d'exercice saisis jusqu'ici) est affiché en continu, comparé au seuil de réussite du niveau en cours (50/60/70 sur 100). Réalise UJ-1.

**Conséquences (testables) :**
- Le total affiché se met à jour immédiatement après chaque exercice saisi, sans action supplémentaire de l'utilisateur.
- L'écart entre le total courant et le seuil du niveau en cours est visible sans calcul mental (ex. affichage "38/100 — seuil Bronze 50").

#### FR-8 : Fin de séance et verrouillage
Une fois tous les exercices du niveau saisis, la séance est marquée terminée, son score total et son statut (seuil atteint ou non) sont figés, et elle devient immodifiable.

**Conséquences (testables) :**
- Après clôture, aucune modification ni suppression n'est possible sur les scores de la séance (cf décision §5 — pas d'édition a posteriori).
- Une séance clôturée apparaît immédiatement dans l'Historique (§4.3).
- Si l'utilisateur quitte avant d'avoir saisi tous les exercices du niveau, la séance est **abandonnée** : elle n'est pas enregistrée dans l'Historique, et rien n'est conservé de sa progression partielle.

### 4.3 Historique des séances

**Description :** Consultation de l'Historique (cf Glossaire §3). Réalise UJ-3.

**Exigences fonctionnelles :**

#### FR-9 : Liste des séances passées
Le système affiche la liste des séances terminées (date, niveau, score total, seuil atteint ou non), triée de la plus récente à la plus ancienne.

**Conséquences (testables) :**
- Chaque ligne de la liste affiche au minimum : date, niveau, score total sur 100, statut seuil atteint/non atteint.
- L'ordre est strictement décroissant par date (la séance la plus récente en premier).

#### FR-10 : Détail d'une séance
Depuis la liste, l'utilisateur peut ouvrir une séance passée pour voir le détail par exercice (score retenu) et par essai (billes empochées par essai).

**Conséquences (testables) :**
- Le détail liste chaque exercice du niveau de cette séance avec son score retenu (FR-5) et, en ouvrant l'exercice, le nombre de billes empochées par essai joué.

#### FR-11 : Historique en lecture seule
Aucune séance passée ne peut être modifiée ou supprimée après sa clôture (FR-8).

**Conséquences (testables) :**
- Aucune action d'édition ou de suppression n'est exposée sur une séance de l'Historique, ni depuis la liste (FR-9) ni depuis le détail (FR-10).

## 5. Non-Objectifs explicites

- Pas de comptes multi-utilisateurs, pas de partage ou classement club, pas de synchronisation cloud.
- Pas de mode "compétition officielle" (rôle arbitre-animateur, feuille de résultats imprimable, remontée F.F.B.) — l'app couvre l'auto-évaluation solo, pas la gestion de compétition.
- Aucune autre discipline de billard que le Blackball D.F.A.
- Pas de personnalisation du barème ou des seuils — ils suivent strictement le règlement F.F.B. en vigueur.
- Pas d'édition/suppression d'une séance après sa clôture (§4.2 FR-8).
- Pas de contenu pédagogique sur les techniques ni les pages d'introduction officielles par niveau (posture, techniques nommées type coulé/rétro/effet latéral, cadre tactique) — l'app affiche le schéma (FR-2) et le barème (FR-1) par exercice, pas un tutoriel ni le texte de cadrage du règlement. *[NOTE FOR PM]* Piste plausible pour une v2 si l'usage personnel confirme la valeur de l'outil (cf Vision du brief).
- Pas de vérification ni de blocage des prérequis pédagogiques entre niveaux (le règlement recommande de couvrir les notions Bronze avant Argent, Argent avant Or, cf content-catalog.md §4) — FR-3 laisse le choix du niveau entièrement libre à chaque séance ; l'app fait confiance au joueur pour respecter cette progression lui-même.
- Pas d'édition de contenu in-app (pas de CMS) — le catalogue des 35 exercices est fixe/embarqué, mis à jour uniquement par une nouvelle version de l'app si le règlement F.F.B. change.

## 6. Périmètre MVP

### 6.1 Dans le périmètre

- Catalogue complet des 3 niveaux (35 exercices), schémas fidèles, barèmes, seuils (§4.1).
- Parcours de séance à niveau fixe, saisie à une main, moteur de score par bille empochée, total en continu vs seuil (§4.2).
- Historique en lecture seule, résumé + détail (§4.3).
- Fonctionnement 100% hors-ligne (PWA installable, assets embarqués) — cf NFR ci-dessous.

### 6.2 Hors périmètre MVP

- Tout ce qui est listé en §5 Non-Objectifs.
- Reprise d'une séance interrompue : hors scope — une séance quittée avant sa fin est abandonnée sans trace (§4.2 FR-8), pas de sauvegarde/reprise ultérieure.

## 7. Exigences transverses (NFR)

- **Hors-ligne total** : l'app doit fonctionner intégralement sans connexion réseau (salle de billard sans Wi-Fi fiable) — PWA installable, service worker mettant en cache tous les assets nécessaires (schémas, code) dès l'installation.
- **Persistance locale résiliente** : la progression d'une séance en cours — tant qu'elle n'a pas été abandonnée par l'utilisateur — ne doit pas se perdre accidentellement si le téléphone se verrouille ou si l'app passe en arrière-plan entre deux coups — sauvegarde locale incrémentale, pas seulement à la clôture de séance. Ceci ne contredit pas FR-8 : c'est l'abandon volontaire (quitter avant la fin) qui efface la séance, pas un verrouillage d'écran passager.
- **Saisie à une main** : toutes les interactions de saisie d'essai (FR-4) doivent être exécutables au pouce, sans clavier, avec une cible tactile ≥ 44dp (recommandation Material Design / WCAG 2.1 pour un usage debout, potentiellement peu précis, à côté de la table).
- **Aucune donnée envoyée à un tiers** : cohérent avec l'absence de compte/cloud (§5) — toutes les données de séance restent sur l'appareil.

## 8. Critères de succès

Outil personnel à faible enjeu — pas de rigueur quantitative de type lancement public, mais un signal explicite pour savoir si l'app a tenu sa promesse.

**Principal**
- **SM-1** : Fifi utilise l'app pour la totalité de ses séances d'entraînement (0 séance reportée sur papier/tableur) sur le mois suivant sa mise en service. Valide FR-3 à FR-11.
- **SM-2** : Fifi sait, sans calcul mental et sans interrompre son jeu, si sa séance en cours franchirait le seuil du diplôme visé. Valide FR-7.

**Contre-métrique (à ne pas optimiser)**
- **SM-C1** : Le nombre de séances enregistrées ne doit pas être optimisé en simplifiant la saisie au point de perdre la fidélité du score réel (ex. saisie automatique ou approximative) — contrebalance SM-1.

## 9. Questions ouvertes

1. Le format technique des schémas (image statique redessinée vs rendu généré depuis des coordonnées de grille structurées) reste ouvert — décision différée à l'architecture, cf addendum.md.

## 10. Index des hypothèses

- §2.2 — Aucune notion de compte/profil n'est nécessaire en v1, un seul jeu de données local implicite.
