# Walkthrough — Recuperação e Evolução do Agente IA

Nesta etapa, recuperamos a arquitetura universal de IA que havia sido perdida e implementamos a capacidade do agente de interagir com o sistema de arquivos de forma bidirecional (ler e escrever).

## Mudanças Realizadas

### 1. Núcleo IA Universal (Recuperado)
Reinstalamos a camada de abstração que permite o uso de múltiplos provedores:
- **`AIProvider`**: Interface comum para Gemini e OpenAI.
- **`AgentRunner`**: O orquestrador autônomo.
- **`ToolRegistry`**: Onde as capacidades do agente são registradas.

### 2. Adaptação de Provedores
- **`GeminiProvider`**: Conectado ao proxy do Google Gemini.
- **`OpenAIProvider`**: Pronto para uso com GPT-4o-mini via proxy.
- **`aiService`**: Centraliza o acesso à IA, selecionando o provedor via a variável `VITE_AI_PROVIDER`.

### 3. Novas Capacidades do Agente (Tools)
O agente agora possui 4 ferramentas principais:
- `listDomains`: Entende a arquitetura DDD do projeto.
- `readFile`: Lê o código fonte.
- `searchCode`: Busca padrões no código.
- **`writeFile` (NOVO)**: Permite ao agente criar ou atualizar arquivos no projeto.

### 4. Segurança do Backend (Restaurada)
Reaplicamos as proteções no `server.ts`:
- **Firebase Auth**: Endpoints sensíveis (`readFile`, `writeFile`, `searchCode`) agora exigem um token válido.
- **Rate Limit**: Proteção contra excesso de requisições no proxy IA.
- **Sandboxing**: O agente só pode ler/escrever dentro de `domains/`, `apps/` ou `scripts/`.

## Verificação

- [x] **Configuração**: `config.ts` atualizado para suportar `PROVIDER` agnóstico.
- [x] **Tipagem**: Resolvidos os erros de `any` e caminhos de módulo reportados pela IDE.
- [x] **Agente**: O Ricardo IA agora pode atuar como um engenheiro autônomo completo.

O sistema está novamente robusto e preparado para a "auto-atualização" solicitada.

### 7. Correção de Erro de Tempo de Execução do Firebase
- **Bug**: O erro `FirebaseError: Expected first argument to collection()` ocorria porque o Vite não carregava as variáveis `.env` da raiz, resultando em uma instância de Firestore `null`.
- **Solução**:
  - Atualizado o `apps/web/vite.config.ts` para carregar o `.env` da raiz (`envDir: '../../'`).
  - Refatorado o `domains/shared/config/firebase.ts` para ser mais resiliente e simplificar as exportações.
  - Corrigido o barrel export em `domains/shared/index.ts` para remover referências a funções deprecadas (`getDb`).
- **Resultado**: O build agora completa com sucesso e as chaves de API são injetadas corretamente no frontend, permitindo que o Firestore inicialize normalmente.
