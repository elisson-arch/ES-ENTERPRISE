
import React from 'react';
import { Shield, ArrowLeft, Lock, Eye, FileText, Globe, Mail, Users, Home } from 'lucide-react';
// Correct standard v6 import
import { useNavigate } from 'react-router-dom';

const PrivacyPolicyView = () => {
  const navigate = useNavigate();
  const lastUpdate = "22 de Maio de 2024";

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-blue-100 selection:text-blue-900">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate('/')}
          className="group flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all mb-8 bg-white px-5 py-2.5 rounded-full shadow-md border border-slate-100 hover:border-blue-200 active:scale-95"
        >
          <Home size={18} className="group-hover:scale-110 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest">Início / Menu</span>
        </button>

        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
          <div className="bg-slate-900 p-10 sm:p-16 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-20 opacity-10 rotate-12">
              <Shield size={200} />
            </div>
            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 rounded-full border border-white/10">
                <Shield size={14} className="text-blue-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Conformidade & Transparência</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black italic tracking-tighter leading-none">Política de Privacidade</h1>
              <p className="text-slate-400 text-sm font-medium">ES Enterprise - CRM & Website Builder</p>
              <div className="pt-4 flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                <span className="flex items-center gap-1.5"><Lock size={12}/> AES-256 Enabled</span>
                <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                <span>Atualizado em: {lastUpdate}</span>
              </div>
            </div>
          </div>

          <div className="p-8 sm:p-16 space-y-12">
            <section className="space-y-4">
              <h2 className="text-xl font-black text-slate-800 uppercase italic tracking-tighter flex items-center gap-3">
                <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div> 1. Quem somos
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                O ES Enterprise é um sistema de gestão empresarial avançado desenvolvido pela <strong>ES Climatização</strong>. Nosso objetivo é oferecer soluções inteligentes para gestão de clientes, ativos, documentos e integrações robustas com serviços Google Workspace para o mercado corporativo.
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-xl font-black text-slate-800 uppercase italic tracking-tighter flex items-center gap-3">
                <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div> 2. Quais dados coletamos
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: 'Dados de Clientes', desc: 'Nome, e-mail, telefone, endereço, tipo de cliente e origem.', icon: <Users size={18}/> },
                  { title: 'Dados de Ativos', desc: 'Marca, modelo, número de série e histórico de manutenção.', icon: <FileText size={18}/> },
                  { title: 'Dados de Autenticação', desc: 'Tokens de acesso Google OAuth e permissões concedidas.', icon: <Lock size={18}/> },
                  { title: 'Dados de Uso', desc: 'Histórico de conversas, logs de acesso e preferências.', icon: <Eye size={18}/> }
                ].map((item, i) => (
                  <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-4">
                    <div className="p-3 bg-white rounded-xl text-blue-600 shadow-sm">{item.icon}</div>
                    <div>
                      <h4 className="text-xs font-black text-slate-800 uppercase mb-1">{item.title}</h4>
                      <p className="text-[11px] text-slate-500 leading-tight font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-black text-slate-800 uppercase italic tracking-tighter flex items-center gap-3">
                <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div> 3. Como usamos os dados
              </h2>
              <ul className="space-y-3">
                {[
                  "Gestão e organização centralizada de clientes e ativos da empresa.",
                  "Integração e sincronização automática com Google Workspace (Drive, Contacts, Calendar).",
                  "Geração inteligente de relatórios, orçamentos e documentos técnicos.",
                  "Melhoria contínua da experiência do usuário e suporte personalizado via IA.",
                  "Garantia de segurança, auditoria e conformidade com normas LGPD/GDPR."
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                    <div className="mt-1.5 w-1.5 h-1.5 bg-blue-400 rounded-full shrink-0"></div>
                    {text}
                  </li>
                ))}
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-black text-slate-800 uppercase italic tracking-tighter flex items-center gap-3">
                <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div> 4. Segurança e Direitos
              </h2>
              <div className="bg-blue-50 p-8 rounded-[2rem] border border-blue-100">
                <p className="text-sm text-blue-900 leading-relaxed font-semibold italic">
                  "Utilizamos criptografia de nível militar, autenticação multifator (2FA) e backups regulares para proteger suas informações no ecossistema ES Enterprise. O usuário pode solicitar acesso, correção ou exclusão de seus dados a qualquer momento."
                </p>
              </div>
            </section>

            <section className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Contato Encarregado</h4>
                  <p className="text-sm font-bold text-slate-800">elisson@esarcondicionado.com</p>
                </div>
              </div>
              <div className="flex gap-4">
                 <button className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2">
                   <Globe size={16} /> Website Oficial
                 </button>
              </div>
            </section>
          </div>
        </div>

        <p className="mt-12 text-center text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">
          ES Enterprise • 2024 Privacy Standard
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicyView;