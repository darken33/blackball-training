// Orchestration Historique (FR-9/FR-10/FR-11). Hook React : seul module de ce dossier qui
// appelle adapters/persistence (`listerSessionsTerminees`/`getDetailSession`, deja complets,
// non modifies) et detient de l'etat React — tout le calcul (score/seuil/statut, ordre
// canonique, formatage) est delegue a `./deriver` (fonctions pures, AD-1/AD-6).

import { useCallback, useEffect, useRef, useState } from 'react'
import { listerExercices } from '../../domain/catalog'
import { calculerScoreTotal, estSeuilAtteint } from '../../domain/scoring'
import * as repository from '../../adapters/persistence/repository'
import { construireExerciceDetail, formatDate, scoresParExerciceCanonique } from './deriver'
import type { HistoriqueDetail, HistoriqueLigne, VueHistorique } from './types'

export type { VueHistorique, HistoriqueLigne, EssaiDetailVue, ExerciceDetailVue, HistoriqueDetail } from './types'

export interface UseHistoriqueResult {
  vue: VueHistorique
  lignes: HistoriqueLigne[]
  detail: HistoriqueDetail | undefined
  ouvrirDetail: (sessionId: string) => void
  retourListe: () => void
}

export function useHistorique(): UseHistoriqueResult {
  const [vue, setVue] = useState<VueHistorique>('chargement')
  const [lignes, setLignes] = useState<HistoriqueLigne[]>([])
  const [detail, setDetail] = useState<HistoriqueDetail | undefined>(undefined)
  // Jeton de requete incremental (meme motif que le flag `annule` de useSession.ts:141,
  // adapte au cas d'appels concurrents multiples) : seule la resolution de la derniere
  // ligne tapee met a jour l'etat, quel que soit l'ordre de resolution des promesses.
  const jetonRef = useRef(0)

  // Chargement initial : `vue` reste 'chargement' jusqu'a la resolution (succes ou echec),
  // jamais d'etat vide affiche en flash avant que `lignes` ne soit peuplee (meme convention
  // que application/session, useSession.ts:91).
  useEffect(() => {
    let annule = false

    async function charger() {
      const sessions = await repository.listerSessionsTerminees()
      if (annule) return

      const resultats = await Promise.allSettled(
        sessions.map(async (session): Promise<HistoriqueLigne> => {
          const detailSession = await repository.getDetailSession(session.id)
          const scoreTotal = calculerScoreTotal(scoresParExerciceCanonique(session.niveau, detailSession.exercicesJoues))
          return {
            id: session.id,
            niveau: session.niveau,
            date: formatDate(session.clotureLe ?? session.demarreeLe),
            scoreTotal,
            seuilAtteint: estSeuilAtteint(session.niveau, scoreTotal),
          }
        }),
      )
      if (annule) return
      // Une session dont le detail echoue a charger ne doit jamais faire disparaitre les
      // autres lignes deja resolues (une seule ligne perdue, pas tout l'Historique).
      const construites: HistoriqueLigne[] = []
      resultats.forEach((resultat) => {
        if (resultat.status === 'fulfilled') {
          construites.push(resultat.value)
        } else {
          console.error('useHistorique: echec du chargement du detail d\'une seance', resultat.reason)
        }
      })
      setLignes(construites)
      setVue('liste')
    }

    charger().catch((erreur: unknown) => {
      console.error('useHistorique: echec du chargement des seances terminees', erreur)
      if (!annule) setVue('liste')
    })

    return () => {
      annule = true
    }
  }, [])

  const ouvrirDetail = useCallback((sessionId: string) => {
    const jeton = ++jetonRef.current
    repository
      .getDetailSession(sessionId)
      .then((detailSession) => {
        // Une ligne tapee plus recemment a deja incremente jetonRef : cette resolution est
        // perimee, on l'ignore (edge-case-hunter : deux taps avant la premiere resolution).
        if (jeton !== jetonRef.current) return
        const { session, exercicesJoues } = detailSession
        const exercices = listerExercices(session.niveau).map((exercice) => {
          const essaisEnregistres = exercicesJoues.find((exerciceJoue) => exerciceJoue.exerciceId === exercice.id)?.essais ?? []
          return construireExerciceDetail(session.niveau, exercice, essaisEnregistres)
        })
        const scoreTotal = calculerScoreTotal(exercices.map((exercice) => exercice.scoreExercice))
        setDetail({
          id: session.id,
          niveau: session.niveau,
          date: formatDate(session.clotureLe ?? session.demarreeLe),
          scoreTotal,
          seuilAtteint: estSeuilAtteint(session.niveau, scoreTotal),
          exercices,
        })
        setVue('detail')
      })
      .catch((erreur: unknown) => console.error('useHistorique: echec getDetailSession', erreur))
  }, [])

  // Navigation pure (aucun appel repository), meme motif que useSession.ts:353
  // (`retourAccueil`). Invalide aussi jetonRef : une resolution `ouvrirDetail` encore en vol
  // ne doit jamais faire reapparaitre le Detail apres un retour explicite a la Liste.
  const retourListe = useCallback(() => {
    jetonRef.current += 1
    setVue('liste')
  }, [])

  return { vue, lignes, detail, ouvrirDetail, retourListe }
}
