
import React from 'react';
import { ChatSidebar } from '../components/WhatsApp/ChatSidebar';
import { ChatArea } from '../components/WhatsApp/ChatArea';
import { ClientCRMDetails } from '../components/WhatsApp/ClientCRMDetails';
import { WhatsAppModals } from '../components/WhatsApp/WhatsAppModals';
import { useWhatsAppState } from '../hooks/useWhatsAppState';
import { INITIAL_WHATSAPP_CHATS, DEFAULT_TEMPLATES } from '../services/mockData';
import { X, Sparkles } from 'lucide-react';

const WhatsAppView = () => {
  const state = useWhatsAppState(INITIAL_WHATSAPP_CHATS);

  const handleShareClient = async () => {
    if (!state.selectedChat) return;
    
    const client = state.selectedChat;
    const shareText = `*Perfil do Cliente - ES Enterprise*\n\n` +
      `👤 *Nome:* ${client.clientName}\n` +
      `📞 *Telefone:* ${client.clientPhone || 'N/A'}\n` +
      `📍 *Endereço:* ${client.clientAddress || 'N/A'}\n` +
      `🚀 *Status Funil:* ${client.funnelStage}\n` +
      `✅ *Status CRM:* ${client.status}\n\n` +
      `Acesse no ES Enterprise: ${window.location.origin}/#/clientes`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Perfil: ${client.clientName}`,
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Erro ao compartilhar:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        alert("Resumo do perfil copiado para a área de transferência!");
      } catch (err) {
        alert("Não foi possível copiar o resumo.");
      }
    }
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden relative">
      {state.isSyncing && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[2000] bg-indigo-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4">
          <Sparkles size={20} className="animate-pulse" />
          <span className="text-xs font-black uppercase tracking-widest">Sincronizando Leads...</span>
        </div>
      )}

      {(!state.isMobileView || !state.showChatOnMobile) && (
        <ChatSidebar 
          chats={state.chats}
          filteredChats={state.filteredChats}
          filters={state.filters}
          onFilterChange={(f) => state.setFilters(prev => ({ ...prev, ...f }))}
          selectedChatId={state.selectedChat?.id || ''}
          onSelectChat={(c) => { 
            if (state.isBulkMode) {
              const next = new Set(state.selectedChatIds);
              if (next.has(c.id)) next.delete(c.id); else next.add(c.id);
              state.setSelectedChatIds(next);
            } else {
              state.setSelectedChat(c); 
              if(state.isMobileView) state.setShowChatOnMobile(true); 
            }
          }}
          isBulkMode={state.isBulkMode}
          onToggleBulkMode={() => state.setIsBulkMode(!state.isBulkMode)}
          selectedChatIds={state.selectedChatIds}
          onSync={state.syncLeads}
          isSyncing={state.isSyncing}
        />
      )}

      <ChatArea 
        selectedChat={state.selectedChat}
        onSendMessage={state.handleSendMessage}
        inputText={state.inputText}
        onInputTextChange={state.setInputText}
        isTyping={false}
        isSending={state.isSending}
        isCallActive={false}
        callTimer="00:00"
        onStartCall={() => {}}
        onStopCall={() => {}}
        onExport={() => {}}
        onOpenUpload={() => state.setModal('upload', true)}
        onToggleAI={(chat) => {
          const updated = { ...chat, aiEnabled: !chat.aiEnabled };
          state.setSelectedChat(updated);
          state.setChats(prev => prev.map(c => c.id === updated.id ? updated : c));
        }}
        onImageClick={() => {}}
        onBack={() => { state.setShowChatOnMobile(false); state.setShowDetailsOnMobile(false); }}
        isMobileView={state.isMobileView}
        showChatOnMobile={state.showChatOnMobile}
        pendingSuggestion={null}
        onDiscardSuggestion={() => {}}
        onEditSuggestion={() => {}}
        onSendSuggestion={() => {}}
        internalSearchTerm=""
        onInternalSearchChange={() => {}}
        onOpenDetails={() => state.setShowDetailsOnMobile(true)}
        isRecording={state.isRecording}
        onStartRecording={state.handleStartRecording}
        onStopRecording={state.handleStopRecording}
      />

      {state.selectedChat && (
        <div className={`${state.isMobileView ? `fixed inset-x-0 bottom-0 z-[1000] transform transition-transform duration-300 ${state.showDetailsOnMobile ? 'translate-y-0' : 'translate-y-full'}` : 'relative'}`}>
          {state.isMobileView && state.showDetailsOnMobile && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => state.setShowDetailsOnMobile(false)} />
          )}
          <div className={`${state.isMobileView ? 'bg-white rounded-t-[3rem] shadow-2xl max-h-[85vh] overflow-hidden flex flex-col' : 'h-full'}`}>
            {state.isMobileView && (
              <div className="p-4 flex justify-center items-center relative border-b">
                <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
                <button onClick={() => state.setShowDetailsOnMobile(false)} className="absolute right-6 p-2 text-slate-400 bg-slate-50 rounded-full"><X size={20} /></button>
              </div>
            )}
            <ClientCRMDetails 
              chat={state.selectedChat}
              onGenerateWebsite={() => {}}
              onGenerateReport={() => {}}
              onDiagnose={() => {}}
              onOpenSchedule={() => state.setModal('schedule', true)}
              onEditClient={() => state.setModal('clientEdit', true)}
              onShareClient={handleShareClient}
              onSyncDrive={() => {}}
              onOpenQuote={() => state.setModal('quote', true)}
              templates={DEFAULT_TEMPLATES}
              templateSearchTerm=""
              onTemplateSearchChange={() => {}}
              isBulkMode={false}
              onToggleBulkMode={() => {}}
              selectedTemplateIds={new Set()}
              onToggleSelection={() => {}}
              onSelectAllTemplates={() => {}}
              onClearTemplateSelection={() => {}}
              onBulkDelete={() => {}}
              onDeleteTemplate={() => {}}
              onSelectTemplate={(t) => state.setInputText(t)}
              onEditTemplate={() => state.setModal('templateEdit', true)}
              expandedCategories={['Saudação']}
              onToggleCategory={() => {}}
              onNewTemplate={() => state.setModal('templateNew', true)}
              onAddTask={(text) => {
                 const newTask = { id: Date.now().toString(), text, completed: false, createdAt: new Date().toISOString() };
                 const updated = { ...state.selectedChat!, tasks: [...(state.selectedChat!.tasks || []), newTask] };
                 state.setSelectedChat(updated);
                 state.setChats(prev => prev.map(c => c.id === updated.id ? updated : c));
              }}
              onToggleTask={(taskId) => {
                 const updatedTasks = (state.selectedChat!.tasks || []).map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
                 const updated = { ...state.selectedChat!, tasks: updatedTasks };
                 state.setSelectedChat(updated);
                 state.setChats(prev => prev.map(c => c.id === updated.id ? updated : c));
              }}
              onDeleteTask={() => {}}
            />
          </div>
        </div>
      )}

      <WhatsAppModals 
        showAI={state.modals.ai} aiTitle="" aiContent="" isGenerating={false} onCloseAI={() => state.setModal('ai', false)}
        showSchedule={state.modals.schedule} onCloseSchedule={() => state.setModal('schedule', false)}
        clientName={state.selectedChat?.clientName || ''}
        showUpload={state.modals.upload} onCloseUpload={() => state.setModal('upload', false)}
        onFileUpload={() => {}} showNewTemplate={state.modals.templateNew} onCloseNewTemplate={() => state.setModal('templateNew', false)}
        onCreateTemplate={() => {}} showEditTemplate={state.modals.templateEdit} onCloseEditTemplate={() => state.setModal('templateEdit', false)}
        templateToEdit={null} onUpdateTemplate={() => {}} showEditClient={state.modals.clientEdit} onCloseEditClient={() => state.setModal('clientEdit', false)}
        clientData={state.selectedChat} onSaveClient={() => {}} showQuote={state.modals.quote} onCloseQuote={() => state.setModal('quote', false)}
        onSendQuote={() => {}} lightboxImage={null} onCloseLightbox={() => {}}
      />
    </div>
  );
};

export default WhatsAppView;