import { useState } from 'react'
import type { HistoriqueDetail as HistoriqueDetailVue } from '../../../application/historique'
import { LIBELLE_NIVEAU } from '../shared/labels'
import './HistoriqueDetail.css'

// Vue Detail d'une seance close (FR-10/FR-11) : titre, score/seuil, accordeon par exercice
// (ordre canonique deja recale par application/historique), bouton "Retour" (motif de
// resume/Resume.tsx — mockups/historique.html ne contient aucun chrome de navigation).

export interface HistoriqueDetailProps {
  detail: HistoriqueDetailVue
  onRetour: () => void
}

export function HistoriqueDetail({ detail, onRetour }: HistoriqueDetailProps) {
  const [exerciceOuvert, setExerciceOuvert] = useState<string | null>(null)

  return (
    <div className="historique-detail">
      <span className="screen-title">
        {LIBELLE_NIVEAU[detail.niveau]} — {detail.date}
      </span>
      <p className="detail-header">
        Score total {detail.scoreTotal}/100 — {detail.seuilAtteint ? 'Seuil atteint' : 'Seuil non atteint'}
      </p>

      <div className="exercise-list">
        {detail.exercices.map((exercice) => {
          const ouvert = exerciceOuvert === exercice.exerciceId
          return (
            <div key={exercice.exerciceId} className={`exercise-row${ouvert ? ' expanded' : ''}`}>
              <button
                type="button"
                className="expanded-head"
                onClick={() => setExerciceOuvert(ouvert ? null : exercice.exerciceId)}
              >
                <span className="name">{exercice.nom}</span>
                <span className="score">{exercice.scoreExercice} pts</span>
              </button>

              {ouvert &&
                exercice.essais.map((essai) => (
                  <div key={essai.index} className="essai-detail-row">
                    <span className="k">Essai {essai.index}</span>
                    <span className="v">{essai.texte}</span>
                  </div>
                ))}
            </div>
          )
        })}
      </div>

      <button type="button" className="retour-btn" onClick={onRetour}>
        Retour
      </button>
    </div>
  )
}
