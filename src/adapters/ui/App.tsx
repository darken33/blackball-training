import { useState } from 'react'
import './App.css'
import { useSession } from '../../application/session'
import { Accueil } from './accueil/Accueil'
import { Exercice } from './exercice/Exercice'
import { ScoreBar } from './exercice/ScoreBar'
import { Resume } from './resume/Resume'
import { Historique } from './historique/Historique'

// Shell de navigation a 2 onglets (Seance/Historique, EXPERIENCE.md) — remplace le harnais
// temporaire FR-1/FR-2. Assemble les 3 ecrans de la Seance (Accueil/Exercice/Resume) au-dessus
// de `application/session`, seul point d'acces a la persistance (AD-6).

type Onglet = 'seance' | 'historique'

function App() {
  const [onglet, setOnglet] = useState<Onglet>('seance')
  const session = useSession()

  return (
    <div className="app-shell">
      <main className="app-content">
        {onglet === 'historique' && <Historique />}

        {onglet === 'seance' && session.vue === 'chargement' && <p className="chargement">Chargement…</p>}

        {onglet === 'seance' && session.vue === 'accueil' && (
          <Accueil
            niveaux={session.niveaux}
            reprise={session.reprise}
            onChoisirNiveau={session.demarrerSession}
            onReprendre={session.reprendreSession}
            onAbandonner={session.abandonner}
          />
        )}

        {onglet === 'seance' && session.vue === 'exercice' && session.exerciceEnCours && (
          <Exercice
            donnees={session.exerciceEnCours}
            undoVisible={session.undoVisible}
            onTapBille={session.tapBille}
            onTapFaute={session.tapFaute}
            onAnnulerTap={session.annulerDernierTap}
            onRejouer={session.rejouerEssai}
            onSuivant={session.exerciceSuivant}
            onAbandonner={session.abandonner}
          />
        )}

        {onglet === 'seance' && session.vue === 'resume' && session.resumeSeance && (
          <Resume donnees={session.resumeSeance} onRetourAccueil={session.retourAccueil} />
        )}
      </main>

      {onglet === 'seance' && session.vue === 'exercice' && session.exerciceEnCours && (
        <div className="score-bar-wrapper">
          <ScoreBar
            niveau={session.exerciceEnCours.niveau}
            scoreTotal={session.exerciceEnCours.scoreTotal}
            seuil={session.exerciceEnCours.seuil}
          />
        </div>
      )}

      <nav className="tabbar">
        <button type="button" className={onglet === 'seance' ? 'tab active' : 'tab'} onClick={() => setOnglet('seance')}>
          Séance
        </button>
        <button type="button" className={onglet === 'historique' ? 'tab active' : 'tab'} onClick={() => setOnglet('historique')}>
          Historique
        </button>
      </nav>
    </div>
  )
}

export default App
