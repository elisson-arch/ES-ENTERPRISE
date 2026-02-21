
import React, { useState, useMemo, useEffect } from 'react';
import {
  Plus,
  Search,
  Settings2,
  Calendar,
  History,
  Wind,
  Layers,
  Factory,
  Snowflake,
  MonitorSmartphone,
  ChevronRight,
  Zap,
  CheckCircle2,
  Fan,
  Smartphone,
  ArrowRight
} from 'lucide-react';
import type { Asset } from '../types';

import { inventoryService } from '../services/inventoryService';

const getAssetUI = (type: string) => {
  const t = type?.toLowerCase() || '';
  if (t.includes('split') || t.includes('wall') || t.includes('wind')) {
    return { id: 'Split', icon: Wind, color: 'bg-blue-600', shadow: 'shadow-blue-200/50', bgLight: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', label: 'Split System' };
  }
  if (t.includes('cassete') || t.includes('cassette') || t.includes('layers') || t.includes('k7')) {
    return { id: 'Cassete', icon: Layers, color: 'bg-purple-600', shadow: 'shadow-purple-200/50', bgLight: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100', label: 'Cassete' };
  }
  if (t.includes('industrial') || t.includes('chiller') || t.includes('factory') || t.includes('hvac')) {
    return { id: 'Industrial', icon: Factory, color: 'bg-indigo-600', shadow: 'shadow-indigo-200/50', bgLight: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100', label: 'Industrial' };
  }
  return { id: 'Outros', icon: Snowflake, color: 'bg-slate-700', shadow: 'shadow-slate-200/50', bgLight: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-100', label: 'Equipamento' };
};

const CATEGORIES = [
  { id: 'Todos', label: 'Todos', icon: CheckCircle2, color: 'bg-slate-900' },
  { id: 'Split', label: 'Split', icon: Wind, color: 'bg-blue-600' },
  { id: 'Cassete', label: 'Cassete', icon: Layers, color: 'bg-purple-600' },
  { id: 'Industrial', label: 'Industrial', icon: Factory, color: 'bg-indigo-600' },
  { id: 'Outros', label: 'Outros', icon: Snowflake, color: 'bg-slate-600' }
];

const AssetCardMobile = ({ asset, ui }: { asset: Asset, ui: any }) => {
  const Icon = ui.icon;
  return (
    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm active:scale-[0.98] transition-all group">
      <div className="flex items-center gap-5 mb-6">
        <div className={`w-14 h-14 rounded-2xl ${ui.color} ${ui.shadow} flex items-center justify-center text-white shrink-0 shadow-lg`}>
          <Icon size={28} />
        </div>
        <div className="min-w-0">
          <p className="text-lg font-black text-slate-800 uppercase tracking-tighter italic leading-none">{asset.brand}</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate">{asset.type}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
          <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Status</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-black text-emerald-600 uppercase">Operacional</span>
          </div>
        </div>
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
          <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Nº Série</p>
          <p className="text-[10px] font-black text-slate-700 font-mono truncate">{asset.serialNumber}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
        <div className="flex items-center gap-2 text-slate-400">
          <History size={14} />
          <span className="text-[9px] font-bold uppercase">Prev: {asset.lastMaintenance}</span>
        </div>
        <button className="p-3 bg-slate-900 text-white rounded-xl shadow-lg">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

const InventoryView = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  useEffect(() => {
    const unsubscribe = inventoryService.subscribeToAssets('org_123', (data) => {
      setAssets(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredAssets = useMemo(() => {
    return assets.filter(a => {
      const ui = getAssetUI(a.type);
      const matchesSearch = a.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Todos' || ui.id === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [assets, searchTerm, selectedCategory]);

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-700 pb-24 md:pb-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2 md:px-0">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 italic tracking-tighter uppercase leading-none">Gestão de Ativos</h2>
          <div className="flex items-center gap-2 text-slate-500 text-sm font-bold mt-2">
            <MonitorSmartphone size={16} className="text-blue-500" />
            <span className="uppercase tracking-widest text-[9px] md:text-[10px]">Agilidade Cross-Platform v5.5</span>
          </div>
        </div>
        <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl md:rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95 w-full md:w-auto">
          <Plus size={18} />
          Cadastrar Novo Ativo
        </button>
      </header>

      <div className="bg-white p-4 md:p-6 rounded-3xl md:rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4 md:space-y-6">
        <div className="relative w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
          <input
            type="text"
            placeholder="Pesquisar em campo..."
            className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl md:rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all text-sm font-bold text-slate-700 shadow-inner"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-2 px-2 md:mx-0 md:px-0">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all border whitespace-nowrap ${selectedCategory === cat.id
                ? `${cat.color} text-white border-transparent shadow-lg scale-105`
                : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
                }`}
            >
              <cat.icon size={14} className={selectedCategory === cat.id ? 'animate-pulse' : ''} />
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* View Híbrida: Mobile (Cards) vs Desktop (Tabela) */}
      <div className="block lg:hidden space-y-4">
        {filteredAssets.length > 0 ? filteredAssets.map(asset => (
          <AssetCardMobile key={asset.id} asset={asset} ui={getAssetUI(asset.type)} />
        )) : (
          <div className="bg-white p-12 rounded-[2.5rem] text-center opacity-30">
            <Search size={40} className="mx-auto mb-4" />
            <p className="text-[10px] font-black uppercase tracking-widest">Nenhum ativo na lista.</p>
          </div>
        )}
      </div>

      <div className="hidden lg:block bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left min-w-[950px]">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Equipamento</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Série / Modelo</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status Vital</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cronograma</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredAssets.length > 0 ? filteredAssets.map(asset => {
              const ui = getAssetUI(asset.type);
              const AssetIcon = ui.icon;
              return (
                <tr key={asset.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-6">
                      <div className={`w-16 h-16 rounded-[1.5rem] ${ui.color} ${ui.shadow} flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform duration-500`}>
                        <AssetIcon size={32} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-base font-black text-slate-800 uppercase tracking-tighter italic leading-none">{asset.brand}</p>
                          <span className={`px-2 py-0.5 ${ui.bgLight} ${ui.text} border ${ui.border} rounded-lg text-[8px] font-black uppercase tracking-widest`}>
                            {ui.label}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest truncate">{asset.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-xl w-fit border border-slate-200">
                        <span className="text-[9px] font-black text-slate-400 uppercase">SN</span>
                        <p className="text-xs font-black text-slate-700 font-mono tracking-tight">{asset.serialNumber}</p>
                      </div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight ml-1">{asset.model}</p>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.6)]"></span>
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                          Operacional
                        </span>
                      </div>
                      <div className="flex items-center gap-1 opacity-40">
                        <Fan size={10} className="animate-spin duration-[3000ms]" />
                        <span className="text-[8px] font-black uppercase tracking-tighter">Eficiência 98%</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold">
                        <div className="p-1 bg-blue-50 text-blue-500 rounded-md"><Calendar size={12} /></div>
                        <span className="text-slate-400 uppercase tracking-tighter">Instalado:</span> <span className="text-slate-700 italic">{asset.installationDate}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold">
                        <div className="p-1 bg-amber-50 text-amber-500 rounded-md"><History size={12} /></div>
                        <span className="text-slate-400 uppercase tracking-tighter">Prox. Maint:</span> <span className="text-slate-700 italic">{asset.lastMaintenance}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button className="p-3 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all" title="Configurar"><Settings2 size={20} /></button>
                      <button className="p-3 bg-slate-900 text-white rounded-2xl hover:bg-black shadow-lg transition-all" title="Ver Histórico"><ChevronRight size={20} /></button>
                    </div>
                  </td>
                </tr>
              );
            }) : null}
          </tbody>
        </table>
      </div>

      <div className="bg-slate-900 p-8 md:p-10 rounded-3xl md:rounded-[3rem] text-white flex flex-col xl:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden group border border-white/5">
        <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:rotate-12 group-hover:scale-150 transition-transform duration-1000">
          <Zap size={200} fill="currentColor" />
        </div>
        <div className="space-y-3 relative z-10 text-center xl:text-left">
          <h3 className="text-2xl font-black italic uppercase tracking-tight flex flex-col md:flex-row items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-xl shadow-blue-500/20">
              <Zap size={24} className="text-amber-400" fill="currentColor" />
            </div>
            Ricardo IA: Insights de Agilidade
          </h3>
          <p className="text-slate-400 text-xs md:text-sm font-medium max-w-xl leading-relaxed uppercase tracking-wide">
            Detectamos que você está acessando via dispositivo móvel. Os laudos técnicos foram otimizados para preenchimento via voz e captura de fotos em tempo real.
          </p>
        </div>
        <button className="w-full xl:w-auto px-12 py-6 bg-blue-600 text-white rounded-2xl md:rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-blue-500 active:scale-95 transition-all whitespace-nowrap relative z-10 flex items-center justify-center gap-3">
          <Smartphone size={18} /> Iniciar Vistoria Mobile <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default InventoryView;
