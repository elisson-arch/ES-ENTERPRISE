
import { AuditLogEvent } from '../types';
import { firestoreService } from './firestoreService';

const COLLECTION_NAME = 'audit_logs';

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

    await firestoreService.add(COLLECTION_NAME, payload);
  }
};
