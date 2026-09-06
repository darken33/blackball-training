import { useId } from 'react'
import type { Couleur, Exercice, Figure, Pocket } from '../../../domain/catalog/types'
import './TableDiagram.css'

// Composant SVG reutilisable : rend uniquement les donnees de Figure + la cible de
// l'Exercice, jamais une image ni un markup specifique par exercice (AD-2).
// Convention de viewBox/coordonnees reprise du mockup UX (exercice.html).

const VIEWBOX_WIDTH = 500
const VIEWBOX_HEIGHT = 260
const FELT_X = 30
const FELT_Y = 30
const FELT_WIDTH = 440
const FELT_HEIGHT = 200
const BALL_RADIUS = 12

const POCKET_POSITIONS: Record<Pocket, { x: number; y: number }> = {
  'haut-gauche': { x: 0, y: 0 },
  'haut-milieu': { x: 50, y: 0 },
  'haut-droite': { x: 100, y: 0 },
  'bas-gauche': { x: 0, y: 100 },
  'bas-milieu': { x: 50, y: 100 },
  'bas-droite': { x: 100, y: 100 },
}

const BALL_FILL: Record<Couleur, string> = {
  rouge: 'var(--ball-red)',
  jaune: 'var(--ball-yellow)',
  noire: 'var(--ball-black)',
  blanche: 'var(--ball-white)',
}

// x/y en % de la surface de jeu (0-100) -> coordonnees SVG (viewBox 500x260).
function toPx(x: number, y: number): { x: number; y: number } {
  return {
    x: FELT_X + (x / 100) * FELT_WIDTH,
    y: FELT_Y + (y / 100) * FELT_HEIGHT,
  }
}

export interface TableDiagramProps {
  figure: Figure
  exercice: Exercice
}

export function TableDiagram({ figure, exercice }: TableDiagramProps) {
  const arrowMarkerId = useId()
  const isBronze = figure.niveau === 'bronze'

  // Argent/Or : label = position dans ordrePoche (index de bille -> ordre 1-based).
  // null = aucun ordre prescrit (Or, "lecture de table") -> aucun label.
  const ordreLabelParBille = new Map<number, number>()
  if (exercice.ordrePoche) {
    exercice.ordrePoche.forEach((billeIndex, position) => {
      ordreLabelParBille.set(billeIndex, position + 1)
    })
  }

  const replacementLineX = figure.zoneReplacement ? toPx(20, 0).x : null

  return (
    <div className="table-diagram">
      <svg
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={`Schema de la table pour l'exercice ${exercice.enonce}`}
      >
        <rect x="10" y="10" width="480" height="240" rx="10" fill="var(--table-rail)" />
        <rect x={FELT_X} y={FELT_Y} width={FELT_WIDTH} height={FELT_HEIGHT} fill="var(--table-felt)" />

        {(Object.entries(POCKET_POSITIONS) as Array<[Pocket, { x: number; y: number }]>).map(([nom, pos]) => {
          const { x, y } = toPx(pos.x, pos.y)
          const estPocheMilieu = nom === 'haut-milieu' || nom === 'bas-milieu'
          return <circle key={nom} cx={x} cy={y} r={estPocheMilieu ? 12 : 13} fill="var(--pocket)" />
        })}

        {replacementLineX !== null && (
          <line
            className="table-replacement-zone"
            x1={replacementLineX}
            y1={FELT_Y}
            x2={replacementLineX}
            y2={FELT_Y + FELT_HEIGHT}
            stroke="var(--table-replacement-zone)"
            strokeWidth={2}
            strokeDasharray="6 5"
          />
        )}

        {isBronze && (
          <defs>
            <marker id={arrowMarkerId} markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="var(--table-arrow)" />
            </marker>
          </defs>
        )}

        {figure.balls.map((bille, index) => {
          const { x, y } = toPx(bille.x, bille.y)
          const target = isBronze && bille.pocheCible ? toPx(POCKET_POSITIONS[bille.pocheCible].x, POCKET_POSITIONS[bille.pocheCible].y) : null
          const label = isBronze
            ? bille.couleur === 'blanche'
              ? undefined
              : index
            : ordreLabelParBille.get(index)

          return (
            <g key={index}>
              {target && (
                <line
                  x1={x}
                  y1={y}
                  x2={target.x}
                  y2={target.y}
                  stroke="var(--table-arrow)"
                  strokeWidth={2}
                  markerEnd={`url(#${arrowMarkerId})`}
                />
              )}
              <circle cx={x} cy={y} r={BALL_RADIUS} fill={BALL_FILL[bille.couleur]} stroke="var(--ball-outline)" strokeWidth={1.5} />
              {label !== undefined && (
                <text x={x} y={y + 25} textAnchor="middle" fill="var(--table-order-label)" fontSize={14} fontWeight={600}>
                  {label}
                </text>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
