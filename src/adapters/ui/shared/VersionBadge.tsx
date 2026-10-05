import './VersionBadge.css'

// Version de l'app (source unique : package.json, injectee a la build via __APP_VERSION__),
// affichee en haut a droite, en miroir du titre d'ecran. Posee une seule fois dans le shell.
export function VersionBadge() {
  return <span className="version-badge">v{__APP_VERSION__}</span>
}
