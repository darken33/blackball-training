import type { Exercice, Figure } from '../../../domain/catalog/types'
import type { EssaiAffichage } from '../../../application/session'

// Essai button (EXPERIENCE.md, Component Patterns) : ordre prescrit -> un bouton par bille dans
// l'ordre de poche ; sans ordre (lecture de table) -> un seul bouton "Bille empochee" qui
// incremente un compteur. Dans les deux cas la meme action (tapBille) fait progresser
// billesEmpochees de 1 — seul le rendu differe (AD-2 : aucune donnee de saisie superposee au
// schema, ce composant est distinct de TableDiagram).

const LIBELLE_COULEUR: Record<string, string> = {
  rouge: 'Rouge',
  jaune: 'Jaune',
  noire: 'Noire',
  blanche: 'Blanche',
}

// Etat annonce par TalkBack pour une bille de la sequence (ordre prescrit) : distingue la
// bille reellement actionnable ("a jouer") de celles simplement en attente plus loin dans la
// sequence, pour ne pas induire l'utilisateur en erreur sur ce qui est tapable maintenant.
function etatBilleOrdonnee(reussie: boolean, clos: boolean, prochaine: boolean): string {
  if (reussie) return 'réussie'
  if (clos) return 'non tentée'
  if (prochaine) return 'à jouer'
  return 'en attente'
}

export interface EssaiButtonsProps {
  exercice: Exercice
  figure: Figure
  essaiCourant: EssaiAffichage
  onTapBille: () => void
}

export function EssaiButtons({ exercice, figure, essaiCourant, onTapBille }: EssaiButtonsProps) {
  if (exercice.ordrePoche) {
    const ordre = exercice.ordrePoche
    return (
      <div className="essai-row" role="group" aria-label="Billes de la séquence">
        {ordre.map((billeIndex, position) => {
          const bille = figure.balls[billeIndex]
          const couleur = bille ? LIBELLE_COULEUR[bille.couleur] : ''
          const reussie = position < essaiCourant.billesEmpochees
          const prochaine = position === essaiCourant.billesEmpochees && !essaiCourant.clos
          const nonTentee = !reussie && !prochaine
          const etatLabel = etatBilleOrdonnee(reussie, essaiCourant.clos, prochaine)

          return (
            <button
              key={billeIndex}
              type="button"
              className={`essai-btn${reussie ? ' success' : ''}${nonTentee && essaiCourant.clos ? ' notreached' : ''}`}
              disabled={!prochaine}
              onClick={onTapBille}
              aria-label={`Bille ${position + 1}, ${couleur}, ${etatLabel}`}
            >
              <span className="num">Bille {position + 1}</span>
              <span className="st">{reussie ? 'Réussie' : nonTentee && essaiCourant.clos ? 'Non tentée' : couleur}</span>
            </button>
          )
        })}
      </div>
    )
  }

  const complet = essaiCourant.billesEmpochees >= exercice.nombreBillesSequence
  return (
    <div className="essai-row essai-row--compteur">
      <button
        type="button"
        className="essai-btn essai-btn--compteur"
        disabled={essaiCourant.clos || complet}
        onClick={onTapBille}
        aria-label={`Bille empochée, ${essaiCourant.billesEmpochees} sur ${exercice.nombreBillesSequence}, à jouer`}
      >
        <span className="num">Bille empochée</span>
        <span className="st">
          {essaiCourant.billesEmpochees}/{exercice.nombreBillesSequence}
        </span>
      </button>
    </div>
  )
}
