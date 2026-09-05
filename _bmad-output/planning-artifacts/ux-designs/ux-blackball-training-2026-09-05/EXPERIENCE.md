---
name: Carnet de Score Blackball DFA
status: final
sources:
  - "{planning_artifacts}/prds/prd-blackball-training-2026-09-05/prd.md"
  - "{planning_artifacts}/briefs/brief-blackball-training-2026-09-05/brief.md"
created: 2026-09-05
updated: 2026-09-05
---

# Carnet de Score Blackball DFA — Experience Spine

## Foundation

Single-surface mobile, PWA installée sur Android, usage debout à une main en salle de billard, 100% hors-ligne (PRD §7 NFR). Pas de système UI tiers nommé — hérite des conventions Android natives (navigation, gestes système, TalkBack, dynamic type). `DESIGN.md` est la référence d'identité visuelle ; cette fiche porte le comportement. Pas de mode clair, pas d'écran Réglages en v1 (cf. DESIGN.md, Brand & Style).

[ASSUMPTION] Reprise vs abandon de séance : le PRD (FR-8) dit qu'une séance quittée avant la fin est "abandonnée", tandis que le NFR "Persistance locale résiliente" exige qu'un verrouillage d'écran ou une mise en arrière-plan ne fasse pas perdre la progression. Réconciliation retenue ici : **abandon = action explicite** via `Abandon button` (cf. Component Patterns) ; fermer l'app, verrouiller l'écran, ou changer d'onglet ne sont jamais des abandons. Tant qu'aucun abandon explicite n'a eu lieu, la séance en cours est retrouvée telle quelle à la réouverture.

## Information Architecture

| Surface | Atteinte depuis | But |
|---|---|---|
| Accueil | Ouverture de l'app (aucune séance en cours) | Choisir un niveau (Bronze/Argent/Or) pour démarrer une séance ; accès à l'Historique |
| Accueil — bandeau reprise | Ouverture de l'app (séance en cours non abandonnée) | Reprendre la séance en cours à l'exercice où elle s'est arrêtée |
| Séance — Exercice en cours | Accueil (choix niveau) ou bandeau reprise | Afficher le schéma de l'exercice courant, saisir les essais, voir le total en direct |
| Séance — Résumé | Dernier exercice du niveau saisi | Confirmer score total, seuil atteint ou non ; clôture et verrouillage (FR-8) |
| Historique — Liste | Onglet Historique | Séances terminées, triées de la plus récente à la plus ancienne (FR-9) |
| Historique — Détail | Tap sur une ligne de la liste | Détail par exercice et par essai d'une séance passée, lecture seule (FR-10, FR-11) |

Navigation par deux onglets bas persistants : **Séance** (Accueil ↔ flux de séance en cours) et **Historique**. Le flux de séance est un empilement à un seul niveau (Accueil → Exercice → Résumé) ; aucun modal ne s'empile sur un autre.

→ Référence de composition : `mockups/accueil.html` (Accueil, avec et sans reprise), `mockups/exercice.html` (Exercice en cours, essai en cours et essai clos), `mockups/resume.html` (Résumé de séance), `mockups/historique.html` (Liste et Détail). Spine gagne en cas de conflit.

## Voice and Tone

Ton d'un règlement fédéral, pas d'une app de coaching sportif : direct, sans exclamation, sans encouragement gratuit. Le score parle de lui-même — le texte ne le commente pas. Cohérent avec SM-C1 (ne pas gamifier pour gonfler l'usage).

| Do | Don't |
|---|---|
| "Score enregistré." | "Bravo, exercice réussi !" |
| "Seuil Bronze atteint — 54/100." | "Félicitations, tu es Bronze ! 🎉" |
| "Abandonner la séance ? Les scores saisis ne seront pas conservés." | "Es-tu sûr de vouloir quitter ? 😢" |
| "Aucune séance enregistrée pour l'instant." | "Ta première séance t'attend !" |
| Phrases courtes, chiffres au premier plan. | Points d'exclamation, emoji, séries/streaks, badges. |

## Component Patterns

Comportemental. Les spécifications visuelles vivent dans `DESIGN.md.Components`.

| Composant | Usage | Règles comportementales |
|---|---|---|
| Essai button | Saisie d'essai (exercice en cours) | Ordre prescrit : boutons affichés dans l'ordre de poche du schéma ; un tap marque "cette bille réussie" et l'interface avance automatiquement la mise en avant vers le bouton suivant. Sans ordre prescrit (lecture de table) : un seul bouton "Bille empochée" incrémente un compteur à chaque tap. Dans les deux cas, un tap sur "Faute / fin d'essai" arrête l'essai immédiatement — les billes restantes de la séquence ne sont plus proposées (FR-4). |
| Fault button | Sous les essai-buttons, en permanence | Toujours actif dès qu'un essai est en cours ; jamais désactivé, même au premier tap de l'essai (un essai peut échouer dès la première bille). |
| Undo banner | Apparaît juste après chaque tap de saisie | [ASSUMPTION] Non prescrit par le PRD, ajouté pour la contrainte "une main, au pouce, debout" (NFR) : une erreur de saisie doit être corrigible sans relancer l'essai. Disparaît dès que l'essai suivant démarre ou après un court délai d'inactivité. |
| Exercise card | Aperçu d'un exercice dans le déroulé de séance | Affiche le `Table diagram` en cours, l'énoncé, et — une fois joué — le score retenu (meilleur essai, FR-5). Les essais suivants restent accessibles même si le score maximal est déjà atteint (FR-5). |
| Table diagram | Miniature (Exercise card) et plein écran (Exercice en cours) | Purement informatif, aucune interaction tactile propre ; zoom natif du navigateur autorisé, pas de contrôle personnalisé. Reflète exactement le schéma officiel (§DESIGN.md, Table diagram) — aucune donnée de saisie n'y est superposée. |
| Score bar | Bas d'écran, sticky, pendant toute la séance | Se met à jour dès la clôture de chaque exercice, sans action supplémentaire (FR-7). Ne disparaît jamais pendant une séance active. |
| Next exercise button | Après clôture du score d'un exercice | [ASSUMPTION] Action explicite plutôt qu'un enchaînement automatique — le joueur a besoin de temps pour replacer les billes physiquement avant l'exercice suivant. Toujours l'action par défaut sans ambiguïté, qu'elle apparaisse seule ou à côté de `Replay attempt button` (rendu visuel : cf. DESIGN.md.Components). |
| Replay attempt button | À côté de `Next exercise button`, uniquement si essais restants (< 3) et score non maximal | Retente l'essai courant (bille blanche replacée à son point d'origine). Jamais l'action par défaut : reste visuellement secondaire face à `Next exercise button` (rendu visuel : cf. DESIGN.md.Components), afin qu'il n'y ait aucune ambiguïté sur l'action prioritaire. |
| Level button | Accueil, un par niveau (Bronze/Argent/Or) | Tap → démarre une nouvelle séance à ce niveau, exercice 1. Désactivé (ou masqué) pour tout niveau différent de celui de la séance en cours — une séance ne mélange jamais deux niveaux (FR-3). |
| Resume banner | Accueil, uniquement si une séance est en cours | Tap n'importe où sur le bandeau → rouvre l'exercice exact où la séance s'est arrêtée. Reste affiché tant qu'aucun abandon explicite n'a eu lieu (cf. Foundation). |
| Abandon button | Accueil ou tout écran de séance en cours | Tap → confirmation bloquante (cf. Voice and Tone, State Patterns). Seule action qui efface la progression de la séance en cours (FR-8) ; cf. Foundation pour la distinction abandon explicite / interruption accidentelle. |
| History row | Historique — Liste | Tap → Détail. Aucune action d'édition/suppression exposée (FR-11). |

## State Patterns

| État | Surface | Traitement |
|---|---|---|
| Accueil, aucune séance en cours | Accueil | 3 boutons niveau (Bronze/Argent/Or), seuil rappelé sous chaque bouton. |
| Accueil, séance en cours | Accueil | Bandeau "Reprendre la séance [Niveau] — exercice X/N" au-dessus des boutons niveau. |
| Essai en cours (en cours de séquence) | Exercice en cours | Boutons des billes restantes actifs ; bouton Faute toujours actif. |
| Essai clos (échec ou séquence complète) | Exercice en cours | Score de l'essai affiché immédiatement ; conditions d'apparition du `Replay attempt button` : cf. Component Patterns. |
| Exercice clos (score retenu) | Exercice en cours → transition | Score retenu affiché sur l'exercise card ; passage à l'exercice suivant sur tap explicite. |
| Dernier exercice du niveau clos | Séance → Résumé | Total final affiché, statut seuil atteint/non atteint, séance verrouillée (FR-8) et visible immédiatement dans l'Historique. |
| Abandon demandé (`Abandon button`) | N'importe quel écran de séance | Confirmation bloquante : "Abandonner la séance ? Les scores saisis ne seront pas conservés." Annuler / Confirmer. |
| Historique vide | Historique — Liste | "Aucune séance enregistrée pour l'instant." Pas de lien vers Accueil forcé — les deux onglets restent accessibles. |
| Reprise après verrouillage/arrière-plan | Toute surface de séance | Aucune interruption visible : l'écran retrouvé est celui quitté, sans message ni rechargement perceptible (NFR persistance). |

## Interaction Primitives

- Tap uniquement pour toute saisie d'essai — pas de swipe, pas de drag, pas de long-press : le pouce n'a qu'un geste simple à disposition (NFR "une main").
- Le bouton Faute/fin d'essai reste à une position fixe à l'écran pendant toute la séance — jamais déplacé par le nombre variable de billes de la séquence, pour rester atteignable sans regarder.
- Pas de pull-to-refresh (rien à synchroniser, app 100% locale).
- **Banni :** carrousels, animations d'ouverture, badges de notification, compteurs de série, notifications push, toute mention de connectivité réseau (l'app est hors-ligne par nature — aucune bannière "hors-ligne" n'a de sens ici).

## Accessibility Floor

Comportemental. Le contraste visuel vit dans `DESIGN.md`.

- TalkBack : chaque bouton Essai annonce le rôle, la bille concernée et son état (idle/réussi/raté) ; le bouton Faute annonce explicitement "Faute, termine l'essai".
- Réussi/raté jamais encodé par la couleur seule : texte ou icône systématiquement couplé à l'état (DESIGN.md, Colors).
- Cibles tactiles ≥48dp sur toute la saisie d'essai (`DESIGN.md.spacing.tap-target-min`), y compris le bouton Annuler et le bouton Faute.
- Dynamic type honoré à tous les paliers typographiques ; le score total ne doit jamais être tronqué même à la taille de police maximale.
- Ordre de focus/lecture suit l'ordre visuel : billes dans l'ordre de poche prescrit, puis Faute, puis Annuler.

## Inspiration & Anti-patterns

Pas de produit concurrent étudié — la seule référence est le règlement F.F.B. (Fédération Française de Billard) lui-même, qui est un barème, pas une interface. Ce qui suit consolide un rejet délibéré, dont la liste concrète vit dans Interaction Primitives, plutôt qu'une inspiration positive :

- **Rejeté — vocabulaire des apps de sport/habitude :** voir Interaction Primitives — rejeté au titre de SM-C1 (PRD §8) : le nombre de séances enregistrées ne doit jamais être optimisé au détriment de la fidélité du score. Une app qui célèbre chaque exercice réussi pousserait dans cette direction interdite.
- **Rejeté — chrome de connectivité :** voir Interaction Primitives — l'app est hors-ligne par nature (NFR §7 PRD), et non par dégradation occasionnelle de la connectivité ; afficher un état réseau introduirait une inquiétude que le produit n'a jamais.

## Key Flows

### Flow 1 (UJ-1) — Séance Bronze en salle, seul (Fifi)

1. Fifi ouvre l'app (PWA déjà installée), aucune séance en cours — l'Accueil affiche les 3 niveaux.
2. Il tape "Bronze" → la Séance démarre sur le premier exercice, schéma officiel affiché.
3. Il joue son 1er essai, tape "Raté" — l'essai se clôt, bouton "Exercice suivant" proposé (essais restants disponibles mais non obligatoires, FR-5).
4. Il rejoue, tape "Réussi" au 2e essai — le score de l'exercice (3 pts, barème Bronze 2e essai) s'affiche sur l'exercise card, la score bar met à jour son total.
5. Il tape "Exercice suivant" une fois prêt à rejouer physiquement.
6. **Climax :** en bas d'écran, la score bar affiche "38/100 — seuil Bronze 50" en continu — Fifi voit où il en est sans calcul mental, sans lâcher sa queue.
7. Dernier exercice saisi → Résumé de séance : total final, seuil atteint ou non ; la séance apparaît immédiatement dans l'Historique.

Cas limite : Fifi doit arrêter avant les 20 exercices (fin de créneau salle) → il tape "Abandonner la séance", confirme → la séance n'est pas enregistrée dans l'Historique (FR-8).

### Flow 2 (UJ-2) — Exercice Argent multi-billes (Fifi)

1. En cours de séance Argent, Fifi ouvre l'exercice C ("empocher les deux jaunes en séquence, puis se replacer pour jouer la noire") — le schéma affiche l'ordre de poche (1, 2 sur les jaunes).
2. Il joue son 1er essai : tape la bille 1 (jaune) → "réussie", tape la bille 2 (jaune) → "réussie", rate le placement pour la noire → tape "Faute / fin d'essai". L'essai s'arrête ; les billes restantes de la séquence ne sont plus proposées.
3. **Climax :** l'app affiche le score de l'essai — 2 billes × 4 pts (barème 1er essai Argent) = 8 pts — sans que Fifi ait à poser le calcul.
4. Si les essais suivants ne font pas mieux, ce score de 8 pts reste retenu (meilleur essai, FR-5) ; il tape "Exercice suivant".

### Flow 3 (UJ-3) — Consulter sa progression (Fifi)

1. Fifi ouvre l'onglet Historique, chez lui ou en salle avant de jouer.
2. Il voit la liste des séances passées (date, niveau, score total, seuil atteint ou non), la plus récente en premier.
3. Il tape une séance pour ouvrir le détail par exercice et par essai.
4. **Climax :** il repère que son total Bronze progresse de séance en séance, sans avoir reporté quoi que ce soit dans un tableur.
5. Il referme le détail, revient à la liste ou lance une nouvelle séance depuis l'onglet Séance.
