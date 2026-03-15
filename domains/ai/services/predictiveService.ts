import { Asset, PredictiveAlert } from '@shared/types/common.types';
import { aiService } from '@ai';
import { APP_CONFIG } from '@shared/config/config';

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

  /**
   * Proactive AI Analysis of Telemetry and History
   */
  async analyzeTelemetryWithAI(asset: Asset, telemetry: Record<string, unknown>[]): Promise<{ riskLevel: string; summary: string; anomalies: string[] }> {
    const prompt = `
      Analise os dados técnicos e de telemetria do seguinte ativo HVAC:
      Ativo: ${asset.brand} ${asset.model} (${asset.type})
      Última Manutenção: ${asset.lastMaintenance || 'Nenhuma registrada'}
      Telemetria Recente: ${JSON.stringify(telemetry)}

      Identifique anomalias (ex: vibração excessiva, temperatura fora do range, consumo de corrente elevado).
      Retorne um JSON com:
      - riskLevel: 'low', 'medium', 'high', 'critical'
      - summary: um resumo técnico curto do diagnóstico
      - anomalies: lista de strings com as anomalias detectadas
    `;

    try {
      const text = await aiService.chat(prompt, {
        model: APP_CONFIG.AI.MODELS.FAST,
        responseFormat: "json",
        systemPrompt: "Você é um sistema especialista em manutenção preditiva de HVAC. Analise dados de sensores e histórico para prever falhas."
      });

      return JSON.parse(text);
    } catch (error) {
      console.error('[PredictiveService] AI Analysis failed:', error);
      return {
        riskLevel: 'medium',
        summary: 'Falha na análise de IA. Baseado apenas no tempo de uso.',
        anomalies: ['Análise de telemetria indisponível']
      };
    }
  },

  analyzeAssetsRisk(assets: Asset[]): PredictiveAlert[] {
    return assets
      .map((a) => this.calculateRiskScore(a))
      .filter((a) => a.severity !== 'ok')
      .sort((a, b) => b.daysOverdue - a.daysOverdue); // mais críticos primeiro
  },
};

