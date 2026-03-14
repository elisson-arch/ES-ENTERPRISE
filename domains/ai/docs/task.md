# ES-ENTERPRISE Improvements

## 1. Segurança no Endpoint de IA
- [x] Add Firebase Auth token verification middleware to `/api/ai/generate`
- [x] Install and configure `express-rate-limit` on `/api/ai/generate`

## 2. Frontend Error Monitoring
- [x] Integrate Sentry inside `componentDidCatch` in `apps/web/index.tsx`
- [x] Remove diagnostic `console.log` statements from `index.tsx`

## 3. Initial Load Latency (Firebase Config)
- [x] Migrate Firebase config from `/api/config-secure` fetch to `VITE_FIREBASE_*` env variables
- [x] Update `.env.example` with new env var names (VITE_SENTRY_DSN, FIREBASE_SERVICE_ACCOUNT_JSON)
- [x] Removed `/api/config-secure` endpoint from `server.ts`
- [x] Removed `loadSecureConfig()` from `config.ts` and barrel export in `shared/index.ts`

## 4. Monorepo Cleanup (Bazel)
- [x] Removed all 13 Bazel files (`BUILD.bazel`, `MODULE.bazel` across root + all domains/apps)
