// clients.types.ts — Clients domain types

export interface Client {
    id: string;
    clientCode?: string;
    name: string;
    legalName?: string;
    document: string;
    email: string;
    phone: string;
    address: string;
    city?: string;
    state?: string;
    zipCode?: string;
    type: 'Residencial' | 'Comercial';
    assets: Asset[];
    linkedAssetIds?: string[];
    origin: 'Google' | 'Manual' | 'Site' | 'WhatsApp';
    notes?: string;
    syncTimestamp?: string;
    googleContactId?: string;
    lastSyncAt?: string;
    updatedAt: string;
    organizationId: string;
    drive_folder_id?: string;
    additionalEmails?: string[];
    additionalPhones?: string[];
    status: 'Ativo' | 'Inativo' | 'Prospecção';
}

export interface Asset {
    id: string;
    clientId: string;
    type: string;
    brand: string;
    model: string;
    serialNumber: string;
    installationDate: string;
    lastMaintenance?: string;
    organizationId?: string;
}

// V2 Firestore contracts
export interface ClientContactV2 {
    phone: string;
    email: string;
}

export interface ClientAddressV2 {
    street: string;
    number: string;
    district?: string;
    city: string;
    state: string;
    zipCode: string;
    geo?: { lat: number; lng: number };
    geohash?: string;
}

export interface ClientMetricsV2 {
    totalSpent: number;
    lifetimeValue: number;
    openOrders: number;
}

export interface ClientDocV2 {
    id: string;
    clientCode: string;
    name: string;
    legalName?: string;
    document: string;
    contact: ClientContactV2;
    address: ClientAddressV2;
    funnel: { stage: string; updatedAt: string };
    metrics: ClientMetricsV2;
    status: 'Ativo' | 'Inativo' | 'Prospecção';
    origin: 'Manual' | 'Google' | 'Site' | 'WhatsApp';
    tags?: string[];
    notes?: string;
    createdAt: string;
    updatedAt: string;
}
