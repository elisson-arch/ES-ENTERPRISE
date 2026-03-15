import React, { useState } from 'react';
import { 
  Zap, 
  Plus,
  Settings2, 
  ShieldCheck,
  ChevronRight,
  Trash2,
  Clock,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Rule {
  id: string;
  name: string;
  active: boolean;
  trigger: string;
  condition: string;
  action: string;
  icon: React.ReactNode;
}

// --- MOCK DATA ---
const INITIAL_RULES: Rule[] = [
  { 
    id: '1', 
    name: 'Alerta Crítico de Compressor', 
    active: true,
    trigger: 'Risco Preditivo > 80%', 
    condition: 'Horário Comercial',
    action: 'Enviar WhatsApp para Técnico & Cliente',
    icon: <Zap size={18} className="text-amber-500" />
  },
  { 
    id: '2', 
    name: 'Auto-Gerador de Orçamentos', 
    active: false,
    trigger: 'Pedido de Cotação via E-mail', 
    condition: 'Abaixo de R$ 5.000',
    action: 'Gerar PDF & Responder Automaticamente',
    icon: <Zap size={18} className="text-blue-500" />
  }
];

// --- COMPONENTS ---

const RuleNode = ({ rule, onDelete }: { rule: Rule, onDelete: (id: string) => void }) => (
  <motion.div
    layout
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative"
  >
    <div className="flex justify-between items-start mb-8">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
          {rule.icon}
        </div>
        <div>
          <h4 className="text-sm font-black text-slate-800 uppercase tracking-tighter">{rule.name}</h4>
          <p className="text-[10px] text-slate-400 font-bold uppercase">ID: {rule.id}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
         <div className={`px-2 py-1 rounded-full text-[8px] font-black uppercase border ${rule.active ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
            {rule.active ? 'Ativo' : 'Pausado'}
         </div>
         <button onClick={() => onDelete(rule.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
            <Trash2 size={16} />
         </button>
      </div>
    </div>

    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-10">
      <div className="flex-1 w-full p-5 bg-slate-50 rounded-2xl border border-slate-100">
        <p className="text-[8px] font-black text-slate-400 uppercase mb-2">Se (Gatilho)</p>
        <p className="text-xs font-bold text-slate-700">{rule.trigger}</p>
      </div>
      <div className="shrink-0 text-slate-300 animate-pulse">
        <ArrowRight size={20} />
      </div>
      <div className="flex-1 w-full p-5 bg-indigo-50 rounded-2xl border border-indigo-100">
        <p className="text-[8px] font-black text-indigo-400 uppercase mb-2">Então (Ação)</p>
        <p className="text-xs font-bold text-indigo-900">{rule.action}</p>
      </div>
    </div>

    <div className="mt-8 pt-6 border-t border-slate-50 flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-400">
       <div className="flex items-center gap-2">
          <Clock size={12} />
          Executado há 14 minutos
       </div>
       <button className="flex items-center gap-2 text-indigo-600 hover:underline">
          Configurar Condições <ChevronRight size={10} />
       </button>
    </div>
  </motion.div>
);

// --- VIEW ---

const AutomationView = () => {
  const [rules, setRules] = useState(INITIAL_RULES);
  const [activeTab, setActiveTab] = useState('builder');

  const addRule = () => {
    const newRule = {
      id: Date.now().toString(),
      name: 'Nova Regra Autônoma',
      active: true,
      trigger: 'Definir Gatilho',
      condition: 'Sempre',
      action: 'Definir Ação',
      icon: <Zap size={18} className="text-indigo-500" />
    };
    setRules([newRule, ...rules]);
  };

  const deleteRule = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-100">
            <Zap size={40} />
          </div>
          <div>
            <h2 className="text-4xl font-black text-slate-800 italic uppercase tracking-tighter leading-none">Motor de Automação</h2>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mt-3">Ações Autônomas do Ricardo IA</p>
          </div>
        </div>

        <div className="flex gap-2 p-2 bg-slate-50 rounded-[2rem] border border-slate-100">
           <button 
             onClick={() => setActiveTab('builder')}
             className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'builder' ? 'bg-white text-slate-800 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
           >
             Rule Builder
           </button>
           <button 
             onClick={() => setActiveTab('logs')}
             className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'logs' ? 'bg-white text-slate-800 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
           >
             Live Feed
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
             <h3 className="text-sm font-black text-slate-800 uppercase tracking-tighter mb-8">Estatísticas de Automação</h3>
             <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Execuções (Hoje)</p>
                   <span className="text-xl font-black text-indigo-600 italic">128</span>
                </div>
                <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden">
                   <div className="w-[74%] h-full bg-indigo-600" />
                </div>
                <p className="text-[9px] text-slate-400 font-bold uppercase italic">
                  Economia de <span className="text-emerald-500">12.5 horas</span> de trabalho manual hoje.
                </p>
             </div>
          </div>

          <div className="bg-slate-950 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-[60px] -mr-16 -mt-16" />
             <div className="relative z-10">
                <ShieldCheck size={32} className="text-indigo-400 mb-6" />
                <h4 className="text-lg font-black uppercase tracking-tighter italic mb-4">Integridade de Dados</h4>
                <p className="text-slate-400 text-xs font-medium leading-relaxed mb-8">
                  Todas as ações são validadas pelo motor de segurança antes do disparo real.
                </p>
                <div className="flex items-center gap-3 text-emerald-400 text-[9px] font-black uppercase tracking-[0.2em]">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                   Validação Ativa
                </div>
             </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-8">
          <div className="flex justify-between items-center">
             <div className="flex items-center gap-3">
                <Settings2 size={18} className="text-slate-400" />
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Fluxos de Automação</h3>
             </div>
             <button 
               onClick={addRule}
               className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:scale-105 transition-all"
             >
               <Plus size={18} /> Nova Regra
             </button>
          </div>

          <div className="space-y-6">
            <AnimatePresence>
              {rules.map(rule => (
                <RuleNode key={rule.id} rule={rule} onDelete={deleteRule} />
              ))}
            </AnimatePresence>
          </div>

          {rules.length === 0 && (
            <div className="py-20 bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center text-center">
               <Zap size={48} className="text-slate-200 mb-6" />
               <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Nenhuma automação configurada. Comece criando uma regra.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AutomationView;
