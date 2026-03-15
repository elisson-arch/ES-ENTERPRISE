import type { AITool } from '../core/AIProvider';

/**
 * listDomainsTool — Lista os domínios de negócio e apps do projeto.
 */
export const listDomainsTool: AITool = {
    name: 'listDomains',
    description: 'Lista todos os domínios de negócio (domains/) e apps (apps/) do projeto ES-ENTERPRISE.',
    parameters: {},
    async execute(): Promise<string> {
        const structure = {
            apps: {
                web: 'Frontend React + Vite.',
                api: 'Backend Express + Proxy IA.',
            },
            domains: {
                shared: 'Configurações globais, Firebase, temas.',
                auth: 'Autenticação e autorização.',
                ai: 'Inteligência Artificial e Agente Autônomo.',
                inventory: 'Gestão de estoque.',
                clients: 'CRM de clientes.',
                whatsapp: 'Integração WhatsApp.',
                reports: 'Dashboards e relatórios.',
                'google-workspace': 'Integração Google Drive/Gmail.',
                'site-builder': 'Construtor de sites.',
            },
        };
        return JSON.stringify(structure, null, 2);
    },
};
