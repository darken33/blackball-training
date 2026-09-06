// Repository Contract (ARCHITECTURE-SPINE.md) : seul point d'acces a Dexie (AD-6). Exactement
// ces 7 methodes, aucune methode generique update/delete au-dela. Les retours sont des Promise
// (IndexedDB est asynchrone par nature) mais la forme et le nombre des methodes sont ceux du
// contrat. AD-1 : seuls des faits bruts par essai sont ecrits, jamais un score. AD-4/AD-5 :
// seule `abandonnerSession` supprime, et seulement une session dont `clotureLe` est null ;
// aucune ecriture n'est acceptee sur une session close.

import { db, type EssaiRow } from './db'
import type { Niveau } from '../../domain/catalog/types'

export interface Session {
  id: string
  niveau: Niveau
  demarreeLe: string
  clotureLe: string | null
}

export interface EssaiEnregistre {
  index: 1 | 2 | 3
  billesEmpochees: number
  faute: boolean
}

export interface ExerciceJoueDetail {
  exerciceId: string
  essais: EssaiEnregistre[]
}

export interface SessionDetail {
  session: Session
  exercicesJoues: ExerciceJoueDetail[]
}

function nouvelId(): string {
  return crypto.randomUUID()
}

function versSession(row: { id: string; niveau: Niveau; demarreeLe: string; clotureLe: string | null }): Session {
  return { id: row.id, niveau: row.niveau, demarreeLe: row.demarreeLe, clotureLe: row.clotureLe }
}

function versEssaiEnregistre(row: EssaiRow): EssaiEnregistre {
  return { index: row.index, billesEmpochees: row.billesEmpochees, faute: row.faute }
}

/** Session en cours (`clotureLe` null), s'il en existe une — source de verite pour la reprise. */
export async function getSessionEnCours(): Promise<Session | null> {
  const row = await db.sessions.filter((s) => s.clotureLe === null).first()
  return row ? versSession(row) : null
}

/** Demarre une nouvelle session au niveau donne. N'echoue pas si une autre session en cours
 * existe deja — c'est a l'appelant (application/session) de ne jamais demarrer par-dessus
 * une session en cours (le bandeau reprise existe precisement pour eviter ce cas). */
export async function demarrerSession(niveau: Niveau): Promise<Session> {
  const row = {
    id: nouvelId(),
    niveau,
    demarreeLe: new Date().toISOString(),
    clotureLe: null,
  }
  await db.sessions.add(row)
  return versSession(row)
}

/** Ecrit immediatement le fait brut d'un essai (AD-3). Upsert par (sessionId, exerciceId, index) :
 * un meme index rappele met a jour l'essai en cours (ex. bille supplementaire empochee),
 * un nouvel index demarre un nouvel essai (nouvelle tentative). */
export async function enregistrerEssai(
  sessionId: string,
  exerciceId: string,
  essai: EssaiEnregistre,
): Promise<void> {
  await db.transaction('rw', db.sessions, db.exercicesJoues, db.essais, async () => {
    const session = await db.sessions.get(sessionId)
    if (!session) {
      throw new Error(`enregistrerEssai: session ${sessionId} introuvable`)
    }
    if (session.clotureLe !== null) {
      throw new Error('enregistrerEssai: session cloturee, immuable (AD-5)')
    }

    let exerciceJoue = await db.exercicesJoues.where('[sessionId+exerciceId]').equals([sessionId, exerciceId]).first()
    if (!exerciceJoue) {
      exerciceJoue = { id: nouvelId(), sessionId, exerciceId }
      await db.exercicesJoues.add(exerciceJoue)
    }

    const existant = await db.essais
      .where('[exerciceJoueId+index]')
      .equals([exerciceJoue.id, essai.index])
      .first()

    if (existant) {
      await db.essais.update(existant.id, {
        billesEmpochees: essai.billesEmpochees,
        faute: essai.faute,
      })
    } else {
      await db.essais.add({
        id: nouvelId(),
        exerciceJoueId: exerciceJoue.id,
        index: essai.index,
        billesEmpochees: essai.billesEmpochees,
        faute: essai.faute,
      })
    }
  })
}

/** Pose `clotureLe` — seule transition qui rend la session immuable (AD-5). */
export async function cloturerSession(sessionId: string): Promise<Session> {
  return db.transaction('rw', db.sessions, async () => {
    const session = await db.sessions.get(sessionId)
    if (!session) {
      throw new Error(`cloturerSession: session ${sessionId} introuvable`)
    }
    if (session.clotureLe !== null) {
      throw new Error('cloturerSession: session deja cloturee (AD-5)')
    }
    const clotureLe = new Date().toISOString()
    await db.sessions.update(sessionId, { clotureLe })
    return versSession({ ...session, clotureLe })
  })
}

/** Supprime la session et ses enfants ; valide uniquement si `clotureLe` est null (AD-4, AD-5). */
export async function abandonnerSession(sessionId: string): Promise<void> {
  await db.transaction('rw', db.sessions, db.exercicesJoues, db.essais, async () => {
    const session = await db.sessions.get(sessionId)
    if (!session) {
      return
    }
    if (session.clotureLe !== null) {
      throw new Error('abandonnerSession: une session cloturee ne peut pas etre abandonnee (AD-4/AD-5)')
    }
    const exercicesJoues = await db.exercicesJoues.where('sessionId').equals(sessionId).toArray()
    const exerciceJoueIds = exercicesJoues.map((e) => e.id)
    if (exerciceJoueIds.length > 0) {
      await db.essais.where('exerciceJoueId').anyOf(exerciceJoueIds).delete()
    }
    await db.exercicesJoues.where('sessionId').equals(sessionId).delete()
    await db.sessions.delete(sessionId)
  })
}

/** Sessions terminees uniquement (`clotureLe` non-null), triees de la plus recente a la plus
 * ancienne (FR-9). */
export async function listerSessionsTerminees(): Promise<Session[]> {
  const rows = await db.sessions.filter((s) => s.clotureLe !== null).toArray()
  return rows
    .slice()
    .sort((a, b) => (b.clotureLe ?? '').localeCompare(a.clotureLe ?? ''))
    .map(versSession)
}

/** Session + exercices joues + essais, essais tries par index croissant (FR-10). */
export async function getDetailSession(sessionId: string): Promise<SessionDetail> {
  const session = await db.sessions.get(sessionId)
  if (!session) {
    throw new Error(`getDetailSession: session ${sessionId} introuvable`)
  }
  const exercicesJoues = await db.exercicesJoues.where('sessionId').equals(sessionId).toArray()
  const detail: ExerciceJoueDetail[] = []
  for (const exerciceJoue of exercicesJoues) {
    const essais = await db.essais.where('exerciceJoueId').equals(exerciceJoue.id).sortBy('index')
    detail.push({ exerciceId: exerciceJoue.exerciceId, essais: essais.map(versEssaiEnregistre) })
  }
  return { session: versSession(session), exercicesJoues: detail }
}
