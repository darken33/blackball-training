#!/usr/bin/env node
// Garde-fou pour la derivation pure de l'Historique (application/historique/deriver.ts) :
// ordre canonique, repli "non joue", texte d'essai. Node natif (assert), aucune nouvelle
// dependance — meme convention que verify-catalog.mjs/verify-scoring.mjs. Usage :
// npm run verify-historique.
//
// deriver.ts n'importe adapters/persistence/repository qu'en `import type` (efface a la
// compilation) : resoluble par le meme `node --experimental-strip-types` nu que
// domain/scoring et domain/catalog (aucune dependance Dexie/React a l'execution, AD-6).

import assert from 'node:assert/strict'
import { listerExercices } from '../src/domain/catalog/index.ts'
import {
  construireExerciceDetail,
  formatDate,
  formatEssaiTexte,
  scoresParExerciceCanonique,
} from '../src/application/historique/deriver.ts'

try {
  // formatDate : meme motif que useSession.ts:87 (toLocaleDateString('fr-FR')).
  assert.equal(formatDate('2026-09-05T10:00:00.000Z'), new Date('2026-09-05T10:00:00.000Z').toLocaleDateString('fr-FR'))

  // formatEssaiTexte : borne billesEmpochees === nombreBillesSequence -> reussi, sinon rate.
  assert.equal(formatEssaiTexte(1, 1), '1/1 bille — réussi', 'sequence complete -> reussi')
  assert.equal(formatEssaiTexte(0, 1), '0/1 bille — raté', 'faute sans bille -> rate')
  assert.equal(formatEssaiTexte(1, 3), '1/3 bille — raté', 'sequence incomplete (faute) -> rate')
  assert.equal(formatEssaiTexte(3, 3), '3/3 billes — réussi', 'pluriel a partir de 2 billes empochees')

  // construireExerciceDetail : exercice sans essai valide -> 0 pt, "non joue" x3 (convention
  // architecture "Erreurs/bords" — jamais d'exception bloquante).
  const bronzeA1 = listerExercices('bronze').find((exercice) => exercice.id === 'bronze-a-1')
  assert.ok(bronzeA1, 'exercice bronze-a-1 introuvable dans le catalogue')
  const sansEssai = construireExerciceDetail('bronze', bronzeA1, [])
  assert.equal(sansEssai.scoreExercice, 0, 'aucun essai joue -> 0 pt')
  assert.deepEqual(
    sansEssai.essais.map((essai) => essai.texte),
    ['non joué', 'non joué', 'non joué'],
    'aucun essai joue -> "non joue" x3',
  )
  assert.equal(sansEssai.nom, 'Figure A1', 'nom Bronze conserve le numero')

  // Essai 1 rate, essai 2 reussi, essai 3 jamais joue -> score retenu = meilleur essai (FR-5),
  // essai 3 replie sur "non joue" (mockup historique.html, Figure C1).
  const partiel = construireExerciceDetail('bronze', bronzeA1, [
    { index: 1, billesEmpochees: 0, faute: true },
    { index: 2, billesEmpochees: 1, faute: false },
  ])
  assert.equal(partiel.scoreExercice, 3, 'meilleur essai retenu (essai 2, Bronze bareme 5/3/2)')
  assert.deepEqual(
    partiel.essais.map((essai) => essai.texte),
    ['0/1 bille — raté', '1/1 bille — réussi', 'non joué'],
    'essai 3 jamais enregistre -> "non joue"',
  )

  // scoresParExerciceCanonique : ordre = listerExercices(niveau), pas l'ordre brut de
  // getDetailSession (non garanti) — recale par exerciceId, quel que soit l'ordre d'entree.
  const argentExercices = listerExercices('argent')
  assert.ok(argentExercices.length >= 2, 'catalogue Argent attendu >= 2 exercices')
  const [premier, second] = argentExercices
  const scoresDansLeDesordre = scoresParExerciceCanonique('argent', [
    { exerciceId: second.id, essais: [{ index: 1, billesEmpochees: 1, faute: false }] },
    { exerciceId: premier.id, essais: [{ index: 1, billesEmpochees: 3, faute: false }] },
  ])
  assert.equal(scoresDansLeDesordre.length, argentExercices.length, 'un score par exercice du niveau')
  assert.equal(scoresDansLeDesordre[0], 12, 'premier exercice catalogue (pas premier de exercicesJoues) -> 3 billes = 12 pts')
  assert.equal(scoresDansLeDesordre[1], 4, 'second exercice catalogue -> 1 bille = 4 pts')

  // Exercice du catalogue absent de exercicesJoues -> 0 pt (recouvre "Erreurs/bords").
  const scoresIncomplets = scoresParExerciceCanonique('argent', [
    { exerciceId: premier.id, essais: [{ index: 1, billesEmpochees: 1, faute: false }] },
  ])
  assert.equal(scoresIncomplets[1], 0, 'exercice sans entree dans exercicesJoues -> 0 pt')

  console.log('verify-historique: OK (ordre canonique, repli "non joue", texte essai, meilleur essai retenu).')
} catch (error) {
  console.error(`verify-historique: ECHEC — ${error instanceof Error ? error.message : String(error)}`)
  process.exitCode = 1
}
