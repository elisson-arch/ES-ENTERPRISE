
import { ChatSession, ChatTemplate } from '../types';

export const INITIAL_WHATSAPP_CHATS: ChatSession[] = [
  {
    id: 'c1',
    clientId: '1',
    clientName: 'Condomínio Residencial Aurora',
    clientPhone: '(11) 98765-4321',
    clientAddress: 'Av. das Flores, 450 - São Paulo, SP',
    lastMessage: 'Aguardando confirmação de visita.',
    unreadCount: 2,
    aiEnabled: true,
    clientType: 'Comercial',
    status: 'Ativo',
    chatStatus: 'Aberto',
    funnelStage: 'Diagnóstico',
    assignedTo: 'Ricardo Pro',
    createdAt: new Date().toISOString(),
    messages: [
      { id: 'm1', sender: 'client', text: 'Boa tarde, qual o valor da limpeza?', timestamp: '14:20' },
    ],
    tasks: [],
    billingData: { lastInvoice: "20/04/2024", totalSpent: 4500, pendingAmount: 0 }
  }
];

export const DEFAULT_TEMPLATES: ChatTemplate[] = [
  { id: 't1', title: 'Saudação Pro', category: 'Saudação', content: 'Olá {{nome}}, sou da SGC Pro. Como podemos agilizar sua manutenção hoje?', isApproved: true, usageCount: 210 },
  { id: 't2', title: 'Aviso Visita', category: 'Manutenção', content: 'Olá {{nome}}, confirmamos sua visita para {{data}} no endereço {{endereco}}.', isApproved: true, usageCount: 45 }
];
