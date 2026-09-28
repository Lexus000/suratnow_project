import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Keep the development server local by default; production uses the built assets.
    allowedHosts: ['localhost', '127.0.0.1'],
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true
    }
  }
})
