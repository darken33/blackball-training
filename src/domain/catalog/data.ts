// Contenu officiel des 35 exercices D.F.A. (Bronze 20, Argent 9, Or 6).
// Source : content-catalog.md (regles, baremes, enonces, corrections 2026-09-06) +
// catalog-grid-{bronze,argent,or}.md (coordonnees de grille extraites du PDF reglement).
// AD-2 : en Bronze une Figure porte 3-4 Exercices partageant le meme schema ;
// en Argent/Or une Figure = un seul Exercice.

import type { Figure, Exercice } from './types.ts'

export const FIGURES: Figure[] = [
  // ---------------------------------------------------------------------
  // BRONZE — 6 figures partagees, 1 bille blanche fixe, fleche+poche cible
  // par bille (feature Bronze uniquement, cf Design Notes).
  // ---------------------------------------------------------------------
  {
    id: 'bronze-a',
    niveau: 'bronze',
    balls: [
      { couleur: 'blanche', x: 65, y: 70 },
      { couleur: 'jaune', x: 78, y: 25, pocheCible: 'haut-droite' },
      { couleur: 'jaune', x: 72, y: 20, pocheCible: 'haut-droite' },
      { couleur: 'rouge', x: 57, y: 30, pocheCible: 'haut-milieu' },
      { couleur: 'rouge', x: 55, y: 40, pocheCible: 'haut-milieu' },
    ],
  },
  {
    id: 'bronze-b',
    niveau: 'bronze',
    balls: [
      { couleur: 'blanche', x: 37, y: 15 },
      // Corrige 2026-09-06 (verifie PDF p.13) : cible reelle bas-gauche, pas haut-milieu.
      { couleur: 'rouge', x: 35, y: 38, pocheCible: 'bas-gauche' },
      { couleur: 'jaune', x: 28, y: 78, pocheCible: 'bas-gauche' },
      { couleur: 'jaune', x: 52, y: 55, pocheCible: 'bas-droite' },
      { couleur: 'rouge', x: 48, y: 65, pocheCible: 'bas-droite' },
    ],
  },
  {
    id: 'bronze-c',
    niveau: 'bronze',
    balls: [
      { couleur: 'blanche', x: 32, y: 50 },
      // Corrige 2026-09-06 (verifie directement PDF p.14) : cible reelle haut-milieu, pas haut-gauche
      // (les fleches de C1 et C2 ne convergent pas, ce sont deux poches distinctes).
      { couleur: 'jaune', x: 40, y: 25, pocheCible: 'haut-milieu' },
      // Corrige 2026-09-06 (verifie PDF p.14) : bille rouge, pas noire (aucune noire en Figure C).
      { couleur: 'rouge', x: 18, y: 18, pocheCible: 'haut-gauche' },
      { couleur: 'rouge', x: 45, y: 72, pocheCible: 'bas-milieu' },
    ],
  },
  {
    id: 'bronze-d',
    niveau: 'bronze',
    balls: [
      { couleur: 'blanche', x: 63, y: 70 },
      { couleur: 'jaune', x: 55, y: 62, pocheCible: 'haut-milieu' },
      { couleur: 'rouge', x: 52, y: 88, pocheCible: 'bas-milieu' },
      { couleur: 'jaune', x: 88, y: 28, pocheCible: 'haut-droite' },
    ],
  },
  {
    id: 'bronze-e',
    niveau: 'bronze',
    balls: [
      { couleur: 'blanche', x: 73, y: 68 },
      { couleur: 'jaune', x: 75, y: 35, pocheCible: 'haut-droite' },
      { couleur: 'jaune', x: 78, y: 22, pocheCible: 'haut-droite' },
      { couleur: 'rouge', x: 57, y: 28, pocheCible: 'haut-milieu' },
    ],
  },
  {
    id: 'bronze-f',
    niveau: 'bronze',
    balls: [
      { couleur: 'blanche', x: 50, y: 20 },
      { couleur: 'jaune', x: 57, y: 55, pocheCible: 'bas-droite' },
      { couleur: 'rouge', x: 53, y: 78, pocheCible: 'bas-milieu' },
      // Corrige 2026-09-06 (verifie PDF p.15) : cible reelle bas-gauche, pas bas-droite.
      { couleur: 'rouge', x: 35, y: 72, pocheCible: 'bas-gauche' },
    ],
  },

  // ---------------------------------------------------------------------
  // ARGENT — 9 figures, 1 exercice chacune, jamais de fleche (Design Notes).
  // ---------------------------------------------------------------------
  {
    id: 'argent-a',
    niveau: 'argent',
    balls: [
      { couleur: 'blanche', x: 20, y: 80 },
      { couleur: 'rouge', x: 15, y: 50 },
      { couleur: 'noire', x: 15, y: 15 },
    ],
  },
  {
    id: 'argent-b',
    niveau: 'argent',
    balls: [
      { couleur: 'blanche', x: 60, y: 70 },
      { couleur: 'rouge', x: 75, y: 50 },
      { couleur: 'noire', x: 95, y: 60 },
    ],
  },
  {
    id: 'argent-c',
    niveau: 'argent',
    balls: [
      { couleur: 'blanche', x: 45, y: 70 },
      { couleur: 'jaune', x: 45, y: 30 },
      { couleur: 'jaune', x: 15, y: 70 },
      { couleur: 'noire', x: 50, y: 50 },
    ],
  },
  {
    id: 'argent-d',
    niveau: 'argent',
    balls: [
      { couleur: 'blanche', x: 30, y: 85 },
      { couleur: 'rouge', x: 50, y: 90 },
      { couleur: 'rouge', x: 90, y: 15 },
      { couleur: 'noire', x: 90, y: 70 },
      { couleur: 'jaune', x: 60, y: 50 }, // obstacle non-etiquete
      { couleur: 'jaune', x: 40, y: 85 }, // obstacle non-etiquete
    ],
  },
  {
    id: 'argent-e',
    niveau: 'argent',
    balls: [
      { couleur: 'blanche', x: 45, y: 65 },
      { couleur: 'rouge', x: 50, y: 30 },
      { couleur: 'rouge', x: 50, y: 70 },
      { couleur: 'noire', x: 15, y: 40 },
      { couleur: 'jaune', x: 90, y: 85 }, // obstacle non-etiquete
    ],
  },
  {
    id: 'argent-f',
    niveau: 'argent',
    balls: [
      { couleur: 'blanche', x: 70, y: 75 },
      { couleur: 'jaune', x: 60, y: 50 },
      { couleur: 'jaune', x: 30, y: 30 },
      { couleur: 'noire', x: 5, y: 70 },
    ],
  },
  {
    id: 'argent-g',
    niveau: 'argent',
    balls: [
      { couleur: 'blanche', x: 30, y: 50 },
      { couleur: 'jaune', x: 15, y: 30 },
      { couleur: 'jaune', x: 20, y: 80 },
      { couleur: 'noire', x: 50, y: 25 },
    ],
  },
  {
    id: 'argent-h',
    niveau: 'argent',
    balls: [
      { couleur: 'blanche', x: 55, y: 50 },
      { couleur: 'rouge', x: 55, y: 20 },
      { couleur: 'rouge', x: 90, y: 30 },
      { couleur: 'noire', x: 50, y: 50 },
    ],
  },
  {
    id: 'argent-i',
    niveau: 'argent',
    balls: [
      { couleur: 'blanche', x: 85, y: 70 },
      { couleur: 'jaune', x: 90, y: 50 },
      { couleur: 'jaune', x: 60, y: 70 },
      { couleur: 'noire', x: 85, y: 30 },
    ],
  },

  // ---------------------------------------------------------------------
  // OR — 6 figures, 1 exercice chacune, jamais de fleche ni de numero
  // (ordre libre / "lecture de table", cf Design Notes). E/F : zone de
  // replacement, aucune bille blanche positionnee.
  // ---------------------------------------------------------------------
  {
    id: 'or-a',
    niveau: 'or',
    balls: [
      { couleur: 'blanche', x: 35, y: 50 },
      { couleur: 'jaune', x: 40, y: 25 },
      { couleur: 'jaune', x: 50, y: 50 },
      { couleur: 'jaune', x: 15, y: 90 },
      { couleur: 'noire', x: 75, y: 50 },
    ],
  },
  {
    id: 'or-b',
    niveau: 'or',
    balls: [
      { couleur: 'blanche', x: 65, y: 40 },
      { couleur: 'rouge', x: 60, y: 35 },
      { couleur: 'rouge', x: 80, y: 65 },
      { couleur: 'rouge', x: 75, y: 85 },
      { couleur: 'noire', x: 20, y: 65 },
    ],
  },
  {
    id: 'or-c',
    niveau: 'or',
    balls: [
      { couleur: 'blanche', x: 70, y: 55 },
      { couleur: 'jaune', x: 35, y: 20 },
      { couleur: 'jaune', x: 60, y: 45 },
      { couleur: 'jaune', x: 85, y: 20 },
      { couleur: 'noire', x: 40, y: 60 },
      { couleur: 'rouge', x: 45, y: 30 }, // obstacle
      { couleur: 'rouge', x: 65, y: 50 }, // obstacle
      { couleur: 'rouge', x: 70, y: 60 }, // obstacle
    ],
  },
  {
    id: 'or-d',
    niveau: 'or',
    balls: [
      { couleur: 'blanche', x: 85, y: 30 },
      { couleur: 'jaune', x: 55, y: 45 },
      { couleur: 'jaune', x: 48, y: 80 },
      { couleur: 'jaune', x: 88, y: 65 },
      { couleur: 'noire', x: 28, y: 45 },
      { couleur: 'rouge', x: 15, y: 55 }, // obstacle
      { couleur: 'rouge', x: 45, y: 50 }, // obstacle
      { couleur: 'rouge', x: 78, y: 30 }, // obstacle
      { couleur: 'rouge', x: 68, y: 70 }, // obstacle
    ],
  },
  {
    id: 'or-e',
    niveau: 'or',
    // Pas de bille blanche : zone de replacement (cf zoneReplacement). Aucune bille
    // noire visible dans le schema source (cf Design Notes) — nombreBillesSequence=4
    // (confirme par Fifi) reste correct pour le score sans qu'une position soit inventee ici.
    zoneReplacement: true,
    balls: [
      { couleur: 'rouge', x: 35, y: 30 },
      { couleur: 'rouge', x: 55, y: 70 },
      { couleur: 'jaune', x: 20, y: 20 }, // obstacle
      { couleur: 'jaune', x: 22, y: 50 }, // obstacle
      { couleur: 'jaune', x: 68, y: 70 }, // obstacle
    ],
  },
  {
    id: 'or-f',
    niveau: 'or',
    zoneReplacement: true,
    balls: [
      { couleur: 'jaune', x: 33, y: 20 },
      { couleur: 'jaune', x: 33, y: 35 },
      { couleur: 'jaune', x: 50, y: 20 },
      { couleur: 'jaune', x: 78, y: 60 },
      { couleur: 'noire', x: 88, y: 25 },
      { couleur: 'rouge', x: 20, y: 35 }, // obstacle
      { couleur: 'rouge', x: 35, y: 50 }, // obstacle
      { couleur: 'rouge', x: 58, y: 55 }, // obstacle
    ],
  },
]

export const EXERCICES: Exercice[] = [
  // --- Bronze — barème 5/3/2, 1 bille par exercice (nombreBillesSequence: 1) ---
  {
    id: 'bronze-a-1',
    figureId: 'bronze-a',
    nombreBillesSequence: 1,
    ordrePoche: null,
    enonce: 'Empocher la bille jaune « 1 » (½ bille) dans la poche haut-droite.',
    quantiteBille: '½ bille',
  },
  {
    id: 'bronze-a-2',
    figureId: 'bronze-a',
    nombreBillesSequence: 1,
    ordrePoche: null,
    enonce: 'Empocher la bille jaune « 2 » (¾ bille) dans la poche haut-droite.',
    quantiteBille: '¾ bille',
  },
  {
    id: 'bronze-a-3',
    figureId: 'bronze-a',
    nombreBillesSequence: 1,
    ordrePoche: null,
    enonce: 'Empocher la bille rouge « 3 » (bille pleine) dans la poche haut-milieu.',
    quantiteBille: 'bille pleine',
  },
  {
    id: 'bronze-a-4',
    figureId: 'bronze-a',
    nombreBillesSequence: 1,
    ordrePoche: null,
    enonce: 'Empocher la bille rouge « 4 » (½ bille) dans la poche haut-milieu.',
    quantiteBille: '½ bille',
  },
  {
    id: 'bronze-b-1',
    figureId: 'bronze-b',
    nombreBillesSequence: 1,
    ordrePoche: null,
    enonce: 'Empocher la bille rouge « 1 » (bille pleine) dans la poche bas-gauche.',
    quantiteBille: 'bille pleine',
  },
  {
    id: 'bronze-b-2',
    figureId: 'bronze-b',
    nombreBillesSequence: 1,
    ordrePoche: null,
    enonce: 'Empocher la bille jaune « 2 » (¼ bille) dans la poche bas-gauche.',
    quantiteBille: '¼ bille',
  },
  {
    id: 'bronze-b-3',
    figureId: 'bronze-b',
    nombreBillesSequence: 1,
    ordrePoche: null,
    enonce: 'Empocher la bille jaune « 3 » (¾ bille) dans la poche bas-droite.',
    quantiteBille: '¾ bille',
  },
  {
    id: 'bronze-b-4',
    figureId: 'bronze-b',
    nombreBillesSequence: 1,
    ordrePoche: null,
    enonce: 'Empocher la bille rouge « 4 » (½ bille) dans la poche bas-droite.',
    quantiteBille: '½ bille',
  },
  {
    id: 'bronze-c-1',
    figureId: 'bronze-c',
    nombreBillesSequence: 1,
    ordrePoche: null,
    enonce: 'Empocher la bille jaune « 1 » (¾ bille) dans la poche haut-milieu.',
    quantiteBille: '¾ bille',
  },
  {
    id: 'bronze-c-2',
    figureId: 'bronze-c',
    nombreBillesSequence: 1,
    ordrePoche: null,
    enonce: 'Empocher la bille rouge « 2 » (¼ bille) dans la poche haut-gauche.',
    quantiteBille: '¼ bille',
  },
  {
    id: 'bronze-c-3',
    figureId: 'bronze-c',
    nombreBillesSequence: 1,
    ordrePoche: null,
    enonce: 'Empocher la bille rouge « 3 » (¼ bille) dans la poche bas-milieu.',
    quantiteBille: '¼ bille',
  },
  {
    id: 'bronze-d-1',
    figureId: 'bronze-d',
    nombreBillesSequence: 1,
    ordrePoche: null,
    enonce: 'Empocher la bille jaune « 1 » (¾ bille) dans la poche haut-milieu.',
    quantiteBille: '¾ bille',
  },
  {
    id: 'bronze-d-2',
    figureId: 'bronze-d',
    nombreBillesSequence: 1,
    ordrePoche: null,
    enonce: 'Empocher la bille rouge « 2 » (bille pleine) dans la poche bas-milieu.',
    quantiteBille: 'bille pleine',
  },
  {
    id: 'bronze-d-3',
    figureId: 'bronze-d',
    nombreBillesSequence: 1,
    ordrePoche: null,
    enonce: 'Empocher la bille jaune « 3 » (½ bille) dans la poche haut-droite.',
    quantiteBille: '½ bille',
  },
  {
    id: 'bronze-e-1',
    figureId: 'bronze-e',
    nombreBillesSequence: 1,
    ordrePoche: null,
    enonce: 'Empocher la bille jaune « 1 » (bille pleine) dans la poche haut-droite.',
    quantiteBille: 'bille pleine',
  },
  {
    id: 'bronze-e-2',
    figureId: 'bronze-e',
    nombreBillesSequence: 1,
    ordrePoche: null,
    enonce: 'Empocher la bille jaune « 2 » (½ bille) dans la poche haut-droite.',
    quantiteBille: '½ bille',
  },
  {
    id: 'bronze-e-3',
    figureId: 'bronze-e',
    nombreBillesSequence: 1,
    ordrePoche: null,
    enonce: 'Empocher la bille rouge « 3 » (¾ bille) dans la poche haut-milieu.',
    quantiteBille: '¾ bille',
  },
  {
    id: 'bronze-f-1',
    figureId: 'bronze-f',
    nombreBillesSequence: 1,
    ordrePoche: null,
    enonce: 'Empocher la bille jaune « 1 » (¾ bille) dans la poche bas-droite.',
    quantiteBille: '¾ bille',
  },
  {
    id: 'bronze-f-2',
    figureId: 'bronze-f',
    nombreBillesSequence: 1,
    ordrePoche: null,
    enonce: 'Empocher la bille rouge « 2 » (½ bille) dans la poche bas-milieu.',
    quantiteBille: '½ bille',
  },
  {
    id: 'bronze-f-3',
    figureId: 'bronze-f',
    nombreBillesSequence: 1,
    ordrePoche: null,
    enonce: 'Empocher la bille rouge « 3 » (bille pleine) dans la poche bas-gauche.',
    quantiteBille: 'bille pleine',
  },

  // --- Argent — barème 4/3/2,5 par bille, ordre de poche toujours prescrit ---
  {
    id: 'argent-a-1',
    figureId: 'argent-a',
    nombreBillesSequence: 2,
    ordrePoche: [1, 2], // rouge (index 1) puis noire (index 2), cf balls de argent-a
    enonce: 'Empocher la bille rouge (¾ bille), puis se replacer pour jouer la noire.',
    quantiteBille: '¾ bille',
  },
  {
    id: 'argent-b-1',
    figureId: 'argent-b',
    nombreBillesSequence: 2,
    ordrePoche: [1, 2],
    enonce: 'Empocher la bille rouge (bille pleine), puis se replacer pour jouer la noire.',
    quantiteBille: 'bille pleine',
  },
  {
    id: 'argent-c-1',
    figureId: 'argent-c',
    nombreBillesSequence: 3,
    ordrePoche: [1, 2, 3],
    enonce:
      'Empocher les deux billes jaunes en séquence (1ère ¾ bille), puis se replacer pour jouer la noire.',
    quantiteBille: '¾ bille',
  },
  {
    id: 'argent-d-1',
    figureId: 'argent-d',
    nombreBillesSequence: 3,
    ordrePoche: [1, 2, 3],
    enonce:
      "Fermer la table avec les billes rouges (aucune jouable directement), puis se replacer pour jouer la noire.",
  },
  {
    id: 'argent-e-1',
    figureId: 'argent-e',
    nombreBillesSequence: 3,
    ordrePoche: [1, 2, 3],
    enonce: 'Fermer la table avec les billes rouges (1ère ¾ bille), puis se replacer pour jouer la noire.',
    quantiteBille: '¾ bille',
  },
  {
    id: 'argent-f-1',
    figureId: 'argent-f',
    nombreBillesSequence: 3,
    ordrePoche: [1, 2, 3],
    enonce: 'Fermer la table avec les billes jaunes (1ère ¾ bille), puis se replacer pour jouer la noire.',
    quantiteBille: '¾ bille',
  },
  {
    id: 'argent-g-1',
    figureId: 'argent-g',
    nombreBillesSequence: 3,
    ordrePoche: [1, 2, 3],
    enonce:
      'Fermer la table avec les billes jaunes (1ère bille pleine), puis se replacer pour jouer la noire.',
    quantiteBille: 'bille pleine',
  },
  {
    id: 'argent-h-1',
    figureId: 'argent-h',
    nombreBillesSequence: 3,
    ordrePoche: [1, 2, 3],
    enonce: 'Fermer la table avec les billes rouges (1ère ½ bille), puis se replacer pour jouer la noire.',
    quantiteBille: '½ bille',
  },
  {
    id: 'argent-i-1',
    figureId: 'argent-i',
    nombreBillesSequence: 3,
    ordrePoche: [1, 2, 3],
    enonce: 'Fermer la table avec les billes jaunes (1ère ¾ bille), puis se replacer pour jouer la noire.',
    quantiteBille: '¾ bille',
  },

  // --- Or — barème 4/3/2,5 par bille, jamais d'ordre prescrit (lecture de table) ---
  {
    id: 'or-a-1',
    figureId: 'or-a',
    nombreBillesSequence: 4,
    ordrePoche: null,
    enonce: 'Fermer la table avec les billes jaunes, puis la noire (ordre libre).',
  },
  {
    id: 'or-b-1',
    figureId: 'or-b',
    nombreBillesSequence: 4,
    ordrePoche: null,
    enonce: 'Fermer la table avec les billes rouges, puis la noire (ordre libre).',
  },
  {
    id: 'or-c-1',
    figureId: 'or-c',
    nombreBillesSequence: 4,
    ordrePoche: null,
    enonce: 'Fermer la table avec les billes jaunes, puis la noire — table dense, ordre libre.',
  },
  {
    id: 'or-d-1',
    figureId: 'or-d',
    nombreBillesSequence: 4,
    ordrePoche: null,
    enonce: 'Fermer la table avec les billes jaunes, puis la noire — table très dense, ordre libre.',
  },
  {
    id: 'or-e-1',
    figureId: 'or-e',
    nombreBillesSequence: 4,
    ordrePoche: null,
    enonce:
      'Fermer la table avec les billes rouges, puis la noire — bille blanche placée librement dans la zone de replacement.',
  },
  {
    id: 'or-f-1',
    figureId: 'or-f',
    nombreBillesSequence: 5,
    ordrePoche: null,
    enonce:
      'Fermer la table avec les billes jaunes, puis la noire — bille blanche placée librement dans la zone de replacement.',
  },
]
