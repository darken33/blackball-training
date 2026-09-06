// Schema Dexie (IndexedDB). Cf ARCHITECTURE-SPINE.md, ER diagrams (Session / ExerciceJoue / Essai)
// et Structural Seed. Aucune logique metier ici (AD-6) : uniquement la definition des tables et
// des types de lignes persistees. Seul `repository.ts` interroge cette base (adapters/ui
// n'importe jamais adapters/persistence directement).

import Dexie, { type EntityTable } from 'dexie'
import type { Niveau } from '../../domain/catalog/types'

/** Ligne SESSION (ER diagram) : `clotureLe` null = en cours (AD-5, statut derive jamais stocke). */
export interface SessionRow {
  id: string
  niveau: Niveau
  demarreeLe: string
  clotureLe: string | null
}

/** Ligne EXERCICE_JOUE (ER diagram) : associe une session a un exercice du catalogue. */
export interface ExerciceJoueRow {
  id: string
  sessionId: string
  exerciceId: string
}

/** Ligne ESSAI (ER diagram) : fait brut, jamais un score pre-calcule (AD-1). */
export interface EssaiRow {
  id: string
  exerciceJoueId: string
  index: 1 | 2 | 3
  billesEmpochees: number
  faute: boolean
}

export class BlackballDb extends Dexie {
  sessions!: EntityTable<SessionRow, 'id'>
  exercicesJoues!: EntityTable<ExerciceJoueRow, 'id'>
  essais!: EntityTable<EssaiRow, 'id'>

  constructor() {
    super('blackball-training')
    this.version(1).stores({
      sessions: 'id, clotureLe',
      exercicesJoues: 'id, sessionId, [sessionId+exerciceId]',
      essais: 'id, exerciceJoueId, [exerciceJoueId+index]',
    })
  }
}

export const db = new BlackballDb()
