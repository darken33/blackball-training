import { useState } from 'react'
import type { Niveau } from '../../../domain/catalog/types'
import type { NiveauResume, ReprisePossible } from '../../../application/session'
import { ConfirmDialog } from '../shared/ConfirmDialog'
import { LIBELLE_NIVEAU } from '../shared/labels'
import './Accueil.css'

// Ecran Accueil (FR-3) : choix du niveau, ou reprise d'une seance en cours (mockups/accueil.html).

export interface AccueilProps {
  niveaux: NiveauResume[]
  reprise: ReprisePossible | null
  onChoisirNiveau: (niveau: Niveau) => void
  onReprendre: () => void
  onAbandonner: () => void
}

export function Accueil({ niveaux, reprise, onChoisirNiveau, onReprendre, onAbandonner }: AccueilProps) {
  const [confirmationVisible, setConfirmationVisible] = useState(false)

  return (
    <div className="accueil">
      <h1 className="app-title">Séance</h1>

      {reprise && (
        <button type="button" className="resume-banner" onClick={onReprendre}>
          <p>
            Reprendre la séance {LIBELLE_NIVEAU[reprise.niveau]} — exercice {reprise.exerciceIndex + 1}/{reprise.nombreExercices}
          </p>
        </button>
      )}

      {niveaux.map(({ niveau, seuil, nombreExercices }) => {
        const estNiveauSession = reprise?.niveau === niveau
        const desactive = reprise !== null && !estNiveauSession
        return (
          <button
            key={niveau}
            type="button"
            className={`level-btn${estNiveauSession ? ' current' : ''}${desactive ? ' disabled' : ''}`}
            disabled={desactive || estNiveauSession}
            onClick={() => onChoisirNiveau(niveau)}
          >
            <span className="name">{LIBELLE_NIVEAU[niveau]}</span>
            <span className="meta">
              Seuil {seuil} / 100 — {nombreExercices} exercices
            </span>
          </button>
        )
      })}

      {reprise && (
        <button type="button" className="accueil-abandon-link" onClick={() => setConfirmationVisible(true)}>
          Abandonner la séance
        </button>
      )}

      {confirmationVisible && (
        <ConfirmDialog
          message="Abandonner la séance ? Les scores saisis ne seront pas conservés."
          labelAnnuler="Annuler"
          labelConfirmer="Abandonner"
          onAnnuler={() => setConfirmationVisible(false)}
          onConfirmer={() => {
            setConfirmationVisible(false)
            onAbandonner()
          }}
        />
      )}
    </div>
  )
}
