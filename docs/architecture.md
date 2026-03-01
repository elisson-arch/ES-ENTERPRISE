# docs/architecture.md — ES-ENTERPRISE Architecture Decision Record

## Visão Geral

**ES-ENTERPRISE** é uma plataforma SaaS multi-tenant construída em:
- **Frontend**: React 18 + TypeScript (Vite)
- **Backend**: Express.js (Node.js)
- **Database**: Firebase / Firestore
- **Deploy**: Google Cloud Run (us-central1) via Cloud Build

---

## Domínios

| Domínio | Responsabilidade |
|---|---|
| `auth` | Login, segurança, tenant, organização |
| `google-workspace` | Google Drive, Sheets, OAuth |
| `whatsapp` | Canal de mensagens, CRM integrado |
| `clients` | Gestão de clientes, funil de vendas |
| `inventory` | Estoque e movimentações |
| `ai` | Gemini AI, automação preditiva |
| `site-builder` | Editor visual de sites |
| `reports` | Dashboard e relatórios |
| `shared` | Shared Kernel — componentes e serviços reutilizáveis |

---

## Regras de Importação

- `domains/*` → `domains/shared` ✅
- `apps/*` → `domains/*` ✅
- `domains/shared` → qualquer domínio ❌ (proibido)
- Importação circular entre domínios ❌ (proibido)

---

## Deployment

- **CI**: GitHub Actions (`.github/workflows/ci.yaml`) — roda em todo PR
- **CD**: Google Cloud Build (`infra/gcp/cloudbuild.yaml`) → Cloud Run `us-central1`
- **Secrets**: GCP Secret Manager (nunca no repositório)
