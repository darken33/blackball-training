import { useMemo, useState } from 'react'
import './App.css'
import { getExercice, getFigure, listerExercices, listerNiveaux } from '../../domain/catalog'
import type { Niveau } from '../../domain/catalog'
import { TableDiagram } from './shared/TableDiagram'

// Harnais de verification temporaire (FR-1/FR-2) : selecteur niveau -> liste
// d'exercices -> TableDiagram de l'exercice choisi. En attendant l'ecran Accueil
// reel d'une spec ulterieure — aucune capacite metier (session/score) ici.
function App() {
  const niveaux = listerNiveaux()
  const [niveau, setNiveau] = useState<Niveau>(niveaux[0])
  const exercices = useMemo(() => listerExercices(niveau), [niveau])
  const [exerciceId, setExerciceId] = useState<string | undefined>(exercices[0]?.id)

  const exerciceCourantId = exercices.some((exercice) => exercice.id === exerciceId) ? exerciceId : exercices[0]?.id
  const exercice = exerciceCourantId ? getExercice(exerciceCourantId) : undefined
  const figure = exercice ? getFigure(exercice.figureId) : undefined

  function choisirNiveau(prochainNiveau: Niveau) {
    setNiveau(prochainNiveau)
    setExerciceId(undefined)
  }

  return (
    <main className="app-shell">
      <h1>Carnet de Score Blackball</h1>

      <div className="harnais-niveaux">
        {niveaux.map((n) => (
          <button
            key={n}
            type="button"
            className={n === niveau ? 'harnais-niveau actif' : 'harnais-niveau'}
            onClick={() => choisirNiveau(n)}
          >
            {n}
          </button>
        ))}
      </div>

      <div className="harnais-exercices">
        {exercices.map((e) => (
          <button
            key={e.id}
            type="button"
            className={e.id === exerciceCourantId ? 'harnais-exercice actif' : 'harnais-exercice'}
            onClick={() => setExerciceId(e.id)}
          >
            {e.id}
          </button>
        ))}
      </div>

      {figure && exercice && (
        <div className="harnais-schema">
          <p className="harnais-enonce">{exercice.enonce}</p>
          <TableDiagram figure={figure} exercice={exercice} />
        </div>
      )}
    </main>
  )
}

export default App
