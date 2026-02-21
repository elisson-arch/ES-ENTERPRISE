import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '50mb' })); // Necessário para receber imagens base64

// O Cloud Run injeta a porta dinamicamente nesta variável de ambiente
const PORT = process.env.PORT || 8080;
const API_KEY = process.env.API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
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
 * Proxy API para o Gemini: Protege a API_KEY no backend
 */
app.post('/api/ai/generate', async (req, res) => {
  try {
    const { model, contents, config } = req.body;

    if (!API_KEY) {
      return res.status(500).json({ error: 'API_KEY não configurada no servidor.' });
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents, ...config })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('[BACKEND] Erro Gemini Proxy:', error);
    res.status(500).json({ error: 'Falha na comunicação com a IA.' });
  }
});

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