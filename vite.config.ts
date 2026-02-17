import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  // Carrega variáveis de .env e do ambiente do sistema
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    base: '/',
    server: {
      port: 8080,
      host: true,
    },
    preview: {
      port: 8080,
      host: true,
      // CORREÇÃO: Permite que o Google Cloud Run acesse o servidor de preview
      allowedHosts: true, 
    },
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
        manifest: {
          name: 'ES ENTERPRISE',
          short_name: 'ES CRM',
          description: 'Gestão e IA para Manutenção',
          theme_color: '#0f172a',
          background_color: '#f8fafc',
          display: 'standalone',
          orientation: 'portrait',
          icons: [
            {
              src: 'https://cdn-icons-png.flaticon.com/512/3064/3064155.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'https://cdn-icons-png.flaticon.com/512/3064/3064155.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ]
        }
      })
    ],
    define: {
      // Prioriza VITE_GEMINI_API_KEY para compatibilidade com .env padrão do Vite
      'process.env.API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY || env.API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './'),
      }
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom', 'recharts'],
            ui: ['lucide-react']
          }
        }
      }
    }
  };
});