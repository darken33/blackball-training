import './Historique.css'

// Onglet Historique : stub a etat vide (spec-parcours-de-seance.md, Boundaries "Never").
// FR-9/10/11 (liste + detail) sont hors perimetre de cette spec — seul l'etat vide existe ici.

export function Historique() {
  return (
    <div className="historique">
      <p className="historique-vide">Aucune séance enregistrée pour l'instant.</p>
    </div>
  )
}
