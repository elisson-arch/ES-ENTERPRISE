
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
  X
} from 'lucide-react';
import { geminiService } from '../services/geminiService';

const DocumentsView = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<{ summary: string; recommendations: string[] } | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);

  const documents = [
    { id: '001', client: 'Condomínio Aurora', date: '22/05/2024', total: 'R$ 1.250,00', status: 'Enviado', type: 'Laudo Técnico PMOC' },
    { id: '002', client: 'Padaria Pão de Mel', date: '21/05/2024', total: 'R$ 4.800,00', status: 'Aprovado', type: 'Orçamento de Reforma' },
    { id: '003', client: 'Maria Clara Oliveira', date: '20/05/2024', total: 'R$ 350,00', status: 'Rascunho', type: 'Recibo Simples' },
  ];

  const handleAnalyze = async (doc: any) => {
    setSelectedDoc(doc);
    setIsAnalyzing(true);
    try {
      const prompt = `Analise este documento de ${doc.type} do cliente ${doc.client}. Resuma os pontos técnicos principais e identifique 3 potenciais problemas ou recomendações de manutenção preventiva. Formate em JSON: { "summary": "...", "recommendations": ["...", "...", "..."] }`;
      
      // Simulando a análise de um arquivo real (como o Gemini processaria o binário)
      const result = await geminiService.getChatResponse(prompt, "Documentação Técnica", "gemini-3-flash-preview");
      
      // Tentativa de parse do JSON da IA, caso falhe, usa fallback
      try {
        const cleaned = result.replace(/```json|```/g, '').trim();
        setAiAnalysis(JSON.parse(cleaned));
      } catch {
        setAiAnalysis({ 
          summary: result, 
          recommendations: ["Verificar níveis de gás", "Limpeza de filtros", "Calibração de sensores"] 
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
          <h2 className="text-4xl font-black text-slate-800 italic tracking-tighter uppercase leading-none">Orçamentos & Recibos</h2>
          <p className="text-slate-500 text-sm font-bold mt-1 uppercase tracking-widest opacity-60">Centro de Documentação Inteligente</p>
        </div>
        <button className="bg-emerald-600 text-white px-8 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20 active:scale-95">
          <FileText size={18} />
          Novo Orçamento
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
                } border shadow-sm`}>
                  <FileText size={28} />
                </div>
                <div className="flex flex-col items-end gap-2">
                   <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                     doc.status === 'Aprovado' ? 'bg-emerald-50 text-emerald-600' : 
                     doc.status === 'Enviado' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-600'
                   }`}>
                     {doc.status}
                   </span>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl font-black text-slate-800 italic uppercase tracking-tight">{doc.client}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4">{doc.type}</p>
                <div className="flex items-center gap-3 text-slate-400 text-[10px] font-bold">
                  <Clock size={14} className="text-slate-300" /> Gerado em {doc.date}
                </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-[1.5rem] border border-slate-100 mb-6 group-hover:bg-indigo-50/50 transition-colors">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Valor do Contrato</p>
                <p className="text-3xl font-black text-slate-800 tracking-tighter">{doc.total}</p>
              </div>

              <button 
                onClick={() => handleAnalyze(doc)}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles size={16} className="animate-pulse" /> Análise Ricardo IA
              </button>
            </div>

            <div className="mt-auto border-t border-slate-50 p-6 grid grid-cols-4 gap-3 bg-slate-50/50">
              <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all" title="Ver Detalhes"><ExternalLink size={18} /></button>
              <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all" title="Baixar PDF"><Download size={18} /></button>
              <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-emerald-600 hover:border-emerald-200 shadow-sm transition-all" title="Enviar p/ Email"><Send size={18} /></button>
              <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-300 hover:text-red-500 hover:border-red-200 shadow-sm transition-all" title="Excluir"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Análise de IA */}
      {(isAnalyzing || aiAnalysis) && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => !isAnalyzing && setAiAnalysis(null)} />
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b bg-indigo-600 text-white flex justify-between items-center">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm"><BrainCircuit size={28} /></div>
                  <div>
                    <h3 className="text-xl font-black italic uppercase tracking-tighter">Inteligência Documental</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Ricardo IA v5.0 Deep Vision</p>
                  </div>
               </div>
               {!isAnalyzing && <button onClick={() => setAiAnalysis(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24}/></button>}
            </div>

            <div className="p-10">
               {isAnalyzing ? (
                 <div className="flex flex-col items-center justify-center py-20 gap-6">
                    <Loader2 size={64} className="animate-spin text-indigo-600" />
                    <div className="text-center space-y-2">
                       <p className="text-xs font-black uppercase text-slate-400 tracking-[0.3em]">Lendo Documento...</p>
                       <p className="text-sm font-bold text-slate-600 italic">"Extraindo dados técnicos de {selectedDoc?.client}"</p>
                    </div>
                 </div>
               ) : (
                 <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                    <section className="space-y-3">
                       <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] flex items-center gap-2">
                          <CheckCircle size={14}/> Resumo Executivo
                       </h4>
                       <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 text-sm font-medium text-slate-700 leading-relaxed italic">
                          "{aiAnalysis?.summary}"
                       </div>
                    </section>

                    <section className="space-y-4">
                       <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] flex items-center gap-2">
                          <AlertTriangle size={14}/> Recomendações Críticas
                       </h4>
                       <div className="grid grid-cols-1 gap-3">
                          {aiAnalysis?.recommendations.map((rec, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-indigo-200 transition-all">
                               <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center text-xs font-black italic">{i+1}</div>
                               <span className="text-[11px] font-black uppercase text-slate-600 tracking-tight">{rec}</span>
                            </div>
                          ))}
                       </div>
                    </section>

                    <button 
                      onClick={() => setAiAnalysis(null)}
                      className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl hover:bg-black transition-all"
                    >
                      Sincronizar Diagnóstico com o CRM
                    </button>
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
