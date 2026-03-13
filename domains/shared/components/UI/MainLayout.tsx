import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navigation, GlobalSearch, HelpGuide } from '@shared';
import { HelpCircle } from 'lucide-react';

export const MainLayout: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      <Navigation onOpenSearch={() => setIsSearchOpen(true)} />

      <main className="flex-1 flex flex-col min-w-0 relative overflow-hidden lg:ml-20 pt-16 lg:pt-0 transition-all duration-300">
        <Outlet />
      </main>

      {/* Componentes Globais */}
      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <HelpGuide isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      
      <div className="fixed bottom-28 lg:bottom-8 right-6 lg:right-8 z-50">
        <button
          onClick={() => setIsHelpOpen(true)}
          className="w-12 h-12 bg-white border border-slate-200 rounded-full shadow-lg shadow-blue-500/10 flex items-center justify-center text-blue-600 hover:scale-110 active:scale-90 transition-all focus:outline-none focus:ring-4 focus:ring-blue-100"
          aria-label="Ajuda"
        >
          <HelpCircle size={24} />
        </button>
      </div>
    </div>
  );
};
