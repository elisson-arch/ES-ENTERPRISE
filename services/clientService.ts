
import { where } from "firebase/firestore";
import { firestoreService } from "./firestoreService";
import { Client } from "../types";
export type { Client };

const COLLECTION_NAME = "clients";

export const clientService = {
    /**
     * Obtém todos os clientes de uma organização
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
     * Subscreve para mudanças em tempo real na lista de clientes
     */
    subscribeToClients(callback: (clients: Client[]) => void) {
        return firestoreService.subscribe<Client>(COLLECTION_NAME, callback);
    },

    /**
     * Cria ou atualiza um cliente pelo googleContactId (upsert).
     * Garante isolamento por organizationId antes de qualquer escrita.
     */
    async upsertByGoogleId(
        googleContactId: string,
        data: Partial<Client>,
        organizationId: string
    ): Promise<string> {
        if (!organizationId) throw new Error('organizationId é obrigatório para upsert.');

        const existing = await firestoreService.query<Client>(
            COLLECTION_NAME,
            where('googleContactId', '==', googleContactId),
            where('organizationId', '==', organizationId)
        );

        if (existing.length > 0) {
            await firestoreService.update(COLLECTION_NAME, existing[0].id, data);
            return existing[0].id;
        }

        const now = new Date().toISOString();
        const newClient: Omit<Client, 'id'> = {
            name: data.name ?? 'Sem Nome',
            document: data.document ?? '',
            email: data.email ?? '',
            phone: data.phone ?? '',
            address: data.address ?? '',
            type: data.type ?? 'Residencial',
            assets: data.assets ?? [],
            origin: 'Google',
            status: data.status ?? 'Ativo',
            organizationId,
            googleContactId,
            syncTimestamp: now,
            lastSyncAt: now,
            updatedAt: now,
            ...data
        };
        return firestoreService.add(COLLECTION_NAME, newClient);
    }
};
