---
title: 'Historique en lecture seule (FR-9, FR-10, FR-11 / CAP-5)'
type: 'feature'
created: '2026-09-06'
status: 'done'
route: 'dispatch'
review_loop_iteration: 1
context:
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-blackball-training-2026-09-05/mockups/historique.html'
baseline_commit: '801ef2c1e56755433f81fabc40579ab840f698d1'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** `adapters/ui/historique/Historique.tsx` n'est qu'un stub à état vide — FR-9/FR-10/FR-11 restent à construire. Dernier morceau du périmètre MVP (CAP-5) ; le reste est déjà `done`.

**Approche :** Module `application/historique/` enveloppant `repository.listerSessionsTerminees`/`getDetailSession` (déjà complets, ne pas modifier), dérivant scores/seuil via `domain/scoring` (AD-1). Remplacer le stub par deux vues (Liste, Détail) fidèles à `mockups/historique.html`.

## Boundaries & Constraints

**Always:**
- `adapters/ui/historique` passe uniquement par `application/historique`, jamais par `adapters/persistence` (AD-6 — la table de traçabilité SPINE l'omet par raccourci, pas une exception).
- Score/seuil/statut toujours recalculés via `domain/scoring` depuis les essais bruts (AD-1), jamais une valeur stockée.
- Exercices du détail triés selon l'ordre canonique `listerExercices(niveau)`, pas l'ordre brut de `getDetailSession` (non garanti) — recaler par `exerciceId`.
- Exercice sans essai valide : 0 pt, "non joué" ×3 — jamais d'erreur bloquante (convention SPINE "Erreurs/bords").
- Réutiliser `LIBELLE_NIVEAU`, le motif `toLocaleDateString('fr-FR')` (`useSession.ts:87`), et les classes/variables de `mockups/historique.html`/`Resume.css` (état texte+couleur, jamais couleur seule).
- Texte état vide inchangé : "Aucune séance enregistrée pour l'instant."

**Never:** ne pas toucher `repository.ts`/`db.ts` (contrat figé) ni `Exercice.tsx` (déjà `done`) ; pas de pagination/recherche/filtre ; aucune édition/suppression/reprise de séance passée (FR-11).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Liste | ≥1 séance close / aucune | Lignes triées desc (date, niveau, score/100, statut) / état vide inchangé | N/A |
| Détail | Tap ligne liste | Titre "{Niveau} — {date}", score/seuil, exercices ordre catalogue + score retenu | N/A |
| Essai | Tap ligne exercice / exercice sans essai | Accordéon "Essai N — X/Y bille(s) — réussi/raté" ou "non joué" / 0 pt + "non joué" ×3 | Pas d'exception |
| Retour | Tap "Retour" en Détail | Revient à Liste, données déjà chargées conservées | N/A |

</frozen-after-approval>

## Code Map

- `repository.ts:149-170` -- `listerSessionsTerminees()`, `getDetailSession(id)`, types `Session/SessionDetail/ExerciceJoueDetail/EssaiEnregistre` -- consommer tel quel ; les types peuvent être importés en `import type` (jamais en valeur) depuis un module sans dépendance Dexie.
- `domain/scoring/index.ts` -- `calculerScoreEssai/Exercice/Total`, `getSeuil`, `estSeuilAtteint` -- seule source de score/statut.
- `domain/catalog/index.ts` -- `listerExercices(niveau)` = ordre canonique du détail ; y ajouter `formatNomFigure(niveau, exerciceId)` -- **pas** dans `adapters/ui/shared/labels.ts` (violerait le sens de dépendance imposé : `application/` ne doit jamais importer `adapters/ui`, seul `domain/` et `application/` peuvent être importés par les deux côtés). `domain/catalog` n'a aucune dépendance runtime, donc `formatNomFigure` y reste testable comme `listerExercices`. Parsing d'id repris de `Exercice.tsx:13-19` (`formatTitre` local, ne pas y toucher, ne pas le faire pointer vers ce nouvel helper), format "Figure {Lettre}{Numéro}" (numéro seulement en Bronze), cf. mockup.
- `scripts/verify-catalog.mjs` -- étendre avec des assertions sur `formatNomFigure` (Bronze garde le numéro, Argent/Or non), même convention `node:assert` que le reste du fichier.
- `application/session/useSession.ts:108-126` -- motif `annule` (flag d'annulation posé par le `useEffect` de chargement initial) déjà utilisé dans ce même repo -- réutiliser un motif équivalent (jeton de requête incrémental) pour `ouvrirDetail` dans `application/historique`, qui déclenche un `getDetailSession` asynchrone sur tap utilisateur, potentiellement plusieurs fois avant la première résolution.
- `resume/Resume.tsx`+`.css` -- pattern layout/CSS le plus proche (`.status-chip`, `.detail-row`, bouton "Retour") -- **seule source du motif "Retour"** ; ne pas l'attribuer à `mockups/historique.html`, qui ne contient aucun bouton de navigation.
- `historique/Historique.tsx` (12 lignes)+`.css` -- stub à remplacer ; seul import externe `App.tsx:8,23,70`.
- `mockups/historique.html` -- classes exactes (`.history-row`, `.exercise-row.expanded`, `.essai-detail-row`) ; deux états statiques côte à côte, aucun bouton retour/chrome de navigation dedans.

## Tasks & Acceptance

**Execution:**
- [x] `domain/catalog/index.ts` -- ajouter `formatNomFigure(niveau, exerciceId)` (cf. Code Map).
- [x] `scripts/verify-catalog.mjs` -- étendre : `formatNomFigure('bronze', 'bronze-a-2') === 'Figure A2'`, `formatNomFigure('argent', 'argent-a-1') === 'Figure A'`.
- [x] `application/historique/types.ts` -- `HistoriqueLigne` (id, niveau, date, scoreTotal, seuil, seuilAtteint), `HistoriqueDetail`/`ExerciceDetailVue` (exerciceId, nom, scoreExercice, essais: {index, texte}[] -- pas de champ `joue` : jamais consommé par le rendu, `texte` encode déjà "non joué").
- [x] `application/historique/deriver.ts` -- fonctions **pures**, aucun import de `adapters/persistence` (en valeur) ni de React : `construireExerciceDetail`, `scoresParExerciceCanonique`, `formatEssaiTexte`, `formatDate` -- prennent en paramètres les données déjà lues par le repository (types `Session`/`EssaiEnregistre` importés en `import type` uniquement) ; aucun accès I/O.
- [x] `scripts/verify-historique.mjs` (+ script npm `verify-historique`) -- assertions sur `deriver.ts` : ordre canonique du détail, exercice sans essai -> "non joué" ×3 + 0 pt, texte essai (borne `billesEmpochees === nombreBillesSequence` -> "réussi", faute -> "raté"), même convention que `verify-scoring.mjs`.
- [x] `application/historique/index.ts` -- `useHistorique()` : orchestration I/O (`repository.listerSessionsTerminees`/`getDetailSession`) déléguant le calcul à `deriver.ts` ; état `vue: 'chargement'|'liste'|'detail'` (jamais d'état vide affiché avant résolution du chargement initial, même convention que `application/session`) ; `ouvrirDetail(id)` protégé par un jeton de requête (cf. Code Map) contre une résolution dans le désordre si deux lignes sont tapées avant la première réponse ; expose `{vue, lignes, detail, ouvrirDetail(id), retourListe()}`.
- [x] `historique/Historique.tsx` -- consomme `useHistorique()` ; état `chargement` (pas de flash d'état vide), Liste (état vide si `lignes.length===0`), ou délègue à `HistoriqueDetail`.
- [x] `historique/HistoriqueDetail.tsx`+`.css` -- vue Détail : titre, score/seuil, accordéon par exercice (état local `exerciceOuvert`, `key={detail.id}` sur le composant pour repartir d'un état propre si `detail` change), bouton "Retour" (motif de `resume/Resume.tsx`).
- [x] `historique/Historique.css` -- styles liste fidèles au mockup.

**Acceptance Criteria:**
- Given ≥2 séances closes de niveaux différents, when Historique ouvert, then liste triée desc avec date/niveau/score/statut.
- Given séance ouverte en détail, when exercice tapé, then essais en ligne (accordéon) ; tous les exercices du niveau sont présents (FR-8 garantit la couverture complète).
- Given vue Détail, when "Retour" tapé, then Liste réaffichée sans perte.
- Given aucune séance close, when Historique ouvert, then état vide identique au stub actuel.
- Given deux lignes de Liste tapées avant que la première réponse `getDetailSession` ne resolve, when les deux promesses résolvent (dans un ordre quelconque), then seul le Détail correspondant à la dernière ligne tapée reste affiché.
- Given `npm run verify-catalog` et `npm run verify-historique`, when exécutés, then les deux terminent en succès.

## Implementation Notes

Implémenté par un subagent d'implémentation, revu par l'orchestrateur sur le diff complet (`git diff` depuis `baseline_commit`).

Correctif orchestrateur (au-delà du livrable initial) : `VueHistorique` n'avait que `'liste'|'detail'` -- `lignes` démarrant à `[]` avant la résolution de `listerSessionsTerminees()`/`getDetailSession()`, l'état vide s'affichait brièvement même quand des séances existent. Ajout d'un état `'chargement'` (même convention que `application/session`, `useSession.ts:91`) dans `types.ts`/`index.ts`/`Historique.tsx` -- `vue` démarre à `'chargement'`, passe à `'liste'` une fois `lignes` peuplées (succès ou échec du chargement).

Vérifié en conditions réelles (`npm run dev` + Playwright headless, script jetable non committé) : parcours complet Bronze (20 exercices, tous en faute) jusqu'au Résumé, apparition de la ligne dans Historique, ouverture Détail (20 "Figure X" avec score, fidèle au mockup), expansion accordéon ("0/1 bille — raté", "non joué"), bouton Retour, aucune erreur console. Captures d'écran conformes à `mockups/historique.html`.

Aucun script `scripts/verify-historique.mjs` committé (contrairement à `verify-catalog`/`verify-scoring`) : `application/historique/index.ts` importe `adapters/persistence/repository` -> `db.ts`, qui construit `new Dexie(...)` au chargement du module et utilise des imports relatifs sans extension -- non résolvable par le `node --experimental-strip-types` nu utilisé par les scripts existants (testé : échec de résolution de module avant même d'atteindre Dexie). Même contrainte structurelle que `spec-parcours-de-seance.md`, qui n'a pas non plus de script committé pour `application/session`/`adapters/persistence`/`adapters/ui/*` -- seuls `domain/scoring` et `domain/catalog` (aucune dépendance runtime, AD-6) s'y prêtent.

**review_loop_iteration 1 -- re-dérivation.** Re-implémenté par un nouveau subagent (contexte vierge) sur la spec amendée ci-dessus (cf. Spec Change Log). Vérifié indépendamment par l'orchestrateur (pas seulement le rapport du subagent) :
- `npm run build`, `npm run verify-catalog`, `npm run verify-scoring`, `npm run verify-historique` -- tous verts, exécutés directement (pas seulement rapportés).
- Lecture du diff complet (`git diff` depuis `baseline_commit`) : confirmé qu'aucun import de valeur ne traverse plus `adapters/ui` depuis `application/historique` (AD-6), que `deriver.ts` n'importe `adapters/persistence/repository` qu'en `import type`, que `jetonRef` (jeton de requête) est bien vérifié avant chaque `setDetail`/`setVue('detail')` dans `ouvrirDetail`, et incrémenté aussi dans `retourListe`.
- Deuxième passe Playwright (navigateur réel, script jetable non committé) : état vide initial, séance Bronze puis Argent jouées jusqu'au Résumé, les 2 lignes apparaissent triées desc (Argent au-dessus), **double-tap synchrone sur les deux lignes déclenché via un seul `page.evaluate` (les deux clics DOM dans le même tick, avant toute résolution de promesse)** -- le Détail affiché est bien celui de la dernière ligne tapée (Bronze), quel que soit l'ordre de résolution des deux `getDetailSession` ; Retour après la course revient à la liste (2 lignes intactes, pas de blocage) ; ouverture normale du Détail Argent, expansion d'un exercice, "Retour" ; aucune erreur console/page sur l'ensemble du parcours.

**Round 2 -- patches (cf. Review Triage Log "Round 2") :** appliqués par le même subagent (`Promise.allSettled` au lieu de `Promise.all`, suppression du champ `seuil` inutilisé sur les deux types, `.history-row` passé en `<span>` uniquement avec `display:block` ajouté aux 4 sélecteurs concernés pour préserver l'empilement visuel du mockup, texte "Chargement…" réintroduit pour l'état `chargement`). Revérifié indépendamment par l'orchestrateur (pas seulement le rapport du subagent) : `npm run build`, `verify-catalog`, `verify-scoring`, `verify-historique` tous verts ; lecture directe du diff final confirmant les 4 correctifs et l'absence de toute référence résiduelle à `seuil`/`joue` ; script Playwright dédié confirmant que `.history-row .date`/`.niveau` restent empilés verticalement (pas côte à côte) après le passage en `<span>`, que les cellules sont bien des `<span>`, et qu'aucune erreur console n'apparaît. Un seul finding déféré (`verify-historique.mjs` non exécuté en CI, même cause racine qu'un defer déjà loggé pour `verify-catalog`/`verify-scoring`) -- ajouté à `deferred-work.md`.

## Spec Change Log

**review_loop_iteration 1 (bad_spec) :** Déclencheur : `[blind-hunter]` + `[verification-gap]` (Review Triage Log) -- le Code Map v1 plaçait `formatNomFigure` dans `adapters/ui/shared/labels.ts`, ce qui a fait importer ce module par `application/historique/index.ts` (import de valeur, pas de type), inversant le sens de dépendance imposé (`application/` ne doit jamais importer `adapters/ui`) et empêchant toute couverture automatisée de la logique de dérivation (fichier hôte lié à Dexie, non résolvable par le script `node --experimental-strip-types` léger de la convention du repo). Amendé : Code Map + Tasks -- `formatNomFigure` déplacé vers `domain/catalog` (aucune dépendance runtime, testable) ; introduction de `application/historique/deriver.ts` (fonctions pures) séparé de `index.ts` (I/O+React) ; ajout de `scripts/verify-historique.mjs` et extension de `scripts/verify-catalog.mjs` ; ajout d'un jeton de requête sur `ouvrirDetail` (root cause `[edge-case-hunter]`, course si deux lignes sont tapées avant la première résolution) et d'un `key={detail.id}` sur `HistoriqueDetail`. État connu-mauvais évité : régression silencieuse de `formatNomFigure`/de la logique de score-par-essai sans qu'aucun test ne le détecte, et mauvaise séance affichée après un double-tap rapide sur la Liste. KEEP : voir Design Notes -- la forme de `useHistorique()`, l'état `chargement`, les view-models, l'ordre canonique, le repli "non joué", et la fidélité CSS au mockup survivent tels quels à la re-dérivation.

## Review Triage Log

Trois couches (blind-hunter, edge-case-hunter, verification-gap) lancées en parallèle sur le diff (baseline `801ef2c1`). Signalements regroupés par cause racine.

- **[blind-hunter] `application/historique/index.ts` importe `formatNomFigure` depuis `adapters/ui/shared/labels`** — verdict: **medium** — vérifié (`grep` ligne 13) : import de valeur (pas `type`), sens inverse au layering imposé (ui → application → domain) même si AD-6 n'énumère littéralement que les cas `adapters/persistence` ; casse le sens de dépendance que la règle existe pour garantir, et vient d'une instruction erronée de ce spec (Code Map v1 plaçait `formatNomFigure` dans `shared/labels.ts`) → **bad_spec**.
- **[verification-gap] `formatNomFigure` sans couverture** — verdict: **medium** (repris tel que déposé — la couche a vérifié par grep qu'aucun test ne le couvre) — vérifié en plus : `shared/labels.ts` n'a qu'un import `type`, donc `formatNomFigure` est en réalité testable par un script `node --experimental-strip-types` comme `verify-catalog.mjs`/`verify-scoring.mjs` (contrairement à ce que notaient les Implementation Notes) — se résout naturellement en déplaçant la fonction vers `domain/catalog` (même profil de testabilité) → groupé avec le finding ci-dessus, **bad_spec**.
- **[verification-gap] `reussi`/`formatEssaiTexte` (dans `application/historique/index.ts`) sans couverture** — verdict: **medium** (repris tel que déposé) — vérifié : ce fichier importe `adapters/persistence/repository` (Dexie, imports relatifs sans extension), non résolvable par le script `node --experimental-strip-types` nu de la convention existante ; la fix correcte est d'extraire la logique pure (calcul de score/statut par essai, formatage) dans un module sans dépendance Dexie/React, qui devient testable par le même moyen → groupé avec les deux findings ci-dessus, **bad_spec**.
- **[edge-case-hunter] Course : deux taps rapides sur deux lignes différentes de la Liste avant que le premier `construireDetail` ne resolve** (`application/historique/index.ts`, `ouvrirDetail`) — verdict: **medium** — vérifié : `ouvrirDetail` ne pose aucun jeton/garde de requête (contrairement au flag `annule` déjà utilisé dans le `useEffect` de chargement initial du même fichier) ; deux promesses `getDetailSession` peuvent résoudre dans le désordre, affichant la séance de la ligne tapée en premier (pas la dernière) sans aucune indication d'incohérence — aggravé par l'absence de `key` sur `<HistoriqueDetail>` (l'état local `exerciceOuvert` de l'accordéon peut migrer d'une séance à l'autre si les deux résolutions arrivent avant que `vue` ne passe à `'detail'`). Root cause commune, fix trivial (jeton de requête, meme motif que `annule`, + `key={detail.id}`) mais le spec ne l'exigeait pas explicitement → **bad_spec** (ajouté comme boundary explicite pour la re-derivation).
- **[blind-hunter] Commentaire de `HistoriqueDetail.tsx` attribue le bouton "Retour" à `mockups/historique.html`** — verdict: **low** — vérifié : ce mockup ne contient aucun bouton retour/chrome de navigation (deux panneaux statiques côte à côte) ; la source réelle du motif est `resume/Resume.tsx` (`retour-btn`), déjà citée comme telle dans le Code Map de ce spec — fix trivial (corriger la citation) → **patch** (moot ce tour, cf. bad_spec ci-dessus ; sera correct dans le code re-dérivé).
- **[blind-hunter] `EssaiDetailVue.joue` calculé mais jamais lu par `HistoriqueDetail.tsx`** — verdict: **low** — vérifié par grep : aucune consommation de `essai.joue` dans le rendu, seul `essai.texte` (qui encode déjà "non joué" en toutes lettres) est affiché ; ni l'AC ni le mockup ne demandent de traitement visuel distinct → fix trivial (supprimer le champ) → **patch** (moot ce tour, cf. bad_spec ci-dessus).
- **[blind-hunter] `construireLigne` et `construireDetail` appellent chacun `getDetailSession` séparément (résultat de la Liste jeté, refetch complet à l'ouverture du Détail)** — verdict: **low** — réel mais rejeté : volume de séances attendu faible (mono-utilisateur, cf Design Notes déjà acceptées), et le fix (cache par sessionId) ajoute un état que rien ne justifie à ce volume → **rejeté**.
- **[blind-hunter] Aucun état de chargement pendant `ouvrirDetail` (tap sur une ligne avant résolution)** — verdict: **low** — réel mais rejeté : `getDetailSession` sur une seule séance résout quasi instantanément en local (IndexedDB), non perceptible en usage réel ; fix ajoute un état non trivial → **rejeté**.
- **[blind-hunter] Aucune attribution manquante générique / aria-expanded sur l'accordéon `.exercise-row`** — verdict: **low** — réel (pas d'`aria-expanded`) mais l'Accessibility Floor (EXPERIENCE.md) ne couvre explicitement que la saisie d'essai (TalkBack essai/faute, cibles ≥48dp, focus order) — même verdict que les findings a11y hors-Floor déjà rejetés dans `spec-parcours-de-seance.md` (ConfirmDialog focus trap, etc.) → **rejeté** (cohérent avec le précédent de ce repo).
- **[blind-hunter/edge-case-hunter] Échecs silencieux (`charger`/`ouvrirDetail` catch = `console.error` seul, aucun état d'erreur visible ; état vide indiscernable d'un échec de chargement)** — verdict: **low** — réel mais rejeté : même classe de finding déjà rejetée dans `spec-parcours-de-seance.md` ("échec IndexedDB rare sur PWA installée... correctif dépasse la correction directe") — cohérence de précédent → **rejeté**.
- **[blind-hunter] `<Historique/>` démonté/remonté à chaque changement d'onglet (contrairement à `useSession`, monté en permanence dans `App.tsx`) — perte de la vue Détail et refetch complet à chaque retour sur l'onglet** — verdict: **low** — réel mais cohérent avec le flux documenté (EXPERIENCE.md Flow 3 : "il referme le détail... ou lance une nouvelle séance depuis l'onglet Séance", aucune exigence de persistance du Détail entre onglets) ; refetch négligeable au volume attendu → **rejeté**.
- **[blind-hunter] `reussi` pourrait être vrai en même temps qu'un `faute: true` complet, contredisant le score affiché** — verdict: **false** — vérifié en remontant l'écriture : `useSession.ts:249-253` (`tapFaute`) est gardé par `essaiEstClos(dernier, exercice)` — impossible d'enregistrer `faute: true` sur un essai déjà à `billesEmpochees >= nombreBillesSequence` ; la combinaison décrite n'est jamais écrite par l'application. `EssaiButtons.tsx:65,71` désactive aussi la saisie une fois la séquence complète, confirmant que `billesEmpochees` ne dépasse jamais `nombreBillesSequence` (le `>=` de `reussi` est sûr).
- **[verification-gap] `scripts/verify-scoring.mjs`/`verify-catalog.mjs` non exécutés en CI (`.github/workflows/deploy.yml` ne lance que `build`)** — verdict: **medium si vrai** (non vérifié plus avant, déposé tel quel par la couche) — préexistant, non causé par cette story → **defer**.

**Round 2 (post re-dérivation, diff `801ef2c1`→working tree, `review_loop_iteration` 1) :**

- **[edge-case-hunter + verification-gap, même cause racine] `Promise.all` dans `charger()` (`application/historique/index.ts`) échoue en bloc si un seul `getDetailSession` rejette** — verdict: **medium** — vérifié : `getDetailSession` (`repository.ts:158-170`) lève si la session est introuvable ; tout rejet individuel fait échouer `Promise.all`, `setLignes` n'est jamais appelé, et le `.catch` bascule `vue` sur `'liste'` avec `lignes` resté à `[]` -- l'utilisateur voit "Aucune séance enregistrée" alors que N-1 séances avaient chargé avec succès. Contredit la convention "jamais d'erreur bloquante" déjà appliquée ailleurs dans ce même diff (repli "non joué"). Fix trivial (`Promise.allSettled` + filtrer les rejets, logger comme le `.catch` existant) → **patch**.
- **[blind-hunter] `seuil` calculé (`getSeuil(niveau)`) sur `HistoriqueLigne`/`HistoriqueDetail` mais jamais lu par `Historique.tsx`/`HistoriqueDetail.tsx`** — verdict: **low** — vérifié par grep, aucune occurrence de `.seuil` dans les deux fichiers de rendu ; le mockup n'affiche que le statut qualitatif ("Seuil atteint/non atteint"), jamais le nombre brut — même classe que le champ `joue` déjà supprimé dans ce story (round 1) → cohérence : **patch** (supprimer le champ des deux types et des deux calculs dans `index.ts`).
- **[blind-hunter] `.history-row` (bouton) imbrique des `<div>`/`<p>` — contenu de bloc interdit dans un `<button>` (HTML5), incohérent avec `.expanded-head` (mêmes diff, seulement des `<span>`)** — verdict: **low** — vérifié ; fix trivial (renommer les 6 balises div/p en span, aucune classe ni CSS à changer) → **patch**.
- **[blind-hunter] État `chargement` de `Historique.tsx` affiche une `<div>` vide, sans texte, contrairement à `useSession`/`App.tsx` (`<p className="chargement">Chargement…</p>`)** — verdict: **low** — vérifié (`App.css:15`, aucun centrage flex contrairement à ce que le reviewer supposait, mais un texte y est bien affiché, absent ici) — fix trivial (afficher un texte, ex. réutiliser `.historique-vide`/"Chargement…") → **patch**.
- **[blind-hunter] `.screen-title`/`.retour-btn` dupliqués (CSS) entre `Resume.css`/`Historique.css`/`HistoriqueDetail.css`** — verdict: **low** — réel mais rejeté : aucun risque de divergence fonctionnelle (styles visuels identiques, pas une donnée métier comme `LIBELLE_NIVEAU` en son temps) ; le fix toucherait `Resume.css` d'un spec déjà `done` pour un bénéfice cosmétique hypothétique → **rejeté**.
- **[blind-hunter] `verify-historique.mjs` non exécuté en CI** — même cause racine que le defer déjà loggé (round 1) → **carried, defer**.
- **[blind-hunter] Garde `jetonRef` non couverte par un test automatisé** — verdict: **low** — réel mais rejeté : `useSession` (hook comparable, déjà `done`) n'a lui non plus aucune couverture automatisée de sa logique async (undo, clôture, reprise) — seule la vérification manuelle en navigateur existe pour ce type de logique dans ce repo ; introduire un framework de test de hooks pour ce seul cas serait disproportionné → **rejeté** (cohérent avec le précédent `useSession`).
- **[verification-gap, Other findings] `formatNomFigure` duplique le parsing d'id de `Exercice.tsx` (`formatTitre`)** — verdict: **low** — décision délibérée de ce spec (Boundaries : ne jamais toucher `Exercice.tsx`, déjà `done`) → **rejeté** (pas un défaut, un choix explicite).

## Design Notes

Une ligne de liste exige un `getDetailSession` par séance pour son score total (AD-1) : acceptable vu le faible volume attendu (mono-utilisateur).

**Découpage pur/impur (ajouté en review_loop_iteration 1) :** `application/historique/deriver.ts` isole tout ce qui ne dépend que de données déjà lues (dérivation de score, formatage, ordre canonique) sans toucher Dexie/React -- comme `domain/scoring`/`domain/catalog`, ce fichier reste testable par un script `node --experimental-strip-types` léger. `application/historique/index.ts` (le hook) garde seul l'accès I/O (`repository.*`) et React. Ce découpage règle à la fois le défaut de layering (`formatNomFigure` ne doit jamais être importé depuis `adapters/ui`) et l'absence de couverture automatisée relevée en review.

**À conserver de l'itération précédente (KEEP) :** la forme de `useHistorique()` (`{vue, lignes, detail, ouvrirDetail(id), retourListe()}`), l'état `chargement` évitant le flash d'état vide, les vues `HistoriqueLigne`/`HistoriqueDetail`/`ExerciceDetailVue`, le recalage sur `listerExercices(niveau)` (ordre canonique) et le repli "non joué"/0 pt pour un exercice sans essai, la fidélité CSS aux classes du mockup (`.history-row`, `.exercise-row.expanded`, `.essai-detail-row`) -- tout ceci a été vérifié en conditions réelles (`npm run dev` + navigateur headless, parcours Bronze complet) et fonctionne correctement ; à re-produire à l'identique, seule la localisation/structure des fonctions change.

## Verification

**Commands:**
- `npm run build` -- expected: `tsc -b && vite build` sans erreur
- `npm run verify-catalog` -- expected: succès (couvre `formatNomFigure`)
- `npm run verify-historique` -- expected: succès (couvre `deriver.ts`)

**Manual checks (if no CLI):**
- `npm run dev`, jouer 2-3 séances complètes (jusqu'au Résumé) de niveaux différents, ouvrir l'onglet Historique : tri, ouverture détail, expansion essais, bouton Retour, état vide avant toute séance (IndexedDB vidée).
