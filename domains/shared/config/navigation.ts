
import {
    Users, LayoutDashboard, MessageSquare,
    Database, Zap, Target, BarChart3, Shield,
    Settings, Bot, Globe, FileText, HardDrive
} from 'lucide-react';

export const NAVIGATION_ROUTES = [
    { id: 'dashboard', path: '/', label: 'Painel Principal', icon: LayoutDashboard },
    { 
        id: 'whatsapp', path: '/whatsapp', label: 'Chat WhatsApp', icon: MessageSquare,
        subItems: [
            { path: '/whatsapp/chats', label: 'Conversas Ativas' },
            { path: '/whatsapp/templates', label: 'Templates de Mensagem' },
            { path: '/whatsapp/settings', label: 'Configurações do Bot' }
        ]
    },
    { 
        id: 'clients', path: '/clientes', label: 'Clientes CRM', icon: Users,
        subItems: [
            { path: '/clientes/list', label: 'Lista de Clientes' },
            { path: '/clientes/new', label: 'Novo Cliente' },
            { path: '/clientes/segments', label: 'Segmentação' }
        ]
    },
    { 
        id: 'funnel', path: '/funnel', label: 'Funis de Vendas', icon: Target,
        subItems: [
            { path: '/funnel/active', label: 'Funil Ativo' },
            { path: '/funnel/won', label: 'Negócios Ganhos' },
            { path: '/funnel/lost', label: 'Negócios Perdidos' }
        ]
    },
    { id: 'automations', path: '/automations', label: 'Automações IA', icon: Zap },
    { 
        id: 'inventory', path: '/ativos', label: 'Ativos & Peças', icon: Database,
        subItems: [
            { path: '/ativos/equipment', label: 'Equipamentos' },
            { path: '/ativos/parts', label: 'Peças de Reposição' },
            { path: '/ativos/maintenance', label: 'Histórico de Manutenção' }
        ]
    },
    { id: 'documents', path: '/documentos', label: 'Documentos', icon: FileText },
    { id: 'drive', path: '/drive', label: 'Nuvem Drive', icon: HardDrive },
    { 
        id: 'reports', path: '/reports', label: 'Relatórios', icon: BarChart3,
        subItems: [
            { path: '/reports/sales', label: 'Vendas' },
            { path: '/reports/performance', label: 'Desempenho da Equipe' },
            { path: '/reports/financial', label: 'Financeiro' }
        ]
    },
    { 
        id: 'ia', path: '/ia', label: 'Ricardo IA', icon: Bot,
        subItems: [
            { path: '/ia/chat', label: 'Cérebro (Chat)' },
            { path: '/ia/treinamento', label: 'Centro de Treinamento' }
        ]
    },
    { id: 'site', path: '/site', label: 'Criador de Site', icon: Globe },
    { id: 'security', path: '/security', label: 'Segurança', icon: Shield },
    { id: 'integrations', path: '/integrations', label: 'Integrações', icon: Settings }
];
