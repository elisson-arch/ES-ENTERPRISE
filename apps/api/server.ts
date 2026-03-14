import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';
import admin from 'firebase-admin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '50mb' }));

// Cloud Run injeta a porta dinamicamente
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
const API_KEY = process.env.API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

// ---------------------------------------------------------------------------
// Firebase Admin SDK — inicializa uma única vez (gracefully)
// ---------------------------------------------------------------------------
if (!admin.apps.length) {
    try {
        const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
        if (serviceAccountJson) {
            admin.initializeApp({
                credential: admin.credential.cert(JSON.parse(serviceAccountJson)),
            });
        } else {
            // Fallback: usa Application Default Credentials (GOOGLE_APPLICATION_CREDENTIALS)
            admin.initializeApp({
                credential: admin.credential.applicationDefault(),
            });
        }
        console.log('[AUTH] Firebase Admin SDK inicializado com sucesso.');
    } catch (err) {
        console.warn('[AUTH] Firebase Admin SDK não pôde ser inicializado. Auth middleware desabilitado.', err);
    }
}

// ---------------------------------------------------------------------------
// Middleware: verifica token Firebase Auth no header Authorization
// ---------------------------------------------------------------------------
async function requireFirebaseAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (!admin.apps.length) {
        // Se o Admin SDK não foi inicializado, deixa passar com aviso
        console.warn('[AUTH] SDK não disponível — requisição permitida sem autenticação.');
        next();
        return;
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Não autorizado. Token de autenticação ausente.' });
        return;
    }

    const idToken = authHeader.split('Bearer ')[1];
    try {
        await admin.auth().verifyIdToken(idToken);
        next();
    } catch {
        res.status(401).json({ error: 'Não autorizado. Token inválido ou expirado.' });
    }
}

// ---------------------------------------------------------------------------
// Rate limiter: máximo 20 req/min por IP no endpoint de IA
// ---------------------------------------------------------------------------
const aiRateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minuto
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Muitas requisições. Aguarde um momento antes de tentar novamente.' },
});

// ---------------------------------------------------------------------------
// dist/ fica dois níveis acima (raiz do projeto)
// ---------------------------------------------------------------------------
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
 * Proxy Gemini: mantém API_KEY no backend, nunca exposta ao cliente.
 * Protegido por autenticação Firebase e rate limit.
 */
app.post('/api/ai/generate', aiRateLimiter, requireFirebaseAuth, async (req: Request, res: Response) => {
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
