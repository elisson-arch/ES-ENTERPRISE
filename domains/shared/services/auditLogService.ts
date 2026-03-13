
import { AuditLogEvent } from '@shared/types/common.types';
import { firestoreService } from './firestoreService';

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

export const auditLogService = {
  /**
   * Registra um evento de integração/sincronização no Firestore.
   * O id e o timestamp são gerados automaticamente.
   */
  async recordSyncEvent(
    event: Omit<AuditLogEvent, 'id' | 'timestamp'>
  ): Promise<void> {
    if (!event.organizationId) throw new Error('organizationId é obrigatório no audit log.');

    const payload: Omit<AuditLogEvent, 'id'> = {
      ...event,
      timestamp: new Date().toISOString()
    };

    const cleanedPayload = cleanUndefined(payload);

    await firestoreService.add(COLLECTION_NAME, cleanedPayload);
  }
};
