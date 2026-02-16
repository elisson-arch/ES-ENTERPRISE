
import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Calendar, 
  Database, 
  RefreshCw, 
  ShieldCheck, 
  Code2, 
  Activity, 
  MessageSquare, 
  Lock, 
  Link2, 
  ExternalLink, 
  HelpCircle, 
  Terminal, 
  Copy, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2,
  FileSpreadsheet,
  Settings,
  ChevronRight,
  Smartphone,
  MapPin,
  Bluetooth,
  Usb,
  Cpu,
  Camera,
  Mic,
  ClipboardList
} from 'lucide-react';
import { googleApiService } from '../services/googleApiService';
import { whatsappApiService } from '../services/whatsappApiService';

const IntegrationsView = () => {
  const [activeTab, setActiveTab] = useState<'google' | 'whatsapp' | 'hardware' | 'logs'>('google');
  const [waConfig, setWaConfig] = useState({
    url: localStorage.getItem('sgc_wa_url') || 'https://graph.facebook.com/v19.0',
    token: localStorage.getItem('sgc_wa_token') || '',
    phoneId: localStorage.getItem('sgc_wa_phone_id') || ''
  });
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);

  const handleSaveWA = async () => {
    whatsappApiService.saveConfig(waConfig);
    setIsTesting(true);
    setTestResult(null);
    const result = await whatsappApiService.testConnection();
    setTestResult(result);
    setIsTesting(false);
  };

  const getGeoLocation = () => {
    if (!navigator.geolocation) return alert("GPS não suportado");
    navigator.geolocation.getCurrentPosition((pos) => {
      setLocation({lat: pos.coords.latitude, lng: pos.coords.longitude});
    }, (err) => alert("Erro ao capturar GPS: " + err.message));
  };

  const copyWebhook = () => {
    const url = "https://sgc-pro-api.vercel.app/webhook/whatsapp";
    navigator.clipboard.writeText(url);
    alert("URL do Webhook copiada!");
  };

  const googleServices = [
    { title: 'Google Contacts', scope: 'contacts', description: 'Sincronização bidirecional de contatos.', icon: Globe, color: 'bg-blue-600' },
    { title: 'Google Calendar', scope: 'calendar', description: 'Agendamento de visitas técnicas.', icon: Calendar, color: 'bg-emerald-600' },
    { title: 'Google Drive', scope: 'drive', description: 'Armazenamento de laudos e fotos.', icon: Database, color: 'bg-amber-500' },
    { title: 'Google Sheets', scope: 'spreadsheets', description: 'Controle financeiro em tempo real.', icon: FileSpreadsheet, color: 'bg-green-600' },
  ];

  const hardwareStatus = [
    { name: 'Câmera', available: !!navigator.mediaDevices?.getUserMedia, icon: Camera },
    { name: 'Microfone', available: !!navigator.mediaDevices?.getUserMedia, icon: Mic },
    { name: 'Geolocalização', available: !!navigator.geolocation, icon: MapPin },
    { name: 'Bluetooth', available: !!(navigator as any).bluetooth, icon: Bluetooth },
    { name: 'USB', available: !!(navigator as any).usb, icon: Usb },
    { name: 'Serial (COM)', available: !!(navigator as any).serial, icon: Cpu },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-200">
              <Code2 size={24} />
            </div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight italic uppercase">Command Center API</h2>
          </div>
          <p className="text-slate-500 text-sm font-medium">Ponte profissional entre o SGC Pro e o hardware do dispositivo.</p>
        </div>
      </header>

      <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm w-fit overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setActiveTab('google')} 
          className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'google' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          Google Cloud
        </button>
        <button 
          onClick={() => setActiveTab('whatsapp')} 
          className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'whatsapp' ? 'bg-green-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          Meta Cloud
        </button>
        <button 
          onClick={() => setActiveTab('hardware')} 
          className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'hardware' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          Hardware & Sensores
        </button>
        <button 
          onClick={() => setActiveTab('logs')} 
          className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'logs' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          API Logs
        </button>
      </div>

      {activeTab === 'google' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-in slide-in-from-bottom-4">
          {googleServices.map((s, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className={`p-4 rounded-2xl ${s.color} text-white w-fit mb-4`}><s.icon size={20} /></div>
              <h4 className="text-xs font-black uppercase text-slate-800 mb-1">{s.title}</h4>
              <p className="text-[10px] text-slate-500 font-medium leading-relaxed mb-4">{s.description}</p>
              <div className="flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${googleApiService.isAuthenticated(s.scope) ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                  {googleApiService.isAuthenticated(s.scope) ? 'Sincronizado' : 'Pendente'}
                </span>
                <button className="text-blue-600 hover:underline text-[9px] font-black uppercase">Configurar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'whatsapp' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-4">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-500 rounded-2xl text-white shadow-lg">
                    <MessageSquare size={24} />
                  </div>
                  <div>
                    <h3 className="font-black italic uppercase text-slate-800">WhatsApp Business API</h3>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Phone ID</label>
                  <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" value={waConfig.phoneId} onChange={e => setWaConfig({...waConfig, phoneId: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Token de Acesso Permanente</label>
                  <input type="password" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" value={waConfig.token} onChange={e => setWaConfig({...waConfig, token: e.target.value})} />
                </div>
                <button onClick={handleSaveWA} className="w-full py-5 bg-green-600 text-white rounded-2xl font-black text-xs uppercase shadow-xl">Salvar e Testar API</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'hardware' && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hardwareStatus.map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:-translate-y-1 transition-all">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-2xl ${item.available ? 'bg-blue-50 text-blue-600' : 'bg-rose-50 text-rose-400'} transition-colors`}>
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase text-slate-800 tracking-tight">{item.name}</h4>
                    <p className={`text-[10px] font-black uppercase ${item.available ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {item.available ? 'Disponível' : 'Bloqueado/Sem Suporte'}
                    </p>
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${item.available ? 'bg-emerald-500 shadow-lg shadow-emerald-200' : 'bg-rose-400'} animate-pulse`}></div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:rotate-45 transition-transform duration-1000">
                <MapPin size={120} />
              </div>
              <h3 className="text-xl font-black italic uppercase mb-2">Check-in Geográfico</h3>
              <p className="text-slate-400 text-xs font-medium mb-8">Utilize o GPS do dispositivo (Celular/Tablet) para registrar a localização precisa de manutenções externas.</p>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <button 
                  onClick={getGeoLocation}
                  className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2"
                >
                  <MapPin size={16} /> Capturar Minha Posição
                </button>
                {location && (
                   <div className="bg-white/10 px-4 py-3 rounded-xl border border-white/10">
                      <p className="text-[10px] font-mono text-indigo-300">Lat: {location.lat.toFixed(5)} / Lng: {location.lng.toFixed(5)}</p>
                   </div>
                )}
              </div>
            </div>

            <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-xl font-black italic uppercase text-slate-800 flex items-center gap-2">
                <ClipboardList size={24} className="text-blue-600" /> Clipboard & Produtividade
              </h3>
              <p className="text-slate-500 text-xs font-medium">Permite copiar dados de orçamentos e ler códigos de barras via porta serial/USB em desktops e tablets.</p>
              <div className="flex gap-3">
                <button className="flex-1 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[9px] font-black uppercase text-slate-600 hover:bg-slate-100 active:scale-95 transition-all">Testar Bluetooth</button>
                <button className="flex-1 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[9px] font-black uppercase text-slate-600 hover:bg-slate-100 active:scale-95 transition-all">Testar USB/Serial</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4">
          <div className="p-8 border-b bg-slate-50/50 flex justify-between items-center">
             <div className="flex items-center gap-3">
                <Activity size={20} className="text-indigo-600" />
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Real-time API Monitor</h3>
             </div>
          </div>
          <div className="p-8 space-y-4 max-h-[600px] overflow-y-auto">
             {[
               { id: 1, type: 'GEO_CAPTURE', status: 'SUCCESS', target: 'GPS Navigator', msg: 'Localização obtida com sucesso', time: '14:20:05' },
               { id: 2, type: 'WA_SEND', status: 'SUCCESS', target: 'WhatsApp Cloud', msg: 'Confirmação enviada', time: '14:15:22' },
               { id: 3, type: 'BT_DISCOVER', status: 'ERROR', target: 'Bluetooth API', msg: 'Permissão negada pelo usuário', time: '14:10:00' },
             ].map(log => (
               <div key={log.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 transition-all">
                  <div className="flex items-center gap-4">
                     <div className={`p-2 rounded-xl ${log.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {log.type === 'GEO_CAPTURE' ? <MapPin size={14} /> : log.type === 'WA_SEND' ? <MessageSquare size={14} /> : <Bluetooth size={14} />}
                     </div>
                     <div>
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] font-black text-slate-800 uppercase">{log.type}</span>
                           <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${log.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{log.status}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase">{log.target} • {log.msg}</p>
                     </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{log.time}</span>
               </div>
             ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default IntegrationsView;
