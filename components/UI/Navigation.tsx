import React, { useState } from 'react';
// Fix: Import Link from react-router-dom and useLocation from react-router to resolve export errors
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';
import { 
  LayoutDashboard, 
  Users, 
  Wand2, 
  Globe, 
  Cloud,
  LogOut,
  Menu,
  MessageSquare,
  Trello,
  Bell,
  Settings,
  Zap,
  BarChart3,
  Shield,
  Search,
  Moon,
  Sun,
  Plus
} from 'lucide-react';
import { googleApiService } from '../../services/googleApiService';

interface SidebarItemProps {
  icon: any;
  label: string;
  to: string;
  active: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, to, active, onClick }) => (
  <Link 
    to={to} 
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      active 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
        : 'text-slate-500 hover:bg-blue-50 hover:text-blue-600'
    }`}
  >
    <Icon size={20} />
    <span className="font-bold text-[0.75rem] uppercase tracking-tight whitespace-nowrap">{label}</span>
  </Link>
);

interface NavigationProps {
  unreadNotifications: number;
  onToggleNotifications: () => void;
  onOpenSearch: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  unreadNotifications, 
  onToggleNotifications, 
  onOpenSearch, 
  isDarkMode, 
  toggleTheme 
}) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isPublicSite = location.pathname.startsWith('/v/');
  if (isPublicSite) return null;

  const menuItems = [
    { icon: LayoutDashboard, label: 'Início', to: '/' },
    { icon: MessageSquare, label: 'WhatsApp', to: '/whatsapp' },
    { icon: Trello, label: 'Funil', to: '/funnel' },
    { icon: Users, label: 'Clientes', to: '/clientes' },
    { icon: BarChart3, label: 'BI', to: '/reports' },
    { icon: Cloud, label: 'Drive', to: '/drive' },
    { icon: Zap, label: 'Automação', to: '/automations' },
    { icon: Wand2, label: 'Ricardo IA', to: '/ia' },
    { icon: Shield, label: 'Segurança', to: '/security' },
    { icon: Globe, label: 'Site', to: '/site' },
  ];

  return (
    <>
      {/* Mobile Header Agile - Z-40 */}
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

      {/* Desktop Sidebar / Mobile Drawer - Z-40 */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200">
                <Zap size={28} fill="currentColor" />
              </div>
              <div>
                <h1 className="font-black text-slate-800 text-lg leading-tight tracking-tighter italic uppercase">ES Enterprise</h1>
                <p className="text-[0.5rem] font-black text-slate-400 uppercase tracking-widest">Enterprise Ready</p>
              </div>
            </div>
          </div>

          <div className="px-6 py-6">
            <button 
              onClick={onOpenSearch}
              className="w-full flex items-center gap-3 px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-[1.25rem] text-slate-400 text-[0.625rem] font-black uppercase tracking-widest hover:bg-white hover:border-blue-300 hover:shadow-lg hover:shadow-blue-50 transition-all group"
            >
              <Search size={16} className="group-hover:text-blue-600 transition-colors" /> Buscar...
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar">
            {menuItems.map((item) => (
              <SidebarItem 
                key={item.to} 
                icon={item.icon}
                label={item.label}
                to={item.to}
                active={location.pathname === item.to}
                onClick={() => setIsOpen(false)}
              />
            ))}
          </nav>

          <div className="p-6 border-t border-slate-50 space-y-3">
            <div className="flex items-center gap-2">
               <button onClick={toggleTheme} className="flex-1 py-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-500 hover:text-blue-600 transition-all">
                 {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
               </button>
               <button className="flex-1 py-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-500 hover:text-blue-600 transition-all">
                 <Settings size={18} />
               </button>
            </div>
            <button 
              onClick={() => googleApiService.revokeAccess()}
              className="flex items-center gap-3 w-full px-5 py-3 text-slate-400 font-black text-[0.625rem] uppercase tracking-widest hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
            >
              <LogOut size={18} />
              <span>Encerrar Sessão</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Agile Bottom Bar - Z-40 */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-xl border-t border-slate-200 z-40 flex items-center justify-around px-6 pb-4 pt-2 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <Link to="/" className={`flex flex-col items-center gap-1.5 transition-all ${location.pathname === '/' ? 'text-blue-600 scale-110' : 'text-slate-300'}`}>
          <LayoutDashboard size={22} strokeWidth={location.pathname === '/' ? 3 : 2} />
          <span className="text-[0.5rem] font-black uppercase tracking-tighter">Início</span>
        </Link>
        <Link to="/whatsapp" className={`flex flex-col items-center gap-1.5 transition-all ${location.pathname === '/whatsapp' ? 'text-blue-600 scale-110' : 'text-slate-300'}`}>
          <MessageSquare size={22} strokeWidth={location.pathname === '/whatsapp' ? 3 : 2} />
          <span className="text-[0.5rem] font-black uppercase tracking-tighter">Chat</span>
        </Link>
        
        <button 
          onClick={onOpenSearch}
          className="w-16 h-16 bg-slate-900 text-white rounded-[2rem] flex items-center justify-center shadow-2xl -mt-12 border-[6px] border-white active:scale-90 active:bg-blue-600 transition-all"
        >
          <Plus size={28} strokeWidth={3} />
        </button>

        <Link to="/funnel" className={`flex flex-col items-center gap-1.5 transition-all ${location.pathname === '/funnel' ? 'text-blue-600 scale-110' : 'text-slate-300'}`}>
          <Trello size={22} strokeWidth={location.pathname === '/funnel' ? 3 : 2} />
          <span className="text-[0.5rem] font-black uppercase tracking-tighter">Funil</span>
        </Link>
        <button onClick={onToggleNotifications} className="flex flex-col items-center gap-1.5 text-slate-300 active:scale-110 transition-all">
          <div className="relative">
            <Bell size={22} />
            {unreadNotifications > 0 && <div className="absolute top-0 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-bounce"></div>}
          </div>
          <span className="text-[0.5rem] font-black uppercase tracking-tighter">Avisos</span>
        </button>
      </nav>

      {/* Overlay - Z-30 (Abaixo da Navigation para permitir fechar clicando fora) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-30 lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};