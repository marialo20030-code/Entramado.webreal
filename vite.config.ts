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
  server: {
    host: '127.0.0.1', // Usa IPv4 explícitamente para mejor compatibilidad en Windows
    port: 5173,
    strictPort: false,
    open: true, // Abre el navegador automáticamente
    cors: true,
    hmr: {
      host: 'localhost',
    },
    // Optimizaciones para inicio más rápido
    watch: {
      usePolling: false,
      interval: 1000,
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
