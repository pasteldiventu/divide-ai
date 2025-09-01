# Estágio 1: Define a imagem base com Node.js
# Use uma versão específica para garantir consistência, como a LTS (Long Term Support)
FROM node:20-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de gerenciamento de pacotes PRIMEIRO
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

COPY . .

# Expõe a porta que o servidor de desenvolvimento do Vue usa+
EXPOSE 5173

CMD [ "npm", "run", "dev" ]