// common.types.ts — Shared Kernel types

export type NotificationType =
    | 'message'
    | 'funnel'
    | 'sla'
    | 'success'
    | 'upload'
    | 'automation'
    | 'predictive';

export interface AppNotification {
    id: string;
    type: NotificationType;
    title: string;
    description: string;
    timestamp: string;
    isRead: boolean;
    priority?: 'low' | 'medium' | 'high';
}

export interface OnboardingTask {
    id: string;
    title: string;
    description: string;
    isCompleted: boolean;
    link: string;
}

export interface AuditLog {
    id: string;
    userId: string;
    userName: string;
    action: string;
    resource: string;
    ip: string;
    device: string;
    timestamp: string;
    severity: 'low' | 'medium' | 'high';
}

export interface AuditLogEvent {
    id: string;
    organizationId: string;
    eventType:
    | 'CONTACTS_SYNC'
    | 'DRIVE_FOLDER_CREATED'
    | 'FILE_UPLOADED'
    | 'ONBOARDING_COMPLETE';
    timestamp: string;
    details: {
        contactsImported?: number;
        contactsSkipped?: number;
        masterFolderId?: string;
        clientFolderIds?: string[];
        errors?: string[];
    };
    userId: string;
}

export interface AuditLogDocV2 {
    id: string;
    organizationId: string;
    entityType: 'client' | 'asset' | 'order' | 'chat' | 'sync';
    entityId: string;
    action: string;
    actorId: string;
    actorName: string;
    before?: Record<string, unknown> | null;
    after?: Record<string, unknown> | null;
    metadata?: Record<string, unknown>;
    createdAt: string;
}

// ─── Domain type re-exports (backwards-compatibility) ────────────────────────
export type { Client, Asset } from '@clients/types/clients.types';
export type { GoogleToken, DriveFile, CalendarEvent, GmailMessage, SyncLog, TenantDriveFileDoc } from '@google-workspace/types/google-workspace.types';
export type { ClientTask, ChatSession, Message, ChatTemplate } from '@whatsapp/types/whatsapp.types';
export type { PredictiveAlert } from '@inventory/types/inventory.types';
export type { SiteDNA, SiteElement } from '@site-builder/types/site-builder.types';
