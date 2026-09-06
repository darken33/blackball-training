// Derivation pure pour l'Historique (FR-9/FR-10). Aucun import de valeur depuis
// adapters/persistence (Dexie) ni de React — uniquement des types, et domain/scoring +
// domain/catalog (aucune dependance runtime, AD-6). Reste testable par un script
// `node --experimental-strip-types` leger, comme domain/scoring et domain/catalog
// (scripts/verify-historique.mjs).

// Imports de valeur en chemin explicite (avec extension) : ce fichier doit rester resoluble
// par le `node --experimental-strip-types` nu de scripts/verify-historique.mjs, qui ne
// supporte pas les imports de repertoire (contrairement au bundler Vite).
import { formatNomFigure, listerExercices } from '../../domain/catalog/index.ts'
import type { Exercice, Niveau } from '../../domain/catalog/types'
import { calculerScoreExercice } from '../../domain/scoring/index.ts'
import type { EssaiEnregistre, ExerciceJoueDetail } from '../../adapters/persistence/repository'
import type { EssaiDetailVue, ExerciceDetailVue } from './types'

/** Meme motif que `application/session/useSession.ts:87` (`formatDate`) — seule source du
 * format d'affichage des dates (fr-FR). */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR')
}

/** Texte d'un essai enregistre : "X/Y bille(s) — reussi/rate". `reussi` est borne a
 * `billesEmpochees === nombreBillesSequence` (un essai clos par faute a toujours
 * `billesEmpochees < nombreBillesSequence`, cf `essaiEstClos`/`tapFaute` — jamais les deux
 * a la fois, verifie en review). */
export function formatEssaiTexte(billesEmpochees: number, nombreBillesSequence: number): string {
  const bille = billesEmpochees > 1 ? 'billes' : 'bille'
  const reussi = billesEmpochees === nombreBillesSequence
  return `${billesEmpochees}/${nombreBillesSequence} ${bille} — ${reussi ? 'réussi' : 'raté'}`
}

/** Vue Detail d'un exercice : recale sur l'ordre canonique du catalogue (l'appelant y veille
 * en iterant `listerExercices(niveau)`), toujours 3 emplacements d'essai — les index sans
 * essai enregistre replient sur "non joue" (convention "Erreurs/bords" : jamais d'exception
 * bloquante pour un exercice sans essai valide). */
export function construireExerciceDetail(
  niveau: Niveau,
  exercice: Exercice,
  essaisEnregistres: readonly EssaiEnregistre[],
): ExerciceDetailVue {
  const parIndex = new Map(essaisEnregistres.map((essai) => [essai.index, essai]))
  const essais: EssaiDetailVue[] = ([1, 2, 3] as const).map((index) => {
    const essai = parIndex.get(index)
    return {
      index,
      texte: essai ? formatEssaiTexte(essai.billesEmpochees, exercice.nombreBillesSequence) : 'non joué',
    }
  })
  return {
    exerciceId: exercice.id,
    nom: formatNomFigure(niveau, exercice.id),
    scoreExercice: calculerScoreExercice(niveau, essaisEnregistres),
    essais,
  }
}

/** Scores d'exercice du niveau, dans l'ordre canonique `listerExercices(niveau)` — source
 * unique du score total d'une seance (FR-7), qu'il s'agisse d'une ligne de Liste ou d'un
 * Detail. Un exercice absent de `exercicesJoues` (aucun essai valide) vaut 0 pt, jamais une
 * erreur bloquante. */
export function scoresParExerciceCanonique(niveau: Niveau, exercicesJoues: readonly ExerciceJoueDetail[]): number[] {
  const parExerciceId = new Map(exercicesJoues.map((exerciceJoue) => [exerciceJoue.exerciceId, exerciceJoue.essais]))
  return listerExercices(niveau).map((exercice) => calculerScoreExercice(niveau, parExerciceId.get(exercice.id) ?? []))
}
