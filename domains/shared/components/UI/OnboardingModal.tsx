
import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, BarChart3, Users, PlayCircle, X } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (role: string) => void;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onComplete, onClose }) => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');

  if (!isOpen) return null;

  const roles = [
    { id: 'admin', title: 'Administrador', icon: ShieldCheck, desc: 'Gestão total, BI e Segurança.' },
    { id: 'sales', title: 'Vendas / CRM', icon: BarChart3, desc: 'Focado em funil e WhatsApp.' },
    { id: 'technician', title: 'Técnico / IA', icon: Zap, desc: 'Consultoria e campo.' }
  ];

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-500" />
      
      <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300">
        <button onClick={onClose} className="absolute top-8 right-8 p-2 text-slate-400 hover:text-slate-900 transition-colors z-10">
          <X size={24} />
        </button>

        <div className="flex flex-col lg:flex-row min-h-[500px]">
          {/* Sidebar */}
          <div className="lg:w-1/3 bg-slate-900 p-10 text-white flex flex-col justify-between overflow-hidden relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-600/20 rounded-full blur-[60px]"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Sparkles size={24} />
              </div>
              <h2 className="text-3xl font-black italic mb-4 leading-tight">Bem-vindo ao SGC Pro.</h2>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                Vamos configurar seu ambiente de trabalho em poucos passos para você ser mais produtivo.
              </p>
            </div>
            
            <div className="flex gap-2 relative z-10">
              {[1, 2, 3].map(i => (
                <div key={i} className={`h-1.5 rounded-full transition-all ${step >= i ? 'w-8 bg-blue-600' : 'w-4 bg-slate-800'}`} />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-10 lg:p-16 flex flex-col justify-center">
            {step === 1 ? (
              <div className="space-y-8 animate-in slide-in-from-right-8 duration-300">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-800">Qual seu papel na empresa?</h3>
                  <p className="text-slate-500 text-sm font-medium">Isso personalizará sua dashboard e dicas da IA.</p>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {roles.map((r) => (
                    <button 
                      key={r.id}
                      onClick={() => setRole(r.id)}
                      className={`flex items-center gap-6 p-6 rounded-[2rem] border-2 text-left transition-all ${
                        role === r.id ? 'border-blue-600 bg-blue-50/50' : 'border-slate-100 hover:border-blue-200'
                      }`}
                    >
                      <div className={`p-4 rounded-2xl ${role === r.id ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400'}`}>
                        <r.icon size={24} />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 uppercase text-xs tracking-widest">{r.title}</h4>
                        <p className="text-xs text-slate-500 font-medium">{r.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>

                <button 
                  disabled={!role}
                  onClick={() => setStep(2)}
                  className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl disabled:opacity-50 hover:bg-blue-600 transition-all flex items-center justify-center gap-3"
                >
                  Continuar <ArrowRight size={18} />
                </button>
              </div>
            ) : step === 2 ? (
              <div className="space-y-8 animate-in slide-in-from-right-8 duration-300 text-center">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-6">
                  <PlayCircle size={48} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-800">Assista ao resumo de 1 min.</h3>
                  <p className="text-slate-500 text-sm font-medium">Veja como a IA Ricardo automatiza suas manutenções.</p>
                </div>
                
                <div className="aspect-video bg-slate-100 rounded-[2.5rem] flex items-center justify-center border border-slate-200 shadow-inner relative group cursor-pointer overflow-hidden">
                   <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-all"></div>
                   <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Vídeo Tutorial Em Breve</span>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setStep(1)} className="flex-1 py-4 text-[10px] font-black uppercase text-slate-400">Voltar</button>
                  <button onClick={() => setStep(3)} className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all">Entendido!</button>
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-in slide-in-from-right-8 duration-300">
                <div className="space-y-2">
                   <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 mb-4 border border-emerald-100">
                      <Zap size={32} />
                   </div>
                  <h3 className="text-2xl font-black text-slate-800">Tudo pronto!</h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">
                    Você começará com um checklist no Dashboard para guiar seus primeiros passos. Precisando de ajuda, clique no ícone "?" a qualquer momento.
                  </p>
                </div>

                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">Seus Primeiros Desafios</h4>
                  <div className="space-y-3">
                    {['Conectar seu WhatsApp', 'Adicionar um Lead no Funil', 'Configurar sua agenda'].map((task, i) => (
                      <div key={i} className="flex items-center gap-3 text-xs font-bold text-slate-700">
                        <div className="w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-300">
                          {i + 1}
                        </div>
                        {task}
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => onComplete(role)}
                  className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                >
                  Começar a Usar Agora <Sparkles size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
