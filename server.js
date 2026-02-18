import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// O Cloud Run injeta a porta dinamicamente nesta variável de ambiente
const PORT = process.env.PORT || 8080;
const distPath = path.resolve(__dirname, 'dist');

// Middleware para servir os arquivos estáticos gerados pelo build do Vite
app.use(express.static(distPath, {
  maxAge: '1d',
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) res.setHeader('Cache-Control', 'no-cache');
  }
}));

// Endpoint vital para o Google Cloud Run validar que o container está saudável
app.get('/healthz', (req, res) => res.status(200).send('OK'));

/**
 * Fallback para SPA: Garante que rotas como /whatsapp ou /clientes
 * carreguem corretamente mesmo após um refresh (F5).
 */
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(503).send('A aplicação está em fase de build. Por favor, tente novamente em instantes.');
  }
});

// É mandatório escutar em 0.0.0.0 para que o tráfego externo alcance o container
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`[PROD] ES Enterprise Online | Porta: ${PORT} | Host: 0.0.0.0`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});