import { listerNiveaux } from '../../../domain/catalog'
import { useStats } from '../../../application/stats'
import type { ExerciceStat, PointProgression } from '../../../application/stats'
import { LIBELLE_NIVEAU } from '../shared/labels'
import './Stats.css'

// Onglet Stats (D6-D8, experiments/blackball-stats-salle) : "est-ce que je progresse" et
// "quels exercices me posent probleme". Indicateur d'entrainement, distinct du score F.F.B.
// Echelle de l'indice : 0 = maitrise, 3 = problematique.

const INDICE_MAX = 3

const NIVEAUX_ECHELLE = [
  { valeur: 0, libelle: 'Maîtrisé' },
  { valeur: 1, libelle: 'Fragile' },
  { valeur: 2, libelle: 'Limite' },
  { valeur: 3, libelle: 'Problème' },
]

const formatDateCourte = (iso: string) => new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })

// Echelle verticale 0-3 (0 en bas = maitrise, 3 en haut = probleme) : plus la courbe est
// basse, mieux c'est. Marges gauche (libelles) et bas (dates) dans le viewBox.
function Courbe({ points }: { points: PointProgression[] }) {
  if (points.length < 2) return <p className="stats-note">Au moins 2 séances sont nécessaires pour tracer la progression.</p>
  const gauche = 62
  const droite = 12
  const haut = 12
  const bas = 26
  const largeur = 360
  const hauteur = 190
  const zoneL = largeur - gauche - droite
  const zoneH = hauteur - haut - bas
  const x = (i: number) => gauche + (i / (points.length - 1)) * zoneL
  const y = (m: number) => haut + zoneH - (m / INDICE_MAX) * zoneH
  const trace = points.map((p, i) => `${x(i).toFixed(1)},${y(p.moyenne).toFixed(1)}`).join(' ')
  const dernier = points.length - 1
  return (
    <svg className="stats-courbe" viewBox={`0 0 ${largeur} ${hauteur}`} role="img" aria-label="Difficulté moyenne par séance">
      {NIVEAUX_ECHELLE.map(({ valeur, libelle }) => (
        <g key={valeur}>
          <line x1={gauche} x2={largeur - droite} y1={y(valeur)} y2={y(valeur)} stroke="var(--border-hairline)" strokeWidth="1" strokeDasharray={valeur === 0 ? undefined : '3 4'} />
          <text x={gauche - 6} y={y(valeur)} textAnchor="end" dominantBaseline="middle" fontSize="11" fill="var(--ink-secondary)">
            {libelle}
          </text>
        </g>
      ))}
      <polyline points={trace} fill="none" stroke="var(--accent-primary)" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      {points.map((p, i) => (
        <circle key={p.sessionId} cx={x(i)} cy={y(p.moyenne)} r="4.5" fill="var(--ink-primary)" />
      ))}
      <text x={x(0)} y={hauteur - 8} textAnchor="start" fontSize="11" fill="var(--ink-secondary)">
        {formatDateCourte(points[0].demarreeLe)}
      </text>
      <text x={x(dernier)} y={hauteur - 8} textAnchor="end" fontSize="11" fill="var(--ink-secondary)">
        {formatDateCourte(points[dernier].demarreeLe)}
      </text>
    </svg>
  )
}

function LigneFaible({ stat }: { stat: ExerciceStat }) {
  const indice = stat.indice ?? 0
  return (
    <li className="stats-row">
      <span className="stats-nom">{stat.nom}</span>
      <span className="stats-barre" aria-hidden="true">
        <span style={{ width: `${(indice / INDICE_MAX) * 100}%` }} />
      </span>
      <span className="stats-indice">
        {indice.toFixed(1)} <small>sur {stat.nbSeances} séances</small>
      </span>
    </li>
  )
}

export function Stats() {
  const { chargement, niveau, changerNiveau, aucuneSeance, pointsFaibles, aTenter, insuffisants, progression } = useStats()

  return (
    <div className="stats">
      <span className="screen-title">Stats</span>

      <div className="stats-niveaux" role="tablist">
        {listerNiveaux().map((n) => (
          <button key={n} type="button" role="tab" aria-selected={n === niveau} className={n === niveau ? 'active' : ''} onClick={() => changerNiveau(n)}>
            {LIBELLE_NIVEAU[n]}
          </button>
        ))}
      </div>

      {chargement && <p className="stats-note">Chargement…</p>}
      {!chargement && aucuneSeance && <p className="stats-note">Aucune séance {LIBELLE_NIVEAU[niveau]} terminée pour l'instant.</p>}

      {!chargement && !aucuneSeance && (
        <>
          <h2>Progression</h2>
          <Courbe points={progression} />
          <p className="stats-note">Difficulté moyenne des exercices joués, séance après séance. Plus la courbe descend, mieux c'est.</p>

          <h2>Points faibles</h2>
          {pointsFaibles.length === 0 ? (
            <p className="stats-note">Pas encore assez de séances : un exercice doit être joué au moins 3 fois pour être évalué.</p>
          ) : (
            <ul className="stats-liste">
              {pointsFaibles.map((stat) => (
                <LigneFaible key={stat.exerciceId} stat={stat} />
              ))}
            </ul>
          )}

          {insuffisants.length > 0 && (
            <p className="stats-note">
              Trop peu de séances pour juger : {insuffisants.map((s) => `${s.nom} (${s.nbSeances})`).join(', ')}.
            </p>
          )}
          {aTenter.length > 0 && <p className="stats-note">À tenter (jamais joués) : {aTenter.map((s) => s.nom).join(', ')}.</p>}
        </>
      )}
    </div>
  )
}
