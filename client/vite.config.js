import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Any request to /api will be forwarded to your backend tunnel
      '/api': {
        target: 'https://fluffy-cod-7wwp9jgqgcxqq7-3001.app.github.dev',
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace(/^\/api/, '') // strip /api prefix
      }
    }
  }
})
