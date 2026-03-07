
import React, { useState, useEffect } from 'react';
import { 
  Wand2, Rocket, Code, Eye, RefreshCw, Smartphone, Monitor, 
  Settings2, Database, Sparkles, Layout, Palette, ChevronLeft, 
  Terminal, Globe, Zap, MessageSquare, Mic, Loader2
} from 'lucide-react';
import { SiteDNA, SiteElement } from '@shared/types/common.types';
import { INITIAL_SITE_DATA } from '@whatsapp/services/mockTemplates';
import { WebsiteEngine } from '../components/WebsiteEngine';
import { siteService } from '@site-builder/services/siteService';
import { geminiService } from '@ai/services/geminiService';

const WebsiteBuilderView = () => {
  const [dna, setDna] = useState<SiteDNA>({
    theme: {
      primaryColor: '#6366f1',
      fontFamily: 'Inter, sans-serif',
      borderRadius: '1rem',
      backgroundColor: '#ffffff',
      textColor: '#1e293b'
    },
    pages: { 'Home': INITIAL_SITE_DATA }
  });

  const [activeTab, setActiveTab] = useState<'visual' | 'code'>('visual');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [aiCommand, setAiCommand] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);

  const handleDeploy = async () => {
    setIsDeploying(true);
    try {
      const brand = dna.pages['Home'].find(s => s.type === 'NAVBAR')?.content.brandName || "Meu Site SaaS";
      const result = await siteService.publishToGoogleCloud(dna, brand);
      if (result.success) {
        setLastSync(new Date().toLocaleTimeString());
        alert(`Site publicado! Slug: ${result.slug}`);
      }
    } catch (e) {
      console.error(e);
      alert("Configuração de Apps Script pendente na aba Integrações.");
    } finally {
      setIsDeploying(false);
    }
  };

  const handleAiAction = async () => {
    if (!aiCommand) return;
    setIsAiProcessing(true);
    try {
      const prompt = `Gere uma nova seção de site no formato JSON baseada no comando: "${aiCommand}". Retorne apenas o objeto SiteElement.`;
      const jsonStr = await geminiService.generateSectionJSON(prompt);
      const newSection = JSON.parse(jsonStr.replace(/```json|```/g, ''));
      
      setDna(prev => ({
        ...prev,
        pages: { ...prev.pages, 'Home': [...prev.pages['Home'], { ...newSection, id: `ai-${Date.now()}` }] }
      }));
      setAiCommand('');
    } catch (e) {
      console.error("Erro na IA:", e);
    } finally {
      setIsAiProcessing(false);
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] flex bg-slate-950 overflow-hidden rounded-[2rem] shadow-2xl border border-white/10">
      
      {/* SIDEBAR BUILDER */}
      <aside className="w-96 border-r border-white/5 flex flex-col bg-slate-900/50 backdrop-blur-xl shrink-0">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg"><Layout size={20}/></div>
              <h2 className="text-white font-black italic tracking-tighter uppercase text-xs">Architect SaaS</h2>
           </div>
           <div className="flex bg-slate-800 p-1 rounded-lg">
              <button onClick={() => setActiveTab('visual')} className={`p-2 rounded-md transition-all ${activeTab === 'visual' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500'}`}><Palette size={14}/></button>
              <button onClick={() => setActiveTab('code')} className={`p-2 rounded-md transition-all ${activeTab === 'code' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500'}`}><Code size={14}/></button>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {activeTab === 'visual' ? (
            <div className="space-y-6 animate-in fade-in duration-500">
               {/* AI COMMAND BOX */}
               <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-indigo-400 tracking-widest flex items-center gap-2">
                    <Sparkles size={14} className="animate-pulse" /> Comando Ricardo IA
                  </label>
                  <div className="relative">
                    <textarea 
                      placeholder="Ex: 'Crie uma seção de preços com 3 planos corporativos'..."
                      className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 text-xs font-bold text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all h-28 resize-none shadow-inner"
                      value={aiCommand}
                      onChange={(e) => setAiCommand(e.target.value)}
                    />
                    <button 
                      onClick={handleAiAction}
                      disabled={isAiProcessing || !aiCommand}
                      className="absolute bottom-3 right-3 p-3 bg-indigo-600 text-white rounded-xl shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-30"
                    >
                      {isAiProcessing ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
                    </button>
                  </div>
               </div>

               {/* THEME QUICK CONFIG */}
               <div className="space-y-4 pt-6 border-t border-white/5">
                  <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Tema Global</h3>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1.5">
                        <span className="text-[8px] font-bold text-slate-500 uppercase">Cor Primária</span>
                        <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-xl border border-white/5">
                           <input type="color" className="w-6 h-6 rounded bg-transparent border-0" value={dna.theme.primaryColor} onChange={(e) => setDna({...dna, theme: {...dna.theme, primaryColor: e.target.value}})} />
                           <span className="text-[9px] font-mono text-slate-300 uppercase">{dna.theme.primaryColor}</span>
                        </div>
                     </div>
                     <div className="space-y-1.5">
                        <span className="text-[8px] font-bold text-slate-500 uppercase">Arredondamento</span>
                        <select className="w-full bg-slate-800 border border-white/5 rounded-xl p-2 text-[9px] font-bold text-slate-300" value={dna.theme.borderRadius} onChange={(e) => setDna({...dna, theme: {...dna.theme, borderRadius: e.target.value}})}>
                           <option value="0px">Quadrado</option>
                           <option value="0.5rem">Suave</option>
                           <option value="1rem">Moderno</option>
                           <option value="2rem">Circular</option>
                        </select>
                     </div>
                  </div>
               </div>
            </div>
          ) : (
            <div className="h-full flex flex-col space-y-4 animate-in slide-in-from-right-4 duration-500">
               <div className="flex items-center gap-2 text-indigo-400">
                  <Terminal size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">DNA Code Editor</span>
               </div>
               <textarea 
                  className="flex-1 bg-slate-950 border border-white/10 rounded-2xl p-6 font-mono text-[10px] text-emerald-400 leading-relaxed outline-none focus:ring-1 focus:ring-indigo-500 shadow-inner"
                  value={JSON.stringify(dna, null, 2)}
                  onChange={(e) => {
                    try { setDna(JSON.parse(e.target.value)); } catch(err) {}
                  }}
               />
            </div>
          )}
        </div>

        {/* ACTIONS FOOTER */}
        <div className="p-6 border-t border-white/5 bg-slate-900/80">
           <button 
             onClick={handleDeploy}
             disabled={isDeploying}
             className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-indigo-500/20 hover:bg-indigo-500 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
           >
             {isDeploying ? <Loader2 size={16} className="animate-spin" /> : <Rocket size={16} />}
             Sincronizar com Workspace
           </button>
           {lastSync && (
             <p className="text-center mt-3 text-[8px] font-black uppercase text-emerald-500 tracking-widest">
               Último Deploy: {lastSync}
             </p>
           )}
        </div>
      </aside>

      {/* CANVAS PREVIEW AREA */}
      <main className="flex-1 bg-slate-100 flex flex-col relative">
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 px-6 py-2 bg-white/90 backdrop-blur rounded-full shadow-2xl border border-slate-200">
           <div className="flex gap-2 pr-4 border-r border-slate-200">
              <button onClick={() => setPreviewMode('desktop')} className={`p-2 rounded-lg transition-all ${previewMode === 'desktop' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-50'}`}><Monitor size={16}/></button>
              <button onClick={() => setPreviewMode('mobile')} className={`p-2 rounded-lg transition-all ${previewMode === 'mobile' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-50'}`}><Smartphone size={16}/></button>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Preview em Tempo Real</span>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-12 flex justify-center custom-scrollbar">
           <div className={`transition-all duration-700 ease-in-out shadow-[0_0_100px_rgba(0,0,0,0.1)] ${previewMode === 'mobile' ? 'w-[375px] h-[667px] border-[12px] border-slate-900 rounded-[3rem] my-auto' : 'w-full max-w-7xl rounded-3xl overflow-hidden'}`}>
              <WebsiteEngine dna={dna} />
           </div>
        </div>

        <div className="absolute bottom-6 left-6 p-4 bg-indigo-900/90 text-white rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md max-w-xs animate-in slide-in-from-left-4">
           <div className="flex items-center gap-3 mb-2">
              <Zap size={18} className="text-amber-400" />
              <h4 className="text-[10px] font-black uppercase tracking-widest">Dica da Engine</h4>
           </div>
           <p className="text-[9px] font-medium leading-relaxed text-indigo-100/80 uppercase">
             Use o modo código para clonar layouts de outros sites apenas colando o JSON exportado. O Workspace gerencia o cache automaticamente.
           </p>
        </div>
      </main>

    </div>
  );
};

export default WebsiteBuilderView;
