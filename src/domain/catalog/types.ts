// Types du catalogue de contenu D.F.A. (Bronze/Argent/Or).
// Pur domaine : aucune dependance React/Dexie (AD-6).

export type Niveau = 'bronze' | 'argent' | 'or'

export type Couleur = 'rouge' | 'jaune' | 'noire' | 'blanche'

// Les 6 poches sont fixes et identiques sur tous les schemas (cf catalog-grid-*.md).
export type Pocket =
  | 'haut-gauche'
  | 'haut-milieu'
  | 'haut-droite'
  | 'bas-gauche'
  | 'bas-milieu'
  | 'bas-droite'

export interface Bille {
  couleur: Couleur
  /**
   * Position en pourcentage de la surface de jeu, 0-100 (0 = bande gauche/haute).
   * Non consommee par le rendu depuis spec-schemas-officiels.md (2026-09-07, TableDiagram
   * affiche l'image officielle de la Figure) -- conservee pour reference/usage futur eventuel,
   * jamais lue par EssaiButtons (qui ne lit que `couleur`).
   */
  x: number
  y: number
  /**
   * Poche visee par cette bille. Bronze uniquement : chaque bille d'une Figure Bronze
   * porte sa propre fleche+poche cible dans le schema source, identique quel que soit
   * l'exercice sibling affiche (AD-2, cf Design Notes "Aucune fleche... Argent ni Or").
   * Non consommee par le rendu depuis spec-schemas-officiels.md — meme statut que x/y.
   */
  pocheCible?: Pocket
}

export interface Figure {
  id: string
  niveau: Niveau
  balls: Bille[]
  /**
   * Or E/F uniquement : aucune bille blanche positionnee, une ligne verticale
   * pointillee delimite la zone de replacement libre (cf Design Notes).
   */
  zoneReplacement?: boolean
}

export interface Exercice {
  id: string
  figureId: string
  /** Toujours renseigne, meme quand ordrePoche est vide/null (AD-2). */
  nombreBillesSequence: number
  /**
   * Ordre de poche prescrit : indices dans Figure.balls, dans l'ordre de la sequence
   * (position i => label i+1). `null` = aucun ordre prescrit (Or, "lecture de table").
   */
  ordrePoche: number[] | null
  enonce: string
  /** Fraction d'aim ("quantite de bille") : Bronze systematique, Argent A/B/C seulement. */
  quantiteBille?: string
}
