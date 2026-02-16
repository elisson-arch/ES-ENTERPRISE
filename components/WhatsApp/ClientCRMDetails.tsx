
import React, { useState } from 'react';
import { 
  Sparkles, Stethoscope, FilePlus, CalendarClock, Zap, ClipboardList, Pencil, Trello, Clock, ChevronDown, ChevronUp, History, CreditCard, StickyNote, ListChecks, Plus, Trash2, CheckCircle2, Circle, Share2
} from 'lucide-react';
import { ChatSession, ChatTemplate } from '../../types';
import { TemplateManager } from './TemplateManager';

interface ClientCRMDetailsProps {
  chat: ChatSession;
  onGenerateWebsite: () => void;
  onDiagnose: () => void;
  onGenerateReport: () => void;
  onOpenSchedule: () => void;
  onEditClient: () => void;
  onShareClient: () => void;
  onSyncDrive: () => void;
  isSyncing?: boolean;
  onOpenQuote: () => void;
  onGenerateOS?: () => void;
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
  onMoveFunnelStage?: (stage: any) => void;
  onAddTask: (text: string) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

const CollapsibleSection: React.FC<{ 
  title: string; 
  icon: any; 
  children: React.ReactNode; 
  badge?: string | number;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ title, icon: Icon, children, badge, isOpen, onToggle }) => (
  <div className="border border-slate-100 rounded-[1.5rem] overflow-hidden bg-white shadow-sm mb-4">
    <button 
      onClick={onToggle}
      className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-all text-left"
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl bg-slate-100 text-slate-500`}>
          <Icon size={16} />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase text-slate-700 tracking-widest">{title}</span>
          {badge !== undefined && (
            <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[8px] font-black border border-indigo-100">
              {badge}
            </span>
          )}
        </div>
      </div>
      {isOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
    </button>
    {isOpen && <div className="p-4 pt-0 border-t border-slate-50 animate-in slide-in-from-top-2">{children}</div>}
  </div>
);

export const ClientCRMDetails: React.FC<ClientCRMDetailsProps> = ({
  chat, onDiagnose, onOpenSchedule, onSyncDrive, isSyncing, onOpenQuote, templates,
  templateSearchTerm, onTemplateSearchChange, isBulkMode, onToggleBulkMode,
  selectedTemplateIds, onToggleSelection, onSelectAllTemplates, onClearTemplateSelection,
  onBulkDelete, onDeleteTemplate,
  onSelectTemplate, onEditTemplate, expandedCategories, onToggleCategory, onNewTemplate, onEditClient, onShareClient, onGenerateWebsite, onGenerateReport,
  onMoveFunnelStage, onAddTask, onToggleTask, onDeleteTask
}) => {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['tasks', 'notes']));
  const [newTaskText, setNewTaskText] = useState('');

  const toggleSection = (id: string) => {
    const next = new Set(openSections);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setOpenSections(next);
  };

  const agingDays = chat.lastStageChange ? Math.floor((Date.now() - new Date(chat.lastStageChange).getTime()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className="w-80 border-l border-slate-200 bg-white p-6 overflow-y-auto hidden xl:block animate-in fade-in duration-500 custom-scrollbar">
      <h3 className="font-black text-slate-800 text-[10px] uppercase mb-6 tracking-widest border-b pb-2">Central do Cliente</h3>
      
      <div className="text-center mb-6">
        <div className="w-20 h-20 rounded-3xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-3xl font-black mx-auto mb-4 border border-indigo-100 shadow-sm relative">
          {chat.clientName.charAt(0)}
          <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center text-[10px] ${
            chat.status === 'Ativo' ? 'bg-emerald-500' : 'bg-amber-500'
          }`}>
             <span className="text-white"><Zap size={10} fill="currentColor" /></span>
          </div>
        </div>
        <h4 className="font-bold text-slate-800 text-sm mb-1">{chat.clientName}</h4>
        <div className="flex flex-col items-center gap-1.5">
          <span className="px-3 py-1 bg-slate-100 rounded-full text-[9px] font-bold text-slate-500 uppercase tracking-widest">
            {chat.clientType} • {chat.status}
          </span>
          <div className="flex items-center gap-4 mt-2">
            <button onClick={onEditClient} className="text-[10px] font-bold text-indigo-600 hover:underline flex items-center gap-1">
               <Pencil size={10} /> Editar
            </button>
            <button onClick={onShareClient} className="text-[10px] font-bold text-slate-400 hover:text-indigo-600 flex items-center gap-1 transition-colors">
               <Share2 size={10} /> Compartilhar
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-[1.5rem] border border-slate-100 mb-6">
        <div className="flex justify-between items-center mb-3">
           <h5 className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
             <Trello size={12} /> Estágio no Funil
           </h5>
           <div className="flex items-center gap-1 text-[8px] font-black text-slate-400">
             <Clock size={10} /> {agingDays}d aqui
           </div>
        </div>
        <select 
          className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-[10px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all"
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

      <div className="space-y-4 mb-8">
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
                className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-[10px] font-medium outline-none focus:border-indigo-300 transition-all"
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
                className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-sm"
              >
                <Plus size={14} />
              </button>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto no-scrollbar">
              {chat.tasks?.length ? chat.tasks.map(task => (
                <div key={task.id} className="flex items-center justify-between group p-1 hover:bg-slate-50 rounded-lg">
                  <button 
                    onClick={() => onToggleTask(task.id)}
                    className="flex items-center gap-2 flex-1 text-left"
                  >
                    {task.completed ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Circle size={14} className="text-slate-300" />}
                    <span className={`text-[10px] font-medium ${task.completed ? 'text-slate-400 line-through' : 'text-slate-600'}`}>
                      {task.text}
                    </span>
                  </button>
                  <button onClick={() => onDeleteTask(task.id)} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all p-1">
                    <Trash2 size={12} />
                  </button>
                </div>
              )) : <p className="text-[10px] text-slate-400 italic text-center py-4">Nenhuma tarefa para este cliente.</p>}
            </div>
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
               className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-[10px] font-medium text-slate-600 leading-relaxed outline-none focus:border-indigo-300 transition-all h-24"
               placeholder="Adicionar notas sobre o cliente..."
               defaultValue={chat.internalNotes}
             />
             <div className="flex justify-end">
                <button className="text-[9px] font-black uppercase text-indigo-600 hover:underline">Salvar Notas</button>
             </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection 
          title="Histórico de Serviços" 
          icon={History}
          isOpen={openSections.has('history')}
          onToggle={() => toggleSection('history')}
        >
          <div className="space-y-4 pt-2">
             {[
               { date: '15/04/2024', service: 'Limpeza de Dutos', status: 'Concluído' },
               { date: '10/02/2024', service: 'Carga de Gás', status: 'Concluído' }
             ].map((item, i) => (
               <div key={i} className="flex justify-between items-start border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-black text-slate-800">{item.service}</p>
                    <p className="text-[9px] text-slate-400 font-bold">{item.date}</p>
                  </div>
                  <span className="text-[8px] font-black uppercase text-emerald-600">{item.status}</span>
               </div>
             ))}
             <button className="w-full py-2 bg-slate-50 text-[9px] font-black uppercase text-slate-500 rounded-lg hover:bg-slate-100 transition-all">Ver Histórico Completo</button>
          </div>
        </CollapsibleSection>

        <CollapsibleSection 
          title="Faturamento" 
          icon={CreditCard}
          isOpen={openSections.has('billing')}
          onToggle={() => toggleSection('billing')}
        >
          <div className="space-y-3 pt-2">
             <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-2xl">
                   <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Total Gasto</p>
                   <p className="text-xs font-black text-slate-800 tracking-tighter">R$ {chat.billingData?.totalSpent?.toLocaleString() || '0'}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl">
                   <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Pendente</p>
                   <p className="text-xs font-black text-rose-600 tracking-tighter">R$ {chat.billingData?.pendingAmount?.toLocaleString() || '0'}</p>
                </div>
             </div>
             <p className="text-[9px] text-slate-500 font-bold uppercase flex items-center gap-2">
                <CalendarClock size={12} className="text-slate-400" /> Última Fatura: {chat.billingData?.lastInvoice || 'N/A'}
             </p>
             <button className="w-full py-2 bg-indigo-600 text-white text-[9px] font-black uppercase rounded-lg shadow-md hover:bg-indigo-700 transition-all">Emitir Cobrança</button>
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

      <div className="bg-slate-900 p-5 rounded-[2rem] shadow-xl border border-slate-800 mt-6">
        <h5 className="text-[9px] font-black uppercase tracking-widest text-indigo-400 mb-5 flex items-center gap-2">
          <Sparkles size={14} className="animate-pulse" /> AI Quick Actions
        </h5>
        <div className="space-y-2.5">
          <button 
            onClick={onGenerateReport} 
            className="w-full p-3 bg-slate-800 border border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-slate-700 flex items-center gap-3 transition-all"
          >
            <ClipboardList size={16} className="text-blue-400" /> Gerar Relatório Técnico
          </button>
          <button 
            onClick={onDiagnose} 
            className="w-full p-3 bg-slate-800 border border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-slate-700 flex items-center gap-3 transition-all"
          >
            <Stethoscope size={16} className="text-amber-400" /> Diagnosticar Ativo
          </button>
        </div>
      </div>
    </div>
  );
};
