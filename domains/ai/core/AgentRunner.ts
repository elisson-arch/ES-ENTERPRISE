import type { AIProvider, AITool, ChatMessage, ChatOptions } from './AIProvider';

export interface AgentRunnerOptions {
    /** Instrução de sistema (personalidade/regras) */
    systemPrompt?: string;
    /** Ferramentas que o agente pode usar (default: todas do ToolRegistry) */
    tools?: AITool[];
    /** Máximo de iterações do loop para evitar loops infinitos. Default: 10 */
    maxIterations?: number;
    /** Callback chamado a cada passo do agente (para streaming de progresso) */
    onStep?: (step: AgentStep) => void;
    /** Opções de chat passadas ao provedor */
    chatOptions?: Omit<ChatOptions, 'systemPrompt'>;
}

export interface AgentStep {
    iteration: number;
    type: 'thinking' | 'tool_call' | 'tool_result' | 'final_answer';
    content: string;
    toolName?: string;
    toolArgs?: Record<string, unknown>;
}

export interface AgentResult {
    answer: string;
    steps: AgentStep[];
    iterations: number;
}

/**
 * AgentRunner — Orquestra o loop autônomo do agente.
 *
 * Fluxo por iteração:
 *   1. Envia histórico de mensagens + ferramentas para o provedor
 *   2. Se a IA responder com tool_calls → executa as ferramentas
 *   3. Adiciona os resultados ao histórico e repete
 *   4. Se a IA responder com texto (sem tool_calls) → retorna a resposta final
 *
 * Completamente agnóstico ao provedor — funciona com Gemini, GPT, Claude, etc.
 */
export class AgentRunner {
    private provider: AIProvider;
    private options: Required<Omit<AgentRunnerOptions, 'onStep' | 'chatOptions'>> & Pick<AgentRunnerOptions, 'onStep' | 'chatOptions'>;

    constructor(provider: AIProvider, options: AgentRunnerOptions = {}) {
        this.provider = provider;
        this.options = {
            systemPrompt: options.systemPrompt ?? '',
            tools: options.tools ?? [],
            maxIterations: options.maxIterations ?? 10,
            onStep: options.onStep,
            chatOptions: options.chatOptions,
        };
    }

    async run(userGoal: string, history: ChatMessage[] = []): Promise<AgentResult> {
        const messages: ChatMessage[] = [
            ...history,
            { role: 'user', content: userGoal },
        ];

        const steps: AgentStep[] = [];
        let iteration = 0;

        while (iteration < this.options.maxIterations) {
            iteration++;

            // ── 1. Consulta a IA ──────────────────────────────────────────
            const response = await this.provider.chatWithTools(messages, this.options.tools, {
                systemPrompt: this.options.systemPrompt,
                ...this.options.chatOptions,
            });

            // ── 2. Sem tool calls → resposta final ────────────────────────
            if (!response.toolCalls || response.toolCalls.length === 0) {
                const finalStep: AgentStep = {
                    iteration,
                    type: 'final_answer',
                    content: response.text,
                };
                steps.push(finalStep);
                this.options.onStep?.(finalStep);

                return { answer: response.text, steps, iterations: iteration };
            }

            // ── 3. Executa cada tool call ─────────────────────────────────
            for (const toolCall of response.toolCalls) {
                const thinkingStep: AgentStep = {
                    iteration,
                    type: 'tool_call',
                    content: `Usando ferramenta: ${toolCall.name}`,
                    toolName: toolCall.name,
                    toolArgs: toolCall.args,
                };
                steps.push(thinkingStep);
                this.options.onStep?.(thinkingStep);

                // Encontra e executa a ferramenta
                const tool = this.options.tools.find(t => t.name === toolCall.name);
                let toolResult: string;

                if (!tool) {
                    toolResult = `Erro: ferramenta "${toolCall.name}" não encontrada.`;
                } else {
                    try {
                        toolResult = await tool.execute(toolCall.args);
                    } catch (err) {
                        toolResult = `Erro ao executar "${toolCall.name}": ${err instanceof Error ? err.message : String(err)}`;
                    }
                }

                const resultStep: AgentStep = {
                    iteration,
                    type: 'tool_result',
                    content: toolResult,
                    toolName: toolCall.name,
                };
                steps.push(resultStep);
                this.options.onStep?.(resultStep);

                // Adiciona o resultado ao histórico para a próxima iteração
                messages.push({
                    role: 'assistant',
                    content: `[Ferramenta: ${toolCall.name}]`,
                    toolResult: { name: toolCall.name, result: toolResult },
                });
            }
        }

        // ── 4. Limite de iterações atingido ────────────────────────────────
        const fallback = 'Limite de iterações atingido sem uma resposta final.';
        steps.push({ iteration, type: 'final_answer', content: fallback });
        return { answer: fallback, steps, iterations: iteration };
    }
}
