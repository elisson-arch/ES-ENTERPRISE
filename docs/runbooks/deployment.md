# Deployment Runbook — ES-ENTERPRISE

## Pré-requisitos (GCP)

1. **Artifact Registry** — criar repositório:
   ```bash
   gcloud artifacts repositories create es-enterprise-repo \
     --repository-format=docker \
     --location=us-central1
   ```

2. **Cloud Run API** — habilitar:
   ```bash
   gcloud services enable run.googleapis.com
   ```

3. **Workload Identity Federation** — para o GitHub Actions autenticar sem chave SA:
   ```bash
   gcloud iam workload-identity-pools create github-pool \
     --location=global --display-name="GitHub Actions Pool"
   ```
   Adicionar ao GitHub Secrets:
   - `GCP_PROJECT_ID`
   - `GCP_WORKLOAD_IDENTITY_PROVIDER`
   - `GCP_SERVICE_ACCOUNT`

---

## Deploy Manual (emergência)

```bash
# 1. Build
docker build -f infra/docker/Dockerfile -t es-enterprise .

# 2. Tag e push
docker tag es-enterprise us-central1-docker.pkg.dev/PROJECT_ID/es-enterprise-repo/es-enterprise:manual
docker push us-central1-docker.pkg.dev/PROJECT_ID/es-enterprise-repo/es-enterprise:manual

# 3. Deploy
gcloud run deploy es-enterprise \
  --image us-central1-docker.pkg.dev/PROJECT_ID/es-enterprise-repo/es-enterprise:manual \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated
```

---

## Rollback

```bash
gcloud run revisions list --service es-enterprise --region us-central1
gcloud run services update-traffic es-enterprise \
  --to-revisions REVISION_ID=100 \
  --region us-central1
```

---

## Health Check

```bash
curl https://SERVICE_URL/healthz
# Esperado: 200 OK
```
