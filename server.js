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
 * Endpoint de Configuração Segura: Entrega as chaves públicas (Firebase) ao frontend
 * sem expô-las em arquivos estáticos ou variáveis de build.
 */
app.get('/api/config-secure', (req, res) => {
  res.json({
    firebase: {
      apiKey: process.env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
      authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.VITE_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID
    },
    googleClientId: process.env.VITE_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID
  });
});

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