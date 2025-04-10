import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    manifest: true,
    outDir: 'static/dist',
    rollupOptions: {
      input: 'src/react/main.jsx',
    },
    emptyOutDir: true,
  },
})
