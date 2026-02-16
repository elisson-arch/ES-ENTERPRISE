
import React from 'react';
import { StopCircle } from 'lucide-react';

interface CallOverlayProps {
  isActive: boolean;
  clientName: string;
  timer: string;
  onStop: () => void;
}

export const CallOverlay: React.FC<CallOverlayProps> = ({ isActive, clientName, timer, onStop }) => {
  if (!isActive) return null;

  return (
    <div className="absolute inset-0 z-[100] bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center text-white animate-in fade-in duration-300">
      <div className="w-32 h-32 rounded-full bg-blue-600 flex items-center justify-center text-4xl font-black mb-4 animate-pulse shadow-2xl">
        {clientName.charAt(0)}
      </div>
      <h2 className="text-2xl font-bold mb-1">{clientName}</h2>
      <div className="flex items-center gap-3 text-blue-400 mb-12">
        <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
        <span className="font-mono text-xl">{timer}</span>
        <span className="text-xs uppercase font-black opacity-50 tracking-widest ml-2">Gravando...</span>
      </div>
      <button 
        onClick={onStop} 
        className="p-6 bg-red-600 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all group"
      >
        <StopCircle size={32} className="group-hover:rotate-90 transition-transform duration-300" />
      </button>
    </div>
  );
};
