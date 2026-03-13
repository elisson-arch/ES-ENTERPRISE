
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trello, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Clock, 
  AlertCircle, 
  Sparkles,
  CheckCircle2,
  Wrench,
  User,
  MessageSquare,
  DollarSign,
  Zap
} from 'lucide-react';
import { ChatSession } from '@shared/types/common.types';
import { useAppContext } from '@shared/hooks/useAppContext';
import { chatService } from '@whatsapp/services/chatService';
import { googleApiService } from '@google-workspace/services/googleApiService';
import { googleSyncService } from '@google-workspace/services/googleSyncService';
import confetti from 'canvas-confetti';
import { theme2026 } from '@shared/config/theme';

const FUNNEL_STAGES = [
  { id: 'Prospecção', color: 'bg-blue-500', label: 'Prospecção', icon: Search },
  { id: 'Diagnóstico', color: 'bg-purple-500', label: 'Diagnóstico', icon: Wrench },
  { id: 'Orçamento Enviado', color: 'bg-amber-500', label: 'Orçamento', icon: Clock },
  { id: 'Negociação', color: 'bg-indigo-500', label: 'Negociação', icon: Filter },
  { id: 'Fechado', color: 'bg-emerald-500', label: 'Fechado', icon: CheckCircle2 }
];

const FunnelView = () => {
  const [leads, setLeads] = useState<ChatSession[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const { addNotification } = useAppContext();
  const orgId = googleApiService.getUserProfile()?.organizationId || 'org-123';
  const columnRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const unsubscribe = chatService.subscribeToChats(orgId, (chats) => {
      setLeads(chats);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [orgId]);

  const filteredLeads = useMemo(() => {
    return leads.filter(l => 
      l.clientName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [leads, searchTerm]);

  const getAgingDays = (date?: string) => {
    if (!date) return 0;
    const diff = Date.now() - new Date(date).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const handleMoveStage = async (leadId: string, targetStage: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead || lead.funnelStage === targetStage) return;

    // Optimistic update
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, funnelStage: targetStage as ChatSession['funnelStage'] } : l));

    try {
      await chatService.upsertChat({
        id: leadId,
        organizationId: orgId,
        funnelStage: targetStage as ChatSession['funnelStage'],
        lastStageChange: new Date().toISOString()
      });

      if (targetStage === 'Fechado') {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#6366f1', '#f59e0b']
        });
        addNotification({
          type: 'success',
          title: 'Negócio Fechado! 🎉',
          description: `Iniciando automação: Criando pasta no Drive para ${lead.clientName}...`,
          priority: 'high'
        });

        try {
          const userId = googleApiService.getUserProfile()?.email || 'user-123';
          await googleSyncService.ensureDriveFolderStructure(
            lead.clientId,
            lead.clientName,
            orgId,
            userId
          );
          addNotification({
            type: 'success',
            title: 'Drive Sincronizado',
            description: `Pasta mestre criada para ${lead.clientName} com sucesso.`,
            priority: 'low'
          });
        } catch (err) {
          console.error('Erro ao criar pasta no Drive:', err);
          addNotification({
            type: 'predictive',
            title: 'Aviso de Automação',
            description: `A pasta no Drive para ${lead.clientName} não pôde ser criada automaticamente.`,
            priority: 'high'
          });
        }
      }
    } catch (error: unknown) {
      console.error('Erro ao mover lead:', error);
      addNotification({
        type: 'predictive',
        title: 'Erro na Sincronização',
        description: 'Não foi possível atualizar o estágio do lead no servidor.',
        priority: 'high'
      });
    }
  };

  const onDragEnd = (_event: any, info: { point: { x: number; y: number } }, leadId: string) => {
    setActiveDragId(null);
    const { x, y } = info.point;
    
    let targetStageId = null;
    for (const stage of FUNNEL_STAGES) {
      const rect = columnRefs.current[stage.id]?.getBoundingClientRect();
      if (rect && x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        targetStageId = stage.id;
        break;
      }
    }

    if (targetStageId) {
      handleMoveStage(leadId, targetStageId);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Sincronizando Funil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-6 overflow-hidden p-6 bg-slate-50/30">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-[2.5rem] font-black text-slate-900 flex items-center gap-4 tracking-tighter italic uppercase leading-none">
            <Trello className="text-indigo-600 w-10 h-10" /> Funil de Vendas
          </h2>
          <p className="text-[0.625rem] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Gestão Visual & Inteligência Preditiva</p>
        </div>
        <div className="flex items-center gap-3">
          <button className={`${theme2026.gradients.primary} h-14 text-white px-8 rounded-[1.5rem] font-black text-[0.75rem] uppercase tracking-widest flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-xl shadow-indigo-500/20 group`}>
            <Plus size={18} className="group-hover:rotate-90 transition-transform" /> Novo Lead
          </button>
        </div>
      </header>

      <div className={`${theme2026.glass} p-4 rounded-[2.5rem] border-white/40 shadow-mid flex flex-col md:flex-row gap-4`}>
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por cliente, empresa ou serviço..."
            className="w-full pl-12 pr-6 py-4 bg-white/50 border border-white/60 rounded-[1.25rem] focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-600 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <button className="flex items-center justify-center gap-3 px-6 py-4 bg-white/50 border border-white/60 rounded-[1.25rem] text-slate-600 hover:bg-white hover:shadow-md transition-all font-black text-[0.625rem] uppercase tracking-widest">
            <Filter size={18} /> Filtros
          </button>
          <div className="flex items-center gap-2 px-6 py-4 bg-indigo-50 rounded-[1.25rem] border border-indigo-100">
            <Sparkles size={18} className="text-indigo-600 animate-pulse" />
            <span className="text-[0.625rem] font-black text-indigo-600 uppercase tracking-widest italic">Ricardo IA Ativo</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-x-auto pb-8 no-scrollbar">
        {FUNNEL_STAGES.map(stage => {
          const stageLeads = filteredLeads.filter(l => l.funnelStage === stage.id);
          const totalValue = stageLeads.length * 3200;

          return (
            <div 
              key={stage.id} 
              ref={el => columnRefs.current[stage.id] = el}
              className={`w-[22rem] flex-shrink-0 flex flex-col rounded-[3rem] border p-4 h-full transition-all duration-300 ${
                activeDragId ? 'bg-indigo-50/40 border-indigo-200/50 scale-[0.98]' : 'bg-slate-50/50 border-slate-200/40'
              }`}
            >
              <div className="flex justify-between items-center px-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-8 rounded-full ${stage.color} shadow-lg shadow-${stage.color.split('-')[1]}-200`}></div>
                  <div>
                    <h4 className="text-[0.625rem] font-black uppercase tracking-[0.2em] text-slate-400">{stage.label}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[1.25rem] font-black text-slate-800 tracking-tighter italic">{stageLeads.length}</span>
                      <span className="text-[0.5rem] font-bold text-slate-300 uppercase">Leads</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[0.5rem] font-black text-slate-300 uppercase tracking-widest mb-0.5">Valor Est.</p>
                  <p className="text-[0.875rem] font-black text-slate-800 italic tracking-tighter">R$ {totalValue.toLocaleString('pt-BR')}</p>
                </div>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar pr-1">
                <AnimatePresence mode="popLayout">
                  {stageLeads.map(lead => {
                    const aging = getAgingDays(lead.lastStageChange);
                    const isStale = aging >= 4;

                    return (
                      <motion.div 
                        layout
                        layoutId={lead.id}
                        key={lead.id}
                        drag
                        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                        dragElastic={1}
                        onDragStart={() => setActiveDragId(lead.id!)}
                        onDragEnd={(e, info) => onDragEnd(e, info, lead.id!)}
                        whileDrag={{ 
                          scale: 1.1, 
                          rotate: 2, 
                          zIndex: 50, 
                          boxShadow: "0 25px 50px -12px rgba(99, 102, 241, 0.25)" 
                        }}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                        className={`bg-white p-6 rounded-[2.5rem] shadow-mid border-2 transition-all cursor-grab active:cursor-grabbing group relative ${
                          isStale ? 'border-rose-100 bg-rose-50/30' : 'border-white hover:border-indigo-100 hover:shadow-xl'
                        }`}
                      >
                        <button className="absolute top-6 right-6 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical size={18} />
                        </button>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="col-span-2 flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${lead.clientType === 'Comercial' ? 'bg-indigo-500' : 'bg-amber-500'}`}></div>
                              <span className="text-[0.5rem] font-black uppercase text-slate-400 tracking-widest">{lead.clientType}</span>
                            </div>
                            {isStale && (
                              <div className="flex items-center gap-1.5 px-2 py-1 bg-rose-100 rounded-full">
                                <AlertCircle size={10} className="text-rose-600 animate-pulse" />
                                <span className="text-[0.5rem] font-black text-rose-600 uppercase">Crítico</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="col-span-2">
                            <h5 className="font-black text-slate-900 text-[1rem] leading-tight line-clamp-2 italic tracking-tighter uppercase">{lead.clientName}</h5>
                          </div>

                          <div className="bg-slate-50 p-3 rounded-2xl flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 text-slate-400">
                              <MessageSquare size={12} />
                              <span className="text-[0.5rem] font-black uppercase tracking-widest">Última</span>
                            </div>
                            <p className="text-[0.625rem] text-slate-600 font-bold line-clamp-1">"{lead.lastMessage}"</p>
                          </div>

                          <div className="bg-slate-50 p-3 rounded-2xl flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 text-slate-400">
                              <DollarSign size={12} />
                              <span className="text-[0.5rem] font-black uppercase tracking-widest">Valor</span>
                            </div>
                            <p className="text-[0.625rem] text-slate-600 font-bold">R$ 3.200</p>
                          </div>

                          <div className="col-span-2 flex items-center justify-between pt-2">
                            <div className={`flex items-center gap-2 text-[0.5625rem] font-black uppercase tracking-widest ${isStale ? 'text-rose-500' : 'text-slate-400'}`}>
                              <Clock size={14} />
                              {aging === 0 ? 'Hoje' : `${aging}d parado`}
                            </div>
                            <div className="flex -space-x-2">
                              <div className="w-6 h-6 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center text-[8px] font-black text-indigo-600">
                                <User size={10} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {stageLeads.length === 0 && (
                  <div className={`h-40 flex flex-col items-center justify-center border-4 border-dashed rounded-[2.5rem] transition-all duration-500 ${
                    activeDragId ? 'border-indigo-400 bg-indigo-50/50 scale-105' : 'border-slate-200 opacity-30'
                  }`}>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-transform ${
                      activeDragId ? 'bg-indigo-500 text-white scale-110 animate-bounce' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {activeDragId ? <Zap size={24} /> : <Plus size={24} />}
                    </div>
                    <p className={`text-[0.625rem] font-black uppercase tracking-[0.3em] ${
                      activeDragId ? 'text-indigo-600' : 'text-slate-400'
                    }`}>
                      {activeDragId ? 'Solte aqui' : 'Arraste para cá'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default FunnelView;
