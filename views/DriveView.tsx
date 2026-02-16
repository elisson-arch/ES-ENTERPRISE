
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Upload, 
  Database,
  RefreshCw,
  CloudLightning,
  Loader2,
  AlertCircle,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { FileManager, FileData } from '../components/Drive/FileManager';
import { googleApiService } from '../services/googleApiService';

const DriveView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentView, setCurrentView] = useState<'all' | 'clients' | 'company'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [driveFiles, setDriveFiles] = useState<FileData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      const realFiles = await googleApiService.listFiles();
      const mappedFiles: FileData[] = realFiles.map(f => ({
        name: f.name,
        type: f.mimeType.includes('pdf') ? 'pdf' : f.mimeType.includes('image') ? 'image' : f.mimeType.includes('folder') ? 'folder' : 'file',
        category: f.name.toLowerCase().includes('condominio') || f.name.toLowerCase().includes('cliente') ? 'clients' : 'company',
        size: f.size ? `${(parseInt(f.size) / 1024 / 1024).toFixed(2)} MB` : '-',
        date: new Date(f.modifiedTime).toLocaleDateString('pt-BR')
      }));
      setDriveFiles(mappedFiles);
    } catch (err: any) {
      console.error("Erro ao carregar arquivos reais:", err);
      setError(err.message || "Erro desconhecido ao carregar arquivos.");
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const filteredFiles = useMemo(() => {
    return driveFiles.filter(file => {
      const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesView = currentView === 'all' || file.category === currentView;
      return matchesSearch && matchesView;
    });
  }, [searchTerm, currentView, driveFiles]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 h-full flex flex-col">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3 italic tracking-tighter uppercase">
            <Database className="text-blue-600" /> Google Drive Cloud
          </h2>
          <p className="text-slate-500 text-sm font-medium">Documentos reais sincronizados via Ricardo IA.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={fetchFiles}
            disabled={isRefreshing}
            className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 transition-all shadow-sm group disabled:opacity-50"
          >
            <RefreshCw size={20} className={isRefreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'} />
          </button>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95">
            <Upload size={18} /> Novo Upload
          </button>
          <button 
            onClick={() => googleApiService.requestWorkspaceAccess()}
            className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl active:scale-95"
          >
            <CloudLightning size={18} /> Reautorizar
          </button>
        </div>
      </header>

      <div className="flex-1">
        {error ? (
          <div className="bg-white border border-rose-100 rounded-[3rem] p-12 text-center space-y-6 shadow-xl animate-in zoom-in-95">
            <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto border border-rose-100">
               <ShieldAlert size={40} />
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter italic">Falha na Sincronização</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                Não conseguimos acessar seus arquivos. Isso geralmente ocorre por falta de permissão explícita no Workspace ou token expirado.
              </p>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-[10px] font-mono text-slate-400 mt-4 truncate">
                 {error}
              </div>
            </div>
            <div className="flex justify-center gap-4 pt-4">
              <button onClick={fetchFiles} className="px-8 py-3 bg-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
                Tentar Novamente
              </button>
              <button 
                onClick={() => googleApiService.requestWorkspaceAccess()} 
                className="px-8 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-indigo-700 transition-all flex items-center gap-2"
              >
                Conceder Acesso <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ) : isLoading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-4 text-slate-400 animate-pulse">
            <Loader2 size={40} className="animate-spin text-blue-600" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Escaneando Google Cloud...</p>
          </div>
        ) : (
          <FileManager 
            files={filteredFiles}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            currentView={currentView}
            onViewChange={setCurrentView}
          />
        )}
      </div>
    </div>
  );
};

export default DriveView;
