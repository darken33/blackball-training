# Review — Version Verification (Stack table vs. live web reality)

**Lens:** every committed decision was web-researched or reality-checked (not asserted from training data) — current library/framework versions, that each named technology still exists and fits, and — since this is greenfield — the live defaults of the starter it leans on.

**Method:** re-ran live web searches/fetches today (2026-09-05) against npm, the Vite release page, GitHub, and the official create-vite template, and cross-checked against the memlog's own `(version)` entries.

---

## Verdict

Three of the four fully-verified entries (React 19.2.8, vite-plugin-pwa 1.3.0, Dexie 4.4.5) check out exactly against live sources; the fourth (Vite 8.1.3) is already one minor version behind the live registry as of the same day the spine claims verification; and TypeScript — the one Stack-table row without a `(version)` memlog entry — turns out to be the row that most needed one, since "latest stable" today means a disruptive native-compiler major (TS 7.0) that the actual create-vite scaffold does *not* use.

---

## Findings

### 1. [MEDIUM] Vite pin (8.1.3) is already stale relative to today's live registry, and the cited source doesn't actually back the patch number

- Live check today: npm's latest `vite` is **8.2.2** (published ~15 days before this review), and Vite's own release-policy page states regular patches now land on `vite@8.2`, while `vite@8.1` only gets "important fixes and security patches backported" — i.e. 8.1.x is already the previous, reduced-maintenance line, not current.
- The memlog's `(version)` entry cites `vite.dev/blog/announcing-vite8` — that page announces the **8.0.0** major launch (March 2026) and the Rolldown/perf story. It is evidence that "Vite 8 exists and is the current major," not evidence that **8.1.3** specifically is the latest/right patch to pin. The two things got conflated.
- Net effect: the verification is real at the major-version level but not at the exact-pin level, and the exact pin was already outdated on the spine's own authoring date. Not a functional risk (8.1→8.2 is a patch/minor line, no known breaking change surfaced), but it undercuts the "verified via web" claim for this specific number and should be re-checked (or repinned to 8.2.x) before scaffold time.
- Sources: npmjs.com/package/vite, vite.dev/releases, vite.dev/blog/announcing-vite8.

### 2. [MEDIUM-HIGH] TypeScript is the one row with no `(version)` memlog entry — and it's the row where that omission actually bites

- The memlog has exactly four `(version)` entries (Vite, vite-plugin-pwa, React, Dexie), each with a source URL. TypeScript has **none** — it only appears in the Stack table as a hedge ("dernière stable compatible Vite 8, pinnée au moment du scaffold") and in the closing `(event)` line claiming "recherche web effectuee pour toutes les versions de stack" — which is not true for TypeScript, since no TS-specific search or source is logged anywhere.
- Had it been checked: **TypeScript 7.0** shipped July 2026 as the first stable release on Microsoft's rewritten native Go compiler — a genuinely disruptive major (shared-memory multithreading, 8-12x faster builds, but shipped **without a stable programmatic API** until the promised 7.1). If "dernière stable" is read literally (npm `latest` tag), that resolves to 7.0.2 today.
- But the actual starter this project leans on tells a different story: the live `create-vite` `template-react-ts/package.json` currently pins **`typescript: ~5.9.3`** — two majors behind "latest stable." The ecosystem (typescript-eslint, various build-tool integrations) is still catching up to TS7's native compiler and missing programmatic API, so scaffolding tools are deliberately staying on 5.9.x for now.
- So "dernière stable compatible Vite 8, pinnée au moment du scaffold" is ambiguous in a way that matters: read as "whatever `npm create vite@latest` gives you," it currently means **5.9.3**; read as "latest stable TypeScript," it would wrongly suggest **7.0.x**, a version the starter itself doesn't yet use and whose tooling story is still incomplete. This is exactly the kind of "live default of the starter" the spine should have reality-checked and didn't.
- Recommendation: add a `(version)` memlog entry for TypeScript (or fold it into the Vite one) that states explicitly "create-vite react-ts template currently scaffolds TypeScript ~5.9.3, not the TS7 native-compiler line — track the scaffold's pin, do not independently upgrade to 7.x without checking programmatic-API tooling compat."
- Sources: npmjs.com/package/typescript, infoq.com (TypeScript 7.0 release), github.com/vitejs/vite create-vite react-ts template package.json.

### 3. [LOW] TypeScript's Stack-table cell violates the spine's own "Name + version only" norm — real, but the underlying defer-to-scaffold choice is defensible

- `spine-template.md` is explicit: Stack rows are "Name + version only; the why lives in the memlog." The TypeScript row instead puts explanatory prose ("dernière stable compatible Vite 8 (pinnée au moment du scaffold)") in the Version cell — the rationale belongs in the memlog, not inline in the table.
- Mechanically this passes `lint_spine.py`'s `version_pin` check, because that check only flags a **blank** or `{template-token}` cell — it does not require the cell to actually look like a version. So this is a real norm violation that the linter is not designed to catch, not a false negative in the linter's own terms.
- Whether "unpinned, tracks the scaffold" is *itself* acceptable: yes in principle for a value that's inherently determined by another pinned choice (the scaffold's own lockfile) — plenty of real specs leave a transitively-determined version to "whatever the pin resolves to." But per finding #2, that argument only holds if the actual scaffold default was checked, which it wasn't here. Fix: replace the cell with a concrete version (`~5.9.3`, matching the live create-vite template) or, if the team truly wants "whatever scaffold gives," keep the cell to a short pointer ("per scaffold") and move the full rationale + the checked current value to the memlog.

### 4. [INFO] React 19.2.8, vite-plugin-pwa 1.3.0, and Dexie 4.4.5 all check out against live sources

- **React 19.2.8** — confirmed as npm `latest` today; no React 20 announced. Matches memlog exactly.
- **vite-plugin-pwa 1.3.0** — confirmed as npm `latest` today (~4 months old), matches memlog. One residual note: a "Vite 8 support" GitHub issue (#918) existed for the peerDependencies range, but it's closed via a merged PR, and 1.3.0 postdates that fix — so no action needed, just worth knowing peer-dep support was a live-tracked gap, not assumed.
- **Dexie 4.4.5** — confirmed as npm `latest` today, matches memlog. Independent web sources from 2026 continue to rank Dexie as the standard high-level IndexedDB wrapper for exactly this shape of app (offline-first, typed tables, React live-query via dexie-react-hooks) over `idb`/`localForage` — the "still the going choice" half of the lens holds up for Dexie specifically.

### 5. [INFO] "No router" and "no i18n" assumptions were not and don't need web verification

- These are scope/product decisions grounded in the PRD/UX (no deep-linking need, single francophone user), not version or ecosystem facts. Nothing to reality-check against the web here; flagged only to confirm they're correctly out of this lens's scope, not a silent gap.

---

## Summary Table

| Item | Verified in memlog? | Live check result | Verdict |
| --- | --- | --- | --- |
| Vite 8.1.3 | Yes (source: 8.0 launch blog) | npm latest = 8.2.2; 8.1.x now reduced-maintenance line | Stale pin, weak source-to-claim match — MEDIUM |
| React 19.2.8 | Yes | npm latest = 19.2.8, exact match | OK |
| vite-plugin-pwa 1.3.0 | Yes | npm latest = 1.3.0, exact match | OK |
| Dexie 4.4.5 | Yes | npm latest = 4.4.5, exact match | OK |
| TypeScript (unpinned) | **No** | create-vite scaffolds ~5.9.3; naive "latest stable" = TS 7.0 (different major, incomplete tooling) | Missing verification on the row that needed it most — MEDIUM-HIGH |
| Stack-table norm ("Name + version only") | — | TypeScript row carries prose, not a version | Real but low-severity format violation |
