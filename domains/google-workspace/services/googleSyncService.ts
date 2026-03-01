
import { Client } from '../types';
import { googleApiService } from './googleApiService';
import { clientService } from './clientService';
import { auditLogService } from './auditLogService';

/**
 * googleSyncService v3.0 - Professional Edition
 * Motor de sincronização otimizado para alta performance e dados reais de manutenção.
 */
export const googleSyncService = {
  mapGoogleToCRM(googleData: any): Partial<Client> {
    return {
      name: googleData.name || 'Sem Nome',
      email: googleData.emails?.[0] || '',
      additionalEmails: googleData.emails?.slice(1) || [],
      phone: googleData.phones?.[0] || '',
      additionalPhones: googleData.phones?.slice(1) || [],
      address: googleData.address || '',
      notes: googleData.notes || '',
      origin: 'Google',
      syncTimestamp: new Date().toISOString()
    };
  },

  async pullFromGoogle(): Promise<any[]> {
    // Simulação de busca real em API de Contatos do Google Workspace
    await new Promise(resolve => setTimeout(resolve, 800));

    return [
      {
        googleContactId: 'roberto_pro_001',
        name: 'Roberto Manutenções',
        emails: ['contato@robertomanutencoes.com.br'],
        phones: ['(11) 97777-6666'],
        address: 'Rua Augusta, 1200 - Consolação, SP',
        notes: 'Lead profissional: Focar em manutenção preventiva residencial.',
        type: 'Residencial',
        status: 'Prospecção'
      },
      {
        googleContactId: 'google_xyz123',
        name: 'Condomínio Residencial Aurora',
        emails: ['contato@aurora.com.br', 'financeiro@aurora.com.br'],
        phones: ['(11) 98765-4321', '(11) 3344-5566'],
        address: 'Av. das Flores, 450 - SP',
        notes: 'Contrato de manutenção industrial ativo.'
      },
      {
        googleContactId: 'google_hosp_002',
        name: 'Hospital Central Mater',
        emails: ['manutencao@centralmater.com.br'],
        phones: ['(11) 2233-4455'],
        address: 'Rua da Paz, 500 - Santo Amaro, SP',
        notes: 'Troca de chillers pendente para Q3.'
      }
    ];
  },

  detectConflict(crmClient: Client, googleVersion: Partial<Client>): { hasConflict: boolean, fields: string[] } {
    const conflictingFields: string[] = [];
    if (crmClient.email !== googleVersion.email) conflictingFields.push('E-mail');
    if (crmClient.phone !== googleVersion.phone) conflictingFields.push('Telefone');

    const isDirty = crmClient.lastSyncAt && new Date(crmClient.updatedAt) > new Date(crmClient.lastSyncAt);

    return {
      hasConflict: isDirty && conflictingFields.length > 0,
      fields: conflictingFields
    };
  },

  /**
   * Worker: sincroniza Google Contacts → Firestore para uma organização.
   * O token OAuth do cliente NUNCA é persistido; opera apenas em memória de sessão.
   */
  async syncContactsToFirestore(
    organizationId: string,
    userId: string
  ): Promise<{ imported: number; skipped: number; errors: string[] }> {
    if (!organizationId) throw new Error('organizationId obrigatório para sync.');

    const result = { imported: 0, skipped: 0, errors: [] as string[] };

    let connections: any[];
    try {
      connections = await googleApiService.fetchPeopleConnections();
    } catch (e: any) {
      result.errors.push(`Falha ao buscar contatos da People API: ${e.message}`);
      return result;
    }

    for (const person of connections) {
      const name = person.names?.[0]?.displayName;
      const phones: string[] = (person.phoneNumbers ?? []).map((p: any) => p.value);
      const emails: string[] = (person.emailAddresses ?? []).map((e: any) => e.value);

      if (!name || (phones.length === 0 && emails.length === 0)) {
        result.skipped++;
        continue;
      }

      try {
        const now = new Date().toISOString();
        const data: Partial<Client> = {
          name,
          email: emails[0] ?? '',
          additionalEmails: emails.slice(1),
          phone: phones[0] ?? '',
          additionalPhones: phones.slice(1),
          origin: 'Google',
          status: 'Ativo',
          organizationId,
          googleContactId: person.resourceName,
          syncTimestamp: now,
          lastSyncAt: now,
          updatedAt: now
        };

        await clientService.upsertByGoogleId(person.resourceName, data, organizationId);
        result.imported++;
      } catch (e: any) {
        result.errors.push(`Erro ao importar "${name}": ${e.message}`);
      }
    }

    await auditLogService.recordSyncEvent({
      organizationId,
      userId,
      eventType: 'CONTACTS_SYNC',
      details: {
        contactsImported: result.imported,
        contactsSkipped: result.skipped,
        errors: result.errors
      }
    });

    return result;
  },

  /**
   * Arquitetura de storage distribuído: garante pasta "! ES-ENTERPRISE/{clientName}"
   * no Drive do cliente e armazena drive_folder_id no Firestore.
   * Arquivos residem no Drive do CLIENTE — nunca no projeto principal.
   */
  async ensureDriveFolderStructure(
    clientId: string,
    clientName: string,
    organizationId: string,
    userId: string
  ): Promise<string> {
    if (!organizationId) throw new Error('organizationId obrigatório para criar estrutura de Drive.');

    const ROOT_FOLDER = '! ES-ENTERPRISE';

    let rootId = await googleApiService.findDriveFolder(ROOT_FOLDER);
    if (!rootId) {
      rootId = await googleApiService.createDriveFolder(ROOT_FOLDER);
    }

    const subFolderId = await googleApiService.createDriveFolder(clientName, rootId);

    await clientService.updateClient(clientId, { drive_folder_id: subFolderId });

    await auditLogService.recordSyncEvent({
      organizationId,
      userId,
      eventType: 'DRIVE_FOLDER_CREATED',
      details: {
        masterFolderId: rootId,
        clientFolderIds: [subFolderId]
      }
    });

    return subFolderId;
  }
};
