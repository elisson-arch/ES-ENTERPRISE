
import React, { useState, useEffect } from 'react';
import {
  Zap,
  CloudLightning,
  Cpu,
  Loader2,
  Lock,
  ArrowRight,
  Database,
  CheckCircle2,
  UserPlus,
  AlertTriangle,
  Mail,
  Key
} from 'lucide-react';
import { googleApiService } from '@google-workspace';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@shared/config/firebase';

type AuthStatus = 'idle' | 'loading' | 'registering' | 'connecting' | 'done_new' | 'done_returning' | 'error';

const LoginView: React.FC<{ onLoginSuccess?: () => void }> = ({ onLoginSuccess }) => {
  const [status, setStatus] = useState<AuthStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const handler = (e: CustomEvent) => {
      if (e.detail?.error) {
        setError(e.detail.error);
        setStatus('error');
        return;
      }
      if (e.detail?.isAuthenticated) {
        const name = e.detail.profile?.name || '';
        setUserName(name);
        if (e.detail.isNew) {
          setStatus('done_new');
        } else {
          setStatus('done_returning');
        }
        // Redirecionar após breve feedback visual
        setTimeout(() => {
          if (onLoginSuccess) onLoginSuccess();
          else window.location.href = '/dashboard';
        }, 1800);
      }
    };
    window.addEventListener('google_auth_change', handler as EventListener);
    return () => window.removeEventListener('google_auth_change', handler as EventListener);
  }, [onLoginSuccess]);

  const handleGoogleLogin = async () => {
    setStatus('loading');
    setError(null);
    // O resultado vem via evento google_auth_change
    await googleApiService.loginAndAuthorize();
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Preencha e-mail e senha.');
      setStatus('error');
      return;
    }
    setStatus('loading');
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Simular o token e profile para o sistema legado
      const token = {
        accessToken: `FIREBASE_${user.uid}`,
        refreshToken: '',
        expiresAt: Date.now() + 86400000,
        scopes: []
      };
      const profile = {
        name: user.displayName || user.email?.split('@')[0] || 'Usuário',
        email: user.email || '',
        picture: user.photoURL || `https://ui-avatars.com/api/?name=${user.email}&background=random`,
        organizationId: user.tenantId || user.email || 'default_org'
      };
      
      localStorage.setItem('sgc_token', JSON.stringify(token));
      localStorage.setItem('sgc_profile', JSON.stringify(profile));
      
      window.dispatchEvent(new CustomEvent('google_auth_change', {
        detail: { isAuthenticated: true, profile, isNew: false }
      }));
    } catch (err: any) {
      setError(err.message || 'Falha ao autenticar com e-mail e senha.');
      setStatus('error');
    }
  };

  const handleContingencyLogin = async () => {
    setStatus('loading');
    setTimeout(async () => {
      await googleApiService.activateContingencyAccess();
      if (onLoginSuccess) onLoginSuccess();
      else window.location.href = '/dashboard';
    }, 1200);
  };

  const isLoading = status === 'loading' || status === 'registering' || status === 'connecting';
  const isDone = status === 'done_new' || status === 'done_returning';

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
        {/* Lado esquerdo — branding */}
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
            {/* Aceita qualquer conta */}
            <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
              <div className="w-4 h-px bg-slate-700"></div>
              Acesso Seguro e Criptografado
              <div className="flex-1 h-px bg-slate-700"></div>
            </div>
          </div>
        </div>

        {/* Lado direito — painel de auth */}
        <div className="bg-white/5 backdrop-blur-2xl rounded-[3rem] p-10 border border-white/10 shadow-2xl flex flex-col justify-center gap-8 animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-white italic flex items-center justify-center gap-3">
              Acesso Unificado <Lock size={20} className="text-blue-500" />
            </h2>
            <p className="text-slate-400 text-sm font-medium">
              Entre com suas credenciais ou conta Google.
            </p>
          </div>

          <div className="space-y-4">
            {/* Feedback de erro */}
            {status === 'error' && error && (
              <div className="p-5 bg-rose-500/10 border border-rose-500/20 rounded-2xl space-y-3 animate-in fade-in">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="text-rose-400 shrink-0 mt-0.5" size={18} />
                  <div>
                    <p className="text-xs text-white font-black uppercase">Falha na autenticação</p>
                    <p className="text-[11px] text-rose-400 font-medium mt-0.5">{error}</p>
                  </div>
                </div>
                <button
                  onClick={() => { setStatus('idle'); setError(null); }}
                  className="text-[10px] text-slate-400 underline font-bold"
                >
                  Tentar novamente
                </button>
              </div>
            )}

            {/* Feedback: novo cadastro */}
            {status === 'done_new' && (
              <div className="p-5 bg-emerald-500/10 border border-emerald-400/20 rounded-2xl flex items-center gap-4 animate-in fade-in">
                <div className="p-3 bg-emerald-500/20 rounded-2xl">
                  <UserPlus size={22} className="text-emerald-300" />
                </div>
                <div>
                  <p className="text-sm font-black text-white">Cadastro realizado!</p>
                  <p className="text-[11px] text-emerald-400 font-medium">Bem-vindo, {userName}. Sua empresa foi criada.</p>
                </div>
              </div>
            )}

            {/* Feedback: usuário existente */}
            {status === 'done_returning' && (
              <div className="p-5 bg-blue-500/10 border border-blue-400/20 rounded-2xl flex items-center gap-4 animate-in fade-in">
                <div className="p-3 bg-blue-500/20 rounded-2xl">
                  <CheckCircle2 size={22} className="text-blue-300" />
                </div>
                <div>
                  <p className="text-sm font-black text-white">Conectado!</p>
                  <p className="text-[11px] text-blue-400 font-medium">Bem-vindo de volta, {userName}.</p>
                </div>
              </div>
            )}

            {!isDone && status !== 'error' && (
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-3">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail size={18} className="text-slate-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Seu e-mail corporativo"
                      className="w-full pl-11 pr-4 py-4 bg-slate-900/50 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Key size={18} className="text-slate-400" />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Sua senha"
                      className="w-full pl-11 pr-4 py-4 bg-slate-900/50 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/20 flex items-center justify-center gap-3 hover:bg-blue-500 transition-all active:scale-95 disabled:opacity-60"
                >
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Entrar com E-mail'}
                </button>
              </form>
            )}

            {!isDone && status !== 'error' && (
              <>
                <div className="flex items-center gap-4 py-2 opacity-50">
                  <div className="flex-1 h-px bg-slate-600"></div>
                  <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Ou</span>
                  <div className="flex-1 h-px bg-slate-600"></div>
                </div>

                <button
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  type="button"
                  className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-[0.1em] shadow-xl flex items-center justify-center gap-3 hover:bg-slate-100 transition-all active:scale-95 disabled:opacity-60"
                >
                  <CloudLightning size={18} className="text-blue-600" /> Entrar com Google
                </button>
              </>
            )}

            {!isDone && (
              <button
                onClick={handleContingencyLogin}
                disabled={isLoading}
                type="button"
                className="w-full py-4 mt-4 bg-slate-900/30 text-slate-400 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:text-white hover:bg-slate-900/80 transition-all flex items-center justify-center gap-2 border border-white/5 disabled:opacity-50"
              >
                <Database size={14} /> Modo de Contingência
              </button>
            )}
          </div>

          <div className="flex justify-center items-center gap-4 opacity-30 mt-4">
            <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">ES Enterprise Engine v4.1 • Multi-Tenant Ready</p>
            <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;