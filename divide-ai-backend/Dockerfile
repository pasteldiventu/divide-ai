# Estágio 1: Build da aplicação
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copia os arquivos de dependência e instala
COPY package*.json ./
RUN npm install

# Copia o resto do código da aplicação
COPY . .

# Compila o TypeScript para JavaScript
RUN npm run build

# Estágio 2: Criação da imagem final de produção
FROM node:20-alpine

WORKDIR /usr/src/app

# Copia apenas os arquivos necessários da fase de build
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist

# Expõe a porta que a aplicação vai usar
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "dist/main"]