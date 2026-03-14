import type { AIProvider, AITool, AIResponse, ChatMessage, ChatOptions } from '../core/AIProvider';
import { APP_CONFIG } from '@shared/config/config';

// OpenAI raw response shapes (subset needed for mapping)
interface OpenAIToolCall { function: { name: string; arguments: string } }
interface OpenAIMessage { content?: string; tool_calls?: OpenAIToolCall[] }
interface OpenAIChoice { message: OpenAIMessage }
interface OpenAIRawResponse { choices?: OpenAIChoice[] }

/**
 * OpenAIProvider — Adapter que implementa AIProvider para a OpenAI (GPT-4o, etc.).
 *
 * Comunica-se com o backend em /api/ai/generate passando provider='openai',
 * mantendo a API key no servidor, nunca exposta no frontend.
 */
export class OpenAIProvider implements AIProvider {
    readonly name = 'openai';
    readonly defaultModel: string;

    constructor(model?: string) {
        this.defaultModel = model ?? 'gpt-4o-mini';
    }

    // ── Chamada interna ao proxy do backend ─────────────────────────────────
    private async callProxy(body: Record<string, unknown>): Promise<unknown> {
        const token = await this.getAuthToken();
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(APP_CONFIG.API.AI_GENERATE_PROXY, {
            method: 'POST',
            headers,
            body: JSON.stringify({ provider: 'openai', ...body }),
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || `OpenAI Proxy error: ${response.status}`);
        }
        return response.json();
    }

    /** Tenta obter o token do Firebase Auth (se disponível) */
    private async getAuthToken(): Promise<string | null> {
        try {
            const { auth } = await import('@shared/config/firebase');
            return (await auth.currentUser?.getIdToken()) ?? null;
        } catch {
            return null;
        }
    }

    // ── Mapeamento de mensagens para o formato OpenAI ───────────────────────
    private toOpenAIMessages(messages: ChatMessage[], systemPrompt?: string) {
        const result: { role: string; content: string }[] = [];

        if (systemPrompt) {
            result.push({ role: 'system', content: systemPrompt });
        }

        for (const msg of messages) {
            if (msg.role === 'system') {
                result.push({ role: 'system', content: msg.content });
            } else if (msg.toolResult) {
                result.push({
                    role: 'tool',
                    content: `[${msg.toolResult.name}]: ${msg.toolResult.result}`,
                });
            } else {
                result.push({
                    role: msg.role === 'assistant' ? 'assistant' : 'user',
                    content: msg.content,
                });
            }
        }

        return result;
    }

    // ── Mapeamento de ferramentas para o formato OpenAI ─────────────────────
    private toOpenAITools(tools: AITool[]) {
        return tools.map(tool => ({
            type: 'function',
            function: {
                name: tool.name,
                description: tool.description,
                parameters: {
                    type: 'object',
                    properties: Object.fromEntries(
                        Object.entries(tool.parameters).map(([key, param]) => [
                            key,
                            { type: param.type, description: param.description, enum: param.enum },
                        ])
                    ),
                    required: Object.entries(tool.parameters)
                        .filter(([, p]) => p.required)
                        .map(([k]) => k),
                },
            },
        }));
    }

    // ── AIProvider: chat ─────────────────────────────────────────────────────
    async chat(messages: ChatMessage[], options?: ChatOptions): Promise<AIResponse> {
        const openaiMessages = this.toOpenAIMessages(messages, options?.systemPrompt);

        const data = await this.callProxy({
            model: options?.model ?? this.defaultModel,
            messages: openaiMessages,
            temperature: options?.temperature ?? 0.7,
            max_tokens: options?.maxTokens,
            response_format: options?.responseFormat === 'json' ? { type: 'json_object' } : undefined,
        }) as OpenAIRawResponse;

        const text = data?.choices?.[0]?.message?.content ?? '';
        return { text, raw: data };
    }

    // ── AIProvider: chatWithTools ────────────────────────────────────────────
    async chatWithTools(messages: ChatMessage[], tools: AITool[], options?: ChatOptions): Promise<AIResponse> {
        const openaiMessages = this.toOpenAIMessages(messages, options?.systemPrompt);
        const openaiTools = this.toOpenAITools(tools);

        const data = await this.callProxy({
            model: options?.model ?? this.defaultModel,
            messages: openaiMessages,
            tools: openaiTools,
            tool_choice: 'auto',
        }) as OpenAIRawResponse;

        const choice = data?.choices?.[0];
        const message = choice?.message;
        const text = message?.content ?? '';

        const toolCalls = (message?.tool_calls ?? []).map(tc => ({
            name: tc.function.name,
            args: JSON.parse(tc.function.arguments || '{}') as Record<string, unknown>,
        }));

        return {
            text,
            toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
            raw: data,
        };
    }
}
