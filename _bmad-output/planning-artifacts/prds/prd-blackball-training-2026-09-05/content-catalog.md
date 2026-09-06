# D.F.A. Blackball — Full Exercise Catalog
Source: `input/reglement-dfa-blackball.pdf` (47 pages, F.F.B. — Commission Formation Jeunesse / Direction Technique Nationale). Extracted page by page.

---

## 0. Document structure overview

- p.1 cover, p.3 "Avertissement" (progression: Bronze after a few weeks; Argent once notions p.19 are covered; Or once notions p.31 are covered).
- p.5-6: Articles 1-11 (general rules, competition process, diploma awarding).
- p.7: "Consignes à l'Arbitre-Animateur" (referee/organizer instructions).
- p.9: DFA1 Bronze intro page (skills evaluated).
- p.11: Bronze blank scoresheet ("Feuille de marque").
- p.13-15: Bronze figures A-F (diagrams + exercise lists).
- p.17: Bronze results sheet ("Feuille de résultats", for the whole competition/all players).
- p.19: DFA2 Argent intro page (skills evaluated).
- p.21: Argent blank scoresheet.
- p.23-27: Argent exercises A-I (one diagram = one exercise each).
- p.29: Argent results sheet.
- p.31: DFA3 Or intro page (skills evaluated).
- p.33: Or blank scoresheet.
- p.35-37: Or exercises A-F (one diagram = one exercise each).
- p.39: Or results sheet.
- p.41-46 Annexes: filled-in example scoresheets for Bronze (p.43) and Argent (p.45).
- p.47: federation contact info.

**Total exercises confirmed: 35** (Bronze 20 + Argent 9 + Or 6). Matches the brief exactly.

---

## 1. Scoring rules — confirmed, with one important correction

### Confirmed as given
- 3 attempts ("essais") max per exercise; cue ball ("bille blanche") is replaced on its marked origin point before each essai.
- An essai ends as soon as the player misses the pot or commits a foul ("faute").
- Point scale: **Bronze 5 / 3 / 2** (1st/2nd/3rd essai); **Argent & Or 4 / 3 / 2.5**.
- The essai with the highest score is the one transcribed onto the scoresheet ("best attempt kept").
- Thresholds out of 100: **Bronze ≥ 50, Argent ≥ 60, Or ≥ 70**. Formula: Bronze 20 exercises × 5 max = 100; Argent/Or maxima are also engineered to total 100 (see below), same threshold logic.
- No per-figure exception to the point *scale* itself was found — the 5/3/2 and 4/3/2.5 numbers are constant across every figure/exercise at each level.

### Important correction / clarification not in the original brief
**Bronze exercises are single-ball, but Argent and Or exercises are frequently multi-ball, and scoring is per-ball, not a flat per-exercise value.**

- In Bronze, each exercise = pot exactly one designated ball. Score for the exercise = the essai's point value (5/3/2) if potted, 0 if never potted in 3 essais. This is confirmed by the worked example on p.43 (each row shows a single X/O sequence, with the score matching the essai rank of the first success).
- In Argent and Or, several exercises require potting **more than one ball in sequence within the same essai** (e.g. "pocher la bille rouge et se replacer pour jouer la bille noire" = 2 balls; "pocher les billes jaunes et se replacer pour jouer la bille noire" = 3 balls; "fermer la table" clearance exercises = 2-5+ balls). The blank Argent/Or scoresheets (p.21, p.33) reflect this: each essai column is split into **up to 3 sub-checkboxes** (one per ball potted in that essai's sequence), and some exercise rows have their 3rd sub-checkbox blacked out (not applicable) because that exercise only ever involves potting 2 balls.
- The worked Argent example (p.45) proves the arithmetic: exercise row E shows "1st essai: X X X" (3 balls potted at the 1st-essai rate of 4 pts each) = **12 points**, exactly matching the sheet's recorded total for that row. Row A shows 1st essai "X O" (1 ball at 4 pts = 4) then 2nd essai "X X" (2 balls at 3 pts = 6); best kept = 6, matching the sheet.
- **Formula:** exercise score = (number of balls successfully potted in the chosen essai) × (that essai's per-ball point value), taking the best-scoring essai across the 3 attempts. This generalizes the flat "5/3/2" model correctly for Bronze (always 1 ball) but must be modeled as a per-ball multiplier for Argent/Or in the app's data model and scoring engine — a flat "one score per attempt" field is insufficient for those two levels.

---

## 2. Diagram / schema conventions (content & asset-strategy relevant)

All 35 exercise diagrams share one consistent visual language — simple top-down 2D line diagrams, no photos, no 3D, no color gradients:

- **Table outline**: a rounded-corner rectangle (landscape), standard 6-pocket blackball/pool table.
- **Pockets**: exactly 6, drawn as large filled black circles — 4 corner pockets + 2 middle pockets (mid-point of each long rail). Pocket positions are fixed/identical across every diagram (only the balls move).
- **Placement grid ("quadrillage")**: a faint grid of small black dots is overlaid across the entire playing surface in every diagram. Per the referee instructions (p.7), this grid exists specifically so animators can place balls at reproducible, precise positions — this is the de-facto coordinate system the whole program is built on and should be treated as a first-class coordinate grid in any digital redraw (i.e., ball positions should be authored/stored as grid coordinates, not free-form pixel coordinates).
- **Baulk-style vertical line**: a solid vertical line appears at a fixed position (roughly a quarter to a third from the left short rail) on every single diagram at every level. It looks like a standard "ligne de tête" table marking rather than an exercise-specific annotation — it is only ever functionally invoked by name in the two Or exercises (E, F) whose text calls out a "zone de replacement" for free cue-ball placement, implying this line demarcates that zone.
- **Balls**: flat-colored filled circles, no numbers/stripes on the balls themselves (this is Blackball, not numbered pool):
  - White = cue ball ("bille blanche") — position fixed and drawn once per diagram (reused across all essais of that figure/exercise), except Or exercises E and F where no cue-ball position is drawn at all — text states the player is free to place it anywhere within the "zone de replacement."
  - Red = "billes rouges" (one object-ball suit/group).
  - Yellow = "billes jaunes" (other suit/group).
  - Black = the black (8-ball equivalent) — visually the same size as red/yellow object balls, distinguishable from pocket-dots mainly by context/position (not by size difference in the source raster, so a redraw should use a clearly distinct marker, e.g. a ring or pattern, to avoid ambiguity with pocket dots).
- **Ball labels**: small numerals (1, 2, 3, 4…) placed next to specific balls.
  - In Bronze, each numbered ball on a shared figure diagram corresponds to a *separate, independent exercise* listed below the diagram ("Exercice 1: positionner la bille marquée « 1 » …"). One figure diagram thus encodes 3-4 sibling exercises, each targeting a different ball/pocket combo, all sharing the same fixed cue-ball position.
  - In Argent/Or, one diagram = one exercise, and the numerals instead indicate the **required potting order** within that single exercise's multi-ball sequence (pot "1" first, reposition, pot "2", etc.). Or's most complex clearance exercises (C, D, F) leave balls largely *unlabeled*, consistent with their "lecture de table" (table-reading) intent — the player must work out their own clearing order rather than follow a prescribed sequence.
- **Path/target indicator**: **correction (verified directly against the PDF, 2026-09-06): this arrow is a Bronze-only diagram feature.** Bronze's 20 exercises each draw a straight arrow from the object ball to its target pocket. Argent (all 9, pages 23-27) and Or (all 6, pages 35-37) diagrams draw **no arrows at all** — confirmed by two independent close re-reads of high-res crops of every diagram at both levels. Where an arrow is present (Bronze only), it is the *only* trajectory annotation — no dashed lines, no cue-ball path lines, no spin/english/effect glyphs, no curvature — despite the rulebook's text explicitly requiring specific techniques (rejet naturel, coulé, rétro, effet latéral, coup par bande avant) to execute the shots. **Implication for the app/content team: the diagrams alone do not visually encode which technique is required — that has to be sourced from the accompanying instructional/glossary text (p.9, p.19, p.31) or authored separately as pedagogical overlay content, not inferred from the schema. It also means the app's `table-diagram` component must not draw an arrow/target-pocket for Argent or Or exercises — only Bronze carries that annotation in the source.**
- **"Quantité de bille" callouts**: Bronze exercises and some Argent exercises (A, B, C) additionally specify a fractional "quantité de bille" (¼, ½, ¾, or "bille pleine"/full ball) in the exercise text — a French billiard-teaching convention describing the aiming contact fraction between cue ball and object ball needed to send the object ball into the stated pocket. This is a *textual* aiming parameter, not something separately drawn in the diagram (the diagram only shows resulting ball position + target arrow, not the aiming geometry itself). A content team building an aim-assist or tutorial feature would need to translate this fraction into the corresponding cue-ball/object-ball/pocket geometry themselves, or source a supplementary explanation of the "quantité de bille" system (mentioned as a foundational "notion de base" in the Bronze intro, p.9) since the regulation assumes the concept is already taught elsewhere and does not itself define it numerically/geometrically.
- **"Fermer la table" setups (Argent D-I, all of Or)**: the placement text for these ("positionner les billes de telle sorte qu'aucune bille rouge/jaune ne peut être jouée directement") is a setup instruction to the arbitre/organizer, not an instruction to the player — it specifies that the balls must be arranged so no direct/straight pot is available, forcing bank shots or angled combinations. This means the *exact* obstruction geometry in the source diagram is load-bearing (unlike the simpler Bronze "quantité de bille" figures, where the same conceptual exercise could tolerate minor position variance) — these diagrams should be redrawn faithfully/pixel-accurate to the original rather than freely re-composed.

---

## 3. Scoresheet ("feuille de marque") layout — the artifact the app must replace

There are **3 distinct per-player scoresheet templates** (one per level, pages 11/21/33), plus **3 distinct aggregate results sheets** ("feuille de résultats", pages 17/29/39, one row per competitor across a whole competition), plus **2 filled worked examples** (pages 43, 45) used here to validate the scoring model above.

### Feuille de marque — Bronze (p.11)
Header fields: NOM, Prénom, Club du joueur, Date de naissance, Club organisateur, Ligue.
Restated rules block (3 essais max; 5/3/2 pts).
Table columns: **Figure | Exercice | 1er ESSAI (5 pts) | 2ème ESSAI (3 pts) | 3ème ESSAI (2 pts) | Nombre de points marqués (0, 2, 3 ou 5)**.
Rows: grouped visually by Figure (A-F), 4 rows for A/B, 3 rows for C/D/E/F (20 rows total). Each essai column is a single checkbox (one ball per exercise).
Footer: **TOTAL: ___ / 100 pts**, Date, Signature de l'arbitre-animateur.
Worked example (p.43, player "Elodie Durand", B.C. Nîmes) confirms mechanics: an "X" marks a made pot, "O" a miss; scoring = essai rank of the (single) successful X. Final total 70/100 (pass, ≥50).

### Feuille de marque — Argent (p.21) / Or (p.33)
Same header fields as Bronze.
Rules block restated (4/3/2.5 pts per ball).
Table columns: **EXERCICE | 1er ESSAI (4 pts/bille) | 2ème ESSAI (3 pts/bille) | 3ème ESSAI (2,5 pts/bille) | Meilleur nombre de points marqués**. Critically, each essai column is subdivided into **up to 3 checkboxes** (one per ball in the potting sequence for that essai), with inapplicable checkboxes blacked out per-exercise-row (Argent rows A/B only have 2 relevant checkboxes per essai; Or rows A/B/C/E have fewer than the max 3 relevant checkboxes; Argent row template shows 9 rows A-I; Or shows 6 rows A-F).
Footer identical to Bronze: TOTAL / 100 pts, Date, Signature.
Worked Argent example (p.45, player "Nourredine Dridi", B.C. Strasbourg) — final total 64/100 (fails Argent's 60 threshold... actually 64 ≥ 60, passes). Confirms the per-ball multiplier scoring model detailed in section 1.

### Feuille de résultats (p.17 Bronze / p.29 Argent / p.39 Or) — competition-wide roster
Header: CLUB ORGANISATEUR, Ligue, Date.
Table columns: **NOM | Prénom | CLUB | Score sur 100 | Classement**. One row per competitor in the event. Footer: "Signature du directeur de jeu" + note that one copy goes to the ligue's Formation/Jeunesse contact and one to the F.F.B. national office.

**Implication for the app**: it needs to replace 2 layers of paper — (1) a per-player, per-exercise "feuille de marque" that for Argent/Or must track potentially several balls per essai (not just pass/fail per essai), and (2) an aggregate "feuille de résultats" per competition/session with ranking. The per-player sheet's "essai ends on miss/fault" rule plus multi-ball-per-essai tracking is the trickiest UX/data-model piece.

---

## 4. Level intro pages — skills/knowledge framing (useful for onboarding copy & tagging)

### Bronze (DFA1) intro (p.9)
- Gestuelle: player stability/posture, body orientation for aiming, straight-line stroke, bridge ("chevalet") on rail and on the table surface, power adaptation to ball/pocket distance.
- Notions de base: "quantités de bille" (ball contact fractions), aiming to pot, attacking the cue ball with no side/spin ("sans effet").
- → Confirms Bronze is purely fundamentals: stance, straight potting, no spin, single-ball exercises.

### Argent (DFA2) intro (p.19)
- Gestuelle: bridge adaptation to attack height, power adaptation for repositioning.
- Coups techniques: natural roll-off ("rejet naturel") for repositioning, bank shot before potting ("coup par bande avant"), follow shot ("coulé"), draw shot ("rétro") — all specifically "pour le replacement" (to control cue-ball position after the pot).
- Tactique de jeu: running a series of 3 balls; choosing attack height/angle to achieve the desired replacement.
- → Confirms Argent's defining skill is deliberate cue-ball control after the pot (position play), tested via the multi-ball sequences described above.

### Or (DFA3) intro (p.31), labelled "Discipline 8 Pool Blackball"
- Gestuelle: bridge adaptation depending on which opponent balls are present on the table.
- Coups techniques: side spin ("effet latéral") combined with rejet naturel / coulé / rétro for repositioning.
- Tactique de jeu: running a series of 4-5 balls when opponent balls are scattered on the table; player's own choices for repositioning, avoiding potting the cue ball, and avoiding being snookered.
- → Confirms Or is the "full lecture de table" tier: mixed-color obstacle fields, free cue-ball placement in some exercises, side-spin position play, and shot-selection judgment (not just execution) is explicitly part of what's being evaluated — this is qualitatively different from Bronze/Argent and matters for how the app scores/explains Or exercises (there may legitimately be more than one correct clearing order).

No other prerequisite/cross-reference structure was found between individual exercises (no "do exercise X before Y" at the exercise level) — the only stated prerequisite is at the *level* granularity (Argent requires having covered the notions on p.19; Or requires having covered the notions on p.31), per the Avertissement on p.3.

---

## 5. Full exercise-by-exercise catalog

Format per exercise: `Level | Figure | Exercise# — description`

### BILLARD DE BRONZE (D.F.A. 1) — 20 exercises, Figures A-F, 1 ball each, fixed cue ball per figure, quantité-de-bille aiming, no spin, no reposition.

**Figure A** (cue ball centered lower-middle; 2 yellow + 2 red object balls upper area)
- A1 — Pot the ball marked "1" (yellow), quantité ½ bille, into the top-right corner pocket.
- A2 — Pot the ball marked "2" (yellow), quantité ¾ bille, into the top-right corner pocket.
- A3 — Pot the ball marked "3" (red), quantité bille pleine (full ball), into the top-middle pocket.
- A4 — Pot the ball marked "4" (red), quantité ½ bille, into the top-middle pocket.

**Figure B** (cue ball upper-middle; red/yellow balls spread across table)
- B1 — Pot ball "1" (red), quantité bille pleine, into the bottom-left corner pocket. **[corrected 2026-09-06, verified directly against PDF p.13 — original said top-middle; ball 1's arrow actually converges with ball 2's at bottom-left]**
- B2 — Pot ball "2" (yellow), quantité ¼ bille, into the bottom-left corner pocket.
- B3 — Pot ball "3" (yellow), quantité ¾ bille, into the bottom-right corner pocket.
- B4 — Pot ball "4" (red), quantité ½ bille, into the bottom-right corner pocket.

**Figure C** (cue ball center; yellow + red balls upper half)
- C1 — Pot ball "1" (yellow), quantité ¾ bille, into the top-middle pocket. **[corrected 2026-09-06, verified directly against PDF p.14 — original said top-left; ball 1's arrow actually points to the top-middle pocket, distinct from ball 2's top-left target]**
- C2 — Pot ball "2" (red), quantité ¼ bille, into the top-left corner pocket. **[corrected 2026-09-06, verified directly against PDF p.14 — original said black; ball is drawn red, no black ball appears anywhere in Figure C]**
- C3 — Pot ball "3" (red), quantité ¼ bille, into the bottom-middle pocket.

**Figure D** (cue ball upper area; yellow + red balls)
- D1 — Pot ball "1" (yellow), quantité ¾ bille, into the top-middle pocket.
- D2 — Pot ball "2" (red), quantité bille pleine, into the bottom-middle pocket.
- D3 — Pot ball "3" (yellow), quantité ½ bille, into the top-right corner pocket.

**Figure E** (cue ball lower-middle; red + 2 yellow balls)
- E1 — Pot ball "1" (yellow), quantité bille pleine, into the top-right corner pocket.
- E2 — Pot ball "2" (yellow), quantité ½ bille, into the top-right corner pocket.
- E3 — Pot ball "3" (red), quantité ¾ bille, into the top-middle pocket.

**Figure F** (cue ball upper-middle; yellow + 2 red balls)
- F1 — Pot ball "1" (yellow), quantité ¾ bille, into the bottom-right corner pocket.
- F2 — Pot ball "2" (red), quantité ½ bille, into the bottom-middle pocket.
- F3 — Pot ball "3" (red), quantité bille pleine, into the bottom-left corner pocket. **[corrected 2026-09-06, verified directly against PDF p.15 — original said bottom-right; ball's arrow points to bottom-left]**

---

### BILLARD D'ARGENT (D.F.A. 2) — 9 exercises, lettered A-I, one diagram = one exercise, multi-ball/reposition, per-ball scoring.

- **A** — Pot the red ball then reposition the cue ball to be able to play the black. Setup: red ball positioned at quantité ¾ bille relative to its pocket. (2-ball sequence.)
- **B** — Pot the red ball then reposition to play the black. Setup: red at quantité bille pleine. (2-ball sequence.)
- **C** — Pot both yellow balls in sequence, then reposition to play the black. Setup: 1st yellow at quantité ¾ bille. (3-ball sequence.)
- **D** — "Fermer la table" (clear the table) using the red balls, then the black. Setup instruction: arrange the balls so that no red ball can be played directly (forces a bank shot/angled route). **Sequence confirmed by Fifi: 2 red balls + black = 3-ball sequence.**
- **E** — Fermer la table with the red balls. Setup: 1st red positioned at quantité ¾ bille.
- **F** — Fermer la table with the yellow balls, then the black. Setup: 1st yellow at quantité ¾ bille. **Sequence confirmed by Fifi: 2 yellow balls + black = 3-ball sequence.**
- **G** — Fermer la table with the yellow balls, then the black. Setup: 1st yellow at quantité bille pleine. **Sequence confirmed by Fifi: 2 yellow balls + black = 3-ball sequence.**
- **H** — Fermer la table with the red balls, then the black. Setup: 1st red at quantité ½ bille. **Sequence confirmed by Fifi: 2 red balls + black = 3-ball sequence.**
- **I** — Fermer la table with the yellow balls, then the black. Setup: 1st yellow at quantité ¾ bille. **Sequence confirmed by Fifi: 2 yellow balls + black = 3-ball sequence.**

(All 9 involve reposition/replacement of the cue ball after each successful pot within the sequence; "fermer la table" exercises D-I are set up as deliberately blocked/no-direct-shot layouts, per section 2 above, and each ball successfully cleared scores independently at the essai's per-ball rate.)

---

### BILLARD D'OR (D.F.A. 3) — 6 exercises, lettered A-F, one diagram = one exercise, all "fermer la table," increasing ball counts/complexity, table-reading focus.

- **A** — Fermer la table avec les billes jaunes, puis la noire (close out using the yellow balls, then black). **[corrected 2026-09-06, verified directly against PDF p.35 — field is 3 yellow + white + black, not 2 yellow as the original shorthand implied; 4-ball sequence]** Balls not numbered — no prescribed clearing order.
- **B** — Fermer la table avec les billes rouges, puis la noire. **[corrected 2026-09-06, verified directly against PDF p.35 — field is 3 red + white + black, not 2 red; 4-ball sequence]** Not numbered — no prescribed clearing order.
- **C** — Fermer la table avec les billes jaunes, puis la noire. Larger, denser mixed field (multiple reds and yellows plus black present as obstacles) — tests reading the table for a viable clearing route. **Sequence confirmed by Fifi: 3 yellow balls + black = 4-ball sequence.**
- **D** — Fermer la table avec les billes jaunes, puis la noire. Even denser mixed field (comparable to a near-full rack), highest-complexity layout of the six. **Sequence confirmed by Fifi: 3 yellow balls + black = 4-ball sequence.**
- **E** — Fermer la table avec les billes rouges, puis la noire. Mixed field of reds/yellows; **cue ball has no fixed position — the player freely places it within the designated "zone de replacement"** (baulk-style area marked by the vertical line present on all diagrams). **Sequence confirmed by Fifi: 3 red balls + black = 4-ball sequence.** [Note 2026-09-06: two independent visual re-reads of PDF p.37 could not reliably locate a black ball in this specific diagram (only 3 red + 3 yellow clearly visible) — plausibly small/faint against the grid-dot overlay, the exact failure mode this document's own §2 warns about. Fifi's direct count against the physical rulebook remains authoritative for scoring (`nombreBillesSequence = 4`); the app's rendered schema for this exercise should show only the balls actually visible in the source rather than fabricate a black-ball position.]
- **F** — Fermer la table avec les billes jaunes, puis la noire. Densest layout of the set; **cue ball again freely placed by the player in the zone de replacement.** **Sequence confirmed by Fifi: 4 yellow balls + black = 5-ball sequence.**

(Consistent with the Or intro's stated evaluation of "running a series of 4-5 balls when opponent balls are scattered on the table," plus judgment around avoiding potting the cue ball and avoiding being snookered — these are tactical/decision exercises, not just execution drills.)
