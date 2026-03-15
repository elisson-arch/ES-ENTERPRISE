import type { AIProvider, AITool, AIResponse, ChatMessage, ChatOptions } from '../core/AIProvider';
import { APP_CONFIG } from '@shared/config/config';

interface GeminiPart { text?: string; functionCall?: { name: string; args: Record<string, any> }; inlineData?: any }
interface GeminiCandidate { content?: { parts: GeminiPart[] } }
interface GeminiRawResponse { candidates?: GeminiCandidate[] }

/**
 * GeminiProvider — Adapter para o Google Gemini via proxy backend.
 */
export class GeminiProvider implements AIProvider {
    readonly name = 'gemini';
    readonly defaultModel: string;

    constructor(model?: string) {
        this.defaultModel = model ?? APP_CONFIG.AI.MODELS.FAST;
    }

    private async callProxy(model: string, contents: any, config: any = {}): Promise<GeminiRawResponse> {
        const response = await fetch(APP_CONFIG.API.AI_GENERATE_PROXY, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model, contents, config }),
        });

        if (!response.ok) {
            throw new Error(`Gemini Proxy error: ${response.statusText}`);
        }
        return response.json();
    }

    private toGeminiContents(messages: ChatMessage[]) {
        return messages
            .filter(m => m.role !== 'system')
            .map(m => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: m.content }],
            }));
    }

    private toGeminiTools(tools: AITool[]) {
        return tools.map(t => ({
            name: t.name,
            description: t.description,
            parameters: {
                type: 'OBJECT',
                properties: Object.fromEntries(
                    Object.entries(t.parameters).map(([k, v]) => [
                        k, { type: v.type.toUpperCase(), description: v.description, enum: v.enum }
                    ])
                ),
                required: Object.entries(t.parameters).filter(([, v]) => v.required).map(([k]) => k),
            }
        }));
    }

    async chat(messages: ChatMessage[], options?: ChatOptions): Promise<AIResponse> {
        const model = options?.model ?? this.defaultModel;
        const contents = this.toGeminiContents(messages);
        const config: any = {};
        if (options?.systemPrompt) config.systemInstruction = options.systemPrompt;
        if (options?.responseFormat === 'json') config.responseMimeType = 'application/json';
        if (options?.temperature !== undefined) config.temperature = options.temperature;
        if (options?.maxTokens !== undefined) config.maxOutputTokens = options.maxTokens;

        const data = await this.callProxy(model, contents, config);
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
        return { text, raw: data };
    }

    async chatWithTools(messages: ChatMessage[], tools: AITool[], options?: ChatOptions): Promise<AIResponse> {
        const model = options?.model ?? APP_CONFIG.AI.MODELS.PRIMARY;
        const contents = this.toGeminiContents(messages);
        const config = {
            tools: [{ functionDeclarations: this.toGeminiTools(tools) }],
            systemInstruction: options?.systemPrompt
        };

        const data = await this.callProxy(model, contents, config);
        const parts = data?.candidates?.[0]?.content?.parts ?? [];
        
        const text = parts.find(p => p.text)?.text ?? '';
        const toolCalls = parts
            .filter(p => p.functionCall)
            .map(p => ({
                name: p.functionCall!.name,
                args: p.functionCall!.args
            }));

        return {
            text,
            toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
            raw: data
        };
    }
}
