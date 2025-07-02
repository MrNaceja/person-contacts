<p align="center">
  <img src="logo.png" alt="Logo" width="200"/>
</p>

# Person Contacts

Gerencie pessoas e contatos em um monorepo com backend Node e frontend em React. Pronto para rodar localmente com Docker Compose.

---

## 🏗️ Estrutura do Projeto

```
person-contacts/
├── backend/      # API Node.js + Fastify + Drizzle ORM
├── frontend/     # SPA React + Vite + TailwindCSS
├── docker-compose.yaml
└── .env
```

---

## 🚀 Backend

### ⚙️ Stack

- **Node.js**
- **Typescript**
- **Fastify**
- **Drizzle ORM**
- **PostgreSQL**
- **Zod** 
- **JWT**

### 📚 Rotas Disponíveis

| Método | Rota                | Descrição                        | Protegida |
|--------|---------------------|----------------------------------|-----------|
| POST   | `/auth/sign-in`     | Login                            | ❌        |
| POST   | `/auth/sign-up`     | Cadastro                         | ❌        |
| GET    | `/person`           | Listar pessoas                   | ✅        |
| POST   | `/person`           | Criar pessoa                     | ✅        |
| GET    | `/person/:id`       | Detalhar pessoa                  | ✅        |
| PUT    | `/person/:id`       | Atualizar pessoa                 | ✅        |
| DELETE | `/person/:id`       | Remover pessoa                   | ✅        |
| GET    | `/contact`          | Listar contatos                  | ✅        |
| POST   | `/contact`          | Criar contato                    | ✅        |
| PUT    | `/contact/:id`      | Atualizar contato                | ✅        |
| DELETE | `/contact/:id`      | Remover contato                  | ✅        |
| GET    | `/contact/:id`      | Detalhar contato                 | ✅        |

> ⚠️ Rotas protegidas exigem JWT no header `Authorization`.

---

## 🎨 Frontend

### ⚙️ Stack

- **React**
- **Vite**
- **TailwindCSS**
- **React Query**
- **React Router**
- **Axios**
- **Radix UI**
- **Shadcn**
- **OriginUI**
- **Sonner**
- **class-variance-authority**
- **React Hook Form**
- **Zod**

### 🗺️ Rotas Disponíveis

| Caminho         | Descrição                 | Protegida |
|-----------------|---------------------------|-----------|
| `/auth`         | Login/Cadastro            | ❌        |
| `/person`       | Listagem de pessoas       | ✅        |
| `/contact`      | Listagem de contatos      | ✅        |
| `/`             | Redireciona conforme auth | ❌        |

---

## 🐳 Como Rodar Localmente

### Pré-requisitos

- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)

### 1. Clone o repositório

```sh
git clone https://github.com/seu-usuario/person-contacts.git
cd person-contacts
```

### 2. Crie o arquivo `.env`

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=backend_db00
POSTGRES_DB=postgres
DATABASE_URL=postgresql://postgres:backend_db00@db:5432/postgres
PORT=3000
JWT_SECRET=__sup33r@s3cr3t__
DRIZZLE_OUT=./dist/db/migrations
DRIZZLE_SCHEMA=./dist/db/schema/*
VITE_BACKEND_URL=http://127.0.0.1:3000
```

### 3. Suba a stack

```sh
docker compose up --build
```

- Backend: http://localhost:3000
- Frontend: http://localhost:5173

---

## ✨ Observações

- O backend só inicia após o banco estar pronto e executa as migrations automaticamente.
- O frontend acessa o backend via variável `VITE_BACKEND_URL` definida no `.env`.
- Para desenvolvimento, utilize os scripts `npm run dev` nas pastas `backend` e `frontend`.

---

## 🛠️ Scripts Úteis

### Backend

```sh
cd backend
npm run dev         # Desenvolvimento
npm run db:migrate  # Executa migrations
```

### Frontend

```sh
cd frontend
npm run dev         # Desenvolvimento (Vite)
npm run build       # Build de produção
npm run preview     # Preview do build
```

---

## 📦 Tecnologias

![Node.js](https://img.shields.io/badge/Node.js-22.x-green?logo=node.js)
![Fastify](https://img.shields.io/badge/Fastify-4.x-blue?logo=fastify)
![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-yellow)
![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-4.x-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38BDF8?logo=tailwindcss)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13.x-4169E1?logo=postgresql)
![Shadcn UI](https://img.shields.io/badge/Shadcn%20UI-%23000000.svg?logo=vercel&logoColor=white)
![Origin UI](https://img.shields.io/badge/Origin%20UI-%23000000.svg?logo=vercel&logoColor=white)
![zod](https://img.shields.io/badge/zod-^3.22.4-blue)
![React Hook Form](https://img.shields.io/badge/React%20Hook%20Form-7.x-EC5990?logo=react)
![React Query](https://img.shields.io/badge/React%20Query-4.x-FF4154?logo=react)

---

## 📝 Licença

MIT


Made with ❤️ by Naceja.

