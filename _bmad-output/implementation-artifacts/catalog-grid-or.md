# Catalog Grid — 6 Or Exercises (A–F)

Source: `input/reglement-dfa-blackball.pdf`, pages 35–37.
Coordinates are percentages of the playing surface: x = 0 (left short rail) → 100 (right short rail); y = 0 (top long rail) → 100 (bottom long rail). Rounded to nearest 5. All positions are visual estimates read off the diagrams (grid dots + pocket corners used as calibration), not pixel-exact — treat as "close enough to nearest 5%" per the source task tolerance.

## Global notes (apply to all 6 exercises)

- **Pockets** (consistent across all 6 diagrams, no deviation observed):
  - TL (0,0), TM (50,0), TR (100,0)
  - BL (0,100), BM (50,100), BR (100,100)
- **Baulk line / zone de replacement line**: vertical line at **x ≈ 20** in every diagram (A–F). For E and F this same line marks the "zone de replacement" boundary (player places cue ball freely, position not fixed — reported as "none" below).
- **Numeral labels**: NONE observed on any ball in any of the 6 exercises (A, B, C, D, E, F all use plain flat-filled colored circles only, no numerals). Potting order is player's choice by color group in all cases.
- **Target pocket arrows**: NONE observed drawn in any of the 6 diagrams. Consistent with "Or" tier omitting prescribed-target arrows.

---

## Exercise A — Fermer la table avec les billes jaunes

Cue ball (white): **(35, 50)**

| ball | color | x | y | target_pocket |
|---|---|---|---|---|
| seq | yellow | 40 | 25 | none |
| seq | yellow | 50 | 50 | none |
| seq | yellow | 15 | 90 | none |
| final | black | 75 | 50 | none |

Note: 3 yellow balls present (not 2) + white + black. Small, sparse field, low density.

---

## Exercise B — Fermer la table avec les billes rouges

Cue ball (white): **(65, 40)**

| ball | color | x | y | target_pocket |
|---|---|---|---|---|
| seq | red | 60 | 35 | none |
| seq | red | 80 | 65 | none |
| seq | red | 75 | 85 | none |
| final | black | 20 | 65 | none |

Note: 3 red balls present (not 2) + white + black — mirrors A's 3-ball-per-color pattern, 4-ball sequence ending on black (corrected 2026-09-06: this row was mislabeled "blocker", but B's sequence explicitly ends on black like A/C/D/F). Black sits alone on the left, away from the red/white cluster.

---

## Exercise C — Fermer la table avec les billes jaunes puis la noire

Cue ball (white): **(70, 55)**

| ball | color | x | y | target_pocket |
|---|---|---|---|---|
| seq | yellow | 35 | 20 | none |
| seq | yellow | 60 | 45 | none |
| seq | yellow | 85 | 20 | none |
| final | black | 40 | 60 | none |
| blocker | red | 45 | 30 | none |
| blocker | red | 65 | 50 | none |
| blocker | red | 70 | 60 | none |

Sequence confirmed 3 yellow + black = 4 balls; 3 reds as pure obstacles. No numerals — matches expectation.

---

## Exercise D — Fermer la table avec les billes jaunes puis la noire

Cue ball (white): **(85, 30)**

| ball | color | x | y | target_pocket |
|---|---|---|---|---|
| seq | yellow | 55 | 45 | none |
| seq | yellow | 48 | 80 | none |
| seq | yellow | 88 | 65 | none |
| final | black | 28 | 45 | none |
| blocker | red | 15 | 55 | none |
| blocker | red | 45 | 50 | none |
| blocker | red | 78 | 30 | none |
| blocker | red | 68 | 70 | none |

Densest of A–D: 9 balls total (3 yellow + black + 4 red + white). Cue ball sits tight next to a red blocker (78,30)/(85,30) — near-contact pairing, worth flagging for exercise authoring (may require a safety/positional note). No numerals.

---

## Exercise E — Fermer la table avec les billes rouges puis la noire

Cue ball (white): **none — zone de replacement** (no white ball drawn; confirmed by rulebook caption "Le joueur place librement la bille blanche dans la zone de replacement")

Zone de replacement line x-position: **x ≈ 20**

| ball | color | x | y | target_pocket |
|---|---|---|---|---|
| seq | red | 35 | 30 | none |
| seq | red | 55 | 70 | none |
| final | black | 50 | 20 | none |
| blocker | yellow | 20 | 20 | none |
| blocker | yellow | 22 | 50 | none |
| blocker | yellow | 68 | 70 | none |

**Resolved (2026-09-06, direct re-check by orchestrating session):** two independent visual reads (this agent + a direct re-read of p.37) agree no black ball is visibly rendered in this diagram — both reads agree on 3 yellow, but disagree on the red count (this agent's structured extraction found 2; the orchestrating session's freehand recount leaned toward 3, with lower confidence than the tabulated read). The table above keeps the more reliable structured count (**2 red**, positions (35,30) and (55,70)) rather than the freehand recount. Given content-catalog.md's ball count for this exercise is explicitly annotated "confirmed by Fifi" (i.e. the actual product owner verified it against the physical rulebook, not an automated read), that count is authoritative for scoring regardless of the visual dispute: **`nombreBillesSequence = 4` (3 red + black)**. The black ball's exact position could not be reliably located in the rendered diagram (plausibly small/faint, same failure mode the source material itself warns about — black balls are only distinguishable from grid dots by position, not size). Content authoring decision: render only the balls actually visible in the diagram (2 red + 3 yellow, per the table above; do not fabricate a black ball position or a disputed 3rd red); the scoring engine's `nombreBillesSequence` for Or-E is independently set to 4 per the confirmed rule, decoupled from how many ball positions the schema visually renders.

---

## Exercise F — Fermer la table avec les billes jaunes puis la noire

Cue ball (white): **none — zone de replacement** (no white ball drawn; confirmed by rulebook caption "Le joueur place librement la bille blanche dans la zone de replacement")

Zone de replacement line x-position: **x ≈ 20**

| ball | color | x | y | target_pocket |
|---|---|---|---|---|
| seq | yellow | 33 | 20 | none |
| seq | yellow | 33 | 35 | none |
| seq | yellow | 50 | 20 | none |
| seq | yellow | 78 | 60 | none |
| final | black | 88 | 25 | none |
| blocker | red | 20 | 35 | none |
| blocker | red | 35 | 50 | none |
| blocker | red | 58 | 55 | none |

Sequence confirmed 4 yellow + black = 5 balls, matches brief exactly. 3 red blockers. Densest field of the set (8 balls, no cue ball on table). Two yellows (33,20) and (33,35) sit close together near the baulk-line side — visually a tight cluster, worth double-checking against the source image if exact spacing matters for the exercise's difficulty calibration.

---

## Summary — resolved

1. **A and B**: confirmed by direct re-read (orchestrating session, p.35) — each shows 3 same-color balls + 1 black + cue. content-catalog.md's shorthand ("yellow/white/yellow/black") undercounted for brevity. **A = 3 yellow + black (4-ball sequence); B = 3 red + black (4-ball sequence)** — both end on black, consistent with C/D/F/G/H/I's pattern.
2. **E**: see resolution note in the Exercise E section above — `nombreBillesSequence = 4` (Fifi-confirmed), schema renders only the 6 visually-confirmed balls (no black position fabricated).
3. No numerals and no target-pocket arrows anywhere in A–F — confirmed absence, not an oversight. Consistent with Argent's independent finding (no arrows there either) — arrows are a Bronze-only diagram feature; `table-diagram` must not render them for Argent/Or.
4. D has a red blocker essentially adjacent to the cue ball's zone — may be pedagogically significant (forced safety/thin cut), not blocking for this spec.
