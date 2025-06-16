import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'ニッポンニュース',
        short_name: 'ニュース',
        description: '複数のニュースソースから最新のニュースをお届けします。',
        theme_color: '#CC0000',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'https://photo-ten-iota.vercel.app/nipponnews/default.png',
            sizes: '64x64',
            type: 'image/png'
          },
          {
            src: 'https://photo-ten-iota.vercel.app/nipponnews/default.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'https://photo-ten-iota.vercel.app/nipponnews/default.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'https://photo-ten-iota.vercel.app/nipponnews/default.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.allorigins\.win\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              }
            }
          },
          {
            urlPattern: /^https:\/\/photo-ten-iota\.vercel\.app\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
              }
            }
          }
        ]
      }
    })
  ],
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      events: 'events',
      url: 'url'
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['events', 'url']
  },
});
