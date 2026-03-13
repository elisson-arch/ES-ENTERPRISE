
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Shield, 
  Bell, 
  ChevronRight,
  Settings,
  LogOut
} from 'lucide-react';
import ProfileTab from './ProfileTab';
import SecurityTab from './SecurityTab';
import NotificationsTab from './NotificationsTab';
import { googleApiService } from '@google-workspace/services/googleApiService';

const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile');

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User, component: ProfileTab, color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
    { id: 'security', label: 'Segurança', icon: Shield, component: SecurityTab, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
    { id: 'notifications', label: 'Notificações', icon: Bell, component: NotificationsTab, color: 'text-amber-600', bgColor: 'bg-amber-50' },
  ];

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component || ProfileTab;

  const handleLogout = () => {
    googleApiService.revokeAccess();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-12rem)] animate-in fade-in duration-700">
      {/* Sidebar de Navegação Interna */}
      <aside className="w-full lg:w-80 space-y-6">
        <div className="px-4">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase flex items-center gap-3">
            <Settings className="text-indigo-600" size={28} />
            Configurações
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Gerencie sua conta e preferências.</p>
        </div>

        <nav className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'profile' | 'security' | 'notifications')}
              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group ${
                activeTab === tab.id 
                  ? `${tab.bgColor} shadow-glass border border-white/50 backdrop-blur-md` 
                  : 'hover:bg-white/50 hover:shadow-md border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl transition-all duration-300 ${
                  activeTab === tab.id ? 'bg-white shadow-sm' : 'bg-slate-100 group-hover:bg-white'
                }`}>
                  <tab.icon size={20} className={activeTab === tab.id ? tab.color : 'text-slate-400'} />
                </div>
                <div className="text-left">
                  <div className={`text-sm font-black uppercase tracking-tight ${
                    activeTab === tab.id ? 'text-slate-900' : 'text-slate-500'
                  }`}>
                    {tab.label}
                  </div>
                </div>
              </div>
              <ChevronRight size={16} className={activeTab === tab.id ? tab.color : 'text-slate-300'} />
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-slate-200">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-4 p-4 rounded-2xl text-rose-600 hover:bg-rose-50 transition-all group"
          >
            <div className="p-3 bg-rose-100 rounded-xl group-hover:bg-white transition-all">
              <LogOut size={20} />
            </div>
            <span className="text-sm font-black uppercase tracking-tight">Sair da Conta</span>
          </button>
        </div>

        <div className="mt-12 p-6 bg-slate-900 rounded-[2rem] text-white overflow-hidden relative group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          <h4 className="font-bold text-sm mb-2 relative z-10">ES Enterprise v2.4</h4>
          <p className="text-[10px] text-slate-400 leading-relaxed relative z-10">
            Sua instância está operando com Ricardo IA v3.1 Flash. Todas as conexões são seguras.
          </p>
        </div>
      </aside>

      {/* Área de Conteúdo da Sub-view */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-full"
          >
            <ActiveComponent />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default SettingsView;
