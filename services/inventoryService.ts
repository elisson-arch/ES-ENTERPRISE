
import { firestoreService } from './firestoreService';
import { Asset } from '../types';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

const COLLECTION_NAME = 'assets';

export const inventoryService = {
    // Obter todos os ativos de uma organização
    async getAssetsByOrg(orgId: string): Promise<Asset[]> {
        return firestoreService.query<Asset>(COLLECTION_NAME,
            where('organizationId', '==', orgId)
        );
    },

    // Obter ativos de um cliente específico
    async getAssetsByClient(clientId: string): Promise<Asset[]> {
        return firestoreService.query<Asset>(COLLECTION_NAME,
            where('clientId', '==', clientId)
        );
    },

    // Criar novo ativo
    async createAsset(asset: Omit<Asset, 'id'>): Promise<string> {
        const assetData = {
            ...asset,
            updatedAt: new Date().toISOString()
        };
        return firestoreService.add(COLLECTION_NAME, assetData);
    },

    // Atualizar ativo existente
    async updateAsset(id: string, data: Partial<Asset>): Promise<void> {
        const updateData = {
            ...data,
            updatedAt: new Date().toISOString()
        };
        return firestoreService.update(COLLECTION_NAME, id, updateData);
    },

    // Deletar ativo
    async deleteAsset(id: string): Promise<void> {
        return firestoreService.delete(COLLECTION_NAME, id);
    },

    // Inscrição em tempo real para ativos da organização
    subscribeToAssets(orgId: string, callback: (assets: Asset[]) => void) {
        const q = query(
            collection(db, COLLECTION_NAME),
            where('organizationId', '==', orgId)
        );

        return onSnapshot(q, (snapshot) => {
            const assets = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Asset[];
            callback(assets);
        });
    }
};
