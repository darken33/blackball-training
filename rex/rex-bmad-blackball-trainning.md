# REX — Expérimentation BMad sur Blackball Training

**Premier terrain d'expérimentation de DF-Labs**
Projet analysé : [darken33/blackball-training](https://github.com/darken33/blackball-training) (PWA solo, déployée sur [darken33.github.io/blackball-training](https://darken33.github.io/blackball-training/))
Source : historique complet des sessions BMad (05/09/2026 → sessions de correctifs ultérieures)

*Je me suis amusé à créer une entité virtuelle `DF-Labs` pour tester notamment la commande `/bmad-party-mode`, qui crée une sorte de réunion virtuelle et met à disposition un certain nombre d'agents — et l'une des premières tâches que je lui ai confiées a été de réaliser ce REX.*

## REX Généré par IA avec bmad-party-mode

![Meeting DF-Labs](imgs/df-labs-meeting.png)

### Origine : pourquoi ce projet, et pas un autre

Blackball Training n'est pas la première expérimentation BMad de Fifi. La première, *DarkCity Reboot* (le reboot d'un jeu qu'il avait écrit en 2010), a produit quelque chose de réel — un squelette applicatif buildable (Spring Boot / Angular / OpenAPI Design First) et une chaîne de décisions cohérente de bout en bout (Brief → GDD → Epics → Architecture → Project Context). Mais le projet était trop grand pour un développeur à un jour par semaine : neuf modules métier en architecture hexagonale stricte pour un MVP loisir. Le dépôt le confirme objectivement — deux commits à quinze minutes d'intervalle, le 3 septembre 2026, puis plus rien. Tout a été déposé en un seul bloc, jamais itéré, jamais soumis à un usage réel. Impossible d'en tirer un REX honnête : il n'y avait ni boucle construire-tester-corriger, ni utilisateur, ni preuve.

Blackball Training a été choisi pour corriger précisément cela : un besoin réel (suivre sa propre progression aux diplômes fédéraux d'aptitudes de billard), un utilisateur réel et unique (Fifi lui-même, en salle d'entraînement), un domaine qu'il maîtrise, et un règlement officiel faisant autorité — un périmètre assez petit pour boucler plusieurs fois le cycle complet et en tirer une preuve.

### Le besoin

Trois diplômes progressifs (Bronze, Argent, Or), 35 exercices au total, jusqu'à trois essais par exercice où seul le meilleur compte. Aujourd'hui, la saisie se fait au papier ou au tableur — abandonnée par Fifi car trop contraignante en pleine séance (stylo, ou reporting différé sur PC). L'idée initiale, telle qu'il l'a formulée : *"Créer une application mobile permettant d'enregistrer les résultats des exercices DFA et de suivre ses performances."*

![FFB DFA Blackball](imgs/ffb-dfa-blackball.png)

### Le dispositif expérimental

- **Outils** : Claude Code (Sonnet 5) + BMad Method (brief → PRD → UX → architecture → spec → stories → build → walkthrough).
- **Corpus documentaire** : le règlement DFA officiel (PDF, schémas et barèmes), et l'expertise métier du joueur — Fifi lui-même.
- **Méthode** : conservation intégrale des échanges, artefacts et décisions (mémoire de travail persistante — `memlog`) pour permettre une traçabilité complète, y compris à travers les coupures de quota de session.

### Chronologie chiffrée (vérifiée indépendamment sur le dépôt public)

| | Blackball Training | DarkCity Reboot |
|---|---|---|
| Commits | 14, sur 9 jours (05/09 → 14/09) | 2, à 15 minutes d'intervalle (03/09) |
| Rythme | MVP complet (6 stories) livré en une journée (06/09), puis 2 vagues de correctifs après usage réel (10/09, 14/09) | Tout déposé en un seul bloc, jamais repris |
| Fichiers applicatifs | 60 fichiers sous `src/` | Squelette Spring Boot/Angular + 685 fichiers de legacy conservés en référence (non réutilisés) |
| Tests automatisés | 0 fichier de test sous `src/` | Non observable (jamais mis à l'épreuve) |
| Artefacts de planification | 41 fichiers (`_bmad-output/`) | 44 fichiers (`_bmad-output/`) |

Le contraste est net : même méthode, même outil, mais une expérimentation a bouclé sa boucle (et a donc pu être corrigée par l'usage réel), l'autre non.

### Ce qui a bien fonctionné

**La mémoire inter-session a tenu sa promesse.** Sur six sessions et plusieurs coupures de quota ("You've hit your session limit"), aucune reprise n'a nécessité de re-expliquer le contexte. Chaque phase (PRD, UX, architecture, stories) s'est appuyée sur la précédente sans redite ni contradiction — le `memlog` a rempli son rôle de mémoire de travail persistante.

**Les revues à plusieurs couches ont trouvé de vrais bugs, pas du bruit.** Exemples concrets rencontrés : un 4ᵉ essai produisant un score `NaN` silencieux (corrigé en exception explicite), une collision d'identifiants dans le catalogue Bronze, un `package-lock.json` non suivi qui aurait cassé `npm ci` en CI, une fermeture prématurée de séance au rechargement sur le dernier exercice. Ce ne sont pas des problèmes cosmétiques — ce sont des bugs qui auraient affecté un utilisateur réel.

**La vérification croisée sur le contenu métier a payé.** La somme des points de séquence × barème du premier essai valant exactement 100 pour Bronze, Argent et Or a servi de garde-fou mathématique pour valider (et corriger) l'extraction du catalogue des 35 exercices depuis le PDF réglementaire.

**L'architecture a été vérifiée sur le web, pas sur la mémoire du modèle** — versions de dépendances confirmées à jour plutôt que supposées, ce qui a évité de figer une stack déjà obsolète au moment de la spec.

**Le test en conditions réelles a fait remonter ce que la revue de code ne pouvait pas voir.** Deux bugs de comportement (logique des boutons de fin d'exercice, schémas de mockup non conformes au contenu réel) n'ont été détectés qu'en jouant réellement avec l'application en salle — jamais par une relecture de code aussi rigoureuse soit-elle.

### Ce qui a moins bien fonctionné

**Un bug corrigé une fois n'est pas nécessairement corrigé.** La logique d'affichage des boutons de fin d'exercice a nécessité deux itérations. Le premier correctif (session 5) a traité le symptôme visible et a même extrait une fonction dupliquée — bonne pratique en soi — mais a laissé en place la mauvaise règle métier sous-jacente (un calcul de plafond de score au lieu d'une règle directe faute/essais-restants). Le bug a resurgi sous une forme différente (session 6) avant d'être vraiment corrigé. **Enseignement : une revue peut valider un correctif structurellement propre qui ne traite pas la cause racine, si le diagnostic initial du bug était lui-même incomplet.**

**Le contenu extrait d'une source réglementaire externe s'est révélé fragile à répétition.** Le nombre de billes à empocher pour les exercices "fermer la table" a nécessité deux corrections séparées, et une troisième anomalie reste à ce jour non résolue : une première correction pendant la finalisation du PRD (9 exercices sans chiffre figé, comblés par Fifi directement), une seconde pendant l'implémentation du catalogue (erreurs de cible/couleur sur plusieurs figures Bronze, comptage Or A/B faux), et une troisième anomalie détectée après coup — mais pas encore corrigée — en comparant les schémas SVG aux images officielles du règlement (une bille noire manquante repérée sur la figure Or-E, notée en déféré ; voir Suite possible). **Une seule passe d'extraction automatisée sur un contenu faisant autorité n'est jamais suffisante — il faut prévoir plusieurs vérifications humaines successives, pas une validation ponctuelle.**

**Les garde-fous locaux n'étaient pas branchés en continu.** Les scripts `verify-scoring` et `verify-catalog`, qui ont pourtant validé des règles métier critiques, ne tournaient qu'à la demande — le pipeline CI (GitHub Actions) ne lançait que `npm run build`, jamais ces scripts. Une régression du barème de score aurait pu passer inaperçue jusqu'au merge sans que personne ne le remarque.

**Le coût a été tracé, mais pas normalisé.** Chaque étape logue une consommation ("Usage Sonnet 5 : X%"), ce qui est déjà plus rigoureux que la plupart des retours d'expérience sur le marché — mais ce chiffre reste relatif à un quota de session, pas convertible en une mesure absolue (temps réel, tokens, coût monétaire) comparable d'un projet à l'autre.

### Répartition des rôles : IA et humain

**Ce que l'IA a très bien fait** : le brief et le PRD (formalisation rapide du besoin), les parcours et wireframes UX, les décisions d'architecture et la structuration du code, l'implémentation, le refactoring, et une bonne part des revues de code.

**Ce que l'humain a apporté** : l'expertise métier (comprendre et valider les règles du règlement DFA, jusqu'au comptage exact des billes), les arbitrages produit (simplifier, prioriser — un seul niveau par séance, pas de compte multi-utilisateur), et la validation finale — celle qui ne se fait qu'en jouant réellement.

### Limites observées

**Limite n°1 — les schémas : le principal échec.** Les schémas générés par l'IA étaient plausibles et esthétiques, mais souvent inexacts ou approximatifs face au règlement officiel. Décision prise : abandonner la génération et réutiliser directement les images officielles du règlement.

**Limite n°2 — l'absence de stratégie de test automatisée.** Vérification indépendante à l'appui : zéro fichier de test sous `src/`. La validation a reposé entièrement sur les scripts de garde-fou ad hoc (`verify-scoring`, `verify-catalog`) et sur le test manuel au navigateur. Un vrai axe d'amélioration pour une prochaine expérimentation : Vitest, Playwright, une mesure de couverture.

**Limite n°3 — l'effet "illusion de compréhension".** Plusieurs situations où le code semblait correct — il compilait, la revue l'approuvait — alors que la règle métier sous-jacente était fausse (le cas des boutons de fin d'exercice en est l'exemple le plus net). Cette limite ne se corrige pas par plus de revue automatisée : elle exige une validation experte du métier, à chaque étape.

## Le REX personnel de Fifi

J'ai expérimenté plusieurs outils autour du SDD allant du simple Plan, OpenSpec, Spec-Kit et maintenant BMad. J'ai d'ailleurs effectué un comparatif sur un besoin très cadré (Créer un Front à partir des spec OpenApi et de Maquettes) et je concluais ceci : 

* Le **Mode Plan** privilégie la rapidité.
* **OpenSpec** structure la spécification.
* **Spec-Kit** industrialise l'ingénierie.
* **BMad** gouverne la conception produit.

Et j'imaginais la matrice suivante :


| Critère | Mode Plan | OpenSpec | Spec-Kit | BMad |
|----------|----------|----------|----------|----------|
| Prototype           | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐☆ | ⭐⭐⭐☆☆ | ⭐⭐☆☆☆ |
| Produit stratégique | ⭐☆☆☆☆ | ⭐⭐☆☆☆ | ⭐⭐⭐⭐☆ | ⭐⭐⭐⭐⭐ |
| PME / Startup       | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐☆ | ⭐⭐⭐☆☆ | ⭐⭐☆☆☆ |
| ESN / Centre de services | ⭐⭐☆☆☆ | ⭐⭐⭐☆☆ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐☆☆ |
| Produit long terme | ⭐⭐☆☆☆ | ⭐⭐⭐☆☆ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Coût IA relatif | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐☆ | ⭐⭐⭐☆☆ | ⭐☆☆☆☆ |

*(Matrice issue d'un comparatif personnel antérieur à ce REX, non ré-évaluée ni vérifiée indépendamment ici — à lire comme une impression, pas comme une mesure.)*

### Démarrage du projet 

Je n'avais à ma disposition que le règlement PDF des Diplômes Fédéraux d'Aptitudes au Blackball, document officiel de la FFB (Fédération Française de Billard). Et force est de constater que nous avons pu réaliser une application fonctionnelle en quelques heures (environ une vingtaine d'heures).

BMad fournit un tas d'agents préconfigurés et de skills permettant de réaliser diverses choses. Au premier regard, difficile de savoir comment s'y prendre. Heureusement BMad propose un "agent" Help qui indique la prochaine étape à lancer à partir d'une intention. Par exemple voici ce que j'ai demandé : 
```
/bmad-help je pense faire une nouvelle expérimentation BMad, pour mes entrainements de billard, je souhaiterais avoir une application mobile pour enregistrer les scores suivant le type d'exercice Bronze, Argent ou Or comme décrit dans le règlement des diplomes fédéraux d'aptitudes ci joint @input/reglement-dfa-blackball.pdf
```

Après un petit temps de réflexion il m'a indiqué la marche à suivre :
```
Où vous en êtes
Le module BMad (bmm + core + tea + cis + bmb) est installé mais aucun artefact de planification n'existe encore (_bmad-output/planning-artifacts est vide, pas de PRD, pas d'architecture). Vous démarrez donc une expérimentation neuve, tout en bas de la phase plan.

Ce que j'ai retenu du règlement (input/reglement-dfa-blackball.pdf) pour cadrer l'app :

3 diplômes progressifs : Bronze (20 exercices, barème 5/3/2 pts, seuil 50/100), Argent (9 exercices, barème 4/3/2,5, seuil 60/100), Or (6 exercices, même barème, seuil 70/100)
Par exercice : jusqu'à 3 essais, seul le meilleur essai compte
Chaque diplôme = une feuille de marque individuelle + une feuille de résultat général envoyée au responsable régional
C'est une base solide et déjà bien structurée pour un brief produit.

Prochaine étape
Code	Skill	Statut	Pourquoi
[BP] bmad-brainstorming	Optionnel	Utile seulement si vous hésitez encore sur le périmètre (multi-joueurs ? historique de progression ? mode arbitre ?). Votre idée semble déjà claire, donc je le passerais.	
[CB] bmad-product-brief	Optionnel mais recommandé	Capture l'idée en un brief court (utilisateurs cibles, objectifs, périmètre) avant de rédiger le PRD complet. Idéal ici car vous avez déjà la matière (le règlement) mais pas encore formalisé qui utilise l'app et comment (le joueur seul ? l'animateur qui arbitre et saisit les scores ?). Args : -A (mode assisté).	
[PRD] bmad-prd	Requis	Étape suivante obligatoire pour passer à l'architecture. Précédée idéalement par le brief.	
Démarrage rapide
Vu que le brief est l'entrée naturelle et qu'une seule question structurante reste ouverte, je vous propose de lancer bmad-product-brief maintenant, dans un contexte frais, en lui donnant en entrée le règlement DFA comme source de vérité sur les exercices/barèmes.

Voulez-vous que je le lance tout de suite ?
```

C'est assez impressionnant car il a analysé le document pour en tirer un premier cadrage, et m'indique trois options de commande pour poursuivre.

### La conception du produit

Nous sommes passé par plusieurs phase de brainstorming, brief, spécifications, design ux/ui, architecture, pour obtenir une conception complète qui a tout de même consommé 90% de ma fenêtre d'utilisation de claude code en 4h. Cependant nous pouvons considérer que nous sommes arrivé à un état comparable au workflow Spec-Kit suivant : 
```
Constitution → Specify → Clarify → Plan → Tasks
```

Voici les stories imaginées :

1. **Socle hors-ligne** — scaffold Vite/React/PWA, manifest, service worker, déploiement GitHub Pages (NFR hors-ligne, AD-7). Rien de fonctionnel encore, juste la coquille qui tourne et s'installe.
2. **Catalogue de contenu D.F.A. (CAP-1)** — les 35 exercices en données de grille + rendu du schéma (table-diagram).
3. **Moteur de notation (CAP-2, cœur)** — fonctions pures domain/scoring : score d'essai, meilleur essai, total. Testable isolément sur les 2 exemples officiels du règlement, sans UI.
4. **Persistance de séance (support CAP-4)** — contrat repository Dexie, écriture incrémentale par essai, immutabilité post-clôture, abandon = suppression complète.
5. **Parcours de séance (CAP-2 UI, CAP-3, CAP-4 UI)** — saisie à une main, total en continu vs seuil, clôture/verrouillage. Dépend de 2, 3, 4.
6. **Historique en lecture seule (CAP-5)** — liste + détail par exercice/essai. Dépend de 4.

### L'implémentation du projet

Fait étonnant lors de la phase d'implémentation, alors que Spec-Kit serait vraisemblablement parti sur l'implémentation en suivant l'ordre qu'il aurait fixé, BMad propose l'ordre logique mais laisse le choix à l'utilisateur :

```
/bmad-build
```
BMad recommande alors la story à traiter

```
No story file exists yet — none of the 6 stories have been started. I'll ask which one to build first.

Quelle Story lancer ?

1. Socle Hors Ligne Applicatif (Recommandé)
2. Autre
```

Pour chaque story, il va donc proposer une spec détaillée, et demander à l'utilisateur de l'approuver avant de générer le moindre code.

```
La spec est prête pour la story 1 (Socle hors-ligne applicatif), sans question ouverte.

Fichier : _bmad-output/specs/spec-blackball-training/stories/1-socle-hors-ligne-applicatif.md

Résumé :

Intent : scaffolder Vite/React/TS aux versions de la spine, PWA installable avec service worker précachant tous les assets, base/manifest alignés sur le sous-chemin GitHub Pages (/blackball-training/), pipeline GitHub Actions build+déploiement sur push main.
Boundaries : arborescence en couches (domain/application/adapters) posée dès ce socle, mais aucune capacité métier (CAP-1 à CAP-5) implémentée ; pas de Dexie à ce stade.
Tasks : scaffold Vite, arborescence Structural Seed, écran de démarrage minimal, config PWA (base + manifest dérivé), workflow GitHub Actions, .gitignore.
Verification : npm ci && npm run build, test manuel hors-ligne via service worker, et une note sur l'activation manuelle de "GitHub Actions" comme source dans Settings > Pages (action humaine unique avant le premier déploiement réel).
Avant d'approuver, vous pouvez ouvrir le fichier spec dans un éditeur ou me poser des questions et me dire ce qu'il faut changer. Vous pouvez aussi utiliser bmad-advanced-elicitation ou bmad-party-mode, idéalement dans une autre session pour éviter la surcharge de contexte.

Approuver et Continuer ?
```

Cela tend à conclure que, contrairement à ce que je pensais, la phase précédente n'était donc qu'une conception générale du produit. BMad considère que chaque story doit être spécifiée.

La phase d'implémentation a ainsi continué jusqu'à ce qu'à la fin de la story 3 il me propose une revue humaine guidée avec la commande `/bmad-walkthrough` :

```
[Orientation] → Walkthrough → Detail Pass → Testing

Le changement identifié est le commit f2ed126 sur main : "feat: moteur de notation (domain/scoring)", pour lequel il existe un spec correspondant (spec-moteur-de-notation.md).

Intent: Aucun moteur de calcul du score n'existait — impossible de dériver le score d'un essai, d'un exercice ou d'une séance à partir des billes empochées (FR-5, FR-6, FR-7). Approche : implémenter domain/scoring comme module pur, sans dépendance (AD-6 — pas d'import de domain/catalog, React ou Dexie) : score d'un essai = billes empochées × barème du niveau pour cet essai (Bronze 5/3/2 ; Argent/Or 4/3/2,5) ; score d'un exercice = meilleur score d'essai (0 si aucun essai n'a empoché de bille) ; score total de séance = somme des scores d'exercice ; statut de seuil = score total ≥ seuil du niveau (Bronze 50, Argent 60, Or 70). Cohérent avec AD-1 : ce module ne persiste rien, il dérive seulement.

7 fichiers modifiés · 4 modules touchés (src, scripts, package.json, _bmad-output) · ~110 lignes de logique · 1 franchissement de frontière (import type-only domain/scoring → domain/catalog pour garder les deux unions Niveau synchronisées à la compilation) · 7 nouvelles interfaces publiques (calculerScoreEssai, calculerScoreExercice, calculerScoreTotal, getSeuil, estSeuilAtteint, Niveau, Essai)

Ce commit HEAD est-il bien le changement que tu veux passer en revue ?
--
Oui
--
Le moteur de score ne doit dépendre d'aucun autre module domaine (catalog, React, Dexie) pour rester isolément testable et réutilisable — quitte à dupliquer le type Niveau plutôt que l'importer depuis domain/catalog. Un garde de compilation compense le risque de dérive silencieuse entre les deux définitions dupliquées.

src/domain/scoring/types.ts:6 — import type-only de Niveau du catalogue (effacé à la compilation, zéro coût runtime)
src/domain/scoring/types.ts:8 — Niveau redéfini localement plutôt que réimporté
src/domain/scoring/types.ts:13 — assertion de type : échoue à la compilation si les deux unions divergent
Garde-fou de non-régression contre le règlement officiel
Valide l'implémentation face aux exemples chiffrés du PRD/addendum plutôt que de faire confiance à une simple lecture du code, avec Node natif (assert) et aucune nouvelle dépendance.

scripts/verify-scoring.mjs:15 — barème Bronze 5/3/2 vérifié essai par essai
scripts/verify-scoring.mjs:27 — exemple officiel confirmé (12 pts, addendum.md)
scripts/verify-scoring.mjs:37 — exemple PRD p.45 : meilleur essai retenu, pas la somme (6, pas 10)
scripts/verify-scoring.mjs:50 — 4e essai rejeté par une erreur explicite, pas ignoré silencieusement
scripts/verify-scoring.mjs:57 — score total vs seuil (100 pts Bronze parfait ≥ seuil 50)
package.json:14 — script npm run verify-scoring exposé
Prends ton temps — clique sur les stops, lis le diff, trace la logique. Pendant que tu révises, tu peux :

"lance une élicitation avancée sur la gestion d'erreur"
"party mode sur la sécurité de ce garde de compilation"
ou juste poser une question
Quand tu es prêt, dis next et je te ferai remonter les points les plus à risque.
```

Il indique donc les sections qui ont été modifiées afin qu'un humain puisse facilement s'y retrouver.
Nous avons continué l'implémentation pour arriver à la limite de l'usage des tokens pour une fenêtre de 5h, il me faut donc attendre 1h avant de pouvoir reprendre, et nous nous sommes arrêtés à la spécification de la story 5.

### Deuxième session d'implémentation

J'ai donc repris dans la sessions chat qui était resté ouverte (je pense que j'aurais pu ouvrir une autre sessions et lancer tout simplement la commande `/bmad-build`) :

```
Reprends
--
Committed as 801ef2c. Le parcours de séance complet (Accueil → Exercice → Résumé, persistance Dexie incrémentale, orchestration application/session) est livré, avec un onglet Historique en stub vide. La revue à 3 couches a trouvé et corrigé 2 bugs importants (fermeture prématurée de séance au rechargement sur le dernier exercice, crash de reprise après démarrage interrompu) plus 5 correctifs mineurs ; les assets gfx/ non liés sont laissés de côté et notés dans deferred-work.md.

Suite possible : ouvrir une pull request, lancer bmad-walkthrough pour une revue humaine, ou continuer sur un autre chantier.
```

Bien il a remarqué que j'avais créé une nouveau répertoire `gfx/` et il l'a ignoré des commit. C'est intéressant puisqu'en effet je me suis apperçu que les schémas représentant les exercices ne respectaient pas assez les schémas officiels, bilan j'ai extrait les schéma directement depuis le document officiel, et dans la suite je lui demanderai de remplacer ceux qu'il a généré. De plus j'en ai profité pour demander à Copilot 365 de me générer une plaquette de titre (écran splash). Ne sachant plus où il en était réellement j'ai relancé la commande `/bmad-build`.

```
/bmad-build que reste t'il à développer ?
--
I'ai maintenant une vision claire de ce qui reste. Avant de lancer la suite du workflow BMAD (qui déclencherait la rédaction d'une nouvelle spec), je préfère vous donner directement l'état des lieux — c'est une question de statut, pas encore une commande de build.

Ce qui est fait (status: done) :

FR-1/FR-2 — Catalogue des 35 exercices + schémas SVG fidèles (spec-catalogue-contenu-dfa.md)
FR-5/FR-6/FR-7 — Moteur de notation (spec-moteur-de-notation.md)
FR-3/FR-4/FR-8 — Parcours de séance complet (Accueil → Exercice → Résumé), persistance Dexie incrémentale (spec-parcours-de-seance.md)
NFR hors-ligne — PWA/service worker déjà configurés (vite.config.ts)
Ce qu'il reste à développer :

FR-9, FR-10, FR-11 — Historique des séances (liste + détail, lecture seule). C'est le seul morceau fonctionnel manquant du PRD. Historique.tsx n'est aujourd'hui qu'un stub à état vide — le code lui-même le documente : "FR-9/10/11 (liste + détail) sont hors périmètre de cette spec — seul l'état vide existe ici." C'était un déféré volontaire noté dans deferred-work.md pour livrer d'abord le parcours de séance.
Une fois l'Historique fait, le périmètre MVP du PRD (§6.1) est entièrement couvert.

Deux points annexes déjà connus (pas bloquants) :

Une incohérence documentaire mineure dans content-catalog.md (§2 vs §5, "quantité de bille") — déjà notée en déféré, pas un manque de code.
Les fichiers gfx/base/*.png et gfx/style/*.png actuellement en staging ne sont référencés par aucun code — laissés tels quels par décision explicite du 2026-09-06 (pas liés au périmètre applicatif).
Voulez-vous que je lance la suite du build BMAD pour rédiger la spec de l'Historique (FR-9/10/11) ?
--
Oui
```

Nous avons donc itéré pour arriver à un produit MVP cohérent et fonctionnel.

```
L'Historique en lecture seule (FR-9, FR-10, FR-11) est implémenté, revu sur deux itérations (une inversion de dépendance et une course sur double-tap corrigées, quatre autres petits défauts patchés, un point non-bloquant déféré) et vérifié indépendamment — build, 3 scripts de garde-fou et navigateur réel tous verts. Commit a93e27e.

Avec ça, le périmètre MVP du PRD est entièrement couvert. Vous pouvez créer une pull request, lancer bmad-walkthrough pour une revue humaine, ou me donner la suite.
--
bien j'ai vérifié tout semble fonctionner très bien, maintenant s'il ne reste plus de travail, pourrais tu faire un écran titre au chargement de l'application qui s'afficherait quelques secondes (disons 3 secondes pour un premier test) en t'appuyant sur la maquette @gfx/titre.png
--
L'écran titre est en place, revu et vérifié — build, et navigateur réel sur plusieurs formats d'écran, plus un point de comportement gracieux ajouté en cours de route : l'image (recompressée de 645 à 164 Ko sans perte visible) commande désormais elle-même les 3 secondes une fois réellement chargée, plutôt qu'un minuteur aveugle qui aurait pu la masquer avant qu'elle n'apparaisse sur un réseau lent. Commit d148abe.

Une chose à trancher si vous voulez : l'écran titre s'affiche aussi quand vous reprenez une séance en cours (comportement littéral de votre demande, mais ça retarde de 3s le retour à votre partie). Dites-moi si vous préférez le sauter dans ce cas.

Sinon : créer une pull request, lancer bmad-walkthrough, ou une autre demande.
```

À ce stade j'avais utilisé 90% de ma fenêtre d'usage des tokens, j'ai donc tenté de lui faire changer les schémas des exercices : 

En effet pour les premiers exercices Bronze-A voic le shcéma généré par BMad 

![Schéma généré par BMad](imgs/schema-bmad.png)

Et le schéma officiel :

![Bronze A Officiel](imgs/bronze-A.png)

```
Remplacement des schemas exercices : les visuels réalisé ne respectent pas suffisamment les schémas officiels, j'ai récupéré les visuels officiels dans le répertoire @gfx/base/*.png peux tu remplacer les visuels SVG par les images png correspondant à chaque exercice ?
--
You've hit your session limit · resets 8:50pm (Europe/Paris)
```

Il n'a pas réussi à remplacer l'ensemble des schémas, ce n'est pas bien grave puisque j'ai pu lui demander de reprendre lorsque la fenêtre a été réinitialisée.

```
Reprends
--
Les 35 exercices affichent maintenant l'image officielle du règlement (une par Figure, comme avant pour le SVG), revue et vérifiée — build, 3 scripts de garde-fou et navigateur réel tous verts. Commit 267256e.

Un point important à votre attention : en vérifiant l'image officielle de la Figure or-e, j'ai remarqué qu'elle montre une bille noire absente du modèle de données actuel (qui ne compte que 2 rouges + 3 jaunes). C'est possiblement une erreur de contenu antérieure à aujourd'hui, avec un impact potentiel sur le score de cet exercice — je n'ai pas corrigé à la volée (ça mérite la même rigueur de vérification page-par-page que le reste du catalogue), c'est noté dans deferred-work.md. Vu que vous avez maintenant les 35 images officielles sous la main, une passe dédiée pour re-vérifier tout le catalogue contre elles serait probablement utile.

Autre point mineur, purement esthétique celui-là : les schémas ont un fond blanc (comme le document officiel), qui tranche avec le thème sombre du reste de l'app — j'ai choisi de le garder tel quel (lecture "document officiel encadré", fidèle à votre demande), mais dites-moi si vous préférez que j'explore un habillage différent.
```

Il a donc remplacé l'ensemble des schéma, et a donc consommé 11% supplémentaires, l'application est fonctionnelle. Il faut la tester en condition réelle.

### Documentation et corrections de bugs

Le lendemain je lui ai donc demandé de faire une documentation complète (README.md) afin d'avoir un guide d'utilisation.

```
peux tu écrire le README.md du projet et indiquer comment installer l'application PWA sur mobile ?
--
Le README est à jour, avec les instructions d'installation PWA pour Android et iPhone/iPad, l'URL déployée (vérifiée en ligne, 200 OK), et les commandes de dev/build/vérification.
```

Très intéressant car il s'avère qu'il s'était occupé de la CI/CD au travers de github actions et github-pages deployments (il a consommé 7% pour réaliser la documentation). J'ai donc pu facilement installer l'application sur mon téléphone Android, et je suis parti faire une séance d'entraînement. Pendant l'entraînement j'ai remarqué quelques incohérences que j'ai voulu lui faire corriger en rentrant.

```
Lorsque l'utilisateur commet une faute, et qu'il choisi de refaire l'exercice, s'il le réussi il faudrait ne pas afficher le bouton rejouer l'exercice, mais uniquement le bouton exercice suivant...
--
Corrigé et vérifié — build, et navigateur réel confirmant le scénario exact que vous avez signalé (faute puis rejeu réussi) : "Rejouer" disparaît bien, seul "Exercice suivant" reste. La revue a aussi repéré que le même calcul était dupliqué à deux endroits (la cause structurelle du bug) ; je l'ai extrait dans une seule fonction pour éviter que ça dérive à nouveau. Commit 3d2ae8e.
```

Il semble qu'il ait corrigé quelque chose (avec une consommation de 13%), après vérification cette correction n'est pas bonne il reste des incohérences et cela semble même moins fonctionnel que précédemmment. J'ai donc refait une nouvelle session le lendemain pour essayer de lui faire corriger ce point.

```
il semblerait qu'il y ait toujours des erreurs sur la gestion des boutons lors des exercices : 
* Si un exercice est réussi il ne faut afficher que le bouton "Exercice suivant"
* Si le joueur commet une faute : 
  * S'il reste des essais disponibles il faut afficher le bouton "Rejouer l'essai" et le bouton "Exercice suivant"
  * Sinon n'afficher que le bouton "Exercice suivant"
--
Spec drafted at _bmad-output/implementation-artifacts/spec-boutons-essai-regle-faute.md (oneshot route — single file, no intent gaps, no irreversibles).

Résumé : le vrai bug est que peutRejouer se décide par un calcul de plafond de score, ce qui masque "Rejouer l'essai" après certaines fautes (quand le score partiel déjà obtenu approche le plafond théorique du prochain essai) — alors que la règle voulue est directe : faute + essais restants → afficher les deux boutons ; succès complet ou 3 essais épuisés → seulement "Exercice suivant". Le correctif remplace le helper plafondProchainEssai par cette règle simple aux deux endroits concernés dans useSession.ts.

Avant d'approuver, vous pouvez ouvrir le fichier de spec dans un éditeur ou me poser des questions. Vous pouvez aussi utiliser bmad-advanced-elicitation ou bmad-party-mode, idéalement dans une autre session pour éviter de saturer le contexte.

Approuver et Continuer ?
--
Oui
--
Corrigé : la règle repose désormais uniquement sur la nature de la clôture (faute vs succès complet) et le nombre d'essais joués, plus sur une comparaison de score — ce qui masquait à tort "Rejouer l'essai" après certaines fautes à score partiel élevé. Revue : 2 correctifs mineurs appliqués (constante NOMBRE_ESSAIS_MAX extraite, garde-fou redondant supprimé, JSDoc complété) ; le reste rejeté ou déjà couvert (absence de tests automatisés cohérente avec le précédent du repo, un scénario théorique disproved). Vérifié en navigateur réel sur les 4 cas (succès direct, faute à score élevé avec essai restant, faute finale après 3 essais). Commit 4a43e22.

Prochaine étape en une ligne : créer une PR (il faudra d'abord pousser, aucun commit n'a encore été poussé sur origin cette session), ou une autre modification.
```

Cette fois, la correction est bien effective (il a consommé 17% de la fenêtre). J'ai décidé de faire le reste à la main :

* Coloriage des schémas
* Commit & Push

Je n'ai pas eu l'occasion de refaire un entrainement (il s'avère que lorsqu'il y a des tournois, souvent le week-end, la salle est fermée), mais pour moi l'application est terminée.

Quelques screenshots 

![Titre](imgs/ecran-titre.png) ![Menu](imgs/ecran-menu.png)

![Exercice](imgs/ecran-exercice.png) ![Exercice Fin](imgs/ecran-exercice-fin.png)

![Exercice](imgs/ecran-fin.png) ![Exercice Fin](imgs/ecran-historique.png)

## Perspectives

**Évolutions possibles de Blackball Training** : statistiques détaillées par figure, suivi de progression dans le temps, coaching IA, recommandations d'entraînement personnalisées.

**Futures expérimentations DF-Labs** : comparer ce même protocole (petit périmètre, utilisateur réel, source faisant autorité) avec d'autres agents — Copilot Coding Agent, Gemini CLI, OpenCode — pour voir ce qui, dans ces enseignements, tient à la méthode BMad et ce qui tient à Claude Code spécifiquement.

## Conclusion

Cinq enseignements principaux :

1. L'IA produit très efficacement les artefacts de projet (brief, PRD, UX, architecture, specs).
2. Elle permet d'accélérer fortement le cycle de conception et de développement.
3. L'expertise métier reste indispensable — et devient même le goulot d'étranglement principal.
4. Le principal risque n'est pas le code, c'est la compréhension du métier (l'"illusion de compréhension").
5. L'IA ne remplace pas l'équipe projet ; elle transforme sa répartition du travail.

Ces cinq points se lisent en miroir des deux constats les plus concrets de cette expérimentation : ce qui a bien fonctionné a presque toujours été vérifiable objectivement (mémoire persistante, revues qui trouvent de vrais bugs, vérification croisée mathématique) ; ce qui a moins bien fonctionné a presque toujours été un défaut de vérification humaine répétée — jamais un défaut de l'outil lui-même.

Sur ce projet, Claude Code et BMad n'ont pas remplacé le développeur ni l'expert métier. Ils ont permis à une seule personne de porter simultanément les rôles de Product Owner, architecte, développeur et testeur, tout en réduisant considérablement l'effort de production documentaire et technique. Le véritable gain n'est pas la génération de code, mais l'accélération de l'ensemble du cycle de conception et de réalisation du produit.

## Suite possible

- Recompter la totalité du catalogue des 35 exercices contre les images officielles (point resté ouvert dans le projet source, jamais traité systématiquement).
- Brancher `verify-scoring` et `verify-catalog` dans le pipeline CI du projet source.
- Réutiliser cette grille de lecture (revue ≠ usage réel, contenu-source à vérifier plusieurs fois, garde-fous en continu) comme trame pour les prochains REX de DF-Labs, afin de pouvoir comparer les expérimentations entre elles.

---

*Premier REX de DF-Labs. Rédigé à partir de l'historique de session complet et d'une vérification indépendante des dépôts publics (blackball-training et darkcity-reboot).*
