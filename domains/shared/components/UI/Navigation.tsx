import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';
import {
  LogOut,
  Menu,
  Bell,
  Settings,
  Search,
  Moon,
  Sun,
  Plus,
  LayoutGrid
} from 'lucide-react';
import { googleApiService } from '@google-workspace';
import { NAVIGATION_ROUTES, t } from '@shared';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  active: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, to, active, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center px-4 py-3 rounded-2xl transition-all duration-200 mx-2 ${active
      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
      }`}
  >
    <div className="shrink-0 flex items-center justify-center w-6 h-6">
      <Icon size={20} />
    </div>
    <span className="font-bold text-[0.75rem] uppercase tracking-tight whitespace-nowrap overflow-hidden transition-all duration-300
      lg:opacity-0 lg:w-0 lg:ml-0
      lg:group-hover:opacity-100 lg:group-hover:w-auto lg:group-hover:ml-3
      opacity-100 w-auto ml-3
    ">
      {label}
    </span>
  </Link>
);

import { useAppContext } from '@shared';

interface NavigationProps {
  unreadNotifications?: number;
  onToggleNotifications?: () => void;
  onOpenSearch?: () => void;
  isDarkMode?: boolean;
  toggleTheme?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  unreadNotifications: propUnread,
  onToggleNotifications: propOnToggle,
  onOpenSearch: propOnOpenSearch,
  isDarkMode: propIsDarkMode,
  toggleTheme: propToggleTheme
}) => {
  const { unreadCount, isDarkMode: contextIsDarkMode, toggleTheme: contextToggleTheme } = useAppContext();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  // Fallback para props se fornecidas, senão usa contexto
  const unreadNotifications = propUnread ?? unreadCount;
  const isDarkMode = propIsDarkMode ?? contextIsDarkMode;
  const toggleTheme = propToggleTheme ?? contextToggleTheme;
  
  // Mock para onToggleNotifications e onOpenSearch se não fornecidos
  const onToggleNotifications = propOnToggle || (() => window.dispatchEvent(new CustomEvent('toggle_notifications')));
  const onOpenSearch = propOnOpenSearch || (() => window.dispatchEvent(new CustomEvent('open_search')));

  const allowedRoutes = NAVIGATION_ROUTES.filter((route) => googleApiService.canAccessRoute(route.id));

  const isPublicSite = location.pathname.startsWith('/v/');
  if (isPublicSite) return null;

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-40 flex items-center justify-between px-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-200">E</div>
          <span className="font-black text-slate-800 tracking-tighter italic">ES Enterprise</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onOpenSearch} className="p-2.5 bg-slate-50 rounded-xl text-slate-500 active:scale-90 transition-all"><Search size={20} /></button>
          <button onClick={() => setIsOpen(true)} className="p-2.5 bg-slate-900 rounded-xl text-white active:scale-90 transition-all"><Menu size={20} /></button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className={`
        group fixed inset-y-0 left-0 z-40 bg-white border-r border-slate-200 transition-all duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'}
        lg:translate-x-0 lg:w-20 lg:hover:w-64
      `}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-slate-50 flex items-center bg-slate-50/30 h-24">
            <div className="flex items-center overflow-hidden whitespace-nowrap">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30 shrink-0 mx-auto lg:mx-0">
                <LayoutGrid size={24} strokeWidth={2.5} />
              </div>
              <div className="transition-all duration-300 overflow-hidden lg:opacity-0 lg:w-0 lg:ml-0 lg:group-hover:opacity-100 lg:group-hover:w-auto lg:group-hover:ml-4 opacity-100 w-auto ml-4">
                <h1 className="font-black text-slate-800 text-lg leading-tight tracking-tighter italic uppercase">ES Enterprise</h1>
                <p className="text-[0.5rem] font-black text-slate-400 uppercase tracking-widest">Enterprise Ready</p>
              </div>
            </div>
          </div>

          <div className="px-4 py-6">
            <button
              onClick={onOpenSearch}
              className="w-full flex items-center px-4 py-3 bg-slate-50 border border-slate-200 rounded-full text-slate-400 text-[0.625rem] font-black uppercase tracking-widest hover:bg-white hover:border-blue-300 hover:shadow-lg hover:shadow-blue-50 transition-all"
            >
              <div className="shrink-0 flex items-center justify-center w-4 h-4">
                <Search size={16} className="text-slate-400 group-hover:text-blue-600 transition-colors" /> 
              </div>
              <span className="text-left leading-tight overflow-hidden transition-all duration-300 lg:opacity-0 lg:w-0 lg:ml-0 lg:group-hover:opacity-100 lg:group-hover:w-auto lg:group-hover:ml-3 opacity-100 w-auto ml-3 whitespace-nowrap">
                PESQUISAR NO<br/>SISTEMA...
              </span>
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar flex flex-col justify-end pb-4">
            {allowedRoutes.map((item) => (
              <SidebarItem
                key={item.path}
                icon={item.icon}
                label={item.label}
                to={item.path}
                active={location.pathname === item.path}
                onClick={() => setIsOpen(false)}
              />
            ))}
          </nav>

          <div className="p-4 border-t border-slate-50 space-y-3">
            <div className="flex items-center gap-2 overflow-hidden transition-all duration-300 lg:opacity-0 lg:h-0 lg:group-hover:opacity-100 lg:group-hover:h-auto opacity-100 h-auto">
              <button onClick={toggleTheme} className="flex-1 py-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-500 hover:text-blue-600 transition-all">
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button className="flex-1 py-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-500 hover:text-blue-600 transition-all">
                <Settings size={18} />
              </button>
            </div>
            <button
              onClick={() => googleApiService.revokeAccess()}
              className="flex items-center w-full px-4 py-3 text-slate-400 font-black text-[0.625rem] uppercase tracking-widest hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all"
            >
              <div className="shrink-0 flex items-center justify-center w-4 h-4 mx-auto lg:group-hover:mx-0">
                <LogOut size={18} />
              </div>
              <span className="overflow-hidden whitespace-nowrap transition-all duration-300 lg:opacity-0 lg:w-0 lg:ml-0 lg:group-hover:opacity-100 lg:group-hover:w-auto lg:group-hover:ml-3 opacity-100 w-auto ml-3">
                Encerrar Sessão
              </span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-xl border-t border-slate-200 z-40 flex items-center justify-around px-6 pb-4 pt-2 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        {allowedRoutes.filter(r => ['dashboard', 'whatsapp', 'funnel'].includes(r.id)).map(route => (
          <Link
            key={route.id}
            to={route.path}
            className={`flex flex-col items-center gap-1.5 transition-all ${location.pathname === route.path ? 'text-blue-600 scale-110' : 'text-slate-300'}`}
          >
            <route.icon size={22} strokeWidth={location.pathname === route.path ? 3 : 2} />
            <span className="text-[0.5rem] font-black uppercase tracking-tighter">{route.label}</span>
          </Link>
        ))}

        <button
          onClick={onOpenSearch}
          className="w-16 h-16 bg-slate-900 text-white rounded-[2rem] flex items-center justify-center shadow-2xl -mt-12 border-[6px] border-white active:scale-90 active:bg-blue-600 transition-all"
        >
          <Plus size={28} strokeWidth={3} />
        </button>

        <button onClick={onToggleNotifications} className="flex flex-col items-center gap-1.5 text-slate-300 active:scale-110 transition-all">
          <div className="relative">
            <Bell size={22} />
            {unreadNotifications > 0 && <div className="absolute top-0 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-bounce"></div>}
          </div>
          <span className="text-[0.5rem] font-black uppercase tracking-tighter">{t('navigation.notifications')}</span>
        </button>
      </nav>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-30 lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
