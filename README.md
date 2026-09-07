# Carnet de Score Blackball DFA

Application mobile (PWA, 100% hors-ligne) pour s'entraîner seul aux Diplômes Fédéraux d'Aptitude (D.F.A.) de billard Blackball — Bronze, Argent, Or. Elle affiche le schéma officiel de chaque exercice, permet de saisir le résultat de chaque essai d'un geste simple à une main, et calcule automatiquement le score selon le barème exact du règlement F.F.B.

## Fonctionnalités

- **Catalogue officiel** des 3 niveaux (35 exercices), schémas fidèles au règlement.
- **Parcours de séance** à niveau fixe : saisie d'essai à une main, score calculé en continu, comparé au seuil du diplôme visé.
- **Historique** des séances passées, en lecture seule (liste + détail par exercice/essai).
- **Hors-ligne total** : toutes les données restent sur l'appareil (aucun compte, aucun cloud), utilisable sans réseau une fois installée.

## Installer l'application sur mobile

L'app est une PWA (Progressive Web App) : elle s'installe directement depuis le navigateur, sans passer par un store.

**URL :** https://darken33.github.io/blackball-training/

### Android (Chrome)

1. Ouvrir l'URL ci-dessus dans Chrome.
2. Menu ⋮ (en haut à droite) → **Installer l'application** (ou **Ajouter à l'écran d'accueil**).
3. Confirmer — une icône "Blackball" apparaît sur l'écran d'accueil, l'app se lance ensuite comme une app native (sans barre d'adresse).

### iPhone / iPad (Safari)

1. Ouvrir l'URL ci-dessus dans Safari (obligatoire — Chrome/Firefox sur iOS ne proposent pas cette option).
2. Bouton **Partager** (icône carrée avec une flèche vers le haut).
3. **Sur l'écran d'accueil** → **Ajouter**.

Une fois installée, l'app fonctionne entièrement hors-ligne (les schémas et le code sont mis en cache dès l'installation) — utile en salle de billard sans Wi-Fi fiable.

## Développement

Prérequis : Node.js ≥ 22.

```bash
npm install       # dépendances
npm run dev       # serveur de développement (http://localhost:5173)
npm run build     # build de production (dist/)
npm run preview   # sert le build de production en local
```

### Vérifications

Le projet n'a pas de framework de test — la logique pure (`domain/`) est couverte par des scripts autonomes :

```bash
npm run verify-catalog     # catalogue des 35 exercices
npm run verify-scoring     # moteur de notation
npm run verify-historique  # dérivation de l'historique
```

## Stack technique

- [Vite](https://vite.dev/) + [React](https://react.dev/) + TypeScript
- [Dexie](https://dexie.org/) (IndexedDB) pour la persistance locale
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) pour le mode hors-ligne
- Déploiement automatique sur GitHub Pages à chaque push sur `main` (`.github/workflows/deploy.yml`)

## Licence

[GPL-3.0](LICENSE)
