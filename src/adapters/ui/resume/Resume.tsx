import type { ResumeSeance } from '../../../application/session'
import { LIBELLE_NIVEAU } from '../shared/labels'
import './Resume.css'

// Ecran Resume de fin de seance (FR-8) : total, statut seuil, cloture/immuabilite (AD-5)
// (mockups/resume.html).

export interface ResumeProps {
  donnees: ResumeSeance
  onRetourAccueil: () => void
}

export function Resume({ donnees, onRetourAccueil }: ResumeProps) {
  const { niveau, nombreExercices, scoreTotal, seuil, seuilAtteint, date } = donnees

  return (
    <div className="resume">
      <span className="screen-title">Résumé de séance</span>
      <p className="level-meta">
        {LIBELLE_NIVEAU[niveau]} — {nombreExercices} exercices
      </p>

      <div className="total-card">
        <p className="label">Score total</p>
        <p className="total">
          {scoreTotal}/100
        </p>
      </div>

      <div className={`status-chip${seuilAtteint ? '' : ' fail'}`}>
        <div className="mark">{seuilAtteint ? '✓' : '✕'}</div>
        <p>
          {seuilAtteint
            ? `Seuil ${LIBELLE_NIVEAU[niveau]} atteint — ${scoreTotal}/100.`
            : `Seuil ${LIBELLE_NIVEAU[niveau]} non atteint — ${scoreTotal}/100.`}
        </p>
      </div>

      <div className="detail-row">
        <span className="k">Seuil du niveau</span>
        <span className="v">{seuil}/100</span>
      </div>
      <div className="detail-row">
        <span className="k">Date</span>
        <span className="v">{date}</span>
      </div>

      <p className="lock-note">Séance clôturée — verrouillée. Visible immédiatement dans l'Historique.</p>

      <button type="button" className="retour-btn" onClick={onRetourAccueil}>
        Retour à l'accueil
      </button>
    </div>
  )
}
