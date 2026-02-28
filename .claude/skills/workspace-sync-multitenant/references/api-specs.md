# Google API Specs - Multi-Tenant Sync

## 1. Google People API (Contacts)

**Endpoint**: `GET https://people.googleapis.com/v1/people/me/connections`

**Parametros**:
```
personFields: names,emailAddresses,phoneNumbers,organizations,photos
pageSize: 1000
pageToken: <para paginacao>
```

**Response mapeado para Client**:
```typescript
// Google Person -> Client mapping
{
  name: person.names?.[0]?.displayName,
  email: person.emailAddresses?.[0]?.value,
  phone: person.phoneNumbers?.[0]?.value,
  googleContactId: person.resourceName,   // "people/c12345678"
  origin: 'Google',
  status: 'Ativo',
  organizationId: currentOrgId,
}
```

**Scope necessario**: `https://www.googleapis.com/auth/contacts.readonly`

---

## 2. Google Drive API (Folders)

### Listar pastas existentes
**Endpoint**: `GET https://www.googleapis.com/drive/v3/files`

**Query params**:
```
q: "name='! ES-ENTERPRISE' and mimeType='application/vnd.google-apps.folder' and trashed=false"
fields: files(id,name,parents)
```

### Criar pasta
**Endpoint**: `POST https://www.googleapis.com/drive/v3/files`

**Body**:
```json
{
  "name": "! ES-ENTERPRISE",
  "mimeType": "application/vnd.google-apps.folder"
}
```

### Criar subpasta de cliente
```json
{
  "name": "<clientName>",
  "mimeType": "application/vnd.google-apps.folder",
  "parents": ["<masterFolderId>"]
}
```

### Upload de arquivo para pasta do cliente
**Endpoint**: `POST https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart`

**Metadata**:
```json
{
  "name": "Laudo_<clientName>_<date>.pdf",
  "parents": ["<client.drive_folder_id>"]
}
```

**Scope necessario**: `https://www.googleapis.com/auth/drive.file`

---

## 3. Scopes Completos para Onboarding

```typescript
const ONBOARDING_SCOPES = [
  'https://www.googleapis.com/auth/contacts.readonly',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/spreadsheets',
  // Scopes ja existentes:
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/tasks',
];
```

---

## 4. Tratamento de Erros

| Codigo HTTP | Causa | Acao |
|-------------|-------|------|
| 401 | Token expirado | Chamar `googleApiService.refreshToken()` |
| 403 | Scope insuficiente | Redirecionar para re-auth com scopes corretos |
| 429 | Rate limit | Retry com exponential backoff (max 3x) |
| 404 | Pasta nao encontrada | Criar nova pasta |

---

## 5. Rate Limits (Google APIs)

- People API: 300 requisicoes/minuto/usuario
- Drive API: 1000 requisicoes/100 segundos/usuario
- Recomendado: processar contatos em batches de 100 com delay de 1s entre batches
