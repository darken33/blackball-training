import { useEffect, useState } from 'react'
import titre from '../../../assets/titre.jpg'
import './SplashScreen.css'

// Ecran titre au demarrage : affiche la maquette gfx/titre.png (copiee en src/assets/titre.jpg,
// recompressee — 164 Ko vs 645 Ko d'origine, aucune perte visible a la taille affichee — et
// extension corrigee, contenu reel JPEG, pour rester precachee hors-ligne, cf vite.config.ts
// workbox.globPatterns) pendant une duree fixe, en superposition au shell applicatif. Purement
// decoratif, aucune interaction (hors perimetre de l'Accessibility Floor, EXPERIENCE.md, qui ne
// couvre que la saisie d'essai).
//
// Le compte a rebours ne demarre qu'une fois l'image chargee (onLoad) ou en echec (onError) —
// jamais des le montage — pour ne jamais masquer l'ecran titre avant que l'image ne soit
// visible (reseau lent/degrade en salle sans Wi-Fi fiable, NFR hors-ligne). Un echec de
// chargement demarre quand meme le compte a rebours (repli), pour ne jamais bloquer l'app.

const DUREE_SPLASH_MS = 3000

export function SplashScreen() {
  const [visible, setVisible] = useState(true)
  const [chargee, setChargee] = useState(false)

  useEffect(() => {
    if (!chargee) return
    const minuteur = setTimeout(() => setVisible(false), DUREE_SPLASH_MS)
    return () => clearTimeout(minuteur)
  }, [chargee])

  if (!visible) return null

  return (
    <div className="splash-screen" aria-hidden="true">
      <img src={titre} alt="" onLoad={() => setChargee(true)} onError={() => setChargee(true)} />
    </div>
  )
}
