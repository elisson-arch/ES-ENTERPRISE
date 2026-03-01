import { googleApiService } from './googleApiService';

const STORAGE_KEY = 'es_active_org_id';
const FALLBACK_ORG_ID = 'org_123';

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 40);

const deriveOrgIdFromEmail = (email?: string) => {
  if (!email || !email.includes('@')) return FALLBACK_ORG_ID;
  const domain = email.split('@')[1] || '';
  const base = slugify(domain);
  if (!base) return FALLBACK_ORG_ID;
  return `org_${base}`;
};

export const tenantService = {
  getCurrentOrgId(): string {
    const fromStorage = localStorage.getItem(STORAGE_KEY);
    if (fromStorage) return fromStorage;

    const email = googleApiService.getUserProfile()?.email;
    return deriveOrgIdFromEmail(email);
  },

  setCurrentOrgId(orgId: string) {
    localStorage.setItem(STORAGE_KEY, orgId);
  },

  clearCurrentOrgId() {
    localStorage.removeItem(STORAGE_KEY);
  },

  resolveAndPersistFromSession(): string {
    const derived = deriveOrgIdFromEmail(googleApiService.getUserProfile()?.email);
    localStorage.setItem(STORAGE_KEY, derived);
    return derived;
  }
};
