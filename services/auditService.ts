import { firestoreService } from './firestoreService';

type AuditAction =
  | 'CLIENT_CREATE'
  | 'CLIENT_UPDATE'
  | 'CLIENT_DELETE'
  | 'CLIENT_SYNC'
  | 'CLIENT_CONFLICT_RESOLVE'
  | 'ASSET_CREATE'
  | 'ASSET_UPDATE'
  | 'ASSET_DELETE';

interface AuditLogInput {
  organizationId: string;
  entityType: 'client' | 'asset' | 'sync';
  entityId: string;
  action: AuditAction;
  actorId?: string;
  actorName?: string;
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
  metadata?: Record<string, unknown>;
}

const COLLECTION_NAME = 'audit_logs';

export const auditService = {
  async log(input: AuditLogInput): Promise<string> {
    const payload = {
      ...input,
      actorId: input.actorId || 'system',
      actorName: input.actorName || 'ES Enterprise',
      createdAt: new Date().toISOString()
    };
    return firestoreService.add(COLLECTION_NAME, payload);
  }
};
