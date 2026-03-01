
import React from 'react';
import { Sparkles, Send, Pencil, Trash2, X, Database } from 'lucide-react';

interface SuggestionBoxProps {
  suggestion: string;
  onSend: () => void;
  onEdit: () => void;
  onDiscard: () => void;
}

export const SuggestionBox: React.FC<SuggestionBoxProps> = ({ suggestion, onSend, onEdit, onDiscard }) => {
  if (!suggestion) return null;

  return (
    <div className="absolute bottom-full left-4 right-4 mb-4 animate-in slide-in-from-bottom-4 duration-300 z-50">
      <div className="bg-gradient-to-br from-indigo-700 to-indigo-900 rounded-[2rem] p-6 shadow-2xl shadow-indigo-300 border border-white/10 relative overflow-hidden group">
        <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
        
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-indigo-200">
              <Sparkles size={16} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">Ricardo IA: Sugestão Contextual</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <Database size={10} className="text-indigo-400" />
              <span className="text-[8px] font-bold text-indigo-400 uppercase tracking-tighter">Dados do CRM Integrados</span>
            </div>
          </div>
          <button onClick={onDiscard} className="p-1.5 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-all">
            <X size={16} />
          </button>
        </div>

        <div className="bg-white/5 rounded-2xl p-4 border border-white/5 mb-5 max-h-32 overflow-y-auto no-scrollbar">
          <p className="text-white text-sm font-medium leading-relaxed italic">
            "{suggestion}"
          </p>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={onSend}
            className="flex-1 bg-white text-indigo-900 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-50 transition-all shadow-xl active:scale-95"
          >
            <Send size={14} /> Aprovar e Enviar
          </button>
          <button 
            onClick={onEdit}
            className="px-5 bg-white/10 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/20 transition-all active:scale-95 border border-white/10"
          >
            <Pencil size={14} /> Editar
          </button>
          <button 
            onClick={onDiscard}
            className="p-3 bg-red-500/20 text-red-100 rounded-2xl hover:bg-red-500/40 transition-all"
            title="Descartar"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <div className="w-4 h-4 bg-indigo-700 rotate-45 absolute -bottom-2 left-10 -z-10"></div>
    </div>
  );
};
