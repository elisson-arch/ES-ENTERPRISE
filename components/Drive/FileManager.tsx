
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
      {/* Sidebar de Navegação Lateral - Agora Flexível */}
      <aside className="w-full lg:max-w-xs lg:min-w-[240px] space-y-3">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-4">Cloud Masters us-central1</h4>
        
        {[
          { id: 'all', label: 'Tudo', icon: Database, color: 'bg-blue-600', activeColor: 'text-blue-500' },
          { id: 'clients', label: 'Clientes', icon: Users, color: 'bg-indigo-600', activeColor: 'text-indigo-500' },
          { id: 'company', label: 'Empresa', icon: Briefcase, color: 'bg-slate-900', activeColor: 'text-slate-400' }
        ].map(item => (
          <button 
            key={item.id}
            onClick={() => onViewChange(item.id as any)}
            className={`w-full flex items-center justify-between px-6 py-5 rounded-[1.5rem] transition-all group min-h-[56px] ${
              currentView === item.id 
                ? `${item.color} text-white shadow-2xl` 
                : 'text-slate-600 bg-white hover:shadow-lg border border-transparent hover:border-slate-100'
            }`}
          >
            <div className="flex items-center gap-4">
              <item.icon size={22} className={currentView === item.id ? 'text-white' : item.activeColor} />
              <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
            </div>
            <ChevronRight size={18} className={currentView === item.id ? 'opacity-40' : 'text-slate-200 group-hover:text-slate-400'} />
          </button>
        ))}

        <div className="pt-8 px-4">
          <div className="bg-slate-100/50 p-6 rounded-[2rem] border border-slate-200/50 text-center shadow-inner">
             <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-4 shadow-sm border border-slate-100">
                <Database size={28} />
             </div>
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Cota Regional Cloud</p>
             <p className="text-sm font-black text-slate-800 tracking-tighter italic">42.5 GB / 100 GB</p>
             <div className="mt-5 w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full w-[42.5%] rounded-full shadow-[0_0_10px_rgba(37,99,235,0.4)]"></div>
             </div>
          </div>
        </div>
      </aside>

      {/* Área Principal de Arquivos */}
      <div className="flex-1 space-y-6 min-w-0">
        <div className="bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
            <input 
              type="text" 
              placeholder="Pesquisar documentos técnicos..."
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all text-sm font-bold text-slate-700 shadow-inner"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-4 px-2">
           <button onClick={() => onViewChange('all')} className="w-10 h-10 flex items-center justify-center bg-white rounded-xl text-slate-400 hover:text-blue-600 transition-all border border-slate-100 shadow-sm">
              <ArrowLeft size={20} />
           </button>
           <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <span className="hover:text-blue-600 cursor-pointer transition-colors">SGC Cloud Root</span>
              <ChevronRight size={14} />
              <span className="text-slate-800 italic">{getBreadcrumbLabel()}</span>
           </div>
        </div>

        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Item / Descrição</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] hidden md:table-cell">Peso</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] hidden md:table-cell text-center">Sync Date</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {files.length > 0 ? files.map((file, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-all group cursor-pointer">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-5">
                      <div className="p-4 bg-slate-100 rounded-2xl group-hover:bg-white group-hover:shadow-lg group-hover:scale-110 transition-all duration-300 border border-transparent group-hover:border-slate-100">
                        {getIcon(file.type)}
                      </div>
                      <div className="min-w-0">
                        <span className="text-[13px] font-black text-slate-800 block truncate group-hover:text-blue-600 transition-colors uppercase tracking-tight italic">
                          {file.name}
                        </span>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{file.category}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-xs font-black text-slate-500 hidden md:table-cell">{file.size}</td>
                  <td className="px-8 py-5 text-xs font-black text-slate-400 hidden md:table-cell text-center uppercase italic">{file.date}</td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                      <button className="w-11 h-11 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all" title="Download">
                        <Download size={18} />
                      </button>
                      <button className="w-11 h-11 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-emerald-600 hover:border-emerald-200 shadow-sm transition-all" title="Compartilhar">
                        <Share2 size={18} />
                      </button>
                      <button className="w-11 h-11 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-300 hover:text-slate-800 shadow-sm transition-all">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-8 py-24 text-center">
                    <div className="max-w-xs mx-auto space-y-6 opacity-30">
                       <Search size={64} className="mx-auto text-slate-200" />
                       <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 leading-relaxed">Ricardo IA não localizou arquivos para os termos selecionados na região us-central1.</p>
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
