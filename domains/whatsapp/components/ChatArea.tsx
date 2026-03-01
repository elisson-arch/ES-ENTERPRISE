
import React from 'react';
import { Bot, PanelRightOpen } from 'lucide-react';
import { ChatSession } from '@shared/types/common.types';
import { MessageWindow } from './MessageWindow';

interface ChatAreaProps {
  selectedChat: ChatSession | null;
  onSendMessage: (text: string, sender?: 'agent' | 'client' | 'ai', audioUrl?: string) => void;
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
  onToggleAI: (chat: ChatSession) => void;
  onArchiveConversation: (chat: ChatSession) => void;
  onImageClick: (url: string) => void;
  onBack: () => void;
  isMobileView: boolean;
  showChatOnMobile: boolean;
  pendingSuggestion: string | null;
  onDiscardSuggestion: () => void;
  onEditSuggestion: () => void;
  onSendSuggestion: () => void;
  internalSearchTerm: string;
  onInternalSearchChange: (val: string) => void;
  onOpenDetails?: () => void;
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  selectedChat, onSendMessage, inputText, onInputTextChange, isTyping, isSending,
  isCallActive, callTimer, onStartCall, onStopCall, onExport, onOpenUpload,
  onToggleAI, onArchiveConversation, onImageClick, onBack, isMobileView, showChatOnMobile,
  pendingSuggestion, onDiscardSuggestion, onEditSuggestion, onSendSuggestion,
  internalSearchTerm, onInternalSearchChange, onOpenDetails,
  isRecording, onStartRecording, onStopRecording
}) => {
  const isVisible = !isMobileView || showChatOnMobile;

  if (!isVisible) return null;

  return (
    <div className="flex-1 h-full border-l border-slate-200 overflow-hidden flex flex-col relative">
      {selectedChat ? (
        <>
          <MessageWindow 
            chat={selectedChat}
            onSendMessage={onSendMessage}
            inputText={inputText}
            onInputTextChange={onInputTextChange}
            isTyping={isTyping}
            isSending={isSending}
            isCallActive={isCallActive}
            callTimer={callTimer}
            onStartCall={onStartCall}
            onStopCall={onStopCall}
            onExport={onExport}
            onOpenUpload={onOpenUpload}
            onToggleAI={() => onToggleAI(selectedChat)}
            onArchiveConversation={() => onArchiveConversation(selectedChat)}
            showOptions={false}
            setShowOptions={() => {}}
            onInternalSearch={() => {}}
            internalSearchTerm={internalSearchTerm}
            onInternalSearchChange={onInternalSearchChange}
            onImageClick={onImageClick}
            onBack={onBack}
            showBackButton={isMobileView}
            pendingSuggestion={pendingSuggestion}
            onDiscardSuggestion={onDiscardSuggestion}
            onEditSuggestion={onEditSuggestion}
            onSendSuggestion={onSendSuggestion}
            isRecording={isRecording}
            onStartRecording={onStartRecording}
            onStopRecording={onStopRecording}
          />
          
          {isMobileView && (
            <button 
              onClick={onOpenDetails}
              className="fixed bottom-24 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center animate-in zoom-in duration-500 z-50 hover:scale-110 active:scale-95 transition-all"
            >
              <PanelRightOpen size={24} />
            </button>
          )}
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
           <Bot size={64} className="mb-4 opacity-20" />
           <p className="text-[10px] font-black uppercase tracking-widest">Escolha um chat para começar</p>
        </div>
      )}
    </div>
  );
};
