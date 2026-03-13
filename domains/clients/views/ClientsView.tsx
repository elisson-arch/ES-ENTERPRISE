
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
  MonitorSmartphone,
  ShieldAlert,
  ShieldCheck,
  Folder
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SyncLog } from '@shared/types/common.types';
import type { Asset } from '@shared/types/common.types';
import { googleSyncService, driveFileService } from '@google-workspace';
import { clientService, Client } from '@clients';
import { seedService, inventoryService } from '@inventory';
import { chatService } from '@whatsapp';
import { predictiveService } from '@ai';
import { auditService } from '@shared';
import { tenantService } from '@auth';

// Mocks removidos para uso do Firestore real

const StatCard = ({ label, value, icon: Icon, color }: any) => (
  <div className="bg-slate-50 p-4 rounded-[2rem] flex items-center gap-4">
    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white shrink-0 ${color}`}>
      <Icon size={20} />
    </div>
    <div className="flex-1 w-full">
      <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1.5">{label}</p>
      <div className="bg-white rounded-xl px-4 py-2 shadow-sm w-full">
        <p className="text-xl font-black text-slate-800 leading-none">{value}</p>
      </div>
    </div>
  </div>
);

const PAGE_SIZE = 9;

type ClientFormState = {
  id?: string;
  name: string;
  legalName: string;
  clientCode: string;
  document: string;
  email: string;
  additionalEmails: string[];
  phone: string;
  additionalPhones: string[];
  address: string;
  city: string;
  state: string;
  zipCode: string;
  type: 'Residencial' | 'Comercial';
  status: 'Ativo' | 'Inativo' | 'Prospecção';
  origin: 'Manual' | 'Google' | 'Site' | 'WhatsApp';
  notes: string;
};

const generateClientCode = () => {
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  const date = new Date();
  const stamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  return `CLI-${stamp}-${random}`;
};

const emptyClientForm = (): ClientFormState => ({
  name: '',
  legalName: '',
  clientCode: generateClientCode(),
  document: '',
  email: '',
  additionalEmails: [],
  phone: '',
  additionalPhones: [],
  address: '',
  city: '',
  state: '',
  zipCode: '',
  type: 'Residencial',
  status: 'Prospecção',
  origin: 'Manual',
  notes: ''
});

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
  const [showClientForm, setShowClientForm] = useState(false);
  const [isSavingClient, setIsSavingClient] = useState(false);
  const [clientForm, setClientForm] = useState<ClientFormState>(emptyClientForm());
  const [linkedAssets, setLinkedAssets] = useState<Asset[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | Client['status']>('all');
  const [originFilter, setOriginFilter] = useState<'all' | Client['origin']>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | Client['type']>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [orgId, setOrgId] = useState(tenantService.getCurrentOrgId());
  
  const [allAssets, setAllAssets] = useState<Asset[]>([]);
  const [clientFiles, setClientFiles] = useState<any[]>([]);
  const [clientChat, setClientChat] = useState<any | null>(null);

  useEffect(() => {
    const unsubscribe = clientService.subscribeToClients(orgId, (data) => {
      setClients(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [orgId]);

  useEffect(() => {
    const unsubscribe = inventoryService.subscribeToAssets(orgId, (data) => {
      setAllAssets(data);
    });
    return () => unsubscribe();
  }, [orgId]);

  useEffect(() => {
    const handleAuthChange = () => {
      const derived = tenantService.resolveAndPersistFromSession();
      setOrgId(derived);
    };
    window.addEventListener('google_auth_change', handleAuthChange);
    return () => window.removeEventListener('google_auth_change', handleAuthChange);
  }, []);

  useEffect(() => {
    let mounted = true;
    const loadClientData = async () => {
      if (!selectedClient?.id) {
        setLinkedAssets([]);
        setClientFiles([]);
        setClientChat(null);
        return;
      }
      try {
        const assets = await inventoryService.getAssetsByClient(selectedClient.id);
        const files = await driveFileService.getFilesByClient(orgId, selectedClient.id);
        const chat = await chatService.getChatByClient(orgId, selectedClient.id);
        if (mounted) {
          setLinkedAssets(assets);
          setClientFiles(files);
          setClientChat(chat);
        }
      } catch (err) {
        console.error('Falha ao carregar dados do cliente:', err);
      }
    };
    loadClientData();
    return () => { mounted = false; };
  }, [selectedClient?.id, orgId]);

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
    return clients.filter(c => {
      const query = searchTerm.toLowerCase();
      const matchesSearch =
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.phone.includes(searchTerm) ||
        (c.document || '').toLowerCase().includes(query) ||
        (c.clientCode || '').toLowerCase().includes(query);

      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
      const matchesOrigin = originFilter === 'all' || c.origin === originFilter;
      const matchesType = typeFilter === 'all' || c.type === typeFilter;

      return matchesSearch && matchesStatus && matchesOrigin && matchesType;
    });
  }, [clients, searchTerm, statusFilter, originFilter, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredClients.length / PAGE_SIZE));
  const paginatedClients = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredClients.slice(start, start + PAGE_SIZE);
  }, [filteredClients, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, originFilter, typeFilter]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const openCreateClient = () => {
    setClientForm(emptyClientForm());
    setShowClientForm(true);
  };

  const openEditClient = (client: Client) => {
    setClientForm({
      id: client.id,
      name: client.name || '',
      legalName: client.legalName || '',
      clientCode: client.clientCode || generateClientCode(),
      document: client.document || '',
      email: client.email || '',
      additionalEmails: client.additionalEmails || [],
      phone: client.phone || '',
      additionalPhones: client.additionalPhones || [],
      address: client.address || '',
      city: client.city || '',
      state: client.state || '',
      zipCode: client.zipCode || '',
      type: client.type || 'Residencial',
      status: client.status || 'Prospecção',
      origin: client.origin || 'Manual',
      notes: client.notes || ''
    });
    setShowClientForm(true);
  };

  const writeAudit = async (
    entityType: 'client' | 'sync',
    entityId: string,
    action: 'CLIENT_CREATE' | 'CLIENT_UPDATE' | 'CLIENT_DELETE' | 'CLIENT_SYNC' | 'CLIENT_CONFLICT_RESOLVE',
    before?: Record<string, unknown> | null,
    after?: Record<string, unknown> | null,
    metadata?: Record<string, unknown>
  ) => {
    try {
      await auditService.log({
        organizationId: orgId,
        entityType,
        entityId,
        action,
        before: before || null,
        after: after || null,
        metadata
      });
    } catch (err) {
      console.error('Falha ao gravar auditoria:', err);
    }
  };

  const handleSaveClient = async () => {
    if (!clientForm.name.trim() || !clientForm.phone.trim()) {
      alert('Nome e telefone são obrigatórios.');
      return;
    }

    setIsSavingClient(true);
    try {
      const now = new Date().toISOString();
      const previous = clientForm.id ? clients.find(c => c.id === clientForm.id) : null;
      const payload = {
        clientCode: clientForm.clientCode || generateClientCode(),
        name: clientForm.name.trim(),
        legalName: clientForm.legalName.trim(),
        document: clientForm.document.trim(),
        email: clientForm.email.trim(),
        additionalEmails: clientForm.additionalEmails.filter(e => e.trim() !== ''),
        phone: clientForm.phone.trim(),
        additionalPhones: clientForm.additionalPhones.filter(p => p.trim() !== ''),
        address: clientForm.address.trim(),
        city: clientForm.city.trim(),
        state: clientForm.state.trim(),
        zipCode: clientForm.zipCode.trim(),
        type: clientForm.type,
        status: clientForm.status,
        origin: clientForm.origin,
        notes: clientForm.notes.trim(),
        organizationId: orgId,
        updatedAt: now
      };

      if (clientForm.id) {
        await clientService.updateClient(clientForm.id, payload);
        await writeAudit('client', clientForm.id, 'CLIENT_UPDATE', previous as unknown as Record<string, unknown>, payload as unknown as Record<string, unknown>);
      } else {
        const newId = await clientService.createClient({
          ...payload,
          assets: [],
          linkedAssetIds: [],
          syncTimestamp: now
        });
        await writeAudit('client', newId, 'CLIENT_CREATE', null, { ...payload, id: newId } as unknown as Record<string, unknown>);
      }

      setShowClientForm(false);
      setClientForm(emptyClientForm());
    } catch (err) {
      console.error('Erro ao salvar cliente:', err);
      alert('Não foi possível salvar o cliente agora.');
    } finally {
      setIsSavingClient(false);
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    const ok = window.confirm('Deseja realmente excluir este cliente?');
    if (!ok) return;
    try {
      const previous = clients.find(c => c.id === clientId) || null;
      await clientService.deleteClient(clientId);
      await writeAudit('client', clientId, 'CLIENT_DELETE', previous as unknown as Record<string, unknown>, null);
      if (selectedClient?.id === clientId) setSelectedClient(null);
    } catch (err) {
      console.error('Erro ao excluir cliente:', err);
      alert('Não foi possível excluir o cliente.');
    }
  };

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
            clientCode: generateClientCode(),
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
            organizationId: orgId
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
      await writeAudit('sync', `sync_${Date.now()}`, 'CLIENT_SYNC', null, {
        importedOrUpdated: newLogs.length,
        totalGoogleRecords: googleRawData.length
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSyncing(false);
    }
  };

  const resolveConflict = async (winner: 'crm' | 'google') => {
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
    await writeAudit('sync', crm.id, 'CLIENT_CONFLICT_RESOLVE', crm as unknown as Record<string, unknown>, google as Record<string, unknown>, { winner });
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
            onClick={openCreateClient}
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
      <div className="bg-slate-50 p-3 rounded-full flex flex-col md:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input
            type="text"
            placeholder="Pesquisar por nome..."
            className="w-full pl-12 pr-4 py-3 bg-white border-none rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all text-xs font-bold text-slate-700 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="w-full md:w-auto px-6 py-3 bg-white border-none rounded-full text-[10px] font-black uppercase tracking-widest text-slate-600 shadow-sm"
        >
          <option value="all">Status: Todos</option>
          <option value="Ativo">Status: Ativo</option>
          <option value="Prospecção">Status: Prospecção</option>
          <option value="Inativo">Status: Inativo</option>
        </select>
        <select
          value={originFilter}
          onChange={(e) => setOriginFilter(e.target.value as typeof originFilter)}
          className="w-full md:w-auto px-6 py-3 bg-white border-none rounded-full text-[10px] font-black uppercase tracking-widest text-slate-600 shadow-sm"
        >
          <option value="all">Origem: Todas</option>
          <option value="Manual">Origem: Manual</option>
          <option value="Google">Origem: Google</option>
          <option value="Site">Origem: Site</option>
          <option value="WhatsApp">Origem: WhatsApp</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
          className="w-full md:w-auto px-6 py-3 bg-white border-none rounded-full text-[10px] font-black uppercase tracking-widest text-slate-600 shadow-sm"
        >
          <option value="all">Tipo: Todos</option>
          <option value="Residencial">Tipo: Residencial</option>
          <option value="Comercial">Tipo: Comercial</option>
        </select>
        <button
          onClick={() => {
            setSearchTerm('');
            setStatusFilter('all');
            setOriginFilter('all');
            setTypeFilter('all');
          }}
          className="px-6 py-3 bg-white border-none rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 hover:bg-slate-100 transition-all shadow-sm"
        >
          <Filter size={16} /> Limpar
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
            <button onClick={() => { setSelectedClient(onboardingClient); setOnboardingClient(null); }} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/10 flex items-center gap-2">
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

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
          }
        }}
      >
        {paginatedClients.map(client => {
          const isOutdated = client.googleContactId && client.lastSyncAt && new Date(client.updatedAt) > new Date(client.lastSyncAt);
          
          // Predictive Analysis
          const clientAssets = allAssets.filter(a => a.clientId === client.id);
          const risks = predictiveService.analyzeAssetsRisk(clientAssets);
          const hasCritical = risks.some(r => r.severity === 'critical');
          const hasWarning = risks.some(r => r.severity === 'warning');
          
          const healthStatus = clientAssets.length === 0 ? 'none' : hasCritical ? 'critical' : hasWarning ? 'warning' : 'healthy';

          return (
            <motion.div
              key={client.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              onClick={() => setSelectedClient(client)}
              className="bg-white/80 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all group cursor-pointer relative overflow-hidden"
            >
              {isOutdated && <div className="absolute top-0 left-0 w-full h-1 bg-amber-500 animate-pulse" />}

              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-2 items-center">
                  <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${client.origin === 'Google' ? 'bg-blue-50/50 text-blue-600 border-blue-100/50' : 'bg-slate-50/50 text-slate-500 border-slate-100/50'
                    }`}>
                    {client.origin}
                  </span>
                  
                  {/* Health Indicator Seal */}
                  {healthStatus === 'critical' && (
                    <div className="flex items-center gap-1 bg-rose-50/80 text-rose-600 px-2 py-1 rounded-full border border-rose-100/50" title="Risco Crítico de Falha">
                      <ShieldAlert size={12} />
                      <span className="text-[8px] font-black uppercase tracking-widest">Alerta IA</span>
                    </div>
                  )}
                  {healthStatus === 'healthy' && (
                    <div className="flex items-center gap-1 bg-emerald-50/80 text-emerald-600 px-2 py-1 rounded-full border border-emerald-100/50" title="Equipamentos Saudáveis">
                      <ShieldCheck size={12} />
                      <span className="text-[8px] font-black uppercase tracking-widest">Saudável</span>
                    </div>
                  )}
                </div>
                <button 
                  className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-xl transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`https://wa.me/${client.phone.replace(/\D/g, '')}`, '_blank');
                  }}
                  title="Abrir WhatsApp"
                >
                  <MessageSquare size={16} />
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-black text-slate-800 line-clamp-1 italic uppercase tracking-tighter group-hover:text-indigo-600 transition-colors">{client.name}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase">{client.status} • {client.type}</p>
                <p className="text-[9px] text-slate-400 font-mono mt-1">{client.clientCode || 'SEM-CODIGO'}</p>
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

              <div className="pt-6 border-t border-slate-100/50 flex justify-between items-center">
                <div className="flex items-center gap-1.5 text-[9px] font-black text-indigo-600 uppercase tracking-widest group-hover:gap-2 transition-all">
                  Raio-X do Cliente <ChevronRight size={14} />
                </div>
                {client.googleContactId && <Globe size={16} className="text-blue-200" />}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="bg-white rounded-[2rem] p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-sm">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Página {currentPage} de {totalPages} • {filteredClients.length} clientes filtrados
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-6 py-3 bg-white border border-slate-100 rounded-full text-[10px] font-black uppercase text-slate-400 hover:bg-slate-50 disabled:opacity-40 transition-colors shadow-sm"
          >
            Anterior
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-6 py-3 bg-slate-400 hover:bg-slate-500 text-white rounded-full text-[10px] font-black uppercase disabled:opacity-40 transition-colors shadow-sm"
          >
            Próxima
          </button>
        </div>
      </div>

      {showClientForm && (
        <div className="fixed inset-0 z-[900] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowClientForm(false)} />
          <div className="relative bg-white w-full max-w-4xl rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95">
            <div className="p-6 border-b bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tighter">{clientForm.id ? 'Editar Cliente' : 'Novo Cliente'}</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID único operacional: {clientForm.clientCode}</p>
              </div>
              <button onClick={() => setShowClientForm(false)} className="p-2 text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase">Nome Fantasia</label>
                <input className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" value={clientForm.name} onChange={(e) => setClientForm(prev => ({ ...prev, name: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase">Razão Social</label>
                <input className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" value={clientForm.legalName} onChange={(e) => setClientForm(prev => ({ ...prev, legalName: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase">Documento (CPF/CNPJ)</label>
                <input className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" value={clientForm.document} onChange={(e) => setClientForm(prev => ({ ...prev, document: e.target.value }))} />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase">Telefone Principal</label>
                <input className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" value={clientForm.phone} onChange={(e) => setClientForm(prev => ({ ...prev, phone: e.target.value }))} />
                {clientForm.additionalPhones.map((phone, index) => (
                  <div key={`phone-${index}`} className="flex gap-2 mt-2">
                    <input placeholder={`Telefone Secundário ${index + 1}`} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" value={phone} onChange={(e) => {
                      const newPhones = [...clientForm.additionalPhones];
                      newPhones[index] = e.target.value;
                      setClientForm(prev => ({ ...prev, additionalPhones: newPhones }));
                    }} />
                    <button type="button" onClick={() => {
                      const newPhones = clientForm.additionalPhones.filter((_, i) => i !== index);
                      setClientForm(prev => ({ ...prev, additionalPhones: newPhones }));
                    }} className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-100 transition-colors"><X size={16} /></button>
                  </div>
                ))}
                <button type="button" onClick={() => setClientForm(prev => ({ ...prev, additionalPhones: [...prev.additionalPhones, ''] }))} className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-2">
                  <Plus size={12} /> Adicionar Telefone Secundário
                </button>
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase">E-mail Principal</label>
                <input type="email" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" value={clientForm.email} onChange={(e) => setClientForm(prev => ({ ...prev, email: e.target.value }))} />
                {clientForm.additionalEmails.map((email, index) => (
                  <div key={`email-${index}`} className="flex gap-2 mt-2">
                    <input type="email" placeholder={`E-mail Secundário ${index + 1}`} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" value={email} onChange={(e) => {
                      const newEmails = [...clientForm.additionalEmails];
                      newEmails[index] = e.target.value;
                      setClientForm(prev => ({ ...prev, additionalEmails: newEmails }));
                    }} />
                    <button type="button" onClick={() => {
                      const newEmails = clientForm.additionalEmails.filter((_, i) => i !== index);
                      setClientForm(prev => ({ ...prev, additionalEmails: newEmails }));
                    }} className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-100 transition-colors"><X size={16} /></button>
                  </div>
                ))}
                <button type="button" onClick={() => setClientForm(prev => ({ ...prev, additionalEmails: [...prev.additionalEmails, ''] }))} className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-2">
                  <Plus size={12} /> Adicionar E-mail Secundário
                </button>
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase">Endereço</label>
                <input className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" value={clientForm.address} onChange={(e) => setClientForm(prev => ({ ...prev, address: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase">Cidade</label>
                <input className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" value={clientForm.city} onChange={(e) => setClientForm(prev => ({ ...prev, city: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase">UF</label>
                <input className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" value={clientForm.state} onChange={(e) => setClientForm(prev => ({ ...prev, state: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase">CEP</label>
                <input className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" value={clientForm.zipCode} onChange={(e) => setClientForm(prev => ({ ...prev, zipCode: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase">Tipo</label>
                <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" value={clientForm.type} onChange={(e) => setClientForm(prev => ({ ...prev, type: e.target.value as ClientFormState['type'] }))}>
                  <option value="Residencial">Residencial</option>
                  <option value="Comercial">Comercial</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase">Status</label>
                <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" value={clientForm.status} onChange={(e) => setClientForm(prev => ({ ...prev, status: e.target.value as ClientFormState['status'] }))}>
                  <option value="Prospecção">Prospecção</option>
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase">Origem</label>
                <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" value={clientForm.origin} onChange={(e) => setClientForm(prev => ({ ...prev, origin: e.target.value as ClientFormState['origin'] }))}>
                  <option value="Manual">Manual</option>
                  <option value="Google">Google</option>
                  <option value="Site">Site</option>
                  <option value="WhatsApp">WhatsApp</option>
                </select>
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase">Observações</label>
                <textarea className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium h-24" value={clientForm.notes} onChange={(e) => setClientForm(prev => ({ ...prev, notes: e.target.value }))} />
              </div>
            </div>

            <div className="p-6 border-t bg-slate-50 flex gap-3">
              <button onClick={() => setShowClientForm(false)} className="flex-1 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase text-slate-500">Cancelar</button>
              <button onClick={handleSaveClient} disabled={isSavingClient} className="flex-[2] py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg disabled:opacity-60">
                {isSavingClient ? 'Salvando...' : 'Salvar Cliente'}
              </button>
            </div>
          </div>
        </div>
      )}

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

      <AnimatePresence>
        {selectedClient && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
              onClick={() => setSelectedClient(null)} 
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-xl bg-white/90 backdrop-blur-2xl h-full shadow-2xl flex flex-col border-l border-white/50"
            >
              <div className="p-8 border-b border-slate-100/50 flex justify-between items-center bg-white/50">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-[1.5rem] flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-indigo-200">
                    {selectedClient.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter italic">{selectedClient.name}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID Cliente: {selectedClient.clientCode || 'SEM-CODIGO'}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID Google: {selectedClient.googleContactId || 'Local'}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedClient(null)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"><X size={24} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                {/* Contatos */}
                <section className="space-y-4">
                  <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest border-b border-slate-100/50 pb-2 flex items-center gap-2">
                    <User size={14} /> Contatos Vinculados
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-white/60 rounded-2xl border border-slate-100 relative group hover:bg-white transition-colors">
                      <span className="absolute top-4 right-4 text-[8px] font-black text-blue-600 uppercase">Principal</span>
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-1">E-mail</p>
                      <p className="text-sm font-bold text-slate-700 truncate" title={selectedClient.email}>{selectedClient.email}</p>
                    </div>
                    {selectedClient.additionalEmails?.map((email, idx) => (
                      <div key={`email-${idx}`} className="p-4 bg-white/60 rounded-2xl border border-slate-100 relative group hover:bg-white transition-colors">
                        <span className="absolute top-4 right-4 text-[8px] font-black text-slate-400 uppercase">Secundário</span>
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">E-mail {idx + 2}</p>
                        <p className="text-sm font-bold text-slate-700 truncate" title={email}>{email}</p>
                      </div>
                    ))}
                    <div className="p-4 bg-white/60 rounded-2xl border border-slate-100 relative group hover:bg-white transition-colors">
                      <span className="absolute top-4 right-4 text-[8px] font-black text-emerald-600 uppercase">WhatsApp</span>
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Telefone</p>
                      <p className="text-sm font-bold text-slate-700">{selectedClient.phone}</p>
                    </div>
                    {selectedClient.additionalPhones?.map((phone, idx) => (
                      <div key={`phone-${idx}`} className="p-4 bg-white/60 rounded-2xl border border-slate-100 relative group hover:bg-white transition-colors">
                        <span className="absolute top-4 right-4 text-[8px] font-black text-slate-400 uppercase">Secundário</span>
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Telefone {idx + 2}</p>
                        <p className="text-sm font-bold text-slate-700">{phone}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* WhatsApp Chat History */}
                <section className="space-y-4">
                  <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest border-b border-slate-100/50 pb-2 flex items-center gap-2">
                    <MessageSquare size={14} /> Histórico WhatsApp
                  </h4>
                  {clientChat ? (
                    <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-2xl p-4">
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Última Mensagem</p>
                        <span className="text-[9px] text-emerald-600/60 font-mono">{new Date(clientChat.updatedAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-emerald-900 font-medium italic line-clamp-2">"{clientChat.lastMessage}"</p>
                      <button 
                        className="mt-4 w-full py-2 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-colors"
                        onClick={() => window.open(`https://wa.me/${selectedClient.phone.replace(/\D/g, '')}`, '_blank')}
                      >
                        Continuar Conversa
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50 text-center">
                      <p className="text-[10px] font-black text-slate-400 uppercase">Nenhum histórico encontrado</p>
                      <button 
                        className="mt-2 px-4 py-2 bg-white text-emerald-600 border border-emerald-100 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-50 transition-colors"
                        onClick={() => window.open(`https://wa.me/${selectedClient.phone.replace(/\D/g, '')}`, '_blank')}
                      >
                        Iniciar Conversa
                      </button>
                    </div>
                  )}
                </section>

                {/* Inventário (Ativos) */}
                <section className="space-y-4">
                  <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest border-b border-slate-100/50 pb-2 flex items-center gap-2">
                    <Package size={14} /> Mapa de Equipamentos
                  </h4>
                  {linkedAssets.length > 0 ? (
                    <div className="space-y-2">
                      {linkedAssets.slice(0, 4).map((asset) => {
                        const risk = predictiveService.calculateRiskScore(asset);
                        return (
                          <div key={asset.id} className="p-4 bg-white/60 rounded-2xl border border-slate-100 flex justify-between items-center hover:bg-white transition-colors">
                            <div>
                              <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{asset.brand} • {asset.model}</p>
                              <p className="text-[9px] text-slate-400 font-mono">SN: {asset.serialNumber}</p>
                            </div>
                            {risk.severity === 'critical' ? (
                              <div className="p-2 bg-rose-50 text-rose-600 rounded-xl" title="Manutenção Atrasada"><ShieldAlert size={16} /></div>
                            ) : risk.severity === 'warning' ? (
                              <div className="p-2 bg-amber-50 text-amber-600 rounded-xl" title="Manutenção Próxima"><AlertCircle size={16} /></div>
                            ) : (
                              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl" title="Saudável"><ShieldCheck size={16} /></div>
                            )}
                          </div>
                        );
                      })}
                      {linkedAssets.length > 4 && (
                        <p className="text-[9px] font-bold text-slate-400 uppercase text-center pt-2">+{linkedAssets.length - 4} ativos adicionais</p>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100/50 text-center">
                      <p className="text-[10px] font-black text-amber-700 uppercase">Nenhum ativo vinculado</p>
                    </div>
                  )}
                </section>

                {/* Google Drive Files */}
                <section className="space-y-4">
                  <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest border-b border-slate-100/50 pb-2 flex items-center gap-2">
                    <Folder size={14} /> Documentos (Drive)
                  </h4>
                  {clientFiles.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {clientFiles.slice(0, 4).map((file) => (
                        <a 
                          key={file.id} 
                          href={file.webViewLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-3 bg-white/60 rounded-xl border border-slate-100 flex items-center gap-2 hover:bg-blue-50 hover:border-blue-100 transition-colors group"
                        >
                          <FileText size={14} className="text-blue-400 group-hover:text-blue-600" />
                          <span className="text-[9px] font-bold text-slate-600 truncate">{file.name}</span>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50 text-center">
                      <p className="text-[10px] font-black text-slate-400 uppercase">Nenhum documento encontrado</p>
                    </div>
                  )}
                </section>
              </div>

              <div className="p-8 border-t border-slate-100/50 bg-white/50 flex gap-3 backdrop-blur-md">
                <button onClick={() => handleDeleteClient(selectedClient.id)} className="flex-1 py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase text-slate-400 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors">Excluir</button>
                <button onClick={() => openEditClient(selectedClient)} className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-colors">Editar Cliente</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClientsView;
