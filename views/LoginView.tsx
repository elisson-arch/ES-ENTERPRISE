
import React, { useState, useEffect } from 'react';
import { 
  Zap,
  CloudLightning,
  ShieldCheck,
  Globe,
  Cpu,
  Loader2,
  Lock,
  ArrowRight,
  ShieldAlert,
  Terminal,
  AlertCircle,
  Database
} from 'lucide-react';
import { googleApiService } from '../services/googleApiService';

const LoginView: React.FC<{ onLoginSuccess: () => void }> = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: any) => {
      if (e.detail?.error) {
        setError(e.detail.error);
        setLoading(false);
      }
    };
    window.addEventListener('google_auth_change', handler);
    return () => window.removeEventListener('google_auth_change', handler);
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    const success = await googleApiService.loginAndAuthorize();
    if (success) onLoginSuccess();
    else {
      setLoading(false);
    }
  };

  const handleContingencyLogin = async () => {
    setLoading(true);
    setTimeout(async () => {
      await googleApiService.activateContingencyAccess();
      onLoginSuccess();
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
        <div className="flex flex-col justify-center space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-blue-500/20">
              <Zap size={32} fill="white" />
            </div>
            <h1 className="text-7xl font-black text-white tracking-tighter italic leading-none">ES Enterprise</h1>
            <p className="text-blue-400 font-black uppercase text-xs tracking-[0.4em] flex items-center gap-2">
              <Cpu size={14} /> Maintenance Intelligence Engine
            </p>
          </div>
          
          <div className="space-y-6 max-w-sm">
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              O ecossistema corporativo definitivo para empresas de manutenção. Sincronize PC, Tablet e Celular em tempo real com o selo de qualidade Enterprise.
            </p>
            <div className="grid grid-cols-2 gap-4 py-6 border-y border-white/5">
               <div>
                  <p className="text-white font-black text-2xl tracking-tighter">2TB</p>
                  <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Storage Cloud</p>
               </div>
               <div>
                  <p className="text-white font-black text-2xl tracking-tighter">1.2s</p>
                  <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Sync Latency</p>
               </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-2xl rounded-[3rem] p-10 border border-white/10 shadow-2xl flex flex-col justify-center gap-8 animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-white italic flex items-center justify-center gap-3">
               Acesso Unificado <Lock size={20} className="text-blue-500" />
            </h2>
            <p className="text-slate-400 text-sm font-medium">Autenticação segura via Google Workspace ou Contingência.</p>
          </div>

          <div className="space-y-4">
            {error && (
              <div className="p-5 bg-rose-500/10 border border-rose-500/20 rounded-[2rem] space-y-4 animate-in shake duration-500">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-rose-500/20 rounded-xl">
                    <ShieldAlert className="text-rose-500" size={20} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-white font-black uppercase tracking-tight">Bloqueio de Domínio Detectado</p>
                    <p className="text-[11px] text-rose-400 leading-relaxed font-medium">
                      O Google restringiu o acesso direto por segurança. Use o Protocolo de Contingência para entrar agora.
                    </p>
                  </div>
                </div>
                <button 
                  onClick={handleContingencyLogin}
                  className="w-full py-4 bg-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all flex items-center justify-center gap-3 border border-white/10 shadow-xl"
                >
                  <Terminal size={16} className="text-blue-400" /> Ativar Acesso Profissional (Bypass)
                </button>
              </div>
            )}

            {!error && (
              <button 
                onClick={handleLogin}
                disabled={loading}
                className="w-full py-6 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/20 flex items-center justify-center gap-4 hover:bg-blue-500 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? <Loader2 size={24} className="animate-spin" /> : <CloudLightning size={24} />}
                CONECTAR GOOGLE CLOUD
                <ArrowRight size={18} />
              </button>
            )}
            
            <p className="text-center text-[10px] text-slate-500 font-bold uppercase">Ou</p>
            
            <button 
              onClick={handleContingencyLogin}
              disabled={loading}
              className="w-full py-4 bg-slate-900/50 text-slate-400 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:text-white hover:bg-slate-900 transition-all flex items-center justify-center gap-2 border border-white/5"
            >
              <Database size={14} /> Modo de Contingência Empresarial
            </button>
          </div>

          <div className="flex justify-center items-center gap-4 opacity-30">
            <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">ES Enterprise Engine v4.0 • Enterprise Ready</p>
            <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;