import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Bot, 
  Terminal, 
  Zap, 
  Command, 
  Hash, 
  FileText, 
  Users, 
  ArrowRight,
  Sparkles,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiService } from '@ai';

interface CommandResult {
  id: string;
  type: 'file' | 'client' | 'asset' | 'ai';
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

const RicardoCommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<CommandResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const handleSearch = async (val: string) => {
    setQuery(val);
    if (val.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    // Simulating quick local results + AI potential
    try {
      // In a real scenario, we would search locally first
      const mockResults: CommandResult[] = [
        { id: '1', type: 'ai' as const, title: 'Perguntar ao Ricardo IA', subtitle: `"${val}"`, icon: <Sparkles size={16} className="text-indigo-400" /> },
        { id: '2', type: 'client' as const, title: 'Clínica São João', subtitle: 'Ativo • 12 equipamentos', icon: <Users size={16} className="text-slate-400" /> },
        { id: '3', type: 'file' as const, title: 'Manual_Daikin_Compressor.pdf', subtitle: 'Documento Técnico', icon: <FileText size={16} className="text-slate-400" /> },
      ].filter(r => r.title.toLowerCase().includes(val.toLowerCase()) || r.type === 'ai') as CommandResult[];

      setResults(mockResults);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (result: CommandResult) => {
    if (result.type === 'ai') {
      setIsLoading(true);
      try {
        const response = await aiService.chat(query, {
           systemPrompt: "Você é o Ricardo IA. Responda de forma curta e técnica para o Command Palette."
        });
        alert(`Ricardo IA diz: ${response}`);
      } finally {
        setIsLoading(false);
        setIsOpen(false);
      }
    } else {
      console.log('Navegando para:', result.title);
      setIsOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            {/* Input Area */}
            <div className="flex items-center gap-4 px-8 py-6 border-b border-white/5">
              <div className="text-indigo-400 animate-pulse">
                <Command size={24} />
              </div>
              <input
                ref={inputRef}
                type="text"
                placeholder="Pergunte ao Ricardo ou pesquise no sistema..."
                className="flex-1 bg-transparent border-none outline-none text-white text-lg font-bold placeholder:text-slate-500"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
              />
              <div className="flex items-center gap-2">
                 {isLoading ? (
                   <Loader2 size={18} className="text-indigo-400 animate-spin" />
                 ) : (
                   <div className="px-3 py-1 bg-slate-800 rounded-lg text-[10px] font-black text-slate-400 border border-white/5 shadow-inner">ESC</div>
                 )}
              </div>
            </div>

            {/* Results Area */}
            <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
              {results.length > 0 ? (
                <div className="space-y-2">
                  <p className="px-4 py-2 text-[9px] font-black text-slate-500 uppercase tracking-widest">Resultados Sugeridos</p>
                  {results.map((result, idx) => (
                    <button
                      key={result.id}
                      onClick={() => handleAction(result)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                        selectedIndex === idx ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/20' : 'text-slate-400 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2.5 rounded-xl ${selectedIndex === idx ? 'bg-white/20' : 'bg-slate-800 border border-white/5'}`}>
                           {result.icon}
                        </div>
                        <div className="text-left">
                          <p className={`text-sm font-black italic uppercase tracking-tighter ${selectedIndex === idx ? 'text-white' : 'text-slate-200'}`}>
                            {result.title}
                          </p>
                          <p className={`text-[10px] font-bold uppercase ${selectedIndex === idx ? 'text-indigo-100' : 'text-slate-500'}`}>
                            {result.subtitle}
                          </p>
                        </div>
                      </div>
                      {selectedIndex === idx && <ArrowRight size={18} className="animate-in slide-in-from-left-2" />}
                    </button>
                  ))}
                </div>
              ) : query.length > 1 ? (
                <div className="py-20 text-center space-y-4">
                   <Bot size={48} className="mx-auto text-slate-700" />
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nenhuma correspondência local encontrada.</p>
                   <button className="px-6 py-3 bg-indigo-600/10 text-indigo-400 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-indigo-600/20">Expandir Busca via Ricardo IA</button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 p-4">
                   <ShortcutCard icon={<Terminal size={18} />} title="Ir para IA" subtitle="Ctrl + G" />
                   <ShortcutCard icon={<Zap size={18} />} title="Novo Ativo" subtitle="Alt + N" />
                   <ShortcutCard icon={<Search size={18} />} title="Busca Global" subtitle="Cmd + F" />
                   <ShortcutCard icon={<Hash size={18} />} title="Docs Técnicos" subtitle="Cmd + D" />
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-8 py-4 bg-black/40 border-t border-white/5 flex items-center justify-between">
               <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                     <span className="p-1 px-2 bg-slate-800 rounded border border-white/5 text-slate-300">↑↓</span> Navegar
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                     <span className="p-1 px-2 bg-slate-800 rounded border border-white/5 text-slate-300">ENTER</span> Selecionar
                  </div>
               </div>
               <div className="flex items-center gap-2 text-indigo-400 font-black italic text-sm tracking-tighter opacity-50">
                  <Bot size={14} /> Ricardo Engine v3.1
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const ShortcutCard = ({ icon, title, subtitle }: { icon: React.ReactNode, title: string, subtitle: string }) => (
  <div className="p-6 bg-slate-800/50 border border-white/5 rounded-[2rem] flex flex-col items-center justify-center text-center hover:bg-indigo-600/20 hover:border-indigo-600/30 transition-all group cursor-pointer">
     <div className="p-3 bg-slate-800 rounded-xl text-slate-400 group-hover:text-indigo-400 mb-4 transition-colors">
        {icon}
     </div>
     <p className="text-xs font-black text-slate-200 uppercase mb-1 tracking-tighter italic">{title}</p>
     <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{subtitle}</p>
  </div>
);

export default RicardoCommandPalette;
