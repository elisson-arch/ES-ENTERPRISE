import type { AIProvider, ChatMessage, AITool } from './AIProvider';

export interface AgentRunnerOptions {
    tools: AITool[];
    systemPrompt?: string;
    maxIterations?: number;
    onStep?: (step: { thought: string; action?: string; observation?: string }) => void;
}

export interface AgentResult {
    finalAnswer: string;
    steps: { thought: string; action?: string; observation?: string }[];
}

/**
 * AgentRunner — Orquestrador do loop de autonomia (Think → Act → Observe).
 */
export class AgentRunner {
    constructor(
        private provider: AIProvider,
        private options: AgentRunnerOptions
    ) {}

    async run(goal: string): Promise<AgentResult> {
        const history: ChatMessage[] = [];
        const steps: AgentResult['steps'] = [];
        const maxIterations = this.options.maxIterations ?? 10;

        for (let i = 0; i < maxIterations; i++) {
            const response = await this.provider.chatWithTools(
                [{ role: 'user', content: goal }, ...history],
                this.options.tools,
                { systemPrompt: this.options.systemPrompt }
            );

            const thought = response.text;
            
            if (!response.toolCalls || response.toolCalls.length === 0) {
                steps.push({ thought });
                return { finalAnswer: thought, steps };
            }

            // Executa ferramentas em paralelo ou sequencial
            const toolResults = await Promise.all(
                response.toolCalls.map(async (call) => {
                    const tool = this.options.tools.find(t => t.name === call.name);
                    const observation = tool 
                        ? await tool.execute(call.args)
                        : `Erro: Ferramenta "${call.name}" não encontrada.`;
                    
                    return { name: call.name, observation };
                })
            );

            // Registra o passo
            response.toolCalls.forEach((call, idx) => {
                steps.push({
                    thought,
                    action: `${call.name}(${JSON.stringify(call.args)})`,
                    observation: toolResults[idx].observation
                });
                
                if (this.options.onStep) {
                    this.options.onStep(steps[steps.length - 1]);
                }
            });

            // Atualiza histórico
            history.push({ role: 'assistant', content: thought });
            toolResults.forEach(res => {
                history.push({
                    role: 'user',
                    content: `[Resultado de ${res.name}]: ${res.observation}`,
                    toolResult: { name: res.name, result: res.observation }
                });
            });
        }

        return {
            finalAnswer: "Limite de iterações atingido sem conclusão.",
            steps
        };
    }
}
