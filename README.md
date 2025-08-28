# API Divide Aí 💸

API REST para um rastreador de despesas compartilhadas, construída com NestJS, TypeORM e Docker. Este projeto permite que usuários criem grupos, registrem despesas e dividam os custos de forma simples e eficiente.

---

## ✨ Funcionalidades

- **Autenticação de Usuários** (Em breve)
- **CRUD de Usuários**: Criação, visualização, atualização e remoção de usuários.
- **Gerenciamento de Grupos**: Crie grupos para compartilhar despesas (ex: "Viagem de Fim de Ano", "Aluguel do Apartamento").
- **Registro de Despesas**: Adicione despesas a um grupo, especificando o valor e quem pagou.
- **Documentação da API**: Documentação interativa e automatizada com Swagger (OpenAPI).

---

## 🛠️ Tecnologias Utilizadas

- **Backend**: [NestJS](https://nestjs.com/)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Banco de Dados**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [TypeORM](https://typeorm.io/)
- **Containerização**: [Docker](https://www.docker.com/) e Docker Compose
- **Documentação**: [Swagger (OpenAPI)](https://swagger.io/)
- **Validação**: [class-validator](https://github.com/typestack/class-validator)

---

## 🚀 Como Executar o Projeto

Para rodar este projeto localmente, você precisa ter o **Git** e o **Docker** instalados na sua máquina.

### Passo a Passo

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/seu-usuario/divide-ai.git](https://github.com/seu-usuario/divide-ai.git)
    cd divide-ai
    ```

2.  **Crie o arquivo de variáveis de ambiente:**
    O projeto usa as variáveis definidas no `docker-compose.yml`. Para rodar localmente fora do Docker (para testes, por exemplo), você pode criar um arquivo `.env` na raiz do projeto.

3.  **Suba os containers com Docker Compose:**
    Este comando irá construir a imagem da API, baixar a imagem do PostgreSQL e iniciar os dois serviços.
    ```bash
    docker compose up --build -d
    ```

    - A API estará disponível em `http://localhost:3000`
    - O banco de dados estará acessível na porta `5433` do seu `localhost`.

4.  **Para parar a aplicação:**
    ```bash
    docker compose down
    ```

---

## 📖 Documentação da API (Swagger)

Com a aplicação rodando, a documentação completa e interativa da API está disponível no seu navegador. Você pode usar essa interface para testar todos os endpoints.

- **URL da Documentação**: [**http://localhost:3000/api/docs**](http://localhost:3000/api/docs)



---

## 🧪 Testes (Comandos Padrão NestJS)

Para executar os testes, você pode entrar no container da API ou executá-los localmente se tiver o Node.js instalado.

```bash
# testes unitários
npm run test

# testes end-to-end (e2e)
npm run test:e2e

# ver cobertura de testes
npm run test:cov