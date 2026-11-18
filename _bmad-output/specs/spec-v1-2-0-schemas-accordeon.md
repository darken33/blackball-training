---
title: 'v1.2.0 — Schéma de la figure dans les accordéons Historique et Stats'
type: 'feature'
created: '2026-11-18'
status: 'frozen'
route: 'party-mode (salle) puis bmad-build'
baseline_version: '1.1.1'
target_version: '1.2.0'
---

<frozen-after-approval reason="intention figée par Fifi en salle le 2026-11-18 — ne pas modifier sans renégocier">

## Intent

**Problème :** testée en salle de billard, la v1.1.1 fonctionne. Mais l'écran Historique (détail d'une séance) et l'écran Stats (Points faibles) nomment des exercices (« Figure F ») sans montrer le schéma correspondant : pour savoir quoi retravailler, il faut deviner ou rouvrir un autre écran.

**Approche :** afficher le schéma officiel de la figure dans la zone dépliée de chaque ligne d'exercice, sur les deux écrans, avec un seul comportement d'accordéon partagé.

## Comportement

1. **Historique > détail d'une séance** : le tap sur un exercice le déplie. Sous la ligne : le schéma, puis les trois essais (comportement actuel conservé).
2. **Stats > Points faibles** : même geste. Sous la ligne : le schéma seul.
3. **Ouverture unique** : ouvrir une ligne referme la précédente ; retaper la ligne ouverte la referme.
4. **État initial** : tout est replié à l'arrivée sur Stats et à chaque changement d'onglet Bronze / Argent / Or. (Pas de cas « top 5 qui bouge sous une ligne ouverte » : l'écran Stats n'est pas affiché pendant un entraînement.)
5. **Rendu** : l'image statique de `src/assets/schemas/`, via `TableDiagram` (exercice → `getExercice(id).figureId` → `getFigure`). **Rien n'est ajouté par-dessus** : le rectangle noir de la maquette de la figure F est un défaut de l'image de la maquette, à ne pas reproduire.
6. **Composant partagé** : un seul composant d'accordéon pour le comportement (ouvert = un `exerciceId` ou `null`) ; le contenu déplié est fourni par chaque écran.

## Boundaries & Constraints

**Always :**
- Réutiliser `TableDiagram` ; ne créer aucun second rendu du tapis.
- Historique : conserver l'ordre canonique des exercices, les scores et le texte des essais inchangés.
- Une ligne qui se ferme pendant qu'une autre s'ouvre ne doit pas faire sauter la liste sous le doigt (la ligne tapée reste visible).
- Texte + indice restent lisibles sans couleur seule (conventions v1.1.0).

**Never :**
- Pas de bouton « s'entraîner » depuis une ligne (idée v1.3.0, porte laissée ouverte).
- Pas de superposition des résultats d'essai sur le tapis.
- Pas de modification du calcul de l'indice ni de `repository.ts` / `db.ts`.
- Pas d'optimisation des PNG dans cette version (dette notée ci-dessous).

## I/O & Edge-Case Matrix

| Scénario | État / Entrée | Comportement attendu |
|----------|---------------|----------------------|
| Ouverture | Tout replié, tap sur F | F s'ouvre, schéma de F visible |
| Bascule | F ouvert, tap sur G | F se referme, G s'ouvre |
| Repli | G ouvert, tap sur G | G se referme, tout replié |
| Arrivée Stats | Navigation vers l'onglet Stats | Tout replié |
| Changement de niveau | F ouvert (Argent), tap sur Bronze | Tout replié ; aucun schéma Argent sous Bronze |
| Bronze | Plusieurs exercices partagent une figure | Chaque exercice montre l'image de sa figure (AD-2) |
| Image absente | `figureId` sans PNG | Pas d'erreur ; la zone dépliée n'affiche pas d'image |
| Historique, exercice non joué | 0 pt, « non joué » ×3 | Schéma + trois lignes « non joué » |
| Fidélité | Figure F (Argent) | L'image affichée est exactement le PNG, sans élément ajouté |

## Critères de test (rouges d'abord)

1. Tap ouvre ; tap sur une autre ligne ferme la première et ouvre la seconde ; tap sur la ligne ouverte la ferme.
2. Stats : tout replié à l'entrée et au changement de niveau.
3. Historique et Stats utilisent le même composant d'accordéon.
4. Le schéma rendu pour un exercice correspond à `figureId` (y compris Bronze, figure partagée).
5. Fidélité de l'image sur la figure F : aucun élément ajouté.

## Hors périmètre / dette notée

- Bouton « s'entraîner » depuis une ligne → v1.3.0 envisagée.
- 21 PNG, ~766 Ko chacun, ~16 Mo au total, précachés par la PWA (`globPatterns` incluant `png`) → dette P2, WebP / redimensionnement possibles plus tard. Non aggravée par la v1.2.0.
- Mise à jour du `CHANGELOG.md` (entrée 1.2.0 « Ajouté ») et de la version dans `package.json` à la livraison.

## Constats de code (2026-11-18)

- `HistoriqueDetail.tsx` possède déjà un état `exerciceOuvert` à ouverture unique : pour l'Historique, seul le schéma est nouveau.
- `Stats.tsx` n'a pas d'accordéon : `LigneFaible` est une ligne statique.
- Mapping disponible : `getExercice(id).figureId` puis `getFigure(figureId)` (`domain/catalog`).

</frozen-after-approval>
