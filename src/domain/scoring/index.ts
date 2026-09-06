// Moteur de notation (FR-5, FR-6, FR-7). Module pur : aucune dependance (AD-6),
// aucune persistance (AD-1) — derive toujours un score a partir de faits bruts.

import type { Essai, Niveau } from './types'

export type { Niveau, Essai } from './types'

// Barème par niveau : valeur en points d'une bille empochee au 1er/2e/3e essai
// (glossaire PRD §3). Index 0 = 1er essai.
const BAREME: Record<Niveau, readonly [number, number, number]> = {
  bronze: [5, 3, 2],
  argent: [4, 3, 2.5],
  or: [4, 3, 2.5],
}

const SEUIL: Record<Niveau, number> = {
  bronze: 50,
  argent: 60,
  or: 70,
}

/**
 * Score d'un essai = billes empochees x valeur de bareme du niveau pour cet essai.
 * `billesEmpochees` doit etre le nombre reel de billes empochees a cet essai (0..N,
 * jamais negatif) ; la validation de N contre le catalogue (nombreBillesSequence) est
 * la responsabilite de l'appelant, pas de ce module (AD-6 : aucune dependance vers
 * domain/catalog).
 */
export function calculerScoreEssai(niveau: Niveau, indexEssai: 1 | 2 | 3, billesEmpochees: number): number {
  return billesEmpochees * BAREME[niveau][indexEssai - 1]
}

/**
 * Score d'un exercice = le meilleur score parmi les essais joues (FR-5).
 * 0 si aucun essai joue (une session sans essai valide ne bloque jamais, cf convention
 * architecture "Erreurs/bords"). `essais` ne doit jamais depasser 3 elements (regle FR-4/FR-5,
 * "jusqu'a 3 essais") ; un 4e essai leve une erreur plutot que d'etre silencieusement ignore.
 */
export function calculerScoreExercice(niveau: Niveau, essais: readonly Essai[]): number {
  if (essais.length > 3) {
    throw new Error(`calculerScoreExercice: 3 essais maximum, recu ${essais.length}`)
  }
  let meilleur = 0
  essais.forEach((essai, position) => {
    const indexEssai = (position + 1) as 1 | 2 | 3
    const score = calculerScoreEssai(niveau, indexEssai, essai.billesEmpochees)
    if (score > meilleur) meilleur = score
  })
  return meilleur
}

/** Score total de séance = somme des scores d'exercice (FR-7). */
export function calculerScoreTotal(scoresExercices: readonly number[]): number {
  return scoresExercices.reduce((total, score) => total + score, 0)
}

/** Seuil de réussite du niveau, sur 100 (Bronze 50, Argent 60, Or 70). */
export function getSeuil(niveau: Niveau): number {
  return SEUIL[niveau]
}

/** Le score total franchit-il le seuil de réussite du niveau ? (FR-7) */
export function estSeuilAtteint(niveau: Niveau, scoreTotal: number): boolean {
  return scoreTotal >= SEUIL[niveau]
}
