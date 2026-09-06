# Argent Exercises A-I — Extracted Layout Data

Source: `input/reglement-dfa-blackball.pdf`, pages 23-27.
Coordinates: x/y as % of playing surface, 0-100, rounded to nearest 5.
x: 0=left short rail, 100=right short rail. y: 0=top long rail, 100=bottom long rail.
Extraction method: PDF rendered at 300dpi, connected-component color analysis (red/yellow/black/white blob detection) cross-checked against a visual re-read of a cropped high-res image per exercise. Percentage frame per exercise = that exercise's own table-outline+pocket bounding box (so pockets land exactly on 0/50/100 by construction — no cross-exercise deviation possible with this method).

**IMPORTANT — no arrows found.** Despite the task brief's expectation of drawn arrows, close visual inspection of high-res crops of all 9 diagrams found NO arrows anywhere — only flat-filled balls with small numeral labels (1/2/3) next to sequence balls. `target_pocket` below is therefore INFERRED (nearest pocket to the ball, using the 6 valid pockets only — 4 corners + top-middle + bottom-middle; there is no left/right-middle pocket). Ties (ball equidistant from two pockets, usually because it sits at x=50 or y=50) and close calls are flagged explicitly — treat those as low-confidence.

## Pocket positions (identical across all 9 exercises by construction)

| pocket | x | y |
|---|---|---|
| TL (top-left) | 0 | 0 |
| TM (top-middle) | 50 | 0 |
| TR (top-right) | 100 | 0 |
| BL (bottom-left) | 0 | 100 |
| BM (bottom-middle) | 50 | 100 |
| BR (bottom-right) | 100 | 100 |

No left-middle / right-middle pockets exist on this table (only long-rail middles, per rulebook diagram: 4 corners + 2 top/bottom-middle).

---

## Exercise A — Pocher la rouge, se replacer pour la noire (red ¾ ball)

Cue ball (white): x=20, y=80

| label | color | x | y | target_pocket |
|---|---|---|---|---|
| 1 | red | 15 | 50 | TL (tie w/ BL by distance; cue-side geometry favors TL) |
| 2 | black | 15 | 15 | TL |

No blockers. 2-ball sequence, matches brief.

---

## Exercise B — Pocher la rouge, se replacer pour la noire (red full ball)

Cue ball (white): x=60, y=70

| label | color | x | y | target_pocket |
|---|---|---|---|---|
| 1 | red | 75 | 50 | TR (tie w/ BR by distance; cue-side geometry favors TR) |
| 2 | black | 95 | 60 | BR |

No blockers. 2-ball sequence, matches brief.

---

## Exercise C — Pocher les 2 jaunes puis la noire (1st yellow ¾ ball)

Cue ball (white): x=45, y=70

| label | color | x | y | target_pocket |
|---|---|---|---|---|
| 1 | yellow | 45 | 30 | TM (aligned same x — high confidence) |
| 2 | yellow | 15 | 70 | BL |
| 3 | black | 50 | 50 | ambiguous: exact tie TM/BM (dead-center ball) |

No blockers. 3-ball sequence, matches brief.

---

## Exercise D — Fermer la table avec les rouges puis la noire (no red directly playable)

Cue ball (white): x=30, y=85

| label | color | x | y | target_pocket |
|---|---|---|---|---|
| 1 | red | 50 | 90 | BM (near-touching the pocket) |
| 2 | red | 90 | 15 | TR (near-touching the pocket) |
| 3 (final) | black | 90 | 70 | BR |
| blocker | yellow | 60 | 50 | none |
| blocker | yellow | 40 | 85 | none |

3-ball sequence (red, red, black) + 2 unlabeled yellow blockers = 5 object balls + cue, matches brief. Blockers sit between cue and the two reds, consistent with "no red directly playable."

---

## Exercise E — Fermer la table avec les rouges puis la noire (1st red ¾ ball)

Cue ball (white): x=45, y=65

| label | color | x | y | target_pocket |
|---|---|---|---|---|
| 1 | red | 50 | 30 | TM (aligned same x — high confidence) |
| 2 | red | 50 | 70 | BM (aligned same x — high confidence) |
| 3 (final) | black | 15 | 40 | TL |
| blocker | yellow | 90 | 85 | none |

**Ball count confirmed: exactly 2 red balls** (labeled 1 and 2), sequence red→red→black, plus 1 unlabeled yellow blocker near the bottom-right corner. 4 object balls + cue total.

---

## Exercise F — Fermer la table avec les jaunes puis la noire (1st yellow ¾ ball)

Cue ball (white): x=70, y=75

| label | color | x | y | target_pocket |
|---|---|---|---|---|
| 1 | yellow | 60 | 50 | ambiguous: exact tie TM/BM |
| 2 | yellow | 30 | 30 | TM (close call vs TL, 36 vs 42 distance) |
| 3 (final) | black | 5 | 70 | BL |

No blockers. 3-ball sequence, matches brief.

---

## Exercise G — Fermer la table avec les jaunes puis la noire (1st yellow full ball)

Cue ball (white): x=30, y=50

| label | color | x | y | target_pocket |
|---|---|---|---|---|
| 1 | yellow | 15 | 30 | TL |
| 2 | yellow | 20 | 80 | BL |
| 3 (final) | black | 50 | 25 | TM (aligned same x — high confidence) |

No blockers. 3-ball sequence, matches brief.

---

## Exercise H — Fermer la table avec les rouges puis la noire (1st red ½ ball)

Cue ball (white): x=55, y=50

| label | color | x | y | target_pocket |
|---|---|---|---|---|
| 1 | red | 55 | 20 | TM |
| 2 | red | 90 | 30 | TR |
| 3 (final) | black | 50 | 50 | ambiguous: exact tie TM/BM (dead-center ball, sits touching the cue ball) |

No blockers. 3-ball sequence, matches brief. Black ball 3 and cue ball are drawn almost touching (x=50/55, y=50/50) — flag for authoring, tight contact pairing.

---

## Exercise I — Fermer la table avec les jaunes puis la noire (1st yellow ¾ ball)

Cue ball (white): x=85, y=70

| label | color | x | y | target_pocket |
|---|---|---|---|---|
| 1 | yellow | 90 | 50 | ambiguous: exact tie TR/BR (cue-side geometry leans TR) |
| 2 | yellow | 60 | 70 | BM |
| 3 (final) | black | 85 | 30 | TR |

No blockers. 3-ball sequence, matches brief.

---

## Summary of flags for the authoring agent

0. **Resolved (2026-09-06):** since no arrows exist in the source for Argent (confirmed here) nor for Or (independently confirmed in catalog-grid-or.md), arrows/target-pocket are a **Bronze-only** diagram feature. `table-diagram` must not render an arrow or target pocket for Argent/Or exercises — ignore every `target_pocket` column in the tables above, including the "ambiguous" ones; they were an inference this session no longer needs.
1. No arrows exist in the source diagrams for any of A-I — every `target_pocket` is inferred (nearest-pocket heuristic), not read directly. Treat non-"ambiguous" entries as reasonably confident, "ambiguous" entries as a coin flip needing a design decision.
2. Dead-center balls (x=50,y=50 or aligned on x=50/y=50 at the far side) produce genuine TM/BM or TR/BR ties: exercise C ball 3, exercise F ball 1, exercise H ball 3, exercise I ball 1.
3. Exercise E: confirmed 2 red balls (not 3), matching the brief's uncertainty note — sequence is red, red, black, plus one yellow blocker.
4. Exercise D is the only one with an explicit "no red directly playable" caption; it also has the most blockers (2 unlabeled yellow balls). Exercise E has 1 unlabeled yellow blocker despite no such caption. C, F, G, H, I have zero blockers — their sequence balls are the entire object-ball field.
5. Exercise H: black ball 3 (the sequence-final target) and the cue ball are positioned essentially adjacent (near-contact) — worth double-checking visually if this exercise gets built, as it may imply a specific safety/contact detail not otherwise captured by x/y alone.
