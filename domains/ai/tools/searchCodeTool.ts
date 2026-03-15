import type { AITool } from '../core/AIProvider';

/**
 * searchCodeTool — Busca texto no código fonte via API segura.
 */
export const searchCodeTool: AITool = {
    name: 'searchCode',
    description: 'Busca padrões de texto no código fonte.',
    parameters: {
        pattern: { type: 'string', description: 'Texto para buscar.', required: true },
        scope: { type: 'string', description: 'Diretório opcional (ex: domains/ai).', required: false }
    },
    async execute(args): Promise<string> {
        const { pattern, scope } = args;
        try {
            const params = new URLSearchParams({ pattern: String(pattern) });
            if (scope) params.set('scope', String(scope));

            const response = await fetch(`/api/agent/searchCode?${params.toString()}`);
            if (!response.ok) {
                const err = await response.json();
                return `Erro na busca: ${err.error || response.statusText}`;
            }
            const data = await response.json();
            if (data.results.length === 0) return 'Nenhum resultado encontrado.';
            
            return data.results
                .slice(0, 15)
                .map((r: any) => `${r.file}:${r.line} → ${r.content.trim()}`)
                .join('\n');
        } catch (err) {
            return `Erro de rede: ${err instanceof Error ? err.message : String(err)}`;
        }
    },
};
