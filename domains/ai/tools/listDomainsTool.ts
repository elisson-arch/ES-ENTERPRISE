import type { AITool } from '../core/AIProvider';

/**
 * listDomainsTool — Lista os domínios de negócio e apps do projeto.
 *
 * Permite ao agente conhecer a estrutura do sistema antes de agir.
 */
export const listDomainsTool: AITool = {
    name: 'listDomains',
    description:
        'Lista todos os domínios de negócio (domains/) e apps (apps/) do projeto ES-ENTERPRISE, ' +
        'incluindo uma breve descrição de responsabilidade de cada um.',
    parameters: {},
    async execute(): Promise<string> {
        const structure = {
            apps: {
                web: 'Frontend React + Vite. Entry point da aplicação SPA.',
                api: 'Backend Express. Serve o frontend e atua como proxy seguro para APIs externas (Gemini, OpenAI).',
            },
            domains: {
                shared:       'Configurações globais, Firebase, temas, hooks, componentes de layout, rotas.',
                auth:         'Autenticação e autorização. Login Google, Firebase Auth, rotas protegidas.',
                ai:           'Inteligência Artificial. Provedores, agente autônomo, Ricardo IA (HVAC assistant).',
                inventory:    'Gestão de estoque de peças e equipamentos de climatização.',
                clients:      'CRM de clientes. Cadastro, histórico de atendimentos, geolocalização.',
                whatsapp:     'Integração com WhatsApp Business API para atendimento e notificações.',
                reports:      'Relatórios analíticos. Gráficos, dashboards, exportação de dados.',
                'google-workspace': 'Integração com Google Drive, Gmail, Calendar, Sheets e Docs.',
                'site-builder':    'Construtor de sites para os clientes B2B da empresa.',
            },
        };

        return JSON.stringify(structure, null, 2);
    },
};
