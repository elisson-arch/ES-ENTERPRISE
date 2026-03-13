import { where } from 'firebase/firestore';
import { firestoreService, auditService } from '@shared';
import { googleApiService } from './googleApiService';
import { TenantDriveFileDoc } from '@google-workspace/types/google-workspace.types';

const collectionPath = (orgId: string) => `organizations/${orgId}/drive_files`;

type UploadContext = {
  category: 'clients' | 'company' | 'all';
  linkedEntityType?: 'client' | 'asset' | 'order' | 'chat' | 'generic';
  linkedEntityId?: string;
};

export const driveFileService = {
  async uploadTenantFile(orgId: string, file: File, context: UploadContext): Promise<string> {
    const folderId = await googleApiService.ensureTenantDriveFolder(orgId);
    const uploaded = await googleApiService.uploadFileToDrive(file, folderId);
    const now = new Date().toISOString();

    const payload: any = {
      organizationId: orgId,
      provider: 'google_drive',
      providerFileId: uploaded.id,
      folderId,
      name: uploaded.name,
      mimeType: uploaded.mimeType,
      webViewLink: uploaded.webViewLink,
      category: context.category,
      status: 'active',
      linkedEntityType: context.linkedEntityType,
      linkedEntityId: context.linkedEntityId,
      createdAt: now,
      updatedAt: now
    };
    if (uploaded.size) payload.sizeBytes = Number(uploaded.size);

    // Remove undefined values
    Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

    const docId = await firestoreService.add(collectionPath(orgId), payload);
    await auditService.log({
      organizationId: orgId,
      entityType: 'asset',
      entityId: docId,
      action: 'ASSET_CREATE',
      after: payload as unknown as Record<string, unknown>,
      metadata: { domain: 'drive_file' }
    });
    return docId;
  },

  async listTenantFiles(orgId: string): Promise<TenantDriveFileDoc[]> {
    return firestoreService.query<TenantDriveFileDoc>(
      collectionPath(orgId),
      where('status', '==', 'active')
    );
  },

  async getFilesByClient(orgId: string, clientId: string): Promise<TenantDriveFileDoc[]> {
    return firestoreService.query<TenantDriveFileDoc>(
      collectionPath(orgId),
      where('linkedEntityId', '==', clientId),
      where('status', '==', 'active')
    );
  },

  async refreshFromDrive(orgId: string): Promise<number> {
    const remoteFiles = await googleApiService.listFiles();
    let upserted = 0;

    for (const file of remoteFiles) {
      const matches = await firestoreService.query<TenantDriveFileDoc>(
        collectionPath(orgId),
        where('providerFileId', '==', file.id)
      );

      const patch: any = {
        name: file.name,
        mimeType: file.mimeType,
        webViewLink: file.webViewLink,
        updatedAt: new Date().toISOString(),
        status: 'active' as const
      };
      if (file.size) patch.sizeBytes = Number(file.size);

      if (matches.length > 0) {
        await firestoreService.update(collectionPath(orgId), matches[0].id, patch);
      } else {
        const now = new Date().toISOString();
        const newDoc: any = {
          organizationId: orgId,
          provider: 'google_drive',
          providerFileId: file.id,
          name: file.name,
          mimeType: file.mimeType,
          webViewLink: file.webViewLink,
          category: 'company',
          status: 'active',
          createdAt: now,
          updatedAt: now
        };
        if (file.size) newDoc.sizeBytes = Number(file.size);
        await firestoreService.add(collectionPath(orgId), newDoc);
      }
      upserted += 1;
    }

    await auditService.log({
      organizationId: orgId,
      entityType: 'sync',
      entityId: `drive_sync_${Date.now()}`,
      action: 'CLIENT_SYNC',
      metadata: { domain: 'drive', upserted, remoteCount: remoteFiles.length }
    });
    return upserted;
  },

  async softDeleteTenantFile(orgId: string, fileDocId: string, removeFromDrive = false): Promise<void> {
    const doc = await firestoreService.getById<TenantDriveFileDoc>(collectionPath(orgId), fileDocId);
    if (!doc) return;

    await firestoreService.update(collectionPath(orgId), fileDocId, {
      status: 'deleted',
      deletedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    if (removeFromDrive) {
      await googleApiService.trashDriveFile(doc.providerFileId);
    }

    await auditService.log({
      organizationId: orgId,
      entityType: 'asset',
      entityId: fileDocId,
      action: 'ASSET_DELETE',
      metadata: { domain: 'drive_file', removeFromDrive }
    });
  }
};
