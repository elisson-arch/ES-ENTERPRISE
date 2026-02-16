
import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Settings2,
  Calendar,
  History,
  AlertCircle
} from 'lucide-react';
import type { Asset } from '../types';

const mockAssets: Asset[] = [
  {
    id: 'a1',
    clientId: '1',
    type: 'Split Hi-Wall',
    brand: 'Daikin',
    model: 'FTKC12',
    serialNumber: 'DKN-2024-X102',
    installationDate: '12/01/2024',
    lastMaintenance: '15/05/2024'
  },
  {
    id: 'a2',
    clientId: '1',
    type: 'Cassette',
    brand: 'LG',
    model: 'Multi V S',
    serialNumber: 'LG-MX-5541',
    installationDate: '05/02/2024',
    lastMaintenance: '20/05/2024'
  },
  {
    id: 'a3',
    clientId: '2',
    type: 'Refrigeração Industrial',
    brand: 'Carrier',
    model: 'Chiller 30XW',
    serialNumber: 'CRR-9981-P',
    installationDate: '15/03/2023',
    lastMaintenance: '10/01/2024'
  }
];

const InventoryView = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Ativos & Equipamentos</h2>
          <p className="text-slate-500">Controle o parque de máquinas dos seus clientes.</p>
        </div>
        <button className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200">
          <Plus size={20} />
          Cadastrar Equipamento
        </button>
      </header>

      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Filtrar por marca, modelo, serial ou cliente..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors font-medium">
          <Filter size={18} />
          Tipo de Ativo
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left min-w-[800px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Equipamento</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Serial / Modelo</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Instalação</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Última Manut.</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mockAssets.filter(a => 
              a.brand.toLowerCase().includes(searchTerm.toLowerCase()) || 
              a.type.toLowerCase().includes(searchTerm.toLowerCase())
            ).map(asset => (
              <tr key={asset.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-bold text-slate-800">{asset.brand}</p>
                    <p className="text-xs text-slate-500">{asset.type}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-slate-700 font-mono">{asset.serialNumber}</p>
                    <p className="text-xs text-slate-400">{asset.model}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <Calendar size={14} />
                    {asset.installationDate}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <History size={14} />
                    {asset.lastMaintenance}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full border border-green-100">
                    Operante
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200" title="Configurações"><Settings2 size={16} /></button>
                    <button className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200" title="Histórico IA"><AlertCircle size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryView;
