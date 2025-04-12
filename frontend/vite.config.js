import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react(),
    tailwindcss(),],
  server: {
    port: 5173,
    fs: {
      strict: false
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: 'index.html'
      }
    }
  }
});
