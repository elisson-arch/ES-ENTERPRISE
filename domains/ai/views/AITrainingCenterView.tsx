import React, { useState } from 'react';
import {
  Brain,
  FileText,
  Settings2,
  History,
  Upload,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  ChevronRight,
  Database,
  Plus,
  Trash2,
  ShieldCheck,
  Zap,
  Info,
  Sliders
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- MOCK DATA ---
const MOCK_DOCS = [
  { id: '1', name: 'Manual_Daikin_Inverter_V3.pdf', type: 'Manual Técnico', status: 'learned', size: '2.4 MB', date: '12/03/2026' },
  { id: '2', name: 'Tabela_Precos_ES_2026.pdf', type: 'Comercial', status: 'learned', size: '1.1 MB', date: '10/03/2026' },
  { id: '3', name: 'Regras_Negocio_Descontos.pdf', type: 'Regras', status: 'processing', size: '0.5 MB', date: 'Hoje' },
];

const MOCK_LOGS = [
  { id: '1', action: 'Sugestão Preditiva', details: 'Manutenção sugerida para Clínica São João (Ar-condicionado Central)', timestamp: '14:30', status: 'pending' },
  { id: '2', action: 'Resposta ao Cliente', details: 'Explicado limite de carga térmica para servidor Dell R740', timestamp: '13:15', status: 'approved' },
  { id: '3', action: 'Alerta de Segurança', details: 'Bloqueada tentativa de acesso a dados de faturamento sem token', timestamp: '10:45', status: 'approved' },
  { id: '4', action: 'Geração de Site', details: 'Criação de landing page para "Promoção Verão 2026"', timestamp: '09:00', status: 'rejected' },
];

// --- COMPONENTS ---

const TabButton = ({ active, icon: Icon, label, onClick }: { active: boolean, icon: React.ElementType, label: string, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
      active 
        ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' 
        : 'bg-white text-slate-400 hover:text-slate-600 border border-slate-100'
    }`}
  >
    <Icon size={18} />
    {label}
  </button>
);

const Card = ({ children, title, subtitle, icon: Icon }: { children: React.ReactNode, title: string, subtitle: string, icon: React.ElementType }) => (
  <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
    <div className="flex items-center gap-4 mb-8">
      <div className="p-3 bg-slate-50 rounded-2xl text-indigo-600">
        <Icon size={24} />
      </div>
      <div>
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-tighter">{title}</h3>
        <p className="text-[10px] text-slate-400 font-bold uppercase">{subtitle}</p>
      </div>
    </div>
    {children}
  </div>
);

// --- VIEW ---

const AITrainingCenterView = () => {
  const [activeTab, setActiveTab] = useState('knowledge');
  const [temperature, setTemperature] = useState(0.7);
  const [systemPrompt, setSystemPrompt] = useState(
    "Você é o Ricardo, o assistente preditivo da ES-ENTERPRISE. Nunca dê descontos acima de 10% aos clientes. Fale sempre de forma profissional, mas amigável."
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-slate-950 rounded-[2rem] flex items-center justify-center text-white shadow-2xl">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-800 italic uppercase tracking-tighter leading-none">AI Management Hub</h2>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Centro de Comando & Treinamento</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-widest">IA Operacional</span>
          </div>
          <button className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all shadow-sm">
            <Settings2 size={20} />
          </button>
        </div>
      </header>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-4 p-2 bg-slate-50 rounded-[2.5rem] w-fit">
        <TabButton 
          active={activeTab === 'knowledge'} 
          icon={Database} 
          label="Base de Conhecimento" 
          onClick={() => setActiveTab('knowledge')} 
        />
        <TabButton 
          active={activeTab === 'behavior'} 
          icon={Sliders} 
          label="Estúdio de Comportamento" 
          onClick={() => setActiveTab('behavior')} 
        />
        <TabButton 
          active={activeTab === 'audit'} 
          icon={History} 
          label="Auditoria & Feedback" 
          onClick={() => setActiveTab('audit')} 
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'knowledge' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-8">
                <Card title="Instruir & Capacitar" subtitle="Upload de novos manuais e regras" icon={Upload}>
                  <div className="border-4 border-dashed border-slate-50 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center group hover:border-indigo-100 transition-all cursor-pointer">
                    <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Plus size={32} />
                    </div>
                    <p className="text-xs font-black text-slate-800 uppercase mb-2">Arraste Manuais PDF</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Ou clique para navegar</p>
                  </div>
                  <div className="mt-8 p-6 bg-amber-50 rounded-3xl border border-amber-100 flex gap-4">
                    <Info size={20} className="text-amber-500 shrink-0" />
                    <p className="text-[10px] text-amber-700 font-medium leading-relaxed uppercase italic">
                      Arquivos enviados aqui são processados via Embeddings e integrados ao cérebro do Ricardo IA.
                    </p>
                  </div>
                </Card>
              </div>

              <div className="lg:col-span-2">
                <Card title="Documentos Aprendidos" subtitle="Base vetorial ativa no sistema" icon={FileText}>
                  <div className="space-y-4">
                    {MOCK_DOCS.map(doc => (
                      <div key={doc.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:shadow-xl transition-all">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${doc.status === 'learned' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600 animate-pulse'}`}>
                            <FileText size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-800 group-hover:text-indigo-600 transition-colors uppercase italic tracking-tighter">{doc.name}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase">{doc.type} • {doc.size} • {doc.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {doc.status === 'learned' && <CheckCircle2 size={16} className="text-emerald-500" />}
                          <button className="p-2 text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'behavior' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card title="Estúdio de Prompts" subtitle="Defina a personalidade e regras base" icon={Brain}>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Instruções de Sistema (System Prompt)</label>
                    <textarea 
                      className="w-full h-64 p-6 bg-slate-50 border border-slate-200 rounded-3xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all resize-none"
                      value={systemPrompt}
                      onChange={(e) => setSystemPrompt(e.target.value)}
                    />
                  </div>
                  <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-100">
                    <p className="text-[9px] font-black text-indigo-600 uppercase italic tracking-widest mb-2 flex items-center gap-2">
                       <Zap size={12} strokeWidth={3} /> Dica do Ricardo
                    </p>
                    <p className="text-[10px] text-indigo-900 font-medium leading-relaxed">
                      Use frases imperativas e limites claros. A IA respeita melhor instruções diretas.
                    </p>
                  </div>
                </div>
              </Card>

              <div className="space-y-8">
                <Card title="Ajuste Fino (Tuning)" subtitle="Parâmetros de resposta do Gemini" icon={Sliders}>
                  <div className="space-y-12">
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs font-black text-slate-800 uppercase">Temperatura</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Criatividade vs Rigor</p>
                        </div>
                        <span className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-black">{temperature}</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.1" 
                        value={temperature}
                        onChange={(e) => setTemperature(parseFloat(e.target.value))}
                        className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                      <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase">
                        <span>Factual / Técnico</span>
                        <span>Criativo / Amigável</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-5 border border-slate-100 rounded-[2rem] bg-slate-50/50">
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Max Tokens</p>
                        <p className="text-lg font-black text-slate-800 tracking-tighter">2,048</p>
                      </div>
                      <div className="p-5 border border-slate-100 rounded-[2rem] bg-slate-50/50">
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Modelo Ativo</p>
                        <p className="text-lg font-black text-slate-800 tracking-tighter">Gemini 1.5 Pro</p>
                      </div>
                    </div>
                    
                    <button className="w-full py-5 bg-black text-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-slate-900 transition-all active:scale-95">
                      Atualizar Configurações
                    </button>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <Card title="Auditoria & Monitorização" subtitle="Logs de decisões e feedback RLHF" icon={History}>
              <div className="overflow-hidden bg-slate-50 rounded-3xl border border-slate-100">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Ação da IA</th>
                      <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Detalhes do Evento</th>
                      <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Hora</th>
                      <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Feedback</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {MOCK_LOGS.map(log => (
                      <tr key={log.id} className="hover:bg-white transition-colors">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${log.status === 'pending' ? 'bg-amber-400' : log.status === 'approved' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                            <span className="text-xs font-black text-slate-800 uppercase italic tracking-tighter">{log.action}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-xs text-slate-600 font-medium max-w-md truncate">{log.details}</p>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span className="text-[10px] font-mono font-bold text-slate-400">{log.timestamp}</span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex justify-end gap-2">
                            <button className="p-2.5 bg-white border border-slate-100 text-slate-300 hover:text-emerald-500 hover:border-emerald-200 rounded-xl transition-all"><ThumbsUp size={16} /></button>
                            <button className="p-2.5 bg-white border border-slate-100 text-slate-300 hover:text-rose-500 hover:border-rose-200 rounded-xl transition-all"><ThumbsDown size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-8 flex justify-center">
                <button className="flex items-center gap-2 px-8 py-3 bg-white border border-slate-200 rounded-full text-[10px] font-black uppercase text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all">
                  Ver Histórico Completo <ChevronRight size={14} />
                </button>
              </div>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AITrainingCenterView;
