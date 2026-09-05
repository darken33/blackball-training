---
title: Addendum - PRD Carnet de Score Blackball DFA
created: 2026-09-05
updated: 2026-09-05
---

# Addendum

Contenu de référence utile à l'architecture et au travail de contenu, trop détaillé pour le corps du PRD.

## Correction du modèle de score (par rapport au brief initial)

Le brief supposait un score plat par essai (5/3/2 ou 4/3/2,5 pts, une seule bille par exercice). La lecture intégrale du règlement corrige ce point :

- **Bronze** : chaque exercice = 1 seule bille à empocher. Le modèle plat tient (score de l'essai = 0 ou valeur de Barème de l'essai).
- **Argent et Or** : plusieurs exercices demandent d'empocher **2 à 5 billes en séquence** dans un même essai (ex. Argent A : "empocher la rouge puis se replacer pour jouer la noire" = 2 billes ; exercices "fermer la table" = jusqu'à 5 billes). **Score de l'essai = nombre de billes empochées avec succès dans la séquence × valeur de Barème de l'essai**, meilleur essai retenu. Confirmé par l'exemple rempli p.45 (ligne à 3 billes empochées au 1er essai = 3 × 4 = 12 pts).
- **Impact data model / moteur de score** : chaque exercice du catalogue doit porter un attribut "nombre de billes attendues dans la séquence" (1 pour tout Bronze, variable pour Argent/Or) ; le moteur de score ne peut pas être un simple champ plat par essai, il doit multiplier le nombre de billes empochées par la valeur de Barème de l'essai.
- La feuille de marque officielle Argent/Or reflète déjà cette mécanique : chaque colonne "essai" y est subdivisée en jusqu'à 3 sous-cases à cocher (une par bille de la séquence), avec les cases non pertinentes noircies selon l'exercice.

## Catalogue de contenu complet

Le catalogue exhaustif des 35 exercices (Bronze 20 / Argent 9 / Or 6), extrait intégralement du règlement officiel (`input/reglement-dfa-blackball.pdf`, 47 pages), est conservé dans [content-catalog.md](content-catalog.md) de ce même workspace. Il couvre, par niveau/figure/exercice : la description de chaque exercice, la convention de dessin des schémas, la structure de la feuille de marque officielle, et le contenu des pages d'introduction de chaque niveau.

## Conventions de dessin des schémas (pertinent pour la stratégie d'assets)

- Vue de dessus 2D simple, 6 poches fixes (4 coins + 2 milieux), une grille de placement fine superposée à toute la table — cette grille est le système de coordonnées de facto utilisé par les animateurs pour positionner les billes ; à traiter comme telle dans tout redessin numérique (coordonnées de grille, pas pixel libre).
- Billes : blanche (bille du joueur), rouges, jaunes, noire — couleurs pleines, sans numéro imprimé sur la bille elle-même. Des numéros sont parfois placés à côté d'une bille : en Bronze ils identifient des exercices indépendants partageant le même schéma ; en Argent/Or ils indiquent l'ordre de poche prescrit (souvent absent sur les exercices "lecture de table" les plus complexes de l'Or, où l'ordre est volontairement laissé au choix du joueur).
- Une seule flèche droite de la bille vers la poche cible — aucune annotation d'effet (coulé/rétro/effet latéral) n'est dessinée alors que le texte les exige : **les schémas seuls n'encodent pas la technique requise**, celle-ci vient des pages d'introduction de niveau (texte), pas des schémas.
- La "quantité de bille" (¼, ½, ¾, bille pleine) est une info textuelle d'exercice, pas un élément dessiné séparément.
- Les schémas "fermer la table" (Argent D-I, tout l'Or) doivent être redessinés fidèlement à la disposition d'origine (le blocage du tir direct est la donnée pédagogique elle-même), contrairement aux figures Bronze simples où une légère variation de position est mieux tolérée en cas de recomposition libre.
- Pour les exercices E et F de l'Or, la bille blanche n'a pas de position fixe dessinée : le joueur la place librement dans une "zone de replacement" délimitée par une ligne verticale présente sur tous les schémas (probable ligne de tête standard).
- La tolérance de variance de position ci-dessus (figures Bronze simples) ne s'étend jamais au contenu de l'exercice lui-même : nombre de billes de la séquence et ordre de poche doivent toujours correspondre exactement à content-catalog.md, pour tous les niveaux (cf FR-2, PRD). Les maquettes UX ne sont jamais une source de contenu — seulement d'interaction/visuel.

## Hypothèses techniques à valider en architecture

- PWA installable avec service worker : stratégie de cache (tous les assets/schémas embarqués pour fonctionnement 100% hors-ligne) à concevoir en architecture.
- Persistance locale uniquement (pas de compte ni synchro cloud), cohérente avec l'usage mono-utilisateur — stockage local du navigateur (IndexedDB ou équivalent) à confirmer en architecture.
- Format de rendu des schémas (image statique redessinée vs SVG généré depuis des coordonnées de grille structurées) — décision différée à l'architecture ; la donnée de grille de positionnement (voir ci-dessus) devrait être capturée comme telle dans le modèle de contenu pour garder cette option ouverte.
- Résilience de la séance en cours : la saisie ne doit pas être perdue si le téléphone se verrouille ou si l'app est mise en arrière-plan (contexte d'usage : entre deux coups, une main occupée) — à traiter en architecture (sauvegarde incrémentale locale).
