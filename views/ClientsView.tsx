
import React, { useState, useMemo, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  RefreshCw,
  Globe,
  User,
  AlertCircle,
  CheckCircle2,
  X,
  FileText,
  Package,
  MessageSquare,
  History,
  ArrowRightLeft,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Zap,
  Info,
  PieChart,
  Users,
  Target,
  Database,
  MonitorSmartphone
} from 'lucide-react';
import type { SyncLog } from '../types';
import { googleSyncService } from '../services/googleSyncService';
import { clientService, Client } from '../services/clientService';
import { seedService } from '../services/seedService';

// Mocks removidos para uso do Firestore real

const StatCard = ({ label, value, icon: Icon, color }: any) => (
  <div className="bg-white p-4 rounded-[1.5rem] border border-slate-100 shadow-sm flex items-center gap-4 group hover:shadow-md transition-all">
    <div className={`p-3 rounded-2xl ${color} text-white shadow-sm group-hover:scale-110 transition-transform`}>
      <Icon size={18} />
    </div>
    <div>
      <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">{label}</p>
      <p className="text-xl font-black text-slate-800 tracking-tighter">{value}</p>
    </div>
  </div>
);

const ClientsView = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [conflict, setConflict] = useState<{ crm: Client, google: any } | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [onboardingClient, setOnboardingClient] = useState<Client | null>(null);

  useEffect(() => {
    const unsubscribe = clientService.subscribeToClients((data) => {
      setClients(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const stats = useMemo(() => {
    const statusCounts = clients.reduce((acc, c) => {
      acc[c.status] = (acc[c.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const originCounts = clients.reduce((acc, c) => {
      acc[c.origin] = (acc[c.origin] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      status: {
        Ativo: statusCounts['Ativo'] || 0,
        Inativo: statusCounts['Inativo'] || 0,
        Prospecção: statusCounts['Prospecção'] || 0
      },
      origin: {
        Google: originCounts['Google'] || 0,
        Manual: originCounts['Manual'] || 0,
        Site: originCounts['Site'] || 0,
        WhatsApp: originCounts['WhatsApp'] || 0
      },
      total: clients.length
    };
  }, [clients]);

  const filteredClients = useMemo(() => {
    return clients.filter(c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm)
    );
  }, [clients, searchTerm]);

  const handleFullSync = async () => {
    setIsSyncing(true);
    const newLogs: SyncLog[] = [];

    try {
      const googleRawData = await googleSyncService.pullFromGoogle();
      let updatedClients = [...clients];

      for (const raw of googleRawData) {
        const update = googleSyncService.mapGoogleToCRM(raw);
        update.googleContactId = raw.googleContactId;

        const localClient = updatedClients.find(c => c.googleContactId === update.googleContactId || c.email === update.email);

        if (localClient) {
          const { hasConflict } = googleSyncService.detectConflict(localClient, update);

          if (hasConflict) {
            setConflict({ crm: localClient, google: update });
            continue;
          }

          updatedClients = updatedClients.map(c =>
            c.id === localClient.id
              ? { ...c, ...update, lastSyncAt: new Date().toISOString() }
              : c
          );

          newLogs.push({
            id: Math.random().toString(),
            clientName: localClient.name,
            service: 'CONTACTS',
            action: 'PULL',
            status: 'success',
            details: 'Campos mapeados e sincronizados com sucesso.',
            timestamp: new Date().toISOString()
          });
        } else {
          const newClient: Client = {
            id: Date.now().toString(),
            name: update.name!,
            document: '---',
            email: update.email!,
            additionalEmails: update.additionalEmails,
            phone: update.phone!,
            additionalPhones: update.additionalPhones,
            address: update.address!,
            type: 'Residencial',
            assets: [],
            origin: 'Google',
            status: 'Prospecção',
            notes: update.notes,
            updatedAt: new Date().toISOString(),
            lastSyncAt: new Date().toISOString(),
            googleContactId: update.googleContactId,
            syncTimestamp: update.syncTimestamp,
            organizationId: 'org_123'
          };
          updatedClients = [newClient, ...updatedClients];
          setOnboardingClient(newClient);

          newLogs.push({
            id: Math.random().toString(),
            clientName: newClient.name,
            service: 'CONTACTS',
            action: 'PULL',
            status: 'success',
            details: 'Novo cliente importado do Google Contacts.',
            timestamp: new Date().toISOString()
          });
        }
      }

      setClients(updatedClients);
      setSyncLogs(prev => [...newLogs, ...prev].slice(0, 50));
    } catch (err) {
      console.error(err);
    } finally {
      setIsSyncing(false);
    }
  };

  const resolveConflict = (winner: 'crm' | 'google') => {
    if (!conflict) return;
    const { crm, google } = conflict;

    if (winner === 'google') {
      setClients(prev => prev.map(c => c.id === crm.id ? { ...c, ...google, updatedAt: new Date().toISOString(), lastSyncAt: new Date().toISOString() } : c));
    } else {
      setClients(prev => prev.map(c => c.id === crm.id ? { ...c, lastSyncAt: new Date().toISOString() } : c));
    }

    setSyncLogs(prev => [{
      id: Math.random().toString(),
      clientName: crm.name,
      service: 'CONTACTS',
      action: 'CONFLICT_RESOLVED',
      status: 'success',
      details: `Mesclagem manual concluída. Versão ${winner.toUpperCase()} preservada.`,
      timestamp: new Date().toISOString()
    }, ...prev]);
    setConflict(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 italic tracking-tight">Base de Clientes</h2>
          <p className="text-slate-500 text-sm font-medium">Motor de Sincronização Google v2.0 Ativo.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowLogs(!showLogs)}
            className={`p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm ${showLogs ? 'text-blue-600 border-blue-200' : 'text-slate-400'}`}
          >
            <History size={20} />
          </button>
          <button
            onClick={handleFullSync}
            disabled={isSyncing}
            className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50"
          >
            {isSyncing ? <RefreshCw size={16} className="animate-spin" /> : <ArrowRightLeft size={16} className="text-blue-500" />}
            Sincronizar Bidirecional
          </button>
          <button
            onClick={() => {/* Lógica para abrir modal de novo cliente */ }}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
          >
            <Plus size={16} /> Novo Cliente
          </button>
        </div>
      </header>

      {/* Resumo Visual de Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 animate-in slide-in-from-top-4 duration-500">
        <StatCard label="Total Clientes" value={stats.total} icon={Users} color="bg-slate-950" />
        <StatCard label="Status: Ativos" value={stats.status.Ativo} icon={CheckCircle2} color="bg-emerald-600" />
        <StatCard label="Prospecção" value={stats.status.Prospecção} icon={Target} color="bg-amber-500" />
        <StatCard label="Inativos" value={stats.status.Inativo} icon={AlertCircle} color="bg-rose-500" />
        <StatCard label="Fonte: Google" value={stats.origin.Google} icon={Globe} color="bg-blue-600" />
        <StatCard label="Outros Canais" value={stats.origin.Manual + stats.origin.Site + stats.origin.WhatsApp} icon={Database} color="bg-indigo-600" />
      </div>

      {/* Barra de Busca e Filtros */}
      <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input
            type="text"
            placeholder="Pesquisar por nome, e-mail ou telefone..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-400 transition-all text-xs font-bold text-slate-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 hover:bg-slate-50 transition-all">
          <Filter size={16} /> Filtros Avançados
        </button>
      </div>

      {onboardingClient && (
        <div className="bg-indigo-600 text-white p-6 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl animate-in slide-in-from-top-4 border border-indigo-500/30">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-2xl"><Zap size={24} className="fill-white" /></div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest">Sucesso: {onboardingClient.name} importado!</p>
              <p className="text-[10px] font-medium opacity-80 uppercase tracking-tighter">Deseja agilizar o onboarding deste novo cliente?</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/10 flex items-center gap-2">
              <Package size={14} /> Cadastrar Ativos
            </button>
            <button className="px-4 py-2 bg-white text-indigo-600 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
              <MessageSquare size={14} /> Enviar Boas-Vindas
            </button>
            <button onClick={() => setOnboardingClient(null)} className="p-2 text-white/40 hover:text-white"><X size={18} /></button>
          </div>
        </div>
      )}

      {showLogs && (
        <div className="bg-slate-900 text-white p-8 rounded-[3rem] border border-slate-800 shadow-2xl animate-in slide-in-from-top-4 overflow-hidden relative">
          <div className="absolute right-0 top-0 p-12 opacity-5"><History size={120} /></div>
          <div className="flex justify-between items-center mb-8">
            <h4 className="text-[10px] font-black uppercase text-indigo-400 tracking-widest flex items-center gap-2"><ArrowRightLeft size={16} /> Logs de Auditoria de Sincronização</h4>
            <button onClick={() => setShowLogs(false)}><X size={18} /></button>
          </div>
          <div className="space-y-4 max-h-80 overflow-y-auto pr-4 custom-scrollbar">
            {syncLogs.map(log => (
              <div key={log.id} className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
                <div className={`p-2 rounded-xl ${log.action === 'PUSH' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                  {log.action === 'PUSH' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs font-black uppercase tracking-tight">{log.clientName}</p>
                    <p className="text-[9px] font-mono text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</p>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">{log.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredClients.map(client => {
          const isOutdated = client.googleContactId && client.lastSyncAt && new Date(client.updatedAt) > new Date(client.lastSyncAt);

          return (
            <div
              key={client.id}
              onClick={() => setSelectedClient(client)}
              className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer relative overflow-hidden"
            >
              {isOutdated && <div className="absolute top-0 left-0 w-full h-1 bg-amber-500 animate-pulse" />}

              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-2">
                  <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${client.origin === 'Google' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-50 text-slate-500 border-slate-100'
                    }`}>
                    {client.origin}
                  </span>
                  {client.syncTimestamp && (
                    <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1">
                      <RefreshCw size={10} /> {new Date(client.syncTimestamp).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <button className="p-2 text-slate-300 hover:text-slate-600"><MoreVertical size={20} /></button>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-black text-slate-800 line-clamp-1 italic uppercase tracking-tighter">{client.name}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase">{client.status} • {client.type}</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-slate-500">
                  <Mail size={14} className="text-slate-300" />
                  <span className="text-xs font-medium truncate">{client.email}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <Phone size={14} className="text-slate-300" />
                  <span className="text-xs font-medium">{client.phone}</span>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                <div className="flex items-center gap-1.5 text-[9px] font-black text-blue-600 uppercase tracking-widest">
                  Ver Perfil <ChevronRight size={14} />
                </div>
                {client.googleContactId && <Globe size={16} className="text-blue-200" />}
              </div>
            </div>
          );
        })}
      </div>

      {conflict && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative overflow-hidden animate-in zoom-in-95">
            <div className="p-8 border-b bg-amber-50/50 flex items-center gap-4">
              <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl"><AlertCircle size={24} /></div>
              <div>
                <h3 className="text-xl font-black text-slate-800 italic uppercase tracking-tighter">Deduplicação Proativa</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Encontramos dados diferentes para {conflict.crm.name}</p>
              </div>
            </div>

            <div className="p-8 grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg w-fit text-[10px] font-black uppercase">Versão CRM</div>
                <div className="p-5 bg-slate-50 rounded-3xl border border-blue-100 text-[10px] font-bold text-slate-600 space-y-2">
                  <p className="text-slate-900">{conflict.crm.name}</p>
                  <p>{conflict.crm.email}</p>
                  <p>{conflict.crm.phone}</p>
                </div>
                <button onClick={() => resolveConflict('crm')} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-blue-100">Manter CRM</button>
              </div>

              <div className="space-y-4">
                <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg w-fit text-[10px] font-black uppercase">Versão Google</div>
                <div className="p-5 bg-slate-50 rounded-3xl border border-emerald-100 text-[10px] font-bold text-slate-600 space-y-2">
                  <p className="text-slate-900">{conflict.google.name}</p>
                  <p>{conflict.google.email}</p>
                  <p>{conflict.google.phone}</p>
                </div>
                <button onClick={() => resolveConflict('google')} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-emerald-100">Atualizar CRM</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedClient && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedClient(null)} />
          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="p-8 border-b flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white text-2xl font-black">
                  {selectedClient.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter italic">{selectedClient.name}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID Google: {selectedClient.googleContactId || 'Local'}</p>
                </div>
              </div>
              <button onClick={() => setSelectedClient(null)} className="p-2 text-slate-400"><X size={24} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              <section className="space-y-4">
                <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest border-b pb-2">Contatos Vinculados</h4>
                <div className="space-y-3">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 relative group">
                    <span className="absolute top-4 right-4 text-[8px] font-black text-blue-600 uppercase">Principal</span>
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">E-mail</p>
                    <p className="text-sm font-bold text-slate-700">{selectedClient.email}</p>
                  </div>
                  {selectedClient.additionalEmails?.map((email, i) => (
                    <div key={i} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-1">E-mail Adicional {i + 1}</p>
                      <p className="text-sm font-bold text-slate-500 italic">{email}</p>
                    </div>
                  ))}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 relative group">
                    <span className="absolute top-4 right-4 text-[8px] font-black text-blue-600 uppercase">WhatsApp</span>
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Telefone</p>
                    <p className="text-sm font-bold text-slate-700">{selectedClient.phone}</p>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest border-b pb-2">Sincronização & Metadados</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Origem</p>
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700"><Globe size={14} className="text-blue-500" /> {selectedClient.origin}</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Última Sync</p>
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700"><RefreshCw size={14} className="text-emerald-500" /> {selectedClient.syncTimestamp ? new Date(selectedClient.syncTimestamp).toLocaleDateString() : 'N/A'}</div>
                  </div>
                </div>
              </section>
            </div>

            <div className="p-8 border-t bg-slate-50 flex gap-3">
              <button className="flex-1 py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase text-slate-400">Excluir</button>
              <button className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">Salvar & Sync</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsView;
