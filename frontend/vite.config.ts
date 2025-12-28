import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
  },
  // GitHub Pages deployment configuration
  base: process.env.NODE_ENV === 'production' ? '/meerut-culture-guide/' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})