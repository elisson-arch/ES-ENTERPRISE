# AI-Native Platform Refactoring

Transform the AI domain into a true AI-Native platform, moving beyond chat to predictive intelligence and autonomous automation.

## Architectural Advice

Seguiremos os pilares da "Inteligência Imersiva":
- `AIView.tsx`: Radar Preditivo (Insights e Saúde).
- `AutomationView.tsx`: Construtor de Regras (Automação).
- `RicardoCommandPalette.tsx`: Busca Global Ubíqua.

## User Review Required

> [!IMPORTANT]
> A `AIView` deixará de ser um chat tradicional para se tornar um Dashboard Preditivo. O chat principal será acessível via `/ia/chat` ou pelo Command Palette.

## Proposed Changes

### AI Domain

#### [MODIFY] [AIView.tsx](file:///home/lucas/ES-ENTERPRISE/domains/ai/views/AIView.tsx)
- Refatorar para "Centro de Inteligência Preditiva".
- Adicionar Score de Saúde Global e Cards de Risco (Predictive Insights).
- Integrar com `predictiveService.ts`.

#### [MODIFY] [AutomationView.tsx](file:///home/lucas/ES-ENTERPRISE/domains/ai/views/AutomationView.tsx)
- Criar interface de "Rule Builder" (Gatilho -> Condição -> Ação).
- Usar Framer Motion para animações de fluxo.

#### [NEW] [RicardoCommandPalette.tsx](file:///home/lucas/ES-ENTERPRISE/domains/ai/components/RicardoCommandPalette.tsx)
- Modal global Cmd+K para busca e execução de comandos via IA.

#### [MODIFY] [index.ts](file:///home/lucas/ES-ENTERPRISE/domains/ai/index.ts)
- Exportar o novo componente Command Palette.

### Shared Domain

#### [MODIFY] [App.tsx](file:///home/lucas/ES-ENTERPRISE/domains/shared/views/App.tsx)
- Integrar `RicardoCommandPalette` na raiz do layout para acesso global.

## Verification Plan

### Manual Verification
- Validar Radar Preditivo na `AIView`.
- Testar criação de regras na `AutomationView`.
- Pressionar Ctrl+K e validar abertura do Command Palette.



