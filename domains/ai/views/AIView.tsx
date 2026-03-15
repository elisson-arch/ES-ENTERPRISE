import React, { useState, useEffect } from 'react';
import {
  Zap, Brain, Activity, ShieldAlert,
  ChevronRight, ArrowUpRight, Thermometer,
  Gauge, TrendingUp, Bot,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { predictiveService } from '@ai';
import { Asset, PredictiveAlert } from '@shared/types/common.types';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

// --- MOCK DATA FOR SPARKLINE ---
const MOCK_TREND = [
  { value: 40 }, { value: 35 }, { value: 55 }, { value: 45 }, { value: 70 }, { value: 65 }, { value: 85 }
];

// --- MOCK DATA FOR DEMO ---
const MOCK_ASSETS: Asset[] = [
  { id: '1', clientId: 'c1', brand: 'Daikin', model: 'SkyAir RZQ', type: 'Industrial', lastMaintenance: '2025-12-01', installationDate: '2024-01-01', serialNumber: 'DK-99221' },
  { id: '2', clientId: 'c2', brand: 'Carrier', model: 'Infinity 26', type: 'Cassete', lastMaintenance: '2026-01-15', installationDate: '2024-02-01', serialNumber: 'CR-88112' },
  { id: '3', clientId: 'c3', brand: 'LG', model: 'Multi V S', type: 'Split', lastMaintenance: '2026-02-10', installationDate: '2024-03-01', serialNumber: 'LG-77663' },
  { id: '4', clientId: 'c1', brand: 'York', model: 'YVAA Chiller', type: 'Industrial', lastMaintenance: '2025-10-20', installationDate: '2024-04-01', serialNumber: 'YK-55441' },
];

// --- COMPONENTS ---

const InsightCard = ({ alert, onDetail }: { alert: PredictiveAlert, onDetail: (id: string) => void }) => {
  const isCritical = alert.severity === 'critical';
  const isWarning = alert.severity === 'warning';

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      className={`relative overflow-hidden bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl transition-all group ${
        isCritical ? 'hover:border-rose-200' : 'hover:border-indigo-200'
      }`}
    >
      {/* Dynamic Gradient Background on Hover */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${
        isCritical ? 'from-rose-500 to-transparent' : 'from-indigo-500 to-transparent'
      }`} />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className={`p-4 rounded-2xl ${
            isCritical ? 'bg-rose-50 text-rose-600' : isWarning ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
          }`}>
            <ShieldAlert size={24} />
          </div>
          <div className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border ${
            isCritical ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-amber-50 text-amber-600 border-amber-100'
          }`}>
            {isCritical ? 'Risco Crítico' : 'Atenção'}
          </div>
        </div>

        <div className="space-y-1 mb-6">
          <h4 className="text-md font-black text-slate-800 uppercase tracking-tighter truncate italic">{alert.brand} {alert.model}</h4>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{alert.assetType} • S/N: {alert.assetId}</p>
        </div>

        {/* Mini Sparkline Chart */}
        <div className="h-12 w-full mb-8 opacity-60 group-hover:opacity-100 transition-opacity">
          <p className="text-[7px] font-black text-slate-400 uppercase mb-2 tracking-widest">Tendência (7d)</p>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={MOCK_TREND}>
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={isCritical ? '#ef4444' : '#6366f1'} 
                strokeWidth={3} 
                dot={false}
                animationDuration={2000}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 bg-slate-50/50 rounded-3xl group-hover:bg-white transition-colors">
            <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Atraso</p>
            <p className={`text-sm font-black italic tracking-tighter ${isCritical ? 'text-rose-600' : 'text-slate-800'}`}>
              {alert.daysOverdue} dias
            </p>
          </div>
          <div className="p-4 bg-slate-50/50 rounded-3xl group-hover:bg-white transition-colors">
            <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Status</p>
            <p className="text-sm font-black italic tracking-tighter text-slate-800">Urgente</p>
          </div>
        </div>

        {/* Action Buttons visible only on hover */}
        <div className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
          <div className="flex gap-2">
            <button 
              onClick={() => onDetail(alert.assetId)}
              className="flex-1 flex items-center justify-center gap-2 p-4 bg-slate-950 text-white rounded-2xl hover:bg-slate-900 transition-all shadow-xl"
            >
              <span className="text-[9px] font-black uppercase tracking-widest">Inteligência</span>
              <ArrowUpRight size={14} />
            </button>
            <button className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-rose-500 hover:border-rose-100 transition-all">
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ExplainSidePanel = ({ assetId, onClose }: { assetId: string | null, onClose: () => void }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  useEffect(() => {
    if (assetId) {
      setIsAnalyzing(true);
      const timer = setTimeout(() => setIsAnalyzing(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [assetId]);

  return (
    <AnimatePresence>
      {assetId && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[100]" 
          />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.1)] z-[101] p-10 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-600 text-white rounded-2xl"><Bot size={24} /></div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter italic">Explainable AI</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Motor de Raciocínio Ricardo</p>
                </div>
              </div>
              <button onClick={onClose} className="p-3 hover:bg-slate-50 rounded-xl transition-all text-slate-400">
                <ChevronRight size={24} />
              </button>
            </div>

            {isAnalyzing ? (
              <div className="space-y-8 py-20 text-center">
                <RefreshCw size={48} className="mx-auto text-indigo-500 animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Decompondo variáveis técnicas...</p>
              </div>
            ) : (
              <div className="space-y-10">
                <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Diagnóstico do Ricardo</h4>
                  <p className="text-sm font-bold text-slate-700 leading-relaxed italic">
                    "Identifiquei uma correlação crítica entre o histórico de manutenção atrasado (45 dias) e o padrão de operação sob carga máxima detectado na telemetria. 
                    O risco de falha do compressor é iminente devido ao desgaste acumulado sem lubrificação preventiva."
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Variáveis de Cálculo</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                      <div className="flex items-center gap-4">
                        <Thermometer size={18} className="text-rose-500" />
                        <span className="text-[10px] font-black uppercase text-slate-800 tracking-tighter">Stress Térmico</span>
                      </div>
                      <span className="text-[10px] font-black text-rose-600 uppercase">+28% vs normal</span>
                    </div>
                    <div className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                      <div className="flex items-center gap-4">
                        <Gauge size={18} className="text-amber-500" />
                        <span className="text-[10px] font-black uppercase text-slate-800 tracking-tighter">Ciclo de Degradação</span>
                        {/* Fix: Added missing closing div tag */}
                      </div>
                      <span className="text-[10px] font-black text-amber-600 uppercase">92% de Limite</span>
                    </div>
                  </div>
                </div>

                <div className="pt-10 border-t border-slate-100">
                  <button className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 hover:scale-[1.02] transition-all">
                    Gerar Ordem de Serviço
                  </button>
                  <p className="text-center mt-6 text-[9px] font-bold text-slate-400 uppercase italic">
                    Ação automatizada disponível via Automation Center.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// --- VIEW ---

const AIView = () => {
  const [alerts, setAlerts] = useState<PredictiveAlert[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [globalHealth] = useState(84);

  useEffect(() => {
    const riskAlerts = predictiveService.analyzeAssetsRisk(MOCK_ASSETS);
    setAlerts(riskAlerts);
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 overflow-hidden">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 bg-slate-950 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl overflow-hidden">
              <Zap size={40} className="relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/40 to-violet-500/40 opacity-50" />
            </div>
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="absolute -inset-1 bg-indigo-500/10 blur-xl rounded-[2.5rem] -z-10" 
            />
          </div>
          <div>
            <h2 className="text-4xl font-black text-slate-800 italic uppercase tracking-tighter leading-none">Radar Preditivo</h2>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mt-3">Inteligência Operacional Ativa</p>
          </div>
        </div>

        <div className="flex items-center gap-10 bg-white/50 backdrop-blur p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-100" />
                <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray={150} strokeDashoffset={150 - (150 * globalHealth) / 100} className="text-indigo-600 transition-all duration-1000" />
              </svg>
              <span className="absolute text-sm font-black text-slate-800 italic">{globalHealth}%</span>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase">Saúde Global</p>
              <p className="text-xs font-black text-slate-800 uppercase italic">Base Instalada</p>
            </div>
          </div>
          <div className="h-10 w-px bg-slate-200" />
          <div className="flex flex-col items-center">
            <span className="text-2xl font-black text-slate-800 italic tracking-tighter">{alerts.length}</span>
            <span className="text-[9px] font-black text-rose-500 uppercase">Alertas</span>
          </div>
        </div>
      </header>

      {/* Actionable Insights Grid */}
      <section className="space-y-6">
        <div className="flex justify-between items-center px-2">
          <div className="flex items-center gap-3">
             <Activity className="text-indigo-600" size={18} />
             <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Painel de Riscos</h3>
          </div>
          <div className="flex gap-4">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                <span className="text-[9px] font-black text-slate-400 uppercase">Tempo Real</span>
             </div>
             <button className="text-[9px] font-black text-indigo-600 uppercase hover:underline">Ver Todos Histórico</button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {alerts.map((alert) => (
            <InsightCard 
              key={alert.assetId} 
              alert={alert} 
              onDetail={(id) => setSelectedAssetId(id)} 
            />
          ))}
          
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="bg-slate-50 border-4 border-dashed border-slate-200 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center opacity-40 hover:opacity-100 transition-all group"
          >
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-indigo-600 mb-4 transition-colors">
              <RefreshCw size={24} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aguardando mais dados de telemetria...</p>
          </motion.div>
        </div>
      </section>

      {/* Footer / Context */}
      <footer className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-950 rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-10 overflow-hidden relative">
          <TrendingUp size={120} className="absolute -right-10 -bottom-10 text-white/5 -rotate-12" />
          <div className="shrink-0 w-24 h-24 bg-white/10 backdrop-blur rounded-[2rem] flex items-center justify-center text-white border border-white/20">
            <Brain size={48} />
          </div>
          <div className="space-y-4 relative z-10">
            <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter">Sugestão Preditiva do Ricardo</h4>
            <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xl">
              Baseado no histórico de faturamento e sazonalidade térmica de Março, sugiro antecipar a compra de compressores Industriais. 
              Economia estimada de <span className="text-emerald-400 font-bold">12% nos custos diretos</span>.
            </p>
            <button className="flex items-center gap-2 text-indigo-400 text-[10px] font-black uppercase tracking-widest hover:text-white transition-all">
              Ver Análise Completa de Mercado <ChevronRight size={14} />
            </button>
          </div>
        </div>

        <div className="bg-indigo-600 rounded-[3rem] p-10 text-white flex flex-col justify-between group cursor-pointer hover:bg-indigo-700 transition-all">
           <div>
              <Zap size={32} className="mb-6 opacity-50 group-hover:scale-110 transition-transform" />
              <h4 className="text-xl font-black uppercase tracking-tighter italic mb-4">Automação Autônoma</h4>
              <p className="text-indigo-100 text-xs font-medium leading-relaxed">
                Configure regras para que o Ricardo IA agende manutenções sozinho assim que detectar risco crítico.
              </p>
           </div>
           <div className="mt-8 flex items-center justify-between border-t border-white/20 pt-6">
              <span className="text-[10px] font-black uppercase tracking-widest">Abrir Rule Builder</span>
              <ArrowUpRight size={20} />
           </div>
        </div>
      </footer>

      {/* Explainable Panel */}
      <ExplainSidePanel 
        assetId={selectedAssetId} 
        onClose={() => setSelectedAssetId(null)} 
      />
    </div>
  );
};

export default AIView;