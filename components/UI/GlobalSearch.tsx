import React, { useState, useEffect } from 'react';
import { 
  Search, 
  X, 
  Clock, 
  User, 
  MessageSquare, 
  FileText, 
  ChevronRight, 
  Database, 
  Cloud,
  FileSearch,
  Sparkles,
  // Fix: Correctly import Loader2 to fix name error
  Loader2
} from 'lucide-react';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const history = ['Condomínio Aurora', 'Orçamento #002', 'Limpeza AC'];
  const [driveResults, setDriveResults] = useState<any[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (query.length > 2) {
      setIsScanning(true);
      const timer = setTimeout(() => {
        setDriveResults([
          { id: 'd1', name: `Contrato_${query}_Enterprise.pdf`, size: '2.4 MB', date: 'Hoje' },
          { id: 'd2', name: `Manual_Tecnico_${query}.docx`, size: '850 KB', date: 'Ontem' }
        ]);
        setIsScanning(false);
      }, 600);
      return () => clearTimeout(timer);
    } else {
      setDriveResults([]);
    }
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-20 p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in" onClick={onClose} />
      
      <div className="bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100 flex flex-col max-h-[80vh]">
        <div className="p-8 border-b flex items-center gap-6 bg-slate-50/50">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-100">
            <Search size={28} strokeWidth={2.5} />
          </div>
          <input 
            autoFocus
            type="text" 
            placeholder="Pesquisar clientes, ativos ou varrer documentos no Google Cloud..." 
            className="flex-1 bg-transparent text-xl font-black italic tracking-tighter outline-none text-slate-800 uppercase placeholder:text-slate-300"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-10">
          {query === '' ? (
            <div className="space-y-10">
              <div>
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] px-4 mb-4 flex items-center gap-2">
                  <Clock size={14}/> Histórico Recente
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {history.map(item => (
                    <button key={item} className="w-full flex items-center gap-4 px-6 py-4 hover:bg-slate-50 rounded-2xl transition-all text-xs font-black text-slate-600 border border-transparent hover:border-slate-100 group">
                      <Clock size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors" /> {item}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] px-4 mb-4">Acesso Rápido</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-2">
                  <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-[2rem] flex flex-col items-center gap-3 hover:scale-105 transition-all cursor-pointer group shadow-sm hover:shadow-md">
                    <div className="p-3 bg-white rounded-2xl text-blue-600 shadow-sm group-hover:rotate-12 transition-transform"><User size={24} /></div>
                    <span className="text-[9px] font-black uppercase text-blue-800 tracking-widest">Novo Cliente</span>
                  </div>
                  <div className="p-6 bg-emerald-50/50 border border-emerald-100 rounded-[2rem] flex flex-col items-center gap-3 hover:scale-105 transition-all cursor-pointer group shadow-sm hover:shadow-md">
                    <div className="p-3 bg-white rounded-2xl text-emerald-600 shadow-sm group-hover:rotate-12 transition-transform"><FileText size={24} /></div>
                    <span className="text-[9px] font-black uppercase text-emerald-800 tracking-widest">Orçamento</span>
                  </div>
                  <div className="p-6 bg-indigo-50/50 border border-indigo-100 rounded-[2rem] flex flex-col items-center gap-3 hover:scale-105 transition-all cursor-pointer group shadow-sm hover:shadow-md">
                    <div className="p-3 bg-white rounded-2xl text-indigo-600 shadow-sm group-hover:rotate-12 transition-transform"><Cloud size={24} /></div>
                    <span className="text-[9px] font-black uppercase text-indigo-800 tracking-widest">Arquivos Cloud</span>
                  </div>
                  <div className="p-6 bg-slate-50/50 border border-slate-100 rounded-[2rem] flex flex-col items-center gap-3 hover:scale-105 transition-all cursor-pointer group shadow-sm hover:shadow-md">
                    <div className="p-3 bg-white rounded-2xl text-slate-600 shadow-sm group-hover:rotate-12 transition-transform"><MessageSquare size={24} /></div>
                    <span className="text-[9px] font-black uppercase text-slate-800 tracking-widest">WhatsApp</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-12">
              <section>
                 <div className="flex justify-between items-center mb-6 px-2">
                    <h4 className="text-[10px] font-black uppercase text-indigo-600 tracking-[0.2em] flex items-center gap-2">
                       <Database size={14}/> CRM SGC Results
                    </h4>
                    <span className="text-[10px] font-bold text-slate-300">12 encontrados</span>
                 </div>
                 <div className="space-y-2">
                    <button className="w-full flex items-center justify-between p-5 hover:bg-slate-50 rounded-[2rem] group transition-all border border-transparent hover:border-slate-100">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white shadow-sm transition-all"><User size={24} /></div>
                        <div className="text-left">
                          <p className="text-sm font-black text-slate-800 uppercase italic tracking-tighter leading-none mb-1">{query} Service Group</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic leading-none">Cliente Corporativo • São Paulo, SP</p>
                        </div>
                      </div>
                      <ChevronRight size={20} className="text-slate-200 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </button>
                 </div>
              </section>

              <section>
                 <div className="flex justify-between items-center mb-6 px-2">
                    <h4 className="text-[10px] font-black uppercase text-blue-500 tracking-[0.2em] flex items-center gap-2">
                       <Cloud size={14}/> Arquivos Google Cloud Drive
                    </h4>
                    {isScanning && <Loader2 size={14} className="animate-spin text-blue-400" />}
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {driveResults.length > 0 ? driveResults.map(file => (
                      <div key={file.id} className="p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-xl hover:border-blue-200 transition-all cursor-pointer">
                         <div className="flex items-center gap-4">
                            <div className="p-3 bg-white rounded-xl text-rose-500 shadow-sm"><FileText size={20}/></div>
                            <div className="text-left min-w-0">
                               <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight truncate w-full">{file.name}</p>
                               <p className="text-[9px] text-slate-400 font-bold uppercase">{file.size} • {file.date}</p>
                            </div>
                         </div>
                         <div className="p-2 bg-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><FileSearch size={16} className="text-blue-500"/></div>
                      </div>
                    )) : (
                      <div className="col-span-2 py-10 text-center opacity-30">
                         <FileSearch size={32} className="mx-auto mb-2"/>
                         <p className="text-[9px] font-black uppercase tracking-widest">Nenhum documento detectado</p>
                      </div>
                    )}
                 </div>
              </section>
            </div>
          )}
        </div>
        
        <div className="p-6 bg-slate-900 border-t border-white/5 flex justify-between items-center">
          <div className="flex gap-6">
            <span className="text-[8px] font-black uppercase text-slate-500 flex items-center gap-2"><kbd className="px-1.5 py-0.5 bg-white/10 border border-white/10 rounded shadow-sm font-mono text-white">↑↓</kbd> Navegar</span>
            <span className="text-[8px] font-black uppercase text-slate-500 flex items-center gap-2"><kbd className="px-1.5 py-0.5 bg-white/10 border border-white/10 rounded shadow-sm font-mono text-white">Esc</kbd> Fechar</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles size={12} className="text-amber-400 animate-pulse" />
            <span className="text-[9px] font-black uppercase text-white/40 tracking-widest italic">Neural Scan Enabled</span>
          </div>
        </div>
      </div>
    </div>
  );
};