import React from 'react';
import { User, Mail, Camera, Phone, MapPin, Save } from 'lucide-react';
import { googleApiService } from '@google-workspace/services/googleApiService';

const ProfileTab: React.FC = () => {
  const profile = googleApiService.getUserProfile();
  const isConnected = googleApiService.isAuthenticated();

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">Perfil Profissional</h2>
          <p className="text-slate-500 font-medium">Gerencie suas informações públicas e de contato técnico.</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${
            isConnected ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-400'
          }`}>
            {isConnected ? 'Google Workspace Conectado' : 'Google Desconectado'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Avatar Section */}
        <div className="md:col-span-1">
          <div className="bg-white/50 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/50 shadow-glass flex flex-col items-center text-center space-y-4">
            <div className="relative group">
              <div className="w-32 h-32 rounded-[2rem] bg-indigo-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-xl">
                {profile?.picture ? (
                  <img src={profile.picture} alt={profile.name || ''} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <User size={48} className="text-indigo-400" />
                )}
              </div>
              <button className="absolute -bottom-2 -right-2 p-3 bg-indigo-600 text-white rounded-2xl shadow-lg hover:bg-indigo-700 transition-all group-hover:scale-110">
                <Camera size={18} />
              </button>
            </div>
            <div>
              <h3 className="font-bold text-slate-900">{profile?.name || 'Usuário ES'}</h3>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-tighter">Técnico Especialista</p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white/50 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/50 shadow-glass grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nome Completo</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm font-bold text-slate-700" 
                  defaultValue={profile?.name || ''}
                  placeholder="Seu nome" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">E-mail Corporativo</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm font-bold text-slate-700" 
                  defaultValue={profile?.email || ''}
                  placeholder="contato@empresa.com" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Telefone / WhatsApp</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="tel" 
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm font-bold text-slate-700" 
                  placeholder="+55 (11) 99999-9999" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Localização Base</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm font-bold text-slate-700" 
                  placeholder="São Paulo, SP" 
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button className="flex items-center gap-3 bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black uppercase text-[10px] shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-105 transition-all active:scale-95">
              <Save size={18} />
              Salvar Alterações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
