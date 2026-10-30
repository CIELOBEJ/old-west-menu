import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: 'auto',

      manifest: false,

      workbox: {
        navigateFallback: '/index.html',
        cleanupOutdatedCaches: true,
        clientsClaim: false,
        skipWaiting: false,
      },
    }),
  ],
})