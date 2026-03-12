import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Upload,
  Database,
  RefreshCw,
  CloudLightning,
  Loader2,
  ShieldAlert,
  ArrowRight,
  Link2
} from 'lucide-react';
import { FileManager, FileData } from '@domains/google-workspace/components/Drive/FileManager';
import { googleApiService } from '@domains/google-workspace/services/googleApiService';
import { driveFileService } from '@domains/google-workspace/services/driveFileService';
import { TenantDriveFileDoc } from '@shared/types/common.types';
import { tenantService } from '@domains/auth/services/tenantService';
import { t } from '@shared/services/i18nService';

const DriveView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentView, setCurrentView] = useState<'all' | 'clients' | 'company'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [driveFiles, setDriveFiles] = useState<FileData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orgId, setOrgId] = useState(tenantService.getCurrentOrgId());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mapFile = (file: TenantDriveFileDoc): FileData => ({
    id: file.id,
    name: file.name,
    type: file.mimeType.includes('pdf') ? 'pdf' : file.mimeType.includes('image') ? 'image' : file.mimeType.includes('folder') ? 'folder' : 'file',
    category: file.category,
    size: file.sizeBytes ? `${(file.sizeBytes / 1024 / 1024).toFixed(2)} MB` : '-',
    date: new Date(file.updatedAt).toLocaleDateString('pt-BR'),
    webViewLink: file.webViewLink
  });

  const fetchFiles = async (syncRemote = false) => {
    setIsRefreshing(true);
    setError(null);
    try {
      if (syncRemote) {
        await driveFileService.refreshFromDrive(orgId);
      }
      const files = await driveFileService.listTenantFiles(orgId);
      setDriveFiles(files.map(mapFile));
    } catch (err: any) {
      console.error('Erro ao carregar arquivos:', err);
      setError(err.message || 'Erro desconhecido ao carregar arquivos.');
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles(true);
  }, [orgId]);

  useEffect(() => {
    const handleAuthChange = () => {
      const derived = tenantService.resolveAndPersistFromSession();
      setOrgId(derived);
    };
    window.addEventListener('google_auth_change', handleAuthChange);
    return () => window.removeEventListener('google_auth_change', handleAuthChange);
  }, []);

  const filteredFiles = useMemo(() => {
    return driveFiles.filter(file => {
      const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesView = currentView === 'all' || file.category === currentView;
      return matchesSearch && matchesView;
    });
  }, [searchTerm, currentView, driveFiles]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleUploadFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setIsRefreshing(true);
    setError(null);
    try {
      for (const file of files) {
        await driveFileService.uploadTenantFile(orgId, file, {
          category: currentView === 'all' ? 'company' : currentView,
          linkedEntityType: 'generic'
        });
      }
      await fetchFiles(false);
    } catch (err: any) {
      console.error('Erro no upload:', err);
      setError(err.message || 'Falha no upload para Google Drive.');
    } finally {
      setIsRefreshing(false);
      event.target.value = '';
    }
  };

  const handleDownload = (file: FileData) => {
    if (file.webViewLink) {
      window.open(file.webViewLink, '_blank', 'noopener,noreferrer');
    }
  };

  const handleShare = async (file: FileData) => {
    if (!file.webViewLink) return;
    if (navigator.share) {
      try {
        await navigator.share({ title: file.name, url: file.webViewLink });
        return;
      } catch {
        // fallback to clipboard below
      }
    }

    await navigator.clipboard.writeText(file.webViewLink);
    alert('Link copiado para área de transferência.');
  };

  const handleSoftDelete = async (file: FileData) => {
    const ok = window.confirm(`Deseja remover ${file.name} da visão do sistema?`);
    if (!ok) return;
    try {
      await driveFileService.softDeleteTenantFile(orgId, file.id, false);
      await fetchFiles(false);
    } catch (err: any) {
      console.error('Erro ao remover arquivo:', err);
      setError(err.message || 'Falha ao remover arquivo.');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 h-full flex flex-col">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3 italic tracking-tighter uppercase">
            <Database className="text-blue-600" /> {t('drive.cloud_title')}
          </h2>
          <p className="text-slate-500 text-sm font-medium">{t('drive.subtitle')}</p>
        </div>
        <div className="flex gap-3">
          <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleUploadFiles} />
          <button
            onClick={() => fetchFiles(true)}
            disabled={isRefreshing}
            className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 transition-all shadow-sm group disabled:opacity-50"
          >
            <RefreshCw size={20} className={isRefreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'} />
          </button>
          <button onClick={handleUploadClick} className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95">
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
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter italic">{t('drive.sync_failure')}</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                {t('drive.sync_error_desc')}
              </p>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-[10px] font-mono text-slate-400 mt-4 break-all">
                {error}
              </div>
            </div>
            <div className="flex justify-center gap-4 pt-4">
              <button onClick={() => fetchFiles(true)} className="px-8 py-3 bg-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
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
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">{t('drive.scanning_cloud')}</p>
          </div>
        ) : (
          <FileManager
            files={filteredFiles}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            currentView={currentView}
            onViewChange={setCurrentView}
            onDownload={handleDownload}
            onShare={handleShare}
            onDelete={handleSoftDelete}
          />
        )}
      </div>

      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-1"><Link2 size={12} /> {t('drive.metadata_firestore')}</span>
        <span>•</span>
        <span>{t('drive.storage_info')}</span>
        <span>•</span>
        <span>Soft-delete habilitado</span>
        <span>•</span>
        <span>Tenant: {orgId}</span>
      </div>
    </div>
  );
};

export default DriveView;
