
import React from 'react';
import { Lightbulb, X, ChevronRight, Zap } from 'lucide-react';

interface HelpGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpGuide: React.FC<HelpGuideProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[900] w-80 bg-white rounded-[2.5rem] shadow-2xl border border-blue-100 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
      <div className="p-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-white/10 rounded-full">
          <X size={16} />
        </button>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-xl">
            <Zap size={20} className="fill-white" />
          </div>
          <h3 className="font-black uppercase text-xs tracking-widest">Guia de Início Rápido</h3>
        </div>
        <p className="text-xs font-medium opacity-90 leading-relaxed">
          Olá! Sou seu assistente de interface. Vamos aprender o básico?
        </p>
      </div>
      
      <div className="p-6 space-y-4">
        {[
          { title: 'Conecte seu WhatsApp', desc: 'Centralize conversas e use IA.', icon: '💬' },
          { title: 'Cadastre um Cliente', desc: 'Preencha dados para orçamentos.', icon: '👤' },
          { title: 'Configure sua Agenda', desc: 'Sincronize com Google Calendar.', icon: '📅' },
        ].map((step, i) => (
          <button key={i} className="w-full flex items-center gap-4 text-left p-2 hover:bg-slate-50 rounded-2xl transition-all group">
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-lg shadow-inner group-hover:bg-white transition-all">
              {step.icon}
            </div>
            <div className="flex-1">
              <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-tight">{step.title}</h4>
              <p className="text-[10px] text-slate-400 font-medium">{step.desc}</p>
            </div>
            <ChevronRight size={14} className="text-slate-300" />
          </button>
        ))}
      </div>

      <div className="px-6 pb-6">
        <button className="w-full py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-100">
          Iniciar Tour Completo
        </button>
      </div>
    </div>
  );
};
