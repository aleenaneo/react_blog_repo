import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `cm_blog.js`,
        chunkFileNames: `cm_blog.js`,
        assetFileNames: `cm_blog[extname]`,
      },
    },
  },
})
