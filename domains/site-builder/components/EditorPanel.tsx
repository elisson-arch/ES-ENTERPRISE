import React, { useState } from 'react';
import { 
  Settings2, Trash2, AlignLeft, AlignCenter, AlignRight, Layout, Palette, 
  Type as TypeIcon, MousePointer2, Image as ImageIcon, Sparkles, Loader2,
  Maximize2
} from 'lucide-react';
import { SiteElement } from '@shared/types/common.types';
import { geminiService } from '@domains/ai/services/geminiService';

interface EditorPanelProps {
  selectedElement: SiteElement | null;
  updateElement: (id: string, updates: Partial<SiteElement>) => void;
  onDelete: (id: string) => void;
}

// Fixed: Correct supported aspect ratios for nano banana series models (gemini-3-pro-image-preview)
const ASPECT_RATIOS = ["1:1", "4:3", "3:4", "16:9", "9:16"];

export const EditorPanel: React.FC<EditorPanelProps> = ({ 
  selectedElement, 
  updateElement,
  onDelete
}) => {
  const [imagePrompt, setImagePrompt] = useState('');
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const [selectedRatio, setSelectedRatio] = useState("16:9");

  const generateAIImage = async () => {
    if (!imagePrompt) return;
    setIsGeneratingImg(true);
    try {
      const url = await geminiService.generateImage(imagePrompt, selectedRatio);
      if (url && selectedElement) {
        const newContent = { ...selectedElement.content, heroImage: url };
        updateElement(selectedElement.id, { content: newContent });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingImg(false);
    }
  };

  if (!selectedElement) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-4 opacity-40 py-20">
        <MousePointer2 size={48} />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-center max-w-[150px]">Selecione um bloco para configurar</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 h-full pb-20">
      <div className="p-4 bg-indigo-50 rounded-2xl flex items-center gap-3 border border-indigo-100">
         <Settings2 size={20} className="text-indigo-600" />
         <div>
           <h4 className="text-[10px] font-black uppercase text-indigo-800 tracking-widest">{selectedElement.type} Config</h4>
           <p className="text-[8px] font-bold text-indigo-400 uppercase">ID: {selectedElement.id}</p>
         </div>
      </div>

      <div className="space-y-6">
        {/* IMAGE GENERATION BOX */}
        {selectedElement.type === 'HERO' && (
          <div className="p-6 bg-slate-900 rounded-[2rem] border border-white/10 space-y-4 shadow-xl">
             <div className="flex items-center gap-2 text-indigo-400">
                <Sparkles size={16} className="animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest">IA Image Generator</span>
             </div>
             
             <div className="space-y-2">
                <label className="text-[8px] font-black uppercase text-slate-500 ml-1">Proporção (Aspect Ratio)</label>
                <div className="grid grid-cols-5 gap-1.5">
                   {ASPECT_RATIOS.map(ratio => (
                     <button 
                       key={ratio} 
                       onClick={() => setSelectedRatio(ratio)}
                       className={`py-1.5 rounded-lg text-[8px] font-black border transition-all ${selectedRatio === ratio ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'}`}
                     >
                       {ratio}
                     </button>
                   ))}
                </div>
             </div>

             <textarea 
               placeholder="Descreva a imagem que deseja gerar..." 
               className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-[10px] font-bold text-white h-24 outline-none focus:border-indigo-500"
               value={imagePrompt}
               onChange={e => setImagePrompt(e.target.value)}
             />
             <button 
               onClick={generateAIImage}
               disabled={isGeneratingImg || !imagePrompt}
               className="w-full py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
             >
               {isGeneratingImg ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />} 
               Gerar com Gemini 3 Pro
             </button>
          </div>
        )}

        {/* CONTENT EDITING */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Textos da Seção</label>
          {Object.keys(selectedElement.content).map(key => {
            const val = selectedElement.content[key];
            if (typeof val === 'string' && !val.startsWith('data:image')) {
              return (
                <div key={key} className="space-y-1.5">
                   <span className="text-[8px] font-bold text-slate-400 uppercase ml-1">{key}</span>
                   <textarea 
                     className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 min-h-[80px] outline-none focus:border-indigo-500 transition-all resize-none shadow-inner"
                     value={val}
                     onChange={(e) => {
                       const newContent = { ...selectedElement.content, [key]: e.target.value };
                       updateElement(selectedElement.id, { content: newContent });
                     }}
                   />
                </div>
              );
            }
            return null;
          })}
        </div>

        {/* STYLE EDITING */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Layout & Estilo</label>
          
          <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl">
            {[
              { id: 'left', icon: AlignLeft },
              { id: 'center', icon: AlignCenter },
              { id: 'right', icon: AlignRight }
            ].map(align => (
              <button 
                key={align.id}
                onClick={() => updateElement(selectedElement.id, { styles: { ...selectedElement.styles, textAlign: align.id } })}
                className={`flex-1 py-2 rounded-xl transition-all flex justify-center ${selectedElement.styles.textAlign === align.id ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <align.icon size={16} />
              </button>
            ))}
          </div>

          <div className="space-y-3">
             <div className="flex items-center justify-between">
                <span className="text-[8px] font-black uppercase text-slate-400">Colunas Desktop</span>
                <span className="text-xs font-black text-indigo-600">{selectedElement.styles.columns || 1}</span>
             </div>
             <input 
                type="range" min="1" max="4" 
                className="w-full accent-indigo-600 h-1.5 bg-slate-100 rounded-full"
                value={selectedElement.styles.columns || 1}
                onChange={(e) => updateElement(selectedElement.id, { styles: { ...selectedElement.styles, columns: parseInt(e.target.value) } })}
              />
          </div>

          <button 
            onClick={() => updateElement(selectedElement.id, { styles: { ...selectedElement.styles, backgroundGradient: !selectedElement.styles.backgroundGradient } })}
            className={`w-full py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest border transition-all flex items-center justify-center gap-2 ${selectedElement.styles.backgroundGradient ? 'bg-indigo-50 border-indigo-200 text-indigo-600 shadow-inner' : 'bg-white border-slate-100 text-slate-400'}`}
          >
            <Maximize2 size={14} /> Background Gradient
          </button>
        </div>
      </div>

      <button 
        onClick={() => onDelete(selectedElement.id)}
        className="w-full py-5 border-2 border-dashed border-red-50 text-red-500 rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:bg-red-50 hover:border-red-200 transition-all flex items-center justify-center gap-2"
      >
        <Trash2 size={16}/> Destruir Seção
      </button>
    </div>
  );
};
