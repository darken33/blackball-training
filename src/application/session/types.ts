// Types de l'orchestration de session (application/session). Seul module qui appelle
// adapters/persistence (AD-6) ; adapters/ui ne consomme que ce qui est expose ici.

import type { Exercice, Figure, Niveau } from '../../domain/catalog/types'

/** Fait brut d'un essai, tel que suivi cote application (memes champs que le repository —
 * AD-1 : jamais de score stocke ici, uniquement des billes empochees + faute). */
export interface EssaiJoue {
  index: 1 | 2 | 3
  billesEmpochees: number
  faute: boolean
}

/** Ecran actuellement presente par l'onglet Seance. */
export type VueSeance = 'chargement' | 'accueil' | 'exercice' | 'resume'

export interface NiveauResume {
  niveau: Niveau
  seuil: number
  nombreExercices: number
}

export interface ReprisePossible {
  niveau: Niveau
  exerciceIndex: number
  nombreExercices: number
}

export interface ExerciceEnCours {
  exercice: Exercice
  figure: Figure
  niveau: Niveau
  numero: number
  nombreExercices: number
  essais: EssaiJoue[]
}

export interface ResumeSeance {
  niveau: Niveau
  nombreExercices: number
  scoreTotal: number
  seuil: number
  seuilAtteint: boolean
  date: string
}
