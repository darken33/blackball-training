// API de lecture seule du catalogue de contenu (AD-6 : fonctions pures, aucune I/O).

import { FIGURES, EXERCICES } from './data.ts'
import type { Niveau, Figure, Exercice } from './types.ts'

export type { Niveau, Couleur, Pocket, Bille, Figure, Exercice } from './types.ts'

const NIVEAUX: Niveau[] = ['bronze', 'argent', 'or']

export function listerNiveaux(): Niveau[] {
  return NIVEAUX
}

export function listerExercices(niveau: Niveau): Exercice[] {
  const figureIds = new Set(FIGURES.filter((figure) => figure.niveau === niveau).map((figure) => figure.id))
  return EXERCICES.filter((exercice) => figureIds.has(exercice.figureId))
}

export function getExercice(id: string): Exercice | undefined {
  return EXERCICES.find((exercice) => exercice.id === id)
}

export function getFigure(id: string): Figure | undefined {
  return FIGURES.find((figure) => figure.id === id)
}
