<div align="center">

# Eagle Vocab

### * Learn vocabulary from the books you read *

<br />

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=flat&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![Turborepo](https://img.shields.io/badge/Turborepo-EF4444?style=flat&logo=turborepo&logoColor=white)

</div>

---

## About

Eagle Vocab is a vocabulary learning app designed for people who read in foreign languages. You're reading a Romanian novel and stumble upon a new word? Add it to your book, get an AI-powered translation with pronunciation and examples, then study it later with spaced repetition flashcards.

No more switching between translation apps and note-taking tools. Everything lives in one place.

### Key Features

- **Books** — Organize words by the book you're reading. Each book is tied to a language.
- **AI Translation** — Enter a word, get instant translation, phonetic pronunciation (with accents), definition, and example sentences powered by OpenAI.
- **Flashcard Study** — Study your words with a flashcard system. Normal mode (word → translation) or Reverse mode (translation → word).
- **Spaced Repetition (SRS)** — Rate your recall after each card. The app schedules reviews based on the SM-2 algorithm.
- **Decks** — Group cards by theme (travel, food, verbs...) independently from books.
- **Multi-language** — Support for any language pair. Set your native language once, add as many learning languages as you want.
- **Responsive** — Works on desktop and mobile. Dialogs become bottom sheets on small screens.

## Tech Stack

This is a **Turborepo monorepo** with the following packages:

```
eagle-vocab/
├── apps/
│   ├── app/          # Frontend — React 19 + Vite SPA
│   └── api/          # Backend — Express + Prisma
├── packages/
│   ├── database/     # Prisma schema & client
│   ├── types/        # Shared Zod schemas & TypeScript types
│   └── typescript-config/
```

| Layer | Tech |
|---|---|
| **Frontend** | React 19, Vite, TailwindCSS, shadcn/ui, TanStack Query, React Router, Framer Motion |
| **Backend** | Express, Prisma ORM, OpenAI API |
| **Auth** | BetterAuth (email/password, OAuth) |
| **Database** | PostgreSQL |
| **Monorepo** | Turborepo, pnpm workspaces |

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) v20+
- [pnpm](https://pnpm.io/) v9+
- [PostgreSQL](https://www.postgresql.org/) running locally or remotely

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/eagle-vocab.git
   cd eagle-vocab
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp apps/api/.env.example apps/api/.env
   ```

   Fill in your `DATABASE_URL`, `OPENAI_API_KEY`, and auth secrets.

4. **Set up the database**

   ```bash
   pnpm db:push
   pnpm db:seed
   ```

5. **Start development**

   ```bash
   pnpm dev
   ```

   - Frontend: [http://localhost:5173](http://localhost:5173)
   - API: [http://localhost:3001](http://localhost:3001)

## Project Architecture

### Frontend (`apps/app`)

Feature-based organization:

```
src/
├── components/ui/     # shadcn/ui + custom components
├── features/
│   ├── books/         # Books CRUD, hooks, API client
│   ├── cards/         # Card creation, editing, translation
│   ├── decks/         # Decks CRUD, add/remove cards
│   ├── study/         # Flashcard study session, SRS
│   └── settings/      # User preferences, languages
├── layouts/           # Dashboard, Study, Auth layouts
├── pages/             # Route-level page components
└── shared/            # Utilities, API client, hooks
```

### Backend (`apps/api`)

Layered architecture:

```
src/
├── controllers/       # HTTP handlers
├── services/          # Business logic
├── repositories/      # Prisma database queries
├── middlewares/        # Auth, validation, error handling
├── helpers/           # API response, logger
└── routes/            # Express route definitions
```

### Shared Packages

- **`packages/types`** — Zod schemas for validation (shared between frontend & backend) and TypeScript types
- **`packages/database`** — Prisma schema, migrations, client generation, seed script

## Available Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start all apps in development mode |
| `pnpm build` | Build all packages and apps |
| `pnpm db:push` | Push Prisma schema to database |
| `pnpm db:seed` | Seed the database with initial data |
| `pnpm db:studio` | Open Prisma Studio |
| `pnpm db:migrate` | Run Prisma migrations |
| `pnpm lint` | Lint all packages |
| `pnpm check-types` | TypeScript type checking |

## License

MIT
