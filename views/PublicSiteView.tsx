import React, { useEffect, useState } from 'react';
// Fix: Import hooks from react-router to resolve export errors
import { useParams, useNavigate } from 'react-router';
import { siteService } from '../services/siteService';
import { Canvas } from '../components/WebBuilder/Canvas';
import { SiteDNA } from '../types';
import { Loader2, AlertCircle, Home } from 'lucide-react';

const PublicSiteView = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [siteData, setSiteData] = useState<SiteDNA | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      const data = siteService.getSiteBySlug(slug);
      setSiteData(data);
    }
    setLoading(false);
  }, [slug]);

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 bg-white">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Carregando Experiência SGC...</p>
      </div>
    );
  }

  if (!siteData) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-8 text-center bg-slate-50">
        <div className="w-24 h-24 bg-white rounded-[2.5rem] shadow-xl flex items-center justify-center text-rose-500 mb-8 border border-rose-100">
          <AlertCircle size={48} />
        </div>
        <h1 className="text-3xl font-black text-slate-800 italic uppercase tracking-tighter mb-4">404: Site Não Encontrado</h1>
        <p className="text-slate-500 max-w-sm mb-12 font-medium">O endereço solicitado não existe ou foi removido pelo proprietário.</p>
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-3 px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
        >
          <Home size={18} /> Voltar ao Início
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Canvas 
        siteData={siteData} 
        sections={siteData.pages['Home'] || []} 
        readOnly={true} 
      />
      
      {/* Badge de Créditos - Padrão SaaS */}
      <div className="fixed bottom-6 right-6 z-[999]">
         <div className="bg-white/80 backdrop-blur-md border border-slate-200 px-4 py-2 rounded-full shadow-2xl flex items-center gap-2">
            <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Built with</span>
            <span className="text-[10px] font-black italic uppercase text-indigo-600 tracking-tighter">SGC Pro Architect</span>
         </div>
      </div>
    </div>
  );
};

export default PublicSiteView;