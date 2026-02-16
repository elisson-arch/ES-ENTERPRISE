
import React, { useState, useEffect } from 'react';
import { Search, X, Clock, User, MessageSquare, FileText, ChevronRight } from 'lucide-react';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const history = ['Condomínio Aurora', 'Orçamento #002', 'Limpeza AC'];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        // Trigger externally if needed
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-20 p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={onClose} />
      
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b flex items-center gap-4">
          <Search className="text-blue-600" size={24} />
          <input 
            autoFocus
            type="text" 
            placeholder="Pesquisar clientes, ativos, orçamentos ou conversas..." 
            className="flex-1 bg-transparent text-lg font-medium outline-none text-slate-800"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {query === '' ? (
            <div className="space-y-6">
              <div>
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-4 mb-2">Buscas Recentes</h4>
                {history.map(item => (
                  <button key={item} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-2xl transition-all text-sm font-bold text-slate-600">
                    <Clock size={16} className="text-slate-300" /> {item}
                  </button>
                ))}
              </div>
              <div>
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-4 mb-2">Sugestões Rápidas</h4>
                <div className="grid grid-cols-2 gap-2 px-2">
                  <div className="p-4 border border-slate-100 rounded-2xl flex items-center gap-3 hover:border-blue-200 hover:bg-blue-50/30 cursor-pointer transition-all">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-xl"><User size={18} /></div>
                    <span className="text-xs font-bold">Novo Cliente</span>
                  </div>
                  <div className="p-4 border border-slate-100 rounded-2xl flex items-center gap-3 hover:border-emerald-200 hover:bg-emerald-50/30 cursor-pointer transition-all">
                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl"><FileText size={18} /></div>
                    <span className="text-xs font-bold">Gerar Orçamento</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="px-4 py-2 text-[10px] font-black uppercase text-slate-400">Resultados para "{query}"</div>
              <button className="w-full flex items-center justify-between px-4 py-4 hover:bg-blue-50 rounded-2xl group transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white border border-slate-100 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white shadow-sm transition-all"><MessageSquare size={20} /></div>
                  <div className="text-left">
                    <p className="text-sm font-black text-slate-800">Conversa com Condomínio Aurora</p>
                    <p className="text-xs text-slate-500 font-medium">Última mensagem: "Aguardando orçamento..."</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-slate-300" />
              </button>
            </div>
          )}
        </div>
        
        <div className="p-4 bg-slate-50 border-t flex justify-between items-center">
          <div className="flex gap-4">
            <span className="text-[9px] font-black uppercase text-slate-400 flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-white border rounded shadow-sm font-mono">↑↓</kbd> Navegar</span>
            <span className="text-[9px] font-black uppercase text-slate-400 flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-white border rounded shadow-sm font-mono">Enter</kbd> Selecionar</span>
          </div>
          <span className="text-[9px] font-black uppercase text-slate-400">SGC Search v2.0</span>
        </div>
      </div>
    </div>
  );
};
