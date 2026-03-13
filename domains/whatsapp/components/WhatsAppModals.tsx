import React, { useEffect, useRef, useState } from 'react';
import {
  X, Sparkles, Calendar, CalendarPlus, Upload, Check, Save,
  MessageSquare, FileText, Loader2, ShieldCheck, Clock, Globe,
  CheckCircle2, Users, ShoppingCart, Mail
} from 'lucide-react';
import { ChatSession, ChatTemplate } from '@shared/types/common.types';
import { googleApiService } from '@google-workspace';

interface WhatsAppModalsProps {
  showAI: boolean;
  aiTitle: string;
  aiContent: string;
  isGenerating: boolean;
  onCloseAI: () => void;
  showSchedule: boolean;
  onCloseSchedule: () => void;
  clientName: string;
  clientAddress?: string;
  showUpload: boolean;
  onCloseUpload: () => void;
  onFileUpload: (files: File[]) => void;
  showNewTemplate: boolean;
  onCloseNewTemplate: () => void;
  onCreateTemplate: (t: { title: string, content: string, category: string, isApproved: boolean }) => void;
  showEditTemplate: boolean;
  onCloseEditTemplate: () => void;
  templateToEdit: ChatTemplate | null;
  onUpdateTemplate: (t: ChatTemplate) => void;
  showEditClient: boolean;
  onCloseEditClient: () => void;
  clientData: ChatSession | null;
  onSaveClient: (updatedData: Partial<ChatSession>) => void;
  onConfirmSchedule?: (details: { date: string, time: string }) => void;
  showQuote: boolean;
  onCloseQuote: () => void;
  onSendQuote: (quoteText: string) => void;
  lightboxImage: string | null;
  onCloseLightbox: () => void;
  scheduleInitialTitle?: string;
  scheduleInitialDesc?: string;
}

export const WhatsAppModals: React.FC<WhatsAppModalsProps> = ({
  showAI, aiTitle, aiContent, isGenerating, onCloseAI,
  showSchedule, onCloseSchedule,
  showUpload, onCloseUpload, onFileUpload,
  showNewTemplate, onCloseNewTemplate, onCreateTemplate,
  showEditTemplate, onCloseEditTemplate, templateToEdit, onUpdateTemplate,
  showEditClient, onCloseEditClient, clientData, onSaveClient,
  onConfirmSchedule, showQuote, onCloseQuote, onSendQuote,
  lightboxImage, onCloseLightbox,
  scheduleInitialTitle, scheduleInitialDesc
}) => {
  const [newT, setNewT] = useState<{
    title: string;
    content: string;
    category: ChatTemplate['category'];
    isApproved: boolean;
  }>({ title: '', content: '', category: 'Saudação', isApproved: false });
  const [isScheduled, setIsScheduled] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [scheduleTitle, setScheduleTitle] = useState('');
  const [scheduleDesc, setScheduleDesc] = useState('');
  const [scheduleDate, setScheduleDate] = useState(new Date().toISOString().split('T')[0]);
  const [scheduleTime, setScheduleTime] = useState('09:00');
  const [syncWithGoogle, setSyncWithGoogle] = useState(true);
  const [isScheduling, setIsScheduling] = useState(false);

  const [editData, setEditData] = useState<Partial<ChatSession>>({});
  const [quoteText, setQuoteText] = useState('');

  const [selectedFiles, setSelectedFiles] = useState<{ file: File, preview: string, progress: number }[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (showSchedule && clientData) {
      setScheduleTitle(scheduleInitialTitle || `Visita Técnica: ${clientData.clientName}`);
      setScheduleDesc(scheduleInitialDesc || `Visita técnica agendada via CRM.\n\nEndereço: ${clientData.clientAddress || 'Não informado'}\nTelefone: ${clientData.clientPhone || 'Não informado'}\nServiço: ${clientData.serviceType || 'Geral'}`);
      setIsScheduled(false);
    }
  }, [showSchedule, clientData, scheduleInitialTitle, scheduleInitialDesc]);

  useEffect(() => {
    if (templateToEdit) {
      setNewT({
        title: templateToEdit.title,
        content: templateToEdit.content,
        category: templateToEdit.category,
        isApproved: templateToEdit.isApproved || false
      });
    } else {
      setNewT({ title: '', content: '', category: 'Saudação', isApproved: false });
    }
  }, [templateToEdit, showNewTemplate, showEditTemplate]);

  useEffect(() => {
    if (clientData) {
      setEditData({ ...clientData });
    }
  }, [clientData, showEditClient]);

  useEffect(() => {
    if (showQuote && clientData) {
      setQuoteText(`Olá ${clientData.clientName},\n\nSegue proposta técnica para o serviço de ${clientData.serviceType || 'manutenção'}.\n\nValor total: R$ \nCondições: \n\nFico à disposição para confirmar a execução.`);
    }
  }, [showQuote, clientData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    const newEntries = files.map(file => ({
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
      progress: 0
    }));
    setSelectedFiles(prev => [...prev, ...newEntries]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => {
      const next = [...prev];
      if (next[index]?.preview) URL.revokeObjectURL(next[index].preview);
      next.splice(index, 1);
      return next;
    });
  };

  const closeUploadModal = () => {
    selectedFiles.forEach((entry) => {
      if (entry.preview) URL.revokeObjectURL(entry.preview);
    });
    setSelectedFiles([]);
    onCloseUpload();
  };

  const handleUploadSubmit = async () => {
    if (selectedFiles.length === 0) return;
    setIsUploading(true);
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(r => setTimeout(r, 70));
      setSelectedFiles(prev => prev.map(f => ({ ...f, progress: i })));
    }
    onFileUpload(selectedFiles.map(f => f.file));
    setSelectedFiles([]);
    onCloseUpload();
    setIsUploading(false);
  };

  const insertVariable = (variable: string) => {
    setNewT(prev => ({ ...prev, content: `${prev.content} {{${variable}}}` }));
  };

  const handleConfirmSchedule = async () => {
    setIsScheduling(true);
    try {
      if (syncWithGoogle) {
        const startDateTime = `${scheduleDate}T${scheduleTime}:00`;
        const endDateTime = new Date(new Date(startDateTime).getTime() + 3600000).toISOString();

        await googleApiService.createCalendarEvent({
          summary: scheduleTitle,
          description: scheduleDesc,
          start: startDateTime,
          end: endDateTime,
          location: clientData?.clientAddress
        });
      }
      onConfirmSchedule?.({ date: scheduleDate, time: scheduleTime });
      setIsScheduled(true);
      setTimeout(() => onCloseSchedule(), 1200);
    } catch (err) {
      console.error(err);
    } finally {
      setIsScheduling(false);
    }
  };

  return (
    <>
      {lightboxImage && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md flex items-center justify-center z-[1000] p-4 animate-in fade-in" onClick={onCloseLightbox}>
          <button className="absolute top-6 right-6 p-3 text-white"><X size={32} /></button>
          <img src={lightboxImage} alt="Visualização" className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain animate-in zoom-in" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      {showSchedule && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[800] p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-8 border-b flex justify-between items-center bg-indigo-50/30">
              <div className="flex items-center gap-4 text-indigo-600">
                <div className="p-3 bg-white rounded-2xl shadow-sm"><CalendarPlus size={24} /></div>
                <div>
                  <h3 className="font-black uppercase text-sm text-slate-800 tracking-tighter italic">Agendar Visita Técnica</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Sincronização com Google Calendar</p>
                </div>
              </div>
              <button onClick={onCloseSchedule} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"><X size={20} /></button>
            </div>

            <div className="p-8 space-y-6">
              {isScheduled ? (
                <div className="py-12 text-center animate-in zoom-in">
                  <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-6 border border-emerald-100">
                    <CheckCircle2 size={40} className="animate-bounce" />
                  </div>
                  <h4 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Compromisso Agendado!</h4>
                  <p className="text-sm text-slate-500 font-medium">Evento salvo com sucesso.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Título do Evento</label>
                    <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:border-indigo-500 transition-all" value={scheduleTitle} onChange={(e) => setScheduleTitle(e.target.value)} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Data</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input type="date" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Hora</label>
                      <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input type="time" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Descrição / Notas Técnicas</label>
                    <textarea className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-600 h-24 leading-relaxed" value={scheduleDesc} onChange={(e) => setScheduleDesc(e.target.value)} />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                    <div className="flex items-center gap-3">
                      <Globe size={18} className="text-indigo-600" />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase text-indigo-700 tracking-widest">Google Calendar Sync</span>
                        <span className="text-[8px] font-bold text-indigo-400 uppercase">Integrar automaticamente à agenda</span>
                      </div>
                    </div>
                    <button onClick={() => setSyncWithGoogle(!syncWithGoogle)} className={`w-12 h-6 rounded-full relative transition-all ${syncWithGoogle ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${syncWithGoogle ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button onClick={onCloseSchedule} className="flex-1 py-4 text-[10px] font-black uppercase text-slate-400 hover:bg-slate-100 rounded-2xl transition-all">Cancelar</button>
                    <button onClick={handleConfirmSchedule} disabled={isScheduling} className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                      {isScheduling ? <Loader2 size={16} className="animate-spin" /> : <CalendarPlus size={16} />} Confirmar Agendamento
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {showUpload && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[800] p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-xl text-white"><Upload size={20} /></div>
                <div>
                  <h3 className="font-black uppercase text-xs text-slate-800 tracking-widest">Enviar Anexos</h3>
                  <p className="text-[10px] text-slate-400 font-bold">Imagens, PDFs, Áudios ou Vídeos</p>
                </div>
              </div>
              <button onClick={closeUploadModal} className="p-2 hover:bg-slate-200 rounded-full text-slate-400"><X size={20} /></button>
            </div>
            <div className="p-8 flex-1 overflow-y-auto max-h-[500px]">
              <div onClick={() => fileInputRef.current?.click()} className="border-4 border-dashed border-slate-100 rounded-[2rem] p-12 text-center hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer group mb-6">
                <input type="file" ref={fileInputRef} multiple className="hidden" onChange={handleFileChange} />
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-4 group-hover:scale-110 transition-transform"><Upload size={32} /></div>
                <p className="text-sm font-bold text-slate-700">Arraste arquivos ou clique aqui</p>
              </div>
              <div className="space-y-3">
                {selectedFiles.map((fileEntry, idx) => (
                  <div key={idx} className="bg-slate-50 p-3 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shrink-0 border border-slate-100 overflow-hidden">
                      {fileEntry.preview ? <img src={fileEntry.preview} className="w-full h-full object-cover" /> : <FileText className="text-red-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-slate-800 truncate">{fileEntry.file.name}</p>
                      {isUploading && <div className="mt-2 w-full bg-slate-200 h-1.5 rounded-full overflow-hidden"><div className="bg-blue-600 h-full" style={{ width: `${fileEntry.progress}%` }}></div></div>}
                    </div>
                    {!isUploading && <button onClick={() => removeFile(idx)} className="p-2 text-slate-300 hover:text-red-500"><X size={18} /></button>}
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 border-t bg-slate-50 flex gap-3">
              <button onClick={closeUploadModal} className="flex-1 py-4 text-[10px] font-black uppercase text-slate-400">Cancelar</button>
              <button disabled={selectedFiles.length === 0 || isUploading} onClick={handleUploadSubmit} className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase shadow-xl hover:bg-blue-700 flex items-center justify-center gap-2">
                {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} Confirmar e Enviar
              </button>
            </div>
          </div>
        </div>
      )}

      {showAI && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[700] p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden">
            <div className="p-8 border-b flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-4 text-indigo-600"><Sparkles size={28} className="animate-pulse" /><h3 className="font-black uppercase text-sm text-slate-800">{aiTitle}</h3></div>
              <button onClick={onCloseAI} className="p-2 hover:bg-slate-200 rounded-full text-slate-400"><X size={20} /></button>
            </div>
            <div className="p-10 max-h-[60vh] overflow-y-auto">
              {isGenerating ? <div className="flex flex-col items-center justify-center py-20"><div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div> : <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">{aiContent}</div>}
            </div>
            <div className="p-8 border-t flex justify-end"><button onClick={onCloseAI} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px]">Fechar</button></div>
          </div>
        </div>
      )}

      {(showNewTemplate || showEditTemplate) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[800] p-4 animate-in zoom-in-95">
          <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden">
            <div className="p-8 border-b flex justify-between items-center bg-indigo-50/30">
              <div className="flex items-center gap-3 text-indigo-600">
                <MessageSquare size={24} />
                <h3 className="font-black uppercase text-sm text-slate-800">{templateToEdit ? 'Editar Template Dinâmico' : 'Novo Template Dinâmico'}</h3>
              </div>
              <button onClick={() => { onCloseNewTemplate(); onCloseEditTemplate(); }} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full"><X size={20} /></button>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Título do Template</label>
                  <input placeholder="Ex: Cobrança Manutenção" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700" value={newT.title} onChange={e => setNewT({ ...newT, title: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Categoria</label>
                  <select 
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700" 
                    value={newT.category} 
                    onChange={e => setNewT({ ...newT, category: e.target.value as ChatTemplate['category'] })}
                  >
                    <option value="Saudação">Saudação</option>
                    <option value="Orçamento">Orçamento</option>
                    <option value="Manutenção">Manutenção</option>
                    <option value="Follow-up">Follow-up</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Conteúdo da Mensagem</label>
                  <div className="flex gap-1">
                    {['nome', 'servico', 'data', 'endereco'].map(v => (
                      <button key={v} onClick={() => insertVariable(v)} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[8px] font-black uppercase rounded-lg border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all">
                        + {v}
                      </button>
                    ))}
                  </div>
                </div>
                <textarea placeholder="Use {{nome}} para personalizar..." className="w-full p-5 bg-slate-50 border border-slate-200 rounded-[2rem] text-sm h-40 font-medium text-slate-600 leading-relaxed outline-none focus:border-indigo-500 transition-all" value={newT.content} onChange={e => setNewT({ ...newT, content: e.target.value })} />
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <button onClick={() => setNewT(prev => ({ ...prev, isApproved: !prev.isApproved }))} className={`w-12 h-6 rounded-full relative transition-all ${newT.isApproved ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${newT.isApproved ? 'left-7' : 'left-1'}`} />
                </button>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-slate-700 flex items-center gap-1.5">
                    <ShieldCheck size={12} className={newT.isApproved ? 'text-emerald-500' : 'text-slate-400'} /> Definir como Template Oficial
                  </span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase">Apenas templates oficiais aparecem para todos atendentes</span>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={() => { onCloseNewTemplate(); onCloseEditTemplate(); }} className="flex-1 py-4 text-[10px] font-black uppercase text-slate-400 hover:bg-slate-100 rounded-2xl">Descartar</button>
                <button
                  onClick={() => {
                    if (templateToEdit) {
                      onUpdateTemplate({ ...templateToEdit, ...newT });
                    } else {
                      onCreateTemplate(newT);
                    }
                    onCloseNewTemplate();
                    onCloseEditTemplate();
                  }}
                  className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase shadow-xl hover:bg-indigo-700 flex items-center justify-center gap-2"
                >
                  <Save size={16} /> Salvar Template Dinâmico
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditClient && clientData && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[800] p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden">
            <div className="p-8 border-b flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-3 text-indigo-600">
                <Users size={22} />
                <h3 className="font-black uppercase text-sm text-slate-800 tracking-widest">Editar Cliente</h3>
              </div>
              <button onClick={onCloseEditClient} className="p-2 hover:bg-slate-200 rounded-full text-slate-400"><X size={20} /></button>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nome</label>
                <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700" value={editData.clientName || ''} onChange={(e) => setEditData(prev => ({ ...prev, clientName: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Telefone</label>
                <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700" value={editData.clientPhone || ''} onChange={(e) => setEditData(prev => ({ ...prev, clientPhone: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Tipo</label>
                <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700" value={editData.clientType || 'Residencial'} onChange={(e) => setEditData(prev => ({ ...prev, clientType: e.target.value as ChatSession['clientType'] }))}>
                  <option value="Residencial">Residencial</option>
                  <option value="Comercial">Comercial</option>
                </select>
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Endereço</label>
                <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700" value={editData.clientAddress || ''} onChange={(e) => setEditData(prev => ({ ...prev, clientAddress: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Status</label>
                <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700" value={editData.status || 'Ativo'} onChange={(e) => setEditData(prev => ({ ...prev, status: e.target.value as ChatSession['status'] }))}>
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                  <option value="Prospecção">Prospecção</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Tipo de Serviço</label>
                <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700" value={editData.serviceType || ''} onChange={(e) => setEditData(prev => ({ ...prev, serviceType: e.target.value }))} />
              </div>
            </div>

            <div className="p-8 border-t flex gap-3 bg-slate-50">
              <button onClick={onCloseEditClient} className="flex-1 py-4 text-[10px] font-black uppercase text-slate-400">Cancelar</button>
              <button
                onClick={() => {
                  onSaveClient(editData);
                  onCloseEditClient();
                }}
                className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase shadow-xl hover:bg-indigo-700 flex items-center justify-center gap-2"
              >
                <Save size={16} /> Salvar Cadastro
              </button>
            </div>
          </div>
        </div>
      )}

      {showQuote && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[800] p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden">
            <div className="p-8 border-b flex justify-between items-center bg-emerald-50/30">
              <div className="flex items-center gap-3 text-emerald-700">
                <ShoppingCart size={22} />
                <h3 className="font-black uppercase text-sm text-slate-800 tracking-widest">Enviar Orçamento</h3>
              </div>
              <button onClick={onCloseQuote} className="p-2 hover:bg-slate-200 rounded-full text-slate-400"><X size={20} /></button>
            </div>
            <div className="p-8 space-y-4">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Mensagem do Orçamento</label>
              <textarea className="w-full p-5 bg-slate-50 border border-slate-200 rounded-[2rem] text-sm h-64 font-medium text-slate-600 leading-relaxed outline-none focus:border-emerald-500 transition-all" value={quoteText} onChange={(e) => setQuoteText(e.target.value)} />
            </div>
            <div className="p-8 border-t flex gap-3 bg-slate-50">
              <button onClick={onCloseQuote} className="flex-1 py-4 text-[10px] font-black uppercase text-slate-400">Cancelar</button>
              <button
                onClick={() => {
                  onSendQuote(quoteText);
                  onCloseQuote();
                }}
                className="flex-[2] py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase shadow-xl hover:bg-emerald-700 flex items-center justify-center gap-2"
              >
                <Mail size={16} /> Enviar para Conversa
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
