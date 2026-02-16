import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
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
import { AppNotification } from '../types';
import { googleApiService } from '../services/googleApiService';
import { HelpCircle, Key } from 'lucide-react';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(googleApiService.isAuthenticated());
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  
  useEffect(() => {
    const handler = () => setIsAuthenticated(googleApiService.isAuthenticated());
    window.addEventListener('google_auth_change', handler);
    
    const checkApiKey = async () => {
      const selected = await window.aistudio.hasSelectedApiKey();
      setHasApiKey(selected);
    };
    checkApiKey();

    return () => window.removeEventListener('google_auth_change', handler);
  }, []);

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: '1',
      type: 'sla',
      title: 'Alerta de SLA',
      description: 'Condomínio Aurora aguarda resposta há 20 min.',
      timestamp: new Date().toISOString(),
      isRead: false,
      priority: 'high'
    }
  ]);

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [toasts, setToasts] = useState<AppNotification[]>([]);

  const handleSelectApiKey = async () => {
    await window.aistudio.openSelectKey();
    setHasApiKey(true);
  };

  if (!isAuthenticated) {
    return <LoginView onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  if (hasApiKey === false) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white rounded-[3rem] p-10 shadow-2xl space-y-8">
          <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
            <Key size={40} />
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-800 italic uppercase tracking-tighter">Configuração de IA</h2>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
              Para utilizar os motores de IA Gemini 3 e Veo, você deve selecionar uma chave de API vinculada a um projeto com faturamento ativo.
            </p>
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs font-black text-blue-600 hover:underline block uppercase tracking-widest"
            >
              Documentação de Faturamento →
            </a>
          </div>
          <button 
            onClick={handleSelectApiKey}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all"
          >
            Selecionar Chave de API
          </button>
        </div>
      </div>
    );
  }

  if (hasApiKey === null) return null;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <HashRouter>
      <div className={`flex min-h-screen ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-800'}`}>
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
                toggleTheme={() => setIsDarkMode(!isDarkMode)}
              />
              
              <main className="flex-1 lg:ml-64 p-0 transition-all pb-20 lg:pb-0 pt-16 lg:pt-0">
                <div className="h-full flex flex-col">
                  <Routes>
                    <Route path="/" element={<div className="p-4 lg:p-8"><DashboardView /></div>} />
                    <Route path="/whatsapp" element={<WhatsAppView />} />
                    <Route path="/funnel" element={<div className="p-4 lg:p-8 h-full"><FunnelView /></div>} />
                    <Route path="/reports" element={<div className="p-4 lg:p-8 h-full"><ReportsView /></div>} />
                    <Route path="/integrations" element={<div className="p-4 lg:p-8 h-full"><IntegrationsView /></div>} />
                    <Route path="/security" element={<div className="p-4 lg:p-8 h-full"><SecurityView /></div>} />
                    <Route path="/automations" element={<div className="p-4 lg:p-8 h-full"><AutomationView /></div>} />
                    <Route path="/clientes" element={<div className="p-4 lg:p-8"><ClientsView /></div>} />
                    <Route path="/ativos" element={<div className="p-4 lg:p-8"><InventoryView /></div>} />
                    <Route path="/documentos" element={<div className="p-4 lg:p-8"><DocumentsView /></div>} />
                    <Route path="/drive" element={<div className="p-4 lg:p-8"><DriveView /></div>} />
                    <Route path="/ia" element={<div className="p-4 lg:p-8"><AIView /></div>} />
                    <Route path="/site" element={<div className="p-4 lg:p-8"><WebsiteBuilderView /></div>} />
                  </Routes>
                </div>
              </main>

              <NotificationCenter 
                isOpen={isNotifOpen} 
                onClose={() => setIsNotifOpen(false)}
                notifications={notifications}
                onMarkRead={(id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))}
                onClearAll={() => setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))}
              />

              <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
              <HelpGuide isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
              <div className="fixed bottom-20 lg:bottom-8 left-8 z-[500]">
                 <button onClick={() => setIsHelpOpen(true)} className="w-12 h-12 bg-white border border-slate-200 rounded-full shadow-2xl flex items-center justify-center text-blue-600 hover:scale-110 transition-transform">
                   <HelpCircle size={24} />
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