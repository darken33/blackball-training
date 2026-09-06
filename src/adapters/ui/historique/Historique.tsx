import { useHistorique } from '../../../application/historique'
import { LIBELLE_NIVEAU } from '../shared/labels'
import { HistoriqueDetail } from './HistoriqueDetail'
import './Historique.css'

// Onglet Historique (FR-9/FR-10/FR-11) : liste des seances closes triee desc, ou detail
// d'une seance (mockups/historique.html). Lecture seule — aucune edition/suppression/reprise.

export function Historique() {
  const { vue, lignes, detail, ouvrirDetail, retourListe } = useHistorique()

  // Jamais d'etat vide affiche en flash avant la resolution du chargement initial (meme
  // convention que application/session, cf useSession vue === 'chargement').
  if (vue === 'chargement') {
    return (
      <div className="historique historique-empty">
        <p className="historique-vide">Chargement…</p>
      </div>
    )
  }

  if (vue === 'detail' && detail) {
    // `key={detail.id}` : repart d'un etat local propre (accordeon ferme) si `detail` change
    // (edge-case-hunter — deux resolutions successives ne doivent jamais faire migrer l'etat
    // d'expansion d'une seance vers une autre).
    return <HistoriqueDetail key={detail.id} detail={detail} onRetour={retourListe} />
  }

  // Etat vide inchange (Boundaries "Always") : meme markup/classe que l'ancien stub.
  if (lignes.length === 0) {
    return (
      <div className="historique historique-empty">
        <p className="historique-vide">Aucune séance enregistrée pour l'instant.</p>
      </div>
    )
  }

  return (
    <div className="historique">
      <span className="screen-title">Historique</span>
      <div className="history-list">
        {lignes.map((ligne) => (
          <button key={ligne.id} type="button" className="history-row" onClick={() => ouvrirDetail(ligne.id)}>
            <span className="left">
              <span className="date">{ligne.date}</span>
              <span className="niveau">{LIBELLE_NIVEAU[ligne.niveau]}</span>
            </span>
            <span className="right">
              <span className="score">{ligne.scoreTotal}/100</span>
              <span className={`status ${ligne.seuilAtteint ? 'ok' : 'ko'}`}>
                {ligne.seuilAtteint ? 'Seuil atteint' : 'Seuil non atteint'}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
