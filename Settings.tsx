
import React, { useState } from 'react';

const Settings: React.FC = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);

  const handleConnect = () => {
    setIsConnecting(true);
    // Simula o fluxo de redirecionamento do Google OAuth
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      setLastSync(new Date().toLocaleString());
    }, 2000);
  };

  const scopes = [
    { id: 'drive', name: 'Google Drive', desc: 'Acesso a arquivos e Drives Compartilhados (2TB)', active: true },
    { id: 'meet', name: 'Google Meet', desc: 'Gestão de gravações e logs de conferência', active: true },
    { id: 'admin', name: 'Admin SDK', desc: 'Relatórios de uso e governança de dados', active: false },
    { id: 'vault', name: 'Google Vault', desc: 'Acesso a eDiscovery (Requer Business Plus)', active: false, restricted: true },
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-20">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-6">
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all shadow-inner ${isConnected ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'}`}>
              <svg className={`w-10 h-10 ${isConnecting ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isConnecting ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                )}
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Sincronização de Conta</h2>
              <p className="text-gray-500 text-sm">Vincule seu domínio Google Workspace para automação e insights em tempo real.</p>
              {isConnected && (
                <div className="flex items-center mt-2 space-x-2">
                  <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                  <span className="text-xs font-bold text-green-600 uppercase tracking-widest">Conectado com john.doe@company.com</span>
                </div>
              )}
            </div>
          </div>
          
          <button 
            onClick={isConnected ? () => setIsConnected(false) : handleConnect}
            disabled={isConnecting}
            className={`px-8 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-lg active:scale-95 ${
              isConnected 
              ? 'bg-white text-red-600 border border-red-100 hover:bg-red-50' 
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'
            }`}
          >
            {isConnecting ? 'Autenticando...' : isConnected ? 'Desconectar Conta' : 'Sincronizar com Google'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gestão de Permissões */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              Escopos e Permissões de API
            </h3>
            <div className="space-y-4">
              {scopes.map((scope) => (
                <div key={scope.id} className={`p-4 rounded-2xl border transition-all ${scope.restricted ? 'bg-gray-50/50 border-gray-100 opacity-60' : 'bg-white border-gray-100 hover:border-blue-100'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${scope.active ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{scope.name}</p>
                        <p className="text-xs text-gray-500">{scope.desc}</p>
                      </div>
                    </div>
                    {scope.restricted ? (
                      <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-1 rounded-lg uppercase">Upgrade Necessário</span>
                    ) : (
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={scope.active} className="sr-only peer" readOnly />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
            <h4 className="font-bold text-blue-800 text-sm mb-3">Como ativar a sincronização real?</h4>
            <ol className="text-xs text-blue-700 space-y-3 leading-relaxed list-decimal ml-4">
              <li>Acesse o <strong>Google Cloud Console</strong> e crie um novo projeto.</li>
              <li>Habilite as APIs necessárias (Drive API, Google Calendar API, etc).</li>
              <li>Configure a <strong>Tela de Consentimento OAuth</strong> para uso interno.</li>
              <li>Crie credenciais do tipo "ID do cliente OAuth 2.0".</li>
              <li>Insira as chaves de API nas variáveis de ambiente do seu projeto.</li>
            </ol>
            <button className="mt-4 text-xs font-bold text-blue-600 hover:underline">Ver tutorial completo na documentação oficial →</button>
          </div>
        </div>

        {/* Status e Logs */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-800 mb-6 uppercase tracking-widest text-center">Status do Monitoramento</h3>
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-xs text-gray-400 font-bold mb-1 uppercase">Última Varredura</p>
                <p className="text-lg font-bold text-gray-800">{lastSync || 'Nunca sincronizado'}</p>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                <div className="text-center flex-1 border-r border-gray-200">
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Arquivos</p>
                  <p className="text-sm font-bold text-gray-800">2.4k</p>
                </div>
                <div className="text-center flex-1">
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Latência</p>
                  <p className="text-sm font-bold text-gray-800">12ms</p>
                </div>
              </div>
              <button 
                disabled={!isConnected}
                className="w-full py-3 bg-gray-900 text-white rounded-2xl font-bold text-xs hover:bg-black transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Forçar Sincronização Agora
              </button>
            </div>
          </div>

          <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-xl shadow-indigo-100">
            <h4 className="font-bold mb-3">Segurança Business Standard</h4>
            <p className="text-xs text-indigo-100 leading-relaxed mb-4">
              Ao sincronizar, utilizamos criptografia em trânsito (TLS) e em repouso. O app nunca armazena suas senhas do Google, apenas tokens de acesso limitados.
            </p>
            <div className="p-3 bg-white/10 rounded-xl flex items-center space-x-3">
              <svg className="w-5 h-5 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              <span className="text-[10px] font-bold uppercase tracking-wider">Protocolo OAuth 2.0 Ativo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
