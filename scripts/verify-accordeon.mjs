#!/usr/bin/env node
// Garde-fou v1.2.0 (spec-v1-2-0-schemas-accordeon.md) : logique pure de l'accordeon a ouverture
// unique (Historique + Stats) et lien exercice -> figure -> schema PNG. Node natif (assert),
// meme convention que verify-stats.mjs. Usage : npm run verify-accordeon.

import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { listerNiveaux, listerExercices } from '../src/domain/catalog/index.ts'
import { basculerOuvert, figureDeExercice } from '../src/adapters/ui/shared/accordeon.ts'

try {
  // --- ouverture unique (comportement 1 et 3)
  assert.equal(basculerOuvert(null, 'argent-f'), 'argent-f', 'tout replie, tap F -> F ouvre')
  assert.equal(basculerOuvert('argent-f', 'argent-g'), 'argent-g', 'F ouvert, tap G -> G remplace F')
  assert.equal(basculerOuvert('argent-g', 'argent-g'), null, 'G ouvert, tap G -> tout replie')

  // --- exercice -> figure -> PNG (comportement 5, Bronze figure partagee, image absente)
  const figuresVues = new Set()
  for (const niveau of listerNiveaux()) {
    for (const exercice of listerExercices(niveau)) {
      const figure = figureDeExercice(exercice.id)
      assert.ok(figure, `${exercice.id} : figure introuvable`)
      assert.equal(figure.id, exercice.figureId, `${exercice.id} : figure.id = figureId`)
      assert.equal(figure.niveau, niveau, `${exercice.id} : niveau de la figure`)
      figuresVues.add(figure.id)
    }
  }
  for (const figureId of figuresVues) {
    assert.ok(existsSync(new URL(`../src/assets/schemas/${figureId}.png`, import.meta.url)), `PNG manquant pour ${figureId}`)
  }
  assert.equal(figureDeExercice('inconnu-x-1'), undefined, 'exercice inconnu -> undefined, pas d\'exception')

  console.log('verify-accordeon : OK')
} catch (erreur) {
  console.error('verify-accordeon : ECHEC')
  console.error(erreur)
  process.exit(1)
}
