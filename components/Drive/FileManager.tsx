
import React from 'react';
import { 
  Folder, 
  File, 
  FileImage, 
  FileText, 
  Search, 
  Download, 
  Share2,
  MoreVertical,
  Users,
  Briefcase,
  ChevronRight,
  Database,
  ArrowLeft
} from 'lucide-react';

export interface FileData {
  name: string;
  type: string;
  category: string;
  size: string;
  date: string;
}

interface FileManagerProps {
  files: FileData[];
  searchTerm: string;
  onSearchChange: (val: string) => void;
  currentView: 'all' | 'clients' | 'company';
  onViewChange: (view: 'all' | 'clients' | 'company') => void;
}

export const FileManager: React.FC<FileManagerProps> = ({
  files,
  searchTerm,
  onSearchChange,
  currentView,
  onViewChange
}) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'folder': return <Folder className="text-blue-500" fill="currentColor" fillOpacity={0.2} />;
      case 'pdf': return <FileText className="text-rose-500" />;
      case 'image': return <FileImage className="text-emerald-500" />;
      default: return <File className="text-slate-400" />;
    }
  };

  const getBreadcrumbLabel = () => {
    switch (currentView) {
      case 'clients': return 'Clientes';
      case 'company': return 'Empresa';
      default: return 'Todos os Arquivos';
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full animate-in fade-in duration-500">
      {/* Sidebar de Navegação Lateral */}
      <aside className="w-full lg:w-72 space-y-3">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-4">Pastas Mestres</h4>
        
        <button 
          onClick={() => onViewChange('all')}
          className={`w-full flex items-center justify-between px-5 py-4 rounded-[1.5rem] transition-all group ${
            currentView === 'all' 
              ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' 
              : 'text-slate-600 hover:bg-white hover:shadow-md'
          }`}
        >
          <div className="flex items-center gap-4">
            <Database size={20} className={currentView === 'all' ? 'text-white' : 'text-blue-500'} />
            <span className="text-xs font-black uppercase tracking-widest">Tudo</span>
          </div>
          <ChevronRight size={16} className={currentView === 'all' ? 'opacity-50' : 'text-slate-300'} />
        </button>

        <button 
          onClick={() => onViewChange('clients')}
          className={`w-full flex items-center justify-between px-5 py-4 rounded-[1.5rem] transition-all group ${
            currentView === 'clients' 
              ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' 
              : 'text-slate-600 hover:bg-white hover:shadow-md'
          }`}
        >
          <div className="flex items-center gap-4">
            <Users size={20} className={currentView === 'clients' ? 'text-white' : 'text-indigo-500'} />
            <span className="text-xs font-black uppercase tracking-widest">Clientes</span>
          </div>
          <ChevronRight size={16} className={currentView === 'clients' ? 'opacity-50' : 'text-slate-300'} />
        </button>

        <button 
          onClick={() => onViewChange('company')}
          className={`w-full flex items-center justify-between px-5 py-4 rounded-[1.5rem] transition-all group ${
            currentView === 'company' 
              ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' 
              : 'text-slate-600 hover:bg-white hover:shadow-md'
          }`}
        >
          <div className="flex items-center gap-4">
            <Briefcase size={20} className={currentView === 'company' ? 'text-white' : 'text-slate-400'} />
            <span className="text-xs font-black uppercase tracking-widest">Empresa</span>
          </div>
          <ChevronRight size={16} className={currentView === 'company' ? 'opacity-50' : 'text-slate-300'} />
        </button>

        <div className="pt-8 px-4">
          <div className="bg-slate-100/50 p-6 rounded-[2rem] border border-slate-200/50 text-center">
             <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-4 shadow-sm">
                <Database size={24} />
             </div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Armazenamento</p>
             <p className="text-sm font-black text-slate-800 tracking-tighter">42.5 GB / 100 GB</p>
             <div className="mt-4 w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full w-[42.5%] rounded-full"></div>
             </div>
          </div>
        </div>
      </aside>

      {/* Área Principal de Arquivos */}
      <div className="flex-1 space-y-6">
        {/* Barra de Ferramentas */}
        <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="text" 
              placeholder="Pesquisar arquivos e pastas..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-300 focus:bg-white transition-all text-sm font-medium"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        {/* Navegação/Breadcrumbs */}
        <div className="flex items-center gap-3 px-2">
           <button onClick={() => onViewChange('all')} className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
              <ArrowLeft size={18} />
           </button>
           <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <span className="hover:text-blue-600 cursor-pointer">Root</span>
              <ChevronRight size={12} />
              <span className="text-slate-800 italic">{getBreadcrumbLabel()}</span>
           </div>
        </div>

        {/* Tabela de Arquivos */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Item</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hidden md:table-cell">Tamanho</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hidden md:table-cell">Data Modificação</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {files.length > 0 ? files.map((file, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-slate-100 rounded-xl group-hover:bg-white group-hover:shadow-sm transition-all">
                        {getIcon(file.type)}
                      </div>
                      <div className="min-w-0">
                        <span className="text-sm font-bold text-slate-800 block truncate group-hover:text-blue-600 transition-colors">
                          {file.name}
                        </span>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{file.category}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-4 text-xs font-mono text-slate-500 hidden md:table-cell">{file.size}</td>
                  <td className="px-8 py-4 text-xs font-bold text-slate-400 hidden md:table-cell uppercase">{file.date}</td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all" title="Download">
                        <Download size={16} />
                      </button>
                      <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-emerald-600 hover:border-emerald-200 shadow-sm transition-all" title="Compartilhar">
                        <Share2 size={16} />
                      </button>
                      <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-800 shadow-sm transition-all">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <div className="max-w-xs mx-auto space-y-4 opacity-30">
                       <Search size={48} className="mx-auto text-slate-300" />
                       <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Nenhum arquivo encontrado para esta busca</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
