
import React, { useState } from 'react';
import { MoreVertical, Bot, PhoneCall, FileDown, Archive, Search, X, ChevronLeft, Sparkles } from 'lucide-react';
import { ChatSession } from '@shared/types/common.types';
import { CallOverlay } from './CallOverlay';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { SuggestionBox } from './SuggestionBox';

interface MessageWindowProps {
  chat: ChatSession;
  onSendMessage: (text: string) => void;
  inputText: string;
  onInputTextChange: (val: string) => void;
  isTyping: boolean;
  isSending: boolean;
  isCallActive: boolean;
  callTimer: string;
  onStartCall: () => void;
  onStopCall: () => void;
  onExport: () => void;
  onOpenUpload: () => void;
  onToggleAI: () => void;
  onArchiveConversation: () => void;
  showOptions: boolean;
  setShowOptions: (val: boolean) => void;
  onInternalSearch: (val: string) => void;
  internalSearchTerm: string;
  onBack?: () => void;
  showBackButton?: boolean;
  pendingSuggestion: string | null;
  onDiscardSuggestion: () => void;
  onEditSuggestion: () => void;
  onSendSuggestion: () => void;
  onInternalSearchChange: (val: string) => void;
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

export const MessageWindow: React.FC<MessageWindowProps> = ({
  chat, onSendMessage, inputText, onInputTextChange, isTyping, isSending,
  isCallActive, callTimer, onStartCall, onStopCall, onExport, onOpenUpload,
  onToggleAI, onArchiveConversation, showOptions, setShowOptions, 
  internalSearchTerm, 
  onBack, showBackButton,
  pendingSuggestion, onDiscardSuggestion, onEditSuggestion, onSendSuggestion,
  onInternalSearchChange,
  isRecording,
  onStartRecording,
  onStopRecording
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const filteredMessages = chat.messages.filter(m => 
    !internalSearchTerm || m.text.toLowerCase().includes(internalSearchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col bg-slate-50 relative h-full">
      <CallOverlay 
        isActive={isCallActive} 
        clientName={chat.clientName} 
        timer={callTimer} 
        onStop={onStopCall} 
      />

      <div className="p-3 md:p-4 bg-white border-b border-slate-200 flex justify-between items-center z-10 shadow-sm">
        <div className="flex items-center gap-3">
          {showBackButton && (
            <button onClick={onBack} className="p-2 -ml-2 text-slate-500 hover:text-blue-600 transition-colors">
              <ChevronLeft size={24} />
            </button>
          )}
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0 relative transition-all duration-500 ${chat.aiEnabled ? 'bg-indigo-600 ring-4 ring-indigo-100 scale-110' : 'bg-slate-900'}`}>
            {chat.clientName.charAt(0)}
            {chat.aiEnabled && (
               <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full border-2 border-indigo-600 flex items-center justify-center animate-bounce shadow-md">
                 <Sparkles size={10} className="text-indigo-600" />
               </span>
            )}
          </div>
          {!isSearchOpen ? (
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-black text-slate-800 text-[10px] md:text-xs leading-tight truncate uppercase tracking-widest">{chat.clientName}</h3>
                {chat.aiEnabled && (
                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-indigo-600 text-white rounded-lg shadow-lg shadow-indigo-100 animate-in zoom-in duration-300">
                    <Bot size={10} className="animate-pulse" />
                    <span className="text-[7px] font-black uppercase tracking-tighter">Ricardo IA Ativo</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                 <span className="text-[8px] text-green-500 font-black uppercase flex items-center gap-1">● Online</span>
                 <span className="text-[8px] text-slate-400 font-bold uppercase tracking-tight">Agente: {chat.assignedTo || 'Sistema'}</span>
              </div>
            </div>
          ) : (
            <div className="relative animate-in slide-in-from-left-2 flex-1 max-w-sm">
              <input 
                autoFocus
                type="text"
                placeholder="Buscar no histórico deste chat..."
                className="bg-slate-100 px-4 py-2 rounded-xl text-[10px] font-bold outline-none w-full border border-blue-200 shadow-inner"
                value={internalSearchTerm}
                onChange={(e) => onInternalSearchChange(e.target.value)}
              />
              <button onClick={() => { setIsSearchOpen(false); onInternalSearchChange(''); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                <X size={14} />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!isSearchOpen && (
            <button onClick={() => setIsSearchOpen(true)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors" title="Buscar Mensagem">
              <Search size={18} />
            </button>
          )}

          <div className="flex items-center gap-2 ml-2 pl-2 border-l border-slate-100">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-full border border-indigo-100 mr-2 group cursor-pointer hover:bg-indigo-100 transition-colors" onClick={onToggleAI}>
              <Bot size={14} className={chat.aiEnabled ? "text-indigo-600" : "text-slate-400"} />
              <button className={`w-8 h-4 rounded-full relative transition-colors ${chat.aiEnabled ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${chat.aiEnabled ? 'left-4.5' : 'left-0.5'}`} />
              </button>
            </div>
            
            <button onClick={onStartCall} className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
              <PhoneCall size={18} />
            </button>

            <div className="relative">
              <button 
                onClick={() => setShowOptions(!showOptions)} 
                className={`p-2 rounded-xl transition-all ${showOptions ? 'bg-slate-100 text-blue-600' : 'text-slate-400 hover:text-blue-600'}`}
              >
                <MoreVertical size={18} />
              </button>
              
              {showOptions && (
                <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <button onClick={onExport} className="group w-full px-4 py-3 flex items-center justify-between text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-colors text-slate-700">
                    <div className="flex items-center gap-3 group-hover:text-blue-700">
                      <FileDown size={16} className="text-blue-600" /> 
                      <span>Exportar Mensagens</span>
                    </div>
                  </button>
                  <button onClick={onArchiveConversation} className="group w-full px-4 py-3 flex items-center justify-between text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-colors text-slate-700">
                    <div className="flex items-center gap-3 group-hover:text-red-700">
                      <Archive size={16} className="text-slate-400" /> 
                      <span>Arquivar Conversa</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <MessageList messages={filteredMessages} isTyping={isTyping} />

      <div className="relative">
        <SuggestionBox 
          suggestion={pendingSuggestion || ''} 
          onSend={onSendSuggestion} 
          onEdit={onEditSuggestion} 
          onDiscard={onDiscardSuggestion} 
        />
        <MessageInput 
          value={inputText} 
          onChange={onInputTextChange} 
          onSend={onSendMessage} 
          onOpenUpload={onOpenUpload}
          isSending={isSending}
          onStartRecording={onStartRecording}
          onStopRecording={onStopRecording}
          isRecording={isRecording}
        />
      </div>
    </div>
  );
};
