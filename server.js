import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;
const distPath = path.resolve(__dirname, 'dist');

// Middleware para servir arquivos estáticos com cache agressivo para PWA
app.use(express.static(distPath, {
  maxAge: '1d',
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) res.setHeader('Cache-Control', 'no-cache');
  }
}));

// Endpoint de Health Check para o Google Cloud Load Balancer
app.get('/healthz', (req, res) => res.status(200).send('OK'));

/**
 * Fallback para SPA (Single Page Application)
 * Essencial para que rotas como /clientes funcionem no PWA
 */
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(503).send('Aplicação em fase de build. Recarregue em instantes.');
  }
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`[PROD] ES Enterprise Engine online na porta ${PORT}`);
});

process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});