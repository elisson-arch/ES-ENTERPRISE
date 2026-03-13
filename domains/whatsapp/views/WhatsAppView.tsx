import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatSidebar } from '@whatsapp/components/ChatSidebar';
import { ChatArea } from '@whatsapp/components/ChatArea';
import { ClientCRMDetails } from '@whatsapp/components/ClientCRMDetails';
import { WhatsAppModals } from '@whatsapp/components/WhatsAppModals';
import { useWhatsAppState } from '@whatsapp/hooks/useWhatsAppState';
import { DEFAULT_TEMPLATES } from '@shared/services/mockData';
import { Sparkles, MessageSquare, Info } from 'lucide-react';
import { ChatSession, ChatTemplate } from '@shared/types/common.types';
import { chatService } from '@whatsapp/services/chatService';
import { geminiService } from '@ai/services/geminiService';
import { theme2026 } from '@shared/config/theme';

const WhatsAppView = () => {
  const state = useWhatsAppState([]);

  const [templates] = useState<ChatTemplate[]>(DEFAULT_TEMPLATES);
  const [templateSearchTerm, setTemplateSearchTerm] = useState('');
  const [isTemplateBulkMode, setIsTemplateBulkMode] = useState(false);
  const [selectedTemplateIds, setSelectedTemplateIds] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Saudação']);
  const [templateToEdit, setTemplateToEdit] = useState<ChatTemplate | null>(null);

  const [aiTitle, setAiTitle] = useState('');
  const [aiContent, setAiContent] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [scheduleInitialTitle, setScheduleInitialTitle] = useState('');
  const [scheduleInitialDesc, setScheduleInitialDesc] = useState('');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [internalSearchTerm, setInternalSearchTerm] = useState('');
  const [isCallActive, setIsCallActive] = useState(false);
  const [callSeconds, setCallSeconds] = useState(0);

  const callTimer = useMemo(() => {
    const mins = Math.floor(callSeconds / 60);
    const secs = callSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, [callSeconds]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isCallActive) {
      interval = setInterval(() => setCallSeconds(s => s + 1), 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCallActive]);

  const patchSelectedChat = async (data: Partial<ChatSession>) => {
    if (!state.selectedChat) return;
    try {
      await chatService.upsertChat({ id: state.selectedChat.id, organizationId: state.orgId, ...data });
    } catch (error) {
      console.error('Erro ao atualizar chat:', error);
    }
  };

  const updateSelectedChatLocal = (data: ChatSession) => {
    state.setSelectedChat(data);
  };

  const handleOpenAiModal = async (title: string, prompt: string, context: string) => {
    setAiTitle(title);
    setAiContent('');
    setIsAiGenerating(true);
    state.setModal('ai', true);
    try {
      const response = await geminiService.getDeepResponse(prompt, context);
      setAiContent(response || 'Não foi possível gerar o conteúdo.');
    } catch (error) {
      console.error('Erro ao gerar resposta da IA:', error);
      setAiContent('Erro ao gerar resposta da IA.');
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleExportMessages = () => {
    if (!state.selectedChat) return;
    const content = state.selectedChat.messages?.map(m => `[${m.timestamp}] ${m.sender}: ${m.text}`).join('\n');
    const blob = new Blob([content || ''], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversa-${state.selectedChat.clientName}.txt`;
    a.click();
  };

  const handleArchiveConversation = async () => {
    if (!state.selectedChat) return;
    await patchSelectedChat({ chatStatus: 'Finalizado' });
  };

  const handleShareClient = () => {
    if (!state.selectedChat) return;
    const text = `Cliente: ${state.selectedChat.clientName}\nTelefone: ${state.selectedChat.clientPhone}\nStatus: ${state.selectedChat.status}`;
    navigator.clipboard.writeText(text);
    alert('Dados do cliente copiados para a área de transferência!');
  };

  const handleDeleteTemplate = (id: string) => {
    console.log('Deletar template:', id);
  };

  const handleBulkDeleteTemplates = () => {
    setSelectedTemplateIds(new Set());
    setIsTemplateBulkMode(false);
  };

  const handleCreateTemplate = (template: ChatTemplate) => {
    console.log('Criar template:', template);
    state.setModal('templateNew', false);
  };

  const handleUpdateTemplate = (template: ChatTemplate) => {
    console.log('Atualizar template:', template);
    state.setModal('templateEdit', false);
  };

  const handleSendQuote = (quoteText: string) => {
    state.handleSendMessage(quoteText, 'agent');
    state.setModal('quote', false);
  };

  const handleFileUpload = async (files: File[]) => {
    if (!state.selectedChat?.id) return;
    for (const file of files) {
      await state.handleSendMessage(`Arquivo enviado: ${file.name}`, 'agent');
    }
    state.setModal('upload', false);
  };

  return (
    <div className="flex h-full bg-[#f8fafc] overflow-hidden relative p-4 gap-4">
      {/* Sincronização Inteligente (Skeleton Pulse) */}
      <AnimatePresence>
        {state.isSyncing && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-24 left-1/2 -translate-x-1/2 z-[2000] ${theme2026.glass} ${theme2026.depth.high} px-8 py-4 rounded-full flex items-center gap-4 border-indigo-500/30`}
          >
            <div className="flex gap-1">
              {[1, 2, 3].map(i => (
                <motion.div 
                  key={i}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                  className="w-2 h-2 rounded-full bg-indigo-600"
                />
              ))}
            </div>
            <span className="text-[0.7rem] font-bold text-indigo-900 uppercase tracking-[0.2em]">Sincronizando Leads...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Painel Esquerdo: Navegação e Lista de Chats (Glassmorphism) */}
      <motion.div 
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className={`flex-none w-full md:max-w-xs lg:max-w-[22rem] h-full ${theme2026.glass} ${theme2026.depth.mid} rounded-[2.5rem] overflow-hidden flex flex-col border-white/40 ${state.isMobileView && state.showChatOnMobile ? 'hidden' : 'flex'}`}
      >
        <div className={`${theme2026.gradients.primary} p-6 flex items-center justify-between shrink-0`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
              <MessageSquare className="text-white" size={20} />
            </div>
            <h2 className="text-white font-bold tracking-tight">Conversas</h2>
          </div>
          <button 
            onClick={state.syncLeads}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors border border-white/10"
          >
            <Sparkles className="text-white" size={18} />
          </button>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <ChatSidebar
            chats={state.chats}
            filteredChats={state.filteredChats}
            filters={state.filters}
            onFilterChange={(f) => state.setFilters(prev => ({ ...prev, ...f }))}
            selectedChatId={state.selectedChat?.id || ''}
            onSelectChat={(c) => {
              state.setSelectedChat(c);
              if (state.isMobileView) state.setShowChatOnMobile(true);
            }}
            isBulkMode={state.isBulkMode}
            onToggleBulkMode={() => state.setIsBulkMode(!state.isBulkMode)}
            selectedChatIds={state.selectedChatIds}
            onSync={state.syncLeads}
            isSyncing={state.isSyncing}
          />
        </div>
      </motion.div>

      {/* Painel Central: Chat Imersivo */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className={`flex-1 min-w-0 h-full ${theme2026.glass} ${theme2026.depth.high} rounded-[2.5rem] overflow-hidden flex flex-col border-white/40 relative`}
      >
        {/* IA Pulse Effect when generating */}
        <AnimatePresence>
          {isAiGenerating && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                boxShadow: ["0 0 0px rgba(99, 102, 241, 0)", "0 0 40px rgba(99, 102, 241, 0.4)", "0 0 0px rgba(99, 102, 241, 0)"] 
              }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none z-50 border-4 border-indigo-500/30 rounded-[2.5rem]"
              transition={{ repeat: Infinity, duration: 2 }}
            />
          )}
        </AnimatePresence>

        <ChatArea
          selectedChat={state.selectedChat}
          onSendMessage={state.handleSendMessage}
          inputText={state.inputText}
          onInputTextChange={state.setInputText}
          isTyping={false}
          isSending={state.isSending}
          isCallActive={isCallActive}
          callTimer={callTimer}
          onStartCall={() => { setIsCallActive(true); setCallSeconds(0); }}
          onStopCall={() => setIsCallActive(false)}
          onExport={handleExportMessages}
          onOpenUpload={() => state.setModal('upload', true)}
          onToggleAI={(chat) => {
            const updated = { ...chat, aiEnabled: !chat.aiEnabled };
            updateSelectedChatLocal(updated);
            chatService.upsertChat({ id: updated.id, organizationId: state.orgId, aiEnabled: updated.aiEnabled }).catch(console.error);
          }}
          onArchiveConversation={handleArchiveConversation}
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
      </motion.div>

      {/* Painel Direito: Contexto Ricardo IA e Detalhes CRM */}
      <AnimatePresence>
        {state.selectedChat && (!state.isMobileView || state.showDetailsOnMobile) && (
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 50, opacity: 0 }}
            transition={{ delay: 0.2 }}
            className={`flex-none w-full xl:max-w-[22rem] h-full ${theme2026.glass} ${theme2026.depth.mid} rounded-[2.5rem] overflow-hidden border-white/40 flex flex-col ${state.isMobileView && state.showDetailsOnMobile ? 'absolute inset-0 z-50 bg-white/90 backdrop-blur-xl' : 'hidden xl:flex'}`}
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Info size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Inteligência CRM</h3>
                  <p className="text-[0.65rem] text-slate-500 uppercase font-bold tracking-wider">Contexto Ricardo IA</p>
                </div>
              </div>
              {state.isMobileView && (
                <button 
                  onClick={() => state.setShowDetailsOnMobile(false)}
                  className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <ClientCRMDetails
                chat={state.selectedChat}
                onGenerateReport={() => handleOpenAiModal('Relatório Técnico', `Gere um relatório técnico para o cliente ${state.selectedChat?.clientName}, estágio ${state.selectedChat?.funnelStage}.`, 'Relatório HVAC')}
                onDiagnose={() => handleOpenAiModal('Diagnóstico Técnico', `Faça um diagnóstico técnico considerando o histórico do cliente ${state.selectedChat?.clientName}.`, 'Diagnóstico de Campo')}
                onOpenSchedule={(title?: string, desc?: string) => {
                  setScheduleInitialTitle(title || '');
                  setScheduleInitialDesc(desc || '');
                  state.setModal('schedule', true);
                }}
                onEditClient={() => state.setModal('clientEdit', true)}
                onShareClient={handleShareClient}
                onSyncDrive={state.syncLeads}
                onOpenQuote={() => state.setModal('quote', true)}
                templates={templates}
                templateSearchTerm={templateSearchTerm}
                onTemplateSearchChange={setTemplateSearchTerm}
                isBulkMode={isTemplateBulkMode}
                onToggleBulkMode={() => { setIsTemplateBulkMode(prev => !prev); setSelectedTemplateIds(new Set()); }}
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
                onEditTemplate={(template) => { setTemplateToEdit(template); state.setModal('templateEdit', true); }}
                expandedCategories={expandedCategories}
                onToggleCategory={(cat) => setExpandedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])}
                onNewTemplate={() => { setTemplateToEdit(null); state.setModal('templateNew', true); }}
                onMoveFunnelStage={(stage) => patchSelectedChat({ funnelStage: stage as any, lastStageChange: new Date().toISOString() })}
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
          </motion.div>
        )}
      </AnimatePresence>

      <WhatsAppModals
        showAI={state.modals.ai}
        aiTitle={aiTitle}
        aiContent={aiContent}
        isGenerating={isAiGenerating}
        onCloseAI={() => state.setModal('ai', false)}
        showSchedule={state.modals.schedule}
        onCloseSchedule={() => {
          state.setModal('schedule', false);
          setScheduleInitialTitle('');
          setScheduleInitialDesc('');
        }}
        clientName={state.selectedChat?.clientName || ''}
        clientAddress={state.selectedChat?.clientAddress}
        showUpload={state.modals.upload}
        onCloseUpload={() => state.setModal('upload', false)}
        onFileUpload={handleFileUpload}
        showNewTemplate={state.modals.templateNew}
        onCloseNewTemplate={() => state.setModal('templateNew', false)}
        onCreateTemplate={handleCreateTemplate}
        showEditTemplate={state.modals.templateEdit}
        onCloseEditTemplate={() => { setTemplateToEdit(null); state.setModal('templateEdit', false); }}
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
          state.setModal('schedule', false);
          setScheduleInitialTitle('');
          setScheduleInitialDesc('');
        }}
        scheduleInitialTitle={scheduleInitialTitle}
        scheduleInitialDesc={scheduleInitialDesc}
      />
    </div>
  );
};

export default WhatsAppView;
