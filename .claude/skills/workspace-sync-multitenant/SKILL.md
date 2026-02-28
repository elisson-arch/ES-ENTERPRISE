---
name: workspace-sync-multitenant
description: "This skill should be used when implementing the Multi-Tenant Workspace Synchronization Engine v4.1 for ES-ENTERPRISE. It covers Auto-Onboarding of external organizations, Google Contacts-to-Firestore sync workers, distributed Drive storage architecture where files reside in the client own Drive, and integration audit logging. Use this skill when tasks involve googleApiService scopes, googleSyncService workers, Firestore organizationId isolation, or Drive folder mirroring for multi-tenant clients."
---

# Motor de Sincronizacao Workspace Multi-Tenant (v4.1)

## Objetivo

Permitir que centenas de empresas se cadastrem e utilizem a inteligencia do Ricardo IA, enquanto cada uma paga o proprio armazenamento via Google Drive, mantendo a infraestrutura Firestore leve, rapida e dentro do Spark Plan gratuito.

## Visao Geral da Arquitetura

```
[Onboarding do Dono da Org]
        |
        v
[googleApiService] -- solicita scopes expandidos
        |
        v
[Token OAuth do cliente armazenado temporariamente]
        |
        +----> [googleSyncService.syncContactsToFirestore()]
        |              |
        |              v
        |      Firestore: clients/{organizationId}/*
        |
        +----> [googleSyncService.ensureDriveFolderStructure()]
        |              |
        |              v
        |      Drive do CLIENTE: pasta "! ES-ENTERPRISE/{clientName}"
        |              |
        |              v
        |      Firestore: clients/{id}.drive_folder_id
        |
        +----> [auditLogService.record()]
                       |
                       v
               Firestore: audit_logs/{eventId}
```

## Especificacoes Tecnicas

### 1. Mapeamento de Scopes Dinamicos

Arquivo alvo: `services/googleApiService.ts`

Ao iniciar o login do dono da organizacao, solicitar os seguintes scopes adicionais:

```
contacts.readonly
https://www.googleapis.com/auth/drive.file
gmail.modify
https://www.googleapis.com/auth/spreadsheets
```

O token gerado deve ser armazenado temporariamente na sessao (`sgc_token`) para o sync inicial.
Os arquivos finais devem residir na conta Google do cliente -- nunca no projeto principal.

### 2. Worker: Contacts -> Firestore

Arquivo alvo: `services/googleSyncService.ts`

Criar funcao `syncContactsToFirestore(organizationId: string)`:

1. Chamar Google People API (`people/me/connections`) com `personFields=names,emailAddresses,phoneNumbers,organizations`
2. Para cada contato valido (com nome e telefone ou email):
   - Mapear para interface `Client` existente
   - Definir `origin: 'Google'`, `status: 'Ativo'`, `organizationId`
   - Executar upsert no Firestore via `clientService.upsertByGoogleId(contact.resourceName, data)`
3. Retornar `{ imported: number, skipped: number, errors: string[] }`

### 3. Arquitetura de Storage Distribuido

Arquivo alvo: `services/googleSyncService.ts`

Criar funcao `ensureDriveFolderStructure(clientName: string, organizationId: string): Promise<string>`:

1. Buscar pasta raiz `"! ES-ENTERPRISE"` no Drive do cliente via `drive.files.list` com `q: "name='! ES-ENTERPRISE' and mimeType='application/vnd.google-apps.folder'"`
2. Se nao existir, criar com `drive.files.create`
3. Criar subpasta com `clientName` dentro da pasta raiz
4. Retornar o `folderId` da subpasta
5. Armazenar o `drive_folder_id` no documento Firestore do cliente

Todo arquivo gerado (laudos do Ricardo IA, fotos de etiquetas) deve usar esse `drive_folder_id` como `parents` ao fazer upload via Drive API.

### 4. Audit Log de Integracao

Arquivo alvo: `services/auditLogService.ts` (criar se nao existir)

Interface do evento:

```typescript
interface AuditLogEvent {
  id: string;
  organizationId: string;
  eventType: 'CONTACTS_SYNC' | 'DRIVE_FOLDER_CREATED' | 'FILE_UPLOADED' | 'ONBOARDING_COMPLETE';
  timestamp: string; // ISO
  details: {
    contactsImported?: number;
    contactsSkipped?: number;
    masterFolderId?: string;
    clientFolderIds?: string[];
    errors?: string[];
  };
  userId: string;
}
```

Colecao Firestore: `audit_logs`

Funcao: `recordSyncEvent(event: Omit<AuditLogEvent, 'id' | 'timestamp'>): Promise<void>`

## Fluxo de Auto-Onboarding

1. Usuario acessa `/integrations` e clica em "Conectar Google Workspace"
2. `googleApiService.initiateLogin()` solicita todos os scopes (incluindo os novos)
3. Apos autenticacao: disparar em paralelo:
   - `syncContactsToFirestore(organizationId)`
   - Criar estrutura de pastas para cada cliente importado
4. Registrar evento `ONBOARDING_COMPLETE` no audit_log
5. Exibir notificacao de sucesso com contagem de contatos importados

## Arquivos a Modificar / Criar

| Arquivo | Acao | Descricao |
|---------|------|-----------|
| `services/googleApiService.ts` | Modificar | Adicionar novos scopes ao login |
| `services/googleSyncService.ts` | Modificar | Adicionar syncContactsToFirestore() e ensureDriveFolderStructure() |
| `services/clientService.ts` | Modificar | Adicionar upsertByGoogleId() e campo drive_folder_id |
| `services/auditLogService.ts` | Criar | Servico de registro de eventos de auditoria |
| `types.ts` | Modificar | Adicionar AuditLogEvent interface e drive_folder_id no Client |
| `views/IntegrationsView.tsx` | Modificar | UI de onboarding com progresso do sync |

## Consideracoes de Seguranca

- O token OAuth do cliente NUNCA deve ser persistido no Firestore -- apenas em memoria durante o sync
- Todos os uploads de arquivo devem usar o `drive_folder_id` do cliente, nunca o Service Account do projeto
- Validar `organizationId` em todas as operacoes Firestore antes de qualquer escrita
- O scope `drive.file` garante acesso apenas a arquivos criados pelo app, nao ao Drive completo do usuario

## Referencias

- Ver `references/api-specs.md` para schemas detalhados das APIs Google utilizadas
- Ver `references/firestore-schema.md` para estrutura das colecoes Firestore atualizadas
- Ver `scripts/validate-sync.js` para script de validacao do worker de sincronizacao
