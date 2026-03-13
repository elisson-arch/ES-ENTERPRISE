import { firestoreService } from './firestoreService';

type AuditAction =
  | 'CLIENT_CREATE'
  | 'CLIENT_UPDATE'
  | 'CLIENT_DELETE'
  | 'CLIENT_SYNC'
  | 'CLIENT_CONFLICT_RESOLVE'
  | 'ASSET_CREATE'
  | 'ASSET_UPDATE'
  | 'ASSET_DELETE'
  | 'SITE_PUBLISHED'
  | 'SITE_UPDATED'
  | 'SITE_SUSPENDED';

interface AuditLogInput {
  organizationId: string;
  entityType: 'client' | 'asset' | 'sync' | 'site';
  entityId: string;
  action: AuditAction;
  actorId?: string;
  actorName?: string;
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
  metadata?: Record<string, unknown>;
}

const COLLECTION_NAME = 'audit_logs';

const cleanUndefined = (obj: any): any => {
  if (obj === undefined) return undefined;
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return obj;
  if (Array.isArray(obj)) {
    return obj.map(cleanUndefined).filter(v => v !== undefined);
  }
  
  const cleaned: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const val = cleanUndefined(obj[key]);
      if (val !== undefined) {
        cleaned[key] = val;
      }
    }
  }
  return cleaned;
};

export const auditService = {
  async log(input: AuditLogInput): Promise<string> {
    const payload: any = {
      ...input,
      actorId: input.actorId || 'system',
      actorName: input.actorName || 'ES Enterprise',
      createdAt: new Date().toISOString()
    };
    
    // Remove undefined values recursively to prevent Firestore errors
    const cleanedPayload = cleanUndefined(payload);

    return firestoreService.add(COLLECTION_NAME, cleanedPayload);
  }
};
