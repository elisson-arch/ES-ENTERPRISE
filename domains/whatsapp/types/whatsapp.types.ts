// whatsapp.types.ts — WhatsApp domain types

export interface ClientTask {
    id: string;
    text: string;
    completed: boolean;
    createdAt: string;
}

export interface ChatSession {
    id: string;
    clientId: string;
    clientName: string;
    clientPhone?: string;
    clientAddress?: string;
    lastMessage: string;
    unreadCount: number;
    aiEnabled: boolean;
    messages: Message[];
    clientType?: 'Residencial' | 'Comercial';
    serviceType?: string;
    status?: 'Ativo' | 'Inativo' | 'Prospecção';
    chatStatus?: 'Aberto' | 'Aguardando' | 'Finalizado';
    funnelStage: 'Prospecção' | 'Diagnóstico' | 'Orçamento Enviado' | 'Negociação' | 'Fechado' | 'Pós-Venda';
    lastStageChange?: string;
    assignedTo?: string;
    createdAt: string;
    updatedAt?: string;
    tasks?: ClientTask[];
    internalNotes?: string;
    billingData?: {
        lastInvoice?: string;
        totalSpent?: number;
        pendingAmount?: number;
    };
}

export interface Message {
    id: string;
    sender: 'client' | 'agent' | 'ai';
    text: string;
    timestamp: string;
    status?: 'sending' | 'sent' | 'delivered' | 'read';
    audioUrl?: string;
    imageUrl?: string;
    fileUrl?: string;
    fileName?: string;
    fileType?: string;
    fileSize?: string;
    displayTime?: string;
    groundingSources?: { title: string; uri: string }[];
}

export interface ChatTemplate {
    id: string;
    title: string;
    category: 'Saudação' | 'Orçamento' | 'Manutenção' | 'Follow-up';
    content: string;
    isApproved: boolean;
    isFavorite?: boolean;
    usageCount: number;
}

export interface WhatsAppState {
    chats: ChatSession[];
    selectedChat: ChatSession | null;
    isMobileView: boolean;
    showChatOnMobile: boolean;
    showDetailsOnMobile: boolean;
    isSending: boolean;
    isRecording: boolean;
    isBulkMode: boolean;
    selectedChatIds: Set<string>;
    inputText: string;
    isSyncing: boolean;
    filters: { search: string; status: string; onlyUnread: boolean };
}

export interface ChatDocV2 {
    id: string;
    clientId: string;
    channel: 'whatsapp';
    aiEnabled: boolean;
    lastMessage: string;
    lastMessageAt: string;
    unreadCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface ChatMessageDocV2 {
    id: string;
    sender: 'ai' | 'client' | 'agent';
    text: string;
    timestamp: string;
    groundingSources?: { title: string; uri: string }[];
}
