# Plano de Correção: Erro Fatal Firebase (collection() argument)

O erro ocorre porque o `db` (Firestore instance) está sendo exportado como `null`, pois as variáveis de ambiente `VITE_FIREBASE_*` não estão sendo carregadas corretamente no frontend. Isso acontece porque o Vite está procurando o arquivo `.env` dentro de `apps/web/`, mas ele reside na raiz do projeto.

## Mudanças Propostas

### Web App

#### [MODIFY] [vite.config.ts](file:///home/lucas/ES-ENTERPRISE/apps/web/vite.config.ts)

- Alterar o carregamento de variáveis de ambiente para apontar para a raiz do projeto.
- Adicionar `envDir: '../../'` na configuração do Vite para garantir que o cliente também veja as variáveis da raiz.

#### [MODIFY] [firebase.ts](file:///home/lucas/ES-ENTERPRISE/domains/shared/config/firebase.ts)

- Melhorar a exportação do `db` para ser uma função ou garantir que ele não quebre o `collection()` se for `null` (embora carregar o `.env` deva resolver a causa raiz).
- Manter o `db` como uma referência direta, mas garantir que a inicialização ocorra corretamente se os envs estiverem presentes.

## Plano de Verificação

### Verificação Manual
1. Reiniciar o servidor de desenvolvimento: `npm run dev`.
2. Verificar se o erro "FirebaseError: Expected first argument..." desapareceu no console do navegador.
3. Confirmar se os dados do Firestore (Inventário, Documentos) estão sendo carregados.
