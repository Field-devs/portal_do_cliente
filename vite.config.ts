import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    open: true, // Abre o navegador automaticamente
    host: true, // Permite acessar pelo IP da rede
    port: 3000, // Define a porta do servidor
  },
});
