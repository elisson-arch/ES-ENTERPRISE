import React, { useEffect, useMemo, useState } from 'react';
import { ChatSidebar } from '../components/WhatsApp/ChatSidebar';
import { ChatArea } from '../components/WhatsApp/ChatArea';
import { ClientCRMDetails } from '../components/WhatsApp/ClientCRMDetails';
import { WhatsAppModals } from '../components/WhatsApp/WhatsAppModals';
import { useWhatsAppState } from '@whatsapp/hooks/useWhatsAppState';
import { DEFAULT_TEMPLATES } from '@shared/services/mockData';
import { X, Sparkles } from 'lucide-react';
import { ChatSession, ChatTemplate } from '../types';
import { chatService } from '@whatsapp/services/chatService';
import { geminiService } from '@ai/services/geminiService';

const fileToBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve((reader.result as string) || '');
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

const WhatsAppView = () => {
  const state = useWhatsAppState([]);

  const [templates, setTemplates] = useState<ChatTemplate[]>(DEFAULT_TEMPLATES);
  const [templateSearchTerm, setTemplateSearchTerm] = useState('');
  const [isTemplateBulkMode, setIsTemplateBulkMode] = useState(false);
  const [selectedTemplateIds, setSelectedTemplateIds] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Saudação']);
  const [templateToEdit, setTemplateToEdit] = useState<ChatTemplate | null>(null);

  const [aiTitle, setAiTitle] = useState('');
  const [aiContent, setAiContent] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [internalSearchTerm, setInternalSearchTerm] = useState('');

  const [isCallActive, setIsCallActive] = useState(false);
  const [callSeconds, setCallSeconds] = useState(0);

  useEffect(() => {
    if (!isCallActive) return;
    const timer = setInterval(() => setCallSeconds(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, [isCallActive]);

  const callTimer = useMemo(() => {
    const min = String(Math.floor(callSeconds / 60)).padStart(2, '0');
    const sec = String(callSeconds % 60).padStart(2, '0');
    return `${min}:${sec}`;
  }, [callSeconds]);

  const updateSelectedChatLocal = (updated: ChatSession) => {
    state.setSelectedChat(updated);
    state.setChats(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  const patchSelectedChat = async (patch: Partial<ChatSession>) => {
    if (!state.selectedChat) return;
    const updated = { ...state.selectedChat, ...patch };
    updateSelectedChatLocal(updated);
    try {
      await chatService.upsertChat({ id: updated.id, organizationId: state.orgId, ...patch });
    } catch (err) {
      console.error('Erro ao persistir atualização do chat:', err);
    }
  };

  const handleShareClient = async () => {
    if (!state.selectedChat) return;

    const client = state.selectedChat;
    const shareText = `*Perfil do Cliente - ES Enterprise*\n\n` +
      `👤 *Nome:* ${client.clientName}\n` +
      `📞 *Telefone:* ${client.clientPhone || 'N/A'}\n` +
      `🚀 *Status Funil:* ${client.funnelStage}\n` +
      `Acesse no ES Enterprise: ${window.location.origin}/#/clientes`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Perfil: ${client.clientName}`,
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Erro ao compartilhar:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        alert('Copiado!');
      } catch {
        alert('Erro ao copiar.');
      }
    }
  };

  const handleOpenAiModal = async (title: string, prompt: string, context: string) => {
    setAiTitle(title);
    setAiContent('');
    setIsAiGenerating(true);
    state.setModal('ai', true);

    try {
      const text = await geminiService.getDeepResponse(prompt, context);
      setAiContent(text || 'Sem resposta da IA.');
    } catch (err) {
      console.error('Erro na ação de IA:', err);
      setAiContent('Não foi possível gerar resposta agora. Tente novamente em instantes.');
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleExportMessages = () => {
    if (!state.selectedChat) return;

    const content = state.selectedChat.messages
      .map((m) => `[${m.timestamp}] ${m.sender.toUpperCase()}: ${m.text}`)
      .join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${state.selectedChat.clientName.replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleArchiveConversation = async (chat: ChatSession) => {
    if (chat.id !== state.selectedChat?.id) {
      state.setSelectedChat(chat);
    }
    await patchSelectedChat({ chatStatus: 'Finalizado', status: 'Inativo' });
  };

  const handleFileUpload = async (files: File[]) => {
    if (!state.selectedChat?.id) return;

    for (const file of files) {
      const messageBase = {
        sender: 'agent' as const,
        text: `📎 Arquivo enviado: ${file.name}`,
        timestamp: new Date().toISOString(),
        status: 'sent' as const,
        fileName: file.name,
        fileType: file.type,
        fileSize: `${Math.round(file.size / 1024)} KB`
      };

      const payload = file.type.startsWith('image/')
        ? { ...messageBase, imageUrl: await fileToBase64(file) }
        : { ...messageBase, fileUrl: URL.createObjectURL(file) };

      await chatService.sendMessage(state.selectedChat.id, payload);
    }
  };

  const handleCreateTemplate = (template: { title: string; content: string; category: any; isApproved: boolean; }) => {
    const newTemplate: ChatTemplate = {
      id: `tpl_${Date.now()}`,
      title: template.title,
      content: template.content,
      category: template.category,
      isApproved: template.isApproved,
      usageCount: 0
    };
    setTemplates(prev => [newTemplate, ...prev]);
  };

  const handleUpdateTemplate = (updated: ChatTemplate) => {
    setTemplates(prev => prev.map(t => t.id === updated.id ? updated : t));
    setTemplateToEdit(null);
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
    setSelectedTemplateIds(prev => {
      const next = new Set(prev);
      next.delete(templateId);
      return next;
    });
  };

  const handleBulkDeleteTemplates = () => {
    if (selectedTemplateIds.size === 0) return;
    setTemplates(prev => prev.filter(t => !selectedTemplateIds.has(t.id)));
    setSelectedTemplateIds(new Set());
    setIsTemplateBulkMode(false);
  };

  const handleSendQuote = async (quoteText: string) => {
    if (!quoteText.trim()) return;
    await state.handleSendMessage(quoteText, 'agent');
  };

  return (
    <div className="flex h-full bg-white overflow-hidden relative">
      {state.isSyncing && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[2000] bg-indigo-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4">
          <Sparkles size={20} className="animate-pulse" />
          <span className="text-[0.625rem] font-black uppercase tracking-widest">Sincronizando...</span>
        </div>
      )}

      {(!state.isMobileView || !state.showChatOnMobile) && (
        <div className="flex-none w-full md:max-w-xs lg:max-w-[20rem] h-full border-r border-slate-200">
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
                if (state.isMobileView) state.setShowChatOnMobile(true);
              }
            }}
            isBulkMode={state.isBulkMode}
            onToggleBulkMode={() => state.setIsBulkMode(!state.isBulkMode)}
            selectedChatIds={state.selectedChatIds}
            onSync={state.syncLeads}
            isSyncing={state.isSyncing}
          />
        </div>
      )}

      <div className="flex-1 min-w-0 h-full">
        <ChatArea
          selectedChat={state.selectedChat}
          onSendMessage={state.handleSendMessage}
          inputText={state.inputText}
          onInputTextChange={state.setInputText}
          isTyping={false}
          isSending={state.isSending}
          isCallActive={isCallActive}
          callTimer={callTimer}
          onStartCall={() => {
            setIsCallActive(true);
            setCallSeconds(0);
          }}
          onStopCall={() => setIsCallActive(false)}
          onExport={handleExportMessages}
          onOpenUpload={() => state.setModal('upload', true)}
          onToggleAI={(chat) => {
            const updated = { ...chat, aiEnabled: !chat.aiEnabled };
            updateSelectedChatLocal(updated);
            chatService.upsertChat({ id: updated.id, organizationId: state.orgId, aiEnabled: updated.aiEnabled }).catch(console.error);
          }}
          onArchiveConversation={handleArchiveConversation}
          onImageClick={(url) => setLightboxImage(url)}
          onBack={() => { state.setShowChatOnMobile(false); state.setShowDetailsOnMobile(false); }}
          isMobileView={state.isMobileView}
          showChatOnMobile={state.showChatOnMobile}
          pendingSuggestion={null}
          onDiscardSuggestion={() => { }}
          onEditSuggestion={() => { }}
          onSendSuggestion={() => { }}
          internalSearchTerm={internalSearchTerm}
          onInternalSearchChange={setInternalSearchTerm}
          onOpenDetails={() => state.setShowDetailsOnMobile(true)}
          isRecording={state.isRecording}
          onStartRecording={state.handleStartRecording}
          onStopRecording={state.handleStopRecording}
        />
      </div>

      {state.selectedChat && (
        <div className={`${state.isMobileView ? `fixed inset-x-0 bottom-0 z-[1000] transform transition-transform duration-300 ${state.showDetailsOnMobile ? 'translate-y-0' : 'translate-y-full'}` : 'flex-none w-full max-w-[20rem] h-full border-l border-slate-200 hidden xl:block'}`}>
          {state.isMobileView && state.showDetailsOnMobile && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => state.setShowDetailsOnMobile(false)} />
          )}
          <div className={`${state.isMobileView ? 'bg-white rounded-t-[3rem] shadow-2xl max-h-[85vh] overflow-hidden flex flex-col' : 'h-full overflow-y-auto'}`}>
            {state.isMobileView && (
              <div className="p-4 flex justify-center items-center relative border-b shrink-0 h-[2.75rem]">
                <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
                <button onClick={() => state.setShowDetailsOnMobile(false)} className="absolute right-6 w-11 h-11 flex items-center justify-center text-slate-400 bg-slate-50 rounded-full"><X size={20} /></button>
              </div>
            )}
            <ClientCRMDetails
              chat={state.selectedChat}
              onGenerateWebsite={() => handleOpenAiModal('Site para o Cliente', `Crie uma proposta curta de landing page para o cliente ${state.selectedChat?.clientName}.`, 'Website Comercial')}
              onGenerateReport={() => handleOpenAiModal('Relatório Técnico', `Gere um relatório técnico para o cliente ${state.selectedChat?.clientName}, estágio ${state.selectedChat?.funnelStage}.`, 'Relatório HVAC')}
              onDiagnose={() => handleOpenAiModal('Diagnóstico Técnico', `Faça um diagnóstico técnico considerando o histórico do cliente ${state.selectedChat?.clientName}.`, 'Diagnóstico de Campo')}
              onOpenSchedule={() => state.setModal('schedule', true)}
              onEditClient={() => state.setModal('clientEdit', true)}
              onShareClient={handleShareClient}
              onSyncDrive={state.syncLeads}
              onOpenQuote={() => state.setModal('quote', true)}
              templates={templates}
              templateSearchTerm={templateSearchTerm}
              onTemplateSearchChange={setTemplateSearchTerm}
              isBulkMode={isTemplateBulkMode}
              onToggleBulkMode={() => {
                setIsTemplateBulkMode(prev => !prev);
                setSelectedTemplateIds(new Set());
              }}
              selectedTemplateIds={selectedTemplateIds}
              onToggleSelection={(id) => {
                setSelectedTemplateIds(prev => {
                  const next = new Set(prev);
                  if (next.has(id)) next.delete(id); else next.add(id);
                  return next;
                });
              }}
              onSelectAllTemplates={(ids) => setSelectedTemplateIds(new Set(ids))}
              onClearTemplateSelection={() => setSelectedTemplateIds(new Set())}
              onBulkDelete={handleBulkDeleteTemplates}
              onDeleteTemplate={handleDeleteTemplate}
              onSelectTemplate={(content) => state.setInputText(content)}
              onEditTemplate={(template) => {
                setTemplateToEdit(template);
                state.setModal('templateEdit', true);
              }}
              expandedCategories={expandedCategories}
              onToggleCategory={(cat) => setExpandedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])}
              onNewTemplate={() => {
                setTemplateToEdit(null);
                state.setModal('templateNew', true);
              }}
              onMoveFunnelStage={(stage) => patchSelectedChat({ funnelStage: stage, lastStageChange: new Date().toISOString() })}
              onAddTask={(text) => {
                if (!state.selectedChat) return;
                const newTask = { id: Date.now().toString(), text, completed: false, createdAt: new Date().toISOString() };
                patchSelectedChat({ tasks: [...(state.selectedChat.tasks || []), newTask] });
              }}
              onToggleTask={(taskId) => {
                if (!state.selectedChat) return;
                const updatedTasks = (state.selectedChat.tasks || []).map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
                patchSelectedChat({ tasks: updatedTasks });
              }}
              onDeleteTask={(taskId) => {
                if (!state.selectedChat) return;
                patchSelectedChat({ tasks: (state.selectedChat.tasks || []).filter(t => t.id !== taskId) });
              }}
              onSaveInternalNotes={(notes) => patchSelectedChat({ internalNotes: notes })}
            />
          </div>
        </div>
      )}

      <WhatsAppModals
        showAI={state.modals.ai}
        aiTitle={aiTitle}
        aiContent={aiContent}
        isGenerating={isAiGenerating}
        onCloseAI={() => state.setModal('ai', false)}
        showSchedule={state.modals.schedule}
        onCloseSchedule={() => state.setModal('schedule', false)}
        clientName={state.selectedChat?.clientName || ''}
        clientAddress={state.selectedChat?.clientAddress}
        showUpload={state.modals.upload}
        onCloseUpload={() => state.setModal('upload', false)}
        onFileUpload={handleFileUpload}
        showNewTemplate={state.modals.templateNew}
        onCloseNewTemplate={() => state.setModal('templateNew', false)}
        onCreateTemplate={handleCreateTemplate}
        showEditTemplate={state.modals.templateEdit}
        onCloseEditTemplate={() => {
          setTemplateToEdit(null);
          state.setModal('templateEdit', false);
        }}
        templateToEdit={templateToEdit}
        onUpdateTemplate={handleUpdateTemplate}
        showEditClient={state.modals.clientEdit}
        onCloseEditClient={() => state.setModal('clientEdit', false)}
        clientData={state.selectedChat}
        onSaveClient={(updatedData) => patchSelectedChat(updatedData)}
        showQuote={state.modals.quote}
        onCloseQuote={() => state.setModal('quote', false)}
        onSendQuote={handleSendQuote}
        lightboxImage={lightboxImage}
        onCloseLightbox={() => setLightboxImage(null)}
        onConfirmSchedule={(details) => {
          const summary = `Agendamento confirmado para ${details.date} às ${details.time}.`;
          state.handleSendMessage(summary, 'agent').catch(console.error);
        }}
      />
    </div>
  );
};

export default WhatsAppView;
