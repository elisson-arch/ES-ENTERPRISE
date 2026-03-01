
import React from 'react';
import { 
  NavbarRenderer, 
  HeroRenderer, 
  FeatureRenderer, 
  PricingRenderer, 
  FooterRenderer 
} from './Renderers';
import { SiteDNA, SiteElement } from '../../types';
import { 
  ArrowUp, 
  ArrowDown, 
  Trash2,
  Box
} from 'lucide-react';

const rendererMap: Record<string, React.FC<any>> = {
  NAVBAR: NavbarRenderer,
  HERO: HeroRenderer,
  FEATURES: FeatureRenderer,
  PRICING: PricingRenderer,
  FOOTER: FooterRenderer,
};

interface CanvasProps {
  siteData: SiteDNA;
  sections: SiteElement[];
  selectedId?: string | null;
  onSelectElement?: (section: SiteElement) => void;
  onMoveSection?: (index: number, direction: 'up' | 'down') => void;
  onDeleteSection?: (id: string) => void;
  readOnly?: boolean;
}

export const Canvas: React.FC<CanvasProps> = ({ 
  siteData, 
  sections,
  selectedId = null, 
  onSelectElement,
  onMoveSection,
  onDeleteSection,
  readOnly = false
}) => {
  return (
    <div 
      className={`builder-canvas bg-white min-h-full transition-all duration-500 relative overflow-hidden ${!readOnly ? 'rounded-[3rem] shadow-2xl' : ''}`}
      style={{ 
        '--primary-color': siteData.theme.primaryColor,
        '--bg-color': siteData.theme.backgroundColor,
        '--text-color': siteData.theme.textColor,
        '--radius': siteData.theme.borderRadius,
        fontFamily: siteData.theme.fontFamily
      } as React.CSSProperties}
    >
      {sections.map((section, index) => {
        const RendererComponent = rendererMap[section.type];
        const isSelected = !readOnly && selectedId === section.id;
        
        if (!RendererComponent) return null;

        return (
          <div 
            key={section.id} 
            onClick={(e) => { 
              if (readOnly || !onSelectElement) return;
              e.stopPropagation(); 
              onSelectElement(section); 
            }}
            className={`group relative transition-all duration-500 ${!readOnly ? 'cursor-pointer' : ''} ${
              isSelected ? 'ring-8 ring-indigo-500/20 ring-inset shadow-2xl z-20 scale-[1.01]' : !readOnly ? 'hover:ring-2 hover:ring-slate-100' : ''
            }`}
          >
            <RendererComponent content={section.content} styles={section.styles} theme={siteData.theme} />
            
            {/* Controles Flutuantes Pro - Escondidos em readOnly */}
            {!readOnly && (
              <div className="absolute top-6 left-6 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all z-50 transform -translate-x-2 group-hover:translate-x-0">
                <div className="bg-slate-900 text-white rounded-2xl shadow-2xl p-1.5 flex flex-col gap-1 border border-white/10">
                   <button onClick={(e) => { e.stopPropagation(); onMoveSection?.(index, 'up'); }} className="p-2 hover:bg-white/10 rounded-xl transition-all"><ArrowUp size={16}/></button>
                   <button onClick={(e) => { e.stopPropagation(); onMoveSection?.(index, 'down'); }} className="p-2 hover:bg-white/10 rounded-xl transition-all"><ArrowDown size={16}/></button>
                   <div className="h-px bg-white/10 mx-1"></div>
                   <button onClick={(e) => { e.stopPropagation(); onDeleteSection?.(section.id); }} className="p-2 hover:bg-red-500 rounded-xl transition-all"><Trash2 size={16}/></button>
                </div>
              </div>
            )}

            {isSelected && (
              <div className="absolute top-6 right-6 px-4 py-2 bg-indigo-600 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl animate-in zoom-in">
                Modo Edição: {section.type}
              </div>
            )}
          </div>
        );
      })}

      {sections.length === 0 && !readOnly && (
        <div className="py-40 text-center space-y-6 flex flex-col items-center">
           <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 border-2 border-dashed border-slate-200">
             <Box size={48} />
           </div>
           <div>
             <p className="text-slate-800 font-black text-xl italic uppercase tracking-tighter">O Canvas está Vazio</p>
             <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Use o Arquiteto IA ou adicione blocos manuais.</p>
           </div>
        </div>
      )}
    </div>
  );
};
