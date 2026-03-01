// reports.types.ts — Reports domain types

export interface DashboardDailyViewDocV2 {
    id: string;
    date: string; // yyyyMMdd
    newClients: number;
    ordersOpen: number;
    ordersCompleted: number;
    revenue: number;
    topRisks: Array<{ assetId: string; riskLevel: string }>;
}
