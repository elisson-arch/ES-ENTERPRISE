import React, { useState, useEffect } from 'react';
import {
  Users, TrendingUp, AlertCircle, Clock, MessageSquare, Target, Sparkles, Zap, Calendar, ListTodo, Globe, Database, Mail, CloudLightning, FileSpreadsheet, ShieldCheck, Server, Smartphone, Tablet, Monitor, ArrowRight, Play, CheckCircle2, LayoutDashboard, ClipboardList, Search
} from 'lucide-react';
import { OnboardingChecklist } from '../components/UI/OnboardingChecklist';
import { OnboardingTask, CalendarEvent, Client, Asset } from '../types';
import { googleApiService } from '../services/googleApiService';
import { firestoreService } from '../services/firestoreService';
import { where } from 'firebase/firestore';

const QuickActionCard = ({ title, desc, icon: Icon, color, onClick }: any) => (
  <button
    onClick={onClick}
    className="flex flex-col items-start p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group text-left w-full min-h-[10rem]"
  >
    <div className={`w-12 h-12 rounded-2xl ${color} text-white mb-6 shadow-lg group-hover:scale-110 transition-transform flex items-center justify-center`}>
      <Icon size={24} />
    </div>
    <h4 className="text-[0.875rem] font-black text-slate-800 uppercase tracking-tighter italic mb-1">{title}</h4>
    <p className="text-[0.625rem] text-slate-400 font-bold uppercase leading-tight">{desc}</p>
  </button>
);

const PriorityMission = ({ title, status, time, type }: any) => (
  <div className="flex items-center justify-between p-6 bg-slate-50/50 hover:bg-white rounded-[2rem] border border-transparent hover:border-slate-100 transition-all group cursor-pointer min-h-[5.5rem]">
    <div className="flex items-center gap-4">
      <div className={`w-2 h-12 rounded-full ${type === 'urgent' ? 'bg-rose-500' : type === 'lead' ? 'bg-blue-500' : 'bg-emerald-500'
        }`} />
      <div>
        <h4 className="text-[0.875rem] font-black text-slate-800 line-clamp-1 italic uppercase tracking-tighter">{title}</h4>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="text-[0.5625rem] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
            <Clock size={10} /> {time}
          </span>
          <span className="text-[0.5625rem] font-black text-indigo-500 uppercase tracking-widest">{status}</span>
        </div>
      </div>
    </div>
    <div className="w-11 h-11 flex items-center justify-center bg-white rounded-xl shadow-sm text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all">
      <ArrowRight size={20} />
    </div>
  </div>
);

const DashboardView: React.FC<{ onboardingTasks?: OnboardingTask[] }> = ({ onboardingTasks }) => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [stats, setStats] = useState({ clientsCount: 0, assetsCount: 0 });
  const [recentMissions, setRecentMissions] = useState<any[]>([]);
  const userProfile = googleApiService.getUserProfile();

  useEffect(() => {
    const init = async () => {
      // 1. Sincronizar Google Calendar
      if (googleApiService.isAuthenticated('calendar')) {
        const data = await googleApiService.syncCalendarEvents();
        setEvents(data || []);
      }

      // 2. Subscrição para Métricas Reais (Firestore)
      const unsubClients = firestoreService.subscribe<Client>('clients', (data) => {
        setStats(prev => ({ ...prev, clientsCount: data.length }));

        // Gerar missões baseadas em novos clientes
        const missions = data.slice(0, 3).map(c => ({
          title: `Atender ${c.name}`,
          time: 'Novo Lead',
          status: 'Sincronizado via Firestore',
          type: 'lead'
        }));
        setRecentMissions(missions);
      }, where('organizationId', '==', 'org_123'));

      const unsubAssets = firestoreService.subscribe<Asset>('assets', (data) => {
        setStats(prev => ({ ...prev, assetsCount: data.length }));
      }, where('organizationId', '==', 'org_123'));

      setLoading(false);
      return () => {
        unsubClients();
        unsubAssets();
      };
    };
    init();
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            {userProfile?.picture ? (
              <img src={userProfile.picture} alt="Perfil" className="w-16 h-16 lg:w-24 lg:h-24 rounded-[2.5rem] shadow-xl border-4 border-white" />
            ) : (
              <div className="w-16 h-16 lg:w-24 lg:h-24 bg-blue-600 rounded-[2.5rem] flex items-center justify-center text-white text-3xl font-black shadow-xl">
                {userProfile?.name?.charAt(0) || 'U'}
              </div>
            )}
            <div className="absolute -bottom-2 -right-2 w-11 h-11 bg-emerald-500 text-white rounded-full border-4 border-white shadow-lg animate-pulse flex items-center justify-center">
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="space-y-1">
            <h2 className="text-[2rem] lg:text-[2.5rem] font-black text-slate-800 tracking-tighter italic leading-none uppercase">
              Olá, {userProfile?.name?.split(' ')[0] || 'Gestor'}!
            </h2>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 rounded-full text-white text-[0.5rem] font-black uppercase tracking-widest">
                <Server size={10} className="text-blue-400" /> us-central1
              </div>
              <div className="w-1 h-1 bg-slate-300 rounded-full" />
              <div className="flex items-center gap-1 text-blue-600 text-[0.625rem] font-black uppercase tracking-tight italic">
                {stats.clientsCount} Clientes | {stats.assetsCount} Ativos Reais
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-6 bg-white p-3 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="flex gap-2 px-3 border-r border-slate-100">
            <div className="w-11 h-11 flex items-center justify-center bg-blue-50 text-blue-600 rounded-xl"><Globe size={18} /></div>
            <div className="w-11 h-11 flex items-center justify-center bg-emerald-50 text-emerald-600 rounded-xl"><Calendar size={18} /></div>
            <div className="w-11 h-11 flex items-center justify-center bg-amber-50 text-amber-600 rounded-xl"><Database size={18} /></div>
          </div>
          <div className="pr-6">
            <p className="text-[0.5rem] font-black text-slate-400 uppercase tracking-widest mb-0.5">SGC Engine Status</p>
            <p className="text-[0.75rem] font-black text-emerald-600 uppercase italic tracking-tighter">100% Operacional Cloud</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div className="xl:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-indigo-600 rounded-2xl text-white shadow-xl flex items-center justify-center"><Zap size={24} fill="currentColor" /></div>
                <div>
                  <h3 className="text-[1rem] font-black text-slate-800 uppercase tracking-widest italic">Daily Agile Mission</h3>
                  <p className="text-[0.625rem] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Ricardo IA Prioritized Stream</p>
                </div>
              </div>
              <button className="h-11 px-5 bg-slate-50 rounded-xl text-[0.5625rem] font-black text-blue-600 uppercase tracking-widest hover:bg-slate-100 transition-all">Otimizar Fila</button>
            </div>

            <div className="space-y-4">
              {recentMissions.length > 0 ? (
                recentMissions.map((mission, idx) => (
                  <PriorityMission key={idx} {...mission} />
                ))
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                  <p className="text-[0.625rem] font-black text-slate-400 uppercase tracking-widest italic">Nenhuma missão prioritária no momento</p>
                </div>
              )}
            </div>

            <div className="mt-10 pt-10 border-t border-slate-100 flex items-center justify-between text-slate-400">
              <div className="flex items-center gap-3">
                <Sparkles size={18} className="text-amber-400 animate-pulse" />
                <span className="text-[0.625rem] font-black uppercase tracking-widest italic">Dashboard Conectado ao Cloud Firestore</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <QuickActionCard title="WhatsApp" desc="Abrir Conversas" icon={MessageSquare} color="bg-blue-600" onClick={() => window.location.hash = '#/whatsapp'} />
            <QuickActionCard title="Agenda" desc="Rotas de Campo" icon={Calendar} color="bg-emerald-600" onClick={() => window.location.hash = '#/calendar'} />
            <QuickActionCard title="Clientes" desc="Base Unificada" icon={Users} color="bg-indigo-600" onClick={() => window.location.hash = '#/clientes'} />
            <QuickActionCard title="Inventário" desc="Ativos Reais" icon={Database} color="bg-amber-500" onClick={() => window.location.hash = '#/inventory'} />
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group min-h-[17.5rem] flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-110 transition-transform group-hover:rotate-12 duration-1000"><Smartphone size={200} /></div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 rounded-full border border-white/10 mb-6">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping"></div>
                <span className="text-[0.5625rem] font-black uppercase tracking-widest text-blue-400 italic">SGC Engine Real-time</span>
              </div>
              <h3 className="text-[1.875rem] font-black italic mb-3 tracking-tighter uppercase leading-none">Dados em Tempo Real</h3>
              <p className="text-slate-400 text-[0.875rem] font-medium leading-relaxed">Você tem {stats.clientsCount} clientes ativos e {stats.assetsCount} equipamentos sob gestão no Firestore.</p>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h4 className="text-[0.625rem] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 border-b pb-4">Status dos Robôs Regionais</h4>
            <div className="space-y-6">
              {[
                { name: 'Firestore Sync', status: 'Ativo', color: 'bg-emerald-500' },
                { name: 'Google Cloud Sync', status: 'Online', color: 'bg-emerald-500' },
                { name: 'Ricardo AI Logic', status: 'Processando', color: 'bg-amber-500', pulse: true }
              ].map((bot, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${bot.color} ${bot.pulse ? 'animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]' : ''}`} />
                    <span className="text-[0.75rem] font-black text-slate-700 uppercase tracking-tighter">{bot.name}</span>
                  </div>
                  <span className={`text-[0.5625rem] font-black uppercase tracking-widest ${bot.color.replace('bg-', 'text-')}`}>{bot.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;