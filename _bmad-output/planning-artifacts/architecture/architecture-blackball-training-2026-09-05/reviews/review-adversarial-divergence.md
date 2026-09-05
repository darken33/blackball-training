---
title: Revue adversariale — divergence entre deux unités de build
target: ../ARCHITECTURE-SPINE.md
method: 'Construction de paires d''unités (deux devs/agents) obéissant chacune à la lettre aux AD de la spine, cherchant des incompatibilités de forme de données, propriété d''entité, mutation d''état, frontière non déclarée, ou convention non fixée.'
created: 2026-09-05
---

# Revue adversariale — ARCHITECTURE-SPINE.md

## Verdict

La spine est solide sur les invariants *comportementaux* (AD-1 à AD-6 sont chacun testables et ferment de vraies portes), mais elle est **dangereusement silencieuse sur la forme concrète des données qui traversent les frontières de module** — en particulier le contrat du repository de persistance, la représentation exacte de la fiche de catalogue (AD-2), et la machine à états du cycle de vie d'une séance (dont l'ERD lui-même contredit AD-4/FR-8 à un endroit précis). Deux builders qui suivent chaque AD à la lettre peuvent produire des paires incompatibles sur au moins 5 axes distincts.

---

## Finding 1 — [CRITIQUE] Aucun contrat de repository : deux builders inventent deux API de persistance incompatibles

**Paire concrète :** Le builder A (`application/session`, orchestrateur) code son state machine en supposant un repository avec `repo.addEssai(exerciceJoueId, essai): Promise<void>` et une lecture `repo.getSession(id): Session & { exercices: (ExerciceJoue & { essais: Essai[] })[] }` (arbre imbriqué, un seul aller-retour). Le builder B (`adapters/persistence`, Dexie) modélise l'ERD littéralement comme 3 stores Dexie séparés (`sessions`, `exercicesJoues`, `essais`) reliés par clé étrangère, et expose `repo.getEssaisForExercice(exerciceJoueId): Promise<Essai[]>` en méthode séparée (pas de jointure automatique). Les deux respectent AD-3 ("chaque essai soumis déclenche une écriture Dexie"), AD-4, AD-5 à la lettre — mais le code de A ne compile/fonctionne pas contre l'API réellement exposée par B.

**Pourquoi la spine le permet :** AD-3/AD-4/AD-5 décrivent des *contraintes de comportement* sur le repository ("pas d'update/delete sur une session clôturée", "un seul point de suppression") mais ne fixent nulle part la signature des méthodes, la forme des DTO retournés, ni si l'arbre Session→ExerciceJoué→Essai est retourné imbriqué ou à plat. L'ERD (§ Structural Seed) est un modèle *logique*, présenté sans indiquer s'il correspond 1:1 au schéma physique Dexie (stores séparés + FK) ou à un document composite imbriqué (un seul store `sessions` avec `exercices: [...]` en array embarqué, plus économique en écritures incrémentales).

**Correctif suggéré :** ajouter un AD (ou étoffer AD-6) qui fixe l'interface TypeScript du repository — noms de méthode, DTO d'entrée/sortie, forme imbriquée vs plate — comme partie de la spine, pas comme détail différé à l'implémentation.

---

## Finding 2 — [CRITIQUE] L'ERD contredit AD-4/FR-8 sur la suppression d'une séance abandonnée

**Paire concrète :** L'entité `SESSION` de l'ERD porte un champ persisté `boolean abandonnee`. Mais AD-4 dit que la suppression d'une séance en cours "n'existe que dans le handler de confirmation du bouton Abandonner", et FR-8 précise "rien n'est conservé de sa progression partielle" pour une séance abandonnée. Un builder A qui lit l'ERD comme schéma de persistance implémente l'abandon en **positionnant `abandonnee = true`** sur la ligne existante (soft-delete cohérent avec le champ tel que modélisé) — violant de facto FR-8 ("rien n'est conservé") tout en respectant la lettre d'AD-4 (un seul handler qui "supprime"... ou plutôt "marque"). Un builder B lit AD-4/FR-8 au pied de la lettre et implémente un **hard delete** (`repo.deleteSession(id)`), rendant le champ `abandonnee` de l'ERD totalement mort (aucune ligne persistée n'aura jamais `abandonnee = true` lisible). Les deux équipes ont chacune une lecture défendable de la spine, et produisent des comportements de suppression incompatibles — avec un risque concret côté B si l'historique (FR-9) fait un `getAll()` naïf sans filtrer explicitement `clotureLe != null` : si jamais A a été suivi ailleurs dans le code, des séances abandonnées "soft-deleted" fuiteraient dans la liste Historique.

**Correctif suggéré :** soit retirer `abandonnee` du ERD (il n'a pas de raison d'exister si AD-4 impose un hard delete), soit clarifier explicitement dans AD-4 que ce champ n'existe jamais dans une ligne persistée (uniquement dans un état applicatif transitoire avant suppression), et ajouter une ligne à la table des Conventions : *"une séance persistée n'a jamais `abandonnee = true` ; l'abandon est un DELETE, pas un UPDATE."*

---

## Finding 3 — [MAJEUR] Pas de champ / dérivation canonique pour le statut "clôturée" que AD-5 doit garder

**Paire concrète :** AD-5 dit : "le repository de persistance n'expose aucune méthode d'update/delete sur une session dont **le statut** est 'clôturée'". Mais l'ERD ne porte aucun champ `statut` — seulement `clotureLe: datetime` (implicitement nullable) et `abandonnee: boolean`. Builder A (persistence) implémente la garde du repository comme `if (session.clotureLe != null) throw`. Builder B (UI historique/exercice), en lisant AD-5 littéralement ("le statut"), suppose l'existence d'un champ `statut: 'en_cours' | 'cloturee'` distinct et l'utilise pour son affichage de badge ("en cours"/"terminée") — mais ce champ n'est jamais réellement écrit nulle part puisque A dérive tout de `clotureLe`. Le badge de B affiche alors "en cours" indéfiniment (car `statut` reste `undefined`), pendant que le repository de A bloque bel et bien les updates. Deux implémentations chacune fidèles à la lettre d'AD-5, un bug d'affichage silencieux à l'intersection.

**Correctif suggéré :** dans les Conventions, fixer explicitement : *"statut clôturé ⟺ `clotureLe !== null`. Aucun champ `statut` séparé n'existe."* — ou l'inverse si un enum est préféré, mais trancher.

---

## Finding 4 — [MAJEUR] AD-2 ne fixe aucune forme de données partagée pour le schéma d'exercice — dérivation du "nombre de billes de la séquence" ambiguë pour les exercices "lecture de table"

**Paire concrète :** AD-2 dit que chaque exercice porte "position des billes en coordonnées de grille, ordre de poche (si prescrit), et zone de replacement (Or E/F) comme données structurées" — sans fixer les noms de champs, leur imbrication, ni un champ explicite de longueur de séquence. FR-1 (conséquences) exige pourtant que "chaque exercice porte le nombre de billes de la séquence attendu... donnée consommée par le moteur de score" — mais cette exigence vit dans FR-1, pas dans la règle AD-2 elle-même. Builder A (`domain/scoring`, moteur de notation) code son calcul en dérivant le nombre de billes attendues via `exercice.ordrePoche?.length`. Builder B (`domain/catalog`, auteur du contenu) suit AD-2 à la lettre : pour les exercices "lecture de table" Or A/C/D/F (ordre non prescrit, cf content-catalog.md §5 — "balls not numbered, no prescribed clearing order"), il laisse `ordrePoche` vide/absent (puisqu'aucun ordre n'est prescrit) mais persiste ailleurs un champ séparé `nombreBillesSequence` que A n'a jamais lu. Résultat : pour Or A (lecture de table), le moteur de score de A calcule une séquence de longueur 0 au lieu de la vraie valeur (ex. 3-5 billes), et un essai avec 3 billes empochées ne peut jamais atteindre un score cohérent — violation silencieuse d'AD-1/FR-6 à l'intersection de deux implémentations chacune conforme à la lettre d'AD-2.

**Cas aggravant — bille blanche en zone de replacement (Or E/F) :** AD-2 mentionne la "zone de replacement" comme troisième catégorie de donnée structurée, mais ne dit pas si la bille blanche apparaît dans le même tableau `balls[]` que les autres billes (avec une position `null` + un flag), ou si elle est totalement absente du tableau avec une zone de replacement stockée à part. Le composant de rendu SVG (`table-diagram`, adapters/ui/shared) et le module qui produit les données de catalogue (`domain/catalog`) peuvent chacun avoir été conçus séparément autour d'une convention différente — le rendu attend `balls[]` avec une entrée bille blanche à position `null`, le catalogue omet purement et simplement la bille blanche du tableau pour Or E/F. Le rendu plante ou omet silencieusement la zone de replacement.

**Correctif suggéré :** figer un type `ExerciceDiagramme` explicite dans la spine (ou en annexe référencée) — champs nommés, présence obligatoire de `nombreBillesSequence: number` indépendamment de `ordrePoche`, et convention explicite pour la bille blanche libre (Or E/F).

---

## Finding 5 — [MAJEUR] Cycle de vie d'une séance en cours au redémarrage de l'app : la spine introduit un "bandeau reprise" que le PRD semble exclure, sans AD pour trancher le comportement ni garantir l'unicité de la séance en cours

**Paire concrète :** Le PRD (§6.2, Hors périmètre MVP) énonce sans ambiguïté : *"Reprise d'une séance interrompue : hors scope — une séance quittée avant sa fin est abandonnée sans trace... pas de sauvegarde/reprise ultérieure."* Pourtant la spine introduit, dans le Structural Seed, `accueil/ # Accueil + bandeau reprise + selection niveau` — un composant UI de reprise de séance qui n'existe dans aucun AD ni aucune FR de la spine. Ceci correspond en réalité à la NFR "Persistance locale résiliente" (survivre à un verrouillage d'écran / mise en arrière-plan), mais la spine ne tranche jamais explicitement la sémantique au redémarrage à froid de l'app (l'app/PWA peut être tuée par l'OS entre deux essais, pas seulement mise en veille) :

- Builder A (flux séance/accueil) implémente le bandeau comme reprise automatique/silencieuse dès qu'une session non close est trouvée dans Dexie au boot — cohérent avec la NFR "résiliente", mais lit le PRD §6.2 comme s'appliquant seulement à un abandon *volontaire*, pas à un crash/kill process.
- Builder B, lisant le PRD §6.2 à la lettre ("pas de reprise"), traite toute session non close trouvée au boot comme une anomalie et la **supprime silencieusement** au démarrage ("nettoyage" au boot) — ce qui est en réalité une **deuxième voie de suppression** d'une session en cours, en violation directe d'AD-4 ("aucun autre code... ne mute ni ne supprime une session en cours" hormis le handler du bouton Abandonner).

Aucun AD ne couvre non plus le cas où l'utilisateur, voyant le bandeau reprise, choisit "Nouvelle séance" plutôt que "Continuer" : l'ancienne session en cours devient-elle une session zombie indéfiniment non close et non supprimée (jamais visible dans l'Historique puisque non clôturée, jamais nettoyée puisque AD-4 interdit toute suppression hors du bouton Abandonner) ? Rien n'affirme l'invariant "au plus une session non-clôturée à la fois", et rien ne route ce choix vers le handler unique d'AD-4.

**Correctif suggéré :** ajouter un AD explicite sur le cycle de vie au boot — ex. *"au démarrage, au plus une session non-clôturée peut exister ; si trouvée, l'Accueil propose Continuer/Abandonner via le même handler qu'AD-4 — jamais de suppression automatique, jamais de création d'une seconde session en cours tant que l'ancienne n'est pas résolue."* Et réconcilier explicitement ce comportement avec le §6.2 du PRD (reprise après kill-process ≠ "reprise d'une séance interrompue" au sens fonctionnel du PRD, qui vise l'abandon volontaire).

---

## Finding 6 — [MINEUR] Convention manquante : indexation de l'essai (0-based vs 1-based)

`ESSAI.index` (ERD) n'a pas de convention fixée dans la table Consistency Conventions. Le barème (Bronze 5/3/2, Argent/Or 4/3/2,5) est indexé par rang "1er/2e/3e essai" dans tout le vocabulaire PRD. Builder A (application/session) peut écrire `index` 0-based (aligné sur un tableau JS `essais[0], essais[1], essais[2]`) ; builder B (domain/scoring), qui doit multiplier "billesEmpochees × valeur de barème de cet essai", peut indexer son tableau de barème 1-based en lisant littéralement "1er essai = 5 pts". Un décalage d'un cran entre les deux fait payer au 1er essai la valeur du 2e. Petit trou, mais concret et à la frontière exacte que AD-1 est censé protéger (le calcul de score).

**Correctif suggéré :** ajouter à la table des Conventions : *"`ESSAI.index` : entier 1-based (1, 2, 3), correspond directement au rang utilisé pour indexer le barème du niveau."*

---

## Observation secondaire (non bloquante)

Le champ `ESSAI.faute` (booléen) est modélisé dans l'ERD mais n'a aucun consommateur défini dans la spine : ni AD-1 (le calcul ne le mentionne pas), ni FR-10 (le détail d'historique ne requiert d'afficher que le nombre de billes empochées). Rien n'indique s'il doit influencer l'affichage (ex. badge "faute" dans le détail de séance) ou s'il est pur artefact de saisie sans lecture en aval. Sans conséquence sur AD-1/AD-5 puisqu'il n'est pas un score, mais vaut la peine d'être tranché pour éviter qu'un builder investisse dans un affichage que l'autre n'implémente jamais.

---

## Résumé des 6 findings

| # | Sévérité | Paire incompatible |
| --- | --- | --- |
| 1 | Critique | Repository imbriqué (arbre Session→ExerciceJoué→Essai) vs repository à plat (méthodes séparées par entité) — aucun contrat d'API fixé |
| 2 | Critique | Abandon = soft-delete (`abandonnee=true` conservé, lu depuis l'ERD) vs Abandon = hard delete (conforme à FR-8 "rien n'est conservé") |
| 3 | Majeur | Statut clôturé dérivé de `clotureLe != null` (repository) vs champ `statut` séparé jamais écrit (UI) — badge figé sur "en cours" |
| 4 | Majeur | Longueur de séquence dérivée de `ordrePoche.length` (scoring) vs champ `nombreBillesSequence` séparé (catalogue) — score faux pour les exercices Or "lecture de table" sans ordre prescrit |
| 5 | Majeur | Reprise automatique au boot d'une session non close (résilience NFR) vs suppression silencieuse au boot (lecture littérale du PRD §6.2) — cette 2e lecture viole AD-4 par une voie de suppression non déclarée |
| 6 | Mineur | `ESSAI.index` 0-based (orchestration) vs 1-based (lookup barème) — décalage d'un cran sur le score |
