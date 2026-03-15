import type { AITool } from '../core/AIProvider';

/**
 * writeFileTool — Escreve ou atualiza um arquivo no projeto via API segura.
 */
export const writeFileTool: AITool = {
    name: 'writeFile',
    description: 'Escreve ou atualiza um arquivo. Use caminhos relativos em domains/, apps/ ou scripts/.',
    parameters: {
        path: { type: 'string', description: 'Caminho relativo do arquivo.', required: true },
        content: { type: 'string', description: 'Conteúdo completo para escrever no arquivo.', required: true }
    },
    async execute(args): Promise<string> {
        const { path, content } = args;
        try {
            const response = await fetch('/api/agent/writeFile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ path, content }),
            });
            if (!response.ok) {
                const err = await response.json();
                return `Erro ao salvar: ${err.error || response.statusText}`;
            }
            return `Sucesso: Arquivo "${path}" atualizado com sucesso.`;
        } catch (err) {
            return `Erro de rede: ${err instanceof Error ? err.message : String(err)}`;
        }
    },
};
