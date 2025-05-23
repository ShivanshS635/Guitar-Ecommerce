import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  serve : {port : 5173},build: {
    rollupOptions: {
      input: {
        main: 'index.html',
      },
    },
  },
})

