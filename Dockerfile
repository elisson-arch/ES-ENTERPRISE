# Estágio 1: Build do Frontend e Instalação
FROM node:20-slim AS builder

WORKDIR /app

# Copia arquivos de definição de pacotes
COPY package*.json ./

# Instala todas as dependências (incluindo devDependencies para o build do Vite)
RUN npm ci

# Copia o restante do código fonte
COPY . .

# Gera os arquivos estáticos (dist) usando o script do package.json
RUN npm run build

# Estágio 2: Runtime da Produção
FROM node:20-slim

WORKDIR /app

# Variável de ambiente padrão para o Cloud Run
ENV NODE_ENV=production
ENV PORT=8080

# Copia apenas os arquivos necessários para rodar o servidor Express
COPY package*.json ./

# Instala apenas dependências de produção
RUN npm ci --only=production

# Copia o servidor e a pasta dist gerada no estágio anterior
COPY server.js ./
COPY --from=builder /app/dist ./dist

# Expõe a porta que o Cloud Run utiliza
EXPOSE 8080

# Comando para iniciar a aplicação
CMD ["npm", "start"]
