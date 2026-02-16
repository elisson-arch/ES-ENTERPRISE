import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

// DIRETÓRIO DE BUILD
const distPath = path.resolve(__dirname, 'dist');

/**
 * 1. PRONTO PARA O GOOGLE CLOUD
 * Iniciamos o listen no topo do arquivo para evitar timeouts da sonda de saúde.
 */
const server = app.listen(PORT, HOST, () => {
  console.log(`[BOOT] ES Enterprise Engine online em ${HOST}:${PORT}`);
});

/**
 * 2. ENDPOINT DE SAÚDE (HEALTH CHECK)
 */
app.get('/healthz', (req, res) => res.status(200).send('OK'));

/**
 * 3. SERVIR ARQUIVOS ESTÁTICOS DO VITE
 */
app.use(express.static(distPath));

/**
 * 4. ROTEAMENTO SPA (Single Page Application)
 * Resolve o problema de 404 ao recarregar rotas internas como /clientes ou /whatsapp.
 */
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    // Fallback de carregamento caso o processo de build ainda esteja finalizando no container
    res.status(200).send(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>ES Enterprise - Sincronizando</title>
        <style>
          body { font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #020617; color: white; margin: 0; text-align: center; }
          .spinner { width: 40px; height: 40px; border: 4px solid rgba(59,130,246,0.2); border-top-color: #3b82f6; border-radius: 50%; animation: s 1s infinite linear; margin-bottom: 20px; }
          @keyframes s { to { transform: rotate(360deg); } }
          h1 { font-style: italic; font-weight: 900; letter-spacing: -0.05em; background: linear-gradient(to right, #fff, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 1.5rem; }
        </style>
      </head>
      <body>
        <div>
          <div class="spinner"></div>
          <h1>ES ENTERPRISE • CLOUD</h1>
          <p style="opacity:0.5; font-size:10px; text-transform:uppercase; letter-spacing:0.2em;">Conectando Motor de Nuvem...</p>
        </div>
        <script>setTimeout(() => window.location.reload(), 2000);</script>
      </body>
      </html>
    `);
  }
});

/**
 * 5. DESLIGAMENTO SEGURO
 */
process.on('SIGTERM', () => {
  console.log('[SHUTDOWN] Recebido SIGTERM. Encerrando servidor...');
  server.close(() => process.exit(0));
});