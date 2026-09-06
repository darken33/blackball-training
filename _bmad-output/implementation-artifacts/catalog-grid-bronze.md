# Bronze Figures A-F — Extracted Layout Data

Source: `input/reglement-dfa-blackball.pdf`, pages 13-15.
Coordinates: x/y as % of playing surface, 0-100, rounded to nearest 5.
x: 0=left short rail, 100=right short rail. y: 0=top long rail, 100=bottom long rail.
Table is landscape (wider than tall). Middle pockets sit on the long rails (top-middle, bottom-middle), i.e. at x=50.

## Pocket positions (fixed, shared by all figures)

| pocket | x | y |
|---|---|---|
| top-left | 0 | 0 |
| top-middle | 50 | 0 |
| top-right | 100 | 0 |
| bottom-left | 0 | 100 |
| bottom-right | 100 | 100 |
| bottom-middle | 50 | 100 |

## Baulk line

Vertical line, consistent across all 6 figures, at approximately **x = 30** (about 1/3 from the left short rail), spanning full table height.

---

## Figure A

Cue ball (white): x=65, y=70

| label | color | x | y | target_pocket |
|---|---|---|---|---|
| 1 | yellow | 78 | 25 | top-right |
| 2 | yellow | 72 | 20 | top-right |
| 3 | red | 57 | 30 | top-middle |
| 4 | red | 55 | 40 | top-middle |

Matches expected colors/targets. Balls 1/2 arrows converge at top-right corner; balls 3/4 arrows converge at top-middle pocket.

## Figure B

Cue ball (white): x=37, y=15

| label | color | x | y | target_pocket |
|---|---|---|---|---|
| 1 | red | 35 | 38 | bottom-left |
| 2 | yellow | 28 | 78 | bottom-left |
| 3 | yellow | 52 | 55 | bottom-right |
| 4 | red | 48 | 65 | bottom-right |

Verified directly against PDF p.13 (2026-09-06): ball "1" (red) arrow converges with ball "2" at bottom-left corner. `content-catalog.md` §5 stated top-middle for B1 — **corrected**, source PDF is authoritative.

## Figure C

Cue ball (white): x=32, y=50

| label | color | x | y | target_pocket |
|---|---|---|---|---|
| 1 | yellow | 40 | 25 | top-middle |
| 2 | red | 18 | 18 | top-left |
| 3 | red | 45 | 72 | bottom-middle |

Verified directly against PDF p.14 (2026-09-06): ball "2" is filled red, no black ball appears anywhere in Figure C. `content-catalog.md` §5 stated black for C2 — **corrected**, source PDF is authoritative.

## Figure D

Cue ball (white): x=63, y=70

| label | color | x | y | target_pocket |
|---|---|---|---|---|
| 1 | yellow | 55 | 62 | top-middle |
| 2 | red | 52 | 88 | bottom-middle |
| 3 | yellow | 88 | 28 | top-right |

Matches expected colors/targets.

## Figure E

Cue ball (white): x=73, y=68

| label | color | x | y | target_pocket |
|---|---|---|---|---|
| 1 | yellow | 75 | 35 | top-right |
| 2 | yellow | 78 | 22 | top-right |
| 3 | red | 57 | 28 | top-middle |

Matches expected colors/targets. Balls 1/2 arrows converge at top-right corner.

## Figure F

Cue ball (white): x=50, y=20

| label | color | x | y | target_pocket |
|---|---|---|---|---|
| 1 | yellow | 57 | 55 | bottom-right |
| 2 | red | 53 | 78 | bottom-middle |
| 3 | red | 35 | 72 | **bottom-left (visual)** — expected bottom-right |

**MISMATCH**: Ball "3" (red) has an arrow pointing to the bottom-left corner pocket, not bottom-right as stated in the provided context. Colors match expected.

---

## Summary of mismatches to review

1. **Figure B, ball 1**: visual target = bottom-left corner; expected (per context) = top-middle.
2. **Figure C, ball 2**: visual color = red; expected (per context) = black.
3. **Figure F, ball 3**: visual target = bottom-left corner; expected (per context) = bottom-right corner.

All other figures/balls match the provided expected colors and targets. Positions above are visual estimates (±5%), not pixel-measured.
