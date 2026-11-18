import { useState } from 'react'
import { basculerOuvert } from './accordeon'

/** Etat d'un accordeon a ouverture unique : tout replie au depart (`ouvert = null`). */
export function useAccordeonUnique() {
  const [ouvert, setOuvert] = useState<string | null>(null)
  return {
    ouvert,
    basculer: (id: string) => setOuvert((courant) => basculerOuvert(courant, id)),
    replier: () => setOuvert(null),
  }
}
