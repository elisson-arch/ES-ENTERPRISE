import type { AIProvider, AITool, AIResponse, ChatMessage, ChatOptions } from '../core/AIProvider';
import { APP_CONFIG } from '@shared/config/config';

// Gemini raw response shapes (subset needed for mapping)
interface GeminiPart { text?: string; functionCall?: { name: string; args: Record<string, unknown> }; inlineData?: unknown }
interface GeminiCandidate { content?: { parts: GeminiPart[] }; groundingMetadata?: unknown }
interface GeminiRawResponse { candidates?: GeminiCandidate[] }

/**
 * GeminiProvider — Adapter que implementa AIProvider para o Google Gemini.
 *
 * Comunica-se com o backend em /api/ai/generate (proxy seguro).
 * A API key nunca fica exposta no frontend.
 */
export class GeminiProvider implements AIProvider {
    readonly name = 'gemini';
    readonly defaultModel: string;

    constructor(model?: string) {
        this.defaultModel = model ?? APP_CONFIG.AI.MODELS.FAST;
    }

    // ── Chamada interna ao proxy do backend ─────────────────────────────────
    private async callProxy(
        model: string,
        contents: unknown,
        extra: Record<string, unknown> = {}
    ): Promise<unknown> {
        const token = await this.getAuthToken();
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(APP_CONFIG.API.AI_GENERATE_PROXY, {
            method: 'POST',
            headers,
            body: JSON.stringify({ model, contents, config: extra }),
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || `Gemini Proxy error: ${response.status}`);
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

    // ── Mapeamento de mensagens para o formato Gemini ───────────────────────
    private toGeminiContents(messages: ChatMessage[]) {
        return messages
            .filter(m => m.role !== 'system')
            .map(m => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: m.toolResult
                    ? [{ text: `[Resultado de ${m.toolResult.name}]: ${m.toolResult.result}` }]
                    : [{ text: m.content }],
            }));
    }

    // ── Mapeamento de ferramentas para o formato Gemini ─────────────────────
    private toGeminiFunctionDeclarations(tools: AITool[]) {
        return tools.map(tool => ({
            name: tool.name,
            description: tool.description,
            parameters: {
                type: 'OBJECT',
                properties: Object.fromEntries(
                    Object.entries(tool.parameters).map(([key, param]) => [
                        key,
                        { type: param.type.toUpperCase(), description: param.description, enum: param.enum },
                    ])
                ),
                required: Object.entries(tool.parameters)
                    .filter(([, p]) => p.required)
                    .map(([k]) => k),
            },
        }));
    }

    // ── AIProvider: chat ─────────────────────────────────────────────────────
    async chat(messages: ChatMessage[], options?: ChatOptions): Promise<AIResponse> {
        const model = options?.model ?? this.defaultModel;
        const contents = this.toGeminiContents(messages);
        const config: Record<string, unknown> = {};

        if (options?.systemPrompt) config.systemInstruction = options.systemPrompt;
        if (options?.temperature !== undefined) config.temperature = options.temperature;
        if (options?.maxTokens) config.maxOutputTokens = options.maxTokens;
        if (options?.responseFormat === 'json') config.responseMimeType = 'application/json';

        const data = await this.callProxy(model, contents, config) as GeminiRawResponse;
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
        return { text, raw: data };
    }

    // ── AIProvider: chatWithTools ────────────────────────────────────────────
    async chatWithTools(messages: ChatMessage[], tools: AITool[], options?: ChatOptions): Promise<AIResponse> {
        const model = options?.model ?? APP_CONFIG.AI.MODELS.PRIMARY;
        const contents = this.toGeminiContents(messages);
        const config: Record<string, unknown> = {
            tools: [{ functionDeclarations: this.toGeminiFunctionDeclarations(tools) }],
        };

        if (options?.systemPrompt) config.systemInstruction = options.systemPrompt;

        const data = await this.callProxy(model, contents, config) as GeminiRawResponse;
        const candidate = data?.candidates?.[0];
        const parts: GeminiPart[] = candidate?.content?.parts ?? [];

        // Extrai texto e/ou tool calls da resposta
        const textParts = parts.filter(p => p.text).map(p => p.text as string);
        const fnParts = parts.filter(p => p.functionCall);

        const toolCalls = fnParts.map(p => ({
            name: p.functionCall!.name,
            args: p.functionCall!.args,
        }));

        return {
            text: textParts.join('\n'),
            toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
            raw: data,
        };
    }
}
