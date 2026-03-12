
import { firestoreService } from '@shared/services/firestoreService';
import { Asset } from '@shared/types/common.types';
import { collection, query, where, onSnapshot, runTransaction, doc, arrayUnion } from 'firebase/firestore';
import { db } from '@shared/config/firebase';
import { auditService } from '@shared/services/auditService';
import { tenantService } from '@domains/auth/services/tenantService';

const COLLECTION_NAME = 'assets';
const resolveOrgId = (orgId?: string) => orgId || tenantService.getCurrentOrgId();

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
        const now = new Date().toISOString();
        const assetRef = doc(collection(db, COLLECTION_NAME));
        const clientRef = doc(db, 'clients', asset.clientId);

        await runTransaction(db, async (tx) => {
            const clientSnap = await tx.get(clientRef);
            if (!clientSnap.exists()) {
                throw new Error(`Cliente não encontrado para vínculo do ativo: ${asset.clientId}`);
            }

            tx.set(assetRef, {
                ...asset,
                updatedAt: now
            });

            tx.update(clientRef, {
                linkedAssetIds: arrayUnion(assetRef.id),
                updatedAt: now
            });
        });

        await auditService.log({
            organizationId: resolveOrgId(asset.organizationId),
            entityType: 'asset',
            entityId: assetRef.id,
            action: 'ASSET_CREATE',
            after: { ...asset, id: assetRef.id }
        });

        return assetRef.id;
    },

    // Atualizar ativo existente
    async updateAsset(id: string, data: Partial<Asset>): Promise<void> {
        const updateData = {
            ...data,
            updatedAt: new Date().toISOString()
        };
        await firestoreService.update(COLLECTION_NAME, id, updateData);
        await auditService.log({
            organizationId: resolveOrgId(data.organizationId),
            entityType: 'asset',
            entityId: id,
            action: 'ASSET_UPDATE',
            after: updateData as Record<string, unknown>
        });
    },

    // Deletar ativo
    async deleteAsset(id: string, organizationId?: string): Promise<void> {
        await firestoreService.delete(COLLECTION_NAME, id);
        await auditService.log({
            organizationId: resolveOrgId(organizationId),
            entityType: 'asset',
            entityId: id,
            action: 'ASSET_DELETE'
        });
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
