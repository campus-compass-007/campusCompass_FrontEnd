import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'CampusCompass - NWU Potchefstroom Navigation',
        short_name: 'CampusCompass',
        description: 'Navigate North West University Potchefstroom Campus with ease',
        theme_color: '#6c3d91',
        background_color: '#6c3d91',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/app/',
        start_url: '/app',
        icons: [
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.mapbox\.com/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'mapbox-api',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 24 * 60 * 60 // 24 hours
              }
            }
          },
          {
            urlPattern: /^\/app/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'app-pages',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 7 * 24 * 60 * 60 // 7 days
              }
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": "./",
    },
  },
  server: {
    host: true,
    port: 3000,
  }
})
