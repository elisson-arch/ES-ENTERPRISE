
import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, CheckCheck, Bot, Clock, Info, Languages } from 'lucide-react';
import { Message } from '@shared/types/common.types';
import { useTranslation } from '@shared/hooks/useTranslation';

interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, isTyping }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, msgId: string } | null>(null);
  const { isAutoTranslateEnabled, translateMessage } = useTranslation();
  const [translatedMessages, setTranslatedMessages] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isAutoTranslateEnabled) {
      messages.forEach(async (msg) => {
        if (!translatedMessages[msg.id]) {
          const translated = await translateMessage(msg);
          if (translated !== msg.text) {
            setTranslatedMessages(prev => ({ ...prev, [msg.id]: translated }));
          }
        }
      });
    }
  }, [messages, isAutoTranslateEnabled]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleContextMenu = (e: React.MouseEvent, msgId: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, msgId });
  };

  useEffect(() => {
    const closeMenu = () => setContextMenu(null);
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, []);

  const renderStatusIcon = (status?: string) => {
    if (!status) return null;
    switch (status) {
      case 'sending': return <Clock size={10} className="text-slate-400 animate-pulse" />;
      case 'sent': return <Check size={12} className="text-slate-400 opacity-60" />;
      case 'delivered': return <CheckCheck size={12} className="text-slate-400" />;
      case 'read': return <CheckCheck size={12} className="text-blue-500" />;
      default: return null;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50/30 relative">
      <AnimatePresence initial={false}>
        {messages.map((msg, index) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20,
              delay: index === messages.length - 1 ? 0 : 0 
            }}
            className={`flex ${msg.sender === 'client' ? 'justify-start' : 'justify-end'}`}
            onContextMenu={(e) => handleContextMenu(e, msg.id)}
          >
            <div className={`max-w-[80%] p-4 rounded-[2rem] shadow-mid relative group transition-all duration-300 ${msg.sender === 'client'
              ? 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
              : msg.sender === 'ai'
                ? 'bg-gradient-to-br from-indigo-600 to-violet-700 text-white rounded-tr-none shadow-indigo-500/20'
                : 'bg-slate-800 text-white rounded-tr-none shadow-slate-900/10'
              }`}>
              {msg.audioUrl ? (
                <div className="py-1 min-w-[220px]">
                  <audio src={msg.audioUrl} controls className="w-full h-8 opacity-90 invert brightness-200" />
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-[0.9rem] font-medium mb-1 whitespace-pre-wrap leading-relaxed tracking-tight">
                    {translatedMessages[msg.id] || msg.text}
                  </p>
                  {translatedMessages[msg.id] && translatedMessages[msg.id] !== msg.text && (
                    <div className="flex items-center gap-1 opacity-40 text-[9px] font-black uppercase tracking-tighter mt-1 border-t border-current/10 pt-1">
                      <Languages size={10} /> Traduzido do original
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between items-center gap-2 mt-3 h-3 px-1">
                <span className={`text-[8px] uppercase font-black tracking-widest opacity-60 ${msg.sender === 'client' ? 'text-slate-400' : 'text-slate-100'}`}>
                  {msg.timestamp}
                </span>
                {msg.sender !== 'client' && (
                  <div className="flex items-center">
                    {renderStatusIcon(msg.status)}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {contextMenu && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bg-white/80 backdrop-blur-xl border border-white/20 rounded-[2rem] shadow-2xl z-[1000] p-6 min-w-[240px]"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Info size={12} /> Histórico de Entrega
          </p>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-600">
              <span className="flex items-center gap-2"><Check size={12} className="text-slate-400" /> Enviado</span>
              <span className="text-slate-400 font-mono">14:20:05</span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-600">
              <span className="flex items-center gap-2"><CheckCheck size={12} className="text-slate-400" /> Entregue</span>
              <span className="text-slate-400 font-mono">14:20:12</span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-600">
              <span className="flex items-center gap-2"><CheckCheck size={12} className="text-blue-500" /> Lido</span>
              <span className="text-slate-400 font-mono">14:25:44</span>
            </div>
          </div>
        </motion.div>
      )}

      {isTyping && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex justify-start"
        >
          <div className="bg-white/70 backdrop-blur-md p-4 rounded-[2rem] rounded-tl-none border border-white/40 shadow-mid flex items-center gap-3">
            <Bot size={18} className="text-indigo-600 animate-bounce" />
            <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400">Analisando contexto...</span>
          </div>
        </motion.div>
      )}
      <div ref={scrollRef} />
    </div>
  );
};
