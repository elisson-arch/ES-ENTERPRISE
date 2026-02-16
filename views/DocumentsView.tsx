
import React from 'react';
import { 
  FileText, 
  Download, 
  Send, 
  Trash2, 
  CheckCircle,
  Clock,
  ExternalLink
} from 'lucide-react';

const DocumentsView = () => {
  const documents = [
    { id: '001', client: 'Condomínio Aurora', date: '22/05/2024', total: 'R$ 1.250,00', status: 'Enviado' },
    { id: '002', client: 'Padaria Pão de Mel', date: '21/05/2024', total: 'R$ 4.800,00', status: 'Aprovado' },
    { id: '003', client: 'Maria Clara Oliveira', date: '20/05/2024', total: 'R$ 350,00', status: 'Rascunho' },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Orçamentos & Recibos</h2>
          <p className="text-slate-500">Documentação comercial centralizada.</p>
        </div>
        <button className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200">
          <FileText size={20} />
          Novo Orçamento
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => (
          <div key={doc.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-lg transition-all duration-300">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${
                  doc.status === 'Aprovado' ? 'bg-emerald-100 text-emerald-600' : 
                  doc.status === 'Enviado' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'
                }`}>
                  <FileText size={24} />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
                  doc.status === 'Aprovado' ? 'bg-emerald-50 text-emerald-600' : 
                  doc.status === 'Enviado' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-600'
                }`}>
                  {doc.status}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-slate-800 mb-1">{doc.client}</h3>
              <p className="text-xs text-slate-400 mb-4 flex items-center gap-1">
                <Clock size={12} /> Gerado em {doc.date}
              </p>

              <div className="bg-slate-50 p-4 rounded-2xl mb-6">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Valor Total</p>
                <p className="text-2xl font-black text-slate-800">{doc.total}</p>
              </div>
            </div>

            <div className="mt-auto border-t border-slate-50 p-4 grid grid-cols-4 gap-2 bg-slate-50/50">
              <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-blue-600 hover:border-blue-200 transition-all" title="Ver Detalhes">
                <ExternalLink size={18} />
              </button>
              <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-blue-600 hover:border-blue-200 transition-all" title="Baixar PDF">
                <Download size={18} />
              </button>
              <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-emerald-600 hover:border-emerald-200 transition-all" title="Enviar p/ Email">
                <Send size={18} />
              </button>
              <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-red-600 hover:border-red-200 transition-all" title="Excluir">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentsView;
