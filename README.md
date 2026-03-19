# API Marketplace

Uma API Restful construída com [NestJS](https://nestjs.com/) para gerenciar um MVP de Marketplace.
O projeto possui autenticação com **JWT** e gerenciamento completo de **Usuários (CRUD)** de forma estruturada, com validações baseadas em DTOs.

## 🚀 Tecnologias Utilizadas
- **Node.js** com **TypeScript**
- **NestJS** (Framework Arquitetural)
- **Prisma ORM** (Interação fácil e tipada com Banco de Dados)
- **SQLite** (Banco de dados de desenvolvimento local)
- **Passport & JWT** (Autenticação Segura)
- **Bcrypt** (Criptografia de senhas no banco)
- **Class-Validator & Class-Transformer** (Validação de DTOs dos Endpoints)

## 📦 Como rodar o projeto localmente

### 1. Pré-requisitos
- Tenha o **Node.js** e o **Yarn** instalados em sua máquina.

### 2. Instalação
Na raiz do repositório, baixe as dependências:
```bash
yarn install
```

### 3. Configurando as Variáveis de Ambiente
Você pode ajustar suas variáveis baseadas nas necessidades da máquina (banco, JWT Secret). Certifique-se de que o arquivo `.env` na raiz do projeto tenha no mínimo a seguinte variável `DATABASE_URL`:
```env
DATABASE_URL="file:./dev.db"
```

### 4. Banco de Dados (Prisma)
Para criar a estrutura e sincronizar as tabelas do seu banco de dados SQLite local, rode:
```bash
npx prisma db push
```
*(Após isso, o Prisma irá criar o arquivo `dev.db` com as tabelas na pasta `/prisma` e gerar o Prisma Client tipado)*

### 5. Executando o Servidor
```bash
# Iniciar o servidor com Hot Reload (auto-reiniciar ao salvar no código)
yarn start:dev
```
A API estará rodando em `http://localhost:3000`.

---

## 🔑 Rotas da API

### Autenticação (`/auth`)
 Rotas públicas. **Nenhuma autorização prévia é necessária.**

- **`POST /auth/register`**  
  Cria um novo usuário e retorna automaticamente o `access_token` JWT para ser usado nas rotas protegidas.  
  **Corpo (JSON):**
  ```json
  {
    "email": "teste@email.com",
    "password": "senhasegura"
  }
  ```

- **`POST /auth/login`**  
  Testa as credenciais, faz o login e retorna um novo `access_token`.  
  **Corpo (JSON):**
  ```json
  {
    "email": "teste@email.com",
    "password": "senhasegura"
  }
  ```

### Usuários (`/users`)
**Atenção:** Todas as rotas abaixo são protegidas e requerem o header:  
`Authorization: Bearer <seu_access_token>`.

- **`GET /users`**  
  Lista todos os usuários registrados até o momento.

- **`GET /users/:id`**  
  Retorna os detalhes de um usuário específico buscando pelo seu ID numérico da URL (ex: `/users/1`).

- **`POST /users`**  
  Cria um novo usuário manualmente. Segue o mesmo padrão do registro, mas requer autenticação.

- **`PATCH /users/:id`**  
  Atualiza parte dos dados de um usuário definindo o ID. Você envia apenas o campo que deseja mudar.  
  **Corpo (JSON) de Exemplo:**
  ```json
  {
    "email": "novoemail@email.com"
  }
  ```

- **`DELETE /users/:id`**  
  Deleta um usuário permanentemente pelo seu ID.

---

## 🏛️ Estrutura do Projeto (NestJS)

O projeto é dividido em módulos modulares seguindo os padrões do **NestJS**:
- `src/main.ts` - Bootstrapper da aplicação (registra pipes de validação, portas e filtros globais).
- `src/auth/` - Módulo, Controller, Service e Strategy do **Passport** para lidar com o login e extração e validação do JWT enviado nas requisições.
- `src/users/` - Módulo para as rotas e regras de negócio para manipular Usuários (CRUD completo isolado da autenticação).
- `src/prisma/` - Modulo e serviço para expor o `PrismaClient` já instanciado a qualquer outro módulo que precise de acesso ao banco usando a injeção local de dependências do Nest.
