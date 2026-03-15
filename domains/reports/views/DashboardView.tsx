import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { 
  TrendingUp, Users, AlertTriangle, CheckCircle, 
  Activity, Wind, Zap, ArrowUpRight, ArrowDownRight,
  Server, ShieldCheck
} from 'lucide-react';
import { Client, Asset, PredictiveAlert } from '@shared/types/common.types';
import { googleApiService } from '@google-workspace/services/googleApiService';
import { firestoreService } from '@shared/services/firestoreService';
import { predictiveService } from '@ai/services/predictiveService';
import { taskService } from '@inventory/services/taskService';
import { OrderDocV2 } from '@inventory/types/inventory.types';
import { useAppContext } from '@shared/hooks/useAppContext';
import { where } from 'firebase/firestore';
import { tenantService } from '@auth/services/tenantService';

// ─── DADOS DE SIMULAÇÃO (MOCK) ───────────────────────────────────────────────
const revenueDataMock = [
  { name: 'Seg', leads: 40, fechamentos: 24 },
  { name: 'Ter', leads: 30, fechamentos: 13 },
  { name: 'Qua', leads: 20, fechamentos: 58 },
  { name: 'Qui', leads: 27, fechamentos: 39 },
  { name: 'Sex', leads: 18, fechamentos: 48 },
  { name: 'Sáb', leads: 23, fechamentos: 38 },
  { name: 'Dom', leads: 34, fechamentos: 43 },
];

const predictiveDataMock = [
  { name: 'Compressores', risco: 65, prevencao: 85 },
  { name: 'Filtros', risco: 90, prevencao: 20 },
  { name: 'Gás (Fugas)', risco: 40, prevencao: 60 },
  { name: 'Placas', risco: 25, prevencao: 75 },
];

// ─── ANIMAÇÕES ───────────────────────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

// ─── COMPONENTES ─────────────────────────────────────────────────────────────
const StatCard = ({ title, value, subtitle, icon: Icon, trend, trendValue, colorClass }: { 
  title: string; 
  value: string | number; 
  subtitle: string; 
  icon: React.ElementType; 
  trend: 'up' | 'down'; 
  trendValue: string; 
  colorClass: string; 
}) => (
  <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10`}>
        <Icon size={24} className={colorClass.replace('bg-', 'text-')} />
      </div>
    </div>
    <div className="mt-4 flex items-center text-sm">
      {trend === 'up' ? (
        <ArrowUpRight size={16} className="text-emerald-500 mr-1" />
      ) : (
        <ArrowDownRight size={16} className="text-rose-500 mr-1" />
      )}
      <span className={trend === 'up' ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}>
        {trendValue}
      </span>
      <span className="text-slate-400 ml-2">{subtitle}</span>
    </div>
  </motion.div>
);

const DashboardView = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [stats, setStats] = useState({ clientsCount: 0, assetsCount: 0, totalTasks: 0, completedTasks: 0 });
  const [predictiveAlerts, setPredictiveAlerts] = useState<PredictiveAlert[]>([]);
  const [orgId, setOrgId] = useState(tenantService.getCurrentOrgId());
  const notifiedAssetsRef = useRef<Set<string>>(new Set());
  const { addNotification } = useAppContext();
  const userProfile = googleApiService.getUserProfile();

  useEffect(() => {
    const init = async () => {
      // 1. Sincronizar Google Calendar
      if (googleApiService.isAuthenticated('calendar')) {
        await googleApiService.syncCalendarEvents();
      }

      // 2. Subscrição para Métricas Reais (Firestore)
      const unsubClients = firestoreService.subscribe<Client>('clients', (data) => {
        setStats(prev => ({ ...prev, clientsCount: data.length }));
      }, where('organizationId', '==', orgId));

      const unsubAssets = firestoreService.subscribe<Asset>('assets', (data) => {
        setStats(prev => ({ ...prev, assetsCount: data.length }));

        const alerts = predictiveService.analyzeAssetsRisk(data);
        setPredictiveAlerts(alerts);

        alerts
          .filter(a => a.severity === 'critical' && !notifiedAssetsRef.current.has(a.assetId))
          .forEach(a => {
            addNotification({
              type: 'predictive',
              title: 'Manutenção Crítica',
              description: `${a.brand} ${a.model} (${a.assetType}) — ${a.daysOverdue}d em atraso`,
              priority: 'high',
            });
            notifiedAssetsRef.current.add(a.assetId);
          });
      }, where('organizationId', '==', orgId));

      const unsubTasks = taskService.subscribeToOrgTasks(orgId, (data: OrderDocV2[]) => {
        const completed = data.filter(t => t.status === 'completed');
        setStats(prev => ({ 
          ...prev, 
          totalTasks: data.length, 
          completedTasks: completed.length 
        }));
      });

      return () => {
        unsubClients();
        unsubAssets();
        unsubTasks();
      };
    };
    init();
  }, [addNotification, orgId]);

  useEffect(() => {
    const handleAuthChange = () => {
      const derived = tenantService.resolveAndPersistFromSession();
      setOrgId(derived);
      notifiedAssetsRef.current.clear();
    };
    window.addEventListener('google_auth_change', handleAuthChange);
    return () => window.removeEventListener('google_auth_change', handleAuthChange);
  }, []);

  // Calcular dados reais para o gráfico de saúde
  const healthyCount = stats.assetsCount - predictiveAlerts.length;
  const warningCount = predictiveAlerts.filter(a => a.severity === 'warning').length;
  const criticalCount = predictiveAlerts.filter(a => a.severity === 'critical').length;

  const healthData = [
    { name: 'Saudáveis', value: healthyCount > 0 ? healthyCount : 0, color: '#10b981', bgClass: 'bg-emerald-500' },
    { name: 'Alerta Preventivo', value: warningCount, color: '#f59e0b', bgClass: 'bg-amber-500' },
    { name: 'Falha Crítica', value: criticalCount, color: '#ef4444', bgClass: 'bg-rose-500' },
  ];

  return (
    <div className="min-h-full bg-slate-50 p-8 overflow-y-auto">
      <motion.div 
        initial="hidden" 
        animate="visible" 
        variants={containerVariants}
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            {userProfile?.picture && (
              <img src={userProfile.picture} alt="Perfil" className="w-16 h-16 rounded-2xl shadow-lg border-2 border-white" />
            )}
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                Centro de Comando <Zap className="text-indigo-500" fill="currentColor" />
              </h1>
              <p className="text-slate-500 mt-1">Olá, {userProfile?.name?.split(' ')[0] || 'Gestor'}. Panorama da operação HVAC hoje.</p>
            </div>
          </div>
          <div className="flex bg-slate-200/50 p-1 rounded-lg">
            {['7d', '30d', '90d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  timeRange === range ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Receita Estimada" value="€ 45.2K" subtitle="vs semana passada" 
            icon={TrendingUp} trend="up" trendValue="+12.5%" colorClass="bg-indigo-500" 
          />
          <StatCard 
            title="Novos Leads (Real)" value={stats.clientsCount} subtitle="clientes na base" 
            icon={Users} trend="up" trendValue="+8.2%" colorClass="bg-blue-500" 
          />
          <StatCard 
            title="Ativos Geridos" value={stats.assetsCount} subtitle="da base instalada" 
            icon={CheckCircle} trend="up" trendValue="+2.1%" colorClass="bg-emerald-500" 
          />
          <StatCard 
            title="Alertas Preditivos (IA)" value={predictiveAlerts.length} subtitle="falhas iminentes" 
            icon={AlertTriangle} trend={predictiveAlerts.length > 5 ? 'up' : 'down'} trendValue={predictiveAlerts.length.toString()} colorClass="bg-rose-500" 
          />
        </div>

        {/* CHARTS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* MAIN CHART - FUNIL & ATENDIMENTOS */}
          <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2">
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Evolução de Atendimentos</h3>
                <p className="text-sm text-slate-500">Leads recebidos vs Contratos fechados (Simulação)</p>
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueDataMock} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorFechamentos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="leads" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
                  <Area type="monotone" dataKey="fechamentos" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorFechamentos)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* DONUT CHART - SAÚDE DOS ATIVOS */}
          <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
            <div className="mb-2">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Activity size={18} className="text-slate-400" /> Saúde dos Ativos (Real)
              </h3>
            </div>
            <div className="flex-1 min-h-[250px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={healthData} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={5}
                    dataKey="value" stroke="none"
                  >
                    {healthData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none' }} />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-slate-800">{stats.assetsCount}</span>
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Máquinas</span>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {healthData.map((item, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${item.bgClass}`} />
                    <span className="text-slate-600">{item.name}</span>
                  </div>
                  <span className="font-semibold text-slate-800">{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* BOTTOM SECTION - IA PREDITIVA */}
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Wind size={20} className="text-indigo-500" /> Radar de Previsão de Falhas (Ricardo IA)
              </h3>
              <p className="text-sm text-slate-500">Probabilidade de falha vs Intervenções agendadas (Simulação)</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={predictiveDataMock} layout="vertical" margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontWeight: 500 }} />
                <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="risco" name="Risco de Falha (%)" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={12} />
                <Bar dataKey="prevencao" name="Manutenção Agendada (%)" fill="#10b981" radius={[0, 4, 4, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* INFRASTRUCTURE STATUS */}
        <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-100 shadow-sm">
            <Server size={14} className="text-indigo-500" />
            <span className="text-[0.625rem] font-black text-slate-600 uppercase tracking-widest">Região: us-central1</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-100 shadow-sm">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span className="text-[0.625rem] font-black text-slate-600 uppercase tracking-widest">Cloud Operational</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-100 shadow-sm">
            <Activity size={14} className="text-amber-500 animate-pulse" />
            <span className="text-[0.625rem] font-black text-slate-600 uppercase tracking-widest">Ricardo IA: Online</span>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default DashboardView;
