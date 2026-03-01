
import { firestoreService } from "./firestoreService";
import { Client } from "../types";

export type { Client };

const COLLECTION_NAME = "clients";

export const clientService = {
    /**
     * Obtem todos os clientes de uma organizacao
     */
    async getClientsByOrg(orgId: string): Promise<Client[]> {
        return firestoreService.query<Client>(COLLECTION_NAME,
            // Adicionar filtros quando necessário via QueryConstraint do Firestore
        );
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
    subscribeToClients(callback: (clients: Client[]) => void) {
        return firestoreService.subscribe<Client>(COLLECTION_NAME, callback);
    }
};
