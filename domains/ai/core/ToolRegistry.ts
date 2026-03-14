import type { AITool } from './AIProvider';

/**
 * ToolRegistry — Registro central de ferramentas disponíveis para o agente.
 *
 * Ferramentas são registradas uma vez e reutilizadas em qualquer
 * sessão de agente, independente do provedor de IA.
 *
 * @example
 * // Registro:
 * ToolRegistry.register(readFileTool);
 *
 * // Uso pelo agente:
 * const tools = ToolRegistry.getAll();
 */
export class ToolRegistry {
    private static tools: Map<string, AITool> = new Map();

    /** Registra uma ferramenta pelo nome. Sobrescreve se já existir. */
    static register(tool: AITool): void {
        this.tools.set(tool.name, tool);
    }

    /** Registra múltiplas ferramentas de uma vez. */
    static registerAll(tools: AITool[]): void {
        tools.forEach(t => this.register(t));
    }

    /** Retorna uma ferramenta pelo nome, ou undefined se não encontrada. */
    static get(name: string): AITool | undefined {
        return this.tools.get(name);
    }

    /** Retorna todas as ferramentas registradas. */
    static getAll(): AITool[] {
        return Array.from(this.tools.values());
    }

    /** Retorna apenas ferramentas com os nomes especificados. */
    static getByNames(names: string[]): AITool[] {
        return names.map(n => this.tools.get(n)).filter(Boolean) as AITool[];
    }

    /** Remove uma ferramenta do registro. */
    static unregister(name: string): void {
        this.tools.delete(name);
    }

    /** Lista os nomes de todas as ferramentas registradas. */
    static listNames(): string[] {
        return Array.from(this.tools.keys());
    }
}
