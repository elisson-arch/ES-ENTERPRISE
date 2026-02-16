
import React, { useRef } from 'react';
import { Smile, Paperclip, Send, Loader2, Mic, Square, Camera } from 'lucide-react';

interface MessageInputProps {
  value: string;
  onChange: (val: string) => void;
  onSend: (text: string) => void;
  onOpenUpload: () => void;
  isSending: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  isRecording: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({ 
  value, 
  onChange, 
  onSend, 
  onOpenUpload, 
  isSending,
  onStartRecording,
  onStopRecording,
  isRecording
}) => {
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend(value);
    }
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Aqui poderíamos enviar o arquivo diretamente ou abrir um preview
      // Por simplicidade, vamos apenas simular o envio ou alertar
      const reader = new FileReader();
      reader.onload = () => {
        onSend(`[Foto capturada: ${file.name}]`);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-3 md:p-4 bg-white border-t border-slate-200">
      <div className="flex items-center gap-2 md:gap-3 max-w-5xl mx-auto">
        <div className="flex gap-1 md:gap-2">
          <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors hidden sm:block">
            <Smile size={24} />
          </button>
          <button 
            onClick={onOpenUpload} 
            className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
            title="Anexar arquivo"
          >
            <Paperclip size={24} />
          </button>
          
          <input 
            type="file" 
            accept="image/*" 
            capture="environment" 
            className="hidden" 
            ref={cameraInputRef}
            onChange={handleCameraCapture}
          />
          <button 
            onClick={() => cameraInputRef.current?.click()}
            className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
            title="Tirar Foto"
          >
            <Camera size={24} />
          </button>
        </div>
        
        <div className="flex-1 relative">
          <input 
            type="text" 
            placeholder={isRecording ? "Gravando áudio..." : "Digite uma mensagem..."} 
            disabled={isRecording}
            className={`w-full bg-slate-100 rounded-2xl px-4 md:px-5 py-2.5 md:py-3 text-sm outline-none border-2 transition-all ${
              isRecording 
                ? 'border-red-200 bg-red-50 text-red-600 font-bold animate-pulse' 
                : 'border-transparent focus:border-blue-300 focus:bg-white text-slate-700 shadow-inner'
            }`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          {isRecording && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-600 rounded-full animate-ping"></span>
              <span className="text-[10px] font-black uppercase tracking-widest text-red-600">REC</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button 
            onMouseDown={onStartRecording}
            onMouseUp={onStopRecording}
            onMouseLeave={onStopRecording}
            onTouchStart={onStartRecording}
            onTouchEnd={onStopRecording}
            className={`p-2.5 md:p-3 rounded-full transition-all ${
              isRecording 
                ? 'bg-red-600 text-white shadow-lg shadow-red-200 scale-125' 
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200 active:scale-95'
            }`}
            title="Segure para gravar"
          >
            {isRecording ? <Square size={20} fill="currentColor" /> : <Mic size={20} />}
          </button>

          <button 
            disabled={isSending || (!value.trim() && !isRecording)}
            onClick={() => onSend(value)}
            className={`p-2.5 md:p-3 rounded-xl transition-all shadow-lg ${
              !value.trim() && !isRecording
                ? 'bg-slate-100 text-slate-300 shadow-none' 
                : 'bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700 active:scale-95'
            }`}
          >
            {isSending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};
