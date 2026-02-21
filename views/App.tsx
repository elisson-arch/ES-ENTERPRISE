import React, { useState, useEffect } from 'react';
import { HashRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router';
import DashboardView from './DashboardView';
import ClientsView from './ClientsView';
import InventoryView from './InventoryView';
import DocumentsView from './DocumentsView';
import AIView from './AIView';
import WebsiteBuilderView from './WebsiteBuilderView';
import PublicSiteView from './PublicSiteView';
import DriveView from './DriveView';
import WhatsAppView from './WhatsAppView';
import FunnelView from './FunnelView';
import AutomationView from './AutomationView';
import ReportsView from './ReportsView';
import IntegrationsView from './IntegrationsView';
import SecurityView from './SecurityView';
import LoginView from './LoginView';
import PrivacyPolicyView from './PrivacyPolicyView';
import TermsOfServiceView from './TermsOfServiceView';
import { NotificationCenter } from '../components/Notifications/NotificationCenter';
import { ToastContainer } from '../components/Notifications/ToastContainer';
import { GlobalSearch } from '../components/UI/GlobalSearch';
import { HelpGuide } from '../components/UI/HelpGuide';
import { Navigation } from '../components/UI/Navigation';
import { googleApiService } from '../services/googleApiService';
import { useAppContext } from '../hooks/useAppContext';
import { HelpCircle, Key } from 'lucide-react';

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
                  <Routes>
                    <Route path="/" element={<div className="p-4 md:p-6 lg:p-10"><DashboardView /></div>} />
                    <Route path="/whatsapp" element={<WhatsAppView />} />
                    <Route path="/clientes" element={<div className="p-4 md:p-6 lg:p-10"><ClientsView /></div>} />
                    <Route path="/funnel" element={<div className="p-4 md:p-6 lg:p-10 h-full"><FunnelView /></div>} />
                    <Route path="/reports" element={<div className="p-4 md:p-6 lg:p-10 h-full"><ReportsView /></div>} />
                    <Route path="/integrations" element={<div className="p-4 md:p-6 lg:p-10 h-full"><IntegrationsView /></div>} />
                    <Route path="/security" element={<div className="p-4 md:p-6 lg:p-10 h-full"><SecurityView /></div>} />
                    <Route path="/automations" element={<div className="p-4 md:p-6 lg:p-10 h-full"><AutomationView /></div>} />
                    <Route path="/ativos" element={<div className="p-4 md:p-6 lg:p-10"><InventoryView /></div>} />
                    <Route path="/documentos" element={<div className="p-4 md:p-6 lg:p-10"><DocumentsView /></div>} />
                    <Route path="/drive" element={<div className="p-4 md:p-6 lg:p-10"><DriveView /></div>} />
                    <Route path="/ia" element={<div className="p-4 md:p-6 lg:p-10"><AIView /></div>} />
                    <Route path="/site" element={<div className="p-4 md:p-6 lg:p-10"><WebsiteBuilderView /></div>} />
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