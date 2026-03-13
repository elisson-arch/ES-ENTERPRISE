import React, { useState } from 'react';
import { Bell, Mail, MessageSquare, Smartphone, Zap, Clock } from 'lucide-react';

const NotificationsTab: React.FC = () => {
  const [prefs, setPrefs] = useState({
    email_alerts: true,
    push_notifs: true,
    whatsapp_sync: true,
    sla_warnings: true,
    daily_report: false,
    ai_insights: true
  });

  const toggle = (key: keyof typeof prefs) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">Preferências de Alertas</h2>
        <p className="text-slate-500 font-medium">Configure como e quando deseja ser notificado sobre atividades do sistema.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Channels */}
        <div className="bg-white/50 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/50 shadow-glass space-y-6">
          <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest mb-4">Canais de Comunicação</h3>
          
          <div className="space-y-4">
            {[
              { id: 'email_alerts', label: 'Alertas por E-mail', icon: Mail, desc: 'Resumos de atividades e faturas' },
              { id: 'push_notifs', label: 'Notificações Push', icon: Smartphone, desc: 'Alertas em tempo real no browser' },
              { id: 'whatsapp_sync', label: 'WhatsApp Business', icon: MessageSquare, desc: 'Notificações de novas mensagens' },
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-white rounded-xl shadow-sm text-indigo-600">
                    <item.icon size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-700">{item.label}</div>
                    <div className="text-[10px] text-slate-400 font-medium">{item.desc}</div>
                  </div>
                </div>
                <button 
                  onClick={() => toggle(item.id as any)}
                  className={`w-12 h-6 rounded-full relative transition-all duration-300 ${prefs[item.id as keyof typeof prefs] ? 'bg-indigo-600' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${prefs[item.id as keyof typeof prefs] ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* System Events */}
        <div className="bg-white/50 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/50 shadow-glass space-y-6">
          <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest mb-4">Eventos do Sistema</h3>
          
          <div className="space-y-4">
            {[
              { id: 'sla_warnings', label: 'Avisos de SLA', icon: Clock, desc: 'Quando um ticket está perto do prazo' },
              { id: 'ai_insights', label: 'Insights da IA', icon: Zap, desc: 'Sugestões preditivas de manutenção' },
              { id: 'daily_report', label: 'Relatório Diário', icon: Bell, desc: 'Resumo matinal de produtividade' },
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-white rounded-xl shadow-sm text-amber-600">
                    <item.icon size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-700">{item.label}</div>
                    <div className="text-[10px] text-slate-400 font-medium">{item.desc}</div>
                  </div>
                </div>
                <button 
                  onClick={() => toggle(item.id as any)}
                  className={`w-12 h-6 rounded-full relative transition-all duration-300 ${prefs[item.id as keyof typeof prefs] ? 'bg-indigo-600' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${prefs[item.id as keyof typeof prefs] ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-indigo-600 p-8 rounded-[2.5rem] shadow-xl shadow-indigo-200 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <h3 className="text-white font-bold text-lg">Mantenha-se Atualizado</h3>
          <p className="text-indigo-100 text-sm">Suas preferências são sincronizadas em todos os seus dispositivos.</p>
        </div>
        <button className="px-8 py-4 bg-white text-indigo-600 rounded-2xl font-black uppercase text-[10px] hover:bg-indigo-50 transition-all shadow-lg">
          Salvar Preferências
        </button>
      </div>
    </div>
  );
};

export default NotificationsTab;
