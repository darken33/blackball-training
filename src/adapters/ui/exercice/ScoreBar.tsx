import type { Niveau } from '../../../domain/catalog/types'
import { LIBELLE_NIVEAU } from '../shared/labels'
import './ScoreBar.css'

// Score bar (DESIGN.md/EXPERIENCE.md) : bandeau bas sticky, toujours visible pendant la
// seance, se met a jour des la cloture de chaque exercice (FR-7) — jamais pendant l'exercice
// courant tant que "Exercice suivant" n'a pas ete tape (cf mockups/exercice.html).

export interface ScoreBarProps {
  niveau: Niveau
  scoreTotal: number
  seuil: number
}

export function ScoreBar({ niveau, scoreTotal, seuil }: ScoreBarProps) {
  return (
    <div className="score-bar">
      <div className="total" aria-live="polite">
        {scoreTotal}/100
      </div>
      <div className="seuil">
        seuil {LIBELLE_NIVEAU[niveau]} {seuil}
      </div>
    </div>
  )
}
