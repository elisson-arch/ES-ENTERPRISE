// inventory.types.ts — Inventory domain types

export interface AssetHealthV2 {
    score: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    lastAnalysisAt: string;
}

export interface AssetMaintenanceV2 {
    lastDate?: string;
    nextDue?: string;
}

export interface AssetIotConfigV2 {
    gatewayId?: string;
    sensorTopic?: string;
    lastTelemetryAt?: string;
}

export interface AssetDocV2 {
    id: string;
    assetCode: string;
    clientId: string;
    type: string;
    brand: string;
    model: string;
    serialNumber: string;
    health: AssetHealthV2;
    maintenance: AssetMaintenanceV2;
    iot?: AssetIotConfigV2;
    status: 'active' | 'inactive' | 'maintenance';
    createdAt: string;
    updatedAt: string;
}

export interface PredictiveAlert {
    assetId: string;
    clientId: string;
    assetType: string;
    brand: string;
    model: string;
    severity: 'critical' | 'warning' | 'ok';
    daysSinceLastMaintenance: number;
    daysOverdue: number;
    thresholdDays: number;
    suggestedMaintenanceDate: string;
}

export interface OrderCheckPointV2 {
    time: string;
    location?: { lat: number; lng: number };
}

export interface OrderDocV2 {
    id: string;
    orderCode: string;
    clientId: string;
    assetId: string;
    technicianId: string;
    status: 'open' | 'in_progress' | 'paused' | 'completed' | 'canceled';
    priority: 'low' | 'medium' | 'high' | 'critical';
    slaDueAt?: string;
    checkIn?: OrderCheckPointV2;
    checkOut?: OrderCheckPointV2;
    technicalReport?: {
        diagnostic: string;
        partsUsed: string[];
    };
    aiAnalysis?: {
        summary: string;
        riskLevel: 'low' | 'medium' | 'high' | 'critical';
    };
    voiceTranscriptUrl?: string;
    createdAt: string;
    updatedAt: string;
}
