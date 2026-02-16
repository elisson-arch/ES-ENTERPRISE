
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
  RotateCcw
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

export const TemplateManager: React.FC<TemplateManagerProps> = ({
  templates, searchTerm, onSearchChange, isBulkMode, onToggleBulkMode,
  selectedIds, onToggleSelection, onSelectAll, onClearSelection, onBulkDelete, onDeleteTemplate, onSelect, onEdit,
  expandedCategories, onToggleCategory, onNew
}) => {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  const categories = useMemo(() => {
    const cats = new Set(templates.map(t => t.category));
    return ['all', ...Array.from(cats)];
  }, [templates]);

  const filteredTemplates = useMemo(() => {
    return templates.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           t.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategoryFilter === 'all' || t.category === selectedCategoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [templates, searchTerm, selectedCategoryFilter]);

  const grouped = useMemo(() => {
    return filteredTemplates.reduce((acc, t) => {
      if (!acc[t.category]) acc[t.category] = [];
      acc[t.category].push(t);
      return acc;
    }, {} as Record<string, ChatTemplate[]>);
  }, [filteredTemplates]);

  const allFilteredIds = filteredTemplates.map(t => t.id);

  return (
    <div className="bg-slate-50 p-4 rounded-[2rem] border border-slate-100 shadow-inner">
      <div className="flex justify-between items-center mb-4">
        <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
          <MessageSquareQuote size={14} className="text-blue-500" /> Templates Dinâmicos
        </h5>
        <div className="flex gap-1">
          <button 
            onClick={onToggleBulkMode} 
            className={`p-2 rounded-xl transition-all shadow-sm border ${
              isBulkMode ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50'
            }`}
            title="Seleção em Massa"
          >
            <Layers size={16} />
          </button>
          <button 
            onClick={onNew} 
            className="p-2 text-blue-600 hover:bg-blue-100 rounded-xl transition-all shadow-sm bg-white border border-blue-50"
            title="Novo Template"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
            <input 
              type="text" 
              placeholder="Buscar por título ou conteúdo..." 
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-[11px] outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-400 transition-all font-bold text-slate-700" 
              value={searchTerm}
              onChange={e => onSearchChange(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter size={12} className="text-slate-400 flex-shrink-0" />
            <div className="flex gap-1 overflow-x-auto no-scrollbar py-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryFilter(cat)}
                  className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter transition-all border whitespace-nowrap ${
                    selectedCategoryFilter === cat 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                      : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  {cat === 'all' ? 'Todos' : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {isBulkMode && (
          <div className="p-3 bg-white border border-blue-100 rounded-2xl space-y-2 animate-in slide-in-from-top-2">
            <div className="flex justify-between items-center">
               <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                 <CheckCircle2 size={12} /> {selectedIds.size} selecionados
               </span>
               <button 
                 onClick={onBulkDelete}
                 disabled={selectedIds.size === 0}
                 className="p-1.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-all disabled:opacity-30"
                 title="Excluir selecionados"
               >
                 <Trash2 size={14} />
               </button>
            </div>
            <div className="flex gap-2">
               <button 
                 onClick={() => onSelectAll(allFilteredIds)}
                 className="flex-1 py-1.5 bg-slate-50 text-[8px] font-black uppercase text-slate-500 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all"
               >
                 Selecionar Todos
               </button>
               <button 
                 onClick={onClearSelection}
                 className="flex-1 py-1.5 bg-slate-50 text-[8px] font-black uppercase text-slate-500 rounded-lg hover:bg-slate-100 transition-all flex items-center justify-center gap-1"
               >
                 <RotateCcw size={10} /> Limpar
               </button>
            </div>
          </div>
        )}

        <div className="max-h-80 overflow-y-auto pr-1 custom-scrollbar space-y-3">
          {Object.keys(grouped).length > 0 ? (
            (Object.entries(grouped) as [string, ChatTemplate[]][]).map(([category, items]) => (
              <div key={category} className="space-y-1.5 animate-in fade-in duration-300">
                <button 
                  onClick={() => onToggleCategory(category)} 
                  className="w-full flex items-center justify-between text-[10px] font-black text-slate-400 hover:text-slate-800 py-1 uppercase tracking-widest group"
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-1 h-3 rounded-full ${
                      category === 'Saudação' ? 'bg-blue-400' :
                      category === 'Orçamento' ? 'bg-emerald-400' :
                      category === 'Manutenção' ? 'bg-amber-400' : 'bg-purple-400'
                    }`}></span>
                    <span>{category} <span className="text-[8px] opacity-50 ml-1">({items.length})</span></span>
                  </div>
                  {expandedCategories.includes(category) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
                
                {expandedCategories.includes(category) && (
                  <div className="space-y-2.5 pl-2 animate-in slide-in-from-left-2">
                    {items.map(template => (
                      <div 
                        key={template.id} 
                        className="group/item relative flex items-start gap-2"
                        onClick={() => isBulkMode && onToggleSelection(template.id)}
                      >
                        {isBulkMode && (
                          <div className={`mt-3 p-1 rounded-lg transition-all ${
                              selectedIds.has(template.id) ? 'text-blue-600' : 'text-slate-300'
                            }`}
                          >
                            {selectedIds.has(template.id) ? <CheckSquare size={18} /> : <Square size={18} />}
                          </div>
                        )}
                        <div 
                          onClick={(e) => {
                            if (!isBulkMode) onSelect(template.content);
                          }} 
                          className={`w-full text-left p-3 bg-white border rounded-2xl transition-all cursor-pointer group flex-1 ${
                            selectedIds.has(template.id) ? 'border-blue-500 shadow-md ring-1 ring-blue-500/20' : 'border-slate-200 hover:border-blue-400'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-1.5">
                            <h6 className="text-[11px] font-black text-slate-800 uppercase tracking-tight truncate flex-1">{template.title}</h6>
                            {!isBulkMode && (
                              <div className="flex items-center gap-1.5">
                                {template.isApproved && (
                                  <ShieldCheck size={12} className="text-blue-500" />
                                )}
                                <span className="flex items-center gap-1 text-[8px] font-black text-slate-400 bg-slate-50 px-1.5 rounded" title="Vezes utilizado">
                                  <TrendingUp size={10} /> {template.usageCount || 0}
                                </span>
                              </div>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed italic mb-2">"{template.content}"</p>
                          
                          <div className="flex flex-wrap gap-1">
                            {['nome', 'endereco', 'servico', 'data'].map(v => template.content.includes(`{{${v}}}`) && (
                              <span key={v} className="flex items-center gap-1 text-[7px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-500 px-1.5 py-0.5 rounded border border-indigo-100">
                                <Tag size={8} /> {v}
                              </span>
                            ))}
                          </div>

                          {!isBulkMode && (
                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={(e) => { e.stopPropagation(); onEdit(template); }}
                                className="p-1.5 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 rounded-lg transition-all shadow-sm"
                              >
                                <Pencil size={10} />
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); onDeleteTemplate(template.id); }}
                                className="p-1.5 bg-white border border-slate-200 text-slate-400 hover:text-red-600 rounded-lg transition-all shadow-sm"
                              >
                                <Trash2 size={10} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="py-8 text-center space-y-2 animate-in fade-in">
              <XCircle className="mx-auto text-slate-200" size={24} />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nenhum template encontrado</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
