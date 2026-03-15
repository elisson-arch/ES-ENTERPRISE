import type { AITool } from './AIProvider';

/**
 * ToolRegistry — Registro centralizado de ferramentas para o agente.
 */
export class ToolRegistry {
    private static tools = new Map<string, AITool>();

    static register(tool: AITool) {
        this.tools.set(tool.name, tool);
    }

    static registerAll(tools: AITool[]) {
        tools.forEach(t => this.register(t));
    }

    static getByName(name: string): AITool | undefined {
        return this.tools.get(name);
    }

    static getByNames(names: string[]): AITool[] {
        return names
            .map(name => this.tools.get(name))
            .filter((t): t is AITool => t !== undefined);
    }

    static getAll(): AITool[] {
        return Array.from(this.tools.values());
    }
}
