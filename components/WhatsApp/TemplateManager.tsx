
import React, { useState, useMemo } from 'react';
import { 
  MessageSquareQuote, 
  Layers, 
  Plus, 
  Search, 
  ChevronDown, 
  ChevronRight, 
  Check, 
  Trash2,
  Filter,
  XCircle,
  Pencil,
  ShieldCheck,
  TrendingUp,
  Tag,
  CheckSquare,
  Square,
  CheckCircle2,
  RotateCcw,
  Star,
  Zap,
  Layout,
  Clock,
  Heart
} from 'lucide-react';
import { ChatTemplate } from '../../types';

interface TemplateManagerProps {
  templates: ChatTemplate[];
  searchTerm: string;
  onSearchChange: (val: string) => void;
  isBulkMode: boolean;
  onToggleBulkMode: () => void;
  selectedIds: Set<string>;
  onToggleSelection: (id: string) => void;
  onSelectAll: (ids: string[]) => void;
  onClearSelection: () => void;
  onBulkDelete: () => void;
  onDeleteTemplate: (id: string) => void;
  onSelect: (content: string) => void;
  onEdit: (template: ChatTemplate) => void;
  expandedCategories: string[];
  onToggleCategory: (cat: string) => void;
  onNew: () => void;
}

const CATEGORY_AVATARS: Record<string, { icon: any, color: string, bg: string }> = {
  'Saudação': { icon: MessageSquareQuote, color: 'text-blue-500', bg: 'bg-blue-50' },
  'Orçamento': { icon: Zap, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  'Manutenção': { icon: Layout, color: 'text-amber-500', bg: 'bg-amber-50' },
  'Follow-up': { icon: Clock, color: 'text-purple-500', bg: 'bg-purple-50' },
};

export const TemplateManager: React.FC<TemplateManagerProps> = ({
  templates, searchTerm, onSearchChange, isBulkMode, onToggleBulkMode,
  selectedIds, onToggleSelection, onSelectAll, onClearSelection, onBulkDelete, onDeleteTemplate, onSelect, onEdit,
  expandedCategories, onToggleCategory, onNew
}) => {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const categories = useMemo(() => {
    const cats = new Set(templates.map(t => t.category));
    return ['all', ...Array.from(cats)];
  }, [templates]);

  const filteredTemplates = useMemo(() => {
    return templates.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           t.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategoryFilter === 'all' || t.category === selectedCategoryFilter;
      const matchesFavorite = !showOnlyFavorites || t.isFavorite;
      return matchesSearch && matchesCategory && matchesFavorite;
    });
  }, [templates, searchTerm, selectedCategoryFilter, showOnlyFavorites]);

  const sortedTemplates = useMemo(() => {
    return [...filteredTemplates].sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0));
  }, [filteredTemplates]);

  const grouped = useMemo(() => {
    return sortedTemplates.reduce((acc, t) => {
      if (!acc[t.category]) acc[t.category] = [];
      acc[t.category].push(t);
      return acc;
    }, {} as Record<string, ChatTemplate[]>);
  }, [sortedTemplates]);

  return (
    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-1">
          <h5 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-800 flex items-center gap-2 leading-none">
            <MessageSquareQuote size={18} className="text-blue-600" /> Templates Elite
          </h5>
          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest opacity-60">SGC Agile Repository</p>
        </div>
        <div className="flex gap-2">
           <button 
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
            className={`p-3 rounded-2xl transition-all shadow-sm border ${showOnlyFavorites ? 'bg-rose-500 text-white border-rose-500' : 'bg-slate-50 text-slate-400 border-slate-200'}`}
           >
             <Heart size={16} fill={showOnlyFavorites ? "currentColor" : "none"} />
           </button>
           <button 
            onClick={onNew} 
            className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg hover:bg-blue-700 transition-all active:scale-95"
           >
             <Plus size={20} />
           </button>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
          <input 
            type="text" 
            placeholder="PESQUISAR..." 
            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all text-slate-700" 
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map(cat => {
            const AvatarData = CATEGORY_AVATARS[cat as string];
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategoryFilter(cat)}
                className={`px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border whitespace-nowrap flex items-center gap-2 ${
                  selectedCategoryFilter === cat 
                    ? 'bg-slate-900 border-slate-900 text-white shadow-xl' 
                    : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'
                }`}
              >
                {AvatarData && <AvatarData.icon size={12}/>}
                {cat === 'all' ? 'Tudo' : cat}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-6">
        {Object.keys(grouped).length > 0 ? (
          (Object.entries(grouped) as [string, ChatTemplate[]][]).map(([category, items]) => {
            const Meta = CATEGORY_AVATARS[category] || { icon: Tag, color: 'text-slate-400', bg: 'bg-slate-50' };
            const Icon = Meta.icon;

            return (
              <div key={category} className="space-y-3 animate-in fade-in duration-500">
                <button 
                  onClick={() => onToggleCategory(category)} 
                  className="w-full flex items-center justify-between group py-2"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl ${Meta.bg} ${Meta.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                       <Icon size={20} />
                    </div>
                    <div className="text-left">
                       <span className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em]">{category}</span>
                       <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{items.length} templates ativos</p>
                    </div>
                  </div>
                  {expandedCategories.includes(category) ? <ChevronDown size={18} className="text-slate-300" /> : <ChevronRight size={18} className="text-slate-300" />}
                </button>
                
                {expandedCategories.includes(category) && (
                  <div className="space-y-3 pl-14 animate-in slide-in-from-top-2">
                    {items.map(template => (
                      <div 
                        key={template.id} 
                        className={`p-5 rounded-[2rem] border transition-all cursor-pointer relative group ${
                          template.isFavorite ? 'bg-indigo-50/50 border-indigo-100' : 'bg-white border-slate-100 hover:border-blue-200'
                        }`}
                        onClick={() => !isBulkMode && onSelect(template.content)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                             {template.isFavorite && <Heart size={14} className="text-rose-500" fill="currentColor" />}
                             <h6 className="text-[11px] font-black text-slate-800 uppercase tracking-tighter italic">{template.title}</h6>
                          </div>
                          <div className="flex items-center gap-2">
                            {template.isApproved && <ShieldCheck size={14} className="text-blue-500" />}
                            <span className="text-[8px] font-black text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-100">{template.usageCount || 0}x</span>
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed font-medium italic mb-3">"{template.content}"</p>
                        
                        <div className="flex flex-wrap gap-1.5">
                          {['nome', 'endereco', 'servico', 'data'].map(v => template.content.includes(`{{${v}}}`) && (
                            <span key={v} className="flex items-center gap-1 text-[7px] font-black uppercase tracking-widest bg-white text-indigo-500 px-2 py-0.5 rounded-full border border-indigo-100">
                               <Tag size={8}/> {v}
                            </span>
                          ))}
                        </div>

                        {!isBulkMode && (
                          <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                            <button onClick={(e) => { e.stopPropagation(); onEdit(template); }} className="p-2.5 bg-slate-900 text-white rounded-xl shadow-lg"><Pencil size={12} /></button>
                            <button onClick={(e) => { e.stopPropagation(); onDeleteTemplate(template.id); }} className="p-2.5 bg-rose-500 text-white rounded-xl shadow-lg"><Trash2 size={12} /></button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="py-20 text-center space-y-4 opacity-30">
            <XCircle className="mx-auto" size={48} strokeWidth={1} />
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Nada a exibir nesta busca</p>
          </div>
        )}
      </div>
    </div>
  );
};
