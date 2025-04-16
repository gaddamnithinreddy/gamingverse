import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'framer-motion'],
        }
      }
    },
    sourcemap: false,
    minify: 'terser'
  },
  server: {
    port: 3000,
  },
  base: '/',
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion']
  }
});
