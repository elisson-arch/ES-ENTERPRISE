
import React, { useState } from 'react';
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
  Gavel
} from 'lucide-react';
// Fixing react-router-dom import
import { useNavigate } from 'react-router-dom';
import { AuditLog } from '../types';

const mockLogs: AuditLog[] = [
  { id: '1', userId: 'u1', userName: 'Ricardo Silva', action: 'LOGIN_SUCCESS', resource: 'SGC Admin', ip: '189.12.34.56', device: 'Chrome / MacOS', timestamp: '2024-05-22 14:30', severity: 'low' },
  { id: '2', userId: 'u2', userName: 'Beatriz Oliveira', action: 'EXPORT_CLIENTS', resource: 'Database', ip: '187.45.12.90', device: 'Safari / iPhone', timestamp: '2024-05-22 13:15', severity: 'medium' },
  { id: '3', userId: 'unknown', userName: 'Anônimo', action: 'LOGIN_FAILED', resource: 'SGC Admin', ip: '45.122.3.44', device: 'Firefox / Linux', timestamp: '2024-05-22 12:00', severity: 'high' },
];

const SecurityView = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'audit' | 'permissions'>('overview');
  const [twoFA, setTwoFA] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const navigate = useNavigate();

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
            <h2 className="text-3xl font-black text-slate-800 tracking-tight italic">Segurança & Conformidade</h2>
          </div>
          <p className="text-slate-500 text-sm font-medium">Gestão de acessos, auditoria e integridade de dados.</p>
        </div>

        <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'overview' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            Visão Geral
          </button>
          <button 
            onClick={() => setActiveTab('audit')}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'audit' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            Logs de Auditoria
          </button>
          <button 
            onClick={() => setActiveTab('permissions')}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'permissions' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            Permissões
          </button>
        </div>
      </header>

      {activeTab === 'overview' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Status Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Fingerprint size={120} />
                </div>
                <div className="flex justify-between items-start mb-8">
                  <div className="p-4 bg-indigo-50 text-indigo-600 rounded-3xl">
                    <Fingerprint size={28} />
                  </div>
                  <button 
                    onClick={() => setTwoFA(!twoFA)}
                    className={`w-14 h-7 rounded-full relative transition-all ${twoFA ? 'bg-emerald-500' : 'bg-slate-200'}`}
                  >
                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-sm ${twoFA ? 'left-8' : 'left-1'}`} />
                  </button>
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-2 italic">Autenticação 2FA</h3>
                <p className="text-sm text-slate-500 font-medium mb-6">Proteja sua conta com uma camada adicional de segurança via App ou SMS.</p>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-indigo-600 tracking-widest cursor-pointer hover:underline">
                  Configurar Métodos <RefreshCw size={12} />
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                  <ShieldCheck size={120} />
                </div>
                <div className="flex justify-between items-start mb-8">
                  <div className="p-4 bg-emerald-50 text-emerald-600 rounded-3xl">
                    <ShieldCheck size={28} />
                  </div>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-100">
                    Ativo
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-2 italic">Criptografia AES-256</h3>
                <p className="text-sm text-slate-500 font-medium mb-6">Todos os dados de clientes e orçamentos são criptografados em repouso.</p>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-emerald-600 tracking-widest">
                  Certificado TLS v1.3 <Lock size={12} />
                </div>
              </div>
            </div>

            <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px]"></div>
              <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/20">
                    <HardDrive size={14} />
                    <span className="text-[9px] font-black uppercase tracking-widest">SGC Backup Cloud</span>
                  </div>
                  <h3 className="text-3xl font-black italic tracking-tight">Integridade Garantida.</h3>
                  <p className="text-slate-400 text-sm font-medium max-w-md">Snapshots diários de toda a sua base de dados CRM. Recupere informações em minutos.</p>
                  <div className="flex gap-4 pt-4">
                     <div className="text-center">
                        <p className="text-[10px] font-black uppercase text-slate-500">Último</p>
                        <p className="text-sm font-black">Hoje, 04:00 AM</p>
                     </div>
                     <div className="w-px bg-white/10 h-10"></div>
                     <div className="text-center">
                        <p className="text-[10px] font-black uppercase text-slate-500">Próximo</p>
                        <p className="text-sm font-black">Amanhã, 04:00 AM</p>
                     </div>
                  </div>
                </div>
                <button 
                  onClick={handleBackup}
                  disabled={isBackingUp}
                  className="px-10 py-5 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {isBackingUp ? <RefreshCw size={18} className="animate-spin" /> : <RefreshCw size={18} />}
                  {isBackingUp ? 'Processando...' : 'Backup Manual'}
                </button>
              </div>
            </div>
          </div>

          {/* Alerts & Health */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
               <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-6 border-4 border-emerald-100 shadow-inner">
                  <ShieldCheck size={40} />
               </div>
               <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-1">Saúde do Sistema</h3>
               <p className="text-4xl font-black text-emerald-600 tracking-tighter mb-4">98%</p>
               <p className="text-xs text-slate-500 font-medium px-4 leading-relaxed mb-8">Todos os protocolos de segurança estão ativos e operacionais.</p>
               <button className="w-full py-4 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all rounded-2xl border border-slate-200">
                 Ver Varredura Completa
               </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative group overflow-hidden cursor-pointer" onClick={() => navigate('/privacy')}>
                 <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                   <FileText size={60} />
                 </div>
                 <div className="flex items-center gap-3 mb-4">
                   <div className="p-2 bg-blue-50 rounded-xl text-blue-600 shadow-sm">
                     <FileText size={18} />
                   </div>
                   <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Privacidade</h3>
                 </div>
                 <div className="flex items-center justify-between gap-2 text-[9px] font-black uppercase text-blue-600 tracking-widest group-hover:underline">
                   Abrir Política <ArrowLeft className="rotate-180" size={12} />
                 </div>
              </div>

              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative group overflow-hidden cursor-pointer" onClick={() => navigate('/terms')}>
                 <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                   <Gavel size={60} />
                 </div>
                 <div className="flex items-center gap-3 mb-4">
                   <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600 shadow-sm">
                     <Gavel size={18} />
                   </div>
                   <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Termos de Uso</h3>
                 </div>
                 <div className="flex items-center justify-between gap-2 text-[9px] font-black uppercase text-indigo-600 tracking-widest group-hover:underline">
                   Abrir Contrato <ArrowLeft className="rotate-180" size={12} />
                 </div>
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === 'audit' ? (
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-2xl shadow-sm text-slate-900"><History size={24} /></div>
              <div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Logs de Auditoria Global</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Registro detalhado de ações sensíveis no sistema</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-slate-50 flex items-center gap-2 transition-all">
                <Filter size={16} /> Filtrar
              </button>
              <button className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-all flex items-center gap-2">
                <Download size={16} /> Exportar CSV
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Usuário</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ação</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Dispositivo/IP</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Timestamp</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {mockLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-600 uppercase border border-slate-200">
                            {log.userName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-800">{log.userName}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase">{log.userId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                            log.severity === 'high' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                            log.severity === 'medium' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                            'bg-blue-50 text-blue-600 border-blue-100'
                          }`}>
                            {log.action}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-[10px] font-bold text-slate-700">{log.device}</p>
                        <p className="text-[10px] text-slate-400 font-mono tracking-tighter">{log.ip}</p>
                      </td>
                      <td className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase">{log.timestamp}</td>
                      <td className="px-6 py-5 text-right">
                        <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-300 transition-colors">
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { role: 'Admin', icon: Shield, color: 'text-rose-600', bg: 'bg-rose-50', users: 2, desc: 'Acesso total a configurações, faturamento e base de dados.' },
             { role: 'Gerente', icon: UserCheck, color: 'text-indigo-600', bg: 'bg-indigo-50', users: 5, desc: 'Gestão de funil, relatórios e supervisão de atendentes.' },
             { role: 'Atendente', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50', users: 15, desc: 'Focado em chat, orçamentos e atendimento ao cliente.' },
           ].map((r, i) => (
             <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center text-center">
               <div className={`p-5 rounded-3xl ${r.bg} ${r.color} mb-6`}>
                 <r.icon size={32} />
               </div>
               <h3 className="text-xl font-black text-slate-800 mb-2 italic uppercase tracking-tighter">{r.role}</h3>
               <p className="text-xs text-slate-500 font-medium mb-8 leading-relaxed">{r.desc}</p>
               <div className="mt-auto w-full flex flex-col gap-3">
                 <div className="flex justify-between items-center px-4 py-2 bg-slate-50 rounded-xl">
                   <span className="text-[10px] font-black uppercase text-slate-400">Usuários</span>
                   <span className="text-xs font-black text-slate-800">{r.users}</span>
                 </div>
                 <button className="w-full py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                   <Settings size={14} /> Editar Níveis
                 </button>
               </div>
             </div>
           ))}
        </div>
      )}

      {/* Security Tip */}
      <div className="bg-indigo-600 p-8 rounded-[3rem] text-white flex flex-col md:flex-row items-center gap-8 shadow-2xl shadow-indigo-200 group">
        <div className="p-6 bg-white/10 rounded-[2rem] border border-white/10 group-hover:scale-110 transition-transform">
          <Eye size={40} />
        </div>
        <div className="flex-1 space-y-2 text-center md:text-left">
          <h3 className="text-xl font-black uppercase tracking-tight italic">Relatório de Vulnerabilidade</h3>
          <p className="text-sm text-white/80 font-medium max-w-2xl leading-relaxed">
            Nossa IA de segurança analisa constantemente padrões de acesso para prevenir vazamentos. Recomendamos rotacionar as chaves de API a cada 90 dias.
          </p>
        </div>
        <button className="px-8 py-5 bg-white text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all">
          Iniciar Scan Completo
        </button>
      </div>
    </div>
  );
};

export default SecurityView;
