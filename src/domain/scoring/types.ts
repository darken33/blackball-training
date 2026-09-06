// Types du moteur de notation. Module autonome (AD-6) : ne reutilise pas le type
// Niveau de domain/catalog a l'execution, pour rester decouple de tout autre module
// domaine. Un import `type`-only (efface a la compilation, zero cout/dependance runtime)
// verifie que les deux unions ne divergent pas silencieusement.

import type { Niveau as CatalogNiveau } from '../catalog/types'

export type Niveau = 'bronze' | 'argent' | 'or'

// Si cette ligne ne compile plus, domain/catalog et domain/scoring ont diverge sur les
// niveaux valides — synchroniser les deux unions. Exporte uniquement pour satisfaire
// noUnusedLocals ; non destine a etre consomme ailleurs.
export const _niveauSyncAvecCatalogue: [Niveau] extends [CatalogNiveau] ? ([CatalogNiveau] extends [Niveau] ? true : never) : never =
  true as const

/** Fait brut d'un essai joue : nombre de billes empochees avant echec/faute/fin. */
export interface Essai {
  billesEmpochees: number
}
