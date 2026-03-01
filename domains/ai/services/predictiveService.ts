import { Asset, PredictiveAlert } from '@shared/types/common.types';

// Thresholds (em dias) entre manutenções por tipo de equipamento HVAC
const MAINTENANCE_THRESHOLDS: Record<string, number> = {
  'Split': 90,       // 3 meses
  'Cassete': 60,     // 2 meses
  'Industrial': 30,  // 1 mês
};
const DEFAULT_THRESHOLD = 90;

export const predictiveService = {
  calculateRiskScore(asset: Asset): PredictiveAlert {
    const threshold = MAINTENANCE_THRESHOLDS[asset.type] ?? DEFAULT_THRESHOLD;

    const lastMaintDate = asset.lastMaintenance ? new Date(asset.lastMaintenance) : null;
    const daysSince = lastMaintDate
      ? Math.floor((Date.now() - lastMaintDate.getTime()) / 86_400_000)
      : 9999; // sem histórico = risco máximo

    const daysOverdue = daysSince - threshold;
    const severity: PredictiveAlert['severity'] =
      daysOverdue > 30 ? 'critical' : daysOverdue > 0 ? 'warning' : 'ok';

    // Sugere agendamento para daqui 7 dias
    const suggestedMaintenanceDate = new Date(Date.now() + 7 * 86_400_000).toISOString();

    return {
      assetId: asset.id,
      clientId: asset.clientId,
      assetType: asset.type,
      brand: asset.brand,
      model: asset.model,
      severity,
      daysSinceLastMaintenance: daysSince,
      daysOverdue,
      thresholdDays: threshold,
      suggestedMaintenanceDate,
    };
  },

  analyzeAssetsRisk(assets: Asset[]): PredictiveAlert[] {
    return assets
      .map((a) => this.calculateRiskScore(a))
      .filter((a) => a.severity !== 'ok')
      .sort((a, b) => b.daysOverdue - a.daysOverdue); // mais críticos primeiro
  },
};
