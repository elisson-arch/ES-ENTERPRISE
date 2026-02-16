
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, TrendingUp, AlertCircle, Clock, MessageSquare, Target, Sparkles, Zap, Calendar, ListTodo, Globe, Database, Mail, CloudLightning, FileSpreadsheet, ShieldCheck, Server, Smartphone, Tablet, Monitor, ArrowRight, Play, CheckCircle2
} from 'lucide-react';
import { OnboardingChecklist } from '../components/UI/OnboardingChecklist';
import { OnboardingTask, CalendarEvent } from '../types';
import { googleApiService } from '../services/googleApiService';

const QuickActionCard = ({ title, desc, icon: Icon, color, onClick }: any) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-start p-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group text-left w-full"
  >
    <div className={`p-4 rounded-2xl ${color} text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
      <Icon size={24} />
    </div>
    <h4 className="text-sm font-black text-slate-800 uppercase tracking-tighter italic mb-1">{title}</h4>
    <p className="text-[10px] text-slate-400 font-bold uppercase leading-tight">{desc}</p>
  </button>
);

const PriorityMission = ({ title, status, time, type }: any) => (
  <div className="flex items-center justify-between p-5 bg-slate-50/50 hover:bg-white rounded-3xl border border-transparent hover:border-slate-100 transition-all group cursor-pointer">
    <div className="flex items-center gap-4">
      <div className={`w-2 h-10 rounded-full ${
        type === 'urgent' ? 'bg-rose-500' : type === 'lead' ? 'bg-blue-500' : 'bg-emerald-500'
      }`} />
      <div>
        <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{title}</h4>
        <div className="flex items-center gap-3">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
            <Clock size={10} /> {time}
          </span>
          <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">{status}</span>
        </div>
      </div>
    </div>
    <div className="p-2 bg-white rounded-xl shadow-sm text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all">
      <ArrowRight size={18} />
    </div>
  </div>
);

const DashboardView: React.FC<{ onboardingTasks?: OnboardingTask[] }> = ({ onboardingTasks }) => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const userProfile = googleApiService.getUserProfile();

  useEffect(() => {
    const init = async () => {
      if (googleApiService.isAuthenticated('calendar')) {
        const data = await googleApiService.syncCalendarEvents();
        setEvents(data || []);
      }
      setLoading(false);
    };
    init();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div className="flex items-center gap-6">
           <div className="relative">
             {userProfile?.picture ? (
               <img src={userProfile.picture} alt="Perfil" className="w-16 h-16 lg:w-20 lg:h-20 rounded-[2rem] shadow-xl border-4 border-white" />
             ) : (
               <div className="w-16 h-16 lg:w-20 lg:h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white text-3xl font-black shadow-xl">
                 {userProfile?.name?.charAt(0) || 'U'}
               </div>
             )}
             <div className="absolute -bottom-2 -right-2 p-1.5 bg-emerald-500 text-white rounded-full border-4 border-white shadow-lg animate-pulse">
                <ShieldCheck size={12} />
             </div>
           </div>
           <div className="space-y-1">
              <h2 className="text-2xl lg:text-3xl font-black text-slate-800 tracking-tight italic">
                 Olá, {userProfile?.name?.split(' ')[0] || 'Usuário'}!
              </h2>
              <div className="flex items-center gap-2">
                 <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Workspace Cloud Ativo</span>
                 <div className="w-1 h-1 bg-slate-300 rounded-full" />
                 <div className="flex items-center gap-1 text-blue-600 text-[10px] font-black uppercase">
                    <Monitor size={10} className="hidden lg:block" />
                    <Smartphone size={10} className="lg:hidden" />
                    Agilizado via {window.innerWidth < 1024 ? 'Mobile' : 'Desktop'}
                 </div>
              </div>
           </div>
        </div>

        <div className="hidden lg:flex items-center gap-4 bg-white p-2 rounded-3xl border border-slate-100 shadow-sm">
           <div className="flex gap-1 px-3 border-r border-slate-100">
             <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Globe size={14}/></div>
             <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><Calendar size={14}/></div>
             <div className="p-2 bg-amber-50 text-amber-600 rounded-xl"><Database size={14}/></div>
           </div>
           <div className="pr-4">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Sincronização</p>
              <p className="text-[10px] font-black text-emerald-600 uppercase">100% Operacional</p>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-center mb-8">
               <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg"><Zap size={20} fill="currentColor" /></div>
                  <div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Daily Agile Mission</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase italic">Ricardo IA organizou suas prioridades</p>
                  </div>
               </div>
               <button className="text-[10px] font-black text-blue-600 uppercase hover:underline">Otimizar Fila</button>
            </div>
            
            <div className="space-y-2">
              <PriorityMission title="Responder Condomínio Aurora (Urgente)" time="há 15 min" status="Aguardando Orçamento" type="urgent" />
              <PriorityMission title="Visita Técnica: Hospital São Luiz" time="Hoje, 14:00" status="Confirmar Rota" type="event" />
              <PriorityMission title="Novo Lead: Padaria Pão de Mel" time="há 2h" status="Sincronizado via WhatsApp" type="lead" />
            </div>

            <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between text-slate-400">
               <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-amber-400" />
                  <span className="text-[9px] font-black uppercase tracking-widest">IA prevê 82% de fechamento hoje</span>
               </div>
               <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200" />
                  ))}
                  <div className="w-6 h-6 rounded-full border-2 border-white bg-blue-600 flex items-center justify-center text-[8px] font-black text-white">+5</div>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickActionCard title="WhatsApp" desc="Abrir Conversas" icon={MessageSquare} color="bg-blue-600" />
            <QuickActionCard title="Agenda" desc="Rotas de Campo" icon={Calendar} color="bg-emerald-600" />
            <QuickActionCard title="Novo Lead" desc="Entrada Manual" icon={Users} color="bg-indigo-600" />
            <QuickActionCard title="Arquivos" desc="Cloud Drive" icon={Database} color="bg-amber-500" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-110 transition-transform"><Smartphone size={120} /></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-black italic mb-2 tracking-tight uppercase">ES Enterprise Mobile Sync</h3>
              <p className="text-slate-400 text-xs font-medium leading-relaxed mb-8">Agilize o preenchimento de laudos usando o microfone e câmera do seu celular.</p>
              <button className="w-full py-4 bg-blue-600 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-2">
                <Play size={14} fill="currentColor" /> Assistir Tutorial
              </button>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Status dos Robôs</h4>
             <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                      <span className="text-xs font-bold text-slate-700">Auto-Responder</span>
                   </div>
                   <span className="text-[10px] font-black text-emerald-500 uppercase">Ativo</span>
                </div>
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                      <span className="text-xs font-bold text-slate-700">Sincronizador Google</span>
                   </div>
                   <span className="text-[10px] font-black text-emerald-500 uppercase">Online</span>
                </div>
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                      <span className="text-xs font-bold text-slate-700">Otimizador de BI</span>
                   </div>
                   <span className="text-[10px] font-black text-amber-500 uppercase">Processando</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;