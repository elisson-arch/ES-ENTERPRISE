import type { AITool } from '../core/AIProvider';

/**
 * readFileTool — Permite ao agente ler o conteúdo de um arquivo do projeto.
 *
 * Por segurança, o agente especifica um caminho relativo que é validado
 * e lido via endpoint backend /api/agent/readFile.
 * Apenas arquivos dentro de domains/, apps/ e scripts/ são acessíveis.
 */
export const readFileTool: AITool = {
    name: 'readFile',
    description:
        'Lê o conteúdo de um arquivo do projeto. ' +
        'Use caminhos relativos a partir da raiz do projeto, ex: "domains/ai/services/geminiService.ts". ' +
        'Apenas arquivos em domains/, apps/ e scripts/ são acessíveis.',
    parameters: {
        path: {
            type: 'string',
            description: 'Caminho relativo do arquivo a partir da raiz do projeto.',
            required: true,
        },
    },
    async execute(args): Promise<string> {
        const filePath = String(args.path ?? '').replace(/\.\./g, '').replace(/^\//, '');

        const allowedPrefixes = ['domains/', 'apps/', 'scripts/'];
        const isAllowed = allowedPrefixes.some(p => filePath.startsWith(p));
        if (!isAllowed) {
            return `Acesso negado: o caminho "${filePath}" não é permitido. Use caminhos em domains/, apps/ ou scripts/.`;
        }

        try {
            const response = await fetch(`/api/agent/readFile?path=${encodeURIComponent(filePath)}`);
            if (!response.ok) {
                const err = await response.json();
                return `Erro ao ler arquivo: ${err.error ?? response.statusText}`;
            }
            const data = await response.json() as { content: string };
            return data.content;
        } catch (err) {
            return `Erro de rede ao ler o arquivo: ${err instanceof Error ? err.message : String(err)}`;
        }
    },
};
