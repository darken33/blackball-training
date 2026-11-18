import { getExercice, getFigure } from '../../../domain/catalog/index.ts'
import type { Figure } from '../../../domain/catalog/types.ts'

// Logique pure de l'accordeon a ouverture unique (spec v1.2.0), partagee par Historique et Stats.
// Sans React ni JSX : verifiable par `npm run verify-accordeon`.

/** Ouvre `id` s'il est ferme (en refermant l'ouvert precedent), le referme s'il est deja ouvert. */
export function basculerOuvert(ouvert: string | null, id: string): string | null {
  return ouvert === id ? null : id
}

/** Figure d'un exercice (exercice -> figureId -> figure). `undefined` si inconnu : pas d'exception. */
export function figureDeExercice(exerciceId: string): Figure | undefined {
  const exercice = getExercice(exerciceId)
  return exercice ? getFigure(exercice.figureId) : undefined
}
