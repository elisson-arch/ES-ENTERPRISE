import type { AIProvider, ChatMessage, ChatOptions } from '../core/AIProvider';
import { AgentRunner, type AgentRunnerOptions } from '../core/AgentRunner';
import { ToolRegistry } from '../core/ToolRegistry';
import { GeminiProvider } from '../providers/GeminiProvider';
import { OpenAIProvider } from '../providers/OpenAIProvider';
import { APP_CONFIG } from '@shared/config/config';
import { listDomainsTool } from '../tools/listDomainsTool';
import { readFileTool } from '../tools/readFileTool';
import { writeFileTool } from '../tools/writeFileTool';
import { searchCodeTool } from '../tools/searchCodeTool';

// Auto-registro das ferramentas
ToolRegistry.registerAll([
    listDomainsTool,
    readFileTool,
    writeFileTool,
    searchCodeTool
]);

/**
 * aiService — Singleton universal para acesso à IA e Agentes.
 */

function createProvider(): AIProvider {
    const providerName = APP_CONFIG.AI.PROVIDER || 'gemini';
    return providerName === 'openai' ? new OpenAIProvider() : new GeminiProvider();
}

let _provider: AIProvider = createProvider();

export const aiService = {
    getProvider(): AIProvider {
        return _provider;
    },

    setProvider(name: 'gemini' | 'openai'): void {
        _provider = name === 'openai' ? new OpenAIProvider() : new GeminiProvider();
    },

    async chat(userMessage: string, options?: ChatOptions & { history?: ChatMessage[] }): Promise<string> {
        const messages: ChatMessage[] = [
            ...(options?.history ?? []),
            { role: 'user', content: userMessage }
        ];
        const { history: _h, ...rest } = options ?? {};
        void _h;
        const response = await _provider.chat(messages, rest);
        return response.text;
    },

    async runAgent(goal: string, options?: Omit<AgentRunnerOptions, 'tools'>): Promise<import('../core/AgentRunner').AgentResult> {
        const runner = new AgentRunner(_provider, {
            ...options,
            tools: ToolRegistry.getAll()
        });
        return runner.run(goal);
    }
};
