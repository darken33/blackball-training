// Types des Stats d'entrainement (application/stats). adapters/ui ne consomme que ce qui est
// expose ici, jamais adapters/persistence directement (AD-6).

import type { Niveau } from '../../domain/catalog/types'
import type { ExerciceJoueDetail } from '../../adapters/persistence/repository'

/** Seance terminee en entree de la derivation (faits bruts, AD-1). */
export interface SeanceStats {
  id: string
  niveau: Niveau
  demarreeLe: string
  exercicesJoues: ExerciceJoueDetail[]
}

/** `a-tenter` : jamais joue ; `insuffisant` : < 3 seances (comptes bruts, pas d'indice) ;
 * `mesure` : indice disponible (0 = maitrise ... 3 = problematique). */
export type StatutStat = 'a-tenter' | 'insuffisant' | 'mesure'

export interface ExerciceStat {
  exerciceId: string
  nom: string
  statut: StatutStat
  indice: number | null
  nbSeances: number
}

export interface PointProgression {
  sessionId: string
  demarreeLe: string
  moyenne: number
}
