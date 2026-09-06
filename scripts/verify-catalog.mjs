#!/usr/bin/env node
// Garde-fou contre une regression de transcription manuelle du catalogue (35 exercices,
// 11 figures partagees en Bronze + 15 figures 1:1 en Argent/Or). Node natif (assert),
// aucune nouvelle dependance. Usage : npm run verify-catalog

import assert from 'node:assert/strict'
import { listerNiveaux, listerExercices, getFigure, formatNomFigure } from '../src/domain/catalog/index.ts'

const VALEUR_PREMIER_ESSAI = { bronze: 5, argent: 4, or: 4 }

function figuresDuNiveau(niveau) {
  const ids = new Set(listerExercices(niveau).map((exercice) => exercice.figureId))
  return [...ids].map((id) => {
    const figure = getFigure(id)
    assert.ok(figure, `Figure introuvable : ${id}`)
    return figure
  })
}

try {
  // Bronze : exactement 20 exercices, tous nombreBillesSequence === 1.
  const bronze = listerExercices('bronze')
  assert.equal(bronze.length, 20, `Bronze doit compter 20 exercices (trouve ${bronze.length})`)
  for (const exercice of bronze) {
    assert.equal(
      exercice.nombreBillesSequence,
      1,
      `${exercice.id} : nombreBillesSequence doit valoir 1 (Bronze = 1 bille par exercice)`,
    )
  }

  // Chaque Figure Bronze : balls[0].couleur === 'blanche' — invariant dont depend
  // silencieusement le label-par-index de TableDiagram (cue ball toujours en position 0).
  for (const figure of figuresDuNiveau('bronze')) {
    assert.equal(
      figure.balls[0]?.couleur,
      'blanche',
      `${figure.id} : balls[0] doit etre la bille blanche (invariant TableDiagram)`,
    )
  }

  // Aucune bille Argent/Or ne porte pocheCible (fleches Bronze uniquement, cf Design Notes).
  for (const niveau of ['argent', 'or']) {
    for (const figure of figuresDuNiveau(niveau)) {
      for (const bille of figure.balls) {
        assert.equal(
          bille.pocheCible,
          undefined,
          `${figure.id} : aucune bille ${niveau} ne doit porter pocheCible (fleches Bronze uniquement)`,
        )
      }
    }
  }

  // or-e / or-f : aucune bille blanche positionnee (zone de replacement libre).
  for (const figureId of ['or-e', 'or-f']) {
    const figure = getFigure(figureId)
    assert.ok(figure, `Figure introuvable : ${figureId}`)
    assert.ok(
      !figure.balls.some((bille) => bille.couleur === 'blanche'),
      `${figureId} : aucune bille blanche ne doit etre positionnee (zone de replacement)`,
    )
  }

  // Σ(nombreBillesSequence) x valeur du 1er essai === 100 pour chaque niveau.
  for (const niveau of listerNiveaux()) {
    const somme = listerExercices(niveau).reduce((acc, exercice) => acc + exercice.nombreBillesSequence, 0)
    const total = somme * VALEUR_PREMIER_ESSAI[niveau]
    assert.equal(total, 100, `${niveau} : total attendu 100 (obtenu ${total} = ${somme} billes x ${VALEUR_PREMIER_ESSAI[niveau]})`)
  }

  // formatNomFigure (Historique, FR-9/FR-10) : numero seulement en Bronze.
  assert.equal(formatNomFigure('bronze', 'bronze-a-2'), 'Figure A2', 'Bronze conserve le numero')
  assert.equal(formatNomFigure('argent', 'argent-a-1'), 'Figure A', 'Argent omet le numero')
  assert.equal(formatNomFigure('or', 'or-c-1'), 'Figure C', 'Or omet le numero')

  console.log('verify-catalog: OK (35 exercices, Bronze 20x1 bille, totaux Bronze/Argent/Or = 100/100/100).')
} catch (error) {
  console.error(`verify-catalog: ECHEC — ${error instanceof Error ? error.message : String(error)}`)
  process.exitCode = 1
}
