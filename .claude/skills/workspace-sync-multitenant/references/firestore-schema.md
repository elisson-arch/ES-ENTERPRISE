# Firestore Schema - Multi-Tenant Sync (v4.1)

## Colecao: `clients`

```
clients/{clientId}
  - id: string
  - name: string
  - document: string (CNPJ/CPF)
  - email: string
  - phone: string
  - address: { street, city, state, zip }
  - type: 'PJ' | 'PF'
  - origin: 'Google' | 'Manual' | 'Site' | 'WhatsApp'
  - status: 'Ativo' | 'Inativo' | 'Prospeccao'
  - organizationId: string       <-- OBRIGATORIO para isolamento
  - googleContactId: string      <-- resourceName do Google Contacts (ex: "people/c123456")
  - drive_folder_id: string      <-- ID da pasta no Drive DO CLIENTE (novo campo v4.1)
  - syncTimestamp: string        <-- ISO date do ultimo sync
  - createdAt: Timestamp
  - updatedAt: Timestamp
```

## Colecao: `audit_logs`

```
audit_logs/{eventId}
  - id: string
  - organizationId: string
  - eventType: 'CONTACTS_SYNC' | 'DRIVE_FOLDER_CREATED' | 'FILE_UPLOADED' | 'ONBOARDING_COMPLETE'
  - timestamp: string (ISO)
  - userId: string
  - details:
      contactsImported?: number
      contactsSkipped?: number
      masterFolderId?: string
      clientFolderIds?: string[]
      errors?: string[]
```

## Indices Recomendados (Firestore)

Para `clients`:
- `organizationId` ASC + `status` ASC
- `organizationId` ASC + `googleContactId` ASC (para upsert eficiente)
- `organizationId` ASC + `syncTimestamp` DESC

Para `audit_logs`:
- `organizationId` ASC + `timestamp` DESC
- `organizationId` ASC + `eventType` ASC + `timestamp` DESC

## Regras de Seguranca Firestore (firestore.rules)

```
match /clients/{clientId} {
  allow read, write: if request.auth != null
    && resource.data.organizationId == request.auth.token.organizationId;
}

match /audit_logs/{logId} {
  allow read: if request.auth != null
    && resource.data.organizationId == request.auth.token.organizationId;
  allow write: if request.auth != null; // escrita via backend apenas
}
```
