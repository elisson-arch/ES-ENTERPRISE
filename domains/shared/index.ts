// ─── COMPONENTES DE UI E NOTIFICAÇÕES ────────────────────────────────────────
export { Navigation } from './components/UI/Navigation';
export { GlobalSearch } from './components/UI/GlobalSearch';
export { HelpGuide } from './components/UI/HelpGuide';
export { MainLayout } from './components/UI/MainLayout';
export { ProtectedRoute } from './components/UI/ProtectedRoute';
export { ToastContainer } from './components/Notifications/ToastContainer';
export { OnboardingModal } from './components/UI/OnboardingModal';

// ─── CONFIGURAÇÕES E TEMAS ───────────────────────────────────────────────────
export { theme, theme2026 } from './config/theme';
export { db, auth, getDb } from './config/firebase';
export { APP_CONFIG, loadSecureConfig } from './config/config';
export { NAVIGATION_ROUTES } from './config/navigation';

// ─── HOOKS GLOBAIS ───────────────────────────────────────────────────────────
export { useAppContext, AppProvider } from './hooks/useAppContext';
export { useTranslation } from './hooks/useTranslation';

// ─── SERVIÇOS BASE ───────────────────────────────────────────────────────────
export { firestoreService } from './services/firestoreService';
export { auditService } from './services/auditService';
export { auditLogService } from './services/auditLogService';
export { t } from './services/i18nService';

// ─── VISUALIZAÇÕES PARTILHADAS (SUB-VIEWS) ───────────────────────────────────
export { default as SettingsView } from './views/settings';
export { default as DocumentsView } from './views/DocumentsView';
export { default as IntegrationsView } from './views/IntegrationsView';
export { default as TermsOfServiceView } from './views/TermsOfServiceView';

// ─── TIPOS COMUNS ────────────────────────────────────────────────────────────
export * from './types/common.types';
