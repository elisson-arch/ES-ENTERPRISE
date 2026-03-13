import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '50mb' }));

// Cloud Run injeta a porta dinamicamente
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
const API_KEY = process.env.API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

// dist/ fica dois níveis acima (raiz do projeto)
const distPath = path.resolve(__dirname, '../../dist');

// Serve arquivos estáticos gerados pelo Vite build
app.use(express.static(distPath, {
    maxAge: '1d',
    setHeaders: (res: Response, filePath: string) => {
        if (filePath.endsWith('.html')) res.setHeader('Cache-Control', 'no-cache');
    },
}));

// Health check para Cloud Run
app.get('/healthz', (_req: Request, res: Response) => res.status(200).send('OK'));

/**
 * Configuração segura: entrega Firebase config ao frontend
 * sem expor em variáveis de build estáticas.
 */
app.get('/api/config-secure', (_req: Request, res: Response) => {
    res.json({
        firebase: {
            apiKey: process.env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
            authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN,
            projectId: process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
            storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.VITE_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID,
        },
        googleClientId: process.env.VITE_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID,
    });
});

/**
 * Proxy Gemini: mantém API_KEY no backend, nunca exposta ao cliente.
 */
app.post('/api/ai/generate', async (req: Request, res: Response) => {
    try {
        const { model, contents, config } = req.body;

        if (!API_KEY) {
            return res.status(500).json({ error: 'API_KEY não configurada no servidor.' });
        }

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents, ...config }),
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('[BACKEND] Erro Gemini Proxy:', error);
        res.status(500).json({ error: 'Falha na comunicação com a IA.' });
    }
});

/**
 * Fallback SPA: rotas como /whatsapp ou /clientes funcionam no F5.
 */
app.get('*', (_req: Request, res: Response) => {
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(503).send('A aplicação está em fase de build. Tente novamente em instantes.');
    }
});

// Obrigatório: 0.0.0.0 para tráfego externo no Cloud Run
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[PROD] ES Enterprise Online | Porta: ${PORT} | Host: 0.0.0.0`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    server.close(() => process.exit(0));
});
