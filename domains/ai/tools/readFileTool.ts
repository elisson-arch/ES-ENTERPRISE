import type { AITool } from '../core/AIProvider';

/**
 * readFileTool — Lê o conteúdo de um arquivo do projeto via API segura.
 */
export const readFileTool: AITool = {
    name: 'readFile',
    description: 'Lê o conteúdo de um arquivo. Use caminhos relativos como "domains/ai/services/aiService.ts".',
    parameters: {
        path: { type: 'string', description: 'Caminho relativo do arquivo.', required: true }
    },
    async execute(args): Promise<string> {
        const path = String(args.path);
        try {
            const response = await fetch(`/api/agent/readFile?path=${encodeURIComponent(path)}`);
            if (!response.ok) {
                const err = await response.json();
                return `Erro: ${err.error || response.statusText}`;
            }
            const data = await response.json();
            return data.content;
        } catch (err) {
            return `Erro de rede: ${err instanceof Error ? err.message : String(err)}`;
        }
    },
};
