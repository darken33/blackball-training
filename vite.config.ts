import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Chemin de deploiement reel (sous-chemin GitHub Pages du repo darken33/blackball-training).
// AD-7 : start_url/scope du manifest PWA doivent en deriver, jamais etre codes en dur
// separement ni valoir un chemin absolu "/".
const base = '/blackball-training/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'Carnet de Score Blackball',
        short_name: 'Blackball',
        description:
          "Carnet de score hors-ligne pour l'entrainement au billard Blackball (DFA).",
        start_url: base,
        scope: base,
        display: 'standalone',
        background_color: '#111827',
        theme_color: '#111827',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        // Precache tous les assets buildes pour une disponibilite 100% hors-ligne.
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webmanifest}'],
      },
    }),
  ],
})
