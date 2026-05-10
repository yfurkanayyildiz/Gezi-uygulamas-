import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'node:fs': '/src/ai/empty.js',
      'node:path': '/src/ai/empty.js',
    },
  },
})
