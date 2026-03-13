
import { useState, useMemo, useEffect, useRef } from 'react';
import { ChatSession, Message, ClientTask } from '@shared/types/common.types';
import { whatsappApiService, chatService } from '@whatsapp';
import { googleSyncService } from '@google-workspace';
import { tenantService } from '@auth';

export const useWhatsAppState = (initialChats: ChatSession[]) => {
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 1024);
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);
  const [showDetailsOnMobile, setShowDetailsOnMobile] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [selectedChatIds, setSelectedChatIds] = useState<Set<string>>(new Set());
  const [inputText, setInputText] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [orgId, setOrgId] = useState(tenantService.getCurrentOrgId());

  // Estados de Modais
  const [modals, setModals] = useState({
    upload: false,
    schedule: false,
    ai: false,
    clientEdit: false,
    templateNew: false,
    templateEdit: false,
    quote: false
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    onlyUnread: false
  });

  // Listener para os Chats da Organização
  useEffect(() => {
    const unsubscribe = chatService.subscribeToChats(orgId, (data) => {
      setChats(data);
      // Se não houver nada selecionado, seleciona o primeiro
      setSelectedChat((prev) => {
        if (data.length === 0) return null;
        if (!prev) return data[0];
        const current = data.find((chat) => chat.id === prev.id);
        return current || data[0];
      });
    });
    return () => unsubscribe();
  }, [orgId]);

  useEffect(() => {
    const handleAuthChange = () => {
      const derived = tenantService.resolveAndPersistFromSession();
      setOrgId(derived);
    };
    window.addEventListener('google_auth_change', handleAuthChange);
    return () => window.removeEventListener('google_auth_change', handleAuthChange);
  }, []);

  // Listener para as Mensagens do Chat Selecionado
  useEffect(() => {
    if (!selectedChat?.id) {
      setMessages([]);
      return;
    }

    const unsubscribe = chatService.subscribeToMessages(selectedChat.id, (data) => {
      setMessages(data);
    });
    return () => unsubscribe();
  }, [selectedChat?.id]);

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredChats = useMemo(() => {
    return chats.filter(chat => {
      const matchesSearch = chat.clientName?.toLowerCase().includes(filters.search.toLowerCase());
      const matchesStatus = filters.status === 'all' || chat.status === filters.status;
      const matchesUnread = !filters.onlyUnread || chat.unreadCount > 0;
      return matchesSearch && matchesStatus && matchesUnread;
    });
  }, [chats, filters]);

  const handleSendMessage = async (text: string, sender: 'agent' | 'client' | 'ai' = 'agent', audioUrl?: string) => {
    if (!selectedChat?.id || (!text.trim() && !audioUrl)) return;

    setIsSending(true);

    // 1. Simular envio para API externa (WhatsApp Real)
    const result = audioUrl
      ? { success: true, messageId: 'audio_' + Date.now() }
      : await whatsappApiService.sendMessage(selectedChat.clientPhone || '', text);

    // 2. Persistir no Firestore (o listener cuidará da atualização da UI)
    await chatService.sendMessage(selectedChat.id, {
      sender,
      text: text || "🎤 Áudio",
      timestamp: new Date().toISOString(),
      status: result.success ? 'sent' : 'sending',
      audioUrl: audioUrl
    });

    setInputText('');
    setIsSending(false);
  };

  const syncLeads = async () => {
    setIsSyncing(true);
    try {
      const googleData = await googleSyncService.pullFromGoogle();
      for (const data of googleData) {
        const existing = chats.find(c => c.clientPhone === data.phones[0]);
        if (!existing) {
          await chatService.upsertChat({
            clientId: data.googleContactId,
            clientName: data.name,
            clientPhone: data.phones[0],
            clientAddress: data.address,
            lastMessage: data.notes || 'Novo Lead via Google Sync',
            unreadCount: 0,
            aiEnabled: false,
            clientType: (data.type || 'Residencial') as any,
            status: (data.status || 'Prospecção') as any,
            chatStatus: 'Aberto',
            funnelStage: (data.status || 'Prospecção') as any,
            organizationId: orgId
          });
        }
      }
    } catch (error) {
      console.error("Erro na sincronização profissional:", error);
    } finally {
      setTimeout(() => setIsSyncing(false), 800);
    }
  };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        handleSendMessage('', 'agent', audioUrl);
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Erro ao acessar microfone:", err);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return {
    chats, setChats,
    selectedChat: selectedChat ? { ...selectedChat, messages } : null,
    setSelectedChat,
    isMobileView,
    showChatOnMobile, setShowChatOnMobile,
    showDetailsOnMobile, setShowDetailsOnMobile,
    isBulkMode, setIsBulkMode,
    selectedChatIds, setSelectedChatIds,
    filters, setFilters,
    inputText, setInputText,
    orgId,
    isSyncing,
    filteredChats,
    handleSendMessage,
    syncLeads,
    handleStartRecording,
    handleStopRecording,
    modals,
    setModal: (name: keyof typeof modals, val: boolean) => setModals(prev => ({ ...prev, [name]: val })),
    isSending,
    isRecording
  };
};
