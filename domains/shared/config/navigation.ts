
import {
    Users, LayoutDashboard, MessageSquare, Calendar,
    Database, Zap, Target, BarChart3, Shield,
    Settings, Bot, Globe, FileText, HardDrive
} from 'lucide-react';

export const NAVIGATION_ROUTES = [
    { id: 'dashboard', path: '/', label: 'Painel Principal', icon: LayoutDashboard },
    { id: 'whatsapp', path: '/whatsapp', label: 'Chat WhatsApp', icon: MessageSquare },
    { id: 'clients', path: '/clientes', label: 'Clientes CRM', icon: Users },
    { id: 'funnel', path: '/funnel', label: 'Funis de Vendas', icon: Target },
    { id: 'automations', path: '/automations', label: 'Automações IA', icon: Zap },
    { id: 'inventory', path: '/ativos', label: 'Ativos & Peças', icon: Database },
    { id: 'documents', path: '/documentos', label: 'Documentos', icon: FileText },
    { id: 'drive', path: '/drive', label: 'Nuvem Drive', icon: HardDrive },
    { id: 'reports', path: '/reports', label: 'Relatórios', icon: BarChart3 },
    { id: 'ia', path: '/ia', label: 'Ricardo IA', icon: Bot },
    { id: 'site', path: '/site', label: 'Criador de Site', icon: Globe },
    { id: 'security', path: '/security', label: 'Segurança', icon: Shield },
    { id: 'integrations', path: '/integrations', label: 'Integrações', icon: Settings }
];
