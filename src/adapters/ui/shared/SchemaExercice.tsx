import './SchemaExercice.css'
import { useEffect, useRef } from 'react'
import { TableDiagram } from './TableDiagram'
import { figureDeExercice } from './accordeon'

// Zone depliee commune a l'Historique et aux Stats : schema officiel de la figure de l'exercice,
// sans rien ajouter par-dessus. A l'ouverture, garde la zone visible quand la ligne precedente
// vient de se replier au-dessus (la liste ne doit pas "sauter" sous le doigt).

export function SchemaExercice({ exerciceId }: { exerciceId: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    ref.current?.scrollIntoView?.({ block: 'nearest' })
  }, [])

  const figure = figureDeExercice(exerciceId)
  if (!figure) return null
  return (
    <div ref={ref} className="schema-exercice">
      <TableDiagram figure={figure} />
    </div>
  )
}
