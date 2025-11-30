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
    open: false,
    cors: true,
    hmr: {
      host: 'localhost',
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
