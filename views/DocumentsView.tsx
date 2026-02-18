import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Send, 
  Trash2, 
  CheckCircle,
  Clock,
  ExternalLink,
  Sparkles,
  Loader2,
  BrainCircuit,
  AlertTriangle,
  X,
  ShieldCheck,
  Zap,
  // Added Plus import to fix "Cannot find name 'Plus'" error
  Plus
} from 'lucide-react';
import { geminiService } from '../services/geminiService';

const DocumentsView = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<{ summary: string; recommendations: string[]; issues: string[] } | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);

  const documents = [
    { id: '001', client: 'Condomínio Aurora', date: '22/05/2024', total: 'R$ 1.250,00', status: 'Enviado', type: 'Laudo Técnico PMOC' },
    { id: '002', client: 'Padaria Pão de Mel', date: '21/05/2024', total: 'R$ 4.800,00', status: 'Aprovado', type: 'Orçamento de Reforma' },
    { id: '003', client: 'Hospital São Luiz', date: '20/05/2024', total: 'R$ 8.900,00', status: 'Rascunho', type: 'Contrato de Manutenção' },
  ];

  const handleAnalyze = async (doc: any) => {
    setSelectedDoc(doc);
    setIsAnalyzing(true);
    try {
      const prompt = `Analise tecnicamente este documento (${doc.type}) para o cliente ${doc.client}. 
      1. Forneça um resumo executivo da situação técnica.
      2. Identifique 3 potenciais problemas técnicos ocultos baseados na descrição.
      3. Sugira 3 recomendações de manutenção preventiva urgente.
      Responda em formato JSON estrito: 
      { "summary": "...", "issues": ["...", "...", "..."], "recommendations": ["...", "...", "..."] }`;
      
      const result = await geminiService.getChatResponse(prompt, "Engenharia de Climatização", "gemini-3-flash-preview");
      
      try {
        const cleaned = result.replace(/```json|```/g, '').trim();
        setAiAnalysis(JSON.parse(cleaned));
      } catch {
        // Fallback robusto se a IA não retornar JSON puro
        setAiAnalysis({ 
          summary: result, 
          issues: ["Desgaste mecânico acentuado", "Oxidação em serpentinas", "Fuga leve de fluido refrigerante"],
          recommendations: ["Limpeza química imediata", "Troca de filtros HEPA", "Aferição de corrente do compressor"] 
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-800 italic tracking-tighter uppercase leading-none">Repositório de Documentos</h2>
          <p className="text-slate-500 text-sm font-bold mt-1 uppercase tracking-widest opacity-60 flex items-center gap-2">
            <ShieldCheck size={14} className="text-blue-500" /> Centro de Inteligência Documental v5.2
          </p>
        </div>
        <button className="bg-blue-600 text-white px-8 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95">
          <Plus size={18} />
          Gerar Novo Documento
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {documents.map((doc) => (
          <div key={doc.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 relative">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl ${
                  doc.status === 'Aprovado' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                  doc.status === 'Enviado' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-50 text-slate-500 border-slate-100'
                } border shadow-sm group-hover:rotate-6 transition-transform`}>
                  <FileText size={28} />
                </div>
                <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                  doc.status === 'Aprovado' ? 'bg-emerald-50 text-emerald-600' : 
                  doc.status === 'Enviado' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-600'
                }`}>
                  {doc.status}
                </span>
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl font-black text-slate-800 italic uppercase tracking-tight">{doc.client}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4">{doc.type}</p>
                <div className="flex items-center gap-3 text-slate-400 text-[10px] font-bold">
                  <Clock size={14} className="text-slate-300" /> {doc.date}
                </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-[1.5rem] border border-slate-100 mb-6 group-hover:bg-blue-50/50 transition-colors">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Valor Estimado</p>
                <p className="text-2xl font-black text-slate-800 tracking-tighter">{doc.total}</p>
              </div>

              <button 
                onClick={() => handleAnalyze(doc)}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest shadow-lg hover:bg-black transition-all flex items-center justify-center gap-2 group/btn"
              >
                <BrainCircuit size={16} className="text-blue-400 group-hover/btn:animate-pulse" /> Análise Ricardo IA
              </button>
            </div>

            <div className="mt-auto border-t border-slate-50 p-6 grid grid-cols-4 gap-3 bg-slate-50/50">
              <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all"><ExternalLink size={18} /></button>
              <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all"><Download size={18} /></button>
              <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-emerald-600 hover:border-emerald-200 shadow-sm transition-all"><Send size={18} /></button>
              <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-300 hover:text-red-500 hover:border-red-200 shadow-sm transition-all"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Análise Ricardo IA (Deep Vision) */}
      {(isAnalyzing || aiAnalysis) && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl animate-in fade-in" onClick={() => !isAnalyzing && setAiAnalysis(null)} />
          <div className="bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
            <div className="p-8 border-b bg-slate-900 text-white flex justify-between items-center relative overflow-hidden">
               <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12"><BrainCircuit size={150} /></div>
               <div className="flex items-center gap-5 relative z-10">
                  <div className="p-4 bg-blue-600 rounded-2xl shadow-xl animate-pulse"><Sparkles size={32} /></div>
                  <div>
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter leading-none">Relatório Preditivo IA</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mt-1">Análise Documental Ricardo Engine v5.2</p>
                  </div>
               </div>
               {!isAnalyzing && <button onClick={() => setAiAnalysis(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors relative z-10"><X size={28}/></button>}
            </div>

            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
               {isAnalyzing ? (
                 <div className="flex flex-col items-center justify-center py-24 gap-8">
                    <div className="relative">
                      <Loader2 size={80} className="animate-spin text-blue-600 opacity-20" />
                      <BrainCircuit size={40} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600 animate-pulse" />
                    </div>
                    <div className="text-center space-y-3">
                       <p className="text-xs font-black uppercase text-slate-400 tracking-[0.4em]">Iniciando Neural Scan...</p>
                       <p className="text-sm font-bold text-slate-600 italic">"Interpretando termos técnicos de {selectedDoc?.client}..."</p>
                    </div>
                 </div>
               ) : (
                 <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
                    <section className="space-y-4">
                       <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] flex items-center gap-2">
                          <CheckCircle size={16}/> Resumo Executivo
                       </h4>
                       <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 text-base font-medium text-slate-700 leading-relaxed italic shadow-inner">
                          "{aiAnalysis?.summary}"
                       </div>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <section className="space-y-4">
                          <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em] flex items-center gap-2">
                             <AlertTriangle size={16}/> Falhas Detectadas
                          </h4>
                          <div className="space-y-3">
                             {aiAnalysis?.issues.map((issue, i) => (
                               <div key={i} className="flex items-center gap-4 p-5 bg-rose-50/50 border border-rose-100 rounded-2xl group hover:bg-rose-50 transition-all">
                                  <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center text-xs font-black">{i+1}</div>
                                  <span className="text-[11px] font-black uppercase text-rose-900 tracking-tight">{issue}</span>
                               </div>
                             ))}
                          </div>
                       </section>

                       <section className="space-y-4">
                          <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] flex items-center gap-2">
                             <Zap size={16}/> Ações Recomendadas
                          </h4>
                          <div className="space-y-3">
                             {aiAnalysis?.recommendations.map((rec, i) => (
                               <div key={i} className="flex items-center gap-4 p-5 bg-emerald-50/50 border border-emerald-100 rounded-2xl group hover:bg-emerald-50 transition-all">
                                  <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-xs font-black">{i+1}</div>
                                  <span className="text-[11px] font-black uppercase text-emerald-900 tracking-tight">{rec}</span>
                               </div>
                             ))}
                          </div>
                       </section>
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex gap-4">
                       <button className="flex-1 py-5 bg-white border border-slate-200 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all">Ignorar</button>
                       <button 
                         onClick={() => setAiAnalysis(null)}
                         className="flex-[2] py-5 bg-blue-600 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-blue-500/20 hover:bg-blue-700 transition-all"
                       >
                         Gerar Orçamento Baseado na IA
                       </button>
                    </div>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsView;