/**
 * AIProvider.ts — Contrato universal para provedores de IA.
 */

export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    toolResult?: {
        name: string;
        result: string;
    };
}

export interface AIToolParameter {
    type: 'string' | 'number' | 'boolean' | 'object' | 'array';
    description: string;
    required?: boolean;
    enum?: string[];
}

export interface AITool {
    name: string;
    description: string;
    parameters: Record<string, AIToolParameter>;
    execute: (args: Record<string, any>) => Promise<string>;
}

export interface AIResponse {
    text: string;
    toolCalls?: {
        name: string;
        args: Record<string, any>;
    }[];
    raw?: any;
}

export interface ChatOptions {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    systemPrompt?: string;
    responseFormat?: 'text' | 'json';
}

export interface AIProvider {
    readonly name: string;
    chat(messages: ChatMessage[], options?: ChatOptions): Promise<AIResponse>;
    chatWithTools(messages: ChatMessage[], tools: AITool[], options?: ChatOptions): Promise<AIResponse>;
}
