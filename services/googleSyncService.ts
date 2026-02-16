
import { Client, SyncLog } from '../types';

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
  }
};
