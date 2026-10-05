#!/usr/bin/env node
// Garde-fou pour la derivation pure des Stats (application/stats/deriver.ts) : indice de
// difficulte par exercice (D4), fenetre de 10 seances (D5), ponderation lineaire de la
// recence, seuil minimal de 3 seances, "a tenter" (D7), progression (D8). Node natif
// (assert), meme convention que verify-historique.mjs. Usage : npm run verify-stats.
// Cf experiments/blackball-stats-salle/DECISIONS.md.

import assert from 'node:assert/strict'
import { listerExercices } from '../src/domain/catalog/index.ts'
import {
  difficulteExercice,
  calculerStatsNiveau,
  pointsFaibles,
  progression,
} from '../src/application/stats/deriver.ts'

const ex = listerExercices('bronze')
const [A, B, C] = ex // trois exercices bronze du catalogue
const n = (e) => e.nombreBillesSequence

// essai reussi / rate sur un exercice donne
const ok = (e, index) => ({ index, billesEmpochees: n(e), faute: false })
const ko = (e, index) => ({ index, billesEmpochees: 0, faute: true })

// seance : date = jour du mois (ISO), exercices = [[exercice, essais], ...]
const seance = (id, jour, niveau, exercices) => ({
  id,
  niveau,
  demarreeLe: `2026-09-${String(jour).padStart(2, '0')}T10:00:00.000Z`,
  exercicesJoues: exercices.map(([e, essais]) => ({ exerciceId: e.id, essais })),
})

try {
  // --- difficulteExercice (D4) : 0 = essai 1, 1 = essai 2, 2 = essai 3, 3 = echec, null = non joue
  assert.equal(difficulteExercice(n(A), [ok(A, 1)]), 0, 'reussi essai 1 -> 0')
  assert.equal(difficulteExercice(n(A), [ko(A, 1), ok(A, 2)]), 1, 'reussi essai 2 -> 1')
  assert.equal(difficulteExercice(n(A), [ko(A, 1), ko(A, 2), ok(A, 3)]), 2, 'reussi essai 3 -> 2')
  assert.equal(difficulteExercice(n(A), [ko(A, 1), ko(A, 2), ko(A, 3)]), 3, '3 echecs -> 3')
  assert.equal(difficulteExercice(n(A), [ko(A, 1)]), 3, 'essais joues sans reussite -> 3')
  assert.equal(difficulteExercice(n(A), []), null, 'aucun essai -> non joue')
  // essais fournis dans le desordre : on se fie a `index`, pas a l'ordre du tableau
  assert.equal(difficulteExercice(n(A), [ok(A, 2), ko(A, 1)]), 1, 'ordre du tableau ignore')

  // --- calculerStatsNiveau : exercice jamais joue -> "a-tenter", aucun indice
  let stats = calculerStatsNiveau('bronze', [])
  assert.equal(stats.length, ex.length, 'une entree par exercice du catalogue (ordre canonique)')
  assert.equal(stats[0].exerciceId, A.id)
  assert.ok(stats.every((s) => s.statut === 'a-tenter' && s.indice === null && s.nbSeances === 0), 'tout a-tenter sans seance')

  // --- seuil minimal : < 3 seances jouees -> "insuffisant", indice null, nbSeances renseigne
  stats = calculerStatsNiveau('bronze', [seance('s1', 1, 'bronze', [[A, [ok(A, 1)]]]), seance('s2', 2, 'bronze', [[A, [ko(A, 1), ok(A, 2)]]])])
  let a = stats.find((s) => s.exerciceId === A.id)
  assert.deepEqual([a.statut, a.indice, a.nbSeances], ['insuffisant', null, 2], '2 seances -> insuffisant')

  // --- ponderation lineaire : 3 seances, poids 3 (recente) / 2 / 1 (ancienne)
  // difficultes : s3 (recente)=3, s2=0, s1 (ancienne)=0  -> (3*3 + 2*0 + 1*0) / 6 = 1.5
  stats = calculerStatsNiveau('bronze', [
    seance('s1', 1, 'bronze', [[A, [ok(A, 1)]]]),
    seance('s2', 2, 'bronze', [[A, [ok(A, 1)]]]),
    seance('s3', 3, 'bronze', [[A, [ko(A, 1), ko(A, 2), ko(A, 3)]]]),
  ])
  a = stats.find((s) => s.exerciceId === A.id)
  assert.equal(a.statut, 'mesure')
  assert.equal(a.indice, 1.5, 'moyenne ponderee, recence lineaire')
  // l'ordre des seances fournies ne compte pas (tri par demarreeLe)
  const melange = calculerStatsNiveau('bronze', [
    seance('s3', 3, 'bronze', [[A, [ko(A, 1), ko(A, 2), ko(A, 3)]]]),
    seance('s1', 1, 'bronze', [[A, [ok(A, 1)]]]),
    seance('s2', 2, 'bronze', [[A, [ok(A, 1)]]]),
  ])
  assert.equal(melange.find((s) => s.exerciceId === A.id).indice, 1.5, 'tri par date, pas par ordre fourni')

  // --- fenetre de 10 : la 11e seance (la plus ancienne) est ignoree
  const onze = Array.from({ length: 11 }, (_, i) => seance(`s${i + 1}`, i + 1, 'bronze', [[A, [i === 0 ? ko(A, 1) : ok(A, 1)]]]))
  stats = calculerStatsNiveau('bronze', onze)
  a = stats.find((s) => s.exerciceId === A.id)
  assert.equal(a.indice, 0, 'echec de la 11e seance (hors fenetre) ignore')
  assert.equal(a.nbSeances, 10, 'nbSeances borne a la fenetre')

  // --- filtre par niveau : une seance d'un autre niveau n'entre pas dans les stats
  stats = calculerStatsNiveau('bronze', [seance('x', 1, 'argent', [[A, [ok(A, 1)]]])])
  assert.equal(stats.find((s) => s.exerciceId === A.id).nbSeances, 0, 'autre niveau ignore')

  // --- un exercice non joue dans une seance ne compte ni en poids ni en difficulte
  stats = calculerStatsNiveau('bronze', [
    seance('s1', 1, 'bronze', [[A, [ok(A, 1)]]]),
    seance('s2', 2, 'bronze', [[B, [ok(B, 1)]]]),
    seance('s3', 3, 'bronze', [[A, [ko(A, 1), ok(A, 2)]]]),
    seance('s4', 4, 'bronze', [[A, [ko(A, 1), ok(A, 2)]]]),
  ])
  a = stats.find((s) => s.exerciceId === A.id)
  assert.equal(a.nbSeances, 3, 'A joue dans 3 seances sur 4')

  // --- pointsFaibles : mesures uniquement, tri par indice decroissant, borne a `max`
  const trois = (e, essaisParSeance) => essaisParSeance.map((essais, i) => seance(`${e.id}-${i}`, i + 1, 'bronze', [[e, essais]]))
  const facile = trois(A, [[ok(A, 1)], [ok(A, 1)], [ok(A, 1)]])
  const dur = trois(B, [[ko(B, 1), ko(B, 2), ko(B, 3)], [ko(B, 1), ko(B, 2), ko(B, 3)], [ko(B, 1), ko(B, 2), ko(B, 3)]])
  const moyen = trois(C, [[ko(C, 1), ok(C, 2)], [ko(C, 1), ok(C, 2)], [ko(C, 1), ok(C, 2)]])
  // fusionne les seances de meme jour pour que chaque exercice ait 3 seances
  const fusion = [1, 2, 3].map((j) =>
    seance(`m${j}`, j, 'bronze', [
      [A, facile[j - 1].exercicesJoues[0].essais],
      [B, dur[j - 1].exercicesJoues[0].essais],
      [C, moyen[j - 1].exercicesJoues[0].essais],
    ]),
  )
  stats = calculerStatsNiveau('bronze', fusion)
  let faibles = pointsFaibles(stats, 5)
  assert.deepEqual(faibles.map((s) => s.exerciceId), [B.id, C.id, A.id], 'tri par indice decroissant')
  assert.equal(pointsFaibles(stats, 2).length, 2, 'borne a max')
  assert.ok(pointsFaibles(stats, 5).every((s) => s.statut === 'mesure'), 'seulement des exercices mesures')

  // --- progression (D8) : moyenne des difficultes des exercices joues, par seance, ordre chronologique
  const prog = progression('bronze', fusion)
  assert.equal(prog.length, 3)
  assert.deepEqual(prog.map((p) => p.sessionId), ['m1', 'm2', 'm3'], 'ordre chronologique')
  assert.equal(prog[0].moyenne, (0 + 3 + 1) / 3, 'moyenne simple des difficultes de la seance')
  assert.equal(progression('bronze', []).length, 0, 'aucune seance -> courbe vide')

  console.log('verify-stats: OK')
} catch (erreur) {
  console.error('verify-stats: ECHEC')
  console.error(erreur)
  process.exit(1)
}
