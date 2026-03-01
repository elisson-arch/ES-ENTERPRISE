/**
 * types.ts — Barrel de re-exports por domínio
 *
 * Este arquivo existe por compatibilidade com imports antigos do tipo:
 *   import { Client } from '../types'
 *
 * Prefira importar diretamente do domínio:
 *   import { Client } from '@clients/types/clients.types'
 */

// ─── Auth ────────────────────────────────────────────────────────────────────
export type { OrgUserRole, OrgUserStatus, OrganizationSettings, OrganizationSubscription, OrganizationDoc, OrgUserDoc } from '@auth/types/auth.types';

// ─── Google Workspace ────────────────────────────────────────────────────────
export type { GoogleToken, DriveFile, GoogleTask, GmailMessage, CalendarEvent, SyncLog, TenantDriveFileDoc } from '@google-workspace/types/google-workspace.types';

// ─── Clients ─────────────────────────────────────────────────────────────────
export type { Client, Asset, ClientContactV2, ClientAddressV2, ClientMetricsV2, ClientDocV2 } from '@clients/types/clients.types';

// ─── WhatsApp ────────────────────────────────────────────────────────────────
export type { ClientTask, ChatSession, Message, ChatTemplate, WhatsAppState, ChatDocV2, ChatMessageDocV2 } from '@whatsapp/types/whatsapp.types';

// ─── Inventory ───────────────────────────────────────────────────────────────
export type { AssetHealthV2, AssetMaintenanceV2, AssetIotConfigV2, AssetDocV2, PredictiveAlert, OrderCheckPointV2, OrderDocV2 } from '@inventory/types/inventory.types';

// ─── Site Builder ────────────────────────────────────────────────────────────
export type { ComponentType, SiteElement, SiteTheme, SiteDNA } from '@site-builder/types/site-builder.types';

// ─── Reports ─────────────────────────────────────────────────────────────────
export type { DashboardDailyViewDocV2 } from '@reports/types/reports.types';

// ─── Shared ──────────────────────────────────────────────────────────────────
export type { NotificationType, AppNotification, OnboardingTask, AuditLog, AuditLogEvent, AuditLogDocV2 } from '@shared/types/common.types';
