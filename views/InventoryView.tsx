
import React, { useState } from 'react';
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
  Zap
} from 'lucide-react';
import type { Asset } from '../types';

const mockAssets: Asset[] = [
  {
    id: 'a1',
    clientId: '1',
    type: 'Split Hi-Wall Inverter',
    brand: 'Daikin',
    model: 'FTKC12',
    serialNumber: 'DKN-2024-X102',
    installationDate: '12/01/2024',
    lastMaintenance: '15/05/2024'
  },
  {
    id: 'a2',
    clientId: '1',
    type: 'Cassette 360',
    brand: 'LG',
    model: 'Multi V S',
    serialNumber: 'LG-MX-5541',
    installationDate: '05/02/2024',
    lastMaintenance: '20/05/2024'
  },
  {
    id: 'a3',
    clientId: '2',
    type: 'Refrigeração Industrial Chiller',
    brand: 'Carrier',
    model: '30XW',
    serialNumber: 'CRR-9981-P',
    installationDate: '15/03/2023',
    lastMaintenance: '10/01/2024'
  },
  {
    id: 'a4',
    clientId: '3',
    type: 'Equipamento Geral',
    brand: 'Midea',
    model: 'X-Power',
    serialNumber: 'MID-1122',
    installationDate: '10/06/2023',
    lastMaintenance: '01/04/2024'
  }
];

const getAssetUI = (type: string) => {
  const t = type.toLowerCase();
  if (t.includes('split')) return { icon: Wind, color: 'bg-blue-500/10 text-blue-500', border: 'border-blue-500/20', label: 'Split/Ar' };
  if (t.includes('cassete') || t.includes('cassette')) return { icon: Layers, color: 'bg-purple-500/10 text-purple-500', border: 'border-purple-500/20', label: 'Cassete' };
  if (t.includes('industrial') || t.includes('chiller')) return { icon: Factory, color: 'bg-indigo-500/10 text-indigo-500', border: 'border-indigo-500/20', label: 'Industrial' };
  return { icon: Snowflake, color: 'bg-slate-500/10 text-slate-400', border: 'border-slate-500/20', label: 'Equipamento' };
};

const InventoryView = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-800 italic tracking-tighter uppercase leading-none">Ativos & Equipamentos</h2>
          <div className="flex items-center gap-2 text-slate-500 text-sm font-bold mt-2">
            <MonitorSmartphone size={16} className="text-blue-500" />
            <span className="uppercase tracking-widest text-[10px]">Gestão de Inventário Enterprise v5.0</span>
          </div>
        </div>
        <button className="bg-blue-600 text-white px-8 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95">
          <Plus size={18} />
          Cadastrar Ativo
        </button>
      </header>

      <div className="bg-white p-4 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
          <input 
            type="text" 
            placeholder="Filtrar por marca, modelo, serial ou tipo..."
            className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all text-sm font-bold text-slate-700 shadow-inner"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center justify-center gap-3 px-8 py-4 bg-white border border-slate-200 rounded-[1.5rem] text-slate-500 hover:bg-slate-50 transition-all font-black text-[10px] uppercase tracking-widest">
          <Filter size={18} />
          Filtros de Categoria
        </button>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left min-w-[900px]">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ativo / Tipo</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identificação</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status Vital</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Manutenção</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mockAssets.filter(a => 
              a.brand.toLowerCase().includes(searchTerm.toLowerCase()) || 
              a.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
              a.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
            ).map(asset => {
              const ui = getAssetUI(asset.type);
              const AssetIcon = ui.icon;

              return (
                <tr key={asset.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-5">
                      <div className={`p-4 rounded-2xl ${ui.color} border ${ui.border} shadow-sm group-hover:scale-110 transition-transform flex items-center justify-center`}>
                        <AssetIcon size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-800 uppercase tracking-tighter italic">{asset.brand}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{ui.label}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="space-y-1">
                      <p className="text-xs font-black text-slate-700 font-mono bg-slate-100 px-2 py-1 rounded-lg w-fit border border-slate-200">{asset.serialNumber}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{asset.model}</p>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                       <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                       <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase rounded-full border border-emerald-100">
                         Operacional
                       </span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold">
                        <Calendar size={12} className="text-blue-500" />
                        <span className="text-slate-400">Inst:</span> {asset.installationDate}
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold">
                        <History size={12} className="text-indigo-500" />
                        <span className="text-slate-400">Prox:</span> {asset.lastMaintenance}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all" title="Configurações"><Settings2 size={18} /></button>
                      <button className="p-3 bg-white border border-slate-200 text-indigo-600 rounded-xl hover:bg-indigo-50 shadow-sm transition-all" title="Ver Histórico"><ChevronRight size={18} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="bg-slate-900 p-8 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden group border border-white/5">
         <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:rotate-12 transition-transform duration-1000">
            <Zap size={150} fill="currentColor" />
         </div>
         <div className="space-y-2 relative z-10">
            <h3 className="text-xl font-black italic uppercase tracking-tight flex items-center gap-3">
              <Zap size={20} className="text-amber-400" fill="currentColor" />
              Diagnóstico Preditivo Ricardo IA
            </h3>
            <p className="text-slate-400 text-sm font-medium max-w-md">Detectamos que 2 ativos do tipo Cassete estão operando com 15% acima da carga térmica nominal. Deseja abrir uma preventiva?</p>
         </div>
         <button className="px-10 py-5 bg-blue-600 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-blue-500 transition-all whitespace-nowrap relative z-10">
            Abrir Ordem de Serviço
         </button>
      </div>
    </div>
  );
};

export default InventoryView;
