---
name: Carnet de Score Blackball DFA
description: Carnet de score mobile pour l'auto-évaluation D.F.A. Blackball — sombre, dense en chiffres, sans décoration inutile ; une table de billard comme langage visuel, pas comme thème.
status: final
created: 2026-09-05
updated: 2026-09-05
colors:
  surface-canvas: '#101A15'
  surface-raised: '#182620'
  surface-overlay: '#213328'
  border-hairline: '#2C4034'
  ink-primary: '#F4F1E8'
  ink-secondary: '#9BAE9F'
  ink-disabled: '#556358'
  accent-primary: '#2A7440'
  accent-primary-contrast: '#F4F1E8'
  state-success: '#3FA34D'
  state-success-contrast: '#0B140F'
  state-fail: '#C0392B'
  state-fail-contrast: '#F4F1E8'
  table-felt: '#154A2E'
  table-rail: '#3B2417'
  table-line: '#F4F1E8'
  table-arrow: '#F4F1E8'
  table-order-label: '#F4F1E8'
  table-replacement-zone: '#E8B93A'
  ball-red: '#C1272D'
  ball-yellow: '#E8B93A'
  ball-black: '#141414'
  ball-white: '#F5F2E7'
  ball-outline: '#F4F1E8'
  pocket: '#0A0A0A'
typography:
  score-total:
    note: 'Système Android (Roboto) — display, chiffres tabulaires, ~34sp, gras'
  score-exercice:
    note: 'Système Android — chiffres tabulaires, ~22sp, semi-gras'
  title:
    note: 'Système Android — Headline Small, ~20sp, semi-gras'
  body:
    note: 'Système Android — Body Large, ~16sp, régulier'
  label:
    note: 'Système Android — Label Medium, ~13sp, medium, majuscules légères'
  meta:
    note: 'Système Android — Body Small, ~13sp, régulier, ink-secondary'
rounded:
  sm: 8px
  md: 14px
  lg: 20px
  full: 9999px
spacing:
  '1': 4px
  '2': 8px
  '3': 12px
  '4': 16px
  '5': 24px
  '6': 32px
  '7': 48px
  gutter: 16px
  tap-target-min: 48px
components:
  score-bar:
    background: '{colors.surface-overlay}'
    text: '{colors.ink-primary}'
    radius: '{rounded.lg}'
    padding: '{spacing.4}'
  essai-button:
    idle-background: '{colors.surface-raised}'
    idle-border: '{colors.border-hairline}'
    success-background: '{colors.state-success}'
    success-text: '{colors.state-success-contrast}'
    fail-background: '{colors.state-fail}'
    fail-text: '{colors.state-fail-contrast}'
    radius: '{rounded.full}'
    min-size: '{spacing.tap-target-min}'
  fault-button:
    background: 'transparent'
    border: '{colors.border-hairline}'
    text: '{colors.ink-secondary}'
    radius: '{rounded.sm}'
  undo-banner:
    background: '{colors.surface-overlay}'
    text: '{colors.ink-primary}'
    radius: '{rounded.sm}'
  next-exercise-button:
    background: '{colors.accent-primary}'
    text: '{colors.accent-primary-contrast}'
    radius: '{rounded.md}'
    min-size: '{spacing.tap-target-min}'
  replay-attempt-button:
    background: 'transparent'
    border: '{colors.accent-primary}'
    text: '{colors.accent-primary}'
    radius: '{rounded.md}'
    min-size: '{spacing.tap-target-min}'
  level-button:
    background: '{colors.surface-raised}'
    border: '{colors.border-hairline}'
    radius: '{rounded.md}'
    min-size: '{spacing.tap-target-min}'
  resume-banner:
    background: '{colors.surface-overlay}'
    text: '{colors.ink-primary}'
    radius: '{rounded.lg}'
  exercise-card:
    background: '{colors.surface-raised}'
    radius: '{rounded.md}'
    border: '{colors.border-hairline}'
  table-diagram:
    felt: '{colors.table-felt}'
    rail: '{colors.table-rail}'
    line: '{colors.table-line}'
    pocket: '{colors.pocket}'
    arrow: '{colors.table-arrow}'
    order-label: '{colors.table-order-label}'
    replacement-zone-line: '{colors.table-replacement-zone}'
    ball-outline: '{colors.ball-outline}'
  history-row:
    background: '{colors.surface-raised}'
    divider: '{colors.border-hairline}'
    radius: '{rounded.md}'
---

## Brand & Style

Ceci n'est pas une app de sport gamifiée, c'est un carnet de score qui a échappé au papier. Le ton est celui d'un règlement fédéral : sobre, précis, sans emphase. Aucune mascotte, aucun badge, aucun compteur de série — la promesse (§8 PRD, SM-C1) est un score fidèle au jeu réel, pas un engagement à maximiser.

Le choix d'une palette sombre n'est pas une préférence esthétique mais une réponse à l'usage : lu debout, au pouce, sous l'éclairage tamisé d'une salle de billard. Le fond profond évoque le feutre vert sans le représenter littéralement partout — la table elle-même (feutre, bandes, poches) n'existe que dans le composant `table-diagram`, jamais comme habillage de l'écran entier. Ailleurs, la surface reste neutre et dense en chiffres : le score est le sujet, pas la mise en scène. [ASSUMPTION] Pas de mode clair — la surface v1 ne compte aucun écran Réglages, donc aucune bascule thème à exposer.

## Colors

- **Surface Canvas (`#101A15`)** — fond de toute l'app, vert-noir profond, jamais un vrai noir : garde une tonalité "salle de billard" en arrière-plan sans jamais rivaliser avec le contenu.
- **Surface Raised / Overlay** — cartes d'exercice, barre de score, lignes d'historique : deux paliers de clarté au-dessus du canvas pour hiérarchiser sans ombre portée.
- **Accent Primary (`#2A7440`)** — vert feutre plus vif, réservé à l'action principale en cours (niveau sélectionné, exercice actif, bouton "Exercice suivant"). Jamais utilisé pour du texte informatif.
- **State Success / Fail** — vocabulaire d'état strictement réservé aux résultats d'essai (réussi / raté) et au statut de séance (seuil atteint / non atteint). Distinct des couleurs de billes ci-dessous pour qu'aucune ambiguïté ne soit possible entre "cette bille est rouge" et "cet essai a échoué". Jamais seul : toujours accompagné d'un texte ou icône (cf. EXPERIENCE.md, Accessibility Floor).
- **Table Felt / Rail / Line / Pocket / Arrow / Order Label / Replacement Zone / Ball Outline + Ball Red/Yellow/Black/White** — vocabulaire exclusivement réservé au composant `table-diagram`, pour redessiner fidèlement le schéma officiel (position des billes, poches, bandes, flèche de tir, zone de replacement).
  - Réservation : ce vocabulaire ne migre jamais vers l'UI générale — un bouton ne devient pas "rouge comme une bille".
  - Rendu des billes : aplats de couleur pure, **sans numéro imprimé dessus** — un numéro à côté d'une bille identifie une figure Bronze partagée ou un ordre de poche prescrit Argent/Or (`table-order-label`), jamais un numéro de bille comme au billard américain.
  - Lisibilité : `ball-outline` (même valeur que `table-line`) trace un liseré fin autour de chaque bille — nécessaire pour que `ball-black` reste identifiable sur `table-felt` (contraste brut ~1.8:1, insuffisant seul) sans jamais dévier de la couleur pleine officielle des billes.
- **Ink Primary/Secondary/Disabled** — hiérarchie de texte sur fond sombre ; Ink Secondary porte les métadonnées (date, niveau), jamais l'information principale (score).

**Plancher de contraste :** toute paire texte/fond porteuse d'information (boutons, score, statut) vise WCAG AA 4.5:1 minimum pour le texte normal. Vérifié : `accent-primary-contrast` sur `accent-primary` ≈ 5.1:1 ; `state-success-contrast` sur `state-success` et `ink-primary` sur `state-fail` dépassent largement ce plancher. Le schéma de table (`table-diagram`) est l'exception assumée : ses couleurs de billes suivent la fidélité au règlement, pas ce plancher — c'est `ball-outline` qui compense la lisibilité, pas un ajustement de teinte des billes.

Éviter : dégradés, ombres colorées, toute variante saturée d'accent au-delà de celle définie — un seul vert d'action, pas une famille.

## Typography

Conventions Android natives (Roboto) à chaque palier — pas de police custom, cohérence avec le reste du téléphone de Fifi. Deux paliers de chiffres dédiés (`score-total`, `score-exercice`) en chasse tabulaire : les chiffres ne doivent jamais "sauter" horizontalement quand le total se met à jour en direct (FR-7). Le score total est la plus grande donnée visible de tout l'écran de séance — plus grande que le titre de l'exercice en cours.

`label` porte les métadonnées structurelles courtes ("Essai 2", "Bille 1/3") ; `meta` porte les données secondaires d'historique (date, niveau).

## Layout & Spacing

Échelle 4/8/12/16/24/32/48px. Marge mobile fixe à `{spacing.gutter}` (16px). `tap-target-min` (48px) n'est pas un espacement mais un plancher dur : tout élément tapable en saisie d'essai (FR-4, NFR "à une main") doit atteindre au moins cette taille, quitte à sacrifier de la densité d'écran. Colonne unique partout — aucune grille multi-colonnes, l'app se tient dans une main.

## Elevation & Depth

Pas d'ombre portée. La hiérarchie vient uniquement des trois paliers de surface (`canvas` → `raised` → `overlay`) et d'un liseré `border-hairline` à faible contraste. Une app lue à la lueur de l'écran d'un téléphone dans une salle sombre ne doit pas dépendre d'un dégradé d'ombre pour se lire.

## Shapes

`rounded/sm` (8px) pour les contrôles secondaires (bouton faute/fin d'essai). `rounded/md` (14px) pour les cartes d'exercice et lignes d'historique. `rounded/lg` (20px) réservé à la barre de score, la seule surface qui mérite de se distinguer fortement du reste. `rounded/full` pour les boutons de saisie d'essai — leur forme circulaire renforce qu'ils sont la cible tactile principale, pas un simple bouton parmi d'autres.

## Components

- **Score bar** — bandeau bas, sticky, toujours visible pendant une séance. Affiche `score-total` courant vs seuil ("38/100 — seuil Bronze 50", FR-7). Fond `surface-overlay`, coins `rounded/lg`.
- **Essai button** — cible tactile circulaire ≥48px par bille de la séquence (ou par tap de comptage en lecture de table). États : idle (`surface-raised`), réussi (`state-success`), raté (`state-fail`) — texte/icône obligatoire à chaque état (cf. Colors).
- **Fault button** — bouton secondaire discret ("Faute / fin d'essai"), toujours visible sous les essai-buttons, contour seulement — ne doit jamais être confondu visuellement avec un essai-button.
- **Undo banner** — bandeau discret `surface-overlay`, apparaît juste sous les essai-buttons après chaque tap de saisie ; texte seul ("Annuler"), pas d'icône, disparaît sans laisser brusquement un vide.
- **Next exercise button** — seul bouton de la palette à porter `accent-primary` plein ; avec `exercise-card` et `score-bar`, il fait partie des rares surfaces à contraster fortement : c'est l'action volontaire qui fait avancer la séance, jamais déclenchée automatiquement.
- **Replay attempt button** — variante contour (`accent-primary` en bordure/texte, fond transparent) du bouton "Rejouer l'essai". Ne porte jamais de fond plein : quand les deux boutons apparaissent côte à côte, seul `next-exercise-button` (plein) doit se lire comme l'action par défaut, `replay-attempt-button` (contour) comme l'option secondaire.
- **Level button** — un par niveau sur l'Accueil (Bronze/Argent/Or). Même traitement que `exercise-card` (`surface-raised`, `rounded/md`) mais taille pleine largeur ; porte le nom du niveau (`title`) et son seuil en `meta` sous le libellé.
- **Resume banner** — bandeau persistant en tête d'Accueil quand une séance est en cours (`surface-overlay`, `rounded/lg`, même famille que `score-bar`) : signale que l'app n'est jamais "vide" tant qu'une séance n'a pas été explicitement abandonnée ou clôturée.
- **Exercise card** — représente un exercice dans la liste du niveau ; contient le `table-diagram` en miniature, le libellé, et le score retenu une fois joué.
- **Table diagram** — rendu du schéma officiel (§Brand & Style). Vue de dessus, 6 poches fixes (4 coins + 2 milieux), feutre, bandes, billes positionnées selon les coordonnées de grille du contenu (cf. PRD FR-2/addendum) — jamais en pixels libres. Une seule flèche droite (`table-arrow`) de la bille vers la poche visée par le tir, aucune annotation de technique (effet/coulé/rétro). Chaque bille porte son liseré `ball-outline` (cf. Colors) pour rester lisible quelle que soit la lumière ambiante. Pour Or E/F : pas de bille blanche positionnée, une ligne verticale (`replacement-zone-line`, tracé distinct — pointillé) délimite la zone de replacement libre.
- **History row** — ligne de la liste Historique : date (`meta`), niveau, score total (`score-exercice`), statut seuil (texte + couleur d'état, jamais couleur seule).

→ Référence visuelle : `mockups/accueil.html`, `mockups/exercice.html`, `mockups/resume.html`, `mockups/historique.html` — tous les composants ci-dessus y sont appliqués littéralement. Cette fiche gagne en cas de conflit.

## Do's and Don'ts

| Do | Don't |
|---|---|
| Un seul vert d'accent pour l'action principale | Multiplier les accents saturés |
| Coupler chaque état réussi/raté à un texte/icône | Coder réussi/raté par la couleur seule |
| Réserver le vocabulaire "billes" (`ball-*`, `table-*`) au schéma de table | Réutiliser une couleur de bille comme couleur d'état UI |
| Chiffres en chasse tabulaire partout où un total se met à jour en direct | Laisser les chiffres du score bar se décaler visuellement à chaque mise à jour |
| Cibles tactiles ≥48px sur toute saisie d'essai | Réduire la taille des boutons de saisie pour gagner de la densité |
| Composition à colonne unique | Introduire une grille multi-colonnes ou un mode paysage dédié |
