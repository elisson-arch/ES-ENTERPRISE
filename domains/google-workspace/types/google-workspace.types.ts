// google-workspace.types.ts — Google Workspace domain types

export interface GoogleToken {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
    scopes: string[];
}

export interface DriveFile {
    id: string;
    name: string;
    mimeType: string;
    webViewLink: string;
    size?: string;
    modifiedTime: string;
}

export interface GoogleTask {
    id: string;
    title: string;
    status: string;
    due?: string;
    notes?: string;
}

export interface GmailMessage {
    id: string;
    threadId: string;
    snippet: string;
    payload?: any;
}

export interface CalendarEvent {
    id: string;
    summary: string;
    start: string;
    end: string;
    location?: string;
}

export interface SyncLog {
    id: string;
    clientName: string;
    service: 'CONTACTS' | 'CALENDAR' | 'DRIVE' | 'GMAIL' | 'SHEETS' | 'TASKS' | 'AUTH';
    action: string;
    status: 'success' | 'failure';
    details: string;
    timestamp: string;
}

export interface TenantDriveFileDoc {
    id: string;
    organizationId: string;
    provider: 'google_drive';
    providerFileId: string;
    folderId?: string;
    name: string;
    mimeType: string;
    webViewLink: string;
    sizeBytes?: number;
    category: 'clients' | 'company' | 'all';
    status: 'active' | 'deleted';
    linkedEntityType?: 'client' | 'asset' | 'order' | 'chat' | 'generic';
    linkedEntityId?: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
}
