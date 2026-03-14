import type { AIProvider, ChatMessage, ChatOptions } from '../core/AIProvider';
import { AgentRunner, type AgentRunnerOptions } from '../core/AgentRunner';
import { ToolRegistry } from '../core/ToolRegistry';
import { GeminiProvider } from '../providers/GeminiProvider';
import { OpenAIProvider } from '../providers/OpenAIProvider';
import { listDomainsTool } from '../tools/listDomainsTool';
import { readFileTool } from '../tools/readFileTool';
import { searchCodeTool } from '../tools/searchCodeTool';
import { APP_CONFIG } from '@shared/config/config';

// ---------------------------------------------------------------------------
// Registro global de ferramentas do agente
// ---------------------------------------------------------------------------
ToolRegistry.registerAll([listDomainsTool, readFileTool, searchCodeTool]);

// ---------------------------------------------------------------------------
// Factory: cria o provedor correto conforme configuração
// ---------------------------------------------------------------------------

type ProviderName = 'gemini' | 'openai';

function createProvider(name?: ProviderName): AIProvider {
    const providerName = (name ?? APP_CONFIG.AI.PROVIDER ?? 'gemini') as ProviderName;

    switch (providerName) {
        case 'openai':
            return new OpenAIProvider();
        case 'gemini':
        default:
            return new GeminiProvider();
    }
}

// Provider padrão (singleton leve — recriado se a config mudar)
let _defaultProvider: AIProvider | null = null;
function getDefaultProvider(): AIProvider {
    if (!_defaultProvider) {
        _defaultProvider = createProvider();
    }
    return _defaultProvider;
}

// ---------------------------------------------------------------------------
// aiService — API pública universal para toda a aplicação
// ---------------------------------------------------------------------------

export const aiService = {
    /**
     * Retorna o provedor de IA ativo.
     * Útil para saber qual IA está sendo usada na UI.
     */
    getProvider(): AIProvider {
        return getDefaultProvider();
    },

    /**
     * Força a troca do provedor em tempo de execução.
     * Chamado quando o usuário muda as configurações de IA.
     */
    setProvider(name: ProviderName): void {
        _defaultProvider = createProvider(name);
    },

    /**
     * Chat simples: envia uma mensagem e recebe resposta textual.
     * Substituto direto do geminiService.getChatResponse().
     */
    async chat(
        userMessage: string,
        options?: ChatOptions & { history?: ChatMessage[] }
    ): Promise<string> {
        const messages: ChatMessage[] = [
            ...(options?.history ?? []),
            { role: 'user', content: userMessage },
        ];
        const { history: _, ...chatOptions } = options ?? {};
        void _;
        const response = await getDefaultProvider().chat(messages, chatOptions);
        return response.text;
    },

    /**
     * Executa o agente autônomo com acesso a ferramentas.
     * A IA pode ler arquivos, buscar código, listar domínios, etc.
     * para responder perguntas complexas sobre o sistema.
     */
    async runAgent(
        goal: string,
        options?: Omit<AgentRunnerOptions, 'tools'> & { tools?: string[] }
    ): Promise<import('../core/AgentRunner').AgentResult> {
        const tools = options?.tools
            ? ToolRegistry.getByNames(options.tools)
            : ToolRegistry.getAll();

        const runner = new AgentRunner(getDefaultProvider(), {
            tools,
            systemPrompt: options?.systemPrompt,
            maxIterations: options?.maxIterations ?? 10,
            onStep: options?.onStep,
        });

        return runner.run(goal);
    },

    /**
     * Cria uma instância de AgentRunner com um provedor específico.
     * Útil para rodar agentes paralelos com IAs diferentes.
     */
    createAgent(providerName?: ProviderName, runnerOptions?: AgentRunnerOptions): AgentRunner {
        const provider = providerName ? createProvider(providerName) : getDefaultProvider();
        return new AgentRunner(provider, {
            tools: ToolRegistry.getAll(),
            ...runnerOptions,
        });
    },
};
