import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Port par défaut de Vite
    proxy: {
      '/api': {
        target: 'http://localhost:8787', // Worker Cloudflare en développement
        changeOrigin: true
      }
    }
  }
})
