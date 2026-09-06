---
title: 'Parcours de séance (choix niveau, saisie essai, orchestration, persistance)'
type: 'feature'
created: '2026-09-06'
status: 'done'
route: 'dispatch'
review_loop_iteration: 0
context: []
baseline_commit: 'f2ed126f0e0723591bdb11d7ed209d0fed5a5b37'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** FR-3, FR-4, FR-8 (choix du niveau, saisie d'essai, clôture de séance) ne sont pas implémentées : `application/session`, `adapters/persistence` et `adapters/ui/{accueil,exercice,resume}` sont vides ; seul un harnais temporaire (`App.tsx`) couvre FR-1/FR-2 par-dessus le catalogue et le moteur de score déjà livrés.

**Approach:** Construire le parcours de séance complet (Accueil → Exercice → Résumé) au-dessus des modules `domain/` existants : orchestration d'état en `application/session`, persistance Dexie incrémentale par essai en `adapters/persistence`, écrans React en `adapters/ui/{accueil,exercice,resume}`, remplaçant le harnais.

## Boundaries & Constraints

**Always:**
- Respecter AD-1 (score dérivé, jamais stocké), AD-3 (écriture Dexie avant avancement UI), AD-4 (seul `abandonnerSession` supprime une session en cours), AD-5 (immuabilité post-clôture), AD-6 (sens UI → application → domain, adapters jamais l'un dans l'autre).
- Repository Contract exact (7 méthodes, cf Code Map) — aucune méthode générique update/delete au-delà.
- Réutiliser tels quels les tokens visuels des mockups (`--surface-*`, `--accent-primary(-contrast)`, `--state-success/fail(-contrast)`, `--ink-*`, `--r-sm/md/lg/full`, `--sp-*`, `--tap-min`, `--gutter`) en étendant `index.css`.
- Cible tactile ≥48px sur toute saisie d'essai ; TalkBack (rôle + bille + état) sur chaque essai-button.
- Nav basse à 2 onglets (Séance/Historique, EXPERIENCE.md) dès cette spec : l'onglet Historique est un stub à état vide ("Aucune séance enregistrée pour l'instant."), sans liste ni détail (décision humaine).

**Never:**
- Ne pas construire la liste/détail Historique (FR-9/10/11) — seul le stub d'onglet vide est dans ce spec ; le reste est une spec séparée.
- Ne pas ajouter de dépendance de state management (redux, zustand, dexie-react-hooks…) — un hook React + appels repository suffit.
- Ne jamais permettre update/delete sur une session dont `clotureLe` est non-null.
- Ne pas ajouter `fake-indexeddb` ni de script `verify-session` dans ce spec (décision humaine : pas de test automatisé pour `application/session`/`adapters/persistence` cette fois — build TS + test manuel navigateur suffisent, cadrage complet des tests laissé à `bmad-testarch`).

## I/O & Edge-Case Matrix

| Scenario | Input/État | Comportement attendu | Gestion d'erreur |
|---|---|---|---|
| Essai multi-billes, ordre prescrit | tap bille 1 (réussie), bille 2 (réussie), Faute avant bille 3 | essai clos à 2 billes, score = 2×barème 1er essai, écriture Dexie avant avancement UI (AD-3) | N/A |
| Exercice lecture de table (`ordrePoche` null) | 3 taps "Bille empochée" puis Faute | compteur 0..3 sans ordre imposé, score = billes×barème | N/A |
| Meilleur essai retenu | essai 1 = 8pts, essai 2 = 4pts | score exercice reste 8 (FR-5) | 4e essai : bouton masqué après 3 essais |
| Abandon en cours de séance | tap Abandonner + confirmation | session supprimée de Dexie (AD-4), retour Accueil, rien dans Historique | annulation → aucun effet |
| Reprise après verrouillage écran | app rouverte, session non close en base | bandeau reprise → exercice exact où arrêtée (NFR persistance) | N/A |
| Dernier exercice saisi | tous exercices du niveau ont un score retenu | `cloturerSession`, écran Résumé, session immuable (AD-5) | N/A |
| Exercice sans essai valide | exercice jamais réussi en 3 essais | score 0 pour cet exercice, jamais bloquant | N/A |

</frozen-after-approval>

## Code Map

- `src/domain/scoring/index.ts`, `src/domain/catalog/index.ts` -- API pure existante à consommer telle quelle, ne pas modifier (AD-6)
- `src/adapters/ui/shared/TableDiagram.tsx` -- composant schéma existant, props `{figure, exercice}`, réutiliser dans exercise-card et écran Exercice
- `src/adapters/ui/App.tsx` -- harnais temporaire FR-1/FR-2 à remplacer intégralement par le shell de nav + les 3 écrans
- `src/index.css` -- vocabulaire `--table-*`/`--ball-*` existant ; étendre avec les tokens généraux (noms exacts ci-dessus) repris tels quels des mockups, ne pas en inventer d'autres
- `_bmad-output/planning-artifacts/ux-designs/ux-blackball-training-2026-09-05/{EXPERIENCE.md,DESIGN.md,mockups/{accueil,exercice,resume}.html}` -- comportement, tokens visuels, référence de composition (l'emportent en cas de conflit avec les mockups)
- `_bmad-output/planning-artifacts/architecture/architecture-blackball-training-2026-09-05/ARCHITECTURE-SPINE.md` -- Repository Contract exact (7 méthodes), AD-1/3/4/5/6, Structural Seed des dossiers
- `package.json` -- ajouter `dexie` (^4.4.5) aux dependencies

## Tasks & Acceptance

**Execution:**
- [x] `package.json` -- ajouter dépendance `dexie` -- persistance requise par AD-3/4/5
- [x] `src/adapters/persistence/db.ts` -- schéma Dexie (Session, ExerciceJoue, Essai, cf ER diagram spine) -- socle du repository
- [x] `src/adapters/persistence/repository.ts` -- implémente les 7 méthodes du Repository Contract -- seul point d'accès Dexie (AD-6)
- [x] `src/application/session/*` -- état courant (niveau/exercice/essai) + transitions (démarrer, saisir essai, faute, exercice suivant, rejouer, clôturer, abandonner), seul appelant de persistence -- FR-3/4/5/6/7/8
- [x] `src/adapters/ui/accueil/*` -- 3 level-button, bandeau reprise, bouton abandonner -- FR-3
- [x] `src/adapters/ui/exercice/*` -- essai-buttons (ordonnés ou compteur), fault-button, undo-banner, score-bar sticky, exercise-card, next/replay buttons -- FR-4/5/6/7
- [x] `src/adapters/ui/resume/*` -- score total, statut seuil, clôture -- FR-8
- [x] `src/adapters/ui/historique/*` -- stub à état vide "Aucune séance enregistrée pour l'instant.", sans liste/détail -- respecte la nav à 2 onglets d'EXPERIENCE.md sans construire FR-9/10
- [x] `src/adapters/ui/App.tsx` -- shell de navigation à 2 onglets Séance/Historique (remplace le harnais) -- assemble les écrans
- [x] `src/index.css` -- tokens généraux (surface/accent/state/ink/shape/spacing) -- support visuel des 3 écrans

**Acceptance Criteria:**
- Given une séance Bronze en cours à 38 pts, when l'exercice suivant rapporte 5 pts, then la score-bar affiche "43/100 — seuil Bronze 50" immédiatement (FR-7)
- Given tous les exercices du niveau saisis, when le dernier score est enregistré, then la session est close (`clotureLe` posé), immuable, et l'écran Résumé s'affiche (FR-8, AD-5)
- Given une séance en cours non abandonnée, when l'app est rouverte après verrouillage écran, then le bandeau reprise ramène exactement à l'exercice où la séance s'est arrêtée, sans perte (AD-4)
- Given un exercice à ordre de poche prescrit, when l'utilisateur tape "Faute" après 1 bille sur 3, then l'essai se clôt à 1 bille et les billes restantes ne sont plus proposées (FR-4)

## Implementation Notes

- **Persistance** (`adapters/persistence/db.ts`, `repository.ts`) : schéma Dexie à 3 tables (`sessions`, `exercicesJoues`, `essais`) fidèle aux ER diagrams de la spine. Les 7 méthodes du Repository Contract sont implémentées telles quelles (retours en `Promise`, IndexedDB étant async par nature — le nombre et les noms de méthodes restent exacts). `enregistrerEssai` garde en écriture les sessions déjà closes (AD-5) ; `abandonnerSession` refuse une session close (AD-4/AD-5).
  - Le paramètre `essai` de `enregistrerEssai` porte `{ index, billesEmpochees, faute }` — un champ `index` (1|2|3) a été ajouté au-delà du strict `{billesEmpochees, faute}` du Code Map, car il correspond exactement au `int index` déjà présent sur l'entité ESSAI de l'ER diagram, et est nécessaire pour que le repository fasse un upsert déterministe (mettre à jour l'essai en cours vs démarrer une nouvelle tentative) sans deviner cet état. Aucune méthode supplémentaire n'a été ajoutée — seule la forme de l'objet `essai` est étendue.
- **Dérivation de la position courante sans champ dédié** : `application/session` persiste immédiatement un essai "placeholder" (`billesEmpochees:0, faute:false`) dès l'arrivée sur un nouvel exercice (démarrage de séance ou tap "Exercice suivant") et dès chaque "Rejouer l'essai". Conséquence : l'exercice/essai courant est toujours *dérivable* de `getDetailSession` (dernier groupe d'exercice ayant des essais), sans avoir besoin d'un 8e champ/méthode pour stocker un pointeur — cohérent avec AD-1 (rien n'est stocké qui puisse être recalculé) et avec le contrat à 7 méthodes exact.
  - Limite connue (bord non couvert par l'I/O matrix) : si l'app est tuée exactement entre le tap "Exercice suivant" et le premier tap sur le nouvel exercice, le placeholder n'a pas encore été écrit ; la reprise ramène alors sur l'exercice précédent (déjà clos, bouton "Exercice suivant" à retaper) plutôt que sur le nouvel exercice vierge. Aucune donnée n'est perdue (AD-3 respecté), juste un tap de navigation à refaire. Accepté vu la décision humaine de ne pas cadrer de tests automatisés sur ce module cette fois.
- **Undo** : une seule profondeur (annule uniquement le dernier tap), auto-masqué après 3s (Design Notes) ou dès qu'un nouvel essai/exercice démarre ; l'annulation ré-écrit aussi Dexie (cohérence avec AD-3 : la base reste la source de vérité).
- **Bouton Abandonner** : EXPERIENCE.md l'exige sur Accueil et tout écran de séance, mais aucun des 3 mockups fournis ne le dessine. Ajouté en lien discret (style `ink-secondary`, ≥48px) sous le bandeau reprise (Accueil) et dans l'en-tête de l'écran Exercice, avec la confirmation bloquante exacte du Voice & Tone.
- **Écran Résumé** : un bouton "Retour à l'accueil" (`accent-primary`) a été ajouté sous la note de verrouillage, absent du mockup mais nécessaire — sans lui l'écran serait un cul-de-sac (le mockup ne couvre pas la sortie de cet écran).
- **Pas de composant `exercise-card` autonome** : le Code Map suggérait de réutiliser `TableDiagram` "dans exercise-card et écran Exercice", mais `mockups/exercice.html` place le schéma directement dans l'écran sans encart `surface-raised` — les mockups l'emportant en cas de conflit, `TableDiagram` est utilisé directement dans `adapters/ui/exercice/Exercice.tsx`, sans historique/liste des exercices précédents (absent des 3 mockups fournis).
- **Titre d'exercice** ("Bronze — Exercice A2", "Argent — Exercice C") : non prescrit par les mockups (un seul exemple Argent donné) ; dérivé de l'id catalogue (`{niveau}-{figure}-{numero}`), numéro affiché seulement en Bronze (seul niveau à numeroter plusieurs exercices par figure).

**Corrections post-revue (mêmes fichiers) :**
- Le chargement initial (`charger()`) ne clôture plus jamais la session automatiquement : l'ancien filet de sécurité "tous les exercices ont un essai" se déclenchait à tort dès qu'on rouvrait l'app en plein dernier exercice (placeholder déjà écrit dès l'arrivée), effaçant silencieusement la chance de le jouer. La reprise se fait désormais toujours par index, y compris sur le dernier exercice du niveau ; seule la transition `exerciceSuivant` (utilisateur actif) peut clôturer.
- Cas limite symétrique couvert : une session trouvée sans aucun `exerciceJoue` (app tuée entre `demarrerSession` et le premier `enregistrerEssai`) est désormais nettoyée via `abandonnerSession` au chargement plutôt que de laisser un bandeau reprise mener à un écran vide ; `exerciceEnCours` a aussi reçu un garde-fou (`!dernier ? undefined`) en filet de sécurité supplémentaire.
- Classes CSS `.abandon-link` dupliquées et non scopées entre `Accueil.css`/`Exercice.css` renommées `.accueil-abandon-link` / `.exercice-abandon-link`.
- `EssaiButtons` : les billes futures non actionnables (au-delà de la prochaine bille attendue) annoncent désormais "en attente" plutôt que "à jouer" en `aria-label`.
- `peutAbandonner` (calculé mais jamais consommé) retiré de `useSession`/`UseSessionResult`.
- `LIBELLE_NIVEAU` dupliqué dans 4 écrans extrait dans `adapters/ui/shared/labels.ts`.
- `aria-live="polite"` ajouté au total de la score-bar et au conteneur de l'undo-banner.

**Vérification effectuée :**
- `npm run build` (`tsc -b && vite build`) : passe sans erreur.
- `npm run verify-catalog` / `npm run verify-scoring` (scripts pré-existants, non touchés) : toujours au vert.
- Parcours navigateur bout-en-bout (serveur `npm run dev`, piloté via Playwright faute d'accès interactif direct — équivalent du test manuel demandé) :
  - Bronze : essai à billes uniques, fermeture auto à 1 bille, faute immédiate → 0 pt, rejouer → meilleur essai retenu, score-bar qui ne bouge qu'au tap "Exercice suivant", Annuler/Confirmer sur Abandonner.
  - Argent : essai-buttons en ordre prescrit (2 puis 3 billes), y compris exactement le scénario de l'I/O matrix — bille 1 et 2 réussies puis Faute avant la bille 3 : essai clos à 2 billes, score = 2×barème 1er essai (8 pts), bille 3 affichée "non tentée".
  - Reprise après reload en plein essai (bille 1 tapée, bille 2 pas encore) : bandeau reprise exact ("Argent — exercice 1/9"), et l'état de l'essai en cours (bille 1 déjà "réussie") est restitué à l'identique après le tap sur le bandeau.
  - Or : parcours complet des 6 exercices (dont un "sans essai valide" → 0 pt, jamais bloquant) jusqu'à clôture — total 80/100, seuil 70 atteint affiché, puis reload confirmant l'absence de bandeau reprise (session close = plus "en cours", AD-4/AD-5).
  - Aucune erreur console/page relevée durant ces parcours.
- Non vérifié : lecture d'écran TalkBack sur appareil réel (seul le câblage `aria-label`/rôle a été revu par lecture de code) — recommandé avant mise en confiance totale sur ce point.

## Spec Change Log

## Review Triage Log

Trois couches (blind-hunter, edge-case-hunter, verification-gap) lancées en parallèle sur le diff. 21 signalements individuels rendus ci-dessous ; les signalements qui décrivent le même défaut sont regroupés pour le routage (patch/defer), mais chacun garde sa ligne propre.

- **[blind-hunter] Fermeture automatique prématurée de la session au chargement** (`useSession.ts`, `charger()`, `tousJoues`) — verdict: **high** — vérifié par lecture directe : `tousJoues` teste seulement la présence d'un essai (y compris l'essai placeholder `{0, false}` écrit dès l'arrivée sur un exercice) et non sa clôture ; un rechargement pendant que le dernier exercice du niveau est en cours (pas seulement entre deux taps précis) clôture la session via `cloturerSession` avec un score incomplet, irréversible (AD-5). Groupé avec [edge-case-hunter]/[verification-gap] ci-dessous.
- **[edge-case-hunter] Même défaut, formulé comme perte de l'essai du dernier exercice** — verdict: **high** — même code, même preuve.
- **[verification-gap] Même défaut, pré-vérifié par la couche (recherches citées, disposition proposée « patch »)** — verdict: **high** — évidence acceptée telle que déposée ; confirmée indépendamment par relecture du code.
- **[blind-hunter] Crash sur reprise si `demarrerSession` est interrompu entre ses deux écritures** (`useSession.ts`, `demarrerSession` + `exerciceEnCours`) — verdict: **high** — vérifié : si l'app est tuée entre `repository.demarrerSession` et le premier `enregistrerEssai`, `essaisCourant` reste `[]` ; `exerciceEnCours` ne garde pas `!dernier` (contrairement à `tapBille`/`tapFaute`) et `versAffichage` lit `essai.faute` sur `undefined` au tap du bandeau reprise → crash, écran bloqué. Groupé avec [edge-case-hunter] ci-dessous.
- **[edge-case-hunter] Même défaut, formulé comme guard manquant ligne 379-380** — verdict: **high** — même code, même preuve.
- **[blind-hunter] Aucun retour utilisateur en cas d'échec de persistance** (tous les handlers `useSession.ts`) — verdict: **low** — réel mais échec IndexedDB rare sur PWA installée ; correctif (état d'erreur + UI dans ~6 handlers) dépasse la correction directe → rejeté (peu rencontré + correctif non trivial).
- **[blind-hunter] 36 assets binaires `gfx/base|style/*.png` ajoutés au diff, jamais référencés dans `src/`** — verdict: **low** (réel, vérifié par grep) — pré-existant : fichiers non suivis présents avant le début de cette session (travail en cours sans rapport, décision humaine déjà prise de les laisser tels quels) → **defer**, pas causé par cette story.
- **[blind-hunter] Collision de classes CSS globales `.abandon-link`** (`Accueil.css` vs `Exercice.css`, règles différentes non isolées) — verdict: **low** — réel (bundlées globalement, la dernière importée l'emporte/fusionne sur les propriétés) ; correctif trivial (renommage) → survit, **patch**.
- **[blind-hunter] Mauvais libellé TalkBack pour les billes non encore atteignables** (`EssaiButtons.tsx`, état "à jouer" réutilisé pour des boutons désactivés au-delà de la prochaine bille) — verdict: **low** — réel, atténué en partie par l'annonce native `disabled` ; correctif trivial (un branchement de ternaire) → survit, **patch**.
- **[blind-hunter] `ConfirmDialog` sans piège à focus / Echap / focus initial** (`ConfirmDialog.tsx`) — verdict: **low** — réel mais non exigé explicitement par l'Accessibility Floor (qui porte sur rôle/label/contraste/ordre, pas la gestion de focus modale) ; correctif (trap + listener clavier) dépasse la correction directe → rejeté.
- **[blind-hunter] Code mort `peutAbandonner`** (`useSession.ts`, jamais consommé par `App.tsx`) — verdict: **low** — réel (vérifié par grep) ; correctif = suppression, explicitement autorisé par la règle → survit, **patch**.
- **[blind-hunter] `LIBELLE_NIVEAU` dupliqué dans 4 fichiers** (`Accueil.tsx`, `Exercice.tsx`, `ScoreBar.tsx`, `Resume.tsx`) — verdict: **low** — réel ; correctif = extraction directe vers un module partagé → survit, **patch**.
- **[blind-hunter] Aucun `aria-live` sur la score-bar / undo-banner** — verdict: **low** — réel, non explicitement exigé par l'Accessibility Floor mais correctif trivial (attribut `aria-live`) → survit, **patch**.
- **[blind-hunter] TalkBack asserté comme exigence mais non vérifié sur appareil réel** — verdict: **low** — correctif proposé = transformer la mise en garde en entrée de suivi dans le spec → rejeté (le correctif consiste à éditer ce spec, règle explicite).
- **[blind-hunter] Requêtes non indexées malgré l'index déclaré `clotureLe`** (`repository.ts`, `.filter()` au lieu de `.where('clotureLe')`) — verdict: **low** — réel mais sans conséquence pratique (dizaines/centaines de sessions personnelles au maximum) ; `.where` sur `null`/`notEqual` a des subtilités IndexedDB non triviales à bien couvrir → rejeté (peu rencontré + correctif non trivial/risqué).
- **[edge-case-hunter] Perte silencieuse d'une bille sur double-tap rapide** (`tapBille`/`tapFaute`, fermeture stale capturée avant résolution de l'écriture Dexie) — verdict: **low** — fenêtre de course réelle mais étroite (un aller-retour IndexedDB) ; correctif (état "écriture en cours" dans ~5 handlers) dépasse la correction directe → rejeté. Groupé avec [verification-gap] ci-dessous.
- **[edge-case-hunter] Session close/abandonnée ailleurs (multi-onglets) pendant qu'un tap est en vol, UI bloquée silencieusement** — verdict: **low** — même racine que le constat générique [blind-hunter] "aucun retour utilisateur" ; déclencheur multi-onglets peu plausible sur l'usage réel (PWA Android installée, instance unique) et un simple rechargement s'auto-corrige → rejeté.
- **[edge-case-hunter] `getSessionEnCours` peut retourner une session périmée si plusieurs sessions `clotureLe: null` coexistent** (`repository.ts`, pas d'ordre/unicité imposée) — verdict: **low** — vérifié que le garde-fou UI (`demarrerSession` désactivé dès qu'une reprise existe) empêche ce cas en usage mono-onglet ; ne se déclenche qu'en multi-onglets, hors du modèle d'usage réel (app installée, un seul onglet) ; correctif (tri/unicité) dépasse la correction directe → rejeté.
- **[edge-case-hunter] La checklist Tasks revendique un composant `exercise-card` jamais construit** — verdict: **true** (constat exact — confirmé par grep, aucun composant/classe `exercise-card`) — correctif = corriger le libellé de la checklist dans ce spec → rejeté (le correctif édite ce spec, règle explicite).
- **[verification-gap] Même perte de bille sur double-tap, pré-vérifiée, disposition proposée « defer »** — verdict: **low** — évidence acceptée telle que déposée ; disposition pesée mais non retenue telle quelle : ce défaut est causé par cette story (pas pré-existant) et n'est pas "tout maybe-false" — les règles de routage formelles n'ouvrent donc pas la voie « defer » ici ; retombe sur le rejet low+correctif-non-trivial déjà motivé côté edge-case-hunter → rejeté.
- **[verification-gap, Other findings] Même code mort `peutAbandonner`** — verdict: **low** — même preuve que [blind-hunter] ci-dessus → survit, **patch**.

**Routage retenu (entrées groupées, doublons exclus) :**
1. `tousJoues` ferme la session trop tôt — **patch**, high.
2. Crash `!dernier` sur reprise après écriture `demarrerSession` interrompue — **patch**, high.
3. Collision CSS `.abandon-link` — **patch**, low.
4. Libellé TalkBack "à jouer" sur bille non atteignable — **patch**, low.
5. Code mort `peutAbandonner` — **patch**, low.
6. `LIBELLE_NIVEAU` dupliqué ×4 — **patch**, low.
7. Pas d'`aria-live` score-bar/undo-banner — **patch**, low.
8. Assets `gfx/*.png` non référencés — **defer** (pré-existant, hors story).

Rejetés (loggés ci-dessus, non routés) : retour d'erreur générique manquant, `ConfirmDialog` sans trap de focus, TalkBack non vérifié (édite le spec), requêtes non indexées, double-tap rapide (×2), session périmée multi-onglets, session fermée ailleurs multi-onglets, checklist `exercise-card` (édite le spec).

## Design Notes

Orchestration `application/session` : hook React (`useSession`) encapsulant état + appels repository, sans `dexie-react-hooks` ni store externe — cohérent avec l'absence de dépendance de state management dans la stack retenue. Undo banner : délai d'inactivité fixé à 3s (non prescrit par EXPERIENCE.md, choix libre).

## Verification

**Commands:**
- `npm run build` -- expected: `tsc -b && vite build` sans erreur

**Manual checks (if no CLI):**
- `npm run dev`, jouer un parcours Bronze complet à une main (essai, faute, essai suivant, abandon, reprise après reload) et vérifier score-bar, résumé, bandeau reprise, undo banner à l'écran, et l'onglet Historique (stub vide).
