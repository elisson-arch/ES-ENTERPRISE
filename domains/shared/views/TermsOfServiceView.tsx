import React from 'react';
import { Gavel, ArrowLeft, FileCheck, Scale, ShieldAlert, Globe, Mail, BookOpen, UserCircle, Zap, Copyright, Ban, Home } from 'lucide-react';
// Fix: Import useNavigate from react-router to resolve export error
import { useNavigate } from 'react-router';

const TermsOfServiceView = () => {
  const navigate = useNavigate();
  const lastUpdate = "22 de Maio de 2024";

  const sections = [
    {
      id: "1",
      title: "Aceitação dos Termos",
      content: "Ao acessar ou utilizar o ES Enterprise, você concorda expressamente com estes Termos de Serviço e com a nossa Política de Privacidade. O uso da plataforma implica na aceitação plena de todas as condições aqui estabelecidas.",
      icon: <FileCheck size={20} />
    },
    {
      id: "2",
      title: "Descrição do Serviço",
      content: "O ES Enterprise é uma plataforma SaaS (Software as a Service) de gestão empresarial que integra funcionalidades de CRM, gestão de ativos, sincronização com Google Workspace, automações inteligentes e relatórios analíticos para o setor de manutenção.",
      icon: <BookOpen size={20} />
    },
    {
      id: "3",
      title: "Cadastro e Conta de Usuário",
      content: "A autenticação é realizada via Google Workspace. O usuário é o único responsável pela confidencialidade de suas credenciais e por todas as atividades que ocorram sob sua conta empresarial.",
      icon: <UserCircle size={20} />
    },
    {
      id: "4",
      title: "Uso Permitido",
      content: "A plataforma deve ser utilizada estritamente para fins profissionais e comerciais legítimos. É proibida qualquer atividade que viole leis locais, direitos de propriedade ou que tente comprometer a integridade técnica do sistema ES Enterprise.",
      icon: <Scale size={20} />
    },
    {
      id: "5",
      title: "Integração com Serviços Externos",
      content: "O ES Enterprise utiliza APIs oficiais do Google para sincronização de dados. Ao ativar estas funções, você autoriza o aplicativo a ler e gravar as informações necessárias para o funcionamento dos módulos de Agenda, Drive e Contatos.",
      icon: <Zap size={20} />
    },
    {
      id: "6",
      title: "Propriedade Intelectual",
      content: "Todo o código-fonte, design, logotipos, algoritmos de IA e ativos visuais do ES Enterprise são de propriedade exclusiva da ES Climatização. A reprodução total ou parcial sem autorização prévia é estritamente proibida.",
      icon: <Copyright size={20} />
    },
    {
      id: "7",
      title: "Limitação de Responsabilidade",
      content: "A plataforma é fornecida 'como está'. Embora busquemos 99.9% de uptime para o nível Enterprise, não garantimos que o serviço será ininterrupto. Não nos responsabilizamos por perdas de dados resultantes de falhas na conexão do usuário ou serviços de terceiros.",
      icon: <ShieldAlert size={20} />
    },
    {
      id: "10",
      title: "Cancelamento e Encerramento",
      content: "O usuário pode solicitar o encerramento de sua conta a qualquer momento. Reservamo-nos o direito de suspender acessos que violem estes termos ou por motivos estratégicos comerciais, mediante aviso prévio.",
      icon: <Ban size={20} />
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate('/')}
          className="group flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-all mb-8 bg-white px-5 py-2.5 rounded-full shadow-md border border-slate-100 hover:border-indigo-200 active:scale-95"
        >
          <Home size={18} className="group-hover:scale-110 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest">Início / Menu</span>
        </button>

        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
          <div className="bg-slate-900 p-10 sm:p-16 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-20 opacity-10 rotate-12">
              <Gavel size={200} />
            </div>
            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 rounded-full border border-white/10">
                <Gavel size={14} className="text-indigo-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Acordo de Utilização</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black italic tracking-tighter leading-none">Termos de Serviço</h1>
              <p className="text-slate-400 text-sm font-medium">ES Enterprise - Management System</p>
              <div className="pt-4 flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                <span>Versão 2.1.0</span>
                <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                <span>Última revisão: {lastUpdate}</span>
              </div>
            </div>
          </div>

          <div className="p-8 sm:p-16 space-y-12">
            <div className="grid grid-cols-1 gap-8">
              {sections.map((section) => (
                <section key={section.id} className="group p-6 rounded-[2rem] hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white rounded-2xl text-indigo-600 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                      {section.icon}
                    </div>
                    <h2 className="text-lg font-black text-slate-800 uppercase italic tracking-tighter">
                      {section.id}. {section.title}
                    </h2>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed font-medium pl-2 border-l-2 border-slate-100 group-hover:border-indigo-200 transition-all">
                    {section.content}
                  </p>
                </section>
              ))}
            </div>

            <section className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Suporte Jurídico</h4>
                  <p className="text-sm font-bold text-slate-800">elisson@esarcondicionado.com</p>
                </div>
              </div>
              <div className="flex gap-4">
                 <button onClick={() => navigate('/privacy')} className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
                   Política de Privacidade
                 </button>
                 <button className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2">
                   <Globe size={16} /> Site Corporativo
                 </button>
              </div>
            </section>
          </div>
        </div>

        <p className="mt-12 text-center text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">
          ES Enterprise Cloud Infrastructure • 2024 Legal Standard
        </p>
      </div>
    </div>
  );
};

export default TermsOfServiceView;