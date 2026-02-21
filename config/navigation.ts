
import {
    Users, LayoutDashboard, MessageSquare, Calendar,
    Database, Zap, Target, BarChart3, Shield,
    Settings, Bot, Globe, FileText, HardDrive
} from 'lucide-react';

export const NAVIGATION_ROUTES = [
    { id: 'dashboard', path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'whatsapp', path: '/whatsapp', label: 'WhatsApp Chat', icon: MessageSquare },
    { id: 'clients', path: '/clientes', label: 'CRM Clientes', icon: Users },
    { id: 'funnel', path: '/funnel', label: 'Funis de Venda', icon: Target },
    { id: 'automations', path: '/automations', label: 'Automações', icon: Zap },
    { id: 'inventory', path: '/ativos', label: 'Ativos & Peças', icon: Database },
    { id: 'documents', path: '/documentos', label: 'Documentos', icon: FileText },
    { id: 'drive', path: '/drive', label: 'Cloud Drive', icon: HardDrive },
    { id: 'reports', path: '/reports', label: 'Relatórios', icon: BarChart3 },
    { id: 'ia', path: '/ia', label: 'Ricardo AI', icon: Bot },
    { id: 'site', path: '/site', label: 'Site Builder', icon: Globe },
    { id: 'security', path: '/security', label: 'Segurança', icon: Shield },
    { id: 'integrations', path: '/integrations', label: 'Integrações', icon: Settings }
];
