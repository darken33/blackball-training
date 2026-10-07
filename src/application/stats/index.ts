// Orchestration Stats : seul module de ce dossier qui appelle adapters/persistence et detient
// de l'etat React ; tout le calcul est delegue a `./deriver` (fonctions pures, AD-1/AD-6).

import { useEffect, useMemo, useState } from 'react'
import type { Niveau } from '../../domain/catalog/types'
import * as repository from '../../adapters/persistence/repository'
import { calculerStatsNiveau, pointsFaibles, progression } from './deriver'
import type { ExerciceStat, PointProgression, SeanceStats } from './types'

export type { ExerciceStat, PointProgression, StatutStat } from './types'

const NB_POINTS_FAIBLES = 5

export interface UseStatsResult {
  chargement: boolean
  /** Le chargement des seances a echoue : l'ecran l'indique au lieu d'un faux etat vide. */
  erreur: boolean
  niveau: Niveau
  changerNiveau: (niveau: Niveau) => void
  /** Aucune seance terminee pour le niveau choisi : l'ecran affiche un etat vide. */
  aucuneSeance: boolean
  pointsFaibles: ExerciceStat[]
  /** Exercices "a tenter" (jamais joues) et "insuffisants" (< 3 seances). */
  aTenter: ExerciceStat[]
  insuffisants: ExerciceStat[]
  progression: PointProgression[]
}

export function useStats(): UseStatsResult {
  const [seances, setSeances] = useState<SeanceStats[] | null>(null)
  const [erreur, setErreur] = useState(false)
  const [niveau, changerNiveau] = useState<Niveau>('bronze')

  useEffect(() => {
    let annule = false
    repository
      .listerSessionsTerminees()
      .then((sessions) => Promise.all(sessions.map((session) => repository.getDetailSession(session.id))))
      .then((details) => {
        if (annule) return
        setSeances(details.map(({ session, exercicesJoues }) => ({ id: session.id, niveau: session.niveau, demarreeLe: session.demarreeLe, exercicesJoues })))
      })
      .catch((cause: unknown) => {
        console.error('useStats: echec du chargement des seances terminees', cause)
        if (annule) return
        setErreur(true)
        setSeances([])
      })
    return () => {
      annule = true
    }
  }, [])

  const derive = useMemo(() => {
    const source = seances ?? []
    const stats = calculerStatsNiveau(niveau, source)
    return {
      aucuneSeance: !source.some((seance) => seance.niveau === niveau),
      pointsFaibles: pointsFaibles(stats, NB_POINTS_FAIBLES),
      aTenter: stats.filter((stat) => stat.statut === 'a-tenter'),
      insuffisants: stats.filter((stat) => stat.statut === 'insuffisant'),
      progression: progression(niveau, source),
    }
  }, [seances, niveau])

  return { chargement: seances === null, erreur, niveau, changerNiveau, ...derive }
}
