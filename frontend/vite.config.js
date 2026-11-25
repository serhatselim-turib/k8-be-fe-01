import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Lokal geliştirme: /api isteklerini backend'e proxy'le (CORS derdi yok)
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': process.env.BACKEND_URL || 'http://localhost:8080'
    }
  }
})
