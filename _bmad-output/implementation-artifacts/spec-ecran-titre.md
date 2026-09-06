---
title: 'Écran titre au démarrage'
type: 'feature'
created: '2026-09-06'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context: []
baseline_commit: 'a93e27e76bbf5ea78cc154b0607c2ac14ac60113'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** L'application affiche directement l'onglet Séance/Historique dès le chargement — aucun écran de titre/marque au démarrage. La maquette `gfx/titre.png` (image finalisée : titre, table, crédits, version) existe mais n'est utilisée nulle part dans le code.

**Approche :** Un composant plein écran affiche cette image (copiée dans `src/assets/`, bundlée par Vite et précachée par le service worker — cohérent avec le NFR hors-ligne total) en superposition au-dessus du shell applicatif pendant une durée fixe (constante nommée, 3000 ms pour ce premier test, facilement ajustable), puis disparaît pour révéler l'app normale. Le fichier a l'extension `.png` mais un contenu JPEG réel (`file` le confirme) : renommé en `.jpg` au passage, avec l'extension ajoutée à `workbox.globPatterns` (vite.config.ts) pour rester précaché. Aucune interaction possible pendant l'affichage (ni tap pour passer, ni ARIA particulier au-delà de `aria-hidden` — image purement décorative, hors du périmètre de l'Accessibility Floor qui ne couvre que la saisie d'essai).

</frozen-after-approval>

## Review Triage Log

Une couche (blind-hunter) sur les fichiers modifiés du worktree. Taille des changements ≈ 650,6 kB (dominée par l'image) → N = min(floor(sqrt(650.6)+1), 10) = 10 ; 11 signalements rendus.

- **Image bundlée (660 Ko) domine le précache PWA (~68% de 976 Ko) pour un écran de 3s sans valeur fonctionnelle** — verdict: **medium** — vérifié (build initial confirmé) ; fix simple (recompression) → **patch** (recompressée à 164 Ko, qualité visuelle inchangée à la taille affichée).
- **Compte à rebours fixe indépendant du chargement de l'image — peut masquer l'écran titre avant que l'image n'ait fini de charger sur réseau lent** — verdict: **medium** — réel et pertinent pour ce produit précisément (NFR "salle sans Wi-Fi fiable") → **patch** (démarrage sur `onLoad`/`onError` plutôt qu'au montage).
- **Aucune gestion `onError` sur l'`<img>` — échec de chargement laisserait un overlay vide 3s sans repli** — même cause racine que le précédent → **patch** (même correctif : `onError` démarre aussi le compte à rebours).
- **`gfx/titre.png` original laissé non suivi (`??`) alors que les autres `gfx/*` sont indexés (`A`), incohérence non expliquée** — verdict: **low** — réel mais rejeté : `gfx/` est un périmètre explicitement hors de cette story (déjà déféré ailleurs, décision humaine antérieure de ne pas y toucher) ; le contenu utile vit désormais dans `src/assets/titre.jpg` (suivi) → **rejeté**.
- **`z-index: 100` en dur, aucun token/échelle dédiée** — verdict: **low** — vérifié : `ConfirmDialog.css:9` (déjà `done`) utilise déjà `z-index: 10` en dur, même absence de token — cohérent avec le précédent existant, pas une régression introduite par ce changement → **rejeté**.
- **Aucun `<link rel="preload">` pour l'image — premier chargement pourrait afficher le fond avant l'image** — verdict: **low** — réel mais rejeté : dégradation gracieuse (fond `--surface-canvas` déjà sombre, cohérent avec l'image), transitoire (premier chargement uniquement, précaché ensuite), fix non trivial (nécessite un plugin de build ou un hash suivi manuellement) → **rejeté**.
- **Aucune couverture automatisée du composant (logique de minuteur)** — verdict: **low** — rejeté, cohérent avec le précédent déjà établi dans ce repo pour `useSession`/`useHistorique` (aucun framework de test UI, vérification manuelle/navigateur acceptée) → **rejeté**.
- **Seulement viewports "large" et "étroit portrait" vérifiés, pas de cas paysage/tablette** — verdict: **low** — rejeté : `object-fit: contain` garantit l'image entière visible quel que soit le ratio par construction ; en paysage l'image serait juste plus petite (pas rognée), impact cosmétique mineur sur un écran de 3s → **rejeté**.
- **`context: []` du frontmatter vide malgré une dépendance implicite à DESIGN.md/NFR hors-ligne** — verdict: **low** — rejeté : tokens CSS réutilisés directement depuis `index.css` déjà chargé, aucun document externe consulté pendant l'implémentation qu'un futur agent aurait besoin de charger → **rejeté**.
- **Aucune trace explicite que "bloquer toute interaction pendant 3s, sans possibilité de passer" est un choix assumé** — verdict: **false** — l'Intent (bloc `frozen-after-approval`) le dit déjà explicitement : "Aucune interaction possible pendant l'affichage (ni tap pour passer...)".
- **Écran titre affiché même lors de la reprise d'une séance en cours, sans discussion explicite** — verdict: **low** — rejeté : correspond à la demande littérale de l'utilisateur ("au chargement de l'application", sans condition) ; le splash est purement temporel et ne change ni l'écran ni les données affichées ensuite (reprise fonctionne normalement une fois le splash disparu) ; ajouter une logique conditionnelle serait un scope non demandé — signalé à l'utilisateur en présentation plutôt que décidé unilatéralement.

## Implementation Notes

Implémenté directement (pas de subagent, changement petit et non ambigu).

Fichiers touchés :
- `src/assets/titre.jpg` (nouveau) -- copie de `gfx/titre.png`, extension corrigée (contenu JPEG réel, confirmé par `file`). `gfx/titre.png` original laissé tel quel (zone de mockups, hors périmètre applicatif, même convention que les autres fichiers `gfx/*`).
- `vite.config.ts` -- `workbox.globPatterns` : ajout de `jpg` pour que l'asset bundlé reste précaché (NFR hors-ligne total).
- `src/adapters/ui/splash/SplashScreen.tsx` (nouveau) + `.css` (nouveau) -- composant plein écran, `DUREE_SPLASH_MS = 3000` (constante nommée, facilement ajustable), `aria-hidden` (purement décoratif).
- `src/adapters/ui/App.tsx` -- `<SplashScreen />` ajouté en tête du shell (superposition, ne bloque pas le chargement de `useSession` en parallèle).

Surprise en cours d'implémentation : premier essai avec `object-fit: cover` sur toute la fenêtre -- sur un viewport large (desktop) ou tout ratio plus large que l'image (portrait 1024x1536), le titre et les crédits/version en bas étaient rognés hors champ (seule la table de billard restait visible), alors que l'image est une composition complète où chaque zone (titre, table, crédits) compte. Corrigé : `object-fit: contain` + `max-width: 480px` sur l'image (même colonne que `.app-shell`), qui garantit l'image entière toujours visible (letterboxing sur `--surface-canvas`, cohérent avec le fond sombre) quel que soit le ratio d'écran. Vérifié en navigateur réel (Playwright) sur un viewport large (1280x720) et un viewport mobile portrait (390x844) : image complète et lisible dans les deux cas, durée d'affichage mesurée à ~3s (léger dépassement de rendu attendu), aucune erreur console, app utilisable immédiatement après disparition.

**Patches post-revue (cf. Review Triage Log) :** image recompressée (Pillow, qualité 82) : 645 Ko -> 164 Ko, aucune perte visible à la taille affichée (max 480px) ; précache PWA total 976 Ko -> 492 Ko. Compte à rebours des 3s désormais démarré sur `onLoad`/`onError` de l'`<img>` plutôt qu'au montage, pour ne jamais masquer l'écran titre avant que l'image ne soit réellement visible (réseau lent, NFR hors-ligne) ; un échec de chargement démarre quand même le compte à rebours (repli, jamais bloquant). Revérifié : build (précache confirmé à 492 Ko), et navigateur réel (durée toujours ~3s, aucune erreur console, app utilisable après disparition).
