/**
 * AIProvider.ts — Contrato universal para provedores de IA
 *
 * Qualquer provedor (Gemini, OpenAI, Claude...) deve implementar
 * esta interface. O resto do sistema depende apenas deste contrato,
 * nunca de um SDK específico.
 */

// ---------------------------------------------------------------------------
// Tipos de mensagem
// ---------------------------------------------------------------------------

export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
    role: MessageRole;
    content: string;
    /** Resultado de uma tool call (usado internamente pelo AgentRunner) */
    toolResult?: { name: string; result: string };
}

// ---------------------------------------------------------------------------
// Ferramentas (Function Calling)
// ---------------------------------------------------------------------------

/** Parâmetro individual de uma ferramenta */
export interface ToolParameter {
    type: 'string' | 'number' | 'boolean' | 'array' | 'object';
    description: string;
    required?: boolean;
    enum?: string[];
}

/** Definição de uma ferramenta que o agente pode invocar */
export interface AITool {
    name: string;
    description: string;
    parameters: Record<string, ToolParameter>;
    /** Executa a ferramenta e retorna o resultado como string */
    execute: (args: Record<string, unknown>) => Promise<string>;
}

/** Chamada de ferramenta retornada pela IA */
export interface ToolCall {
    name: string;
    args: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Opções e resposta
// ---------------------------------------------------------------------------

export interface ChatOptions {
    /** Instrução de sistema (personalidade/regras da IA) */
    systemPrompt?: string;
    /** Sobrescreve o modelo padrão do provedor */
    model?: string;
    /** Criatividade: 0 (determinístico) a 1 (criativo). Default: 0.7 */
    temperature?: number;
    /** Máximo de tokens na resposta */
    maxTokens?: number;
    /** Formato da resposta (quando suportado) */
    responseFormat?: 'text' | 'json';
}

export interface AIResponse {
    /** Texto final da resposta */
    text: string;
    /** Ferramenta(s) que a IA quer chamar (agente com tools) */
    toolCalls?: ToolCall[];
    /** Resposta bruta do provedor (para debug) */
    raw?: unknown;
}

// ---------------------------------------------------------------------------
// Interface do Provedor
// ---------------------------------------------------------------------------

/**
 * Contrato que todo provedor de IA deve implementar.
 * Adicionar suporte a uma nova IA = criar um novo Adapter que implemente isto.
 */
export interface AIProvider {
    /** Identificador do provedor (ex: 'gemini', 'openai', 'claude') */
    readonly name: string;
    /** Modelo padrão usado quando nenhum é especificado */
    readonly defaultModel: string;

    /**
     * Chat simples: envia mensagens e recebe resposta textual.
     */
    chat(messages: ChatMessage[], options?: ChatOptions): Promise<AIResponse>;

    /**
     * Chat com ferramentas: a IA pode solicitar execução de tools.
     * O AgentRunner gerencia o loop de chamada/resposta.
     */
    chatWithTools(messages: ChatMessage[], tools: AITool[], options?: ChatOptions): Promise<AIResponse>;
}
