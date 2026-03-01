
import React, { useState } from 'react';
import { 
  Zap, Play, Plus, Code2, FileSpreadsheet, Braces, Terminal, 
  Database, FormInput, Wand2, CheckCircle2, AlertTriangle, Copy, 
  Trash2, Settings, Smartphone, Monitor, MessageSquare
} from 'lucide-react';

const AutomationView = () => {
  const [activeTab, setActiveTab] = useState<'rules' | 'script' | 'formulas'>('rules');
  const [generatedFormula, setGeneratedFormula] = useState('');
  const [formulaPrompt, setFormulaPrompt] = useState('');

  const generateFormula = () => {
    setGeneratedFormula(`=QUERY(Orçamentos!A:Z; "select * where B = 'Roberto Manutenções' and D > 500"; 1)`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-200">
              <Zap size={24} />
            </div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight italic uppercase">Centro de Automação</h2>
          </div>
          <p className="text-slate-500 text-sm font-medium">Integração profissional via Google Apps Script e WhatsApp API.</p>
        </div>

        <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm overflow-x-auto no-scrollbar">
          <button onClick={() => setActiveTab('rules')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'rules' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}>Gatilhos</button>
          <button onClick={() => setActiveTab('script')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'script' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}>Apps Script</button>
          <button onClick={() => setActiveTab('formulas')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'formulas' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}>Fórmulas IA</button>
        </div>
      </header>

      {activeTab === 'rules' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-green-50 text-green-600 rounded-3xl group-hover:scale-110 transition-transform">
                <MessageSquare size={28} />
              </div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-100">API Ativa</span>
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2">WhatsApp Auto-Responder</h3>
            <p className="text-sm text-slate-500 font-medium mb-6">Integração real que responde leads automáticos assim que entram na planilha do Google.</p>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex justify-between items-center">
               <code className="text-[10px] text-blue-600 font-mono">wa_webhook_handler.gs</code>
               <button className="text-[8px] font-black uppercase text-indigo-600 hover:underline">Ver Código</button>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-amber-50 text-amber-600 rounded-3xl group-hover:scale-110 transition-transform">
                <FileSpreadsheet size={28} />
              </div>
              <span className="px-3 py-1 bg-slate-50 text-slate-400 rounded-full text-[9px] font-black uppercase tracking-widest">Pendente</span>
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2">Monitoramento de Insumos</h3>
            <p className="text-sm text-slate-500 font-medium mb-6">Verifica estoque na Planilha e avisa via WhatsApp se peças críticas estiverem acabando.</p>
            <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest">Ativar Gatilho</button>
          </div>
        </div>
      )}

      {activeTab === 'script' && (
        <div className="bg-slate-950 rounded-[3rem] p-4 lg:p-10 border border-white/5 shadow-2xl">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-500 rounded-2xl text-white shadow-lg"><Braces size={24} /></div>
              <div>
                <h3 className="text-white font-black italic uppercase tracking-tighter">Google Script Bridge</h3>
                <p className="text-slate-500 text-[10px] font-black uppercase">Comunicação real entre CRM e WhatsApp Cloud</p>
              </div>
            </div>
            <button className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Deploy Script</button>
          </div>
          
          <div className="bg-black/50 rounded-2xl p-6 font-mono text-[11px] text-emerald-400 border border-white/5 overflow-x-auto">
             <pre className="leading-relaxed">
{`/**
 * SGC Pro Dispatcher - Dispara mensagens via WhatsApp API
 * @param {string} phone - Telefone do cliente (Ex: 5511977776666)
 * @param {string} text - Mensagem profissional
 */
function sendWhatsAppOfficial(phone, text) {
  const token = "SEU_TOKEN_API_META";
  const phoneId = "SEU_PHONE_ID";
  
  const payload = {
    messaging_product: "whatsapp",
    to: phone,
    type: "text",
    text: { body: text }
  };
  
  const options = {
    method: "post",
    headers: { "Authorization": "Bearer " + token, "Content-Type": "application/json" },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  
  const res = UrlFetchApp.fetch("https://graph.facebook.com/v19.0/" + phoneId + "/messages", options);
  Logger.log("Resultado: " + res.getContentText());
}`}
             </pre>
          </div>
          <div className="mt-6 flex items-center gap-3 text-amber-500 p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10">
            <AlertTriangle size={18} />
            <span className="text-[9px] font-black uppercase tracking-widest">Este código deve ser colado no editor de scripts da sua Planilha de Orçamentos do Google.</span>
          </div>
        </div>
      )}

      {activeTab === 'formulas' && (
        <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-sm text-center">
           <h3 className="text-2xl font-black text-slate-800 italic uppercase">Fórmulas Profissionais</h3>
           <p className="text-slate-500 text-sm font-medium mb-8">Otimize suas planilhas de manutenção com cálculos automáticos.</p>
           <button onClick={generateFormula} className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">Gerar para Roberto Manutenções</button>
           {generatedFormula && <div className="mt-8 p-6 bg-slate-900 text-emerald-400 rounded-3xl font-mono text-sm">{generatedFormula}</div>}
        </div>
      )}
    </div>
  );
};

export default AutomationView;
