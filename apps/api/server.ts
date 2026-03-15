import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '50mb' }));

// Cloud Run injeta a porta dinamicamente
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
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

import admin from 'firebase-admin';
import rateLimit from 'express-rate-limit';

// Inicialização Firebase Admin para Verificação de Tokens
if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('[BACKEND] Firebase Admin inicializado.');
  } catch (e) {
    console.error('[BACKEND] Falha ao parsear FIREBASE_SERVICE_ACCOUNT_JSON:', e);
  }
}

// Middleware de autenticação
const requireFirebaseAuth = async (req: Request, res: Response, next: () => void) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ error: 'Não autorizado' });
    
    const token = authHeader.split('Bearer ')[1];
    try {
        await admin.auth().verifyIdToken(token);
        next();
    } catch {
        res.status(403).json({ error: 'Token inválido' });
    }
};

// Rate limiting para o endpoint de IA
const aiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minuto
    max: 20, // limite de 20 requisições por IP
    message: { error: 'Limite de requisições excedido. Tente novamente em breve.' }
});

/**
 * Proxy IA Universal: Suporta Gemini e OpenAI
 */
app.post('/api/ai/generate', aiLimiter, async (req: Request, res: Response) => {
    try {
        const { provider, model, contents, messages, config, ...rest } = req.body;

        if (provider === 'openai') {
            const OPENAI_KEY = process.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
            if (!OPENAI_KEY) return res.status(500).json({ error: 'OPENAI_KEY não configurada' });

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_KEY}`
                },
                body: JSON.stringify({ model, messages, ...rest })
            });
            const data = await response.json();
            return res.json(data);
        }

        // Default: Gemini
        if (!API_KEY) return res.status(500).json({ error: 'API_KEY não configurada' });

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents, ...config }),
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('[BACKEND] Erro Proxy IA:', error);
        res.status(500).json({ error: 'Erro interno no Proxy IA' });
    }
});

/**
 * Ferramentas do Agente: Endpoints de Sistema
 * RESTRITOS: Apenas chamadas autenticadas
 */

app.get('/api/agent/readFile', requireFirebaseAuth, async (req: Request, res: Response) => {
    const filePath = String(req.query.path).replace(/\.\./g, '');
    const fullPath = path.resolve(__dirname, '../../', filePath);
    
    if (!filePath.match(/^(domains|apps|scripts)\//)) {
        return res.status(403).json({ error: 'Acesso restrito fora do escopo do projeto.' });
    }

    try {
        const content = fs.readFileSync(fullPath, 'utf-8');
        res.json({ content });
    } catch {
        res.status(404).json({ error: 'Arquivo não encontrado.' });
    }
});

app.post('/api/agent/writeFile', requireFirebaseAuth, async (req: Request, res: Response) => {
    const { path: filePath, content } = req.body;
    const sanitizedPath = String(filePath).replace(/\.\./g, '');
    const fullPath = path.resolve(__dirname, '../../', sanitizedPath);

    if (!sanitizedPath.match(/^(domains|apps|scripts)\//)) {
        return res.status(403).json({ error: 'Escrita restrita a diretórios de código.' });
    }

    try {
        fs.writeFileSync(fullPath, content, 'utf-8');
        res.json({ success: true });
    } catch {
        res.status(500).json({ error: 'Erro ao salvar arquivo.' });
    }
});

app.get('/api/agent/searchCode', requireFirebaseAuth, async (req: Request, res: Response) => {
    const { pattern, scope } = req.query;
    const baseDir = path.resolve(__dirname, '../../', String(scope || ''));
    
    const findInFiles = (dir: string): { file: string; line: number; content: string }[] => {
        let results: { file: string; line: number; content: string }[] = [];
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const fullPath = path.join(dir, file);
            if (fs.statSync(fullPath).isDirectory()) {
                if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
                    results = [...results, ...findInFiles(fullPath)];
                }
            } else {
                const content = fs.readFileSync(fullPath, 'utf-8');
                const lines = content.split('\n');
                lines.forEach((line, idx) => {
                    if (line.includes(String(pattern))) {
                        results.push({
                            file: path.relative(path.resolve(__dirname, '../../'), fullPath),
                            line: idx + 1,
                            content: line.substring(0, 100)
                        });
                    }
                });
            }
        }
        return results;
    };

    try {
        const results = findInFiles(baseDir);
        res.json({ results: results.slice(0, 50) });
    } catch {
        res.status(500).json({ error: 'Erro na busca.' });
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
