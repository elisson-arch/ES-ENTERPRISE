import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppContext, MainLayout, ProtectedRoute, ToastContainer, theme2026 } from '@shared';

// ─── CARREGAMENTO PREGUIÇOSO (LAZY LOADING) ──────────────────────────────────
const LoginView = lazy(() => import('@auth').then(m => ({ default: m.LoginView })));
const DashboardView = lazy(() => import('@reports').then(m => ({ default: m.DashboardView })));
const WhatsAppView = lazy(() => import('@whatsapp').then(m => ({ default: m.WhatsAppView })));
const InventoryView = lazy(() => import('@inventory').then(m => ({ default: m.InventoryView })));
const ClientsView = lazy(() => import('@clients').then(m => ({ default: m.ClientsView })));
const SettingsView = lazy(() => import('@shared').then(m => ({ default: m.SettingsView })));
const FunnelView = lazy(() => import('@clients').then(m => ({ default: m.FunnelView })));
const ReportsView = lazy(() => import('@reports').then(m => ({ default: m.ReportsView })));
const IntegrationsView = lazy(() => import('@shared').then(m => ({ default: m.IntegrationsView })));
const SecurityView = lazy(() => import('@auth').then(m => ({ default: m.SecurityView })));
const AutomationView = lazy(() => import('@ai').then(m => ({ default: m.AutomationView })));
const DocumentsView = lazy(() => import('@shared').then(m => ({ default: m.DocumentsView })));
const DriveView = lazy(() => import('@google-workspace').then(m => ({ default: m.DriveView })));
const AIView = lazy(() => import('@ai').then(m => ({ default: m.AIView })));
const AITrainingCenterView = lazy(() => import('@ai').then(m => ({ default: m.AITrainingCenterView })));
const TaskManagementView = lazy(() => import('@inventory').then(m => ({ default: m.TaskManagementView })));
const WebsiteBuilderView = lazy(() => import('@site-builder').then(m => ({ default: m.WebsiteBuilderView })));
const PublicSiteView = lazy(() => import('@site-builder').then(m => ({ default: m.PublicSiteView })));
const PrivacyPolicyView = lazy(() => import('@auth').then(m => ({ default: m.PrivacyPolicyView })));
const TermsOfServiceView = lazy(() => import('@shared').then(m => ({ default: m.TermsOfServiceView })));
const RicardoCommandPalette = lazy(() => import('@ai').then(m => ({ default: m.RicardoCommandPalette })));

// Componente de Skeleton para transições suaves
const PageLoader = () => (
  <div className="flex items-center justify-center h-full bg-slate-50 min-h-[400px]">
    <div className={`flex flex-col items-center gap-4 p-8 rounded-3xl ${theme2026.glass} ${theme2026.depth.high}`}>
      <div className={`animate-spin rounded-full h-12 w-12 border-b-2 border-transparent border-t-white ${theme2026.gradients.primary}`} style={{ WebkitMask: 'radial-gradient(farthest-side,#0000 calc(100% - 4px),#000 0)' }}></div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Carregando Ricardo IA...</p>
    </div>
  </div>
);

const App = () => {
  const { user, loading } = useAppContext();

  if (loading) return <PageLoader />;

  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/login" element={!user ? <LoginView /> : <Navigate to="/dashboard" />} />
          <Route path="/v/:slug" element={<PublicSiteView />} />
          <Route path="/privacy" element={<PrivacyPolicyView />} />
          <Route path="/terms" element={<TermsOfServiceView />} />

          {/* Rotas Privadas (Envolvidas no MainLayout e ProtectedRoute) */}
          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<div className="p-4 md:p-6 lg:p-10 overflow-y-auto h-full custom-scrollbar"><DashboardView /></div>} />
            <Route path="/whatsapp" element={<WhatsAppView />} />
            <Route path="/clientes" element={<div className="p-4 md:p-6 lg:p-10 overflow-y-auto h-full custom-scrollbar"><ClientsView /></div>} />
            <Route path="/funnel" element={<div className="p-4 md:p-6 lg:p-10 overflow-y-auto h-full custom-scrollbar"><FunnelView /></div>} />
            <Route path="/reports" element={<div className="p-4 md:p-6 lg:p-10 overflow-y-auto h-full custom-scrollbar"><ReportsView /></div>} />
            <Route path="/inventario" element={<div className="p-4 md:p-6 lg:p-10 overflow-y-auto h-full custom-scrollbar"><InventoryView /></div>} />
            <Route path="/ativos" element={<div className="p-4 md:p-6 lg:p-10 overflow-y-auto h-full custom-scrollbar"><InventoryView /></div>} />
            <Route path="/integrations" element={<div className="p-4 md:p-6 lg:p-10 overflow-y-auto h-full custom-scrollbar"><IntegrationsView /></div>} />
            <Route path="/security" element={<div className="p-4 md:p-6 lg:p-10 overflow-y-auto h-full custom-scrollbar"><SecurityView /></div>} />
            <Route path="/automations" element={<div className="p-4 md:p-6 lg:p-10 overflow-y-auto h-full custom-scrollbar"><AutomationView /></div>} />
            <Route path="/documentos" element={<div className="p-4 md:p-6 lg:p-10 overflow-y-auto h-full custom-scrollbar"><DocumentsView /></div>} />
            <Route path="/drive" element={<div className="p-4 md:p-6 lg:p-10 overflow-y-auto h-full custom-scrollbar"><DriveView /></div>} />
            <Route path="/ia" element={<div className="p-4 md:p-6 lg:p-10 overflow-y-auto h-full custom-scrollbar"><AIView /></div>} />
            <Route path="/ia/chat" element={<div className="p-4 md:p-6 lg:p-10 overflow-y-auto h-full custom-scrollbar"><AIView /></div>} />
            <Route path="/ia/treinamento" element={<div className="p-4 md:p-6 lg:p-10 overflow-y-auto h-full custom-scrollbar"><AITrainingCenterView /></div>} />
            <Route path="/tarefas" element={<div className="p-4 md:p-6 lg:p-10 overflow-y-auto h-full custom-scrollbar"><TaskManagementView /></div>} />
            <Route path="/site" element={<div className="p-4 md:p-6 lg:p-10 overflow-y-auto h-full custom-scrollbar"><WebsiteBuilderView /></div>} />
            <Route path="/configuracoes" element={<div className="p-4 md:p-6 lg:p-10 overflow-y-auto h-full custom-scrollbar"><SettingsView /></div>} />
            <Route path="/settings/*" element={<div className="p-4 md:p-6 lg:p-10 overflow-y-auto h-full custom-scrollbar"><SettingsView /></div>} />
          </Route>

          {/* Redirecionamento Padrão */}
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
      </Suspense>
      <RicardoCommandPalette />
      <ToastContainer />
    </BrowserRouter>
  );
};

export default App;

