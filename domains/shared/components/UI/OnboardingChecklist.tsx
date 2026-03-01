import React from 'react';
import { CheckCircle2, Circle, ArrowRight, Zap, Gift } from 'lucide-react';
import { OnboardingTask } from '../../types';
// Fix: Import Link from react-router-dom to resolve export error
import { Link } from 'react-router-dom';

interface OnboardingChecklistProps {
  tasks: OnboardingTask[];
  onTaskClick?: (id: string) => void;
}

export const OnboardingChecklist: React.FC<OnboardingChecklistProps> = ({ tasks }) => {
  const completedCount = tasks.filter(t => t.isCompleted).length;
  const progress = Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
        <Zap size={100} />
      </div>

      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h3 className="text-lg font-black text-slate-800 italic uppercase tracking-tighter flex items-center gap-2">
            Missão Inicial <Zap size={18} className="text-amber-500 fill-amber-500" />
          </h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Complete os passos e libere novos recursos</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-blue-600 tracking-tighter">{progress}%</p>
          <p className="text-[9px] font-black text-slate-400 uppercase">Concluído</p>
        </div>
      </header>

      <div className="w-full bg-slate-50 h-3 rounded-full mb-8 overflow-hidden border border-slate-100">
        <div 
          className="bg-blue-600 h-full rounded-full transition-all duration-1000 shadow-lg shadow-blue-200" 
          style={{ width: `${progress}%` }} 
        />
      </div>

      <div className="space-y-4">
        {tasks.map(task => (
          <Link 
            to={task.link}
            key={task.id} 
            className={`flex items-center gap-4 p-4 rounded-2xl transition-all border ${
              task.isCompleted ? 'bg-emerald-50/30 border-emerald-100 opacity-60' : 'bg-white border-slate-100 hover:border-blue-200 hover:shadow-md'
            }`}
          >
            <div className={task.isCompleted ? 'text-emerald-500' : 'text-slate-200'}>
              {task.isCompleted ? <CheckCircle2 size={24} /> : <Circle size={24} />}
            </div>
            <div className="flex-1">
              <h4 className={`text-xs font-black uppercase tracking-tight ${task.isCompleted ? 'text-slate-400' : 'text-slate-700'}`}>
                {task.title}
              </h4>
              <p className="text-[10px] text-slate-400 font-medium">{task.description}</p>
            </div>
            {!task.isCompleted && <ArrowRight size={16} className="text-blue-600 animate-pulse" />}
          </Link>
        ))}
      </div>

      {progress === 100 && (
        <div className="mt-8 p-6 bg-emerald-600 rounded-[2rem] text-white flex items-center gap-4 animate-in slide-in-from-bottom-4">
          <div className="p-3 bg-white/20 rounded-2xl">
            <Gift size={24} />
          </div>
          <div>
             <h4 className="text-sm font-black uppercase italic">Mestre do CRM!</h4>
             <p className="text-[10px] font-medium opacity-90">Você concluiu seu treinamento básico com sucesso.</p>
          </div>
        </div>
      )}
    </div>
  );
};