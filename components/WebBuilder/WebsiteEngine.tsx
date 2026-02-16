
import React from 'react';
import { SiteDNA, SiteElement } from '../../types';
import * as Renderers from './Renderers';

interface WebsiteEngineProps {
  dna: SiteDNA;
  readOnly?: boolean;
  onSelectSection?: (section: SiteElement) => void;
}

const COMPONENT_MAP: Record<string, React.FC<any>> = {
  NAVBAR: Renderers.NavbarRenderer,
  HERO: Renderers.HeroRenderer,
  FEATURES: Renderers.FeatureRenderer,
  PRICING: Renderers.PricingRenderer,
  FOOTER: Renderers.FooterRenderer,
};

export const WebsiteEngine: React.FC<WebsiteEngineProps> = ({ dna, readOnly = false, onSelectSection }) => {
  const { theme, pages } = dna;
  const homeSections = pages['Home'] || [];

  const themeStyles = {
    '--primary-color': theme.primaryColor,
    '--bg-color': theme.backgroundColor,
    '--text-color': theme.textColor,
    '--radius': theme.borderRadius,
    fontFamily: theme.fontFamily,
  } as React.CSSProperties;

  return (
    <div 
      className="website-engine min-h-screen bg-[var(--bg-color)] text-[var(--text-color)] transition-all duration-700"
      style={themeStyles}
    >
      {homeSections.map((section, idx) => {
        const Renderer = COMPONENT_MAP[section.type];
        if (!Renderer) return null;

        return (
          <div 
            key={section.id} 
            onClick={() => !readOnly && onSelectSection?.(section)}
            className={`relative group ${!readOnly ? 'cursor-pointer hover:ring-2 hover:ring-indigo-500/30' : ''}`}
          >
            <Renderer content={section.content} styles={section.styles} theme={theme} />
            
            {!readOnly && (
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-600 text-white text-[8px] font-black px-2 py-1 rounded-md shadow-lg z-50">
                EDITAR: {section.type}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
