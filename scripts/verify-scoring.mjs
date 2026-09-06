#!/usr/bin/env node
// Garde-fou pour le moteur de notation (domain/scoring) : rejoue les exemples officiels
// du reglement (PRD/addendum) contre l'implementation. Node natif (assert), aucune
// nouvelle dependance. Usage : npm run verify-scoring

import assert from 'node:assert/strict'
import {
  calculerScoreEssai,
  calculerScoreExercice,
  calculerScoreTotal,
  estSeuilAtteint,
  getSeuil,
} from '../src/domain/scoring/index.ts'

try {
  // Bronze : bareme 5/3/2, 1 bille par exercice.
  assert.equal(calculerScoreEssai('bronze', 1, 1), 5, 'Bronze essai 1, 1 bille -> 5 pts')
  assert.equal(calculerScoreEssai('bronze', 2, 1), 3, 'Bronze essai 2, 1 bille -> 3 pts')
  assert.equal(calculerScoreEssai('bronze', 3, 1), 2, 'Bronze essai 3, 1 bille -> 2 pts')
  assert.equal(calculerScoreEssai('bronze', 1, 0), 0, 'Bronze essai rate (0 bille) -> 0 pts')

  // Exemple officiel confirme (addendum.md) : Argent/Or, 3 billes empochees au 1er essai = 12 pts.
  assert.equal(calculerScoreEssai('argent', 1, 3), 12, 'Argent essai 1, 3 billes -> 12 pts (exemple officiel)')
  assert.equal(calculerScoreEssai('or', 1, 3), 12, 'Or essai 1, 3 billes -> 12 pts')

  // Bareme complet des 3 essais, Argent/Or (glossaire PRD §3 : 4/3/2,5).
  for (const niveau of ['argent', 'or']) {
    assert.equal(calculerScoreEssai(niveau, 1, 1), 4, `${niveau} essai 1, 1 bille -> 4 pts`)
    assert.equal(calculerScoreEssai(niveau, 2, 1), 3, `${niveau} essai 2, 1 bille -> 3 pts`)
    assert.equal(calculerScoreEssai(niveau, 3, 1), 2.5, `${niveau} essai 3, 1 bille -> 2,5 pts`)
  }

  // Exemple officiel worked (PRD p.45, row A) : essai1 1 bille (4 pts), essai2 2 billes (6 pts) -> meilleur = 6.
  assert.equal(
    calculerScoreExercice('argent', [{ billesEmpochees: 1 }, { billesEmpochees: 2 }]),
    6,
    "meilleur essai retenu (FR-5) : 6 pts, pas 4+6=10",
  )

  // Cas complet a 3 essais : le meilleur (2e essai ici) est retenu, pas le dernier joue.
  assert.equal(
    calculerScoreExercice('bronze', [{ billesEmpochees: 0 }, { billesEmpochees: 1 }, { billesEmpochees: 0 }]),
    3,
    '3 essais joues, seul le 2e reussit -> 3 pts (essai 2), pas 0',
  )

  // Aucun essai joue -> score exercice = 0, jamais une erreur (convention architecture "Erreurs/bords").
  assert.equal(calculerScoreExercice('bronze', []), 0, 'aucun essai joue -> 0 pts')

  // Plus de 3 essais (FR-4/FR-5 : "jusqu'a 3 essais") -> erreur explicite, jamais un NaN silencieux.
  assert.throws(
    () => calculerScoreExercice('bronze', [{ billesEmpochees: 1 }, { billesEmpochees: 1 }, { billesEmpochees: 1 }, { billesEmpochees: 1 }]),
    /3 essais maximum/,
    '4 essais -> doit lever une erreur, pas ignorer silencieusement le 4e',
  )

  // Score total + seuil : 20 exercices Bronze reussis au 1er essai = 100/100, seuil (50) atteint.
  const scoresBronzeParfait = Array.from({ length: 20 }, () => calculerScoreExercice('bronze', [{ billesEmpochees: 1 }]))
  const totalBronzeParfait = calculerScoreTotal(scoresBronzeParfait)
  assert.equal(totalBronzeParfait, 100, 'total Bronze parfait (20x5) = 100')
  assert.equal(estSeuilAtteint('bronze', totalBronzeParfait), true, '100 >= seuil Bronze (50)')
  assert.equal(estSeuilAtteint('bronze', 49), false, '49 < seuil Bronze (50)')

  // Seuils exacts (glossaire PRD §3).
  assert.equal(getSeuil('bronze'), 50)
  assert.equal(getSeuil('argent'), 60)
  assert.equal(getSeuil('or'), 70)

  console.log('verify-scoring: OK (bareme Bronze/Argent/Or, meilleur essai retenu, total vs seuil).')
} catch (error) {
  console.error(`verify-scoring: ECHEC — ${error instanceof Error ? error.message : String(error)}`)
  process.exitCode = 1
}
