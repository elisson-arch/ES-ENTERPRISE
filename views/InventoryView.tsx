
import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Settings2,
  Calendar,
  History,
  AlertCircle,
  Wind,
  Layers,
  Factory,
  Snowflake,
  MonitorSmartphone,
  ChevronRight,
  Zap,
  CheckCircle2,
  Fan
} from 'lucide-react';
import type { Asset } from '../types';

const mockAssets: Asset[] = [
  {
    id: 'a1',
    clientId: '1',
    type: 'Split Hi-Wall Inverter 12k BTU',
    brand: 'Daikin',
    model: 'FTKC12',
    serialNumber: 'DKN-2024-X102',
    installationDate: '12/01/2024',
    lastMaintenance: '15/05/2024'
  },
  {
    id: 'a2',
    clientId: '1',
    type: 'Cassette 360 Inverter',
    brand: 'LG',
    model: 'Multi V S',
    serialNumber: 'LG-MX-5541',
    installationDate: '05/02/2024',
    lastMaintenance: '20/05/2024'
  },
  {
    id: 'a3',
    clientId: '2',
    type: 'Chiller Central Parafuso',
    brand: 'Carrier',
    model: '30XW',
    serialNumber: 'CRR-9981-P',
    installationDate: '15/03/2023',
    lastMaintenance: '10/01/2024'
  },
  {
    id: 'a4',
    clientId: '3',
    type: 'Multi Split 3 ambientes',
    brand: 'Midea',
    model: 'X-Power',
    serialNumber: 'MID-1122',
    installationDate: '10/06/2023',
    lastMaintenance: '01/04/2024'
  }
];

const getAssetUI = (type: string) => {
  const t = type.toLowerCase();
  
  if (t.includes('split') || t.includes('wall') || t.includes('piso-teto')) {
    return { 
      id: 'Split',
      icon: Wind, 
      color: 'bg-blue-600', 
      bgLight: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-100', 
      label: 'Split System' 
    };
  }
  
  if (t.includes('cassete') || t.includes('cassette') || t.includes('k7')) {
    return { 
      id: 'Cassete',
      icon: Layers, 
      color: 'bg-purple-600', 
      bgLight: 'bg-purple-50',
      text: 'text-purple-600',
      border: 'border-purple-100', 
      label: 'Cassete' 
    };
  }
  
  if (t.includes('industrial') || t.includes('chiller') || t.includes('fancoil') || t.includes('self')) {
    return { 
      id: 'Industrial',
      icon: Factory, 
      color: 'bg-indigo-600', 
      bgLight: 'bg-indigo-50',
      text: 'text-indigo-600',
      border: 'border-indigo-100', 
      label: 'Industrial/HVAC' 
    };
  }
  
  return { 
    id: 'Outros',
    icon: Snowflake, 
    color: 'bg-slate-700', 
    bgLight: 'bg-slate-50',
    text: 'text-slate-600',
    border: 'border-slate-100', 
    label: 'Equipamento' 
  };
};

const CATEGORIES = [
  { id: 'Todos', label: 'Todos', icon: CheckCircle2, color: 'bg-slate-900', activeColor: 'bg-slate-900' },
  { id: 'Split', label: 'Split/Wall', icon: Wind, color: 'bg-blue-600', activeColor: 'bg-blue-600' },
  { id: 'Cassete', label: 'Cassete/K7', icon: Layers, color: 'bg-purple-600', activeColor: 'bg-purple-600' },
  { id: 'Industrial', label: 'Industrial/HVAC', icon: Factory, color: 'bg-indigo-600', activeColor: 'bg-indigo-600' },
  { id: 'Outros', label: 'Outros', icon: Snowflake, color: 'bg-slate-600', activeColor: 'bg-slate-600' }
];

const InventoryView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const filteredAssets = useMemo(() => {
    return mockAssets.filter(a => {
      const ui = getAssetUI(a.type);
      const matchesSearch = a.brand.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           a.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           a.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'Todos' || ui.id === selectedCategory;
                             
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-800 italic tracking-tighter uppercase leading-none">Ativos & Equipamentos</h2>
          <div className="flex items-center gap-2 text-slate-500 text-sm font-bold mt-2">
            <MonitorSmartphone size={16} className="text-blue-500" />
            <span className="uppercase tracking-widest text-[10px]">Gestão Técnica Enterprise v5.2</span>
          </div>
        </div>
        <button className="bg-blue-600 text-white px-8 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95">
          <Plus size={18} />
          Cadastrar Novo Ativo
        </button>
      </header>

      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
        <div className="relative w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
          <input 
            type="text" 
            placeholder="Pesquisar por marca, modelo, serial ou tipo..."
            className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all text-sm font-bold text-slate-700 shadow-inner"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                selectedCategory === cat.id 
                ? `${cat.activeColor} text-white border-transparent shadow-lg scale-105` 
                : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
              }`}
            >
              <cat.icon size={14} className={selectedCategory === cat.id ? 'animate-pulse' : ''} />
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left min-w-[950px]">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identificação do Ativo</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Série / Modelo</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado Vital</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cronograma</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Controles</th>
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
                      <div className={`w-16 h-16 rounded-[1.5rem] ${ui.color} shadow-xl shadow-indigo-100/20 flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform duration-500`}>
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
                            Em Operação
                          </span>
                       </div>
                       <div className="flex items-center gap-1 opacity-40">
                          <Fan size={10} className="animate-spin duration-3000" />
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
                      <button className="p-3 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all" title="Configurar Ativo"><Settings2 size={20} /></button>
                      <button className="p-3 bg-slate-900 text-white rounded-2xl hover:bg-black shadow-lg transition-all" title="Ver Histórico Técnico"><ChevronRight size={20} /></button>
                    </div>
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center">
                  <div className="max-w-xs mx-auto space-y-4 opacity-30">
                    <Search size={48} className="mx-auto text-slate-300" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Nenhum equipamento localizado na base de dados.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="bg-slate-900 p-10 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden group border border-white/5">
         <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:rotate-12 group-hover:scale-150 transition-transform duration-1000">
            <Zap size={200} fill="currentColor" />
         </div>
         <div className="space-y-3 relative z-10">
            <h3 className="text-2xl font-black italic uppercase tracking-tight flex items-center gap-4">
              <div className="p-3 bg-blue-600 rounded-2xl shadow-xl shadow-blue-500/20">
                <Zap size={24} className="text-amber-400" fill="currentColor" />
              </div>
              Ricardo IA: Insights Preditivos
            </h3>
            <p className="text-slate-400 text-sm font-medium max-w-xl leading-relaxed uppercase tracking-wide">
              Análise Neural indica que equipamentos industriais de carga contínua estão com desgaste 12% acima da média sazonal. Deseja antecipar as preventivas de Q3?
            </p>
         </div>
         <button className="px-12 py-6 bg-blue-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-blue-500 active:scale-95 transition-all whitespace-nowrap relative z-10">
            Gerar Ordens de Serviço
         </button>
      </div>
    </div>
  );
};

export default InventoryView;
