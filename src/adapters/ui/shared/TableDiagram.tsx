import type { Figure } from '../../../domain/catalog/types'
import './TableDiagram.css'

// Affiche l'image officielle du schema pour la Figure (une image par Figure, cf gfx/base/*.png
// -- en Bronze plusieurs Exercices partagent la meme image, AD-2 : les numeros de bille et les
// fleches y sont deja incrustes, aucune superposition dynamique necessaire). Remplace le rendu
// SVG genere depuis les coordonnees de grille (domain/catalog), qui ne respectait pas assez
// fidelement les schemas officiels. `figure.balls[].x/y/pocheCible` restent dans le modele
// (toujours lus par EssaiButtons pour la couleur) mais ne sont plus consommes pour le rendu
// (cf domain/catalog/types.ts).
//
// `alt=""` : l'image est purement spatiale (position des billes) et redondante avec l'enonce
// texte deja affiche juste au-dessus (Exercice.tsx, exercise-body) -- une alt non vide ferait
// annoncer deux fois la meme phrase a un lecteur d'ecran.

const SCHEMAS = import.meta.glob('../../../assets/schemas/*.png', { eager: true, import: 'default' }) as Record<string, string>

function schemaPour(figureId: string): string | undefined {
  return SCHEMAS[`../../../assets/schemas/${figureId}.png`]
}

export interface TableDiagramProps {
  figure: Figure
}

export function TableDiagram({ figure }: TableDiagramProps) {
  const src = schemaPour(figure.id)

  return <div className="table-diagram">{src && <img src={src} alt="" />}</div>
}
