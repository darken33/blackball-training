# PRD Quality Review — Carnet de Score Blackball DFA

## Overall verdict
This is a tight, well-earned PRD for its scale: the scoring model correction (multi-ball sequence scoring vs. the brief's flat-score assumption) is traced to a primary source (règlement p.45) and threaded consistently through Glossary → FRs → addendum, and scope cuts are stated rather than implied. The main risks are cosmetic rather than structural: no Success Metrics section at all, one NFR bound left as an adjective ("cible tactile suffisamment grande"), and a couple of small cross-reference/formatting slips. Nothing here would block architecture from starting.

## Decision-readiness — strong
Trade-offs are named with what was given up, not just what was chosen. §6.2 states plainly that "Reprise d'une séance interrompue" is out of scope and that an interrupted session is abandoned with no save/resume — not softened into a "consideration." §7's NFR "Persistance locale résiliente" surfaces a real tension against FR-8 (session abandonment erases progress) and resolves it explicitly in the same paragraph: *"Ceci ne contredit pas FR-8 : c'est l'abandon volontaire... qui efface la séance, pas un verrouillage d'écran passager."* That's a tension surfaced and reconciled in the open, not smoothed over.

The `[NOTE FOR PM]` at §4.1 FR-2 sits at a genuine open fork (schema-as-image vs. schema-rendered-from-grid-coordinates) with a concrete recommendation that keeps the option open at low cost — a real tension, not a safe checkpoint. The single Open Question (§8) is genuinely undecided (deferred to architecture), not a rhetorical question answered in the next sentence.

### Findings
- **low** Cross-reference misdirects to the wrong section (§4.2 FR-8) — FR-8's consequence bullet says "cf décision §6 — pas d'édition a posteriori," but §6 ("Périmètre MVP") only lists scope, it doesn't carry the rationale; the actual reasoning lives in §5 Non-Objectifs. *Fix:* point the cross-reference at §5 instead of §6.

## Substance over theater — strong
No persona theater: a single named protagonist (Fifi) across all three UJs, appropriate to a solo-use tool — not padded to look thorough. No innovation/differentiation section exists, and none is missing — nothing here claims novelty. NFRs in §7 are product-specific, not boilerplate: "Hors-ligne total" is tied to a stated cause (salle sans Wi-Fi fiable) and mechanism (service worker, assets embarqués); "Aucune donnée envoyée à un tiers" is tied to the no-account decision. The Vision (§1) is specific to this niche (D.F.A. diplomas, one-handed entry mid-game, multi-ball sequence scoring) and could not be swapped into an unrelated PRD unchanged.

No findings — this dimension doesn't need any.

## Strategic coherence — adequate
The thesis is stated and carried through: paper/spreadsheet self-assessment is broken because it interrupts play and never gets re-transcribed (§1), so every kept feature (one-handed entry, running total vs. threshold, read-only history) serves that thesis directly. Feature prioritization follows from the thesis, not from ease: the addendum shows the scoring-engine correction (flat score → multi-ball sequence score) was driven by rule-fidelity, not implementation convenience.

### Findings
- **medium** No Success Metrics section anywhere in the PRD (confirmed by search — no "métrique," "indicateur," "KPI," or "success metric" appears). For a solo hobby tool the omission is defensible under shape fit, but the rubric's own tell applies loosely here too: there is no stated way — even informal — for Fifi/the PM to know later whether the app achieved its stated Vision claim ("savoir en temps réel si sa séance du jour franchirait le seuil," "transforme une pratique... abandonnée en un vrai suivi"). *Fix:* add one or two lightweight, self-facing success signals (e.g., "séances loggées sans abandon," "au moins une séance/semaine sur 4 semaines") — doesn't need counter-metrics rigor at this scale, just an explicit statement rather than silence.

## Done-ness clarity — adequate
Most FRs are unforgiving in the right way: FR-6's "Conséquences (testables)" give literal worked numbers (Bronze 5/3/2, "3 × 4 = 12 pts, conforme à l'exemple officiel du règlement"), and FR-1/FR-2/FR-3/FR-4/FR-8 all carry explicit, checkable consequence bullets. This is the dimension the PRD invests most in, and it shows.

### Findings
- **medium** Adjective without a bound in an NFR (§7, "Saisie à une main") — *"cible tactile suffisamment grande pour un usage debout à côté de la table"* is exactly the "reasonable performance" pattern the rubric calls out: no minimum tap-target size (e.g., a concrete dp/px floor) is given, so "done" for this NFR is a judgment call, not a test. *Fix:* state a numeric floor (e.g., ≥44dp per platform touch-target guidance) or explicitly defer it to UX/architecture as a `[NOTE FOR PM]` rather than leaving it implicit.
- **low** Formatting inconsistency: FR-7, FR-9, FR-10, and FR-11 have no "Conséquences (testables)" subsection, unlike FR-1 through FR-6 and FR-8. The FR statements themselves are testable inline (e.g., FR-9's field list and sort order), so this isn't a substantive gap — but the inconsistent structure makes it harder for downstream story-writing to source-extract consistently. *Fix:* either add short consequence bullets to FR-7/9/10/11 for structural consistency, or confirm the inline wording is intentionally sufficient.

## Scope honesty — strong
§5 Non-Objectifs is doing real work, not filler: seven concrete exclusions, each with a one-line reason (e.g., "Pas de contenu pédagogique sur les techniques... l'app affiche le schéma et le barème officiels, pas un tutoriel de technique," with an explicit `[NOTE FOR PM]` flagging it as a plausible v2). The single `[ASSUMPTION: ...]` at §2.2 (no account/profile notion in v1) round-trips cleanly to the Index at §9 — inline and indexed versions match verbatim. Open-items density (1 Open Question, 1 Assumption, 2 `[NOTE FOR PM]`) is low, which is appropriate for a low-stakes solo tool rather than a sign of hidden gaps — everything material found in the addendum (schema rendering, persistence mechanism, cache strategy) is explicitly flagged as "à valider en architecture" rather than silently assumed.

No findings — this dimension is solid.

## Downstream usability — adequate
The PRD is a chain-top document (§0: "avant de passer à l'architecture technique," and the addendum's "Hypothèses techniques à valider en architecture" section), so this dimension matters. Glossary (§3) terms are used consistently across FRs and UJs (Niveau, Séance, Essai, Score d'exercice, Seuil de réussite all recur with stable meaning). FR IDs (FR-1…FR-11) and UJ IDs (UJ-1…UJ-3) are contiguous and unique, and content-catalog.md — referenced repeatedly from both prd.md and addendum.md as the source of exhaustive per-exercise content — does exist in the workspace, so that cross-reference resolves.

### Findings
- **low** Minor spelling/glossary drift: FR-3 reads "Realise UJ-1" (missing accent) while FR-4, and the §4.1/§4.2/§4.3 section descriptions, consistently use "Réalise." Cosmetic, but worth a pass before this feeds a template-driven downstream tool.

## Shape fit — strong
This is a single-operator hobby tool, but one with a meaningful physical-UX constraint (one-handed entry mid-game), so UJs earn their place rather than being over-formalized filler — each of the three UJs surfaces a distinct real constraint (solo/no-referee flow, multi-ball sequence entry, progress review), not generic "user opens app" padding. The PRD also treats the F.F.B. rulebook like a compliance source without forcing full regulatory-traceability ceremony: FR-1's consequences cite exact counts (Bronze 20, Argent 9, Or 6) and the addendum's score-model correction cites the exact page of the source document ("Confirmé par l'exemple rempli p.45"). Rigor is calibrated to stakes — light process, real substance — matching the rubric's guidance for hobby/solo shape.

No findings — the shape choice is well-judged.

## Mechanical notes
- Cross-reference: FR-8's "cf décision §6" should be "cf §5" (see Decision-readiness finding above).
- Spelling: "Realise" (FR-3) vs. "Réalise" (elsewhere) — accent inconsistency.
- Structural inconsistency: FR-7/9/10/11 lack the "Conséquences (testables)" subsection that FR-1–6 and FR-8 have (see Done-ness clarity finding above) — not a content gap, but breaks the pattern downstream tooling may rely on.
- ID continuity: clean — FR-1 through FR-11 and UJ-1 through UJ-3, no gaps or duplicates.
- Assumptions Index roundtrip: clean — the one inline `[ASSUMPTION: ...]` (§2.2) matches the one entry in §9 verbatim.
- UJ protagonist naming: clean — all three UJs name Fifi with situational context inline (location, hand constraint, goal).
- Glossary drift: none of note — capitalized domain terms (Niveau, Séance, Exercice, Essai, Barème, Score d'exercice, Score total, Seuil de réussite) are used identically across §3, §4, and the addendum.
