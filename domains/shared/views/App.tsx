import React, { useState, useEffect } from 'react';
import { HashRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router';

// ─── Views por domínio ───────────────────────────────────────────────────────
import DashboardView from '@domains/reports/views/DashboardView';
import ReportsView from '@domains/reports/views/ReportsView';
import ClientsView from '@domains/clients/views/ClientsView';
import FunnelView from '@domains/clients/views/FunnelView';
import InventoryView from '@domains/inventory/views/InventoryView';
import DocumentsView from '@shared/views/DocumentsView';
import AIView from '@domains/ai/views/AIView';
import AutomationView from '@domains/ai/views/AutomationView';
import WebsiteBuilderView from '@domains/site-builder/views/WebsiteBuilderView';
import PublicSiteView from '@domains/site-builder/views/PublicSiteView';
import DriveView from '@domains/google-workspace/views/DriveView';
import WhatsAppView from '@domains/whatsapp/views/WhatsAppView';
import TaskManagementView from '@domains/inventory/views/TaskManagementView';
import IntegrationsView from '@shared/views/IntegrationsView';
import SecurityView from '@domains/auth/views/SecurityView';
import LoginView from '@domains/auth/views/LoginView';
import PrivacyPolicyView from '@domains/auth/views/PrivacyPolicyView';
import TermsOfServiceView from '@shared/views/TermsOfServiceView';
import Settings from '@shared/views/Settings';

// ─── Shared Kernel ───────────────────────────────────────────────────────────
import { NotificationCenter } from '@shared/components/Notifications/NotificationCenter';
import { ToastContainer } from '@shared/components/Notifications/ToastContainer';
import { GlobalSearch } from '@shared/components/UI/GlobalSearch';
import { HelpGuide } from '@shared/components/UI/HelpGuide';
import { Navigation } from '@shared/components/UI/Navigation';
import { useAppContext } from '@shared/hooks/useAppContext';

// ─── Google Workspace ────────────────────────────────────────────────────────
import { googleApiService } from '@domains/google-workspace/services/googleApiService';

import { HelpCircle, Key, ShieldAlert } from 'lucide-react';


const App: React.FC = () => {
  const {
    isAuthenticated, setIsAuthenticated,
    notifications, unreadCount, markAsRead, clearAllNotifications,
    isDarkMode, toggleTheme
  } = useAppContext();

  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [toasts, setToasts] = useState<any[]>([]);
  const accessProfile = googleApiService.getAccessProfile();

  useEffect(() => {
    setIsAuthenticated(googleApiService.isAuthenticated());

    const handler = () => setIsAuthenticated(googleApiService.isAuthenticated());
    window.addEventListener('google_auth_change', handler);

    const checkApiKey = async () => {
      // No modo Cloud Run/Proxy, não precisamos verificar chaves no window
      setHasApiKey(true);
    };
    checkApiKey();

    const handleKeyReset = () => {
      setHasApiKey(false);
      handleSelectApiKey();
    };
    window.addEventListener('aistudio_key_reset', handleKeyReset);

    return () => {
      window.removeEventListener('google_auth_change', handler);
      window.removeEventListener('aistudio_key_reset', handleKeyReset);
    };
  }, []);

  const handleSelectApiKey = async () => {
    // Agora o servidor gerencia a chave, mas mantemos o placeholder se o usuário quiser trocar via UI futuramente
    setHasApiKey(true);
  };

  const guardRoute = (routeId: string, element: React.ReactNode) => {
    if (googleApiService.canAccessRoute(routeId)) return element;

    return (
      <div className="p-4 md:p-6 lg:p-10">
        <div className="max-w-3xl bg-white border border-amber-100 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center gap-3 text-amber-600 mb-4">
            <ShieldAlert size={22} />
            <h3 className="text-sm font-black uppercase tracking-widest">Permissão Insuficiente</h3>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Este módulo requer permissões adicionais do Google. Autorize os escopos pendentes
            e habilite o serviço/API correspondente na conta para desbloquear.
          </p>
        </div>
      </div>
    );
  };

  if (!isAuthenticated) {
    return <LoginView onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  if (hasApiKey === false) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-[28rem] w-full bg-white rounded-[3rem] p-10 shadow-2xl space-y-8">
          <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
            <Key size={40} />
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-800 italic uppercase tracking-tighter">Configuração de IA</h2>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
              Problema de autenticação detectado com os motores Ricardo IA.
            </p>
          </div>
          <button
            onClick={handleSelectApiKey}
            className="w-full h-[3.5rem] bg-blue-600 text-white rounded-2xl font-black text-[0.625rem] uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all"
          >
            Reconectar Ricardo IA
          </button>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <div className={`flex flex-col lg:flex-row min-h-screen overflow-hidden ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-800'}`}>
        <Routes>
          <Route path="/privacy" element={<PrivacyPolicyView />} />
          <Route path="/terms" element={<TermsOfServiceView />} />
          <Route path="/v/:slug" element={<PublicSiteView />} />

          <Route path="*" element={
            <>
              <Navigation
                unreadNotifications={unreadCount}
                onToggleNotifications={() => setIsNotifOpen(true)}
                onOpenSearch={() => setIsSearchOpen(true)}
                isDarkMode={isDarkMode}
                toggleTheme={toggleTheme}
              />

              <main className="flex-1 lg:ml-64 relative overflow-hidden flex flex-col pt-16 lg:pt-0 pb-24 lg:pb-0">
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  {!accessProfile.fullAccess && (
                    <div className="px-4 md:px-6 lg:px-10 pt-4">
                      <div className="bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3 text-[11px] font-bold text-amber-700">
                        Acesso parcial detectado ({accessProfile.accountType}). Autorize os escopos pendentes e habilite os serviços/API necessários.
                      </div>
                    </div>
                  )}
                  <Routes>
                    <Route path="/" element={guardRoute('dashboard', <div className="p-4 md:p-6 lg:p-10"><DashboardView /></div>)} />
                    <Route path="/whatsapp" element={guardRoute('whatsapp', <WhatsAppView />)} />
                    <Route path="/clientes" element={guardRoute('clients', <div className="p-4 md:p-6 lg:p-10"><ClientsView /></div>)} />
                    <Route path="/funnel" element={guardRoute('funnel', <div className="p-4 md:p-6 lg:p-10 h-full"><FunnelView /></div>)} />
                    <Route path="/reports" element={guardRoute('reports', <div className="p-4 md:p-6 lg:p-10 h-full"><ReportsView /></div>)} />
                    <Route path="/integrations" element={guardRoute('integrations', <div className="p-4 md:p-6 lg:p-10 h-full"><IntegrationsView /></div>)} />
                    <Route path="/security" element={guardRoute('security', <div className="p-4 md:p-6 lg:p-10 h-full"><SecurityView /></div>)} />
                    <Route path="/automations" element={guardRoute('automations', <div className="p-4 md:p-6 lg:p-10 h-full"><AutomationView /></div>)} />
                    <Route path="/ativos" element={guardRoute('inventory', <div className="p-4 md:p-6 lg:p-10"><InventoryView /></div>)} />
                    <Route path="/documentos" element={guardRoute('documents', <div className="p-4 md:p-6 lg:p-10"><DocumentsView /></div>)} />
                    <Route path="/drive" element={guardRoute('drive', <div className="p-4 md:p-6 lg:p-10"><DriveView /></div>)} />
                    <Route path="/ia" element={guardRoute('ia', <div className="p-4 md:p-6 lg:p-10"><AIView /></div>)} />
                    <Route path="/tarefas" element={<TaskManagementView />} />
                    <Route path="/site" element={guardRoute('site', <div className="p-4 md:p-6 lg:p-10"><WebsiteBuilderView /></div>)} />
                    <Route path="/settings" element={<div className="p-4 md:p-6 lg:p-10"><Settings /></div>} />
                  </Routes>
                </div>
              </main>

              <NotificationCenter
                isOpen={isNotifOpen}
                onClose={() => setIsNotifOpen(false)}
                notifications={notifications}
                onMarkRead={markAsRead}
                onClearAll={clearAllNotifications}
              />

              <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
              <HelpGuide isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

              <div className="fixed bottom-28 lg:bottom-10 left-8 z-40">
                <button
                  onClick={() => setIsHelpOpen(true)}
                  className="w-14 h-14 bg-white border border-slate-200 rounded-full shadow-2xl flex items-center justify-center text-blue-600 hover:scale-110 active:scale-90 transition-all focus:outline-none focus:ring-4 focus:ring-blue-100"
                  aria-label="Ajuda"
                >
                  <HelpCircle size={28} />
                </button>
              </div>

              <ToastContainer toasts={toasts} onDismiss={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />
            </>
          } />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;

