
import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  Calendar, 
  Download, 
  Filter, 
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  Target,
  FileText,
  Share2,
  Mail,
  Zap,
  Smile
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar, 
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';

const performanceData = [
  { name: 'Seg', atendimentos: 120, tmr: 12, satisfacao: 4.8 },
  { name: 'Ter', atendimentos: 150, tmr: 10, satisfacao: 4.9 },
  { name: 'Qua', atendimentos: 180, tmr: 15, satisfacao: 4.5 },
  { name: 'Qui', atendimentos: 220, tmr: 8, satisfacao: 4.7 },
  { name: 'Sex', atendimentos: 200, tmr: 9, satisfacao: 4.8 },
  { name: 'Sáb', atendimentos: 90, tmr: 5, satisfacao: 5.0 },
  { name: 'Dom', atendimentos: 45, tmr: 14, satisfacao: 4.4 },
];

const funnelEfficiency = [
  { name: 'Prospecção', valor: 100, color: '#3b82f6' },
  { name: 'Diagnóstico', valor: 75, color: '#8b5cf6' },
  { name: 'Orçamento', valor: 40, color: '#f59e0b' },
  { name: 'Negociação', valor: 25, color: '#10b981' },
  { name: 'Fechado', valor: 18, color: '#064e3b' },
];

const ReportsView = () => {
  const [activeTab, setActiveTab] = useState<'performance' | 'vendas' | 'satisfacao'>('performance');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => setIsExporting(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-600 rounded-xl text-white shadow-lg shadow-emerald-200">
              <BarChart3 size={24} />
            </div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight italic">Relatórios & Insights</h2>
          </div>
          <p className="text-slate-500 text-sm font-medium">Análise granular da performance operacional e financeira.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 px-3 border-r border-slate-100">
              <Calendar size={16} className="text-slate-400" />
              <select className="text-[10px] font-black uppercase tracking-widest bg-transparent outline-none cursor-pointer">
                <option>Últimos 30 Dias</option>
                <option>Últimos 7 Dias</option>
                <option>Este Ano</option>
              </select>
            </div>
            <button className="p-2.5 text-slate-400 hover:text-indigo-600 transition-colors">
              <Filter size={18} />
            </button>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={handleExport}
              disabled={isExporting}
              className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-50"
            >
              {isExporting ? <Zap size={16} className="animate-bounce" /> : <Download size={16} />} 
              {isExporting ? 'Processando...' : 'Exportar PDF'}
            </button>
            <button className="p-3 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all shadow-sm">
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Abas de Navegação */}
      <div className="flex gap-2 p-1.5 bg-white rounded-[1.5rem] border border-slate-100 w-fit">
        <button 
          onClick={() => setActiveTab('performance')}
          className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'performance' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          Performance
        </button>
        <button 
          onClick={() => setActiveTab('vendas')}
          className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'vendas' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          Vendas
        </button>
        <button 
          onClick={() => setActiveTab('satisfacao')}
          className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'satisfacao' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          Satisfação
        </button>
      </div>

      {/* Cards de Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Conversões', value: '82%', trend: +12, icon: Target, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'TMR Equipe', value: '14m', trend: -15, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Novos Leads', value: '1,284', trend: +8, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Ticket Médio', value: 'R$ 2.4k', trend: +5, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((m, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${m.bg} ${m.color}`}>
                <m.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full ${m.trend > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {m.trend > 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {Math.abs(m.trend)}%
              </div>
            </div>
            <h4 className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{m.label}</h4>
            <p className="text-2xl font-black text-slate-800 mt-1">{m.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gráfico de Evolução */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-lg font-black text-slate-800 italic flex items-center gap-3">
                <TrendingUp size={24} className="text-emerald-600" /> Fluxo de Atendimento vs TMR
              </h3>
              <div className="flex gap-2">
                <span className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Volume
                </span>
                <span className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div> TMR
                </span>
              </div>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorAtend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} fontWeight="bold" axisLine={false} tickLine={false} dy={10} />
                  <YAxis stroke="#94a3b8" fontSize={11} fontWeight="bold" axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="atendimentos" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorAtend)" />
                  <Line type="monotone" dataKey="tmr" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[3rem] text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12">
              <Mail size={120} />
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/10">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span className="text-[9px] font-black uppercase tracking-widest">Relatórios Agendados</span>
                </div>
                <h3 className="text-2xl font-black tracking-tight italic">Receba insights semanais.</h3>
                <p className="text-slate-400 text-sm font-medium max-w-md">Configure o envio automático de PDFs executivos para sua diretoria toda segunda-feira às 08h.</p>
              </div>
              <button className="px-10 py-5 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-2xl">
                Configurar Agenda
              </button>
            </div>
          </div>
        </div>

        {/* Coluna Lateral */}
        <div className="space-y-8">
          {/* Eficiência do Funil */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-sm font-black text-slate-800 mb-8 uppercase tracking-widest flex items-center gap-2">
              <PieChart size={18} className="text-indigo-600" /> Conversão por Etapa
            </h3>
            <div className="space-y-6">
              {funnelEfficiency.map((stage, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{stage.name}</span>
                    <span className="text-xs font-black text-slate-800">{stage.valor}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${stage.valor}%`, backgroundColor: stage.color }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Impacto Automação */}
          <div className="bg-indigo-50 p-8 rounded-[2.5rem] border border-indigo-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-white rounded-xl shadow-sm text-indigo-600">
                <Zap size={20} />
              </div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">IA & Automação</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-indigo-100 flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Tempo Economizado</span>
                <span className="text-sm font-black text-indigo-600 tracking-tighter">42h / mês</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-indigo-100 flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Respostas p/ IA</span>
                <span className="text-sm font-black text-indigo-600 tracking-tighter">1.2k</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-indigo-100 flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Redução de TMR</span>
                <span className="text-sm font-black text-emerald-600 tracking-tighter">-24%</span>
              </div>
            </div>
          </div>

          {/* Satisfação do Cliente (NPS) */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
             <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-4 border border-emerald-100">
                <Smile size={32} />
             </div>
             <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-1">Satisfação Média</h3>
             <p className="text-3xl font-black text-emerald-600 tracking-tighter mb-4">4.9 / 5.0</p>
             <div className="flex justify-center gap-1 mb-6">
                {[1, 2, 3, 4, 5].map(s => <div key={s} className="w-1.5 h-6 bg-emerald-500 rounded-full opacity-30" style={{ opacity: s <= 4 ? 1 : 0.2 }}></div>)}
             </div>
             <button className="w-full py-3 bg-slate-50 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 transition-all rounded-xl border border-slate-200">
               Ver Comentários
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
