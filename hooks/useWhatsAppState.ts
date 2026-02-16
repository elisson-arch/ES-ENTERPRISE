
import { useState, useMemo, useEffect, useRef } from 'react';
import { ChatSession, Message, ClientTask } from '../types';
import { whatsappApiService } from '../services/whatsappApiService';
import { googleSyncService } from '../services/googleSyncService';

export const useWhatsAppState = (initialChats: ChatSession[]) => {
  const [chats, setChats] = useState<ChatSession[]>(initialChats);
  const [selectedChat, setSelectedChat] = useState<ChatSession | null>(initialChats[0]);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 1024);
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);
  const [showDetailsOnMobile, setShowDetailsOnMobile] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [selectedChatIds, setSelectedChatIds] = useState<Set<string>>(new Set());
  const [inputText, setInputText] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  
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

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredChats = useMemo(() => {
    return chats.filter(chat => {
      const matchesSearch = chat.clientName.toLowerCase().includes(filters.search.toLowerCase());
      const matchesStatus = filters.status === 'all' || chat.status === filters.status;
      const matchesUnread = !filters.onlyUnread || chat.unreadCount > 0;
      return matchesSearch && matchesStatus && matchesUnread;
    });
  }, [chats, filters]);

  const handleSendMessage = async (text: string, sender: 'agent' | 'client' | 'ai' = 'agent', audioUrl?: string) => {
    if (!selectedChat || (!text.trim() && !audioUrl)) return;
    
    setIsSending(true);
    const result = audioUrl 
      ? { success: true, messageId: 'audio_' + Date.now() }
      : await whatsappApiService.sendMessage(selectedChat.clientPhone || '', text);
    
    const newMessage: Message = {
      id: result.messageId || Date.now().toString(),
      sender,
      text: text || "Áudio enviado",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: result.success ? 'sent' : 'sending',
      audioUrl: audioUrl
    };

    const updatedChat = { 
      ...selectedChat, 
      messages: [...selectedChat.messages, newMessage], 
      lastMessage: text || "🎤 Áudio", 
      unreadCount: 0 
    };

    setSelectedChat(updatedChat);
    setChats(prev => prev.map(c => c.id === updatedChat.id ? updatedChat : c));
    setInputText('');
    setIsSending(false);
  };

  const syncLeads = async () => {
    setIsSyncing(true);
    try {
      const googleData = await googleSyncService.pullFromGoogle();
      const newChats: ChatSession[] = googleData.map(data => {
        const existing = chats.find(c => c.clientPhone === data.phones[0]);
        if (existing) return null;
        return {
          id: `sync_${data.googleContactId}`,
          clientId: data.googleContactId,
          clientName: data.name,
          clientPhone: data.phones[0],
          clientAddress: data.address,
          lastMessage: data.notes || 'Lead sincronizado via Nuvem.',
          unreadCount: 0,
          aiEnabled: false,
          clientType: (data.type || 'Residencial') as any,
          status: (data.status || 'Prospecção') as any,
          chatStatus: 'Aberto',
          funnelStage: (data.status || 'Prospecção') as any,
          assignedTo: 'Ricardo IA',
          createdAt: new Date().toISOString(),
          messages: [],
          tasks: [],
          internalNotes: 'Sincronização Profissional v3.0'
        };
      }).filter(c => c !== null) as ChatSession[];

      if (newChats.length > 0) {
        setChats(prev => [...newChats, ...prev]);
        if (isMobileView) setShowChatOnMobile(true);
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
      alert("Não foi possível acessar o microfone. Verifique as permissões.");
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
    selectedChat, setSelectedChat,
    isMobileView,
    showChatOnMobile, setShowChatOnMobile,
    showDetailsOnMobile, setShowDetailsOnMobile,
    isBulkMode, setIsBulkMode,
    selectedChatIds, setSelectedChatIds,
    filters, setFilters,
    inputText, setInputText,
    isSyncing,
    filteredChats,
    handleSendMessage,
    syncLeads,
    handleStartRecording,
    handleStopRecording,
    modals,
    setModal: (name: keyof typeof modals, val: boolean) => setModals(prev => ({...prev, [name]: val})),
    isSending,
    isRecording
  };
};
