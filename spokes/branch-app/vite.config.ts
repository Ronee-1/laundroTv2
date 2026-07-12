import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        // For production, you can use environment variable:
        // target: process.env.VITE_API_PROXY_URL || 'http://localhost:3000',
      },
    },
  },
  // Load environment variables from .env file
  envDir: './',
  envPrefix: 'VITE_',
});
