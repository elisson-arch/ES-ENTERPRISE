import React from 'react';
import { X, Bell, MessageSquare, Trello, AlertCircle, CheckCircle, Trash2, Clock, Upload, Zap } from 'lucide-react';
import { AppNotification, NotificationType } from '../../types';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkRead: (id: string) => void;
  onClearAll: () => void;
}

const getIcon = (type: NotificationType) => {
  switch (type) {
    case 'message': return <MessageSquare size={18} className="text-blue-500" />;
    case 'funnel': return <Trello size={18} className="text-purple-500" />;
    case 'sla': return <AlertCircle size={18} className="text-rose-500" />;
    case 'success': return <CheckCircle size={18} className="text-emerald-500" />;
    case 'upload': return <Upload size={18} className="text-indigo-500" />;
    case 'automation': return <Zap size={18} className="text-amber-500" />;
    default: return <Bell size={18} className="text-slate-500" />;
  }
};

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen, onClose, notifications, onMarkRead, onClearAll
}) => {
  return (
    <>
      <div className={`fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[1000] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
      
      <aside className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-[1001] transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b flex justify-between items-center bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-xl shadow-sm">
                <Bell size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-black uppercase text-xs text-slate-800 tracking-widest">Notificações</h3>
                <p className="text-[0.625rem] text-slate-400 font-bold">{notifications.filter(n => !n.isRead).length} pendentes</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={onClearAll} className="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Limpar tudo">
                <Trash2 size={18} />
              </button>
              <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-xl text-slate-400 transition-colors">
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <div 
                  key={n.id} 
                  onClick={() => onMarkRead(n.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer group relative ${
                    n.isRead ? 'bg-white border-slate-100 opacity-60' : 'bg-blue-50/30 border-blue-100 shadow-sm'
                  }`}
                >
                  <div className="flex gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      n.isRead ? 'bg-slate-100' : 'bg-white shadow-sm'
                    }`}>
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className={`text-xs uppercase tracking-tight truncate ${n.isRead ? 'font-bold text-slate-500' : 'font-black text-slate-800'}`}>
                          {n.title}
                        </h4>
                        {!n.isRead && <span className="w-2 h-2 bg-blue-600 rounded-full shrink-0" />}
                      </div>
                      <p className="text-[0.6875rem] text-slate-500 leading-relaxed line-clamp-2 mb-2 font-medium">
                        {n.description}
                      </p>
                      <div className="flex items-center gap-2 text-[0.5625rem] font-bold text-slate-400">
                        <Clock size={12} />
                        {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 py-20">
                <Bell size={48} className="opacity-10 mb-4" />
                <p className="text-xs font-black uppercase tracking-widest opacity-30">Tudo em dia!</p>
              </div>
            )}
          </div>

          <div className="p-6 border-t bg-slate-50">
            <button className="w-full py-4 bg-white border border-slate-200 rounded-2xl text-[0.625rem] font-black uppercase tracking-widest text-slate-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm">
              Configurações de Alerta
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};