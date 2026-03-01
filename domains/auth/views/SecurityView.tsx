import React, { useState, useMemo } from 'react';
import { 
  Shield, 
  Fingerprint, 
  Activity, 
  Key, 
  Lock, 
  Smartphone, 
  Globe, 
  HardDrive, 
  UserCheck, 
  AlertTriangle,
  RefreshCw,
  History,
  ShieldCheck,
  Eye,
  Settings,
  MoreVertical,
  Download,
  Filter,
  FileText,
  ArrowLeft,
  Gavel,
  Calendar,
  X
} from 'lucide-react';
// Fix: Import useNavigate from react-router to resolve export error
import { useNavigate } from 'react-router';
import { AuditLog } from '@shared/types/common.types';

const mockLogs: AuditLog[] = [
  { id: '1', userId: 'u1', userName: 'Ricardo Silva', action: 'LOGIN_SUCCESS', resource: 'SGC Admin', ip: '189.12.34.56', device: 'Chrome / MacOS', timestamp: '2024-05-22 14:30', severity: 'low' },
  { id: '2', userId: 'u2', userName: 'Beatriz Oliveira', action: 'EXPORT_CLIENTS', resource: 'Database', ip: '187.45.12.90', device: 'Safari / iPhone', timestamp: '2024-05-22 13:15', severity: 'medium' },
  { id: '3', userId: 'unknown', userName: 'Anônimo', action: 'LOGIN_FAILED', resource: 'SGC Admin', ip: '45.122.3.44', device: 'Firefox / Linux', timestamp: '2024-05-22 12:00', severity: 'high' },
  { id: '4', userId: 'u1', userName: 'Ricardo Silva', action: 'DELETE_ASSET', resource: 'Ativos', ip: '189.12.34.56', device: 'Chrome / MacOS', timestamp: '2024-05-21 10:00', severity: 'high' },
];

const SecurityView = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'audit' | 'permissions'>('overview');
  const [twoFA, setTwoFA] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const navigate = useNavigate();

  // Audit Filter States
  const [severityFilter, setSeverityFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');
  const [periodFilter, setPeriodFilter] = useState('all');

  const filteredLogs = useMemo(() => {
    return mockLogs.filter(log => {
      const matchSeverity = severityFilter === 'all' || log.severity === severityFilter;
      const matchAction = actionFilter === 'all' || log.action === actionFilter;
      // Simulação de filtro de período por simplicidade técnica
      const matchPeriod = periodFilter === 'all' || (periodFilter === 'today' && log.timestamp.includes('2024-05-22'));
      return matchSeverity && matchAction && matchPeriod;
    });
  }, [severityFilter, actionFilter, periodFilter]);

  const handleBackup = () => {
    setIsBackingUp(true);
    setTimeout(() => setIsBackingUp(false), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-900 rounded-xl text-white shadow-lg shadow-slate-200">
              <Shield size={24} />
            </div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight italic uppercase leading-none">Command Center Security</h2>
          </div>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest opacity-60">Segurança & Conformidade Industrial</p>
        </div>

        <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm overflow-x-auto no-scrollbar">
          <button onClick={() => setActiveTab('overview')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'overview' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}>Visão Geral</button>
          <button onClick={() => setActiveTab('audit')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'audit' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}>Logs de Auditoria</button>
          <button onClick={() => setActiveTab('permissions')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'permissions' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}>Permissões</button>
        </div>
      </header>

      {activeTab === 'audit' ? (
        <div className="space-y-6">
          {/* Barra de Filtros Avançada */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-wrap gap-6 items-center">
             <div className="flex items-center gap-4 border-r border-slate-100 pr-6">
                <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400"><Filter size={18}/></div>
                <div className="space-y-1">
                   <label className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Severidade</label>
                   <select 
                     className="bg-transparent text-[10px] font-black uppercase tracking-tighter outline-none cursor-pointer text-slate-700"
                     value={severityFilter}
                     onChange={(e) => setSeverityFilter(e.target.value)}
                   >
                      <option value="all">Todas</option>
                      <option value="high">Alta (Urgente)</option>
                      <option value="medium">Média</option>
                      <option value="low">Baixa (Info)</option>
                   </select>
                </div>
             </div>

             <div className="flex items-center gap-4 border-r border-slate-100 pr-6">
                <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400"><Activity size={18}/></div>
                <div className="space-y-1">
                   <label className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Tipo de Evento</label>
                   <select 
                     className="bg-transparent text-[10px] font-black uppercase tracking-tighter outline-none cursor-pointer text-slate-700"
                     value={actionFilter}
                     onChange={(e) => setActionFilter(e.target.value)}
                   >
                      <option value="all">Todos Eventos</option>
                      <option value="LOGIN_SUCCESS">Logins Sucesso</option>
                      <option value="LOGIN_FAILED">Falhas Login</option>
                      <option value="EXPORT_CLIENTS">Exportação</option>
                      <option value="DELETE_ASSET">Exclusão Ativo</option>
                   </select>
                </div>
             </div>

             <div className="flex items-center gap-4 pr-6">
                <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400"><Calendar size={18}/></div>
                <div className="space-y-1">
                   <label className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Período</label>
                   <select 
                     className="bg-transparent text-[10px] font-black uppercase tracking-tighter outline-none cursor-pointer text-slate-700"
                     value={periodFilter}
                     onChange={(e) => setPeriodFilter(e.target.value)}
                   >
                      <option value="all">Sempre</option>
                      <option value="today">Hoje</option>
                      <option value="week">Esta Semana</option>
                      <option value="month">Este Mês</option>
                   </select>
                </div>
             </div>

             <div className="ml-auto flex gap-2">
                <button onClick={() => { setSeverityFilter('all'); setActionFilter('all'); setPeriodFilter('all'); }} className="p-3 text-slate-400 hover:text-rose-500 transition-colors"><X size={20}/></button>
                <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all">
                  <Download size={14}/> Exportar CSV
                </button>
             </div>
          </div>

          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden overflow-x-auto animate-in slide-in-from-bottom-4">
            <table className="w-full text-left min-w-[900px]">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Operador</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Evento / Gatilho</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Recurso Afetado</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Device & IP</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Horário</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredLogs.length > 0 ? filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[11px] font-black text-slate-600 uppercase border border-slate-200 group-hover:bg-white group-hover:shadow-sm transition-all">
                          {log.userName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-800 uppercase italic tracking-tighter">{log.userName}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{log.userId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                          log.severity === 'high' ? 'bg-rose-50 text-rose-600 border-rose-100 shadow-sm shadow-rose-100' : 
                          log.severity === 'medium' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                          'bg-blue-50 text-blue-600 border-blue-100'
                        }`}>
                          {log.action}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                       <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{log.resource}</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="space-y-0.5">
                        <p className="text-[9px] font-black text-slate-700 uppercase tracking-tighter">{log.device}</p>
                        <p className="text-[9px] text-slate-400 font-mono tracking-tighter">{log.ip}</p>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                       <span className="text-[10px] font-black text-slate-400 uppercase italic tracking-widest">{log.timestamp}</span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-8 py-24 text-center">
                       <div className="opacity-20 flex flex-col items-center gap-4">
                          <History size={64}/>
                          <p className="text-xs font-black uppercase tracking-[0.3em]">Nenhum log corresponde aos filtros</p>
                       </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Manter a seção Overview existente aqui ou simplificada */}
           <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative group">
                   <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform"><Fingerprint size={120}/></div>
                   <div className="flex justify-between items-start mb-10">
                      <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl shadow-sm"><Fingerprint size={28}/></div>
                      <button onClick={() => setTwoFA(!twoFA)} className={`w-14 h-7 rounded-full relative transition-all ${twoFA ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                         <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-sm ${twoFA ? 'left-8' : 'left-1'}`} />
                      </button>
                   </div>
                   <h3 className="text-2xl font-black text-slate-800 italic uppercase tracking-tighter mb-2 leading-none">Proteção Biométrica</h3>
                   <p className="text-xs text-slate-400 font-medium leading-relaxed mb-10 uppercase tracking-widest">Ative a autenticação multifator para todos os acessos administrativos da ES Enterprise.</p>
                   <div className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline cursor-pointer">Configurar Gateway <RefreshCw size={14}/></div>
                </div>

                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative group">
                   <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform"><ShieldCheck size={120}/></div>
                   <div className="flex justify-between items-start mb-10">
                      <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl shadow-sm"><ShieldCheck size={28}/></div>
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest">Active</span>
                   </div>
                   <h3 className="text-2xl font-black text-slate-800 italic uppercase tracking-tighter mb-2 leading-none">Criptografia Cloud</h3>
                   <p className="text-xs text-slate-400 font-medium leading-relaxed mb-10 uppercase tracking-widest">Protocolo de ponta-a-ponta AES-256 bits ativo em todas as comunicações com o Google Drive.</p>
                   <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest italic leading-none">Certificado TLS v1.3 SSL OK</div>
                </div>
              </div>
           </div>

           <div className="space-y-6">
              <div className="bg-slate-950 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden text-center">
                 <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 mx-auto mb-6 border border-emerald-500/20 shadow-inner"><ShieldCheck size={40}/></div>
                 <h3 className="text-xl font-black italic uppercase tracking-tight mb-2">Monitoramento Ativo</h3>
                 <p className="text-4xl font-black text-emerald-500 tracking-tighter mb-4">98.2%</p>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-10">Índice de Saúde do Sistema</p>
                 <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Scan Completo de Vulnerabilidade</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default SecurityView;