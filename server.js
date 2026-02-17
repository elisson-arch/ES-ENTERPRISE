import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

const distPath = path.resolve(__dirname, 'dist');

/**
 * 1. BINDING IMEDIATO
 * Crucial para evitar 'Container failed to start' no Cloud Run.
 */
const server = app.listen(PORT, HOST, () => {
  console.log(`[BOOT] ES ENTERPRISE online na porta ${PORT}`);
});

// Endpoint rápido para Load Balancer
app.get('/healthz', (req, res) => res.status(200).send('OK'));

app.use(express.static(distPath));

/**
 * 2. ROTEAMENTO SPA (Single Page Application)
 * Garante que rotas como /clientes funcionem ao recarregar a página.
 */
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(200).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Sincronizando SGC...</title>
        <style>
          body { background: #020617; color: white; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; font-family: sans-serif; }
          .loader { border: 3px solid rgba(255,255,255,0.1); border-top-color: #3b82f6; border-radius: 50%; width: 30px; height: 30px; animation: spin 1s linear infinite; }
          @keyframes spin { to { transform: rotate(360deg); } }
        </style>
      </head>
      <body>
        <div style="text-align: center;">
          <div class="loader" style="margin: 0 auto 20px;"></div>
          <h2 style="font-style: italic; letter-spacing: -1px; margin: 0;">ES ENTERPRISE</h2>
          <p style="opacity: 0.5; font-size: 10px; text-transform: uppercase;">Conectando ao Motor Cloud...</p>
        </div>
        <script>setTimeout(() => window.location.reload(), 2000);</script>
      </body>
      </html>
    `);
  }
});

process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});