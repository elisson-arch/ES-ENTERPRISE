import type { AITool } from '../core/AIProvider';

/**
 * searchCodeTool — Permite ao agente buscar padrões no código fonte do projeto.
 *
 * Realiza uma busca por substring via endpoint backend /api/agent/searchCode.
 * Retorna os arquivos e linhas onde o padrão foi encontrado.
 */
export const searchCodeTool: AITool = {
    name: 'searchCode',
    description:
        'Busca por um padrão de texto no código fonte do projeto. ' +
        'Retorna os arquivos e números de linha onde o padrão foi encontrado. ' +
        'Útil para descobrir onde uma função, componente ou variável é usada.',
    parameters: {
        pattern: {
            type: 'string',
            description: 'Texto ou padrão a buscar no código.',
            required: true,
        },
        scope: {
            type: 'string',
            description: 'Diretório onde buscar. Ex: "domains/ai", "apps/api". Default: busca em todo o projeto.',
            required: false,
            enum: [
                'domains/ai', 'domains/auth', 'domains/shared', 'domains/inventory',
                'domains/clients', 'domains/whatsapp', 'domains/reports',
                'domains/google-workspace', 'domains/site-builder',
                'apps/api', 'apps/web', 'scripts',
            ],
        },
    },
    async execute(args): Promise<string> {
        const pattern = String(args.pattern ?? '').trim();
        const scope = args.scope ? String(args.scope) : '';

        if (!pattern) return 'Erro: o parâmetro "pattern" é obrigatório.';

        try {
            const params = new URLSearchParams({ pattern });
            if (scope) params.set('scope', scope);

            const response = await fetch(`/api/agent/searchCode?${params.toString()}`);
            if (!response.ok) {
                const err = await response.json();
                return `Erro na busca: ${err.error ?? response.statusText}`;
            }

            const data = await response.json() as { results: { file: string; line: number; content: string }[] };
            if (!data.results.length) return `Nenhum resultado encontrado para "${pattern}".`;

            return data.results
                .slice(0, 20) // limita a 20 resultados para não estourar o contexto
                .map(r => `${r.file}:${r.line} → ${r.content.trim()}`)
                .join('\n');
        } catch (err) {
            return `Erro de rede na busca: ${err instanceof Error ? err.message : String(err)}`;
        }
    },
};
