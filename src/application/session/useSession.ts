// Orchestration de session (FR-3/4/5/6/7/8). Hook React encapsulant etat + appels
// repository — pas de store externe, pas de `dexie-react-hooks` (Design Notes, Boundaries).
// Seul module qui appelle adapters/persistence (AD-6). Toute logique de score/seuil passe par
// domain/scoring ; adapters/ui ne consomme que les valeurs deja calculees exposees ici.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getFigure, listerExercices, listerNiveaux } from '../../domain/catalog'
import type { Exercice, Figure, Niveau } from '../../domain/catalog/types'
import { calculerScoreEssai, calculerScoreExercice, calculerScoreTotal, estSeuilAtteint, getSeuil } from '../../domain/scoring'
import * as repository from '../../adapters/persistence/repository'
import type { EssaiJoue, NiveauResume, ResumeSeance, VueSeance } from './types'

interface SessionActiveState {
  sessionId: string
  niveau: Niveau
  exercices: Exercice[]
  exerciceIndex: number
  /** Scores retenus des exercices deja avances (index < exerciceIndex) — alimente la
   * score-bar ; le score de l'exercice courant n'y entre qu'au moment de "Exercice suivant"
   * (cf mockups exercice.html : le total n'inclut pas encore l'exercice en cours). */
  scoresCommis: number[]
  essaisCourant: EssaiJoue[]
}

export interface EssaiAffichage extends EssaiJoue {
  clos: boolean
  score: number
}

export interface ExerciceEnCoursVue {
  exercice: Exercice
  figure: Figure
  niveau: Niveau
  numero: number
  nombreExercices: number
  essaiCourant: EssaiAffichage
  essaiClos: boolean
  nombreEssaisJoues: number
  scoreExerciceRetenu: number
  peutRejouer: boolean
  scoreTotal: number
  seuil: number
}

export interface ReprisePossible {
  niveau: Niveau
  exerciceIndex: number
  nombreExercices: number
}

export interface UseSessionResult {
  vue: VueSeance
  niveaux: NiveauResume[]
  reprise: ReprisePossible | null
  exerciceEnCours: ExerciceEnCoursVue | undefined
  resumeSeance: ResumeSeance | undefined
  undoVisible: boolean
  demarrerSession: (niveau: Niveau) => void
  reprendreSession: () => void
  tapBille: () => void
  tapFaute: () => void
  rejouerEssai: () => void
  exerciceSuivant: () => void
  annulerDernierTap: () => void
  abandonner: () => void
  retourAccueil: () => void
}

const DELAI_UNDO_MS = 3000

function essaiEstClos(essai: EssaiJoue, exercice: Exercice): boolean {
  return essai.faute || essai.billesEmpochees >= exercice.nombreBillesSequence
}

/**
 * Meilleur score encore atteignable au PROCHAIN essai (le bareme baisse avec l'index : 1er
 * essai > 2e > 3e) -- jamais celui de l'essai 1, sinon un succes complet obtenu a l'essai 2/3
 * reste toujours sous ce plafond fige et le rejeu resterait propose alors qu'il ne peut plus
 * rien ameliorer (bug corrige ici). `null` si les 3 essais sont deja joues : aucun prochain
 * essai n'existe, donc rejouer ne peut jamais ameliorer le score retenu. Source unique pour
 * `peutRejouer` (exerciceEnCours) et le garde-fou de `rejouerEssai` -- la meme logique dupliquee
 * aux deux endroits est la cause racine du bug.
 */
function plafondProchainEssai(niveau: Niveau, essaisJoues: number, nombreBillesSequence: number): number | null {
  if (essaisJoues >= 3) return null
  return calculerScoreEssai(niveau, (essaisJoues + 1) as 1 | 2 | 3, nombreBillesSequence)
}

function versAffichage(essai: EssaiJoue, niveau: Niveau, exercice: Exercice): EssaiAffichage {
  return {
    ...essai,
    clos: essaiEstClos(essai, exercice),
    score: calculerScoreEssai(niveau, essai.index, essai.billesEmpochees),
  }
}

function remplacerDernier<T>(liste: T[], nouveau: T): T[] {
  return [...liste.slice(0, -1), nouveau]
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR')
}

export function useSession(): UseSessionResult {
  const [vue, setVue] = useState<VueSeance>('chargement')
  const [sessionActive, setSessionActive] = useState<SessionActiveState | null>(null)
  const [resumeSeance, setResumeSeance] = useState<ResumeSeance | undefined>(undefined)
  const [undoSnapshot, setUndoSnapshot] = useState<EssaiJoue | null>(null)
  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const niveaux = useMemo<NiveauResume[]>(
    () =>
      listerNiveaux().map((niveau) => ({
        niveau,
        seuil: getSeuil(niveau),
        nombreExercices: listerExercices(niveau).length,
      })),
    [],
  )

  const clearUndo = useCallback(() => {
    if (undoTimerRef.current !== null) {
      clearTimeout(undoTimerRef.current)
      undoTimerRef.current = null
    }
    setUndoSnapshot(null)
  }, [])

  const armerUndo = useCallback(
    (snapshot: EssaiJoue) => {
      if (undoTimerRef.current !== null) {
        clearTimeout(undoTimerRef.current)
      }
      setUndoSnapshot(snapshot)
      undoTimerRef.current = setTimeout(() => {
        undoTimerRef.current = null
        setUndoSnapshot(null)
      }, DELAI_UNDO_MS)
    },
    [],
  )

  useEffect(() => {
    return () => {
      if (undoTimerRef.current !== null) clearTimeout(undoTimerRef.current)
    }
  }, [])

  // Chargement initial : une session non close trouvee en base est la source de verite pour
  // la reprise (AD-4) — jamais l'etat React seul. L'ecran d'atterrissage reste "accueil" (avec
  // bandeau reprise) ; l'utilisateur tape le bandeau pour rentrer dans l'exercice (EXPERIENCE.md,
  // Information Architecture).
  useEffect(() => {
    let annule = false

    async function charger() {
      const session = await repository.getSessionEnCours()
      if (annule) return
      if (!session) {
        setVue('accueil')
        return
      }

      const detail = await repository.getDetailSession(session.id)
      if (annule) return

      if (detail.exercicesJoues.length === 0) {
        // Session creee mais aucun essai jamais enregistre (app tuee entre demarrerSession et
        // le premier enregistrerEssai) : rien a reprendre. Abandon valide ici (clotureLe est
        // null, AD-4) plutot que d'exposer un bandeau reprise vers un ecran vide.
        await repository.abandonnerSession(session.id)
        if (annule) return
        setVue('accueil')
        return
      }

      const exercicesNiveau = listerExercices(session.niveau)
      const essaisParExercice = new Map<string, EssaiJoue[]>()
      for (const exerciceJoue of detail.exercicesJoues) {
        essaisParExercice.set(exerciceJoue.exerciceId, exerciceJoue.essais)
      }

      let exerciceIndex = 0
      exercicesNiveau.forEach((exercice, index) => {
        if (essaisParExercice.has(exercice.id)) exerciceIndex = index
      })

      // Toujours reprendre a l'exercice courant, y compris le dernier du niveau : seule la
      // transition explicite "Exercice suivant" (exerciceSuivant) cloture une session, jamais
      // ce chargement (AD-5 : une cloture ne doit jamais escamoter une chance de jouer).
      const scoresCommis = exercicesNiveau
        .slice(0, exerciceIndex)
        .map((exercice) => calculerScoreExercice(session.niveau, essaisParExercice.get(exercice.id) ?? []))

      setSessionActive({
        sessionId: session.id,
        niveau: session.niveau,
        exercices: exercicesNiveau,
        exerciceIndex,
        scoresCommis,
        essaisCourant: essaisParExercice.get(exercicesNiveau[exerciceIndex].id) ?? [],
      })
      setVue('accueil')
    }

    charger().catch((erreur: unknown) => {
      console.error('useSession: echec du chargement de la session en cours', erreur)
      if (!annule) setVue('accueil')
    })

    return () => {
      annule = true
    }
  }, [])

  const demarrerSession = useCallback(
    (niveau: Niveau) => {
      if (sessionActive) return
      const exercicesNiveau = listerExercices(niveau)
      const premier = exercicesNiveau[0]
      const essaiInitial: EssaiJoue = { index: 1, billesEmpochees: 0, faute: false }
      repository
        .demarrerSession(niveau)
        .then((session) => repository.enregistrerEssai(session.id, premier.id, essaiInitial).then(() => session))
        .then((session) => {
          clearUndo()
          setSessionActive({
            sessionId: session.id,
            niveau,
            exercices: exercicesNiveau,
            exerciceIndex: 0,
            scoresCommis: [],
            essaisCourant: [essaiInitial],
          })
          setVue('exercice')
        })
        .catch((erreur: unknown) => console.error('useSession: echec demarrerSession', erreur))
    },
    [sessionActive, clearUndo],
  )

  const reprendreSession = useCallback(() => {
    if (!sessionActive) return
    setVue('exercice')
  }, [sessionActive])

  const tapBille = useCallback(() => {
    if (!sessionActive) return
    const exercice = sessionActive.exercices[sessionActive.exerciceIndex]
    const dernier = sessionActive.essaisCourant[sessionActive.essaisCourant.length - 1]
    if (!dernier || essaiEstClos(dernier, exercice)) return
    const nouveau: EssaiJoue = { ...dernier, billesEmpochees: dernier.billesEmpochees + 1 }
    repository
      .enregistrerEssai(sessionActive.sessionId, exercice.id, nouveau)
      .then(() => {
        setSessionActive((etat) => (etat ? { ...etat, essaisCourant: remplacerDernier(etat.essaisCourant, nouveau) } : etat))
        armerUndo(dernier)
      })
      .catch((erreur: unknown) => console.error('useSession: echec enregistrerEssai (bille)', erreur))
  }, [sessionActive, armerUndo])

  const tapFaute = useCallback(() => {
    if (!sessionActive) return
    const exercice = sessionActive.exercices[sessionActive.exerciceIndex]
    const dernier = sessionActive.essaisCourant[sessionActive.essaisCourant.length - 1]
    if (!dernier || essaiEstClos(dernier, exercice)) return
    const nouveau: EssaiJoue = { ...dernier, faute: true }
    repository
      .enregistrerEssai(sessionActive.sessionId, exercice.id, nouveau)
      .then(() => {
        setSessionActive((etat) => (etat ? { ...etat, essaisCourant: remplacerDernier(etat.essaisCourant, nouveau) } : etat))
        armerUndo(dernier)
      })
      .catch((erreur: unknown) => console.error('useSession: echec enregistrerEssai (faute)', erreur))
  }, [sessionActive, armerUndo])

  const annulerDernierTap = useCallback(() => {
    if (!sessionActive || !undoSnapshot) return
    const exercice = sessionActive.exercices[sessionActive.exerciceIndex]
    repository
      .enregistrerEssai(sessionActive.sessionId, exercice.id, undoSnapshot)
      .then(() => {
        setSessionActive((etat) => (etat ? { ...etat, essaisCourant: remplacerDernier(etat.essaisCourant, undoSnapshot) } : etat))
        clearUndo()
      })
      .catch((erreur: unknown) => console.error('useSession: echec annulerDernierTap', erreur))
  }, [sessionActive, undoSnapshot, clearUndo])

  const rejouerEssai = useCallback(() => {
    if (!sessionActive) return
    if (sessionActive.essaisCourant.length >= 3) return
    const exercice = sessionActive.exercices[sessionActive.exerciceIndex]
    const dernier = sessionActive.essaisCourant[sessionActive.essaisCourant.length - 1]
    if (!dernier || !essaiEstClos(dernier, exercice)) return
    const meilleur = calculerScoreExercice(sessionActive.niveau, sessionActive.essaisCourant)
    const maximum = plafondProchainEssai(sessionActive.niveau, sessionActive.essaisCourant.length, exercice.nombreBillesSequence)
    if (maximum === null || meilleur >= maximum) return
    const nouveau: EssaiJoue = { index: (sessionActive.essaisCourant.length + 1) as 1 | 2 | 3, billesEmpochees: 0, faute: false }
    repository
      .enregistrerEssai(sessionActive.sessionId, exercice.id, nouveau)
      .then(() => {
        setSessionActive((etat) => (etat ? { ...etat, essaisCourant: [...etat.essaisCourant, nouveau] } : etat))
        clearUndo()
      })
      .catch((erreur: unknown) => console.error('useSession: echec rejouerEssai', erreur))
  }, [sessionActive, clearUndo])

  const exerciceSuivant = useCallback(() => {
    if (!sessionActive) return
    const exercice = sessionActive.exercices[sessionActive.exerciceIndex]
    const dernier = sessionActive.essaisCourant[sessionActive.essaisCourant.length - 1]
    if (!dernier || !essaiEstClos(dernier, exercice)) return

    const scoreRetenu = calculerScoreExercice(sessionActive.niveau, sessionActive.essaisCourant)
    const scoresCommis = [...sessionActive.scoresCommis, scoreRetenu]
    const prochainIndex = sessionActive.exerciceIndex + 1
    clearUndo()

    if (prochainIndex >= sessionActive.exercices.length) {
      repository
        .cloturerSession(sessionActive.sessionId)
        .then((cloturee) => {
          const total = calculerScoreTotal(scoresCommis)
          setResumeSeance({
            niveau: sessionActive.niveau,
            nombreExercices: sessionActive.exercices.length,
            scoreTotal: total,
            seuil: getSeuil(sessionActive.niveau),
            seuilAtteint: estSeuilAtteint(sessionActive.niveau, total),
            date: formatDate(cloturee.clotureLe ?? new Date().toISOString()),
          })
          setSessionActive(null)
          setVue('resume')
        })
        .catch((erreur: unknown) => console.error('useSession: echec cloturerSession', erreur))
      return
    }

    const prochainExercice = sessionActive.exercices[prochainIndex]
    const essaiInitial: EssaiJoue = { index: 1, billesEmpochees: 0, faute: false }
    repository
      .enregistrerEssai(sessionActive.sessionId, prochainExercice.id, essaiInitial)
      .then(() => {
        setSessionActive((etat) =>
          etat ? { ...etat, exerciceIndex: prochainIndex, scoresCommis, essaisCourant: [essaiInitial] } : etat,
        )
      })
      .catch((erreur: unknown) => console.error('useSession: echec exerciceSuivant', erreur))
  }, [sessionActive, clearUndo])

  const abandonner = useCallback(() => {
    if (!sessionActive) return
    repository
      .abandonnerSession(sessionActive.sessionId)
      .then(() => {
        setSessionActive(null)
        clearUndo()
        setResumeSeance(undefined)
        setVue('accueil')
      })
      .catch((erreur: unknown) => console.error('useSession: echec abandonnerSession', erreur))
  }, [sessionActive, clearUndo])

  // Navigation pure (aucun appel repository) : quitter l'ecran Resume une fois la session
  // deja cloturee et affichee — la session n'est plus "en cours" (AD-4/AD-5), rien a persister.
  const retourAccueil = useCallback(() => {
    setResumeSeance(undefined)
    setVue('accueil')
  }, [])

  const reprise: ReprisePossible | null =
    sessionActive && vue === 'accueil'
      ? { niveau: sessionActive.niveau, exerciceIndex: sessionActive.exerciceIndex, nombreExercices: sessionActive.exercices.length }
      : null

  const exerciceEnCours: ExerciceEnCoursVue | undefined = useMemo(() => {
    if (!sessionActive || vue !== 'exercice') return undefined
    const exercice = sessionActive.exercices[sessionActive.exerciceIndex]
    const figure = getFigure(exercice.figureId)
    if (!figure) return undefined
    const dernier = sessionActive.essaisCourant[sessionActive.essaisCourant.length - 1]
    if (!dernier) return undefined
    const essaiCourant = versAffichage(dernier, sessionActive.niveau, exercice)
    const scoreExerciceRetenu = calculerScoreExercice(sessionActive.niveau, sessionActive.essaisCourant)
    const maximum = plafondProchainEssai(sessionActive.niveau, sessionActive.essaisCourant.length, exercice.nombreBillesSequence)
    return {
      exercice,
      figure,
      niveau: sessionActive.niveau,
      numero: sessionActive.exerciceIndex + 1,
      nombreExercices: sessionActive.exercices.length,
      essaiCourant,
      essaiClos: essaiCourant.clos,
      nombreEssaisJoues: sessionActive.essaisCourant.length,
      scoreExerciceRetenu,
      peutRejouer: essaiCourant.clos && maximum !== null && scoreExerciceRetenu < maximum,
      scoreTotal: calculerScoreTotal(sessionActive.scoresCommis),
      seuil: getSeuil(sessionActive.niveau),
    }
  }, [sessionActive, vue])

  return {
    vue,
    niveaux,
    reprise,
    exerciceEnCours,
    resumeSeance,
    undoVisible: undoSnapshot !== null,
    demarrerSession,
    reprendreSession,
    tapBille,
    tapFaute,
    rejouerEssai,
    exerciceSuivant,
    annulerDernierTap,
    abandonner,
    retourAccueil,
  }
}
