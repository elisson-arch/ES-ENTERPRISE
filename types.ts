
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
  clientCode?: string;
  name: string;
  legalName?: string;
  document: string;
  email: string;
  phone: string;
  address: string;
  city?: string;
  state?: string;
  zipCode?: string;
  type: 'Residencial' | 'Comercial';
  assets: Asset[];
  linkedAssetIds?: string[];
  origin: 'Google' | 'Manual' | 'Site' | 'WhatsApp';
  notes?: string;
  syncTimestamp?: string;
  googleContactId?: string;
  lastSyncAt?: string;
  updatedAt: string;
  organizationId: string;
  drive_folder_id?: string;
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

export interface AuditLogEvent {
  id: string;
  organizationId: string;
  eventType: 'CONTACTS_SYNC' | 'DRIVE_FOLDER_CREATED' | 'FILE_UPLOADED' | 'ONBOARDING_COMPLETE';
  timestamp: string;
  details: {
    contactsImported?: number;
    contactsSkipped?: number;
    masterFolderId?: string;
    clientFolderIds?: string[];
    errors?: string[];
  };
  userId: string;
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

// Firestore V2 domain contracts (multi-tenant)
export type OrgUserRole = 'owner' | 'admin' | 'manager' | 'tech' | 'viewer';
export type OrgUserStatus = 'active' | 'disabled' | 'invited';

export interface OrganizationSettings {
  theme: 'light' | 'dark';
  aiModel: string;
  autoDispatch: boolean;
}

export interface OrganizationSubscription {
  tier: 'starter' | 'pro' | 'enterprise';
  status: 'active' | 'past_due' | 'canceled';
}

export interface OrganizationDoc {
  id: string;
  name: string;
  cnpj: string;
  settings: OrganizationSettings;
  subscription: OrganizationSubscription;
  featureFlags?: Record<string, boolean>;
  createdAt: string;
  updatedAt: string;
}

export interface OrgUserDoc {
  id: string;
  name: string;
  email: string;
  role: OrgUserRole;
  status: OrgUserStatus;
  permissions?: string[];
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientContactV2 {
  phone: string;
  email: string;
}

export interface ClientAddressV2 {
  street: string;
  number: string;
  district?: string;
  city: string;
  state: string;
  zipCode: string;
  geo?: { lat: number; lng: number };
  geohash?: string;
}

export interface ClientMetricsV2 {
  totalSpent: number;
  lifetimeValue: number;
  openOrders: number;
}

export interface ClientDocV2 {
  id: string;
  clientCode: string;
  name: string;
  legalName?: string;
  document: string;
  contact: ClientContactV2;
  address: ClientAddressV2;
  funnel: { stage: string; updatedAt: string };
  metrics: ClientMetricsV2;
  status: 'Ativo' | 'Inativo' | 'Prospecção';
  origin: 'Manual' | 'Google' | 'Site' | 'WhatsApp';
  tags?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssetHealthV2 {
  score: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  lastAnalysisAt: string;
}

export interface AssetMaintenanceV2 {
  lastDate?: string;
  nextDue?: string;
}

export interface AssetIotConfigV2 {
  gatewayId?: string;
  sensorTopic?: string;
  lastTelemetryAt?: string;
}

export interface AssetDocV2 {
  id: string;
  assetCode: string;
  clientId: string;
  type: string;
  brand: string;
  model: string;
  serialNumber: string;
  health: AssetHealthV2;
  maintenance: AssetMaintenanceV2;
  iot?: AssetIotConfigV2;
  status: 'active' | 'inactive' | 'maintenance';
  createdAt: string;
  updatedAt: string;
}

export interface OrderCheckPointV2 {
  time: string;
  location?: { lat: number; lng: number };
}

export interface OrderDocV2 {
  id: string;
  orderCode: string;
  clientId: string;
  assetId: string;
  technicianId: string;
  status: 'open' | 'in_progress' | 'paused' | 'completed' | 'canceled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  slaDueAt?: string;
  checkIn?: OrderCheckPointV2;
  checkOut?: OrderCheckPointV2;
  technicalReport?: {
    diagnostic: string;
    partsUsed: string[];
  };
  aiAnalysis?: {
    summary: string;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
  };
  voiceTranscriptUrl?: string;
  createdAt: string;
  updatedAt: string;
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

export interface AuditLogDocV2 {
  id: string;
  organizationId: string;
  entityType: 'client' | 'asset' | 'order' | 'chat' | 'sync';
  entityId: string;
  action: string;
  actorId: string;
  actorName: string;
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface DashboardDailyViewDocV2 {
  id: string;
  date: string; // yyyyMMdd
  newClients: number;
  ordersOpen: number;
  ordersCompleted: number;
  revenue: number;
  topRisks: Array<{ assetId: string; riskLevel: string }>;
}

export interface TenantDriveFileDoc {
  id: string;
  organizationId: string;
  provider: 'google_drive';
  providerFileId: string;
  folderId?: string;
  name: string;
  mimeType: string;
  webViewLink: string;
  sizeBytes?: number;
  category: 'clients' | 'company' | 'all';
  status: 'active' | 'deleted';
  linkedEntityType?: 'client' | 'asset' | 'order' | 'chat' | 'generic';
  linkedEntityId?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}
