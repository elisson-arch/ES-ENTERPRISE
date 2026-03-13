import React from 'react';
import { Shield, Lock, Smartphone, Key, Eye, EyeOff, AlertTriangle } from 'lucide-react';

const SecurityTab: React.FC = () => {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">Segurança e Acesso</h2>
        <p className="text-slate-500 font-medium">Proteja sua conta e gerencie métodos de autenticação.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Password Section */}
        <div className="bg-white/50 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/50 shadow-glass space-y-6">
          <div className="flex items-center space-x-4 mb-2">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
              <Lock size={20} />
            </div>
            <h3 className="font-bold text-slate-900">Alterar Senha</h3>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Senha Atual</label>
              <input type="password" placeholder="••••••••" className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50/50 text-sm font-bold text-slate-700" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nova Senha</label>
              <input type="password" placeholder="••••••••" className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50/50 text-sm font-bold text-slate-700" />
            </div>
            <button className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all">
              Atualizar Senha
            </button>
          </div>
        </div>

        {/* 2FA Section */}
        <div className="bg-white/50 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/50 shadow-glass space-y-6">
          <div className="flex items-center space-x-4 mb-2">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
              <Smartphone size={20} />
            </div>
            <h3 className="font-bold text-slate-900">Autenticação em Duas Etapas</h3>
          </div>
          
          <p className="text-sm text-slate-500 leading-relaxed">
            Adicione uma camada extra de segurança à sua conta exigindo um código do seu telemóvel ao iniciar sessão.
          </p>

          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start space-x-3">
            <Shield className="text-emerald-500 mt-1 shrink-0" size={18} />
            <div className="text-xs text-emerald-700 font-medium">
              A autenticação 2FA via Google Workspace já está ativa para sua conta corporativa.
            </div>
          </div>

          <button className="w-full py-4 border-2 border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
            Gerenciar Dispositivos
          </button>
        </div>

        {/* Sessions Section */}
        <div className="md:col-span-2 bg-white/50 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/50 shadow-glass">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl">
                <Key size={20} />
              </div>
              <h3 className="font-bold text-slate-900">Sessões Ativas</h3>
            </div>
            <button className="text-[10px] font-black uppercase text-rose-600 hover:underline">Encerrar todas as sessões</button>
          </div>

          <div className="space-y-4">
            {[
              { device: 'MacBook Pro 16"', location: 'São Paulo, Brasil', status: 'Sessão Atual', icon: Smartphone },
              { device: 'iPhone 15 Pro', location: 'São Paulo, Brasil', status: 'Ativo há 2 horas', icon: Smartphone },
            ].map((session, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-white rounded-xl shadow-sm">
                    <session.icon size={18} className="text-slate-400" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-700">{session.device}</div>
                    <div className="text-[10px] text-slate-400 font-medium">{session.location}</div>
                  </div>
                </div>
                <div className="text-[10px] font-black uppercase text-emerald-500">{session.status}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityTab;
