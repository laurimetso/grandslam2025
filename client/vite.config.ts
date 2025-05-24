import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/grandslam2025/',  // <-- THIS IS THE KEY
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:1234',
        changeOrigin: true
      }
    },
    port: 3000
  }
})
