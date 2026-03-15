import type { AIProvider, AITool, AIResponse, ChatMessage, ChatOptions } from '../core/AIProvider';
import { APP_CONFIG } from '@shared/config/config';

interface OpenAIRawResponse {
    choices: {
        message: {
            content: string | null;
            tool_calls?: {
                function: { name: string; arguments: string };
            }[];
        };
    }[];
}

/**
 * OpenAIProvider — Adapter para OpenAI via proxy backend.
 */
export class OpenAIProvider implements AIProvider {
    readonly name = 'openai';
    readonly defaultModel = 'gpt-4o-mini';

    private async callProxy(body: any): Promise<OpenAIRawResponse> {
        const response = await fetch(APP_CONFIG.API.AI_GENERATE_PROXY, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ provider: 'openai', ...body }),
        });

        if (!response.ok) {
            throw new Error(`OpenAI Proxy error: ${response.statusText}`);
        }
        return response.json();
    }

    private toOpenAIMessages(messages: ChatMessage[], systemPrompt?: string) {
        const msgs: any[] = [];
        if (systemPrompt) msgs.push({ role: 'system', content: systemPrompt });
        
        messages.forEach(m => {
            msgs.push({
                role: m.role === 'assistant' ? 'assistant' : 'user',
                content: m.content
            });
        });
        return msgs;
    }

    private toOpenAITools(tools: AITool[]) {
        return tools.map(t => ({
            type: 'function',
            function: {
                name: t.name,
                description: t.description,
                parameters: {
                    type: 'object',
                    properties: Object.fromEntries(
                        Object.entries(t.parameters).map(([k, v]) => [
                            k, { type: v.type, description: v.description, enum: v.enum }
                        ])
                    ),
                    required: Object.entries(t.parameters).filter(([, v]) => v.required).map(([k]) => k),
                }
            }
        }));
    }

    async chat(messages: ChatMessage[], options?: ChatOptions): Promise<AIResponse> {
        const data = await this.callProxy({
            model: options?.model ?? this.defaultModel,
            messages: this.toOpenAIMessages(messages, options?.systemPrompt),
            temperature: options?.temperature ?? 0.7,
        });

        return {
            text: data.choices[0].message.content ?? '',
            raw: data
        };
    }

    async chatWithTools(messages: ChatMessage[], tools: AITool[], options?: ChatOptions): Promise<AIResponse> {
        const data = await this.callProxy({
            model: options?.model ?? this.defaultModel,
            messages: this.toOpenAIMessages(messages, options?.systemPrompt),
            tools: this.toOpenAITools(tools),
            tool_choice: 'auto'
        });

        const message = data.choices[0].message;
        const toolCalls = message.tool_calls?.map(tc => ({
            name: tc.function.name,
            args: JSON.parse(tc.function.arguments)
        }));

        return {
            text: message.content ?? '',
            toolCalls,
            raw: data
        };
    }
}
