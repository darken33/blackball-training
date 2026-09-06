import type { Niveau } from '../../../domain/catalog/types'

// Libelle affichage des niveaux (FR-3) — un seul point de verite pour eviter la divergence
// entre Accueil/Exercice/ScoreBar/Resume.
export const LIBELLE_NIVEAU: Record<Niveau, string> = {
  bronze: 'Bronze',
  argent: 'Argent',
  or: 'Or',
}
