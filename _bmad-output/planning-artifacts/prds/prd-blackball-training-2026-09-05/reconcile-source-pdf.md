---
title: Reconciliation PRD vs content-catalog.md — scoresheet layout & level intro pages
created: 2026-09-05
scope: fresh pass, independent of the earlier domain-accuracy review (multi-ball scoring formula, unordered Or exercises, and Argent D/F/G/H/I / Or C/D/E/F ball counts are already fixed and NOT repeated here)
---

# Gaps found

## 1. Level intro/framing pages (content-catalog.md §4) are never referenced anywhere in the PRD — Medium

content-catalog.md §4 extracts substantial per-level framing text from the source PDF (p.9 Bronze, p.19 Argent, p.31 Or): stance/gestuelle notes, the named technical shots each level tests (rejet naturel, coulé, rétro, effet latéral), the tactical framing ("running a series of N balls", "lecture de table" judgment for Or), and — importantly — the *only* prerequisite structure the regulation defines: "Argent requires having covered the notions on p.19; Or requires having covered the notions on p.31" (a level-granularity prerequisite per the Avertissement p.3, no exercise-to-exercise prerequisites exist).

PRD §4.1 (FR-1 "Catalogue des 3 niveaux", FR-2 "Affichage du schéma d'exercice") only specifies exercise-level content (schema, statement, ball count, barème). Nothing in FR-1/FR-2 — or anywhere else in the PRD — requires the app to surface this per-level framing text, and it is not listed in §5 Non-Objectifs as a deliberate exclusion either. It is simply absent, with no decision recorded.

For someone building from the PRD alone this is a silent content-type drop: they would not know this text exists in the source, would not know whether to embed it (e.g. as a level-intro screen shown when picking Bronze/Argent/Or), and would not know the level-gating question (should the app warn/prevent starting Argent before Bronze is passed?) was considered and consciously rejected, or just never raised. Given the app already embeds all diagram/statement content as "fixed/embedded" (§5, "pas d'édition de contenu in-app"), the natural place to decide this is FR-1, and it's currently silent.

**PRD location:** §4.1 (FR-1, FR-2); addendum.md "Catalogue de contenu complet" line also cites this content as extracted but doesn't carry it into a requirement either.

**Suggested fix:** Either (a) add a explicit non-objectif ("pas de contenu d'introduction de niveau / pas de gating de niveau — l'app affiche les 35 exercices, rien sur les prérequis pédagogiques") or (b) add a minimal FR under §4.1 to show the per-level framing text once when a level is first selected (no gating logic needed, purely informational).

## 2. Level-gating / prerequisite enforcement is undecided, not just unrequested — Low

Directly downstream of #1: FR-3 lets the user freely pick any of the 3 levels at the start of every session, with no mention of whether Argent/Or should be reachable before Bronze/Argent is passed. The source regulation's only prerequisite statement (level-granularity, p.3 Avertissement, surfaced in content-catalog.md §4) is a judgment call the PRD never records — it's neither adopted nor explicitly rejected. Low severity because for a solo self-assessment tool the free-choice behavior is almost certainly the right call (and is arguably implied by FR-3's silence + the absence of any "diploma sequence" concept in the Glossaire), but it's worth one line in §5 Non-Objectifs or an ASSUMPTION entry to close the loop, since a fresh builder could reasonably guess either way.

**PRD location:** §4.2 FR-3; §10 Index des hypothèses (currently doesn't cover this).

# Not gaps (checked and confirmed already covered)

- Scoresheet header fields (NOM/Prénom/Club/Date de naissance/Ligue/arbitre-animateur signature) and the aggregate "feuille de résultats" (ranking/classement layer) are correctly out of scope — §5 Non-Objectifs explicitly excludes "mode compétition officielle (rôle arbitre-animateur, feuille de résultats imprimable, remontée F.F.B.)" and §2.2 excludes any profile/account notion, so the mono-user Historique (FR-9/FR-10) deliberately drops these fields rather than missing them silently.
- "Meilleur nombre de points marqués" (Argent/Or scoresheet column) = PRD's Glossaire "Score d'exercice" (best essai retained) — FR-5/FR-10 capture this correctly.
- Per-essai multi-ball checkbox tracking (up to 3 sub-checkboxes per essai column) = FR-4/FR-6/FR-10's per-ball entry and scoring — correctly represented.
