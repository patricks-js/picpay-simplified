# PicPay Simplificado - Desafio Back-End

[🇺🇸 English version](README.md)

O objetivo deste [desafio](https://github.com/PicPay/picpay-desafio-backend) é implementar uma versão simplificada do serviço do PicPay. Deve ser possível **realizar transferências entre usuários**. Este projeto segue os princípios **RESTful**, incorporando práticas de **código limpo**, **observabilidade** e **SOLID**.

## 📌 Conteúdos

- [Visão Geral do Projeto](#-visão-geral-do-projeto)
  - [Tecnologias Utilizadas](#️-tecnologias-utilizadas)
  - [Regras de Negócio](#-regras-de-negócio)
  - [Requisitos](#-requisitos)
- [Instruções de Configuração](#️-instruções-de-configuração)
  - [Pré-requisitos](#-pré-requisitos)
  - [Instalação](#-instalação)
  - [Uso](#-uso)
  - [Executando Testes](#-executando-testes)
- [Melhorias Propostas](#-melhorias-propostas)

## 📝 Visão Geral do Projeto

PicPay Simplificado é um serviço de pagamento que permite aos usuários **transferir** e **depositar dinheiro**. Ele suporta dois tipos de usuários:

- **Cliente:** Pode enviar e receber dinheiro.
- **Lojista:** Pode apenas receber dinheiro.

Cada usuário possui uma carteira para realizar transações. O sistema garante **segurança**, **validação** e **confiabilidade** durante todas as operações financeiras.

### 🛠️ Tecnologias Utilizadas

- **Linguagem de Programação:** TypeScript
- **Framework:** Fastify
- **Banco de Dados:** PostgreSQL
- **Conteinerização:** Docker & Docker Compose
- **Documentação:** Swagger/OpenAPI
- **CI/CD:** GitHub Actions
- **Testes:** Vitest, supertest e Bruno para testes de API

### 📋 Regras de Negócio

- Email e CPF/CNPJ devem ser únicos
- Clientes podem receber e realizar transferências
- Lojistas podem apenas receber transferências
- O saldo deve ser suficiente antes de realizar transferências
- Toda operação de transferência é envolvida em uma transação no banco de dados para garantir atomicidade. Em caso de erro, o sistema reverte todas as operações para manter a consistência.
- Transferências devem ser autorizadas por um [serviço externo de autorização](https://util.devi.tools/api/v2/authorize) (GET)
- Os usuários devem receber uma notificação quando uma transferência for concluída, utilizando um [serviço externo de notificações](https://util.devi.tools/api/v1/notify) (POST)

### ✅ Requisitos

- [x] Usuário pode criar uma conta como cliente ou lojista
- [x] Usuário pode autenticar-se com email e senha
- [x] Histórico de transações disponível para todos os usuários
- [x] Clientes podem transferir dinheiro para outros usuários (clientes ou lojistas)
- [x] Transferências são restritas a clientes com saldo suficiente
- [x] Todas as transferências devem ser autorizadas por um serviço externo
- [x] Lojistas estão limitados a apenas receber transferências
- [ ] Usuários devem receber notificações (por exemplo, email ou SMS) ao receber uma transferência
- [x] Transferências devem ser reversíveis em caso de falha

## ⚙️ Instruções de Configuração

### 📌 Pré-requisitos

- Docker & Docker Compose
- Node v20+ com `pnpm` como gerenciador de pacotes

### 🚀 Instalação

1. **Clone o repositório:**

    ```bash
    git clone https://github.com/patricks-js/picpay-simplified.git
    cd picpay-simplified
    ```

2. **Instale as dependências:**

    ```bash
    pnpm install
    ```

3. **Inicie os serviços:**

    ```bash
    pnpm services:up
    ```

4. **Execute as migrações do banco de dados:**

    ```bash
    pnpm db:migrate
    ```

5. **Popule o banco de dados com alguns dados:**

    ```bash
    pnpm db:seed
    ```

### 💻 Uso

1. Inicie a aplicação executando:

    ```bash
    pnpm dev
    ```

2. A API estará acessível em <http://localhost:3333>
3. A documentação da API (swagger) estará acessível em <http://localhost:3333/api/docs>

### 🧪 Executando Testes

Execute o seguinte comando:

```bash
pnpm test
```

Para ver a cobertura de código:

```bash
pnpm test:coverage
```

## 🌟 Melhorias Propostas

- **Tratamento de Erros:** Melhorar mensagens de erro e utilizar códigos de status semânticos.
- **Monitoramento:** Adicionar métricas detalhadas de transações para observabilidade.
- **Limitação de Taxa:** Implementar limitação de taxa na API e controle de solicitações para maior segurança.
- **Otimização do Banco de Dados:** Melhorar o desempenho de consultas com índices e particionamento.
- **Cache:** Introduzir estratégias de cache para transações de alto volume.
