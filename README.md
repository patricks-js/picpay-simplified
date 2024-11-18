# PicPay Simplified - Back-End challenge

[🇧🇷 Versão em português](README-PT.md)

The goal of [this challenge](https://github.com/PicPay/picpay-desafio-backend) is implement a simplified version of PicPay service. It should be possible to **perform transfers between users**. This project adheres to **RESTful** principles and incorporates **clean code** practices, **observability**, and **SOLID**.

## Project Overview

PicPay Simplified is a payment service that allows users to **transfer** and **deposit money**. It supports two types of users:

- **Customer:** Can send and receive money.
- **Merchants:** Can only receive money.

Each user has a wallet for transactions. The system ensures security, validation, and reliability during all financial operations.

### Technologies Used

- **Programming Language:** TypeScript
- **Framework:** Fastify
- **Database:** PostgreSQL
- **Containerization:** Docker & Docker Compose
- **Documentation:** Swagger/OpenAPI
- **CI/CD:** GitHub Actions
- **Testing:** Vitest, supertest and Bruno for API testing

### Business Rules

- Email and CPF/CNPJ must be uniques
- Customers can receive and perform transfers
- Merchant only receive transfers
- Balance must be sufficient before transfers
- All transfers are transactions, if any error occurs, the operations is reverted
- Transfers must be authorized with an [external authorization service](https://util.devi.tools/api/v2/authorize) (GET)
- Users should receive a notification when a transfer is completed with a [external notification service](https://util.devi.tools/api/v1/notify) (POST)

## Setup Instructions

### Prerequisites

- Docker & Docker Compose
- Node v20+ with `pnpm` as package manager

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/patricks-js/picpay-simplified.git
    cd picpay-simplified
    ```

2. **Installing dependencies:**

    ```bash
    pnpm install
    ```

3. **Start the services:**

    ```bash
    pnpm services:up
    ```

4. **Running database migrations:**

    ```bash
    pnpm db:migrate
    ```

5. **Seed database with some data:**

    ```bash
    pnpm db:seed
    ```

### Usage

1. Start the application running:

    ```bash
    pnpm dev
    ```

2. The API will be accessible at <http://localhost:3333>
3. The API documentation (swagger) will be accessible at <http://localhost:3333/api/docs>
