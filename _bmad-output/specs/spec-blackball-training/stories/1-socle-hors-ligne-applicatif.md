---
title: 'Socle hors-ligne applicatif'
type: 'feature'
created: '2026-09-06'
status: 'done'
route: 'dispatch'
review_loop_iteration: 0
context: []
baseline_commit: 'db08039ce2f51d5d7d77ede485892df0980630bc'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** L'application n'existe pas encore. Sans socle technique conforme à la contrainte 100% hors-ligne (PWA installable, cache complet, chemin GitHub Pages), aucune capacité métier (CAP-1 à CAP-5) ne peut être construite ni déployée de façon fiable.

**Approche:** Scaffolder un projet Vite/React/TypeScript aux versions de la spine, configurer `vite-plugin-pwa` pour précacher tous les assets via un service worker, aligner `base`/manifest sur le sous-chemin GitHub Pages (`darken33.github.io/blackball-training/`), et mettre en place un pipeline GitHub Actions qui build et déploie sur push vers `main`.

## Boundaries & Constraints

**Always:** respecter AD-7 (base Vite, `start_url`/`scope` du manifest dérivés du chemin de déploiement réel — jamais codés en dur) ; poser dès ce socle l'arborescence en couches domain/application/adapters (AD-6) même vide, pour que les stories suivantes s'y insèrent sans réorganisation ; utiliser exactement les versions du Stack de la spine (Vite 8.2.2, TS 5.9.3, React 19.2.8, vite-plugin-pwa 1.3.0).

**Never:** n'implémenter aucune capacité CAP-1 à CAP-5 (catalogue, saisie, score, historique) dans cette story — un écran de démarrage minimal suffit ; ne pas ajouter Dexie (persistance = story 4, hors périmètre ici) ; ne pas coder en dur un chemin absolu `/` pour un asset ou une route.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Rechargement hors-ligne après une première visite | App déjà visitée en ligne une fois, puis réseau coupé, page rechargée | La page se charge normalement depuis le service worker, aucun écran d'erreur navigateur | N/A |
| Build servi sous le sous-chemin GitHub Pages | Build de production servi sous `/blackball-training/` | Tous les assets (JS, CSS, manifest, icônes) se chargent sans 404 | N/A |
| Premier chargement jamais visité, sans réseau | Aucun cache existant, mode hors-ligne | Erreur de chargement standard du navigateur | Hors scope : rien à rattraper côté app avant une première visite en ligne |

</frozen-after-approval>

## Code Map

- `_bmad-output/planning-artifacts/architecture/architecture-blackball-training-2026-09-05/ARCHITECTURE-SPINE.md` -- Stack (versions à respecter), AD-7 (base path), Structural Seed (arborescence cible `src/domain|application|adapters`), section Déploiement & Environnements
- (racine du dépôt) -- vide de tout scaffold applicatif ; premier commit de code
- git remote `origin` = `https://github.com/darken33/blackball-training` -- fixe le sous-chemin GitHub Pages `/blackball-training/`
- Environnement local : Node 22.22.3, npm 10.9.8 disponibles ; pnpm/yarn absents -- utiliser npm pour ne pas ajouter de dépendance d'outillage

## Tasks & Acceptance

**Execution:**
- [x] `package.json`, `vite.config.ts`, `tsconfig*.json`, `index.html` -- scaffolder un projet Vite react-ts aux versions Vite 8.2.2 / TS 5.9.3 / React 19.2.8 -- pose le socle du Stack
- [x] `src/domain/`, `src/application/session/`, `src/adapters/persistence/`, `src/adapters/ui/` -- créer l'arborescence Structural Seed -- établit le paradigme en couches (AD-6) avant toute fonctionnalité
- [x] `src/adapters/ui/App.tsx` -- écran de démarrage minimal (titre de l'app), sans logique métier -- prouve le rendu sans anticiper CAP-1..5
- [x] `vite.config.ts` -- `base: '/blackball-training/'` + intégration `vite-plugin-pwa` (service worker précachant tous les assets buildés) -- respecte AD-7 et la contrainte hors-ligne
- [x] `vite.config.ts` (config manifest du plugin PWA) -- `start_url`/`scope` dérivés de `base`, jamais codés en dur -- respecte AD-7
- [x] `.github/workflows/deploy.yml` -- job build (`npm ci && npm run build`) puis déploiement GitHub Pages (`actions/upload-pages-artifact` + `actions/deploy-pages`), déclenché sur push vers `main` -- couvre "Déploiement & Environnements" de la spine
- [x] `.gitignore` -- ajouter `node_modules/`, `dist/` -- évite de committer les artefacts de build

**Acceptance Criteria:**
- Given le dépôt cloné sans `node_modules`, when `npm ci && npm run build` s'exécute, then le build réussit et produit `dist/manifest.webmanifest` avec `start_url`/`scope` valant `/blackball-training/`.
- Given l'app buildée servie localement sous `/blackball-training/`, when on la visite une première fois puis on repasse hors-ligne et on recharge, then la page se charge depuis le service worker sans erreur réseau.
- Given l'arborescence `src/`, when on l'inspecte, then les quatre dossiers du Structural Seed existent et aucun import ne traverse `adapters/ui` → `adapters/persistence` directement (AD-6).

## Implementation Notes

- Scaffold construit manuellement (pas via `create-vite`) pour garantir les versions exactes de la spine : `package.json` épingle `vite@8.2.2`, `typescript@5.9.3`, `react@19.2.8`/`react-dom@19.2.8`, `vite-plugin-pwa@1.3.0` ; `@vitejs/plugin-react@6.1.1` (compatible peer `vite ^8.0.0`) pour l'outillage non listé dans le Stack. `npm install` a résolu ces versions exactes sans conflit de peer dependencies.
- `vite.config.ts` déclare une seule constante `base = '/blackball-training/'` réutilisée à la fois pour `base` Vite et pour `manifest.start_url`/`manifest.scope` du plugin PWA (AD-7) -- aucun chemin dupliqué ni codé en dur ailleurs. `workbox.globPatterns` précache tous les types d'assets buildés (js, css, html, svg, png, ico, webmanifest).
- Icônes PWA (`public/icon-192.png`, `public/icon-512.png`) générées comme placeholders simples (cercle blanc/noir sur fond sombre) via Pillow -- aucun asset graphique fourni par le projet à ce stade, à remplacer par une identité visuelle réelle si besoin (hors périmètre de cette story).
- Arborescence Structural Seed créée avec des fichiers `.gitkeep` dans chaque dossier vide (`domain/scoring`, `domain/catalog`, `application/session`, `adapters/persistence`, `adapters/ui/{accueil,exercice,resume,historique,shared}`) pour qu'elle soit versionnée telle quelle avant toute capacité métier.
- `src/adapters/ui/App.tsx` ne contient aucun import vers `adapters/persistence` (vérifié par grep) ; `application/` et `domain/` restent vides, aucune dépendance à casser pour l'instant.
- Le job GitHub Actions (`.github/workflows/deploy.yml`) suit le modèle standard `actions/upload-pages-artifact` + `actions/deploy-pages` déclenché sur push vers `main` (et `workflow_dispatch` pour rejouer manuellement, restreint à `main` via `if: github.ref == 'refs/heads/main'` sur le job `deploy`) ; non exécuté dans cet environnement (nécessite un push réel + activation "GitHub Actions" comme source Pages, action humaine hors périmètre du code, cf. Manual checks).
- `package-lock.json` doit être committé dans le même commit que `package.json` -- il est actuellement présent sur le disque mais non suivi par git ; sans lui, l'étape `npm ci` de la CI (et tout clone à froid) échouera dès le premier push vers `main`.

## Spec Change Log

## Review Triage Log

- **`.github/workflows/deploy.yml`, `package.json` (absent du diff)** -- `package-lock.json` n'est pas suivi par git (fichier présent sur le disque local mais jamais ajouté), alors que le nouveau workflow exécute `npm ci` et que le premier critère d'acceptation exige explicitement `npm ci && npm run build` sur un dépôt cloné -- verdict **high** : confirmé par `git status`/`git ls-files` (fichier `??`), et `npm ci` échoue sans lockfile committé ; le premier push casserait le pipeline de déploiement dès l'étape Setup Node/Install. Route : **patch**.
- **`.github/workflows/deploy.yml:6` (`workflow_dispatch`)** -- le déclencheur manuel n'est pas restreint à `main` ; un lancement manuel depuis une autre branche déploierait son contenu en production GitHub Pages -- verdict **medium** : le trigger existe bel et bien sans garde de branche sur le job `deploy`, et rien dans la spec ne demandait ce trigger (seul "déclenché sur push vers main" était requis). Route : **patch**.
- **`index.html`** (`href="/icon-192.png"`, `src="/src/main.tsx"`) -- chemins commençant par `/`, en tension apparente avec la contrainte gelée "ne pas coder en dur un chemin absolu `/`" -- verdict **false** : ce sont des chemins racine-projet, convention standard Vite ; `dist/index.html` généré confirme qu'ils sont bien réécrits avec le préfixe `/blackball-training/` au build (AD-7 respecté, pas de chemin figé vers `/`).
- **`src/main.tsx`** (`document.getElementById('root')!`) -- accès non-null sur un élément qui pourrait être absent -- verdict **false** : `index.html` du même diff contient toujours `<div id="root">` et rien dans ce changement ne le supprime ni ne le renomme ; pattern boilerplate Vite standard, situation non atteignable ici.
- **Absence de mise à jour de `README.md`** -- aucune instruction d'installation/dev/build/déploiement ni explication de l'arborescence en couches -- verdict **low**, rejeté : peu susceptible de gêner un usage quotidien solo, et le correctif dépasse une correction directe (rédaction de documentation).
- **Icônes PWA sans variante `maskable` ni favicon de repli** -- verdict **low**, rejeté : déjà noté comme placeholder hors périmètre de cette story dans les Implementation Notes ; correctif non trivial (nouveaux assets).
- **`package.json` sans champ `engines`** -- rien ne documente/renforce la version Node attendue (22, épinglée dans la CI) pour un contributeur local -- verdict **low** : correctif trivial (un ajout direct), ne remplit pas les deux conditions de rejet. Route : **patch**.
- **`.gitignore` incomplet** (`node_modules/`, `dist/` seulement, pas de `.DS_Store`/`*.local`) -- verdict **low** : plausible sur une vraie machine de dev, correctif trivial. Route : **patch**.
- **AD-6 (sens de dépendance) vérifié une seule fois par `grep` manuel, sans outil automatisé (lint/dependency-cruiser)** -- verdict **low**, rejeté : `domain/`/`application/` sont encore vides, aucune régression dans ce diff ; correctif dépasserait une correction directe (nouvel outillage).

## Verification

**Commands:**
- `npm ci` (matching AC1's own wording) -- exécuté après suppression de `node_modules/` : installation réussie sans erreur, 0 vulnérabilité, versions exactes de la spine résolues -- confirme que `package-lock.json` est en phase avec `package.json` pour un clone à froid.
- `npm run build` (= `tsc -b && vite build`) -- exécuté : build réussi. `dist/manifest.webmanifest` généré avec `"start_url":"/blackball-training/"` et `"scope":"/blackball-training/"`, conforme au premier critère d'acceptation.

**Manual checks -- exécutés avec Chrome headless (Puppeteer piloté depuis un répertoire scratch isolé, sans dépendance ajoutée au projet) contre `npm run preview -- --port 4173` :**
- Tous les assets (JS, CSS, manifest, icônes, `sw.js`, `workbox-*.js`) répondent en 200 sous `http://localhost:4173/blackball-training/` -- confirme le 2e critère d'acceptation (aucun 404 sous le sous-chemin).
- Le service worker s'enregistre avec `scope = http://localhost:4173/blackball-training/` et passe à l'état `activated` ; le cache Workbox (`workbox-precache-v2-...`) liste les 7 assets buildés (html, js, css, manifest, 2 icônes, registerSW.js).
- Après émulation réseau hors-ligne (CDP `Network.emulateNetworkConditions offline:true`) et rechargement de la page : rechargement sans erreur, titre et contenu (`Carnet de Score Blackball`) identiques à la version en ligne -- confirme le 3e critère d'acceptation et le scénario "Rechargement hors-ligne après une première visite" de la matrice I/O.
- Non vérifié dans cet environnement (nécessite le dépôt distant réel) : activation "GitHub Actions" comme source dans Settings > Pages, et succès du workflow `deploy.yml` après un push réel vers `main` -- action humaine + CI hors périmètre de cette session.
