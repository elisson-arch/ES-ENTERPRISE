
import React, { useState } from 'react';
import { Search, Filter, Calendar, Tag, Briefcase, Trash2, MailOpen, MessageSquare, Clock, CheckSquare, Layers, Archive, Check, Users, RefreshCw, Cloud } from 'lucide-react';
import { ChatSession } from '@shared/types/common.types';
import { ClientList } from './ClientList';

interface ChatSidebarProps {
  chats: ChatSession[];
  filteredChats: ChatSession[];
  filters: any;
  onFilterChange: (newFilters: any) => void;
  selectedChatId: string;
  onSelectChat: (chat: ChatSession) => void;
  isBulkMode?: boolean;
  onToggleBulkMode?: () => void;
  selectedChatIds?: Set<string>;
  onBulkAction?: (action: 'archive' | 'delete' | 'read') => void;
  onSync?: () => void;
  isSyncing?: boolean;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  filteredChats,
  filters,
  onFilterChange,
  selectedChatId,
  onSelectChat,
  isBulkMode = false,
  onToggleBulkMode,
  selectedChatIds = new Set(),
  onBulkAction,
  onSync,
  isSyncing
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="w-full border-r border-slate-200 flex flex-col bg-slate-50/50 h-full shrink-0">
      <div className="p-4 bg-white border-b border-slate-200 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-black text-slate-800 tracking-tighter uppercase text-[10px]">WhatsApp CRM</h2>
          <div className="flex gap-2">
            <button 
              onClick={onSync}
              disabled={isSyncing}
              className={`p-2 rounded-xl transition-all ${isSyncing ? 'bg-indigo-50 text-indigo-400' : 'hover:bg-indigo-50 text-indigo-600'}`}
              title="Sincronizar Google Workspace"
            >
              {isSyncing ? <RefreshCw size={18} className="animate-spin" /> : <Cloud size={18} />}
            </button>
            <button 
              onClick={onToggleBulkMode}
              className={`p-2 rounded-xl transition-all ${isBulkMode ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-slate-100 text-slate-500'}`}
              title="Seleção em Massa"
            >
              <Layers size={18} />
            </button>
            <button 
              onClick={() => onFilterChange({ onlyUnread: !filters.onlyUnread })}
              className={`p-2 rounded-xl transition-all ${filters.onlyUnread ? 'bg-blue-100 text-blue-600' : 'hover:bg-slate-100 text-slate-500'}`}
              title="Somente Não Lidas"
            >
              <MailOpen size={18} />
            </button>
          </div>
        </div>

        {isBulkMode && (
          <div className="flex gap-2 p-2 bg-indigo-50 rounded-xl animate-in slide-in-from-top-2 border border-indigo-100">
            <button 
              onClick={() => onBulkAction?.('read')}
              className="flex-1 py-1.5 bg-white border border-indigo-100 text-[9px] font-black uppercase text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-1.5"
            >
              <Check size={14} /> Lidas
            </button>
            <button 
              onClick={() => onBulkAction?.('archive')}
              className="flex-1 py-1.5 bg-white border border-indigo-100 text-[9px] font-black uppercase text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-1.5"
            >
              <Archive size={14} /> Arquivar
            </button>
            <button 
              onClick={() => onBulkAction?.('delete')}
              className="flex-1 py-1.5 bg-white border border-red-100 text-[9px] font-black uppercase text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-1.5"
            >
              <Trash2 size={14} /> Excluir
            </button>
          </div>
        )}

        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Buscar..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 rounded-xl text-xs font-bold outline-none border border-transparent focus:border-blue-300 focus:bg-white transition-all shadow-inner" 
              value={filters.search}
              onChange={(e) => onFilterChange({ search: e.target.value })}
            />
          </div>
        </div>

        {showAdvanced && (
          <div className="pt-2 space-y-4 animate-in slide-in-from-top-2 duration-300">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[8px] font-black uppercase text-slate-400 flex items-center gap-1"><Clock size={10}/> Última Mensagem</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-[10px] font-bold"
                  value={filters.period}
                  onChange={(e) => onFilterChange({ period: e.target.value })}
                >
                  <option value="all">Qualquer data</option>
                  <option value="today">Hoje</option>
                  <option value="week">Esta Semana</option>
                  <option value="month">Este Mês</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[8px] font-black uppercase text-slate-400 flex items-center gap-1"><Users size={10}/> Status CRM</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-[10px] font-bold"
                  value={filters.status}
                  onChange={(e) => onFilterChange({ status: e.target.value })}
                >
                  <option value="all">Todos Status</option>
                  <option value="Ativo">Ativo</option>
                  <option value="Prospecção">Prospecção</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </div>
            </div>

            <button 
              onClick={() => onFilterChange({ search: '', status: 'all', chatStatus: 'all', clientType: 'all', assignedTo: 'all', period: 'all', onlyUnread: false })}
              className="w-full py-2 bg-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-500 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        )}
      </div>

      <ClientList 
        chats={filteredChats}
        selectedChatId={selectedChatId}
        onSelectChat={onSelectChat}
        isSelectionMode={isBulkMode}
        selectedChatIds={selectedChatIds}
        onToggleChatSelection={() => {}}
      />
    </div>
  );
};
