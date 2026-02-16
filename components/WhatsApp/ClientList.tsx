
import React from 'react';
import { Search, Check, Square, CheckSquare } from 'lucide-react';
import { ChatSession } from '../../types';

interface ClientListProps {
  chats: ChatSession[];
  selectedChatId: string;
  onSelectChat: (chat: ChatSession) => void;
  isSelectionMode: boolean;
  selectedChatIds: Set<string>;
  onToggleChatSelection: (id: string) => void;
}

export const ClientList: React.FC<ClientListProps> = ({
  chats,
  selectedChatId,
  onSelectChat,
  isSelectionMode,
  selectedChatIds,
  onToggleChatSelection
}) => {
  if (chats.length === 0) {
    return (
      <div className="p-8 text-center space-y-2 opacity-40">
        <Search size={32} className="mx-auto mb-2" />
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Nenhuma conversa encontrada</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar">
      {chats.map(chat => (
        <div 
          key={chat.id} 
          onClick={() => onSelectChat(chat)}
          className={`p-4 flex gap-3 cursor-pointer border-b border-slate-100 transition-all relative group ${
            selectedChatId === chat.id && !isSelectionMode 
              ? 'bg-white border-l-4 border-l-blue-600 shadow-sm' 
              : 'hover:bg-slate-100'
          } ${isSelectionMode && selectedChatIds.has(chat.id) ? 'bg-indigo-50/50' : ''}`}
        >
          <div className="flex items-center shrink-0">
            {isSelectionMode ? (
              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${selectedChatIds.has(chat.id) ? 'bg-indigo-600 border-indigo-600 shadow-md text-white' : 'bg-white border-slate-300 text-slate-200'}`}>
                {selectedChatIds.has(chat.id) ? <CheckSquare size={16} /> : <Square size={16} />}
              </div>
            ) : (
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-black text-lg shadow-sm">
                  {chat.clientName.charAt(0)}
                </div>
                {chat.unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600 border-2 border-white"></span>
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <div className="flex justify-between items-start mb-0.5">
              <h4 className={`text-sm truncate ${chat.unreadCount > 0 ? 'font-black text-slate-900' : 'font-bold text-slate-700'}`}>
                {chat.clientName}
              </h4>
              <span className={`text-[10px] shrink-0 font-medium ${chat.unreadCount > 0 ? 'text-blue-600' : 'text-slate-400'}`}>
                14:25
              </span>
            </div>
            <div className="flex justify-between items-center gap-2">
              <p className={`text-xs truncate flex-1 ${chat.unreadCount > 0 ? 'text-slate-900 font-semibold' : 'text-slate-500'}`}>
                {chat.lastMessage}
              </p>
              {chat.unreadCount > 0 && !isSelectionMode && (
                <div className="flex items-center">
                  <span className="bg-blue-600 text-white text-[9px] font-black min-w-[20px] h-[20px] px-1 rounded-full flex items-center justify-center shadow-md shadow-blue-100 animate-in zoom-in duration-300">
                    {chat.unreadCount}
                  </span>
                </div>
              )}
            </div>
            <div className="flex gap-1.5 mt-1.5">
              {chat.status && (
                 <span className={`inline-block text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border ${
                   chat.status === 'Ativo' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                   chat.status === 'Prospecção' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                   'bg-slate-100 text-slate-400 border-slate-200'
                 }`}>
                   {chat.status}
                 </span>
              )}
              {chat.aiEnabled && (
                <span className="inline-block text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border bg-indigo-50 text-indigo-600 border-indigo-100">
                  IA Ricardo
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
