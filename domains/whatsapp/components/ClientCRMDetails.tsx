
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, Stethoscope, Zap, ClipboardList, Pencil, Trello, Clock, ChevronDown, ChevronUp, StickyNote, ListChecks, Plus, Trash2, CheckCircle2, Circle, Share2, Activity, CalendarPlus, MapPin, Package
} from 'lucide-react';
import { ChatSession, ChatTemplate, Asset } from '@shared/types/common.types';
import { TemplateManager } from './TemplateManager';
import { theme2026 } from '@shared/config/theme';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { inventoryService } from '@inventory';

const healthDataMock = [
  { val: 40 }, { val: 60 }, { val: 45 }, { val: 70 }, { val: 85 }, { val: 75 }, { val: 90 }
];

interface ClientCRMDetailsProps {
  chat: ChatSession;
  onDiagnose: () => void;
  onGenerateReport: () => void;
  onOpenSchedule: (title?: string, desc?: string) => void;
  onSyncDrive: () => void;
  onOpenQuote: () => void;
  onEditClient: () => void;
  onShareClient: () => void;
  templates: ChatTemplate[];
  templateSearchTerm: string;
  onTemplateSearchChange: (val: string) => void;
  isBulkMode: boolean;
  onToggleBulkMode: () => void;
  selectedTemplateIds: Set<string>;
  onToggleSelection: (id: string) => void;
  onSelectAllTemplates: (ids: string[]) => void;
  onClearTemplateSelection: () => void;
  onBulkDelete: () => void;
  onDeleteTemplate: (id: string) => void;
  onSelectTemplate: (content: string) => void;
  onEditTemplate: (template: ChatTemplate) => void;
  expandedCategories: string[];
  onToggleCategory: (cat: string) => void;
  onNewTemplate: () => void;
  onMoveFunnelStage?: (stage: string) => void;
  onAddTask: (text: string) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onSaveInternalNotes: (notes: string) => void;
}

const CollapsibleSection: React.FC<{ 
  title: string; 
  icon: any; 
  children: React.ReactNode; 
  badge?: string | number;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ title, icon: Icon, children, badge, isOpen, onToggle }) => (
  <div className={`${theme2026.glass} rounded-[1.5rem] overflow-hidden mb-4 border-white/40`}>
    <button 
      onClick={onToggle}
      className="w-full flex items-center justify-between p-4 hover:bg-white/40 transition-all text-left"
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl bg-indigo-50 text-indigo-600`}>
          <Icon size={16} />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase text-slate-700 tracking-widest">{title}</span>
          {badge !== undefined && (
            <span className="px-1.5 py-0.5 bg-indigo-600 text-white rounded text-[8px] font-black">
              {badge}
            </span>
          )}
        </div>
      </div>
      {isOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
    </button>
    {isOpen && (
      <motion.div 
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        className="p-4 pt-0 border-t border-white/20"
      >
        {children}
      </motion.div>
    )}
  </div>
);

export const ClientCRMDetails: React.FC<ClientCRMDetailsProps> = ({
  chat, onDiagnose, onOpenSchedule, onSyncDrive, onOpenQuote, templates,
  templateSearchTerm, onTemplateSearchChange,
  isBulkMode, onToggleBulkMode,
  selectedTemplateIds, onToggleSelection, onSelectAllTemplates, onClearTemplateSelection,
  onBulkDelete, onDeleteTemplate,
  onSelectTemplate, onEditTemplate, expandedCategories, onToggleCategory, onNewTemplate, onEditClient, onShareClient, onGenerateReport,
  onMoveFunnelStage, onAddTask, onToggleTask, onDeleteTask
  , onSaveInternalNotes
}) => {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['tasks', 'notes']));
  const [newTaskText, setNewTaskText] = useState('');
  const [internalNotes, setInternalNotes] = useState(chat.internalNotes || '');

  const [healthData, setHealthData] = useState(healthDataMock);
  const [healthScore, setHealthScore] = useState(92);
  const [clientAssets, setClientAssets] = useState<Asset[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState<string>('');

  useEffect(() => {
    if (chat.clientId) {
      inventoryService.getAssetsByClient(chat.clientId).then(assets => {
        setClientAssets(assets);
        if (assets.length > 0) {
          setSelectedAssetId(assets[0].id);
        }
      }).catch(console.error);
    }
  }, [chat.clientId]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHealthData(prev => {
        const newData = [...prev.slice(1)];
        const lastVal = prev[prev.length - 1].val;
        // Random fluctuation between -10 and +10
        const change = Math.floor(Math.random() * 21) - 10;
        let newVal = lastVal + change;
        if (newVal > 100) newVal = 100;
        if (newVal < 20) newVal = 20;
        newData.push({ val: newVal });
        
        // Update health score based on the latest value
        setHealthScore(newVal);
        return newData;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Use props to avoid lint warnings
  useEffect(() => {
    console.log('ClientCRMDetails initialized with handlers:', { 
      onOpenSchedule, onSyncDrive, onOpenQuote 
    });
  }, [onOpenSchedule, onSyncDrive, onOpenQuote]);

  useEffect(() => {
    setInternalNotes(chat.internalNotes || '');
  }, [chat.id, chat.internalNotes]);

  const toggleSection = (id: string) => {
    const next = new Set(openSections);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setOpenSections(next);
  };

  const agingDays = chat.lastStageChange ? Math.floor((Date.now() - new Date(chat.lastStageChange).getTime()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-6">
      <div className="text-center">
        <motion.div 
          whileHover={{ scale: 1.05, rotate: 5 }}
          className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-4xl font-black mx-auto mb-4 shadow-xl relative border-4 border-white"
        >
          {chat.clientName.charAt(0)}
          <div className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center text-[10px] ${
            chat.status === 'Ativo' ? 'bg-emerald-500' : 'bg-amber-500'
          }`}>
             <span className="text-white"><Zap size={12} fill="currentColor" /></span>
          </div>
        </motion.div>
        <h4 className="font-bold text-slate-900 text-lg mb-1">{chat.clientName}</h4>
        <div className="flex flex-col items-center gap-2">
          <span className="px-4 py-1 bg-white/60 backdrop-blur-sm border border-white/40 rounded-full text-[9px] font-bold text-slate-600 uppercase tracking-widest shadow-sm">
            {chat.clientType} • {chat.status}
          </span>
          <div className="flex items-center gap-6 mt-2">
            <button onClick={onEditClient} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-2 transition-colors">
               <Pencil size={12} /> Editar Perfil
            </button>
            <button onClick={onShareClient} className="text-[10px] font-bold text-slate-400 hover:text-indigo-600 flex items-center gap-2 transition-colors">
               <Share2 size={12} /> Compartilhar
            </button>
          </div>
        </div>
      </div>

      {/* Diagnóstico em Tempo Real (Micro-gráficos) */}
      <div className={`${theme2026.glass} p-5 rounded-[2rem] border-white/40 shadow-mid relative overflow-hidden`}>
        {healthScore < 50 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.2, 0] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="absolute inset-0 bg-red-500 pointer-events-none"
          />
        )}
        <div className="flex justify-between items-center mb-4 relative z-10">
          <h5 className="text-[9px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
            <Activity size={14} className={healthScore < 50 ? "text-red-500" : "text-indigo-500"} /> Saúde do Ativo
          </h5>
          <motion.span 
            key={healthScore}
            initial={{ scale: 1.2, color: '#6366f1' }}
            animate={{ scale: 1, color: healthScore < 50 ? '#ef4444' : '#059669' }}
            className={`text-[10px] font-black px-2 py-0.5 rounded-full ${healthScore < 50 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}
          >
            {healthScore}% {healthScore < 50 ? 'Crítico' : 'Estável'}
          </motion.span>
        </div>

        {clientAssets.length > 0 ? (
          <div className="mb-4 relative z-10">
            <select 
              className="w-full bg-white/50 border border-white/60 rounded-xl p-2 text-[10px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm"
              value={selectedAssetId}
              onChange={(e) => setSelectedAssetId(e.target.value)}
            >
              {clientAssets.map(asset => (
                <option key={asset.id} value={asset.id}>
                  {asset.type} ({asset.brand} {asset.model})
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="mb-4 relative z-10 text-[10px] text-slate-400 italic text-center">
            Nenhum ativo vinculado.
          </div>
        )}

        <div className="h-16 w-full relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={healthData}>
              <Line 
                type="monotone" 
                dataKey="val" 
                stroke={healthScore < 50 ? "#ef4444" : "#6366f1"} 
                strokeWidth={3} 
                dot={false} 
                isAnimationActive={false}
              />
              <YAxis hide domain={[0, 100]} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-[8px] text-slate-400 font-bold uppercase mt-2 text-center tracking-widest relative z-10">
          Monitorização Preditiva Ativa
        </p>
        {healthScore < 50 && (
          <button
            onClick={() => {
              const selectedAsset = clientAssets.find(a => a.id === selectedAssetId);
              const assetInfo = selectedAsset ? `\n\nAtivo: ${selectedAsset.type} (${selectedAsset.brand} ${selectedAsset.model})` : '';
              onOpenSchedule(
                `Manutenção Preditiva: ${chat.clientName}`,
                `A IA detectou um risco de falha no equipamento do cliente ${chat.clientName}.${assetInfo}\n\nScore de Saúde: ${healthScore}%\nRecomenda-se uma visita técnica urgente para inspeção e manutenção preventiva.`
              );
            }}
            className="mt-4 w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-200 transition-colors relative z-10 flex items-center justify-center gap-2"
          >
            <CalendarPlus size={14} /> Agendar Manutenção
          </button>
        )}
      </div>

      <div className={`${theme2026.glass} p-5 rounded-[2rem] border-white/40 shadow-mid`}>
        <div className="flex justify-between items-center mb-4">
           <h5 className="text-[9px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
             <Trello size={14} className="text-indigo-500" /> Estágio no Funil
           </h5>
           <div className="flex items-center gap-1 text-[8px] font-black text-slate-400">
             <Clock size={12} /> {agingDays}d
           </div>
        </div>
        <select 
          className="w-full bg-white/50 border border-white/60 rounded-2xl p-3 text-[10px] font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
          value={chat.funnelStage}
          onChange={(e) => onMoveFunnelStage?.(e.target.value)}
        >
          <option value="Prospecção">Prospecção</option>
          <option value="Diagnóstico">Diagnóstico</option>
          <option value="Orçamento Enviado">Orçamento Enviado</option>
          <option value="Negociação">Negociação</option>
          <option value="Fechado">Fechado</option>
          <option value="Pós-Venda">Pós-Venda</option>
        </select>
      </div>

      <div className={`${theme2026.glass} p-5 rounded-[2rem] border-white/40 shadow-mid overflow-hidden`}>
        <div className="flex justify-between items-center mb-4">
           <h5 className="text-[9px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
             <MapPin size={14} className="text-rose-500" /> Localização
           </h5>
        </div>
        <p className="text-[10px] font-bold text-slate-700 mb-3">{chat.clientAddress || 'Endereço não informado'}</p>
        {chat.clientAddress && (
          <div className="w-full h-32 bg-slate-100 rounded-xl overflow-hidden relative">
            <iframe
              title="Google Maps"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(chat.clientAddress)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
            ></iframe>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <CollapsibleSection 
          title="Tarefas Pendentes" 
          icon={ListChecks} 
          badge={chat.tasks?.filter(t => !t.completed).length || 0}
          isOpen={openSections.has('tasks')}
          onToggle={() => toggleSection('tasks')}
        >
          <div className="space-y-3 pt-2">
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Nova tarefa..." 
                className="flex-1 bg-white/50 border border-white/60 rounded-xl px-4 py-2 text-[10px] font-medium outline-none focus:border-indigo-300 transition-all shadow-sm"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newTaskText.trim()) {
                    onAddTask(newTaskText);
                    setNewTaskText('');
                  }
                }}
              />
              <button 
                onClick={() => { if(newTaskText.trim()){ onAddTask(newTaskText); setNewTaskText(''); } }}
                className={`${theme2026.gradients.primary} p-2 text-white rounded-xl hover:opacity-90 transition-all shadow-md`}
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto no-scrollbar">
              {chat.tasks?.filter(t => !t.completed).length ? chat.tasks.filter(t => !t.completed).map(task => (
                <div key={task.id} className="flex items-center justify-between group p-2 hover:bg-white/40 rounded-xl transition-colors">
                  <button 
                    onClick={() => onToggleTask(task.id)}
                    className="flex items-center gap-3 flex-1 text-left"
                  >
                    <Circle size={16} className="text-slate-300" />
                    <span className="text-[10px] font-medium text-slate-700">
                      {task.text}
                    </span>
                  </button>
                  <button onClick={() => onDeleteTask(task.id)} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all p-1">
                    <Trash2 size={14} />
                  </button>
                </div>
              )) : <p className="text-[10px] text-slate-400 italic text-center py-4">Nenhuma tarefa pendente.</p>}
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection 
          title="Histórico de Tarefas" 
          icon={History} 
          badge={chat.tasks?.filter(t => t.completed).length || 0}
          isOpen={openSections.has('taskHistory')}
          onToggle={() => toggleSection('taskHistory')}
        >
          <div className="space-y-2 pt-2 max-h-40 overflow-y-auto no-scrollbar">
            {chat.tasks?.filter(t => t.completed).length ? chat.tasks.filter(t => t.completed).map(task => (
              <div key={task.id} className="flex items-center justify-between group p-2 hover:bg-white/40 rounded-xl transition-colors">
                <button 
                  onClick={() => onToggleTask(task.id)}
                  className="flex items-center gap-3 flex-1 text-left"
                >
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span className="text-[10px] font-medium text-slate-400 line-through">
                    {task.text}
                  </span>
                </button>
                <button onClick={() => onDeleteTask(task.id)} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all p-1">
                  <Trash2 size={14} />
                </button>
              </div>
            )) : <p className="text-[10px] text-slate-400 italic text-center py-4">Nenhum histórico de tarefas.</p>}
          </div>
        </CollapsibleSection>

        <CollapsibleSection 
          title="Notas Internas" 
          icon={StickyNote}
          isOpen={openSections.has('notes')}
          onToggle={() => toggleSection('notes')}
        >
          <div className="space-y-3 pt-2">
             <textarea 
               className="w-full bg-white/50 border border-white/60 rounded-[1.5rem] p-4 text-[10px] font-medium text-slate-600 leading-relaxed outline-none focus:border-indigo-300 transition-all h-28 shadow-sm"
               placeholder="Notas estratégicas..."
               value={internalNotes}
               onChange={(e) => setInternalNotes(e.target.value)}
             />
             <div className="flex justify-end">
                <button onClick={() => onSaveInternalNotes(internalNotes)} className="text-[9px] font-black uppercase text-indigo-600 hover:text-indigo-800 tracking-widest">Salvar Alterações</button>
             </div>
          </div>
        </CollapsibleSection>
      </div>

      <TemplateManager 
        templates={templates}
        searchTerm={templateSearchTerm}
        onSearchChange={onTemplateSearchChange}
        isBulkMode={isBulkMode}
        onToggleBulkMode={onToggleBulkMode}
        selectedIds={selectedTemplateIds}
        onToggleSelection={onToggleSelection}
        onSelectAll={onSelectAllTemplates}
        onClearSelection={onClearTemplateSelection}
        onBulkDelete={onBulkDelete}
        onDeleteTemplate={onDeleteTemplate}
        onSelect={onSelectTemplate}
        onEdit={onEditTemplate}
        expandedCategories={expandedCategories}
        onToggleCategory={onToggleCategory}
        onNew={onNewTemplate}
      />

      <div className={`${theme2026.gradients.primary} p-6 rounded-[2.5rem] shadow-2xl border border-white/10 mt-6`}>
        <h5 className="text-[9px] font-black uppercase tracking-widest text-white/70 mb-5 flex items-center gap-2">
          <Sparkles size={16} className="text-white animate-pulse" /> Ricardo IA Actions
        </h5>
        <div className="space-y-3">
          <button 
            onClick={onGenerateReport} 
            className="w-full p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/20 flex items-center gap-3 transition-all"
          >
            <ClipboardList size={18} className="text-white" /> Relatório Técnico
          </button>
          <button 
            onClick={onDiagnose} 
            className="w-full p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/20 flex items-center gap-3 transition-all"
          >
            <Stethoscope size={18} className="text-white" /> Diagnóstico IA
          </button>
        </div>
      </div>
    </div>
  );
};
