import './ConfirmDialog.css'

// Confirmation bloquante generique (EXPERIENCE.md, State Patterns : "Abandon demande").
// Utilisee par accueil/ et exercice/ pour le bouton Abandonner — jamais d'auto-suppression
// ailleurs (AD-4).

export interface ConfirmDialogProps {
  message: string
  labelConfirmer: string
  labelAnnuler: string
  onConfirmer: () => void
  onAnnuler: () => void
}

export function ConfirmDialog({ message, labelConfirmer, labelAnnuler, onConfirmer, onAnnuler }: ConfirmDialogProps) {
  return (
    <div className="confirm-dialog-backdrop" role="presentation" onClick={onAnnuler}>
      <div
        className="confirm-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-label={message}
        onClick={(evenement) => evenement.stopPropagation()}
      >
        <p className="confirm-dialog-message">{message}</p>
        <div className="confirm-dialog-actions">
          <button type="button" className="confirm-dialog-annuler" onClick={onAnnuler}>
            {labelAnnuler}
          </button>
          <button type="button" className="confirm-dialog-confirmer" onClick={onConfirmer}>
            {labelConfirmer}
          </button>
        </div>
      </div>
    </div>
  )
}
