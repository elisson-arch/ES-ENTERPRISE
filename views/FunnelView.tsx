
import React, { useState, useMemo } from 'react';
import { 
  Trello, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Clock, 
  AlertCircle, 
  ArrowRight,
  Calendar,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { ChatSession } from '../types';

const FUNNEL_STAGES = [
  { id: 'Prospecção', color: 'bg-blue-500', label: 'Prospecção' },
  { id: 'Diagnóstico', color: 'bg-purple-500', label: 'Diagnóstico' },
  { id: 'Orçamento Enviado', color: 'bg-amber-500', label: 'Orçamento' },
  { id: 'Negociação', color: 'bg-indigo-500', label: 'Negociação' },
  { id: 'Fechado', color: 'bg-emerald-500', label: 'Fechado' }
];

const mockLeads: Partial<ChatSession>[] = [
  {
    id: 'c1',
    clientName: 'Condomínio Residencial Aurora',
    funnelStage: 'Diagnóstico',
    lastMessage: 'Aguardando visita técnica.',
    unreadCount: 2,
    clientType: 'Comercial',
    lastStageChange: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'c2',
    clientName: 'Padaria Pão de Mel',
    funnelStage: 'Orçamento Enviado',
    lastMessage: 'Orçamento enviado há 2 dias.',
    unreadCount: 0,
    clientType: 'Comercial',
    lastStageChange: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'c3',
    clientName: 'Hospital São Luiz',
    funnelStage: 'Prospecção',
    lastMessage: 'Novo lead via site.',
    unreadCount: 1,
    clientType: 'Comercial',
    lastStageChange: new Date().toISOString(),
  },
  {
    id: 'c4',
    clientName: 'Dra. Helena Souza',
    funnelStage: 'Negociação',
    lastMessage: 'Pediu desconto de 10%.',
    unreadCount: 0,
    clientType: 'Residencial',
    lastStageChange: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'c5',
    clientName: 'Indústrias Metalúrgicas S.A.',
    funnelStage: 'Fechado',
    lastMessage: 'Contrato assinado.',
    unreadCount: 0,
    clientType: 'Comercial',
    lastStageChange: new Date().toISOString(),
  }
];

const FunnelView = () => {
  const [leads, setLeads] = useState(mockLeads);
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleMoveStage = (leadId: string, direction: 'forward' | 'backward') => {
    setLeads(prev => prev.map(l => {
      if (l.id !== leadId) return l;
      const currentIndex = FUNNEL_STAGES.findIndex(s => s.id === l.funnelStage);
      let nextIndex = direction === 'forward' ? currentIndex + 1 : currentIndex - 1;
      
      if (nextIndex >= 0 && nextIndex < FUNNEL_STAGES.length) {
        return { 
          ...l, 
          funnelStage: FUNNEL_STAGES[nextIndex].id as any, 
          lastStageChange: new Date().toISOString() 
        };
      }
      return l;
    }));
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <Trello className="text-blue-600" /> Funil de Vendas CRM
          </h2>
          <p className="text-slate-500">Gestão visual da jornada de conversão dos seus clientes.</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
          <Plus size={20} /> Adicionar Lead
        </button>
      </header>

      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por cliente, empresa ou serviço..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors font-medium">
          <Filter size={18} /> Etapas
        </button>
      </div>

      <div className="flex-1 flex gap-4 overflow-x-auto pb-4 no-scrollbar">
        {FUNNEL_STAGES.map(stage => {
          const stageLeads = filteredLeads.filter(l => l.funnelStage === stage.id);
          const totalValue = stageLeads.length * 3200; // Valor médio estimado

          return (
            <div key={stage.id} className="w-80 flex-shrink-0 flex flex-col bg-slate-100/30 rounded-3xl border border-slate-200/50 p-3 h-full">
              <div className="flex justify-between items-center px-2 mb-4">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-6 rounded-full ${stage.color}`}></div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-600">{stage.label}</h4>
                  <span className="bg-white px-2 py-0.5 rounded-lg text-[10px] font-bold text-slate-400 border border-slate-200">{stageLeads.length}</span>
                </div>
                <div className="text-[10px] font-black text-slate-400">Est. R$ {totalValue.toLocaleString('pt-BR')}</div>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar pr-1">
                {stageLeads.map(lead => {
                  const aging = getAgingDays(lead.lastStageChange);
                  const isStale = aging >= 4;

                  return (
                    <div 
                      key={lead.id}
                      className={`bg-white p-4 rounded-2xl shadow-sm border transition-all hover:shadow-md cursor-pointer group relative ${
                        isStale ? 'border-red-200 shadow-red-50' : 'border-slate-100'
                      }`}
                    >
                      <button className="absolute top-4 right-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical size={16} />
                      </button>

                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${lead.clientType === 'Comercial' ? 'bg-blue-500' : 'bg-orange-500'}`}></span>
                          <span className="text-[8px] font-black uppercase text-slate-400 tracking-tighter">{lead.clientType}</span>
                        </div>
                        
                        <h5 className="font-bold text-slate-800 text-sm leading-tight line-clamp-1">{lead.clientName}</h5>
                        
                        <p className="text-[10px] text-slate-500 line-clamp-1 italic">"{lead.lastMessage}"</p>

                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
                          <div className={`flex items-center gap-1.5 text-[9px] font-bold ${isStale ? 'text-red-500' : 'text-slate-400'}`}>
                            <Clock size={12} />
                            {aging === 0 ? 'Hoje' : `${aging}d parado`}
                          </div>
                          
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                            <button 
                              onClick={() => handleMoveStage(lead.id!, 'backward')}
                              className="p-1.5 bg-slate-50 text-slate-400 rounded-lg hover:bg-slate-200"
                            >
                              <ChevronLeft size={12} />
                            </button>
                            <button 
                              onClick={() => handleMoveStage(lead.id!, 'forward')}
                              className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white"
                            >
                              <ChevronRight size={12} />
                            </button>
                          </div>
                        </div>

                        {isStale && (
                          <div className="mt-2 flex items-center gap-1.5 text-[8px] font-black uppercase text-red-500 bg-red-50 p-1.5 rounded-lg border border-red-100">
                            <AlertCircle size={10} className="animate-pulse" /> Atenção: Lead parado!
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {stageLeads.length === 0 && (
                  <div className="h-24 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl opacity-40">
                    <Plus size={20} className="text-slate-400 mb-1" />
                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Arraste para cá</p>
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
