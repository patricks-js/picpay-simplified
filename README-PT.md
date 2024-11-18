# PicPay Simplificado - Desafio Back-End

[🇺🇸 English version](README.md)

O objetivo desse desafio é implementar uma versão simplificada do serviço principal do PicPay. Deve ser possível realizar transferências entre usuários. Este projeto adere aos princípios **RESTful** e incorpora práticas de **código limpo**, **observabilidade** e **SOLID**.

## Visão Geral do Projeto

O PicPay simplificado é um serviço de pagamento que permite usuários fazerem transferências and deposito de dinheiro. Existem dois tipos de usuários:

- **Cliente:** pode enviar e receber dinheiro
- **Lojista:** pode apenas receber dinheiro

Cada usuário tem uma carteira para transações. O sistema deve garantir segurança, validação e resiliência durante todas as operações financeiras.

### Tecnologias Usadas

- **Linguagem de Programação:** TypeScript
- **Framework:** Fastify
- **Banco de Dados:** PostgreSQL
- **Conteinerização:** Docker & Docker Compose
- **Documentação:** Swagger/OpenAPI
- **CI/CD:** GitHub Actions
- **Testes:** Vitest, Supertest e Bruno for API testing

### Business Rules

- Email e CPF/CNPJ devem ser únicos
- Clientes podem receber e realizar transferências
- Lojistas apenas recebem transferências
- O saldo deve ser suficiente antes de transferências
- Todas as transferências são transactions, ou seja, em caso de erro, a operação é revertida
- Transferências devem ser autorizadas previamente com um [serviço de autorização externo](https://util.devi.tools/api/v2/authorize) (GET)
- Usuários devem receber uma notificação quando a transferência é completa, usando um [serviço de notificação externo](https://util.devi.tools/api/v1/notify) (POST)

## Instruções de Configuração

### Pré-requisitos

- Docker & Docker Compose
- Node v20+ com `pnpm` como gerenciador de pacotes

### Instalação

1. **Clonar o repositório:**

    ```bash
    git clone https://github.com/patricks-js/picpay-simplified.git
    cd picpay-simplified
    ```

2. **Instalar as dependências:**

    ```bash
    pnpm install
    ```

3. **Iniciar os serviços:**

    ```bash
    pnpm services:up
    ```

4. **Executar as migrações do banco de dados:**

    ```bash
    pnpm db:migrate
    ```

5. **Povoar o banco de dados:**

    ```bash
    pnpm db:seed
    ```

### Rodando o Projeto

1. Iniciar a aplicação rodando:

    ```bash
    pnpm dev
    ```

2. A API estará acessível em <http://localhost:3333>
3. A documentação da API (swagger) estará acessível em <http://localhost:3333/api/docs>
