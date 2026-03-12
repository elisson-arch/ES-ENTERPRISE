
import { where } from 'firebase/firestore';
import { firestoreService } from '@shared/services/firestoreService';
import { Client } from '@domains/clients/types/clients.types';

export type { Client };

const COLLECTION_NAME = "clients";

export const clientService = {
    /**
     * Obtem todos os clientes de uma organizacao
     */
    async getClientsByOrg(orgId: string): Promise<Client[]> {
        return firestoreService.query<Client>(COLLECTION_NAME, where('organizationId', '==', orgId));
    },

    /**
     * Adiciona um novo cliente
     */
    async createClient(client: Omit<Client, 'id'>): Promise<string> {
        return firestoreService.add(COLLECTION_NAME, client);
    },

    /**
     * Atualiza dados de um cliente
     */
    async updateClient(id: string, updates: Partial<Client>): Promise<void> {
        return firestoreService.update(COLLECTION_NAME, id, updates);
    },

    /**
     * Remove um cliente
     */
    async deleteClient(id: string): Promise<void> {
        return firestoreService.delete(COLLECTION_NAME, id);
    },

    /**
     * Subscreve para mudancas em tempo real na lista de clientes
     */
    subscribeToClients(orgId: string, callback: (clients: Client[]) => void) {
        return firestoreService.subscribe<Client>(COLLECTION_NAME, callback, where('organizationId', '==', orgId));
    },

    /**
     * Insere ou atualiza um cliente pelo ID do contato Google.
     */
    async upsertByGoogleId(googleContactId: string, data: Partial<Client>, orgId: string): Promise<string> {
        const existing = await firestoreService.query<Client>(
            COLLECTION_NAME,
            where('googleContactId', '==', googleContactId),
            where('organizationId', '==', orgId)
        );
        if (existing.length > 0) {
            await firestoreService.update(COLLECTION_NAME, existing[0].id, data);
            return existing[0].id;
        }
        return firestoreService.add(COLLECTION_NAME, { ...data, organizationId: orgId } as Client);
    }
};
