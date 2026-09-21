# Blackball Training

## Session 1 : 05/09/2026 - Initialisation

* Création du repository : https://github.com/darken33/blackball-training.git
* Clone : git clone https://github.com/darken33/blackball-training.git && cd blackball-training
* Installation BMad : npx bmad install
** BMad Method (v6.12.0)
** BMad Builder (v2.2.2)
** BMad Creative Intelligence Suite (v0.3.2)
** BMad Test Architect (v1.24.0)
** BMad Loop (v0.11.1)
* Lancement de claud 
* Configurer bmad loop : /bmad-loop-setup
** Sélection de claud comme cli
** Modèle Sonnet 5 : usage 1%
* Création d'un répertoir input
* Copie : cp ~/Documents/Personnel/Billard/ressources/reglement-dfa-blackball.pdf input/

---
## Première intention

/bmad-help je pense faire une nouvelle expérimentation BMad, pour mes entrainements de billard, je souhaiterais avoir une application mobile pour enregistrer les scores suivant le type d'exercice Bronze, Argent ou Or comme décrit dans le règlement des diplomes fédéraux d'aptitudes ci joint @input/reglement-dfa-blackball.pdf  
--
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
--
Usage Sonnet 5 : 2%

## Le Brief

oui 
--
Salut Fifi ! On va construire ensemble le brief de ton appli de suivi de scores blackball. À tout moment tu peux me demander bmad-party-mode (avoir plusieurs perspectives d'agents) ou bmad-advanced-elicitation (creuser plus profond une section) si tu en ressens le besoin.

J'ai déjà lu les premières pages du règlement DFA que tu as fourni (structure Bronze/Argent/Or, barèmes, seuils) — pas besoin de me le redécrire, je m'en servirai comme base.

Avant de creuser les détails, j'aimerais avoir le tableau d'ensemble. Quelques pistes pour te lancer, réponds à ce qui te parle, dans l'ordre que tu veux :

Le contexte — Ce projet, c'est pour toi seul (suivre ta propre progression à l'entraînement), pour ton club, ou plus large ? C'est un projet passion / expérimentation perso, ou tu envisages de le proposer à d'autres joueurs/clubs un jour ?
Le problème concret — Aujourd'hui, comment tu notes tes scores d'entraînement (papier, tableur, rien) ? Qu'est-ce qui te manque ou t'agace dans cette façon de faire ?
L'usage — Tu utiliserais l'appli seul en t'auto-évaluant en salle, ou avec quelqu'un qui t'arbitre/annonce les points pendant que tu joues ? Ça se passe dans une salle de billard classique — donc plutôt du hors-ligne, du one-handed (une main sur le tél, l'autre sur la queue) ?
Autre chose que tu as en tête et que je n'ai pas demandé — fonctionnalités rêvées, contraintes, exemples d'apps que tu aimes ?
Dis-moi ce que tu as en tête, même en vrac.
--
1. aujourd'hui c'est pour moi 
2. j'ai fait du papier, tableur et puis plus rien car contraignant besoin de stylo, ou du PC reporting à faire
3. je l'utiliserais seul en auto évaluation en salle
4. rien de particulier, mais je souhaite avoir pour chaque exercice le schema, puis une saisi très simple du score 
--
Merci, l'image est claire. Je note ce que ça implique :

Solo, perso → pas besoin de comptes multi-utilisateurs, de partage, ni de synchro club pour cette v1. Ça garde le périmètre très serré.
Le papier/tableur ont été abandonnés à cause de la friction de saisie → la contrainte n°1 du produit, c'est la vitesse et la simplicité de saisie pendant que tu es en train de jouer, pas après.
Auto-évaluation seul, en salle → probablement pas de wifi fiable dans une salle de billard, donc l'appli doit fonctionner hors-ligne. Et une main tient la queue, donc l'interaction doit être utilisable au pouce/une main, gros boutons, pas de clavier.
Schéma de l'exercice + saisie simple → il faudra numériser/intégrer les 35 schémas du règlement (20 Bronze + 9 Argent + 6 Or) dans l'appli, associés chacun à leur grille de score (5/3/2 ou 4/3/2,5 selon le niveau).
Une dernière question avant qu'on passe à la rédaction : est-ce que tu veux aussi suivre ta progression dans le temps (historique des séances, évolution du score total vers les seuils 50/60/70) ou c'est vraiment juste "je saisis ma séance du jour et je vois si je passe le seuil" ? Et autre chose qui te vient en tête ?

Ensuite je te propose deux façons d'avancer :

Rapide — je regroupe le reste des zones d'ombre en 1-2 questions, puis je rédige le brief complet avec des [HYPOTHÈSE] là où j'ai déduit. Tu révises ensuite.
Accompagné — on avance section par section ensemble, je pousse un peu plus sur les points flous.
Vu que c'est un projet perso pas pressé, les deux marchent bien — dis-moi ce qui te tente.
--
j'ai un entrainement c'est après midi, je ne sais pas si on aura une première version, mais j'opte pour une approche rapide
--
Compris, on va vite. Une dernière question avant de rédiger : tu veux garder un historique de tes séances (voir ta progression vers les seuils 50/60/70 au fil du temps), ou c'est juste "je saisis, je vois mon score du jour, terminé" ? Réponds vite, je pars rédiger le brief dès que j'ai ça (avec des [HYPOTHÈSE] sur le reste).
--
oui je souhaite avoir un historique
--
Le brief est prêt :

brief.md — le document principal (problème, solution, ce qui différencie, périmètre v1 in/out, vision)
addendum.md — référence technique pour la suite (règles de notation exactes, structure des 3 niveaux, hypothèses à valider)
Deux [HYPOTHÈSE] à vérifier quand tu auras deux minutes : fonctionnement hors-ligne, et l'usage solo restant hors périmètre pour d'autres joueurs/clubs plus tard. Le périmètre v1 exclut volontairement les comptes multi-utilisateurs et le mode compétition officielle — pour rester réalisable vite.

Vu ton entraînement cet après-midi, je ne pense pas qu'on ait le temps de sortir une v1 fonctionnelle avant — mais si tu veux avancer sur autre chose maintenant (par exemple lister vite les 35 exercices en t'appuyant sur le PDF), dis-le-moi. Sinon, la suite logique dans BMad est le PRD (bmad-prd), qui s'appuiera sur ce brief pour définir précisément les écrans et fonctionnalités.
--
Usage sonnet 5 : 7%

## Le PRD

/bmad-prd
--
Bonjour Fifi ! Je démarre le PRD pour le carnet de score Blackball DFA. Le fichier est ici : prd.md

À tout moment, tu peux me demander bmad-party-mode pour un débat à plusieurs perspectives, ou bmad-advanced-elicitation pour creuser une section en profondeur.

J'ai repris le brief produit déjà rédigé (et son addendum) — je m'appuie dessus comme base :

App mobile solo, usage hors-ligne présumé, saisie à une main pendant le jeu
3 niveaux D.F.A. (Bronze/Argent/Or), 35 exercices au total, schéma + barème par essai (jusqu'à 3 essais, meilleur retenu)
Score sur 100, seuils 50/60/70
Historique des séances pour suivre la progression
Hors périmètre v1 : multi-utilisateurs, cloud, mode compétition officielle
Avant de me lancer, quelques questions pour compléter le tableau :

Contenu des 35 exercices : le brief indique que seules les pages 1-13 du règlement (structure/règles) ont été lues, pas encore les schémas détaillés des exercices (pages ~9-46). Pour le PRD, veux-tu que je lise maintenant l'intégralité du PDF pour extraire la liste complète des exercices (utile pour définir précisément le "catalogue de contenu"), ou on reste à un niveau plus générique dans le PRD et le détail exhaustif est traité plus tard (architecture/contenu) ?
Autre chose à ajouter avant qu'on attaque : plateforme cible précise (iOS/Android/les deux ?), contraintes techniques que tu as déjà en tête, ou tout autre document/contexte que je devrais lire ?
--
1. oui lis les exercices
2. mon téléphone est un android donc ne cible que cette plateforme en priorité (peut être une application PWA au cas où)
--
J'ai lancé l'extraction complète du catalogue des 35 exercices depuis le PDF en arrière-plan (ça prend un peu de temps vu les 47 pages) — je te préviendrai quand ce sera prêt. En attendant, avançons sur le reste.

Calibrage des enjeux : ce projet, c'est clairement un usage personnel/hobby pour toi (pas de lancement public, pas d'équipe à convaincre) — je pars sur ce niveau de rigueur (PRD compact, ~2 pages de trame + les FRs nécessaires), sauf si tu vois des enjeux que je n'ai pas en tête (par exemple si tu comptes un jour le partager à ton club) ?

Mode de travail, comment veux-tu qu'on avance sur le reste du PRD :

Fast path — je regroupe les questions restantes en 1-2 salves, puis je rédige le PRD complet avec des [ASSUMPTION] là où j'infère. Tu relis et on itère.
Coaching path — on construit section par section ensemble, en partant soit de Vision + Fonctionnalités (utile ici puisque le besoin est déjà bien cadré par le règlement D.F.A.), soit d'un parcours utilisateur (une séance de Fifi en salle, de bout en bout).
--
Fast path
--
Summary (under 400 words):

Count confirmed: exactly 35 exercises — Bronze 20 (Figures A-F, 4/4/3/3/3/3), Argent 9 (Figures A-I, one exercise each), Or 6 (Figures A-F, one exercise each). Matches the brief precisely.

Scoring — one important correction beyond the brief. The flat point scales are confirmed exactly: Bronze 5/3/2, Argent & Or 4/3/2.5, thresholds 50/60/70 out of 100, essai ends on miss/foul, best essai kept. However, the brief's implicit "one score per attempt" model only holds for Bronze, where each exercise pots a single ball. Argent and Or exercises are frequently multi-ball: e.g. "pot the red then reposition to play the black" (2 balls), or "fermer la table" clearance exercises requiring potting 2–5 balls in sequence. Scoring there is per ball potted × the essai's point rate, best essai kept — proven by the worked example on p.45 where a row scores 3×4=12 pts, and the blank scoresheets literally have 3 sub-checkboxes per essai column for this reason. This must be modeled explicitly in the data/scoring engine, not as a flat per-attempt value.

Diagram convention (key for content/asset strategy): all diagrams are simple top-down 2D line schematics — 6 pockets (4 corner + 2 middle, fixed positions), a faint placement grid overlaid on the whole table (explicitly there so animators can reproduce ball positions precisely — treat as the real coordinate system), flat-colored balls (white cue, red/yellow object-ball suits, black), small numeral labels on balls, and a single straight arrow from ball to target pocket — no dashed paths, no spin/effect glyphs, despite techniques like coulé/rétro/effet latéral being required by the text. That means diagrams alone don't encode required technique — that has to come from the level intro pages or separate tutorial content. "Fermer la table" setups (all of Argent D-I and all of Or) are deliberately blocked no-direct-shot layouts, so those diagrams need faithful redraws, not loose recomposition. Or's harder exercises (C, D, F) leave balls unlabeled — no prescribed clearing order, since "lecture de table" judgment is being tested.

Scoresheet layout: 3 per-player templates (Bronze/Argent/Or) with a Figure|Exercise|3-essai-columns|points grid, plus 3 separate competition-wide "feuille de résultats" roster sheets (Nom/Prénom/Club/Score/Classement). The app needs to replace both layers, and the Argent/Or per-player sheet's multi-checkbox-per-essai structure is the trickiest piece to reproduce digitally.
--
1. PWA
2. Un seul niveau par séance (reco)
3. Historique : Résumé + Détail (reco)
4. correction après coup : non
--
Le PRD est prêt : prd.md, avec le détail technique dans addendum.md et le catalogue complet des 35 exercices dans content-catalog.md.

Points clés à valider :

Moteur de score corrigé : le score par essai = nombre de billes empochées × valeur du barème (pas un score plat) — ça couvre les exercices Argent/Or multi-billes (FR-6).
2 questions ouvertes (§8) : que faire d'une séance interrompue avant la fin (perdue ? enregistrée partielle ? reprise plus tard ?), et le format technique des schémas (différé à l'architecture).
2 hypothèses (§9) : pas de notion de compte/profil ; séance interrompue enregistrée avec exercices non joués à 0 point (liée à la question ouverte ci-dessus).
Dis-moi ce que tu veux ajuster, ou si on passe à la relecture (reviewers) et à la finalisation.
--
une séance interrompue est abandonnée
--
usage sonnet 5 : 15%

## La review 

passes à la review
--
Verdict global : PRD solide, prêt pour l'architecture. Le modèle de score (le point le plus risqué) est vérifié fidèle aux deux exemples officiels du règlement (p.43, p.45).

1 finding high, corrigé : le Glossaire et FR-4 supposaient un ordre de poche pour tous les exercices, alors que 4 exercices Or ("lecture de table") n'en imposent pas — corrigé (Glossaire, FR-4 gèrent maintenant le cas non-ordonné).

3 findings medium :

Aucune section Critères de succès → ajoutée (§8), légère, adaptée à un outil perso.
NFR "cible tactile" sans borne chiffrée → fixé à ≥44dp.
Reste ouvert : pour ~9 des 35 exercices Argent/Or (les "fermer la table" les plus denses), le nombre exact de billes de la séquence n'est pas un chiffre figé dans le catalogue extrait — juste décrit qualitativement ("disposition dense"). Il faudrait recompter précisément sur les schémas du règlement source. Veux-tu que je relance une extraction ciblée sur ces 9 exercices maintenant, ou on le garde en question ouverte (§9.2) pour l'architecture/le contenu ?
4 findings low, corrigés : un renvoi de section erroné, une incohérence de typo ("Realise"→"Réalise"), des sous-sections "Conséquences" manquantes sur FR-7/9/10/11,
--
petite précision Fifi est un homme, pas une femme
--
C'est corrigé partout dans le PRD (accords masculins : utilisateur, joueur, "il", "seul") — l'addendum et le catalogue de contenu utilisaient déjà les bonnes formes. J'ai aussi noté cette info en mémoire pour les prochaines sessions.

Il reste la question sur les ~9 exercices sans nombre de billes figé (extraction ciblée maintenant, ou question ouverte pour plus tard) — et sinon on peut enchaîner vers la finalisation du PRD.
--
quels sont ces 9 exercices ?
--
Voici les 9 exercices concernés — tous des "fermer la table" (clôture de table), où le catalogue extrait ne donne qu'une description qualitative de la disposition, sans compter précisément le nombre de billes dans la séquence :

Argent (D.F.A. 2) — 5 exercices :

D — Fermer la table avec les rouges. Disposition bloquant tout tir direct.
F — Fermer la table avec les jaunes.
G — Fermer la table avec les jaunes.
H — Fermer la table avec les rouges.
I — Fermer la table avec les jaunes.
Or (D.F.A. 3) — 4 exercices :

C — Fermer la table avec les jaunes. Champ dense (plusieurs rouges/jaunes + noire en obstacles).
D — Fermer la table avec les jaunes. Champ encore plus dense (quasi rack complet), le plus complexe des 6.
E — Fermer la table avec les rouges. Champ mixte, bille blanche placée librement (zone de replacement).
F — Fermer la table avec les jaunes. Disposition la plus dense de l'ensemble, bille blanche placée librement.
Pour ces 9, le règlement décrit la disposition ("dense", "quasi rack complet") mais l'extraction n'a pas donné de chiffre exact de billes à empocher — il faudrait recompter précisément sur les schémas eux-mêmes pour figer le moteur de score. Veux-tu que je relance une extraction ciblée sur ces 9 schémas, ou on garde ça en question ouverte pour l'architecture ?
--
Argent :
D rentrer les deux billes rouges, puis la noire
F rentrer les deux billes jaunes puis la noire
G rentrer les deux billes jaunes puis la noire
H rentrer les deux billes rouges puis la noire
I rentrer les deux billes jaunes puis la noire

Or :
C rentrer les trois billes jaunes, puis la noire
D rentrer les trois bille jaunes, puis la noire
E rentrer les 3 billes rouges, puis la noire
F rentrer les quatres billes jaunes, puis la noire
--
C'est fait : les 9 exercices sont mis à jour dans content-catalog.md (Argent D/F/G/H/I = 3 billes, Or C/D/E = 4 billes, Or F = 5 billes), et le PRD n'a plus de gap ouvert sur ce point (FR-1 mis à jour, question ouverte retirée).

Il ne reste plus que le format technique des schémas comme question ouverte (différée à l'architecture). On peut passer à la finalisation (audit du memlog, réconciliation des inputs, polish) quand tu veux.
--
Usage sonnet 5 : 24%

## Finalisation

bien finalisons
--
Le PRD est finalisé (status: final).

Ce qui a été fait dans cette finalisation :

Audit du memlog : les 17 entrées sont toutes reflétées dans le PRD/addendum/catalogue, rien de perdu.
Réconciliation des inputs (brief + règlement source via le catalogue) : 2 gaps mineurs trouvés et corrigés — les pages d'introduction par niveau et le pré-requis pédagogique entre niveaux sont maintenant explicitement listés en Non-Objectifs (§5), pour ne pas les laisser silencieusement de côté.
Polish (structure + prose) sur prd.md et addendum.md : réordonnancement de l'addendum (la correction du modèle de score passe en tête), cohérence terminologique (poche visée, valeur de Barème de l'essai, "enregistrées" au lieu de "loggées"), une contradiction logique corrigée dans FR-5, deux citations FR mal attribuées corrigées, quelques tournures allégées. J'ai gardé FR-5/FR-6 explicites malgré un léger chevauchement avec le Glossaire, car leur formulation testable avait été identifiée comme un point fort du PRD.
Artefacts finaux dans _bmad-output/planning-artifacts/prds/prd-blackball-training-2026-09-05/ :

prd.md
addendum.md
content-catalog.md
Suite logique : bmad-ux (parcours/écrans) ou bmad-architecture (décisions techniques : PWA, stockage, rendu des schémas), puis bmad-create-epics-and-stories.
--
Usage Sonnet 5 : 37%

## UX Design

/bmad-ux
--
Bonjour Fifi ! Je suis prêt à démarrer la conception UX du Carnet de Score Blackball DFA — je vais capturer ta vision dans deux documents complémentaires : DESIGN.md (l'identité visuelle) et EXPERIENCE.md (le comportement, les parcours, les états). Sache que bmad-party-mode (débat à plusieurs perspectives) et bmad-advanced-elicitation (pour creuser une réponse) sont disponibles à tout moment si tu en as besoin.

J'ai lu le Brief et le PRD existants — le contexte est clair : saisie à une main en salle, calcul du score par bille empochée, historique en lecture seule, mono-utilisateur. Aucun travail UX n'a encore été démarré pour ce projet, donc on part de zéro (mode Création).

AskUserQuestion
Mode de travail 
--
Fast path
--
Pour le fast path, j'ai besoin de trancher rapidement quelques axes visuels forts avant de rédiger — le reste, je le comblerai par des assomptions explicites que tu pourras corriger.

AskUserQuestion
Ambiance visuelle
Style des schéma
--
1. Sombre / Feutre billard
2. Diagramme technique
--
J'ai rédigé les deux documents en fast path :

DESIGN.md — thème sombre "feutre de billard", vocabulaire couleur séparé strictement entre billes du schéma (ball-*, table-*) et états UI (state-success/fail/pending), boutons de saisie circulaires ≥48px, chiffres tabulaires pour le score.
EXPERIENCE.md — IA à 2 onglets (Séance/Historique), reprise des 3 parcours du PRD (UJ-1/2/3) en Key Flows nommés Fifi.
Quelques décisions que j'ai dû trancher moi-même (marquées [ASSUMPTION], à valider ou corriger) :

Reprise vs abandon — le PRD dit qu'une séance non terminée est "abandonnée", mais le NFR dit qu'un verrouillage d'écran ne doit rien perdre. J'ai tranché : seul un bouton "Abandonner la séance" explicite (avec confirmation) efface la séance ; fermer l'app ou verrouiller l'écran ne l'efface jamais.
Progression entre exercices — action explicite ("Exercice suivant") plutôt qu'un enchaînement automatique, pour laisser le temps de replacer les billes physiquement.
Annuler dernière saisie — ajouté un bouton d'annulation immédiate après chaque tap, absent du PRD mais nécessaire vu la contrainte "une main, au pouce".
Pas de mode clair — aucun écran Réglages n'existe en v1, donc pas de bascule de thème.
États réussi/raté toujours doublés d'un texte, jamais la couleur seule.
Veux-tu que je passe à la Finalisation maintenant (relecture qualité + mockups des écrans clés), ou préfères-tu d'abord corriger certaines de ces assomptions ?
--
Ok finalises
--
AskUserQuestion
Reviewer Gate
--
1. oui rubric walker seul (reco)
--
C'est finalisé. Voici où en sont les choses.

Documents finaux (status: final) :

DESIGN.md
EXPERIENCE.md
Mockups (référencés inline dans les deux spines) :

mockups/accueil.html
mockups/exercice.html
mockups/resume.html
mockups/historique.html
Ce qui s'est passé pendant la finalisation (au-delà de ce que je t'avais déjà montré) :

Ton addendum.md (ouvert dans l'IDE) m'a fait corriger les conventions de dessin des schémas : flèche unique, zone de replacement, billes sans numéro imprimé.
Le rubric walker a trouvé et j'ai corrigé : un contraste bouton principal limite (4.49:1 → 5.1:1 en assombrissant le vert), une bille noire peu lisible sur le feutre (ajout d'un liseré ball-outline), et 3 composants utilisés mais jamais spécifiés (Level button, Resume banner, Replay attempt button).
Le passage structure+prose a nettoyé quelques redondances et corrigé la grammaire (accords, anglicismes, un doublon de message supprimé).
Suite logique : bmad-architecture pour cadrer la partie technique (le PWA/hors-ligne/rendu des schémas notamment), ou bmad-create-epics-and-stories pour découper en stories.
--
Usage Sonnet 5 : 65%

## Architecture 

/bmad-architecture
--
AskUserQuestion
Mode de travail
Livrable
--
1. Fast path
2. Spine seule (reco)
--
L'architecture est finalisée. Voici le résumé.

Fichier : ARCHITECTURE-SPINE.md
Journal de décisions : .memlog.md
Revues : reviews/ (rubric walker, vérification de versions, divergence adversariale)

Décisions clés :

Paradigme : couches à cœur de domaine pur (domain → application → adapters), sens de dépendance imposé (AD-6).
Stack (vérifiée sur le web, pas depuis la mémoire) : Vite 8.2.2, React 19.2.8, TypeScript 5.9.3, vite-plugin-pwa 1.3.0, Dexie 4.4.5.
Score toujours dérivé, jamais stocké (AD-1) ; schémas rendus en SVG depuis des coordonnées de grille, jamais des images (AD-2) ; persistance incrémentale par essai (AD-3) ; un seul point de suppression de session (AD-4) ; immutabilité post-clôture au niveau du repository (AD-5) ; chemin de base cohérent avec GitHub Pages (AD-7).
Contrat de repository explicite à 7 opérations, catalogue Figure/Exercice distinct (corrige une collision d'ID Bronze détectée en revue), déploiement GitHub Actions → GitHub Pages précisé dans la spine.
Trois revues indépendantes (rubric, versions, divergence adversariale) ont trouvé plusieurs problèmes réels — collision d'identifiants, contradiction entre l'ERD et la règle d'abandon, contrat de persistance manquant, version Vite périmée — tous corrigés avant clôture.

Suite recommandée : bmad-spec pour faire de cette spine (+ le PRD) un compagnon de spec stable, puis bmad-create-epics-and-stories pour découper en epics/stories.

## Revue PRD suite aux maquettes

Avant cela j'ai quelques remarques à vérifier suite à la visualisation des mockup :
1. Tout d'abord le design est bon pas de sujet là dessus
2. la maquette exercice présente un schéma qui ne fait pas partie des schémas réels proposés, est ce bien noté que les schémas proposés doivent être scrupuleusement respectés ?
3. Dans cette même maquette il n'est indiqué qu'il ne faut rentré que 2 billes hors, pour les exercices Argent et Or, l'objectif est de rentrer toutes les billes de la couleur citée (Jaune ou Rouge) puis pour finir rentrer la bille noire.
--
Vos deux remarques sont fondées, je les ai vérifiées contre content-catalog.md (l'extraction du règlement officiel) :

Point 2 — fidélité des schémas : FR-2 du PRD exige la fidélité stricte uniquement pour les schémas "fermer la table" (Argent D-I, tout l'Or) et pour Or E/F (pas de bille blanche fixe). Il n'énonce pas explicitement que tous les schémas (y compris Argent A/B/C non-"fermer la table") doivent être redessinés fidèlement plutôt qu'un placeholder illustratif comme celui du mockup. Le mockup exercice.html n'a d'ailleurs jamais eu vocation à représenter un vrai schéma — c'est un wireframe pour les patterns d'interaction — mais rien ne le dit explicitement noir sur blanc, donc un futur builder pourrait le prendre pour du contenu réel.

Point 3 — nombre de billes : confirmé, c'est une vraie erreur du mockup. content-catalog.md est explicite : Argent C = « Pot both yellow balls in sequence, then reposition to play the black... (3-ball sequence) ». Le mockup ne montre que 2 boutons "Bille 1 / Bille 2" et traite la noire comme "présente mais hors séquence de cet essai" (commentaire ligne 106 du SVG) — c'est faux : la noire est la 3e bille de la séquence, elle doit être saisissable et compter dans le score (2 jaunes + noire × 4 pts = 12 pts si tout est réussi, pas 8). Bonne nouvelle : l'architecture que je viens de finaliser n'est pas affectée — nombreBillesSequence (distinct de ordrePoche) était déjà exigé comme champ obligatoire du catalogue précisément pour éviter ce genre de confusion ; le bug est localisé au mockup, pas au modèle de données.

AskUserQuestion
Fix mockup
Fix PRD
--
1. Corriger maintenant (reco)
2. Oui ajouter les précisions (reco)
--
Mockup (mockups/exercice.html) : ajout du 3e bouton de saisie (bille noire) manquant pour l'exercice Argent C, correction du commentaire SVG erroné qui excluait la noire de la séquence, ajout du label d'ordre "3" + flèche sur la bille noire, et reformulation du panneau de résultat état B ("2 billes empochées sur 3", noire "non tentée" plutôt que faussement absente).

PRD (prd.md + addendum.md, via bmad-prd) :

FR-2 exige désormais explicitement que les 35 schémas (pas seulement les « fermer la table ») tracent vers les données de grille de content-catalog.md — la tolérance de variance mineure des figures Bronze simples porte sur le tracé fin, jamais sur le nombre de billes ou la séquence.
Nouvelle conséquence testable : les maquettes UX (DESIGN.md/EXPERIENCE.md/mockups) illustrent uniquement les patterns d'interaction/visuel, jamais le contenu réel d'un exercice — cette autorité reste exclusivement content-catalog.md, avec référence explicite au bug qu'on vient de corriger comme exemple concret.
addendum.md mis à jour en miroir sur la même nuance.
Étant donné l'ampleur réduite (2 phrases testables + 1 note, pas de nouvelle FR), j'ai journalisé le changement dans le memlog du PRD et relu le diff directement plutôt que de redéclencher tout le Reviewer Gate — cohérent avec les enjeux d'un outil solo/hobby. Aucun impact sur la spine d'architecture : nombreBillesSequence y était déjà un champ obligatoire distinct de ordrePoche, donc ce risque était déjà couvert côté modèle de données.
--
Usage Sonnet 5 : 84% (reinit - 1h)

## Spécifications / Stories

/bmad-spec
--
La spec est prête.

Fifi, j'ai condensé tout le pipeline déjà finalisé (brief → PRD → architecture → UX) en un kernel SPEC : _bmad-output/specs/spec-blackball-training/SPEC.md.

5 capacités (CAP-1 à CAP-5) : catalogue D.F.A., saisie de séance + moteur de notation, suivi en continu vs seuil, clôture/verrouillage, historique lecture seule.
4 companions adoptés (référencés, non dupliqués) : content-catalog.md (les 35 exercices), ARCHITECTURE-SPINE.md (invariants, stack, contrat repository), DESIGN.md + EXPERIENCE.md.
1 companion rédigé : glossary.md (vocabulaire du domaine).
4 sources absorbées : brief + addendum, PRD + addendum (leur substance vit maintenant dans le kernel).
Verdict self-validate : Pass 1 (cohérence) et Pass 2 (préservation) tous deux PASS — aucune perte non tracée, tout enregistré dans .memlog.md.
3 assumptions reprises telles quelles (déjà tranchées en amont, pas de nouveau gap) :

Aucun compte/profil requis en v1 (mono-utilisateur).
Pas de mode clair.
« Reprise d'une séance interrompue » = reprise après abandon explicite seulement (fermer l'app/verrouiller l'écran ne sont jamais des abandons).
Aucune question ouverte — tout a été résolu durant les finalisations précédentes.

Comme la spec se découpe naturellement en tranches livrables indépendamment (les 5 capacités), je peux enchaîner sur un découpage en stories si tu veux (stories.yaml) — sinon dis-moi si tu veux revoir une des assumptions, et rappelle-toi que bmad-party-mode ou bmad-advanced-elicitation restent disponibles pour creuser un point en particulier.
--
Ok passes à la suite
--
D'après le layering de ARCHITECTURE-SPINE.md (domain → application → adapters) et les 5 capacités, voici un découpage en 6 stories, dans l'ordre de construction :

Socle hors-ligne — scaffold Vite/React/PWA, manifest, service worker, déploiement GitHub Pages (NFR hors-ligne, AD-7). Rien de fonctionnel encore, juste la coquille qui tourne et s'installe.
Catalogue de contenu D.F.A. (CAP-1) — les 35 exercices en données de grille + rendu du schéma (table-diagram).
Moteur de notation (CAP-2, cœur) — fonctions pures domain/scoring : score d'essai, meilleur essai, total. Testable isolément sur les 2 exemples officiels du règlement, sans UI.
Persistance de séance (support CAP-4) — contrat repository Dexie, écriture incrémentale par essai, immutabilité post-clôture, abandon = suppression complète.
Parcours de séance (CAP-2 UI, CAP-3, CAP-4 UI) — saisie à une main, total en continu vs seuil, clôture/verrouillage. Dépend de 2, 3, 4.
Historique en lecture seule (CAP-5) — liste + détail par exercice/essai. Dépend de 4.
Ça te va comme découpage, ou tu veux fusionner/scinder certaines tranches ?

AskUserQuestion
Checkpoints
Notes dev
--
1. aucun, enchainer les 6 stories
2. aucune notes complémentaire
--
stories.yaml est prêt (6 stories, ids 1-6, aucun checkpoint, aucune note dev) : socle hors-ligne → catalogue → moteur de notation → persistance → parcours de séance → historique. Validité vérifiée, tout est loggé dans .memlog.md.

Tu es prêt à enchaîner sur bmad-build pour lancer la story 1, ou tu veux d'abord ajuster quelque chose ?
--
Usage Sonnet 5 : 90% - (réinit - 1h)

## Pause 

on va faire une pause, et on implémentera plus tard, peux tu effectuer un commit ?
--
Committed: 1154 files, 314,885 insertions — the BMad tooling, the full planning trail (brief → PRD → architecture → UX), and today's SPEC.md + stories.yaml. Working tree is clean and not pushed anywhere. Pas de souci pour la pause, à bientôt pour l'implémentation.
--
Usage Sonnet 5 : 91% - (réinit - 1h)

## Session 2 : 06/09/2026 - Implémentation 

/bmad-build
--
No story file exists yet — none of the 6 stories have been started. I'll ask which one to build first.

AskUserQuestion
Quelle Story lancer ?
--
1. Socle Hors Lign Applicatif (reco)
--
La spec est prête pour la story 1 (Socle hors-ligne applicatif), sans question ouverte.

Fichier : _bmad-output/specs/spec-blackball-training/stories/1-socle-hors-ligne-applicatif.md

Résumé :

Intent : scaffolder Vite/React/TS aux versions de la spine, PWA installable avec service worker précachant tous les assets, base/manifest alignés sur le sous-chemin GitHub Pages (/blackball-training/), pipeline GitHub Actions build+déploiement sur push main.
Boundaries : arborescence en couches (domain/application/adapters) posée dès ce socle, mais aucune capacité métier (CAP-1 à CAP-5) implémentée ; pas de Dexie à ce stade.
Tasks : scaffold Vite, arborescence Structural Seed, écran de démarrage minimal, config PWA (base + manifest dérivé), workflow GitHub Actions, .gitignore.
Verification : npm ci && npm run build, test manuel hors-ligne via service worker, et une note sur l'activation manuelle de "GitHub Actions" comme source dans Settings > Pages (action humaine unique avant le premier déploiement réel).
Avant d'approuver, vous pouvez ouvrir le fichier spec dans un éditeur ou me poser des questions et me dire ce qu'il faut changer. Vous pouvez aussi utiliser bmad-advanced-elicitation ou bmad-party-mode, idéalement dans une autre session pour éviter la surcharge de contexte.

AskUserQuestion
Approuver et Continuer ?
--
oui
--
Story 1 — Socle hors-ligne applicatif terminée : scaffold Vite/React/PWA, service worker précachant tous les assets, base/manifest alignés sur /blackball-training/, et pipeline GitHub Actions build+déploiement. Revue à 3 volets menée (1 bug bloquant trouvé et corrigé — package-lock.json non suivi, aurait cassé npm ci en CI — plus 2 correctifs mineurs ; 2 fausses alertes rejetées après vérification ; rien déféré). Build et npm ci re-vérifiés après correctifs. Commit local d1fb121.

Prochaine étape possible : pousser vers origin et activer "GitHub Actions" comme source dans Settings > Pages du dépôt (action manuelle unique), ou enchaîner sur la story 2 (Catalogue de contenu D.F.A.) avec /bmad-build.
--
Usage Sonnet 5 : 17%

## Implementation Story 2

/bmad-build
--
AskUserQuestion
Périmètre à builder
--
Catalogue de contenu D.F.A
--
AskUserQuestion
Taille de spec voulumineuse
--
Garder tel quel (reco)
--
Spec drafted: _bmad-output/implementation-artifacts/spec-catalogue-contenu-dfa.md

Résumé

Objectif : modéliser le catalogue des 35 exercices D.F.A. (domain/catalog) et construire un composant SVG TableDiagram réutilisable (adapters/ui/shared), fidèle aux schémas officiels — fondation pour FR-1/FR-2, consommée plus tard par les écrans Accueil/Exercice.
Investigation menée : extraction directe des coordonnées de grille des 11 figures depuis le PDF du règlement (3 sous-agents + vérification manuelle de ma part), croisée avec content-catalog.md.
Corrections apportées à content-catalog.md (planning artifact, désormais corrigé) : 3 erreurs Bronze (cible B1, couleur C2, cible F3), comptage Or A/B (4 billes, pas 2), et une découverte structurante — aucune flèche/poche cible n'existe dans les diagrammes Argent ou Or, contrairement à ce que le catalogue affirmait ; c'est une particularité du Bronze uniquement.
Validation croisée : la somme des billes de séquence × barème du 1er essai vaut exactement 100 pts pour Bronze, Argent et Or — ce qui corrobore les corrections.
Aucune question ouverte : l'investigation a permis de trancher tous les points, y compris la seule ambiguïté persistante (Or E, bille noire non localisée visuellement) — résolue en faisant confiance à la confirmation antérieure de Fifi plutôt qu'à une nouvelle lecture automatisée.
Taille : ~2100 tokens estimés (au-dessus de la cible 900-1600), gardé complet par ton choix — le surplus vient des Design Notes qui documentent ces corrections pour ne pas les re-découvrir à l'implémentation.
Avant d'approuver, tu peux ouvrir le fichier spec dans un éditeur ou me poser des questions et me dire ce qu'il faut changer. Tu peux aussi utiliser bmad-advanced-elicitation ou bmad-party-mode, idéalement dans une autre session pour éviter de saturer le contexte.

AskUserQuestion
Approuver et Continuer ?
--
Oui
--
Le catalogue des 35 exercices D.F.A. (Bronze/Argent/Or) est modélisé dans domain/catalog, avec un composant TableDiagram (SVG) fidèle aux schémas officiels — build et verify-catalog passent, revue à 3 couches terminée (2 patches appliqués, 1 point pré-existant déféré, le reste rejeté avec preuve). Commit local 151c79d.

Prochaine étape possible : bmad-walkthrough pour une revue humaine guidée, ou enchaîner sur le prochain périmètre (parcours de séance / moteur de score).
--
Usage Sonnet 5 : 64%

## Story 3

Bien les schémas ne sont pas fantastiques mais laissons les tels quel pour l'instant, en effet je suis en train de les refaire en PNG nous les remplacerons plus tard, tu peux passer à la suite (story suivante)
--
AskUserQuestion
Découpage du périmètre
--
Moteur de notation d'abbord
--
Le moteur de notation (domain/scoring) est implémenté — calcul du score par bille empochée, meilleur essai retenu, total vs seuil, vérifié contre les exemples officiels du règlement (verify-scoring/verify-catalog/build passent). Revue Blind Hunter : 5 patches appliqués (dont un vrai bug — un 4ᵉ essai produisait un score NaN silencieux, corrigé pour lever une erreur explicite), 3 rejets justifiés. Commit f2ed126.

Le parcours de séance (FR-3/4/8 — saisie d'essai, orchestration, persistance Dexie) reste en attente dans deferred-work.md comme prochaine story naturelle. Autre option : bmad-walkthrough pour une revue humaine guidée de ce qui vient d'être fait.
--
Usage Sonnet 5 : 70%

## Revue de la story 3

/bmad-walkthrough
--
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
--
ok c'est bon, next
--
Risk Spots
src/domain/scoring/index.ts:10 — [public API] Barème codé en dur, seule source de vérité du score dans toute l'app — une erreur ici fausse silencieusement tous les scores, partout
scripts/verify-scoring.mjs:1 — [infra] Le garde-fou n'est qu'un script manuel (npm run verify-scoring) — .github/workflows/deploy.yml ne lance que npm run build en CI, jamais ce script ni verify-catalog : une régression du barème peut passer inaperçue jusqu'au merge
src/domain/scoring/types.ts:13 — [other] Le garde anti-dérive Niveau/CatalogNiveau n'agit qu'à la compilation TypeScript — si ce fichier n'est jamais type-checké dans un chemin d'exécution futur (script exécuté isolément, config tsc allégée), il devient silencieusement inopérant
src/domain/scoring/index.ts:39 — [public API] calculerScoreExercice lève désormais une exception sur un 4e essai — aucun appelant réel n'existe encore ; à vérifier que le futur parcours de séance capture bien cette erreur au lieu de crasher l'UI
Machine Hardening
Un 4e essai produisait un score NaN silencieusement ignoré plutôt qu'un signal d'erreur — la revue a préféré lever une exception explicite (src/domain/scoring/index.ts:40), ce qui déplace le risque : c'est maintenant à l'appelant de ne jamais dépasser 3 essais.
Le barème 2e/3e essai Argent/Or (3 et 2,5 pts) et le cas complet à 3 essais n'étaient couverts par aucun test avant la revue — comblé dans verify-scoring.mjs.
Ajouter un getter exposant le barème brut a été explicitement rejeté (aucun consommateur actuel n'en a besoin) — à garder en tête si un futur écran veut afficher le barème avant de jouer.
Tu as vu le design et le paysage de risque. À partir d'ici :

"creuse [zone]" — j'approfondis cette zone précise avec un focus correction
"next" — je proposerai comment observer le comportement
--
Ok, next
--
Orientation → Walkthrough → Detail Pass → [Testing]

How to See It Working
Rejouer les exemples officiels du règlement
Do :


npm run verify-scoring
Expect : verify-scoring: OK (bareme Bronze/Argent/Or, meilleur essai retenu, total vs seuil). — confirme que le barème codé en dur produit bien les points attendus par le PRD/addendum (le point de risque le plus élevé de ce changement).

Observer le rejet explicite du 4e essai
Do : dans un fichier scratch ou node --experimental-strip-types, appeler calculerScoreExercice('bronze', [{billesEmpochees:1},{billesEmpochees:1},{billesEmpochees:1},{billesEmpochees:1}])
Expect : une exception levée (3 essais maximum, recu 4) plutôt qu'un score NaN silencieux — la correction issue de la revue, à voir de ses propres yeux avant qu'un futur écran de séance ne s'appuie dessus.

Aucun écran n'est encore branché sur ce module (pas de comportement UI à ce stade) — ces deux observations couvrent tout ce qui est visible pour l'instant.

Tu as vu le changement et comment le vérifier. Quand tu es prêt à trancher, dis-le simplement.
--
Oui c'est bon pour moi
--
Revue terminée. Quelle est ta décision sur ce commit ?

Approuver — on garde tel quel (je peux aider à patcher un point précis avant, si besoin)
Retravailler — retour à la planche (revert, révision du spec, autre approche)
Discuter — un point te chiffonne encore
--
Approuver
--
Approuvé — le commit f2ed126 (moteur de notation) est validé, rien à changer. Rien d'autre à faire à partir d'ici.
--
Usage Sonnet 5 : 72%

## Story 4

/bmad-build
--
AskUserQuestion
Quelle intention ?
Subagents ?
--
1. il semble qu'il y ait encore du travail dans deferred-work.md 
2. oui pour tout le run
--
AskUserQuestion
Parcours séance ou correctif catalog ?
--
Parcours séance
--
AskUserQuestion
Le workspace n'est pas propres (dossier gfx non suivi)
--
Continuer tel quel
--
AskUserQuestion
Taille spec
Onglet Historique
Tests session/persistance
--
1. Garder
2. Stub vide
3. Pas de tests auto sur ça
--
Spec is complete, no Open Questions remain. Here's the summary before the approval checkpoint:

Spec : spec-parcours-de-seance.md

Construit le parcours de séance complet (Accueil → Exercice → Résumé) sur les couches encore vides application/session, adapters/persistence (Dexie) et adapters/ui/{accueil,exercice,resume,historique}, en remplaçant le harnais temporaire App.tsx. Décisions actées :

Onglet Historique construit dès maintenant en stub vide (nav 2 onglets conforme à EXPERIENCE.md), sans liste/détail (FR-9/10/11 restent une spec séparée).
Pas de test automatisé pour cette couche (build TS + test manuel navigateur) ; le cadrage des tests reste pour bmad-testarch.
Spec gardé en un seul fichier malgré ~2560 tokens (guide 900-1600) : aucun sous-objectif n'est livrable/testable isolément (persistance, orchestration et écrans sont interdépendants).
Avant d'approuver, tu peux ouvrir le fichier spec dans un éditeur ou me poser des questions et me dire quoi changer. Tu peux aussi utiliser bmad-advanced-elicitation ou bmad-party-mode, idéalement dans une autre session pour éviter de charger ce contexte.

AskUserQuestion
Approuver et continuer ?
--
Oui
--
You've hit your session limit · resets 1:20pm (Europe/Paris)
Usage Sonnet 5 : 100%

## Session 3 - 06/09/2026 : Reprise session

Reprends
--
Committed as 801ef2c. Le parcours de séance complet (Accueil → Exercice → Résumé, persistance Dexie incrémentale, orchestration application/session) est livré, avec un onglet Historique en stub vide. La revue à 3 couches a trouvé et corrigé 2 bugs importants (fermeture prématurée de séance au rechargement sur le dernier exercice, crash de reprise après démarrage interrompu) plus 5 correctifs mineurs ; les assets gfx/ non liés sont laissés de côté et notés dans deferred-work.md.

Suite possible : ouvrir une pull request, lancer bmad-walkthrough pour une revue humaine, ou continuer sur un autre chantier.
--
Usage Sonnet 5 : 27%

## Story suivant

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
--
AskUserQuestion
Taille de la spec
--
1. Garder telle quelle (reco)
--
Spec prête — Historique en lecture seule (FR-9, FR-10, FR-11 / CAP-5)
_bmad-output/specs/spec-blackball-training/stories/6-historique-en-lecture-seule.md

Ce que ça construit : un module application/historique/ qui enveloppe la persistance déjà en place (listerSessionsTerminees/getDetailSession, déjà complets) et dérive systématiquement score/seuil via domain/scoring (AD-1) ; puis deux vues remplaçant le stub actuel — Liste (FR-9) et Détail par exercice/essai avec accordéon (FR-10), strictement lecture seule (FR-11), fidèles à mockups/historique.html.

Points non-évidents capturés dans la spec :

La table de traçabilité d'ARCHITECTURE-SPINE.md pour FR-9/10/11 omet la couche application/, en contradiction avec sa propre règle AD-6 — traité comme un raccourci de la table à corriger, pas une exception à suivre.
L'ordre d'affichage des exercices en Détail doit venir du catalogue (listerExercices(niveau)), pas de l'ordre brut renvoyé par la base (non garanti).
Un nouveau formatNomFigure à extraire dans shared/labels.ts, sans toucher au Exercice.tsx déjà livré.
Taille : 1729 tokens (~8% au-dessus du seuil de 1600) — vous avez choisi de garder la spec complète, le dépassement venant de détails d'implémentation réels sur un goal unique et cohérent (CAP-5), pas d'un scope trop large.

Avant d'approuver, vous pouvez ouvrir le fichier dans un éditeur ou me poser des questions et me dire ce qu'il faut changer. Vous pouvez aussi utiliser bmad-advanced-elicitation ou bmad-party-mode, idéalement dans une autre session pour éviter de saturer le contexte.

Que souhaitez-vous faire ?

AskUserQuestion
Approuver et Continuer ?
--
Oui
--
(remarque de fifi : Très très très très très long !!!!!)
L'Historique en lecture seule (FR-9, FR-10, FR-11) est implémenté, revu sur deux itérations (une inversion de dépendance et une course sur double-tap corrigées, quatre autres petits défauts patchés, un point non-bloquant déféré) et vérifié indépendamment — build, 3 scripts de garde-fou et navigateur réel tous verts. Commit a93e27e.

Avec ça, le périmètre MVP du PRD est entièrement couvert. Vous pouvez créer une pull request, lancer bmad-walkthrough pour une revue humaine, ou me donner la suite.
---
Usage Sonnet 5 : 83%

## Ajout d'un ecran de titre

bien j'ai vérifié tout semble fonctionner très bien, maintenant s'il ne reste plus de travail, pourrais tu faire un écran titre au chargement de l'application qui s'afficherait quelques secondes (disons 3 secondes pour un premier test) en t'appuyant sur la maquette @gfx/titre.png
--
L'écran titre est en place, revu et vérifié — build, et navigateur réel sur plusieurs formats d'écran, plus un point de comportement gracieux ajouté en cours de route : l'image (recompressée de 645 à 164 Ko sans perte visible) commande désormais elle-même les 3 secondes une fois réellement chargée, plutôt qu'un minuteur aveugle qui aurait pu la masquer avant qu'elle n'apparaisse sur un réseau lent. Commit d148abe.

Une chose à trancher si vous voulez : l'écran titre s'affiche aussi quand vous reprenez une séance en cours (comportement littéral de votre demande, mais ça retarde de 3s le retour à votre partie). Dites-moi si vous préférez le sauter dans ce cas.

Sinon : créer une pull request, lancer bmad-walkthrough, ou une autre demande.
--
Usage Sonnet 5 : 90%

## Remplacement des schemas exercices

Remplacement des schemas exercices : les visuels réalisé ne respectent pas suffisamment les schémas officiels, j'ai récupéré les visuels officiels dans le répertoire @gfx/base/*.png peux tu remplacer les visuels SVG par les images png correspondant à chaque exercice ?
--
You've hit your session limit · resets 8:50pm (Europe/Paris)

## Session 3 

Reprends
--
Les 35 exercices affichent maintenant l'image officielle du règlement (une par Figure, comme avant pour le SVG), revue et vérifiée — build, 3 scripts de garde-fou et navigateur réel tous verts. Commit 267256e.

Un point important à votre attention : en vérifiant l'image officielle de la Figure or-e, j'ai remarqué qu'elle montre une bille noire absente du modèle de données actuel (qui ne compte que 2 rouges + 3 jaunes). C'est possiblement une erreur de contenu antérieure à aujourd'hui, avec un impact potentiel sur le score de cet exercice — je n'ai pas corrigé à la volée (ça mérite la même rigueur de vérification page-par-page que le reste du catalogue), c'est noté dans deferred-work.md. Vu que vous avez maintenant les 35 images officielles sous la main, une passe dédiée pour re-vérifier tout le catalogue contre elles serait probablement utile.

Autre point mineur, purement esthétique celui-là : les schémas ont un fond blanc (comme le document officiel), qui tranche avec le thème sombre du reste de l'app — j'ai choisi de le garder tel quel (lecture "document officiel encadré", fidèle à votre demande), mais dites-moi si vous préférez que j'explore un habillage différent.
--
Usage Sonnet 5 : 11%


## Session 4 : Documentation

peux tu écrire le README.md du projet et indiquer comment installer l'application PWA sur mobile ?
--
Le README est à jour, avec les instructions d'installation PWA pour Android et iPhone/iPad, l'URL déployée (vérifiée en ligne, 200 OK), et les commandes de dev/build/vérification.
--
Usage Sonnet 5 : 7%

## Session 5 : Suite à tests réel 

Lorsque l'utilisateur commet une faute, et qu'il choisi de refaire l'exercice, s'il le réussi il faudrait ne pas afficher le bouton rejouer l'exercice, mais uniquement le bouton exercice suivant...
--
Corrigé et vérifié — build, et navigateur réel confirmant le scénario exact que vous avez signalé (faute puis rejeu réussi) : "Rejouer" disparaît bien, seul "Exercice suivant" reste. La revue a aussi repéré que le même calcul était dupliqué à deux endroits (la cause structurelle du bug) ; je l'ai extrait dans une seule fonction pour éviter que ça dérive à nouveau. Commit 3d2ae8e.
-- 
Usage Sonnet 5 : 13%

## Session 6 : Bug pas tout à fait corrigé

il semblerait qu'il y ait toujours des erreurs sur la gestion des boutons lors des exercices : 
* Si un exercice est réussi il ne faut afficher que le bouton "Exercice suivant"
* Si le joueur commet une faute : 
  * S'il reste des essais disponibles il faut afficher le bouton "Rejouer l'essai" et le bouton "Exercice suivant"
  * Sinon n'afficher que le bouton "Exercice suivant"
--
Spec drafted at _bmad-output/implementation-artifacts/spec-boutons-essai-regle-faute.md (oneshot route — single file, no intent gaps, no irreversibles).

Résumé : le vrai bug est que peutRejouer se décide par un calcul de plafond de score, ce qui masque "Rejouer l'essai" après certaines fautes (quand le score partiel déjà obtenu approche le plafond théorique du prochain essai) — alors que la règle voulue est directe : faute + essais restants → afficher les deux boutons ; succès complet ou 3 essais épuisés → seulement "Exercice suivant". Le correctif remplace le helper plafondProchainEssai par cette règle simple aux deux endroits concernés dans useSession.ts.

Avant d'approuver, vous pouvez ouvrir le fichier de spec dans un éditeur ou me poser des questions. Vous pouvez aussi utiliser bmad-advanced-elicitation ou bmad-party-mode, idéalement dans une autre session pour éviter de saturer le contexte.

AskUserQuestion
Approuver et Continuer ?
--
Oui
--
Corrigé : la règle repose désormais uniquement sur la nature de la clôture (faute vs succès complet) et le nombre d'essais joués, plus sur une comparaison de score — ce qui masquait à tort "Rejouer l'essai" après certaines fautes à score partiel élevé. Revue : 2 correctifs mineurs appliqués (constante NOMBRE_ESSAIS_MAX extraite, garde-fou redondant supprimé, JSDoc complété) ; le reste rejeté ou déjà couvert (absence de tests automatisés cohérente avec le précédent du repo, un scénario théorique disproved). Vérifié en navigateur réel sur les 4 cas (succès direct, faute à score élevé avec essai restant, faute finale après 3 essais). Commit 4a43e22.

Prochaine étape en une ligne : créer une PR (il faudra d'abord pousser, aucun commit n'a encore été poussé sur origin cette session), ou une autre modification.
--
Usage Sonnet 5 : 17%