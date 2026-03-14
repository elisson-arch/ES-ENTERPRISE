# Sistema de Agente IA Universal — ES-ENTERPRISE

Construir uma camada de abstração de provedores de IA usando o **Adapter Pattern**, permitindo trocar de Gemini para GPT (ou qualquer outra IA) apenas mudando uma variável de configuração. Em cima dessa camada, construir um **Agente Autônomo** com loop de ação e ferramentas.

---

## Arquitetura Proposta

```
domains/ai/
├── core/                          ← NOVO: núcleo universal
│   ├── AIProvider.ts              ← Interface (contrato universal)
│   ├── AgentRunner.ts             ← Loop agente: Pensar → Agir → Observar
│   └── ToolRegistry.ts            ← Registro de ferramentas disponíveis
│
├── providers/                     ← NOVO: adaptadores por IA
│   ├── GeminiProvider.ts          ← Adapter para Google Gemini
│   └── OpenAIProvider.ts          ← Adapter para OpenAI GPT
│
├── tools/                         ← NOVO: ferramentas que o agente pode usar
│   ├── readFileTool.ts            ← Ler arquivos do projeto
│   ├── listDomainsTool.ts         ← Listar domínios/estrutura
│   └── searchCodeTool.ts          ← Buscar código por padrão
│
└── services/
    ├── aiService.ts               ← SUBSTITUI geminiService.ts (agnóstico)
    └── geminiService.ts           ← Mantido como legado (deprecado gradualmente)
```

---

## Proposed Changes

### Core — Interface Universal

#### [NEW] AIProvider.ts — `domains/ai/core/AIProvider.ts`

Define o **contrato** que todo provedor de IA deve cumprir:

```typescript
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AITool {
  name: string;
  description: string;
  parameters: Record<string, unknown>; // JSON Schema
  execute: (args: Record<string, unknown>) => Promise<string>;
}

export interface AIResponse {
  text: string;
  toolCalls?: { name: string; args: Record<string, unknown> }[];
  raw?: unknown;
}

export interface AIProvider {
  readonly name: string; // 'gemini' | 'openai' | 'claude' etc.
  chat(messages: ChatMessage[], options?: ChatOptions): Promise<AIResponse>;
  chatWithTools(messages: ChatMessage[], tools: AITool[], options?: ChatOptions): Promise<AIResponse>;
}

export interface ChatOptions {
  systemPrompt?: string;
  model?: string;          // modelo específico (sobreescreve o padrão)
  temperature?: number;
  maxTokens?: number;
}
```

#### [NEW] ToolRegistry.ts — `domains/ai/core/ToolRegistry.ts`

Registro central de ferramentas. O agente usa isso para saber o que pode fazer.

#### [NEW] AgentRunner.ts — `domains/ai/core/AgentRunner.ts`

Loop do agente: **Pensar → Chamar Ferramenta → Observar resultado → Repetir até concluir**.

```
1. Recebe objetivo (ex: "Liste todos os domínios e me diga o que cada um faz")
2. Envia para a IA com lista de ferramentas disponíveis
3. IA responde com uma tool call (ex: listDomains)
4. AgentRunner executa a ferramenta
5. Adiciona o resultado ao histórico e volta para a IA
6. Repete até a IA responder com texto final (sem tool calls)
```

---

### Providers — Adaptadores

#### [NEW] GeminiProvider.ts — `domains/ai/providers/GeminiProvider.ts`

Adapta a API do Gemini (`/api/ai/generate`) para a interface `AIProvider`.

#### [NEW] OpenAIProvider.ts — `domains/ai/providers/OpenAIProvider.ts`

Adapta a API da OpenAI para a mesma interface. (Requer `VITE_OPENAI_API_KEY` via proxy backend).

---

### Serviço Universal

#### [NEW] aiService.ts — `domains/ai/services/aiService.ts`

Substitui progressivamente o `geminiService.ts`. Lê `VITE_AI_PROVIDER` para instanciar o provedor correto:

```typescript
// Trocar de Gemini para GPT: mudar uma variável
// VITE_AI_PROVIDER=gemini  ← atual
// VITE_AI_PROVIDER=openai  ← para trocar
```

---

### Config Atualizada

#### [MODIFY] config.ts — `domains/shared/config/config.ts`

Adicionar:
```typescript
AI: {
  PROVIDER: import.meta.env.VITE_AI_PROVIDER || 'gemini', // ← qual IA usar
  // ... modelos existentes
}
```

#### [MODIFY] .env.example

Adicionar:
```bash
VITE_AI_PROVIDER=gemini   # gemini | openai | claude
```

---

## Verification Plan

### Automated Tests
```bash
npm run test
```
Criar testes unitários para `AgentRunner` com um `MockProvider` que implementa `AIProvider`.

### Manual Verification
1. Com `VITE_AI_PROVIDER=gemini`: chat do Ricardo IA deve funcionar normalmente.
2. Trocar para `VITE_AI_PROVIDER=openai`: ao reiniciar o app, o mesmo chat deve usar GPT.
3. Testar o agente: pedir "liste os domínios do meu projeto" e verificar que ele usa a ferramenta `listDomains` e retorna corretamente.
