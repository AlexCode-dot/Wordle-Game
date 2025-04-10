import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    manifest: true, // Aktiverar manifestfilen
    outDir: 'static/dist', // Sätt utmatningsmappen till "dist"
    rollupOptions: {
      input: 'src/react/main.jsx', // Startpunkt för appen
    },
    emptyOutDir: false, // Förhindrar att static/script rensas varje build
  },
})
