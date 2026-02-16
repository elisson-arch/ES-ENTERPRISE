
import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Bot, User, Sparkles, AlertTriangle, Lightbulb, 
  Cpu, Zap, Brain, ChevronDown, Mic, MicOff, Loader2, 
  Camera, Globe, Search, Link as LinkIcon, Image as ImageIcon,
  CheckCircle2, AlertCircle, Wand2, Filter
} from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { Message } from '../types';

const AI_MODELS = [
  { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro', desc: 'Raciocínio Técnico Profundo', icon: <Brain size={14} className="text-indigo-500" /> },
  { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash', desc: 'Respostas Rápidas com Search', icon: <Zap size={14} className="text-amber-500" /> },
  { id: 'gemini-2.5-flash-lite-latest', name: 'Flash Lite', desc: 'Performance e Economia', icon: <Cpu size={14} className="text-emerald-500" /> }
];

const AIView = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', text: 'Olá! Sou o Ricardo, o assistente da ES Enterprise. Como posso agilizar sua operação técnica hoje?', timestamp: 'Agora' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0]);
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [thinkingMode, setThinkingMode] = useState(true);
  const [useSearch, setUseSearch] = useState(false);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [currentImageForEdit, setCurrentImageForEdit] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    
    if (isEditingImage && currentImageForEdit) {
      handleEditImage(userMsg);
      return;
    }

    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'agent', text: userMsg, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setIsTyping(true);

    try {
      let responseText = "";
      let groundingSources = [];

      if (useSearch && selectedModel.id === 'gemini-3-flash-preview') {
        const res = await geminiService.searchWeb(userMsg);
        responseText = res.text;
        groundingSources = res.sources;
      } else if (thinkingMode && selectedModel.id === 'gemini-3-pro-preview') {
        responseText = await geminiService.getDeepResponse(userMsg, "Manutenção e CRM");
      } else {
        responseText = await geminiService.getChatResponse(userMsg, "Consultoria Técnica", selectedModel.id);
      }

      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        sender: 'ai', 
        text: responseText || "Tive um problema ao processar. Tente novamente.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        groundingSources
      }]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleEditImage = async (prompt: string) => {
    if (!currentImageForEdit) return;
    setIsTyping(true);
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'agent', text: `Aplicando edição: ${prompt}`, timestamp: 'Agora' }]);
    
    try {
      const editedUrl = await geminiService.editImage(currentImageForEdit, "image/png", prompt);
      if (editedUrl) {
        setMessages(prev => [...prev, { id: (Date.now()+1).toString(), sender: 'ai', text: "Edição via Nano Banana concluída com sucesso.", imageUrl: editedUrl, timestamp: 'Agora' }]);
        setCurrentImageForEdit(editedUrl);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setCurrentImageForEdit(base64);
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        sender: 'agent', 
        text: `[Foto de campo enviada: ${file.name}]`, 
        timestamp: 'Agora', 
        imageUrl: base64 
      }]);
      
      setIsTyping(true);
      const analysis = await geminiService.analyzeFile(base64, file.type, "Identifique possíveis falhas nesta imagem técnica e sugira uma solução.");
      setMessages(prev => [...prev, { id: (Date.now()+1).toString(), sender: 'ai', text: analysis || "Erro na análise vision.", timestamp: 'Agora' }]);
      setIsTyping(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-slate-950 rounded-2xl flex items-center justify-center text-white shadow-2xl">
            <Bot size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-800 italic uppercase tracking-tighter leading-none">ES Enterprise Technical Brain</h2>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Multi-Model Google Generative AI v5.0</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setThinkingMode(!thinkingMode)}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all border ${thinkingMode ? 'bg-indigo-600 text-white border-indigo-500 shadow-xl' : 'bg-white text-slate-400 border-slate-100'}`}
          >
            <Brain size={16} className={thinkingMode ? 'animate-pulse' : ''} /> Deep Thinking
          </button>

          <button 
            onClick={() => setUseSearch(!useSearch)}
            disabled={selectedModel.id !== 'gemini-3-flash-preview'}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all border disabled:opacity-20 ${useSearch ? 'bg-amber-500 text-white border-amber-400 shadow-xl' : 'bg-white text-slate-400 border-slate-100'}`}
          >
            <Globe size={16} /> Search
          </button>

          <div className="relative">
            <button onClick={() => setShowModelMenu(!showModelMenu)} className="flex items-center gap-4 px-6 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-indigo-300 transition-all">
              {selectedModel.icon}
              <span className="text-[10px] font-black uppercase text-slate-800">{selectedModel.name}</span>
              <ChevronDown size={14} className={`text-slate-300 transition-transform ${showModelMenu ? 'rotate-180' : ''}`} />
            </button>
            {showModelMenu && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-slate-100 rounded-3xl shadow-2xl z-[100] py-3 overflow-hidden animate-in fade-in zoom-in-95">
                {AI_MODELS.map(m => (
                  <button key={m.id} onClick={() => { setSelectedModel(m); setShowModelMenu(false); }} className={`w-full px-6 py-4 flex items-center gap-5 hover:bg-slate-50 text-left transition-colors ${selectedModel.id === m.id ? 'bg-indigo-50/50' : ''}`}>
                    <div className={`p-2.5 rounded-xl ${selectedModel.id === m.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                      {m.icon}
                    </div>
                    <div>
                       <p className="text-[11px] font-black text-slate-800 uppercase">{m.name}</p>
                       <p className="text-[9px] text-slate-400 font-bold uppercase leading-tight">{m.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 bg-white rounded-[3.5rem] border border-slate-100 shadow-sm flex flex-col overflow-hidden relative">
        <div className="flex-1 p-10 overflow-y-auto space-y-10 custom-scrollbar" ref={scrollRef}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-5 ${msg.sender === 'agent' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-12 h-12 rounded-[1.25rem] flex items-center justify-center shrink-0 shadow-lg ${msg.sender === 'agent' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                {msg.sender === 'ai' ? <Bot size={24} /> : <User size={24} />}
              </div>
              <div className={`max-w-[80%] space-y-4`}>
                <div className={`p-8 rounded-[2.5rem] shadow-sm leading-relaxed ${msg.sender === 'agent' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100'}`}>
                  {msg.imageUrl && (
                    <div className="relative group mb-6">
                      <img src={msg.imageUrl} className="w-full max-h-[400px] object-contain rounded-3xl shadow-2xl border-4 border-white" alt="Anexo" />
                      <div className="absolute top-4 right-4 flex gap-2">
                        <button onClick={() => { setIsEditingImage(true); setCurrentImageForEdit(msg.imageUrl || null); }} className="p-3 bg-white/90 backdrop-blur rounded-2xl text-indigo-600 shadow-xl hover:scale-110 transition-transform">
                          <Wand2 size={20} />
                        </button>
                      </div>
                    </div>
                  )}
                  <p className="text-sm font-semibold whitespace-pre-wrap">{msg.text}</p>
                </div>
                
                {msg.groundingSources && msg.groundingSources.length > 0 && (
                  <div className="flex flex-wrap gap-2 px-2">
                    {msg.groundingSources.map((s, i) => (
                      <a key={i} href={s.uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-[9px] font-black uppercase text-blue-600 hover:bg-blue-50 transition-all shadow-sm">
                        <LinkIcon size={12} /> {s.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-5 animate-pulse">
               <div className="w-12 h-12 rounded-[1.25rem] bg-slate-100 flex items-center justify-center border border-slate-200">
                 <Bot size={24} className="text-slate-300" />
               </div>
               <div className="bg-slate-50 p-8 rounded-[2.5rem] rounded-tl-none border border-slate-100 flex items-center gap-6">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">
                    {thinkingMode ? 'Executando raciocínio profundo...' : 'Processando...'}
                  </span>
               </div>
            </div>
          )}
        </div>

        {isEditingImage && (
          <div className="px-10 py-4 bg-indigo-50 border-t border-indigo-100 flex items-center justify-between animate-in slide-in-from-bottom-2">
             <div className="flex items-center gap-4">
                <div className="p-2 bg-indigo-600 text-white rounded-xl"><Wand2 size={16}/></div>
                <p className="text-[10px] font-black uppercase text-indigo-900 tracking-widest">Nano Banana: Modo Edição de Imagem Ativo</p>
             </div>
             <button onClick={() => { setIsEditingImage(false); setCurrentImageForEdit(null); }} className="text-[10px] font-black uppercase text-indigo-400 hover:text-indigo-600">Cancelar</button>
          </div>
        )}

        <div className="p-10 border-t border-slate-50 bg-white">
          <div className="max-w-5xl mx-auto flex gap-6 bg-slate-50 p-4 rounded-[3rem] border border-slate-200 focus-within:ring-8 focus-within:ring-indigo-500/5 focus-within:border-indigo-500 transition-all shadow-inner">
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
            <button onClick={() => fileInputRef.current?.click()} className="p-5 bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 rounded-[1.5rem] transition-all shadow-sm">
               <Camera size={24} />
            </button>
            <input 
              type="text" 
              placeholder={isEditingImage ? "Ex: 'Adicione um filtro retrô' ou 'Remova o fundo'..." : "Descreva uma falha técnica ou peça uma consultoria..."} 
              className="flex-1 bg-transparent px-4 text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="p-5 bg-slate-950 text-white rounded-[1.5rem] shadow-2xl hover:bg-black active:scale-95 transition-all disabled:opacity-30"
            >
              <Send size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIView;