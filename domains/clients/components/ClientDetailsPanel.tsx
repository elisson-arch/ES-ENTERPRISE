import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, MessageSquare, Package, ShieldAlert, AlertCircle, ShieldCheck, Folder, FileText, MapPin, ListChecks, ChevronDown, ChevronUp, CheckCircle2, Circle, Pencil } from 'lucide-react';
import { Client, clientService } from '@clients';
import { Asset } from '@shared/types/common.types';
import { TenantDriveFileDoc } from '@google-workspace/types/google-workspace.types';
import { ChatSession } from '@whatsapp/types/whatsapp.types';
import { inventoryService } from '@inventory';
import { driveFileService } from '@google-workspace';
import { chatService } from '@whatsapp';
import { predictiveService } from '@ai';

import { tenantService } from '@auth';

interface ClientDetailsPanelProps {
  client: Client | null;
  onClose: () => void;
  onEdit?: (client: Client) => void;
  onDelete?: (clientId: string) => void;
}

const InlineEdit = ({ value, onSave, type, placeholder }: { value: string, onSave: (val: string) => void, type: 'email' | 'tel' | 'text', placeholder: string }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [val, setVal] = useState(value);
  const [error, setError] = useState('');

  const applyPhoneMask = (v: string) => {
    let num = v.replace(/\D/g, '');
    if (num.length > 11) num = num.slice(0, 11);
    if (num.length > 6) {
      return `(${num.slice(0, 2)}) ${num.slice(2, 7)}-${num.slice(7)}`;
    } else if (num.length > 2) {
      return `(${num.slice(0, 2)}) ${num.slice(2)}`;
    } else if (num.length > 0) {
      return `(${num}`;
    }
    return num;
  };

  const validate = (v: string) => {
    if (!v) return '';
    if (type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(v)) return 'E-mail inválido';
    }
    if (type === 'tel') {
      const digits = v.replace(/\D/g, '');
      if (digits.length > 0 && (digits.length < 10 || digits.length > 11)) return 'Telefone inválido (10 ou 11 dígitos)';
    }
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newVal = e.target.value;
    if (type === 'tel') {
      newVal = applyPhoneMask(newVal);
    }
    setVal(newVal);
    setError(validate(newVal));
  };

  const handleSave = () => {
    const err = validate(val);
    if (err) {
      setError(err);
      return;
    }
    setError('');
    setIsEditing(false);
    if (val !== value) onSave(val);
  };

  if (isEditing) {
    return (
      <div className="flex flex-col gap-1 w-full">
        <input 
          type={type === 'tel' ? 'text' : type} 
          value={val} 
          onChange={handleChange} 
          onBlur={handleSave}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          className={`text-sm font-bold text-slate-700 bg-white border ${error ? 'border-red-500' : 'border-blue-300'} rounded px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500/20 w-full`}
          autoFocus
        />
        {error && <span className="text-[9px] text-red-500 font-bold">{error}</span>}
      </div>
    );
  }

  const err = validate(value);
  const displayValue = type === 'tel' && value ? applyPhoneMask(value) : value;

  return (
    <div 
      className="flex items-center gap-2 group/edit cursor-pointer hover:bg-slate-50 rounded px-1 -ml-1 transition-colors" 
      title={value || placeholder}
      onClick={() => {
        setVal(type === 'tel' && value ? applyPhoneMask(value) : value);
        setIsEditing(true);
      }}
    >
      <div className="flex-1 min-w-0">
        {value ? (
          <p className={`text-sm font-bold truncate ${err ? 'text-red-600' : 'text-slate-700'}`}>{displayValue}</p>
        ) : (
          <p className="text-sm italic font-normal text-slate-400">{placeholder}</p>
        )}
      </div>
      {err && <span title={err} className="shrink-0 flex"><AlertCircle size={14} className="text-red-500" /></span>}
      <Pencil size={12} className="text-slate-300 opacity-0 group-hover/edit:opacity-100 transition-opacity shrink-0" />
    </div>
  );
};

export const ClientDetailsPanel: React.FC<ClientDetailsPanelProps> = ({ client, onClose, onEdit, onDelete }) => {
  const [linkedAssets, setLinkedAssets] = useState<Asset[]>([]);
  const [clientFiles, setClientFiles] = useState<TenantDriveFileDoc[]>([]);
  const [clientChat, setClientChat] = useState<ChatSession | null>(null);
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['tasks']));

  const toggleSection = (section: string) => {
    setOpenSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const handleUpdate = async (field: string, value: string) => {
    if (!client) return;
    try {
      await clientService.updateClient(client.id, { [field]: value });
    } catch (error) {
      console.error('Failed to update client:', error);
    }
  };

  useEffect(() => {
    if (client) {
      const loadClientData = async () => {
        try {
          const orgId = tenantService.getCurrentOrgId();
          const [assets, files, chat] = await Promise.all([
            inventoryService.getAssetsByClient(client.id),
            driveFileService.getFilesByClient(orgId, client.id),
            chatService.getChatByClient(orgId, client.id)
          ]);
          setLinkedAssets(assets);
          setClientFiles(files);
          setClientChat(chat);
        } catch (error) {
          console.error('Error loading client details:', error);
        }
      };
      loadClientData();
    } else {
      setLinkedAssets([]);
      setClientFiles([]);
      setClientChat(null);
    }
  }, [client]);

  return (
    <AnimatePresence>
      {client && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
            onClick={onClose} 
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-xl bg-white/90 backdrop-blur-2xl h-full shadow-2xl flex flex-col border-l border-white/50"
          >
            <div className="p-8 border-b border-slate-100/50 flex justify-between items-center bg-white/50">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-[1.5rem] flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-indigo-200">
                  {client.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter italic">{client.name}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID Cliente: {client.clientCode || 'SEM-CODIGO'}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID Google: {client.googleContactId || 'Local'}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"><X size={24} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              {/* Contatos */}
              <section className="space-y-4">
                <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest border-b border-slate-100/50 pb-2 flex items-center gap-2">
                  <User size={14} /> Contatos Vinculados
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-4 bg-white/60 rounded-2xl border border-slate-100 relative group hover:bg-white transition-colors">
                    <span className="absolute top-4 right-4 text-[8px] font-black text-blue-600 uppercase">Principal</span>
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">E-mail</p>
                    <InlineEdit 
                      type="email" 
                      value={client.email} 
                      onSave={(val) => handleUpdate('email', val)} 
                      placeholder="Adicionar e-mail" 
                    />
                    {client.additionalEmails && client.additionalEmails.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {client.additionalEmails.map((email, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="text-[8px] font-black text-slate-300 uppercase shrink-0">Secundário</span>
                            <InlineEdit 
                              type="email" 
                              value={email} 
                              onSave={(val) => {
                                const newEmails = [...client.additionalEmails!];
                                newEmails[idx] = val;
                                handleUpdate('additionalEmails', newEmails as any);
                              }} 
                              placeholder="E-mail secundário" 
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="p-4 bg-white/60 rounded-2xl border border-slate-100 relative group hover:bg-white transition-colors">
                    <span className="absolute top-4 right-4 text-[8px] font-black text-emerald-600 uppercase">WhatsApp</span>
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Telefone</p>
                    <InlineEdit 
                      type="tel" 
                      value={client.phone} 
                      onSave={(val) => handleUpdate('phone', val)} 
                      placeholder="Adicionar telefone" 
                    />
                    {client.additionalPhones && client.additionalPhones.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {client.additionalPhones.map((phone, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="text-[8px] font-black text-slate-300 uppercase shrink-0">Secundário</span>
                            <InlineEdit 
                              type="tel" 
                              value={phone} 
                              onSave={(val) => {
                                const newPhones = [...client.additionalPhones!];
                                newPhones[idx] = val;
                                handleUpdate('additionalPhones', newPhones as any);
                              }} 
                              placeholder="Telefone secundário" 
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Localização */}
              <section className="space-y-4">
                <h4 className="text-[10px] font-black text-rose-600 uppercase tracking-widest border-b border-slate-100/50 pb-2 flex items-center gap-2">
                  <MapPin size={14} /> Localização
                </h4>
                <div className="bg-white/60 rounded-2xl border border-slate-100 overflow-hidden">
                  <div className="p-4 border-b border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Endereço Completo</p>
                    <p className="text-sm font-bold text-slate-700">{client.address || 'Endereço não informado'}</p>
                    {(client.city || client.state || client.zipCode) && (
                      <p className="text-xs font-medium text-slate-500 mt-1">
                        {[client.city, client.state, client.zipCode].filter(Boolean).join(' - ')}
                      </p>
                    )}
                  </div>
                  {client.address && (
                    <div className="w-full h-48 bg-slate-100 relative">
                      <iframe
                        title="Google Maps"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(`${client.address}${client.city ? `, ${client.city}` : ''}${client.state ? ` - ${client.state}` : ''}`)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                      ></iframe>
                    </div>
                  )}
                </div>
              </section>

              {/* WhatsApp Chat History */}
              <section className="space-y-4">
                <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest border-b border-slate-100/50 pb-2 flex items-center gap-2">
                  <MessageSquare size={14} /> Histórico WhatsApp
                </h4>
                {clientChat ? (
                  <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-2xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Última Mensagem</p>
                      <span className="text-[9px] text-emerald-600/60 font-mono">{new Date(clientChat.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-emerald-900 font-medium italic line-clamp-2">"{clientChat.lastMessage}"</p>
                    <button 
                      className="mt-4 w-full py-2 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-colors"
                      onClick={() => window.open(`https://wa.me/${client.phone.replace(/\D/g, '')}`, '_blank')}
                    >
                      Continuar Conversa
                    </button>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Nenhum histórico encontrado</p>
                    <button 
                      className="mt-2 px-4 py-2 bg-white text-emerald-600 border border-emerald-100 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-50 transition-colors"
                      onClick={() => window.open(`https://wa.me/${client.phone.replace(/\D/g, '')}`, '_blank')}
                    >
                      Iniciar Conversa
                    </button>
                  </div>
                )}
              </section>

              {/* Histórico de Tarefas */}
              <section className="space-y-4">
                <button 
                  onClick={() => toggleSection('tasks')}
                  className="w-full flex items-center justify-between text-[10px] font-black text-amber-600 uppercase tracking-widest border-b border-slate-100/50 pb-2 hover:text-amber-700 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <ListChecks size={14} /> Histórico de Tarefas
                    {clientChat?.tasks && clientChat.tasks.length > 0 && (
                      <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-[8px]">
                        {clientChat.tasks.filter(t => !t.completed).length} pendentes
                      </span>
                    )}
                  </div>
                  {openSections.has('tasks') ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                
                <AnimatePresence>
                  {openSections.has('tasks') && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      {clientChat?.tasks && clientChat.tasks.length > 0 ? (
                        <div className="space-y-2 pt-2">
                          {clientChat.tasks.map((task) => (
                            <div key={task.id} className={`p-3 rounded-xl border flex items-start gap-3 transition-colors ${task.completed ? 'bg-slate-50 border-slate-100' : 'bg-white border-amber-100 hover:border-amber-200'}`}>
                              <div className="mt-0.5 shrink-0">
                                {task.completed ? (
                                  <CheckCircle2 size={16} className="text-emerald-500" />
                                ) : (
                                  <Circle size={16} className="text-amber-400" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium ${task.completed ? 'text-slate-500 line-through' : 'text-slate-700'}`}>
                                  {task.text}
                                </p>
                                {task.createdAt && (
                                  <p className="text-[10px] text-slate-400 mt-1 font-mono">
                                    Criada em: {new Date(task.createdAt).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50 text-center mt-2">
                          <p className="text-[10px] font-black text-slate-400 uppercase">Nenhuma tarefa associada</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>

              {/* Inventário (Ativos) */}
              <section className="space-y-4">
                <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest border-b border-slate-100/50 pb-2 flex items-center gap-2">
                  <Package size={14} /> Mapa de Equipamentos
                </h4>
                {linkedAssets.length > 0 ? (
                  <div className="space-y-2">
                    {linkedAssets.slice(0, 4).map((asset) => {
                      const risk = predictiveService.calculateRiskScore(asset);
                      return (
                        <div key={asset.id} className="p-4 bg-white/60 rounded-2xl border border-slate-100 flex justify-between items-center hover:bg-white transition-colors">
                          <div>
                            <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{asset.brand} • {asset.model}</p>
                            <p className="text-[9px] text-slate-400 font-mono">SN: {asset.serialNumber}</p>
                          </div>
                          {risk.severity === 'critical' ? (
                            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl" title="Manutenção Atrasada"><ShieldAlert size={16} /></div>
                          ) : risk.severity === 'warning' ? (
                            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl" title="Manutenção Próxima"><AlertCircle size={16} /></div>
                          ) : (
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl" title="Saudável"><ShieldCheck size={16} /></div>
                          )}
                        </div>
                      );
                    })}
                    {linkedAssets.length > 4 && (
                      <p className="text-[9px] font-bold text-slate-400 uppercase text-center pt-2">+{linkedAssets.length - 4} ativos adicionais</p>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100/50 text-center">
                    <p className="text-[10px] font-black text-amber-700 uppercase">Nenhum ativo vinculado</p>
                  </div>
                )}
              </section>

              {/* Google Drive Files */}
              <section className="space-y-4">
                <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest border-b border-slate-100/50 pb-2 flex items-center gap-2">
                  <Folder size={14} /> Documentos (Drive)
                </h4>
                {clientFiles.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {clientFiles.slice(0, 4).map((file) => (
                      <a 
                        key={file.id} 
                        href={file.webViewLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-3 bg-white/60 rounded-xl border border-slate-100 flex items-center gap-2 hover:bg-blue-50 hover:border-blue-100 transition-colors group"
                      >
                        <FileText size={14} className="text-blue-400 group-hover:text-blue-600" />
                        <span className="text-[9px] font-bold text-slate-600 truncate">{file.name}</span>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Nenhum documento encontrado</p>
                  </div>
                )}
              </section>
            </div>

            {(onDelete || onEdit) && (
              <div className="p-8 border-t border-slate-100/50 bg-white/50 flex gap-3 backdrop-blur-md">
                {onDelete && (
                  <button onClick={() => onDelete(client.id)} className="flex-1 py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase text-slate-400 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors">Excluir</button>
                )}
                {onEdit && (
                  <button onClick={() => onEdit(client)} className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-colors">Editar Cliente</button>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
