import React from 'react';
import { X, MessageSquare, Trello, AlertCircle, CheckCircle, Upload, Wrench } from 'lucide-react';
import { AppNotification, NotificationType } from '../../types';

interface ToastContainerProps {
  toasts: AppNotification[];
  onDismiss: (id: string) => void;
}

const getToastStyles = (type: NotificationType) => {
  switch (type) {
    case 'sla': return { bg: 'bg-rose-600', icon: <AlertCircle className="text-white" size={20} /> };
    case 'success': return { bg: 'bg-emerald-600', icon: <CheckCircle className="text-white" size={20} /> };
    case 'message': return { bg: 'bg-blue-600', icon: <MessageSquare className="text-white" size={20} /> };
    case 'funnel': return { bg: 'bg-purple-600', icon: <Trello className="text-white" size={20} /> };
    case 'upload': return { bg: 'bg-indigo-600', icon: <Upload className="text-white" size={20} /> };
    case 'predictive': return { bg: 'bg-amber-600', icon: <Wrench className="text-white" size={20} /> };
    default: return { bg: 'bg-slate-800', icon: <AlertCircle className="text-white" size={20} /> };
  }
};

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-6 right-6 z-[2000] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => {
        const styles = getToastStyles(toast.type);
        return (
          <div 
            key={toast.id}
            className={`${styles.bg} p-4 rounded-2xl shadow-2xl text-white flex items-center gap-4 min-w-[20rem] max-w-sm pointer-events-auto animate-in slide-in-from-right-10 duration-500`}
          >
            <div className="p-2 bg-white/20 rounded-xl shrink-0">
              {styles.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-black uppercase tracking-widest mb-0.5">{toast.title}</h4>
              <p className="text-[0.6875rem] font-bold opacity-90 line-clamp-1">{toast.description}</p>
            </div>
            <button 
              onClick={() => onDismiss(toast.id)}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};