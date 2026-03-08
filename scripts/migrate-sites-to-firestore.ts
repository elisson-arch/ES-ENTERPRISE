import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, setDoc } from 'firebase/firestore';
import dotenv from 'dotenv';
import { Site } from '../domains/site-builder/types/site-builder.types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carrega variáveis do .env na raiz (onde o dotenv puxa VITE_*)
dotenv.config({ path: path.join(__dirname, '../.env') });

const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const COLLECTION_NAME = 'sites';

interface SheetsExportRow {
    ID_SITE: string;
    DATA_CRIACAO: string;
    SLUG: string;
    MARCA: string;
    DNA_JSON: string; // JSON string
}

async function runMigration() {
    const args = process.argv.slice(2);
    const jsonPath = args[0];

    if (!jsonPath) {
        console.error('Uso: npx tsx scripts/migrate-sites-to-firestore.ts <caminho-para-export-do-sheets.json>');
        process.exit(1);
    }

    const fullPath = path.resolve(process.cwd(), jsonPath);
    if (!fs.existsSync(fullPath)) {
        console.error(`Arquivo não encontrado: ${fullPath}`);
        process.exit(1);
    }

    console.log(`[Migração] Lendo arquivo: ${fullPath}`);
    const fileContent = fs.readFileSync(fullPath, 'utf-8');
    const data: SheetsExportRow[] = JSON.parse(fileContent);

    console.log(`[Migração] Foram encontrados ${data.length} registros para migração.`);

    // Fallback tenant para os sites migrados (ajustar conforme necessidade)
    const LEGACY_TENANT_ID = 'LEGACY_MIGRATION_TENANT';

    let success = 0;
    let errors = 0;

    for (const row of data) {
        try {
            console.log(`Migrando: ${row.MARCA} (${row.SLUG})...`);
            const parsedDna = JSON.parse(row.DNA_JSON);

            const siteData: Site = {
                tenantId: LEGACY_TENANT_ID,
                slug: row.SLUG,
                brandName: row.MARCA,
                dna: parsedDna,
                createdAt: row.DATA_CRIACAO || new Date().toISOString(),
                status: 'active'
            };

            // Usa o ID antigo como ID do documento no Firestore se possível
            if (row.ID_SITE) {
                const docRef = doc(db, COLLECTION_NAME, row.ID_SITE);
                await setDoc(docRef, siteData);
            } else {
                const colRef = collection(db, COLLECTION_NAME);
                await addDoc(colRef, siteData);
            }

            success++;
        } catch (err: any) {
            console.error(`Erro ao migrar ${row.ID_SITE || row.SLUG}:`, err.message);
            errors++;
        }
    }

    console.log('\n=======================================');
    console.log('MIGRAÇÃO CONCLUÍDA');
    console.log(`Sucesso: ${success} registros importados.`);
    console.log(`Erros: ${errors} falhas.`);
    console.log('=======================================');
    process.exit(0);
}

runMigration().catch(console.error);
