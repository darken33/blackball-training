// Derivation pure des Stats d'entrainement (experiments/blackball-stats-salle/DECISIONS.md,
// D4-D8). Faits bruts uniquement (AD-1) ; aucune dependance React/Dexie (AD-6) : testable par
// scripts/verify-stats.mjs. Indicateur d'entrainement DISTINCT du bareme officiel F.F.B.
// (domain/scoring n'est ni lu ni modifie).

import { formatNomFigure, listerExercices } from '../../domain/catalog/index.ts'
import type { Niveau } from '../../domain/catalog/types'
import type { EssaiEnregistre, ExerciceJoueDetail } from '../../adapters/persistence/repository'
import type { ExerciceStat, PointProgression, SeanceStats } from './types'

/** Fenetre de calcul : les N dernieres seances terminees du niveau (D5). */
export const TAILLE_FENETRE = 10
/** Sous ce nombre de seances jouees, aucun indice n'est affiche (comptes bruts, D3). */
export const SEUIL_MIN_SEANCES = 3

/** Difficulte d'un exercice sur une seance (D4) : reussi essai 1 = 0, essai 2 = 1, essai 3 = 2,
 * joue sans reussite = 3, aucun essai = null. "Reussi" = meme regle que `formatEssaiTexte`. */
export function difficulteExercice(nombreBillesSequence: number, essais: readonly EssaiEnregistre[]): number | null {
  if (essais.length === 0) return null
  const reussi = essais.find((essai) => essai.billesEmpochees === nombreBillesSequence)
  return reussi ? reussi.index - 1 : 3
}

function fenetre(niveau: Niveau, seances: readonly SeanceStats[]): SeanceStats[] {
  return seances
    .filter((seance) => seance.niveau === niveau)
    .slice()
    .sort((a, b) => b.demarreeLe.localeCompare(a.demarreeLe))
    .slice(0, TAILLE_FENETRE)
}

/** Une entree par exercice du catalogue (ordre canonique). Poids de recence lineaire sur la
 * fenetre : la plus recente = n, la plus ancienne = 1 (n = seances de la fenetre). */
export function calculerStatsNiveau(niveau: Niveau, seances: readonly SeanceStats[]): ExerciceStat[] {
  const recentes = fenetre(niveau, seances)
  const n = recentes.length
  return listerExercices(niveau).map((exercice) => {
    let somme = 0
    let poids = 0
    let nbSeances = 0
    recentes.forEach((seance, rang) => {
      const essais = seance.exercicesJoues.find((joue: ExerciceJoueDetail) => joue.exerciceId === exercice.id)?.essais ?? []
      const difficulte = difficulteExercice(exercice.nombreBillesSequence, essais)
      if (difficulte === null) return
      const p = n - rang
      somme += p * difficulte
      poids += p
      nbSeances += 1
    })
    const nom = formatNomFigure(niveau, exercice.id)
    if (nbSeances === 0) return { exerciceId: exercice.id, nom, statut: 'a-tenter', indice: null, nbSeances }
    if (nbSeances < SEUIL_MIN_SEANCES) return { exerciceId: exercice.id, nom, statut: 'insuffisant', indice: null, nbSeances }
    return { exerciceId: exercice.id, nom, statut: 'mesure', indice: somme / poids, nbSeances }
  })
}

/** Exercices mesures les plus difficiles d'abord (D7), bornes a `max`. */
export function pointsFaibles(stats: readonly ExerciceStat[], max: number): ExerciceStat[] {
  return stats
    .filter((stat) => stat.statut === 'mesure')
    .sort((a, b) => (b.indice ?? 0) - (a.indice ?? 0))
    .slice(0, max)
}

/** Courbe de progression (D8) : difficulte moyenne des exercices joues, par seance de la
 * fenetre, du plus ancien au plus recent. */
export function progression(niveau: Niveau, seances: readonly SeanceStats[]): PointProgression[] {
  const exercices = listerExercices(niveau)
  return fenetre(niveau, seances)
    .reverse()
    .flatMap((seance) => {
      const difficultes = exercices
        .map((exercice) =>
          difficulteExercice(
            exercice.nombreBillesSequence,
            seance.exercicesJoues.find((joue) => joue.exerciceId === exercice.id)?.essais ?? [],
          ),
        )
        .filter((d): d is number => d !== null)
      if (difficultes.length === 0) return []
      return [{ sessionId: seance.id, demarreeLe: seance.demarreeLe, moyenne: difficultes.reduce((s, d) => s + d, 0) / difficultes.length }]
    })
}
