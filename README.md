# Divide Aí 💸

Aplicação full-stack para um rastreador de despesas compartilhadas, construída com NestJS (backend) e Vue.js (frontend), totalmente containerizada com Docker.

Este projeto permite que usuários criem grupos, registrem despesas e dividam os custos de forma simples e eficiente.

---

## ✨ Funcionalidades

- **Autenticação de Usuários** (Em breve)
- **CRUD de Usuários**: Criação, visualização, atualização e remoção de usuários.
- **Gerenciamento de Grupos**: Crie grupos para compartilhar despesas (ex: "Viagem de Fim de Ano", "Aluguel do Apartamento").
- **Registro de Despesas**: Adicione despesas a um grupo, especificando o valor e quem pagou. (Em breve)
- **Interface Reativa**: Frontend construído com Vue.js para uma experiência de usuário fluida.
- **Documentação da API**: Documentação interativa e automatizada com Swagger (OpenAPI).

---

## 🛠️ Tecnologias Utilizadas

### Backend
- **Framework**: [NestJS](https://nestjs.com/)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Banco de Dados**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [TypeORM](https://typeorm.io/)

### Frontend
- **Framework**: [Vue.js](https://vuejs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Roteamento**: [Vue Router](https://router.vuejs.org/)

### Geral
- **Containerização**: [Docker](https://www.docker.com/) e Docker Compose
- **Validação**: [class-validator](https://github.com/typestack/class-validator)

---

## 🚀 Como Executar o Projeto (Ambiente de Desenvolvimento)

Para rodar este projeto localmente, você precisa ter o **Git**, **Docker** e **Node.js** (v18 ou superior) instalados.

### Passo a Passo

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/seu-usuario/divide-ai.git](https://github.com/seu-usuario/divide-ai.git)
    cd divide-ai
    ```

2.  **Crie o arquivo de variáveis de ambiente:**
    As senhas e configurações do banco de dados são gerenciadas por um arquivo `.env`. Copie o exemplo para criar o seu.
    ```bash
    cp .env.example .env
    ```
    *(Se você ainda não tem um `.env.example`, crie-o na raiz com o conteúdo abaixo)*
    ```env
    # .env.example
    
    # Senha para o superusuário do PostgreSQL
    # Esta mesma senha será usada pela API para se conectar
    POSTGRES_PASSWORD=sua_senha_secreta
    ```
    Lembre-se de trocar `sua_senha_secreta` no arquivo `.env` pela senha que você definiu no `docker
