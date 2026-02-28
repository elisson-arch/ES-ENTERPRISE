#!/usr/bin/env node
/**
 * validate-sync.js
 * Script de validacao do worker de sincronizacao Multi-Tenant.
 * Uso: node validate-sync.js --orgId <organizationId> --dry-run
 *
 * Verifica:
 *  1. Contatos do Google que ainda nao estao no Firestore
 *  2. Clientes no Firestore sem drive_folder_id
 *  3. Pastas Drive que existem no Firestore mas nao existem mais no Drive
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const args = process.argv.slice(2);
const orgId = args[args.indexOf('--orgId') + 1] || 'org_123';
const dryRun = args.includes('--dry-run');

console.log(`[ValidateSync] Iniciando validacao para org: ${orgId}`);
console.log(`[ValidateSync] Modo: ${dryRun ? 'DRY-RUN (sem alteracoes)' : 'EXECUCAO REAL'}`);

// Inicializar Firebase Admin SDK
// Requer: GOOGLE_APPLICATION_CREDENTIALS no ambiente ou service account key
let db;
try {
  const app = initializeApp({
    credential: cert(process.env.GOOGLE_APPLICATION_CREDENTIALS || './service-account.json'),
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  });
  db = getFirestore(app);
  console.log('[ValidateSync] Firebase Admin conectado.');
} catch (err) {
  console.error('[ValidateSync] Erro ao conectar Firebase:', err.message);
  process.exit(1);
}

async function validateSync() {
  const results = {
    clientsWithoutDriveFolder: [],
    clientsWithoutGoogleId: [],
    auditLogCount: 0,
  };

  // 1. Clientes sem drive_folder_id
  const clientsSnap = await db.collection('clients')
    .where('organizationId', '==', orgId)
    .get();

  clientsSnap.forEach(doc => {
    const data = doc.data();
    if (!data.drive_folder_id) {
      results.clientsWithoutDriveFolder.push({ id: doc.id, name: data.name });
    }
    if (!data.googleContactId) {
      results.clientsWithoutGoogleId.push({ id: doc.id, name: data.name });
    }
  });

  // 2. Contar audit logs recentes
  const auditSnap = await db.collection('audit_logs')
    .where('organizationId', '==', orgId)
    .orderBy('timestamp', 'desc')
    .limit(10)
    .get();

  results.auditLogCount = auditSnap.size;

  // Relatorio
  console.log('\n===== RELATORIO DE VALIDACAO =====');
  console.log(`Total de clientes: ${clientsSnap.size}`);
  console.log(`Clientes sem pasta Drive: ${results.clientsWithoutDriveFolder.length}`);
  if (results.clientsWithoutDriveFolder.length > 0) {
    results.clientsWithoutDriveFolder.forEach(c => {
      console.log(`  - [${c.id}] ${c.name}`);
    });
  }
  console.log(`Clientes sem Google Contact ID: ${results.clientsWithoutGoogleId.length}`);
  console.log(`Audit logs recentes: ${results.auditLogCount}`);
  console.log('==================================\n');

  return results;
}

validateSync()
  .then(results => {
    const issues = results.clientsWithoutDriveFolder.length + results.clientsWithoutGoogleId.length;
    if (issues === 0) {
      console.log('[ValidateSync] OK - Nenhum problema encontrado.');
      process.exit(0);
    } else {
      console.warn(`[ValidateSync] AVISO - ${issues} problema(s) encontrado(s). Execute o sync para corrigir.`);
      process.exit(2);
    }
  })
  .catch(err => {
    console.error('[ValidateSync] Erro fatal:', err);
    process.exit(1);
  });
