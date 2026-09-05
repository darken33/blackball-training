---
title: Domain-accuracy review — scoring model vs. official D.F.A. Blackball rules
reviewed: prd.md (§3, §4.2 FR-3–FR-8, §5, §6) against addendum.md and content-catalog.md
date: 2026-09-05
---

# Domain-accuracy review findings

Method: traced the FR-6 scoring formula and FR-4 essai-input model by hand against concrete
exercises in content-catalog.md (Bronze A1–A4, Argent A/C/E, Or A–F) and cross-checked against
the two official worked examples cited in addendum.md (p.43 Bronze "Elodie Durand", p.45 Argent
"Nourredine Dridi"). The core arithmetic (score essai = billes empochées × valeur du barème,
meilleur essai retenu) checks out exactly against both worked examples for every row traced
(Argent row A: 1×4 then 2×3 → best 6; Argent row E: 3×4 = 12; Bronze: single X at essai rank).
Three genuine gaps survived verification; everything else checked (quantité de bille, zone de
replacement, fermer-la-table diagram fidelity, thresholds 50/60/70, level-locked séance) is
correctly and completely covered by the PRD's FRs and Glossaire — no finding raised on those.

---

## Finding 1 — Glossaire/FR-4 assume a prescribed potting order that doesn't exist for several Or exercises

- **Severity:** high
- **PRD location:** §3 Glossaire, entries "Exercice" ("...une ou plusieurs Billes à empocher **dans un ordre donné**...") and "Bille(s) de la séquence" ("Le nombre de billes à empocher **dans l'ordre**..."); §4.2 FR-4 ("l'utilisatrice saisit le résultat de chaque bille de la séquence de l'essai").
- **Failure scenario:** content-catalog.md §2 and §5 state explicitly that Or exercise A ("balls not numbered — no prescribed clearing order") and, per §2's diagram-convention note, Or C, D and F ("leave balls largely unlabeled, consistent with their 'lecture de table' intent — the player must work out their own clearing order rather than follow a prescribed sequence") have **no** official potting order — the DFA3 curriculum specifically tests the player's own table-reading judgment, and the Or intro page (p.31, cited §4 of the catalog) notes "there may legitimately be more than one correct clearing order." The PRD's own Glossaire nonetheless defines every Exercise as having billes ordered "dans un ordre donné," unconditionally. FR-2's consequence bullet already hedges this correctly ("ordre de poche si prescrit... **si**"), which means §3 (Glossaire) and §4.1 (FR-2) directly contradict each other on this point, and §0 states the Glossaire's wording governs "partout dans ce document." If a developer implements FR-4 literally per the Glossaire, the essai-input UI would present a fixed, labeled "Bille 1 / Bille 2 / Bille 3..." sequence for these Or exercises — an artificial order the source material explicitly says does not exist — which can mis-record or reject a legitimate attempt where the player pots the balls in a different (self-chosen, still-valid) order than the one the app arbitrarily assigned.
- **Suggested fix:** add an explicit unordered-sequence case to FR-4 and reword the two Glossaire entries to match FR-2's conditional phrasing, e.g. "Bille(s) de la séquence — ... à empocher dans un ordre prescrit par l'exercice si applicable (numérotation du schéma), sinon décompte non-ordonné (billes empochées avant l'échec, sans identité imposée)." For unordered exercises, FR-4 should specify that the input model is a running count of successful pots before failure, not a per-labeled-ball form.

## Finding 2 — FR-1's "nombre de billes de la séquence" input is undefined for ~9 of the 35 exercises

- **Severity:** medium
- **PRD location:** §4.1 FR-1 conséquence ("Chaque exercice porte le nombre de billes de la séquence attendu... variable pour Argent/Or — donnée consommée par le moteur de score FR-6").
- **Failure scenario:** FR-6's formula (score = billes empochées × valeur) needs the sequence length N only to define the maximum score per essai (used for UI/progress display and total-vs-threshold math), but the ground-truth document this PRD points to for that data (content-catalog.md, per §0: "le contenu exhaustif... vit dans content-catalog.md") does not actually give an exact ball count for Argent D, F, G, H, I ("Fermer la table... no quantité given" / "1st red at quantité X" with no total stated) nor for Or C, D, E, F ("denser mixed field," "near-full rack," "densest layout" — qualitative only, no digit given). That's roughly 9 of 35 exercises (all of Argent's "fermer la table" rows past C, and 4 of Or's 6) where the number a developer needs to hard-code for FR-1/FR-6 simply isn't present in the artifact the PRD treats as authoritative and non-duplicated. Built literally from what's handed off, this either blocks implementation of those 9 exercises' scoring or forces a guessed/wrong N, which directly changes the computed max-per-essai score and the session total compared against the 50/60/70 threshold.
- **Suggested fix:** flag in FR-1 (or as an explicit content-authoring action item, since the number is recoverable from the original 47-page PDF/diagrams even though the catalog summary omits it) that exact per-exercise ball counts must be re-extracted from the source diagrams for these 9 rows before the scoring engine can be built; content-catalog.md should not be treated as sufficient/final for this specific data point.

## Finding 3 — Glossaire states Argent/Or sequence length as "1 à 5," contradicting addendum.md's own "2 à 5"

- **Severity:** low
- **PRD location:** §3 Glossaire, "Bille(s) de la séquence" — "(1 en Bronze, **1 à 5** en Argent/Or selon l'exercice)."
- **Failure scenario:** addendum.md states plainly: "Argent et Or : plusieurs exercices demandent d'empocher **2 à 5 billes** en séquence dans un même essai." No exercise in content-catalog.md's full list (Argent A–I, Or A–F) is documented with a 1-ball sequence — the minimum documented anywhere in Argent/Or is 2 (Argent A/B). The Glossaire's "1 à 5" therefore both contradicts the PRD's own addendum and implies a 1-ball Argent/Or exercise exists when none does. This has no arithmetic consequence (the formula is correct for N=1 too), but it is a factual inconsistency a content author or developer could use to wrongly validate/accept a 1-ball Argent/Or content entry as plausible, or simply a documentation-trust issue between the two linked artifacts.
- **Suggested fix:** change the Glossaire entry to "(1 en Bronze, 2 à 5 en Argent/Or selon l'exercice)" to match addendum.md.

---

No other inconsistency was confirmed by hand-tracing exercises through the FRs. In particular,
FR-6 and FR-5's best-essai-kept logic reproduce both official worked examples exactly, and the
§5/§6 exclusions (technique tutorials, cloud sync, competition mode) do not drop anything the
catalog calls load-bearing — quantité de bille, zone de replacement, and fermer-la-table diagram
fidelity are all explicitly required by FR-2 and named in the Glossaire.
