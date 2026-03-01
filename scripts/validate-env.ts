#!/usr/bin/env ts-node
/**
 * scripts/validate-env.ts
 * Valida variáveis de ambiente obrigatórias no boot.
 * Execute antes de iniciar o servidor: npx ts-node scripts/validate-env.ts
 */

const REQUIRED_VARS: Record<string, string[]> = {
    Firebase: [
        'VITE_FIREBASE_API_KEY',
        'VITE_FIREBASE_AUTH_DOMAIN',
        'VITE_FIREBASE_PROJECT_ID',
        'VITE_FIREBASE_STORAGE_BUCKET',
        'VITE_FIREBASE_MESSAGING_SENDER_ID',
        'VITE_FIREBASE_APP_ID',
    ],
    'Google APIs': [
        'VITE_GOOGLE_CLIENT_ID',
    ],
    'Gemini AI': [
        'VITE_GEMINI_API_KEY',
    ],
};

let hasError = false;

for (const [group, vars] of Object.entries(REQUIRED_VARS)) {
    for (const varName of vars) {
        if (!process.env[varName]) {
            console.error(`❌ [${group}] Variável ausente: ${varName}`);
            hasError = true;
        }
    }
}

if (hasError) {
    console.error('\n⛔ Corrija as variáveis acima antes de iniciar o servidor.');
    console.error('   Copie .env.example para .env e preencha os valores.\n');
    process.exit(1);
} else {
    console.log('✅ Todas as variáveis de ambiente estão configuradas.');
}
