// Types de l'orchestration Historique (application/historique). adapters/ui/historique ne
// consomme que ce qui est expose ici — jamais adapters/persistence directement (AD-6).

import type { Niveau } from '../../domain/catalog/types'

/** Ecran actuellement presente par l'onglet Historique. */
export type VueHistorique = 'chargement' | 'liste' | 'detail'

/** Ligne de la vue Liste (FR-9) : score/statut toujours derives via domain/scoring, jamais
 * une valeur stockee (AD-1). Pas de champ `seuil` : jamais consomme par le rendu (le mockup
 * n'affiche que le statut qualitatif "Seuil atteint/non atteint"). */
export interface HistoriqueLigne {
  id: string
  niveau: Niveau
  date: string
  scoreTotal: number
  seuilAtteint: boolean
}

/** Un essai affiche dans l'accordeon de la vue Detail. `texte` encode deja "non joue" pour
 * un essai jamais enregistre — aucun champ `joue` distinct, jamais consomme par le rendu. */
export interface EssaiDetailVue {
  index: 1 | 2 | 3
  texte: string
}

/** Un exercice de la vue Detail, recale sur l'ordre canonique `listerExercices(niveau)`
 * (FR-10) — jamais l'ordre brut de `getDetailSession` (non garanti). */
export interface ExerciceDetailVue {
  exerciceId: string
  nom: string
  scoreExercice: number
  essais: EssaiDetailVue[]
}

/** Vue Detail complete d'une seance (FR-10/FR-11, lecture seule). Pas de champ `seuil` :
 * jamais consomme par le rendu (le mockup n'affiche que le statut qualitatif). */
export interface HistoriqueDetail {
  id: string
  niveau: Niveau
  date: string
  scoreTotal: number
  seuilAtteint: boolean
  exercices: ExerciceDetailVue[]
}
