import { useState } from 'react'
import type { Niveau } from '../../../domain/catalog/types'
import type { ExerciceEnCoursVue } from '../../../application/session'
import { TableDiagram } from '../shared/TableDiagram'
import { ConfirmDialog } from '../shared/ConfirmDialog'
import { LIBELLE_NIVEAU } from '../shared/labels'
import { EssaiButtons } from './EssaiButtons'
import './Exercice.css'

// Ecran Exercice en cours (FR-4/5/6/7) : schema, saisie d'essai, undo, score retenu,
// enchainement vers l'exercice suivant (mockups/exercice.html, etats "Essai en cours"/"Essai clos").

function formatTitre(niveau: Niveau, exerciceId: string): string {
  const segments = exerciceId.split('-')
  const figureLettre = segments[1]?.toUpperCase() ?? ''
  const numero = segments[2]
  const suffixe = niveau === 'bronze' ? numero : ''
  return `${LIBELLE_NIVEAU[niveau]} — Exercice ${figureLettre}${suffixe}`
}

function formatHeadline(billesEmpochees: number, faute: boolean, total: number): string {
  const bille = billesEmpochees > 1 ? 'billes empochées' : 'bille empochée'
  if (billesEmpochees === 0) {
    return faute ? 'Essai clos — faute, aucune bille empochée.' : 'Essai clos — aucune bille empochée.'
  }
  if (faute) {
    return `Essai clos — faute après ${billesEmpochees} ${bille} sur ${total}.`
  }
  return `Essai clos — séquence complète, ${billesEmpochees} ${bille} sur ${total}.`
}

export interface ExerciceProps {
  donnees: ExerciceEnCoursVue
  undoVisible: boolean
  onTapBille: () => void
  onTapFaute: () => void
  onAnnulerTap: () => void
  onRejouer: () => void
  onSuivant: () => void
  onAbandonner: () => void
}

export function Exercice({
  donnees,
  undoVisible,
  onTapBille,
  onTapFaute,
  onAnnulerTap,
  onRejouer,
  onSuivant,
  onAbandonner,
}: ExerciceProps) {
  const [confirmationVisible, setConfirmationVisible] = useState(false)
  const { exercice, figure, niveau, numero, nombreExercices, essaiCourant, essaiClos, nombreEssaisJoues, peutRejouer } = donnees

  return (
    <div className="exercice">
      <div className="exercice-header">
        <h2 className="exercise-title">{formatTitre(niveau, exercice.id)}</h2>
        <button type="button" className="exercice-abandon-link" onClick={() => setConfirmationVisible(true)}>
          Abandonner
        </button>
      </div>
      <p className="exercise-meta">
        Exercice {numero}/{nombreExercices} — Essai {essaiCourant.index}/3{essaiClos ? ' — clos' : ''}
      </p>
      <p className="exercise-body">{exercice.enonce}</p>

      <TableDiagram figure={figure} exercice={exercice} />

      <EssaiButtons exercice={exercice} figure={figure} essaiCourant={essaiCourant} onTapBille={onTapBille} />

      {undoVisible && (
        <div className="undo-banner" aria-live="polite">
          <button type="button" onClick={onAnnulerTap}>
            Annuler
          </button>
        </div>
      )}

      {!essaiClos && (
        <button type="button" className="fault-btn" onClick={onTapFaute} aria-label="Faute, termine l'essai">
          Faute / fin d'essai
        </button>
      )}

      {essaiClos && (
        <>
          <div className="result-panel">
            <p className="headline">{formatHeadline(essaiCourant.billesEmpochees, essaiCourant.faute, exercice.nombreBillesSequence)}</p>
            <p className="score">Score de l'essai : {essaiCourant.score} pts</p>
            {nombreEssaisJoues > 1 && <p className="score-retenu">Score retenu (meilleur essai) : {donnees.scoreExerciceRetenu} pts</p>}
          </div>
          <div className="actions-row">
            <button type="button" className="next-btn" onClick={onSuivant}>
              Exercice suivant
            </button>
            {peutRejouer && (
              <button type="button" className="replay-btn" onClick={onRejouer}>
                Rejouer l'essai
              </button>
            )}
          </div>
        </>
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
