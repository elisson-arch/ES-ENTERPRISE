
export interface GoogleToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  scopes: string[];
}

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink: string;
  size?: string;
  modifiedTime: string;
}

export interface ClientTask {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export interface GoogleTask {
  id: string;
  title: string;
  status: string;
  due?: string;
  notes?: string;
}

export interface GmailMessage {
  id: string;
  threadId: string;
  snippet: string;
  payload?: any;
}

export type NotificationType = 'message' | 'funnel' | 'sla' | 'success' | 'upload' | 'automation' | 'predictive';

export interface PredictiveAlert {
  assetId: string;
  clientId: string;
  assetType: string;
  brand: string;
  model: string;
  severity: 'critical' | 'warning' | 'ok';
  daysSinceLastMaintenance: number;
  daysOverdue: number;
  thresholdDays: number;
  suggestedMaintenanceDate: string;
}

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  priority?: 'low' | 'medium' | 'high';
}

export interface Client {
  id: string;
  name: string;
  document: string;
  email: string;
  phone: string;
  address: string;
  type: 'Residencial' | 'Comercial';
  assets: Asset[];
  origin: 'Google' | 'Manual' | 'Site' | 'WhatsApp';
  notes?: string;
  syncTimestamp?: string;
  googleContactId?: string;
  lastSyncAt?: string;
  updatedAt: string;
  organizationId: string;
  additionalEmails?: string[];
  additionalPhones?: string[];
  status: 'Ativo' | 'Inativo' | 'Prospecção';
}

export interface Asset {
  id: string;
  clientId: string;
  type: string;
  brand: string;
  model: string;
  serialNumber: string;
  installationDate: string;
  lastMaintenance?: string;
  organizationId?: string;
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

export interface SyncLog {
  id: string;
  clientName: string;
  service: 'CONTACTS' | 'CALENDAR' | 'DRIVE' | 'GMAIL' | 'SHEETS' | 'TASKS' | 'AUTH';
  action: string;
  status: 'success' | 'failure';
  details: string;
  timestamp: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  ip: string;
  device: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
}

export interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  link: string;
}

export interface CalendarEvent {
  id: string;
  summary: string;
  start: string;
  end: string;
  location?: string;
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

export type ComponentType = 'NAVBAR' | 'HERO' | 'FEATURES' | 'FOOTER' | 'CONTACT' | 'PRICING';

export interface SiteElement {
  id: string;
  type: ComponentType;
  content: Record<string, any>;
  styles: Record<string, any>;
}

export interface SiteTheme {
  primaryColor: string;
  fontFamily: string;
  borderRadius: string;
  backgroundColor: string;
  textColor: string;
}

export interface SiteDNA {
  theme: SiteTheme;
  pages: Record<string, SiteElement[]>;
}
